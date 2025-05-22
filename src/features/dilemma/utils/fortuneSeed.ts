// fortuneSeed.ts
// 玄选两难 - 卦象生成种子工具
// 收集用户输入、时间、操作行为，生成整数种子

export interface FortuneSeedInput {
  question: string;
  optionA: string;
  optionB: string;
  birthday?: string;
  clickTimestamp?: number; // 用户点击"开始占卜"时的时间戳
  pauseDuration?: number;  // 用户在输入后停顿的毫秒数
  extra?: string;          // 其他可选信息
}

/**
 * 生成种子字符串
 */
export function buildSeedString(input: FortuneSeedInput): string {
  return [
    input.question,
    input.optionA,
    input.optionB,
    input.birthday || '',
    input.clickTimestamp?.toString() || '',
    input.pauseDuration?.toString() || '',
    input.extra || ''
  ].join('|');
}

/**
 * FNV-1a 哈希算法，将字符串转为整数种子
 */
export function fnv1aHash(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash >>> 0);
}

/**
 * 生成最终种子
 */
export function generateFortuneSeed(input: FortuneSeedInput): number {
  const seedStr = buildSeedString(input);
  return fnv1aHash(seedStr);
} 