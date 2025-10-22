import { World } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/game_of_life_bg.wasm";
import { CELL_SIZE } from "./constants";

function createOffscreenCanvas(width: number, height: number): OffscreenCanvas {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas as unknown as OffscreenCanvas;
}

function drawGrids(
  ctx: CanvasRenderingContext2D,
  world: World,
  video: HTMLVideoElement,
  showVideoBackground: boolean
) {
  const worldWidth = world.width();
  const worldHeight = world.height();
  const canvas = ctx.canvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (showVideoBackground) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    // 배경 영상이 꺼져있을 때도 검은 배경을 그려서 스크린샷이 제대로 찍히도록 함
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.font = `${CELL_SIZE}px "Grandiflora One"`;
  ctx.fillStyle = "white";

  const consonantPtr = world.get_consonant_grid_ptr();
  const vowelPtr = world.get_vowel_grid_ptr();
  const syllablePtr = world.get_syllable_grid_ptr();
  const consonantCells = new Uint16Array(
    memory.buffer,
    consonantPtr,
    worldWidth * worldHeight
  );
  const vowelCells = new Uint16Array(
    memory.buffer,
    vowelPtr,
    worldWidth * worldHeight
  );
  const syllableCells = new Uint16Array(
    memory.buffer,
    syllablePtr,
    worldWidth * worldHeight
  );

  for (let i = 0; i < syllableCells.length; i++) {
    const row = Math.floor(i / worldWidth);
    const col = i % worldWidth;
    const x = col * (CELL_SIZE + 1) + 2;
    const y = row * (CELL_SIZE + 1) + CELL_SIZE; // CELL_SIZE만큼 아래로 이동

    if (syllableCells[i] > 0) {
      ctx.fillText(String.fromCharCode(syllableCells[i]), x, y);
      continue;
    }
    if (consonantCells[i] > 0) {
      ctx.fillText(String.fromCharCode(consonantCells[i]), x, y);
    }
    if (vowelCells[i] > 0) {
      ctx.fillText(String.fromCharCode(vowelCells[i]), x, y);
    }
  }
}

function updateAndDrawWorld(
  world: World,
  segmentationMask: ImageBitmap,
  currentMode: string,
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  showVideoBackground: boolean
) {
  const worldWidth = world.width();
  const worldHeight = world.height();

  const maskCanvas = createOffscreenCanvas(worldWidth, worldHeight);
  const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true })!;
  maskCtx.drawImage(segmentationMask, 0, 0, worldWidth, worldHeight);
  const maskPixels = maskCtx.getImageData(0, 0, worldWidth, worldHeight).data;
  const silhouetteGrid = new Uint8Array(worldWidth * worldHeight);
  for (let p = 0, i = 0; i < maskPixels.length; i += 4, p++) {
    if (maskPixels[i] > 128) silhouetteGrid[p] = 1;
  }

  // Pass silhouette to wasm and let it handle evolution with special rules
  (world as any).tick(silhouetteGrid);

  // Nudge the world by seeding new cells inside the silhouette
  const consonantPtr = world.get_consonant_grid_ptr();
  const vowelPtr = world.get_vowel_grid_ptr();
  const syllablePtr = world.get_syllable_grid_ptr();
  const consonantCells = new Uint16Array(
    memory.buffer,
    consonantPtr,
    worldWidth * worldHeight
  );
  const vowelCells = new Uint16Array(
    memory.buffer,
    vowelPtr,
    worldWidth * worldHeight
  );
  const syllableCells = new Uint16Array(
    memory.buffer,
    syllablePtr,
    worldWidth * worldHeight
  );

  for (let i = 0; i < silhouetteGrid.length; i++) {
    const row = Math.floor(i / worldWidth);
    const col = i % worldWidth;
    const isCellAlive =
      consonantCells[i] !== 0 || vowelCells[i] !== 0 || syllableCells[i] !== 0;

    if (silhouetteGrid[i] === 1 && !isCellAlive) {
      world.alive_cell(row, col, currentMode);
    }
  }

  // Draw the final state of all grids
  drawGrids(ctx, world, video, showVideoBackground);
}

export { updateAndDrawWorld };
