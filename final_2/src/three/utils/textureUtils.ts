import * as THREE from "three";

/**
 * 세로쓰기 텍스트 텍스처 옵션
 */
export interface VerticalTextTextureOptions {
  /** 텍스트 내용 */
  text: string;
  /** 폰트 크기 (기본: 56) */
  fontSize?: number;
  /** 텍스트 색상 (기본: #000000) */
  color?: string;
  /** 캔버스 너비 (기본: 512) */
  canvasWidth?: number;
  /** 캔버스 높이 (기본: 512) */
  canvasHeight?: number;
  /** 글자 세로 간격 (기본: 64) */
  charHeight?: number;
  /** 열 간격 (기본: 70) */
  columnWidth?: number;
  /** 폰트 패밀리 (기본: sans-serif) */
  fontFamily?: string;
  /** 폰트 굵기 (기본: bold) */
  fontWeight?: string;
  /** 최대 글자 수 */
  maxLength?: number;
}

/**
 * 세로쓰기 텍스트 텍스처 생성
 * 
 * 오른쪽 위에서 시작하여 아래로 글자를 배치하고,
 * 줄바꿈 시 왼쪽으로 열을 이동합니다 (전통적인 세로쓰기 방식).
 */
export function createVerticalTextTexture(
  options: VerticalTextTextureOptions
): THREE.CanvasTexture {
  const {
    text,
    fontSize = 56,
    color = "#000000",
    canvasWidth = 512,
    canvasHeight = 512,
    charHeight = 64,
    columnWidth = 70,
    fontFamily = "sans-serif",
    fontWeight = "bold",
    maxLength,
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D context를 생성할 수 없습니다.");
  }

  // 안티앨리어싱 활성화
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // 투명 배경
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 텍스트 스타일 설정
  ctx.fillStyle = color;
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // 텍스트 처리
  const displayText = maxLength ? text.slice(0, maxLength) : text;
  const maxCharsPerColumn = Math.floor((canvasHeight - 40) / charHeight);

  // 텍스트를 열 단위로 분리
  const columns: string[] = [];
  for (let i = 0; i < displayText.length; i += maxCharsPerColumn) {
    columns.push(displayText.slice(i, i + maxCharsPerColumn));
  }

  // 오른쪽 위에서 시작
  const startX = canvasWidth - columnWidth / 2 - 20;
  const startY = 40;

  // 각 열과 글자 렌더링
  columns.forEach((column, colIndex) => {
    const x = startX - colIndex * columnWidth;
    column.split("").forEach((char, charIndex) => {
      const y = startY + charIndex * charHeight + charHeight / 2;
      ctx.fillText(char, x, y);
    });
  });

  // 텍스처 생성
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  return texture;
}

/**
 * 일반 텍스트 텍스처 옵션
 */
export interface TextTextureOptions {
  /** 텍스트 내용 */
  text: string;
  /** 폰트 크기 (기본: 48) */
  fontSize?: number;
  /** 텍스트 색상 (기본: #000000) */
  color?: string;
  /** 캔버스 너비 (기본: 512) */
  canvasWidth?: number;
  /** 캔버스 높이 (기본: 128) */
  canvasHeight?: number;
  /** 폰트 패밀리 (기본: sans-serif) */
  fontFamily?: string;
  /** 폰트 굵기 (기본: bold) */
  fontWeight?: string;
  /** 텍스트 정렬 (기본: center) */
  textAlign?: CanvasTextAlign;
}

/**
 * 일반 텍스트 텍스처 생성 (가로쓰기)
 */
export function createTextTexture(
  options: TextTextureOptions
): THREE.CanvasTexture {
  const {
    text,
    fontSize = 48,
    color = "#000000",
    canvasWidth = 512,
    canvasHeight = 128,
    fontFamily = "sans-serif",
    fontWeight = "bold",
    textAlign = "center",
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D context를 생성할 수 없습니다.");
  }

  // 안티앨리어싱 활성화
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // 투명 배경
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 텍스트 스타일 설정
  ctx.fillStyle = color;
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = textAlign;
  ctx.textBaseline = "middle";

  // 텍스트 렌더링
  const x = textAlign === "center" ? canvasWidth / 2 : textAlign === "left" ? 20 : canvasWidth - 20;
  ctx.fillText(text, x, canvasHeight / 2);

  // 텍스처 생성
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  return texture;
}

/**
 * 이미지 텍스처 로드 (투영용)
 */
export async function loadProjectionTexture(
  url: string
): Promise<THREE.Texture> {
  const loader = new THREE.TextureLoader();
  
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        resolve(texture);
      },
      undefined,
      reject
    );
  });
}
