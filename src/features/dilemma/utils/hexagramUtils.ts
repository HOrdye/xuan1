import { Hexagram, Trigram } from '../types';

// 八卦数据
const TRIGRAMS: Trigram[] = [
  { name: '乾', symbol: '☰', lines: [1, 1, 1], meaning: '天' },
  { name: '兑', symbol: '☱', lines: [1, 1, 0], meaning: '泽' },
  { name: '离', symbol: '☲', lines: [1, 0, 1], meaning: '火' },
  { name: '震', symbol: '☳', lines: [1, 0, 0], meaning: '雷' },
  { name: '巽', symbol: '☴', lines: [0, 1, 1], meaning: '风' },
  { name: '坎', symbol: '☵', lines: [0, 1, 0], meaning: '水' },
  { name: '艮', symbol: '☶', lines: [0, 0, 1], meaning: '山' },
  { name: '坤', symbol: '☷', lines: [0, 0, 0], meaning: '地' }
];

// 六十四卦数据
const HEXAGRAMS: Hexagram[] = [
  {
    name: '乾',
    chineseName: '乾为天',
    symbol: '䷀',
    lines: [1, 1, 1, 1, 1, 1],
    meaning: '刚健中正，自强不息',
    judgment: '元亨利贞',
    lines_meaning: [
      '潜龙勿用',
      '见龙在田，利见大人',
      '君子终日乾乾，夕惕若，厉无咎',
      '或跃在渊，无咎',
      '飞龙在天，利见大人',
      '亢龙有悔'
    ],
    modernInterpretation: '表示事业、学业、工作等方面处于上升期，需要保持积极进取的态度。',
    careerAdvice: '事业处于上升期，适合积极进取，但要注意把握分寸。',
    relationshipAdvice: '感情发展顺利，但要注意不要过于强势。',
    healthAdvice: '身体强健，但要注意不要过度劳累。'
  },
  // ... 其他卦象数据 ...
];

// 计算三爻卦
export function calculateTrigram(value: number): Trigram {
  // 确保值在1-8之间
  const index = ((value - 1) % 8 + 8) % 8;
  return TRIGRAMS[index];
}

// 组合上下卦得到六爻卦
export function combineTrigrams(upper: Trigram, lower: Trigram): Hexagram {
  const lines = [...lower.lines, ...upper.lines];
  return findHexagram(lines);
}

// 根据六爻查找卦象
export function findHexagram(lines: number[]): Hexagram {
  // 将六爻转换为二进制字符串
  const binary = lines.join('');
  
  // 在六十四卦中查找匹配的卦象
  const hexagram = HEXAGRAMS.find(h => h.lines.join('') === binary);
  
  if (!hexagram) {
    throw new Error('找不到对应的卦象');
  }
  
  return hexagram;
}

// 随机数生成器
export class Random {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  nextInt(max: number): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return Math.floor((this.seed / 2147483647) * max);
  }
} 