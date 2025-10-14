import { play, pause, isPaused, initGame, getWorld, reset } from "./game";
import {
  playPauseButton,
  canvas,
  drawCells,
  pitchSlider,
  pitchValue,
  rateSlider,
  rateValue,
} from "./dom";
import { initSpeech } from "./audio";
import { updateHangulSetOnWasm } from "./hangul";
import { CELL_SIZE } from "./constants";

initGame();
initSpeech();
playPauseButton.textContent = "▶";

playPauseButton.addEventListener("click", () => {
  if (isPaused()) {
    play();
    playPauseButton.textContent = "⏸";
  } else {
    pause();
    playPauseButton.textContent = "▶";
  }
});

const hangulInput = document.getElementById("hangul-input") as HTMLInputElement;
const applyHangulButton = document.getElementById(
  "apply-hangul"
) as HTMLButtonElement;
const brushSelect = document.getElementById(
  "brush-select"
) as HTMLSelectElement;
const modeSelect = document.getElementById("mode-select") as HTMLSelectElement;

applyHangulButton.addEventListener("click", () => {
  const text = hangulInput.value;
  // First, reset the game to get a fresh world instance.
  reset();
  // Then, get the new world and update its character set.
  const world = getWorld();
  updateHangulSetOnWasm(world, text);

  // Ensure the UI reflects the paused state after reset.
  if (!isPaused()) {
    pause();
  }
  playPauseButton.textContent = "▶";
});
const brushPatterns = {
  single: [{ row: 0, col: 0 }],
  blinker: [
    { row: 0, col: -1 },
    { row: 0, col: 0 },
    { row: 0, col: 1 },
  ],
  glider: [
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: -1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
  ],
  spear: [
    { row: -2, col: 0 },
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: -1 },
  ],
};

canvas.addEventListener("click", (event) => {
  const world = getWorld();
  const boundingRect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;

  const clickRow = Math.floor(canvasTop / (CELL_SIZE + 1));
  const clickCol = Math.floor(canvasLeft / (CELL_SIZE + 1));

  const selectedBrush = brushSelect.value as keyof typeof brushPatterns;
  const pattern = brushPatterns[selectedBrush];
  const selectedMode = modeSelect.value;
  const randomMode = Math.random() > 0.5;
  pattern.forEach((offset) => {
    const row = (clickRow + offset.row + world.height()) % world.height();
    const col = (clickCol + offset.col + world.width()) % world.width();
    world.toggle_cell(
      row,
      col,
      selectedMode === "random"
        ? randomMode
          ? "consonant"
          : "vowel"
        : selectedMode
    );
  });

  // Draw immediately for responsiveness, without waiting for the next tick.
  drawCells(world);
});

window.addEventListener("resize", () => {
  reset();
});

pitchSlider.addEventListener("input", () => {
  pitchValue.textContent = parseFloat(pitchSlider.value).toFixed(1);
});

rateSlider.addEventListener("input", () => {
  rateValue.textContent = parseFloat(rateSlider.value).toFixed(1);
});
