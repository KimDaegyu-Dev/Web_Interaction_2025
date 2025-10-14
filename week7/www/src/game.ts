import { World } from "wasm-game-of-life";
import { CELL_SIZE, frameDuration } from "./constants";
import { drawCells, setupCanvas, speechModeSelect } from "./dom";
import { speak } from "./audio";

let world: World;
let animationId: number | null = null;
let lastTime = 0;

export const initGame = () => {
  const width = Math.floor(window.innerWidth / (CELL_SIZE + 1));
  const height = Math.floor(window.innerHeight / (CELL_SIZE + 1));
  
  world = new World(width, height);
  setupCanvas(width, height);
  
  drawCells(world);
};

const renderLoop = async () => {
  if (isPaused()) return;

  const now = performance.now();
  if (now - lastTime < frameDuration) {
      animationId = requestAnimationFrame(renderLoop);
      return;
  }
  lastTime = now;

  const syllablesToSpeak = world.tick(speechModeSelect.value);
  
  drawCells(world);

  if (syllablesToSpeak.length > 0) {
    await speak(syllablesToSpeak.join(" "));
  }

  if (!isPaused()) {
    animationId = requestAnimationFrame(renderLoop);
  }
};

export const isPaused = () => {
  return animationId === null;
};

export const play = () => {
  if (!isPaused()) return;
  animationId = 0; 
  renderLoop();
};

export const pause = () => {
  if (isPaused()) return;
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  animationId = null;
  window.speechSynthesis.cancel();
};

export const reset = () => {
    if (!isPaused()) {
        pause();
    }
    initGame();
}

export const getWorld = () => world;
