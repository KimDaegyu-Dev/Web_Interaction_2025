import { SelfieSegmentation, Results } from "@mediapipe/selfie_segmentation";
import { World } from "../pkg/game_of_life";
import { memory } from "../pkg/game_of_life_bg.wasm";
import { CELL_SIZE, frameDuration } from "./constants";

// --------------------------------------------------
// 🔹 Constants
// --------------------------------------------------

const ALL_INITIAL_CONSONANTS = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];
const ALL_MEDIAL_VOWELS = [
  "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ",
];
const FINAL_CONSONANTS_ARRAY = [
  "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];


/**
 * Main application class to encapsulate the logic for the selfie segmentation
 * and Game of Life visualization.
 */
class App {
  // --------------------------------------------------
  // 🔹 DOM Elements
  // --------------------------------------------------
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private hangulInput: HTMLInputElement;
  private modeSelect: HTMLSelectElement;
  private videoBgToggle: HTMLInputElement;

  // --------------------------------------------------
  // 🔹 State
  // --------------------------------------------------
  private world!: World;
  private segmentationMask?: ImageBitmap;
  private wasmMemory: WebAssembly.Memory;
  private lastTime = 0;
  private isProcessing = false;
  private currentMode: string = "random";
  private showVideoBackground = false;

  // --------------------------------------------------
  // 🔹 Modules
  // --------------------------------------------------
  private selfieSegmentation: SelfieSegmentation;

  constructor() {
    this.video = document.getElementById("inputVideo") as HTMLVideoElement;
    this.canvas = document.getElementById(
      "game-of-life-canvas"
    ) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.hangulInput = document.getElementById("hangul-input") as HTMLInputElement;
    this.modeSelect = document.getElementById("mode-select") as HTMLSelectElement;
    this.videoBgToggle = document.getElementById("video-bg-toggle") as HTMLInputElement;

    this.wasmMemory = memory;

    this.selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });
  }

  /**
   * Initializes the application, sets up modules, DOM, and event listeners.
   */
  public async initialize() {
    this.setupSelfieSegmentation();
    this.setupDOMAndWorld();
    this.setupEventListeners();
    this.updateHangulSetOnWasm(this.hangulInput.value);
  }

  // --------------------------------------------------
  // 🔹 Setup Methods
  // --------------------------------------------------

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
    this.canvas.style.width = `${docWidth}px`;
    this.canvas.style.height = `${docHeight}px`;

    const worldWidth = Math.floor(docWidth / (CELL_SIZE + 1));
    const worldHeight = Math.floor(docHeight / (CELL_SIZE + 1));

    this.world = new World(worldWidth, worldHeight);
  }

  private setupEventListeners() {
    window.addEventListener("resize", () => this.handleResize());

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
    document.getElementById("apply-hangul")!.addEventListener("click", () => {
        this.updateHangulSetOnWasm(this.hangulInput.value)
    });
    this.modeSelect.addEventListener("change", (e) => {
        this.currentMode = (e.target as HTMLSelectElement).value;
    });
    this.videoBgToggle.addEventListener("change", (e) => {
        this.showVideoBackground = (e.target as HTMLInputElement).checked;
    });
  }

  private handleResize() {
    this.setupDOMAndWorld();
  }

  private updateHangulSetOnWasm(text: string) {
    if (!text.trim()) {
      this.world.update_char_sets([], []);
      return;
    }
  
    const HANGUL_BASE_CODE = 44032;
    const HANGUL_END_CODE = 55203;
    const INITIAL_CONSONANT_MULTIPLIER = 588;
    const MEDIAL_VOWEL_MULTIPLIER = 28;
  
    const foundConsonants = new Set<string>();
    const foundVowels = new Set<string>();
  
    for (const char of text) {
      const code = char.charCodeAt(0);
  
      if (code >= HANGUL_BASE_CODE && code <= HANGUL_END_CODE) {
        const relativeCode = code - HANGUL_BASE_CODE;
  
        const initialIndex = Math.floor(
          relativeCode / INITIAL_CONSONANT_MULTIPLIER
        );
        foundConsonants.add(ALL_INITIAL_CONSONANTS[initialIndex]);
  
        const medialIndex = Math.floor(
          (relativeCode % INITIAL_CONSONANT_MULTIPLIER) / MEDIAL_VOWEL_MULTIPLIER
        );
        foundVowels.add(ALL_MEDIAL_VOWELS[medialIndex]);
  
        const finalIndex = relativeCode % MEDIAL_VOWEL_MULTIPLIER;
        if (finalIndex > 0) {
          const finalConsonant = FINAL_CONSONANTS_ARRAY[finalIndex];
          switch (finalConsonant) {
            case "ㄳ":
              foundConsonants.add("ㄱ");
              foundConsonants.add("ㅅ");
              break;
            case "ㄵ":
              foundConsonants.add("ㄴ");
              foundConsonants.add("ㅈ");
              break;
            case "ㄶ":
              foundConsonants.add("ㄴ");
              foundConsonants.add("ㅎ");
              break;
            case "ㄺ":
              foundConsonants.add("ㄹ");
              foundConsonants.add("ㄱ");
              break;
            case "ㄻ":
              foundConsonants.add("ㄹ");
              foundConsonants.add("ㅁ");
              break;
            case "ㄼ":
              foundConsonants.add("ㄹ");
              foundConsonants.add("ㅂ");
              break;
            case "ㄽ":
              foundConsonants.add("ㄹ");
              foundConsonants.add("ㅅ");
              break;
            case "ㄾ":
              foundConsonants.add("ㄹ");
              foundConsonants.add("ㅌ");
              break;
            case "ㄿ":
              foundConsonants.add("ㄹ");
              foundConsonants.add("ㅍ");
              break;
            case "ㅀ":
              foundConsonants.add("ㄹ");
              foundConsonants.add("ㅎ");
              break;
            case "ㅄ":
              foundConsonants.add("ㅂ");
              foundConsonants.add("ㅅ");
              break;
            default:
              foundConsonants.add(finalConsonant);
          }
        }
      } else if (ALL_INITIAL_CONSONANTS.includes(char)) {
        foundConsonants.add(char);
      } else if (ALL_MEDIAL_VOWELS.includes(char)) {
        foundVowels.add(char);
      }
    }
  
    this.world.update_char_sets(Array.from(foundConsonants), Array.from(foundVowels));
  }

  // --------------------------------------------------
  // 🔹 Media Handling
  // --------------------------------------------------

  private async getWebcamStream(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
    });
  }

  private async getVideoStream(): Promise<string> {
    const url = "./sample.mp4";
    this.video.crossOrigin = "anonymous";
    return Promise.resolve(url);
  }

  private async startMediaSource(mediaPromise: Promise<MediaStream | string>) {
    try {
      const media = await mediaPromise;
      if (typeof media === "string") {
        this.video.src = media;
      } else {
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

  // --------------------------------------------------
  // 🔹 Main Loop
  // --------------------------------------------------

  private startFrameProcessing() {
    requestAnimationFrame(() => this.processFrame());
  }

  private async processFrame() {
    if (!this.isProcessing) return;

    const now = performance.now();
    const elapsed = now - this.lastTime;

    if (elapsed >= frameDuration) {
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

  // --------------------------------------------------
  // 🔹 World Update and Drawing
  // --------------------------------------------------

  private createOffscreenCanvas(
    width: number,
    height: number
  ): HTMLCanvasElement | OffscreenCanvas {
    if ("OffscreenCanvas" in window) {
      return new OffscreenCanvas(width, height);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  private updateAndDrawWorld() {
    const worldWidth = this.world.width();
    const worldHeight = this.world.height();

    const maskCanvas = this.createOffscreenCanvas(worldWidth, worldHeight);
    const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true })!;
    maskCtx.imageSmoothingEnabled = false;
    maskCtx.drawImage(
      this.segmentationMask!,
      0,
      0,
      maskCanvas.width,
      maskCanvas.height
    );
    const maskImageData = maskCtx.getImageData(
      0,
      0,
      maskCanvas.width,
      maskCanvas.height
    );
    const maskPixels = maskImageData.data;

    const silhouetteGrid = new Uint8Array(worldWidth * worldHeight);
    for (let p = 0, i = 0; i < maskPixels.length; i += 4, p++) {
      if (maskPixels[i] > 128) silhouetteGrid[p] = 1;
    }

    const consonantGrid = new Uint16Array(
      this.wasmMemory.buffer,
      this.world.get_consonant_grid_ptr(),
      worldWidth * worldHeight
    );
    const vowelGrid = new Uint16Array(
      this.wasmMemory.buffer,
      this.world.get_vowel_grid_ptr(),
      worldWidth * worldHeight
    );
    const syllableGrid = new Uint16Array(
      this.wasmMemory.buffer,
      this.world.get_syllable_grid_ptr(),
      worldWidth * worldHeight
    );
    this.world.tick("none"); 

    for (let i = 0; i < silhouetteGrid.length; i++) {
      const isCellAlive =
        consonantGrid[i] !== 0 || vowelGrid[i] !== 0 || syllableGrid[i] !== 0;
      const shouldBeAlive = silhouetteGrid[i] === 1;

      const row = Math.floor(i / worldWidth);
      const col = i % worldWidth;
      if (shouldBeAlive && !isCellAlive) {
        this.world.alive_cell(row, col, this.currentMode);
      }
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.showVideoBackground) {
        this.ctx.save();
        this.ctx.scale(-1, 1);
        this.ctx.translate(-this.canvas.width, 0);
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.ctx.font = `${CELL_SIZE}px "Noto Sans KR"`;
    this.ctx.fillStyle = "white";

    const drawGrid = (gridPtr: number) => {
      const cells = new Uint16Array(
        this.wasmMemory.buffer,
        gridPtr,
        worldWidth * worldHeight
      );

      for (let i = 0; i < cells.length; i++) {
        if (cells[i]) {
          const row = Math.floor(i / worldWidth);
          const col = i % worldWidth;
          const charCode = cells[i];
          const char = String.fromCharCode(charCode);
          this.ctx.fillText(
            char,
            col * (CELL_SIZE + 1) + 2,
            row * (CELL_SIZE + 1)
          );
        }
      }
    };

    if (this.currentMode === "consonant") {
      drawGrid(this.world.get_consonant_grid_ptr());
    } else if (this.currentMode === "vowel") {
      drawGrid(this.world.get_vowel_grid_ptr());
    } else if (this.currentMode === "random") {
      drawGrid(this.world.get_consonant_grid_ptr());
      drawGrid(this.world.get_vowel_grid_ptr());
      drawGrid(this.world.get_syllable_grid_ptr());
    }
  }
}

// --------------------------------------------------
// 🔹 Entry Point
// --------------------------------------------------
async function main() {
  const app = new App();
  await app.initialize();
}

main().catch(console.error);
