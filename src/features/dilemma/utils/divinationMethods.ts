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
  // 如果数据已经加载成功，直接返回true
  if (isDataLoaded && hexagramsData.length > 0) return true;
  
  try {
    // 如果没有正在进行的加载过程，创建一个新的加载Promise
    if (!dataLoadingPromise) {
      console.log('占卜模块: 开始加载卦象数据...');
      
      dataLoadingPromise = new Promise<void>((resolve, reject) => {
        loadAllHexagrams()
        .then(data => {
            if (!data || data.length === 0) {
              console.error('占卜模块: 加载的数据为空');
              isDataLoaded = false;
              reject(new Error('加载卦象数据失败: 数据为空'));
              return;
            }
            
          hexagramsData = data;
          isDataLoaded = true;
          console.log(`✅ 占卜模块: 成功加载 ${hexagramsData.length} 个卦象数据`);
            
            // 验证数据的有效性
            const validCount = hexagramsData.filter(h => h && h.lines && h.lines.length === 6).length;
            console.log(`✅ 占卜模块: ${validCount}/${hexagramsData.length} 个卦象数据有效`);
            
            resolve();
          })
          .catch(error => {
            console.error('占卜模块: 加载数据失败', error);
            isDataLoaded = false;
            reject(error);
          });
        });
    }
    
    // 等待加载完成
    await dataLoadingPromise;
    return isDataLoaded;
  } catch (error) {
    console.error('占卜模块: 加载过程中发生错误', error);
    // 重置Promise，允许下次尝试
    dataLoadingPromise = null;
    isDataLoaded = false;
    return false;
  }
}

/**
 * 铜钱占卜法（以钱代蓍法）
 * 掷三枚铜钱，根据正反面确定一爻
 * 一背为阳爻(—)，两背为阴爻(--)，三背为老阳(O)，无背为老阴(X)
 */
export async function coinDivination(): Promise<SixCoinsResult> {
  // 确保数据已加载
  try {
    await ensureDivinationDataLoaded();
  } catch (error) {
    console.warn('铜钱占卜: 数据加载出现问题，使用降级方案', error);
    // 继续执行，使用降级逻辑
  }
  
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

  try {
    // 计算卦象
    const hexagram = calculateHexagram(lines);
    
    return {
      coins,
      results,
      hexagram
    };
  } catch (error) {
    console.error('铜钱占卜: 计算卦象失败', error);
    
    // 创建一个基础的卦象作为降级方案
    const fallbackHexagram: Hexagram = {
      number: 1,
      sequence: 1,
      name: lines.join(''),
      symbol: '?',
      lines: lines,
      meaning: '临时卦象，数据加载中...',
      judgment: '请稍后重试...',
      yao_texts: ['', '', '', '', '', ''],
      trigrams: { upper: 'Unknown', lower: 'Unknown' }
    };

  return {
    coins,
    results,
      hexagram: fallbackHexagram
  };
  }
}

/**
 * 梅花易数法
 * 时间起卦或数字起卦
 */
export async function plumBlossomDivination(params: PlumBlossomParams): Promise<PlumBlossomResult> {
  // 确保数据已加载
  try {
    await ensureDivinationDataLoaded();
  } catch (error) {
    console.warn('梅花易数: 数据加载出现问题，使用降级方案', error);
    // 继续执行，使用降级逻辑
  }
  
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
  
  try {
  // 计算卦象
  const upperTrigram = calculateTrigram(numbers[0], true);
  const lowerTrigram = calculateTrigram(numbers[1], false);
    const hexagram = combineTrigrams(upperTrigram, lowerTrigram);
    
    return {
      numbers,
      upperTrigram,
      lowerTrigram,
      hexagram
    };
  } catch (error) {
    console.error('梅花易数: 计算卦象失败', error);
    
    // 创建基础的卦象作为降级方案
    const upperTrigram: Trigram = TRIGRAMS[0]; // 使用乾卦作为默认
    const lowerTrigram: Trigram = TRIGRAMS[0];
    const fallbackHexagram: Hexagram = {
      number: 1,
      sequence: 1,
      name: '临时卦象',
      symbol: '?',
      lines: [...lowerTrigram.lines, ...upperTrigram.lines],
      meaning: '临时卦象，数据加载中...',
      judgment: '请稍后重试...',
      yao_texts: ['', '', '', '', '', ''],
      trigrams: { upper: upperTrigram.name, lower: lowerTrigram.name }
    };
  
  return {
    numbers,
    upperTrigram,
    lowerTrigram,
      hexagram: fallbackHexagram
  };
  }
}

/**
 * 随机起卦法（简易现代法）
 */
