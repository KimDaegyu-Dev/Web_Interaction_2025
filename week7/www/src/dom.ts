import { CELL_SIZE, GRID_COLOR } from "./constants";
import { World } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/game_of_life_bg.wasm";

export const canvas = document.getElementById(
  "game-of-life-canvas"
) as HTMLCanvasElement;
export const playPauseButton = document.getElementById(
  "play-pause"
) as HTMLButtonElement;
export const speechModeSelect = document.getElementById(
  "speech-mode-select"
) as HTMLSelectElement;

export const pitchSlider = document.getElementById(
  "pitch-slider"
) as HTMLInputElement;
export const pitchValue = document.getElementById(
  "pitch-value"
) as HTMLSpanElement;
export const rateSlider = document.getElementById(
  "rate-slider"
) as HTMLInputElement;
export const rateValue = document.getElementById(
  "rate-value"
) as HTMLSpanElement;

let fontSizeGrid: number[];

export const setupCanvas = (width: number, height: number) => {
  canvas.height = (CELL_SIZE + 1) * height + 1;
  canvas.width = (CELL_SIZE + 1) * width + 1;
  // Initialize font size grid
  fontSizeGrid = new Array(width * height).fill(0);
};

const ctx = canvas.getContext("2d");

export const drawGrid = (width: number, height: number) => {
  if (!ctx) return;
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

export const drawCells = (world: World) => {
  if (!ctx) return;

  const width = world.width();
  const height = world.height();
  const size = width * height;

  // Get pointers to current grids
  const consonantPtr = world.get_consonant_grid_ptr();
  const vowelPtr = world.get_vowel_grid_ptr();
  const syllablePtr = world.get_syllable_grid_ptr();
  // Get pointers to previous grids
  const prevConsonantPtr = world.get_prev_consonant_grid_ptr();
  const prevVowelPtr = world.get_prev_vowel_grid_ptr();
  const prevSyllablePtr = world.get_prev_syllable_grid_ptr();

  // Create views on wasm memory
  const consonantGrid = new Uint16Array(memory.buffer, consonantPtr, size);
  const vowelGrid = new Uint16Array(memory.buffer, vowelPtr, size);
  const syllableGrid = new Uint16Array(memory.buffer, syllablePtr, size);
  const prevConsonantGrid = new Uint16Array(memory.buffer, prevConsonantPtr, size);
  const prevVowelGrid = new Uint16Array(memory.buffer, prevVowelPtr, size);
  const prevSyllableGrid = new Uint16Array(memory.buffer, prevSyllablePtr, size);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(width, height);

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  for (let i = 0; i < size; i++) {
    const row = Math.floor(i / width);
    const col = i % width;
    
    // Determine current and previous character codes for comparison
    const currentCharCode = syllableGrid[i] || consonantGrid[i] || vowelGrid[i];
    const prevCharCode = prevSyllableGrid[i] || prevConsonantGrid[i] || prevVowelGrid[i];

    if (currentCharCode !== 0) {
      // If cell is newly born or has changed, assign a new random font size
      if (currentCharCode !== prevCharCode) {
        const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
        const sizeVariation = CELL_SIZE * 0.5 * randomFactor; // Vary by up to 50%
        fontSizeGrid[i] = CELL_SIZE + sizeVariation;
      }

      const fontSize = fontSizeGrid[i] || CELL_SIZE; // Fallback to default size
      ctx.font = `${fontSize}px "Noto Sans KR"`;

      const char = String.fromCharCode(currentCharCode);
      const x = col * (CELL_SIZE + 1) + (CELL_SIZE / 2) + 1;
      const y = row * (CELL_SIZE + 1) + (CELL_SIZE / 2) + 1;

      if (syllableGrid[i] !== 0) {
        ctx.fillStyle = "black";
        ctx.fillText(char, x, y);
      } else if (consonantGrid[i] !== 0) {
        ctx.fillStyle = "blue";
        ctx.fillText(char, x, y);
      } else if (vowelGrid[i] !== 0) {
        ctx.fillStyle = "red";
        ctx.fillText(char, x, y);
      }
    }
  }
};