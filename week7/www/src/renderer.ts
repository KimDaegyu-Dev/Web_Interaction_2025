import { ALIVE_COLOR, CELL_SIZE } from "./constants";
import { combine, getRandomConsonant, getRandomVowel } from "./hangul";

export interface CellRenderer {
  (context: CanvasRenderingContext2D, row: number, col: number): void;
}

export interface CombinedCellRenderer {
  (
    context: CanvasRenderingContext2D,
    row: number,
    col: number,
    isConsonantAlive: boolean,
    isVowelAlive: boolean
  ): void;
}

export interface CombinedRendererWithPersistence {
  (
    context: CanvasRenderingContext2D,
    row: number,
    col: number,
    consonant: string | null,
    vowel: string | null,
    syllable: string | null
  ): void;
}

const HANGUL_CHARS = "가나다라마바사아자차카타파하";
const FONT = `${1}px "Noto Sans KR"`;
export const hangulRenderer: CellRenderer = (ctx, row, col) => {
  const char = HANGUL_CHARS[Math.floor(Math.random() * HANGUL_CHARS.length)];
  ctx.fillStyle = ALIVE_COLOR[Math.floor(Math.random() * 3)];
  ctx.font = FONT;
  ctx.textBaseline = "top";
  ctx.fillText(char, col * (CELL_SIZE + 1), row * (CELL_SIZE + 1));
};

export const circleRenderer: CellRenderer = (ctx, row, col) => {
  ctx.fillStyle = ALIVE_COLOR[Math.floor(Math.random() * 3)];
  ctx.beginPath();
  const radius = CELL_SIZE / 2;
  ctx.arc(
    col * (CELL_SIZE + 1) + radius,
    row * (CELL_SIZE + 1) + radius,
    radius,
    0,
    Math.PI * 2
  );
  ctx.fill();
};

export const combinedRenderer: CombinedCellRenderer = (
  ctx,
  row,
  col,
  isConsonantAlive,
  isVowelAlive
) => {
  const x = col * (CELL_SIZE + 1);
  const y = row * (CELL_SIZE + 1);
  ctx.font = FONT;
  ctx.textBaseline = "top";

  if (isConsonantAlive && isVowelAlive) {
    const consonant = getRandomConsonant();
    const vowel = getRandomVowel();
    const syllable = combine(consonant, vowel);
    ctx.fillStyle = "black";
    ctx.fillText(syllable, x, y);
  } else if (isConsonantAlive) {
    const consonant = getRandomConsonant();
    ctx.fillStyle = "blue";
    ctx.fillText(consonant, x, y);
  } else if (isVowelAlive) {
    const vowel = getRandomVowel();
    ctx.fillStyle = "red";
    ctx.fillText(vowel, x, y);
  }
};

export const combinedRendererWithPersistence: CombinedRendererWithPersistence =
  (ctx, row, col, consonant, vowel, syllable) => {
    const x = col * (CELL_SIZE + 1);
    const y = row * (CELL_SIZE + 1);
    ctx.font = FONT;
    ctx.textBaseline = "top";

    if (syllable) {
      ctx.fillStyle = "black";
      ctx.fillText(syllable, x, y);
    } else if (consonant) {
      ctx.fillStyle = "blue";
      ctx.fillText(consonant, x, y);
    } else if (vowel) {
      ctx.fillStyle = "red";
      ctx.fillText(vowel, x, y);
    }
  };