export async function randomDivination(question: string): Promise<AnalysisResult> {
  // 确保数据已加载
  try {
    await ensureDivinationDataLoaded();
  } catch (error) {
    console.warn('随机起卦: 数据加载出现问题，使用降级方案', error);
    // 继续执行，使用降级逻辑
  }
  
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
  
  try {
  // 计算本卦和变卦
  const hexagram = calculateHexagram(lines);
  const relatedHexagram = changingLines.length > 0 ? 
    calculateChangedHexagram(hexagram, changingLines) : null;
  
  return {
    hexagram,
    changingLines,
    relatedHexagram,
      analysis: generateAnalysis(hexagram, relatedHexagram, question),
      question
  };
  } catch (error) {
    console.error('随机起卦: 计算卦象失败', error);
    
    // 创建基础卦象作为降级方案
    const fallbackHexagram: Hexagram = {
      number: 1,
      sequence: 1,
      name: '临时卦象',
      symbol: '?',
      lines: lines,
      meaning: '临时卦象，数据加载中...',
      judgment: '请稍后重试...',
      yao_texts: ['', '', '', '', '', ''],
      trigrams: { upper: 'Unknown', lower: 'Unknown' }
    };
    
    return {
      hexagram: fallbackHexagram,
      changingLines,
      relatedHexagram: null,
      analysis: '卦象数据正在加载，请稍后重试...',
      question
    };
  }
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
  let analysis = hexagram.meaning || hexagram.overall || '';
  
  if (relatedHexagram) {
    analysis += `\n变卦为${relatedHexagram.name}，表示${relatedHexagram.meaning || relatedHexagram.overall || ''}`;
  }
  
  // 根据问题内容调整分析
  if (question.includes('工作') || question.includes('事业')) {
    analysis += '\n在事业方面，建议积极进取，把握机会。';
  } else if (question.includes('感情') || question.includes('婚姻')) {
    analysis += '\n在感情方面，保持真诚沟通，明确自己的心意。';
  } else if (question.includes('健康')) {
    analysis += '\n在健康方面，注意身心平衡，保持良好作息。';
  }
  
  return analysis;
}

/**
 * 从数据库中查找卦象
 */
function findHexagramFromDatabase(lines: number[]): Hexagram {
  // 检查数据是否已加载
  if (!isDataLoaded || hexagramsData.length === 0) {
    // 触发数据加载，但仍返回一个基础卦象以避免错误
    ensureDivinationDataLoaded().catch(err => console.error('占卜模块数据加载失败:', err));
    
    // 提供基础卦象作为降级方案
    console.warn('卦象数据尚未完全加载，使用临时卦象数据');
    
    // 根据lines生成一个临时卦象
    return {
      number: 1, // 临时序号
      sequence: 1,
      name: lines.join(''),
      symbol: '?',
      lines: lines,
      meaning: '卦象数据加载中...',
      judgment: '卦象数据加载中...',
      yao_texts: ['', '', '', '', '', ''],
      trigrams: { upper: 'Unknown', lower: 'Unknown' },
      nature: lines.join(''),
      description: '卦象数据加载中...',
      overall: '正在连接易经数据库...',
      tuan_text: '',
      xiang_text: ''
    };
  }
  
  // 优化卦象查找逻辑，提供更强的错误容忍度
  // 1. 首先尝试精确匹配
  const hexagram = hexagramsData.find(h => 
    h.lines && h.lines.length === lines.length && 
    h.lines.every((line, index) => line === lines[index])
  );
  
  // 2. 如果找到了，直接返回
  if (hexagram) {
    return hexagram;
  }
  
  // 3. 如果没找到，尝试将lines转换为字符串进行二次查找
  const binaryString = lines.join('');
  // 检查是否有卦象的lines转为字符串后等于我们要查找的二进制字符串
  const hexagramByBinaryString = hexagramsData.find(h => 
    h.lines && h.lines.join('') === binaryString
  );
  
  if (hexagramByBinaryString) {
    return hexagramByBinaryString;
  }
  
  // 4. 如果还是没找到，使用sequence查找
  // 将二进制转换为十进制作为备用查找手段
  const decimalValue = parseInt(binaryString, 2) + 1; // 加1因为卦序从1开始
  const hexagramBySequence = hexagramsData.find(h => h.sequence === decimalValue);
  
  if (hexagramBySequence) {
    console.warn(`使用序号匹配卦象: ${decimalValue}`);
    return hexagramBySequence;
  }
  
  // 5. 最后的备用方案，返回第1卦（乾卦）或任何可用的卦象
  console.error('未找到匹配的卦象:', lines, '返回默认卦象');
  return hexagramsData[0] || {
    number: 1,
    sequence: 1,
    name: '乾',
    symbol: '䷀',
    lines: [1, 1, 1, 1, 1, 1],
    meaning: '乾为天，刚健中正',
    judgment: '元亨利贞。君子自强不息。',
    yao_texts: [
      '潜龙勿用。',
      '见龙在田，利见大人。',
      '君子终日乾乾，夕惕若厉，无咎。',
      '或跃在渊，无咎。',
      '飞龙在天，利见大人。',
      '亢龙有悔。'
    ],
    trigrams: { upper: 'Heaven', lower: 'Heaven' },
    nature: '乾上乾下',
    description: '元，亨，利，贞。',
    overall: '刚健、积极进取',
    tuan_text: '大哉乾元，万物资始，乃统天。',
    xiang_text: '天行健，君子以自强不息。'
  };
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