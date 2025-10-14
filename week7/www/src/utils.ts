export const getIndex = (width: number, row: number, column: number): number => {
  return row * width + column;
};

export const bitIsSet = (n: number, arr: Uint8Array): boolean => {
  const byte = Math.floor(n / 8);
  const mask = 1 << (n % 8);
  return (arr[byte] & mask) === mask;
};
