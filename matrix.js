// -----------------------------
// 행렬 변환 함수들
// -----------------------------

// 이동
function move(x, y) {
  return [
    [1, 0, x],
    [0, 1, y],
    [0, 0, 1],
  ];
}

// 회전
function rotateWithPivot(angleDeg, pivotX, pivotY) {
  const rad = (angleDeg * Math.PI) / 180;
  return [
    [
      Math.cos(rad),
      -Math.sin(rad),
      pivotX * (1 - Math.cos(rad)) - pivotY * Math.sin(rad),
    ],
    [
      Math.sin(rad),
      Math.cos(rad),
      pivotY * (1 - Math.cos(rad)) + pivotX * Math.sin(rad),
    ],
    [0, 0, 1],
  ];
}

// 스케일
function scaleWithPixedPoint(sx, sy, tx, ty) {
  return [
    [sx, 0, tx * (1 - sx)],
    [0, sy, ty * (1 - sy)],
    [0, 0, 1],
  ];
}

// 행렬 곱셈
function multiply(matrix1, matrix2) {
  const result = Array.from({ length: matrix1.length }, () =>
    Array(matrix2[0].length).fill(0)
  );

  for (let i = 0; i < matrix1.length; i++) {
    for (let j = 0; j < matrix2[0].length; j++) {
      for (let k = 0; k < matrix1[0].length; k++) {
        result[i][j] += matrix1[i][k] * matrix2[k][j];
      }
    }
  }
  return result;
}

// 행렬을 텍스트로 변환
function createMatrixText(matrix) {
  return matrix.map((row) => row.join(" ")).join("<br>");
}
