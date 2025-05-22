/**
 * 六十四卦占卜方法实现
 * 包括铜钱占卜法、梅花易数和随机起卦法
 */

import { Hexagram, Trigram, AnalysisResult, DivinationMethod, CoinResult, PlumBlossomResult, SixCoinsResult, PlumBlossomParams } from '../types';
import { generateHexagram } from './hexagramGenerator';
import { loadAllHexagrams } from './loadHexagrams';
import { Random } from '../utils/Random';

// 八卦数据（先天八卦数列）
const TRIGRAMS: Trigram[] = [
  {
    name: 'Heaven',
    chineseName: '乾',
    symbol: '☰',
    lines: [1, 1, 1],
    meaning: '象征天，代表刚健、创造、积极进取。',
    nature: '天',
    attribute: '刚健'
  },
  {
    name: 'Lake',
    chineseName: '兑',
    symbol: '☱',
    lines: [1, 1, 0],
    meaning: '象征泽，代表喜悦、交流、柔顺。',
    nature: '泽',
    attribute: '喜悦'
  },
  {
    name: 'Fire',
    chineseName: '离',
    symbol: '☲',
    lines: [1, 0, 1],
    meaning: '象征火，代表明丽、依附、文明。',
    nature: '火',
    attribute: '明丽'
  },
  {
    name: 'Thunder',
    chineseName: '震',
    symbol: '☳',
    lines: [1, 0, 0],
    meaning: '象征雷，代表行动、激发、奋进。',
    nature: '雷',
    attribute: '动'
  },
  {
    name: 'Wind',
    chineseName: '巽',
    symbol: '☴',
    lines: [0, 1, 1],
    meaning: '象征风，代表渗透、顺从、进取。',
    nature: '风',
    attribute: '入'
  },
  {
    name: 'Water',
    chineseName: '坎',
    symbol: '☵',
    lines: [0, 1, 0],
    meaning: '象征水，代表险阻、智慧、流动。',
    nature: '水',
    attribute: '陷'
  },
  {
    name: 'Mountain',
    chineseName: '艮',
    symbol: '☶',
    lines: [0, 0, 1],
    meaning: '象征山，代表静止、止步、稳重。',
    nature: '山',
    attribute: '止'
  },
  {
    name: 'Earth',
    chineseName: '坤',
    symbol: '☷',
    lines: [0, 0, 0],
    meaning: '象征地，代表顺从、包容、承载。',
    nature: '地',
    attribute: '顺'
  }
];

// 存储加载的卦象数据
let hexagramsData: Hexagram[] = [];
let isDataLoaded = false;
let dataLoadingPromise: Promise<void> | null = null;

/**
 * 确保数据已加载
 */
export async function ensureDivinationDataLoaded(): Promise<boolean> {
  if (isDataLoaded && hexagramsData.length > 0) return true;
  
  try {
    if (!dataLoadingPromise) {
      dataLoadingPromise = loadAllHexagrams()
        .then(data => {
          hexagramsData = data;
          isDataLoaded = true;
          console.log(`✅ 占卜模块: 成功加载 ${hexagramsData.length} 个卦象数据`);
        });
    }
    
    await dataLoadingPromise;
    return isDataLoaded;
  } catch (error) {
    console.error('占卜模块: 加载数据失败', error);
    return false;
  }
}

/**
 * 铜钱占卜法（以钱代蓍法）
 * 掷三枚铜钱，根据正反面确定一爻
 * 一背为阳爻(—)，两背为阴爻(--)，三背为老阳(O)，无背为老阴(X)
 */
export function coinDivination(): SixCoinsResult {
  const coins: CoinResult[] = [];
  const results: number[] = [];
  
  // 模拟真实的铜钱投掷，考虑铜钱重量和投掷方式
  for (let i = 0; i < 6; i++) {
    const coin1 = Math.random() < 0.55 ? 1 : 0; // 正面概率55%
    const coin2 = Math.random() < 0.55 ? 1 : 0;
    const coin3 = Math.random() < 0.55 ? 1 : 0;
    
    const sum = coin1 + coin2 + coin3;
    const value = sum === 3 ? 9 : sum === 2 ? 8 : sum === 1 ? 7 : 6;
    results.push(value);
    
    // 组装CoinResult
    coins.push({
      headsCount: coin1 + coin2 + coin3,
      value: {
        line: value % 2,
        changing: value === 6 || value === 9
      },
      display: value === 9 ? 'O' : value === 6 ? 'X' : value % 2 === 1 ? '—' : '--'
    });
  }

  // 修正：将6/7/8/9转换为0/1数组
  const lines = results.map(val => (val % 2 === 1 ? 1 : 0));

  return {
    coins,
    results,
    hexagram: calculateHexagram(lines)
  };
}

