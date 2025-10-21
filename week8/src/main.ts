import { SelfieSegmentation, Results } from "@mediapipe/selfie_segmentation";
import { World } from "../pkg/game_of_life";
import { memory } from "../pkg/game_of_life_bg.wasm";
import { CELL_SIZE, frameDuration } from "./constants";
import { updateHangulSetOnWasm } from "./hangul";
import { getWebcamStream, getVideoStream, startMediaSource } from "./camera";
import { initializeSelfieSegmentation } from "./segmentation";
import { updateAndDrawWorld } from "./drawing";

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

    this.selfieSegmentation = initializeSelfieSegmentation(
      (results: Results) => {
        this.segmentationMask = results.segmentationMask;
      }
    );
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
      .addEventListener("click", async () => {
        await startMediaSource(this.video, getWebcamStream());
        if (!this.isProcessing) {
          this.isProcessing = true;
          this.startFrameProcessing();
        }
      });
    document.getElementById("videoBtn")!.addEventListener("click", async () => {
      await startMediaSource(this.video, getVideoStream(this.video));
      if (!this.isProcessing) {
        this.isProcessing = true;
        this.startFrameProcessing();
      }
    });
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
        updateAndDrawWorld(
          this.world,
          this.segmentationMask,
          this.currentMode,
          this.ctx,
          this.video,
          this.showVideoBackground
        );
      }
    }
    requestAnimationFrame(() => this.processFrame());
  }

  public async initialize() {
    this.setupDOMAndWorld();
    this.setupEventListeners();
    this.startFrameProcessing();
  }
}

async function main() {
  const app = new App();
  await app.initialize();
}

main().catch(console.error);
