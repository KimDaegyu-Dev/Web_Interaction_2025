// life-synth-processor.ts

// Augment the global scope with AudioWorkletProcessor
declare const sampleRate: number;

interface LifeSynthConfig {
    stepDuration: number;
    baseFreq: number;
    liveGain: number;
    noiseGain: number;
}

interface LifeSynthFrameData {
    width: number;
    height: number;
    aliveCols: number[];
    rowLists: number[][];
    births: {
        count: number;
        panHint01: number;
    };
}

class LifeSynthProcessor extends AudioWorkletProcessor {
    sampleRate: number;
    stepDuration: number;
    baseFreq: number;
    scale: number[];
    liveGain: number;
    noiseGain: number;
    envSamples: number;
    gridWidth: number;
    gridHeight: number;
    aliveCols: number[];
    rowCounts: number[][];
    births: { count: number; panHint01: number; };
    phases: Map<number, number>;
    frameSampleIdx: number;
    noisePhase: number;
    noiseDecay: number;

    constructor() {
        super();
        this.sampleRate = sampleRate;
        this.stepDuration = 0.12;
        this.baseFreq = 110;
        this.scale = [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8, 2]; // just major
        this.liveGain = 0.02;
        this.noiseGain = 0.06;
        this.envSamples = Math.max(1, Math.floor(0.04 * this.sampleRate)); // 40ms AR

        this.gridWidth = 0;
        this.gridHeight = 0;
        this.aliveCols = [];
        this.rowCounts = [];
        this.births = { count: 0, panHint01: 0.5 };

        this.phases = new Map();
        this.frameSampleIdx = 0;
        this.noisePhase = 0;
        this.noiseDecay = 0.0;

        this.port.onmessage = (ev: MessageEvent) => {
            const msg = ev.data || {};
            if (msg.type === "config") {
                this.handleConfig(msg);
            } else if (msg.type === "frame") {
                this.handleFrameData(msg);
            }
        };
    }

    handleConfig(config: Partial<LifeSynthConfig>) {
        if (typeof config.stepDuration === "number") this.stepDuration = config.stepDuration;
        if (typeof config.baseFreq === "number") this.baseFreq = config.baseFreq;
        if (typeof config.liveGain === "number") this.liveGain = config.liveGain;
        if (typeof config.noiseGain === "number") this.noiseGain = config.noiseGain;
    }

    handleFrameData(data: LifeSynthFrameData) {
        this.gridWidth = data.width | 0;
        this.gridHeight = data.height | 0;
        this.aliveCols = data.aliveCols || [];
        this.rowCounts = data.rowLists || [];
        this.births = data.births || { count: 0, panHint01: 0.5 };

        this.frameSampleIdx = 0;
        this.noiseDecay = Math.min(1.0, (this.births.count || 0) / 50);
    }

    colToFreq(c: number): number {
        const deg = c % this.scale.length;
        const oct = Math.floor(c / this.scale.length);
        return this.baseFreq * (2 ** oct) * this.scale[deg];
    }

    rowToPan01(r: number): number {
        if (this.gridHeight <= 1) return 0.5;
        return Math.min(1, Math.max(0, r / (this.gridHeight - 1)));
    }

    process(_: Float32Array[][], outputs: Float32Array[][]): boolean {
        const output = outputs[0];
        const L = output[0];
        const R = output[1] || output[0];

        const stepSamples = Math.max(1, Math.floor(this.stepDuration * this.sampleRate));
        const envN = this.envSamples;

        for (let i = 0; i < L.length; i++) {
            let l = 0.0, r = 0.0;

            // --- 1) Tone synthesis ---
            for (let k = 0; k < this.aliveCols.length; k++) {
                const c = this.aliveCols[k] | 0;
                const freq = this.colToFreq(c);

                let ph = this.phases.get(c) || 0;
                ph += 2 * Math.PI * freq / this.sampleRate;
                if (ph > 1e12) ph = ph % (2 * Math.PI);
                this.phases.set(c, ph);

                const osc = Math.sin(ph);
                const rows = this.rowCounts[k] || [];
                const nRows = rows.length || 1;

                for (let j = 0; j < rows.length; j++) {
                    const pan = this.rowToPan01(rows[j]);
                    const ll = Math.cos(0.5 * Math.PI * pan);
                    const rr = Math.sin(0.5 * Math.PI * pan);
                    const gain = this.liveGain / nRows;
                    l += gain * osc * ll;
                    r += gain * osc * rr;
                }
            }

            // --- 2) Birth noise ---
            if (this.noiseDecay > 0.0001) {
                const n = (Math.random() * 2 - 1);
                const env = Math.exp(-8 * (this.frameSampleIdx / Math.max(1, stepSamples)));
                const pan = this.births.panHint01 ?? 0.5;
                const ll = Math.cos(0.5 * Math.PI * pan);
                const rr = Math.sin(0.5 * Math.PI * pan);
                const g = this.noiseGain * this.noiseDecay;
                l += g * n * env * ll;
                r += g * n * env * rr;
            }

            // --- 3) AR Envelope ---
            const t = this.frameSampleIdx;
            let env = 1.0;
            if (t < envN / 2) { // attack
                env = 0.5 * (1 - Math.cos(Math.PI * (t / (envN / 2))));
            } else if (t > stepSamples - envN / 2) { // release
                const tt = Math.max(0, t - (stepSamples - envN / 2));
                env = 0.5 * (1 + Math.cos(Math.PI * (tt / (envN / 2))));
            }

            L[i] = l * env;
            R[i] = r * env;

            this.frameSampleIdx++;
            if (this.frameSampleIdx >= stepSamples) {
                this.frameSampleIdx = stepSamples;
            }
        }

        return true;
    }
}

registerProcessor('life-synth-processor', LifeSynthProcessor);