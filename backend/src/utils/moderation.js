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

// Topics clearly unrelated to herbs, plants, or health
const OFF_TOPIC_PATTERNS = [
  /what is (a )?computer/i,
  /how to (code|program|hack)/i,
  /\b(javascript|python|react|html|css|sql|coding)\b/i,
  /\b(movie|film|actor|actress|celebrity|singer|song|music)\b/i,
  /\b(football|cricket|basketball|sports|match|game|player)\b/i,
  /\b(politics|election|president|prime minister|government|party)\b/i,
  /\b(stock|crypto|bitcoin|investment|forex|trading)\b/i,
  /\b(recipe|cook|bake|food|restaurant)\b(?!.*herb)/i,
  /\b(weather|temperature|forecast|climate)\b/i,
  /\b(math|algebra|calculus|geometry|equation)\b/i,
  /\b(history|geography|science|physics|chemistry)\b(?!.*plant|.*herb)/i,
];

export function isUnsafeContent(text) {
  if (!text || typeof text !== "string") return false;

  return BLOCKED_PATTERNS.some((pattern) => pattern.test(text));
}

export function isOffTopic(text) {
  if (!text || typeof text !== "string") return false;

  return OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(text));
}