/**
 * 梅花易数法
 * 时间起卦或数字起卦
 */
export function plumBlossomDivination(params: PlumBlossomParams): PlumBlossomResult {
  let numbers: number[];
  
  if (params.method === 'time') {
    // 使用当前时间生成数字
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    
    // 传统梅花易数时间起卦法
    numbers = [
      (hour * 60 + minute) % 8 || 8,
      (minute * 60 + second) % 8 || 8
    ];
  } else {
    // 数字起卦
    numbers = params.numbers.map(n => {
      // 确保数字在1-8之间
      const num = Math.abs(n) % 8;
      return num === 0 ? 8 : num;
    });
  }
  
  // 计算卦象
  const upperTrigram = calculateTrigram(numbers[0], true);
  const lowerTrigram = calculateTrigram(numbers[1], false);
  
  return {
    numbers,
    upperTrigram,
    lowerTrigram,
    hexagram: combineTrigrams(upperTrigram, lowerTrigram)
  };
}

/**
 * 随机起卦法（简易现代法）
 */
export function randomDivination(question: string): AnalysisResult {
  // 根据问题内容生成随机种子
  const seed = question.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = new Random(seed);
  
  // 生成六爻
  const lines: number[] = [];
  const changingLines: number[] = [];
  
  for (let i = 0; i < 6; i++) {
    // 生成爻值（6-9）
    const value = random.nextInt(0, 3) + 6;
    lines.push(value % 2);
    
    // 判断是否为变爻（6或9）
    if (value === 6 || value === 9) {
      changingLines.push(i);
    }
  }
  
  // 计算本卦和变卦
  const hexagram = calculateHexagram(lines);
  const relatedHexagram = changingLines.length > 0 ? 
    calculateChangedHexagram(hexagram, changingLines) : null;
  
  return {
    hexagram,
    changingLines,
    relatedHexagram,
    analysis: generateAnalysis(hexagram, relatedHexagram, question)
  };
}

/**
 * 辅助函数：计算卦象
 */
function calculateHexagram(lines: number[]): Hexagram {
  // 将六爻转换为卦象
  const upperTrigram = lines.slice(3).join('');
  const lowerTrigram = lines.slice(0, 3).join('');
  
  // 查找对应的卦象
  const hexagram = findHexagramFromDatabase(lines);
  return hexagram;
}

/**
 * 辅助函数：计算变卦
 */
function calculateChangedHexagram(hexagram: Hexagram, changingLines: number[]): Hexagram {
  const newLines = [...hexagram.lines];
  
  // 变爻：阳变阴，阴变阳
  changingLines.forEach(line => {
    newLines[line] = newLines[line] === 1 ? 0 : 1;
  });
  
  return calculateHexagram(newLines);
}

/**
 * 辅助函数：生成分析结果
 */
function generateAnalysis(hexagram: Hexagram, relatedHexagram: Hexagram | null, question: string): string {
  let analysis = hexagram.meaning;
  
  if (relatedHexagram) {
    analysis += `\n变卦为${relatedHexagram.name}，表示${relatedHexagram.meaning}`;
  }
  
  // 根据问题内容调整分析
  if (question.includes('工作') || question.includes('事业')) {
    analysis += '\n在事业方面，' + hexagram.careerAdvice;
  } else if (question.includes('感情') || question.includes('婚姻')) {
    analysis += '\n在感情方面，' + hexagram.relationshipAdvice;
  } else if (question.includes('健康')) {
    analysis += '\n在健康方面，' + hexagram.healthAdvice;
  }
  
  return analysis;
}

/**
 * 从数据库中查找卦象
 */
function findHexagramFromDatabase(lines: number[]): Hexagram {
  if (!isDataLoaded || hexagramsData.length === 0) {
    throw new Error('卦象数据尚未加载完成');
  }
  
  // 查找匹配的卦象
  const hexagram = hexagramsData.find(h => 
    h.lines.length === lines.length && 
    h.lines.every((line, index) => line === lines[index])
  );
  
  if (!hexagram) {
    console.error('未找到匹配的卦象:', lines);
    throw new Error('未找到匹配的卦象');
  }
  
  return hexagram;
}

// 预加载数据
ensureDivinationDataLoaded().catch(err => console.error('占卜模块预加载数据失败:', err));

// 添加calculateTrigram函数
function calculateTrigram(number: number, isUpper: boolean): Trigram {
  return TRIGRAMS[number - 1];
}

// 添加combineTrigrams函数
function combineTrigrams(upperTrigram: Trigram, lowerTrigram: Trigram): Hexagram {
  const lines = [...lowerTrigram.lines, ...upperTrigram.lines];
  return findHexagramFromDatabase(lines);
} 