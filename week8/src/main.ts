import { SelfieSegmentation, Results } from "@mediapipe/selfie_segmentation";
import { World } from "../pkg/game_of_life";
import { memory } from "../pkg/game_of_life_bg.wasm";
import { CELL_SIZE, frameDuration } from "./constants";

// --- HANGUL PARSING (Simplified for Consonant/Vowel) ---
const ALL_INITIAL_CONSONANTS = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
const ALL_MEDIAL_VOWELS = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅠ",
  "ㅡ",
  "ㅢ",
  "ㅣ",
];
const ALL_FINAL_CONSONANTS = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

function updateHangulSetOnWasm(world: World, text: string) {
  if (!text.trim()) {
    world.update_char_sets([], []);
    return;
  }

  const HANGUL_BASE_CODE = 44032;
  const HANGUL_END_CODE = 55203;
  const INITIAL_MULTIPLIER = 588;
  const MEDIAL_MULTIPLIER = 28;

  const foundConsonants = new Set<string>();
  const foundVowels = new Set<string>();

  for (const char of text) {
    const code = char.charCodeAt(0);

    if (code >= HANGUL_BASE_CODE && code <= HANGUL_END_CODE) {
      const relativeCode = code - HANGUL_BASE_CODE;
      const initialIndex = Math.floor(relativeCode / INITIAL_MULTIPLIER);
      foundConsonants.add(ALL_INITIAL_CONSONANTS[initialIndex]);

      const medialIndex = Math.floor(
        (relativeCode % INITIAL_MULTIPLIER) / MEDIAL_MULTIPLIER
      );
      foundVowels.add(ALL_MEDIAL_VOWELS[medialIndex]);

      const finalIndex = relativeCode % MEDIAL_MULTIPLIER;
      if (finalIndex > 0) {
        foundConsonants.add(ALL_FINAL_CONSONANTS[finalIndex]);
      }
    } else if (ALL_INITIAL_CONSONANTS.includes(char)) {
      foundConsonants.add(char);
    } else if (ALL_MEDIAL_VOWELS.includes(char)) {
      foundVowels.add(char);
    }
  }

  world.update_char_sets(Array.from(foundConsonants), Array.from(foundVowels));
}

// --- MAIN APP CLASS ---
class App {
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private hangulInput: HTMLInputElement;
  private modeSelect: HTMLSelectElement;
  private videoBgToggle: HTMLInputElement;

  private world!: World;
  private segmentationMask?: ImageBitmap;
  private wasmMemory: WebAssembly.Memory;
  private lastTime = 0;
  private isProcessing = false;
  private currentMode: string = "random";
  private showVideoBackground = false;

  private selfieSegmentation: SelfieSegmentation;

