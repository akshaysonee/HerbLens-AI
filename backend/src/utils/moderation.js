const BLOCKED_PATTERNS = [
  /kill/i,
  /poison/i,
  /harm someone/i,
  /how to make (a )?drug/i,
  /extract drug/i,
  /suicide/i,
  /self harm/i,
  /bomb/i,
  /weapon/i,
  /illegal/i,
  /overdose/i,
  /toxic dose/i,
];

export function isUnsafeContent(text) {
  if (!text || typeof text !== "string") return false;

  return BLOCKED_PATTERNS.some((pattern) => pattern.test(text));
}
