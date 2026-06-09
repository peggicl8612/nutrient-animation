/** 將輸入字串轉為非負整數，自動去掉開頭多餘的 0（例：0020 → 20） */
export function parseIntInput(raw: string): number {
  const digits = raw.replace(/\D/g, '');
  if (digits === '') return 0;
  return parseInt(digits, 10);
}