  constructor() {
    this.video = document.getElementById("inputVideo") as HTMLVideoElement;
    this.canvas = document.getElementById(
      "game-of-life-canvas"
    ) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.hangulInput = document.getElementById(
      "hangul-input"
    ) as HTMLInputElement;
    this.modeSelect = document.getElementById(
      "mode-select"
    ) as HTMLSelectElement;
    this.videoBgToggle = document.getElementById(
      "video-bg-toggle"
    ) as HTMLInputElement;
    this.wasmMemory = memory;

    this.selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });
  }

  public async initialize() {
    this.setupSelfieSegmentation();
    this.setupDOMAndWorld();
    this.setupEventListeners();
  }

  private setupSelfieSegmentation() {
    this.selfieSegmentation.setOptions({ modelSelection: 1, selfieMode: true });
    this.selfieSegmentation.onResults((results: Results) => {
      this.segmentationMask = results.segmentationMask;
    });
  }

  private setupDOMAndWorld() {
    const docWidth = document.documentElement.clientWidth;
    const docHeight = document.documentElement.clientHeight;
    this.canvas.width = docWidth;
    this.canvas.height = docHeight;

    const worldWidth = Math.floor(docWidth / (CELL_SIZE + 1));
    const worldHeight = Math.floor(docHeight / (CELL_SIZE + 1));

    this.world = new World(worldWidth, worldHeight);
    updateHangulSetOnWasm(this.world, this.hangulInput.value);
  }

  private setupEventListeners() {
    window.addEventListener("resize", () => this.setupDOMAndWorld());
    document
      .getElementById("webcamBtn")!
      .addEventListener("click", () =>
        this.startMediaSource(this.getWebcamStream())
      );
    document
      .getElementById("videoBtn")!
      .addEventListener("click", () =>
        this.startMediaSource(this.getVideoStream())
      );
    document
      .getElementById("apply-hangul")!
      .addEventListener("click", () =>
        updateHangulSetOnWasm(this.world, this.hangulInput.value)
      );
    this.modeSelect.addEventListener("change", (e) => {
      this.currentMode = (e.target as HTMLSelectElement).value;
    });
    this.videoBgToggle.addEventListener("change", (e) => {
      this.showVideoBackground = (e.target as HTMLInputElement).checked;
    });
  }

  private async getWebcamStream(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
    });
  }
  private async getVideoStream(): Promise<string> {
    this.video.src = "./sample.mp4";
    this.video.crossOrigin = "anonymous";
    return Promise.resolve("./sample.mp4");
  }

  private async startMediaSource(mediaPromise: Promise<MediaStream | string>) {
    try {
      const media = await mediaPromise;
      if (typeof media !== "string") {
        this.video.srcObject = media;
      }
      await this.video.play();
      if (!this.isProcessing) {
        this.isProcessing = true;
        this.startFrameProcessing();
      }
    } catch (error) {
      console.error("Failed to start media source:", error);
    }
  }

  private startFrameProcessing() {
    requestAnimationFrame(() => this.processFrame());
  }

  private async processFrame() {
    if (!this.isProcessing) return;
    const now = performance.now();
    if (now - this.lastTime >= frameDuration) {
      this.lastTime = now;
      if (this.video.readyState >= 2) {
        await this.selfieSegmentation.send({ image: this.video });
      }
      if (this.world && this.segmentationMask) {
        this.updateAndDrawWorld();
      }
    }
    requestAnimationFrame(() => this.processFrame());
  }

  private createOffscreenCanvas(
    width: number,
    height: number
  ): OffscreenCanvas {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas as unknown as OffscreenCanvas;
  }

  private updateAndDrawWorld() {
    const worldWidth = this.world.width();
    const worldHeight = this.world.height();

    const maskCanvas = this.createOffscreenCanvas(worldWidth, worldHeight);
    const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true })!;
    maskCtx.drawImage(this.segmentationMask!, 0, 0, worldWidth, worldHeight);
    const maskPixels = maskCtx.getImageData(0, 0, worldWidth, worldHeight).data;
    const silhouetteGrid = new Uint8Array(worldWidth * worldHeight);
    for (let p = 0, i = 0; i < maskPixels.length; i += 4, p++) {
      if (maskPixels[i] > 128) silhouetteGrid[p] = 1;
    }

    // Pass silhouette to wasm and let it handle evolution with special rules
    (this.world as any).tick(silhouetteGrid);

    // Nudge the world by seeding new cells inside the silhouette
    const consonantPtr = this.world.get_consonant_grid_ptr();
    const vowelPtr = this.world.get_vowel_grid_ptr();
    const syllablePtr = this.world.get_syllable_grid_ptr();
    const consonantCells = new Uint16Array(
      this.wasmMemory.buffer,
      consonantPtr,
      worldWidth * worldHeight
    );
    const vowelCells = new Uint16Array(
      this.wasmMemory.buffer,
      vowelPtr,
      worldWidth * worldHeight
    );
    const syllableCells = new Uint16Array(
      this.wasmMemory.buffer,
      syllablePtr,
      worldWidth * worldHeight
    );

    for (let i = 0; i < silhouetteGrid.length; i++) {
      const row = Math.floor(i / worldWidth);
      const col = i % worldWidth;
      const isCellAlive =
        consonantCells[i] !== 0 ||
        vowelCells[i] !== 0 ||
        syllableCells[i] !== 0;

      if (silhouetteGrid[i] === 1 && !isCellAlive) {
        this.world.alive_cell(row, col, this.currentMode);
      }
    }

    // Draw the final state of all grids
    this.drawGrids(worldWidth, worldHeight);
  }

  private drawGrids(worldWidth: number, worldHeight: number) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.showVideoBackground) {
      this.ctx.save();
      this.ctx.scale(-1, 1);
      this.ctx.translate(-this.canvas.width, 0);
      this.ctx.drawImage(
        this.video,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.ctx.restore();
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.ctx.font = `${CELL_SIZE}px "Noto Sans KR"`;
    this.ctx.fillStyle = "white";

    const consonantPtr = this.world.get_consonant_grid_ptr();
    const vowelPtr = this.world.get_vowel_grid_ptr();
    const syllablePtr = this.world.get_syllable_grid_ptr();
    const consonantCells = new Uint16Array(
      this.wasmMemory.buffer,
      consonantPtr,
      worldWidth * worldHeight
    );
    const vowelCells = new Uint16Array(
      this.wasmMemory.buffer,
      vowelPtr,
      worldWidth * worldHeight
    );
    const syllableCells = new Uint16Array(
      this.wasmMemory.buffer,
      syllablePtr,
      worldWidth * worldHeight
    );

    for (let i = 0; i < syllableCells.length; i++) {
      const row = Math.floor(i / worldWidth);
      const col = i % worldWidth;
      const x = col * (CELL_SIZE + 1) + 2;
      const y = row * (CELL_SIZE + 1);

      if (syllableCells[i] > 0) {
        this.ctx.fillText(String.fromCharCode(syllableCells[i]), x, y);
        continue;
      }
      if (consonantCells[i] > 0) {
        this.ctx.fillText(String.fromCharCode(consonantCells[i]), x, y);
      }
      if (vowelCells[i] > 0) {
        this.ctx.fillText(String.fromCharCode(vowelCells[i]), x, y);
      }
    }
  }
}

async function main() {
  const app = new App();
  await app.initialize();
}

main().catch(console.error);
