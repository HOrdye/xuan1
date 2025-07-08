import { Hexagram, Trigram } from '../types';

// 八卦数据
const TRIGRAMS: Trigram[] = [
  { name: '乾', chineseName: '乾', symbol: '☰', lines: [1, 1, 1], meaning: '天', nature: '天', attribute: '刚健' },
  { name: '兑', chineseName: '兑', symbol: '☱', lines: [1, 1, 0], meaning: '泽', nature: '泽', attribute: '喜悦' },
  { name: '离', chineseName: '离', symbol: '☲', lines: [1, 0, 1], meaning: '火', nature: '火', attribute: '明亮' },
  { name: '震', chineseName: '震', symbol: '☳', lines: [1, 0, 0], meaning: '雷', nature: '雷', attribute: '运动' },
  { name: '巽', chineseName: '巽', symbol: '☴', lines: [0, 1, 1], meaning: '风', nature: '风', attribute: '入' },
  { name: '坎', chineseName: '坎', symbol: '☵', lines: [0, 1, 0], meaning: '水', nature: '水', attribute: '险陷' },
  { name: '艮', chineseName: '艮', symbol: '☶', lines: [0, 0, 1], meaning: '山', nature: '山', attribute: '笃实' },
  { name: '坤', chineseName: '坤', symbol: '☷', lines: [0, 0, 0], meaning: '地', nature: '地', attribute: '柔顺' }
];

// 六十四卦数据
const HEXAGRAMS: Hexagram[] = [
  {
    number: 1,
    sequence: 1,
    name: '乾',
    symbol: '䷀',
    lines: [1, 1, 1, 1, 1, 1],
    meaning: '刚健中正，自强不息',
    judgment: '元亨利贞',
    yao_texts: [
      '潜龙勿用',
      '见龙在田，利见大人',
      '君子终日乾乾，夕惕若，厉无咎',
      '或跃在渊，无咎',
      '飞龙在天，利见大人',
      '亢龙有悔'
    ],
    trigrams: { upper: 'Heaven', lower: 'Heaven' },
    chineseName: '乾为天',
    modernInterpretation: '表示事业、学业、工作等方面处于上升期，需要保持积极进取的态度。'
  }
  // ... 其他卦象数据需要类似的修复 ...
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