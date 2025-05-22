/**
 * 六十四卦算法核心逻辑
 * 基于用户输入的两个选择，生成卦象并进行分析
 */

// 改用完整的卦象数据加载器
import { loadAllHexagrams } from './loadHexagrams';
import { Hexagram, Trigram, AnalysisResult } from '../types/index';
import { Random } from '../utils/Random';
import { LLMService } from '../../../services/LLMService';

// 为方便其他模块导入，重新导出AnalysisResult类型
export type { AnalysisResult };

// 存储加载的卦象数据
let hexagramsData: Hexagram[] = [];
let isDataLoaded = false;
let dataLoadingPromise: Promise<void> | null = null;
let dataLoadingError: Error | null = null;

// 初始化加载卦象数据
function initializeData() {
  if (dataLoadingPromise) return dataLoadingPromise;
  
  console.log('开始初始化卦象数据...');
  
  dataLoadingPromise = loadAllHexagrams()
    .then(data => {
      if (!data || data.length === 0) {
        const error = new Error('加载卦象数据失败：数据为空');
        console.error(error);
        dataLoadingError = error;
        throw error;
      }
      
      if (data.length < 64) {
        console.warn(`警告：只加载了 ${data.length} 个卦象数据，理论上应有64个`);
      }
      
      hexagramsData = data;
      isDataLoaded = true;
      dataLoadingError = null;
      console.log(`✅ 成功加载 ${hexagramsData.length} 个卦象数据`);
    })
    .catch(error => {
      console.error('加载卦象数据失败', error);
      isDataLoaded = false;
      dataLoadingError = error;
      dataLoadingPromise = null; // 重置，允许重试
      throw error;
    });
    
  return dataLoadingPromise;
}

// 确保数据已加载
export async function ensureDataLoaded(): Promise<boolean> {
  if (isDataLoaded) return true;
  
  try {
    await initializeData();
    return isDataLoaded;
  } catch (error) {
    console.error('加载数据失败', error);
    return false;
  }
}

// 获取数据加载状态
export function getDataLoadingStatus() {
  return {
    isLoaded: isDataLoaded,
    isLoading: !!dataLoadingPromise && !isDataLoaded,
    error: dataLoadingError ? dataLoadingError.message : null,
    dataCount: hexagramsData.length
  };
}

// 立即开始加载数据
initializeData().catch(err => console.error('预加载卦象数据失败:', err));

/**
 * 八卦数据
 */
const trigrams: Trigram[] = [
  { name: 'Heaven', chineseName: '乾', symbol: '☰', lines: [1, 1, 1], nature: '天', attribute: '刚健' },
  { name: 'Lake', chineseName: '兑', symbol: '☱', lines: [1, 1, 0], nature: '泽', attribute: '喜悦' },
  { name: 'Fire', chineseName: '离', symbol: '☲', lines: [1, 0, 1], nature: '火', attribute: '明丽' },
  { name: 'Thunder', chineseName: '震', symbol: '☳', lines: [1, 0, 0], nature: '雷', attribute: '动' },
  { name: 'Wind', chineseName: '巽', symbol: '☴', lines: [0, 1, 1], nature: '风', attribute: '入' },
  { name: 'Water', chineseName: '坎', symbol: '☵', lines: [0, 1, 0], nature: '水', attribute: '陷' },
  { name: 'Mountain', chineseName: '艮', symbol: '☶', lines: [0, 0, 1], nature: '山', attribute: '止' },
  { name: 'Earth', chineseName: '坤', symbol: '☷', lines: [0, 0, 0], nature: '地', attribute: '顺' }
];

/**
 * 根据起卦方式生成一个爻
 * @param method 起卦方式，可以是时间、随机等
 * @returns 1表示阳爻，0表示阴爻
 */
function generateLine(method: 'time' | 'random' = 'random'): {line: number, changing: boolean} {
  if (method === 'time') {
    // 基于当前时间生成爻
    const now = new Date();
    const timestamp = now.getTime();
    const randomValue = (timestamp % 100) / 100;
    
    // 生成爻，有四种可能：阳爻(老阳)、阴爻(老阴)、变爻(少阳)、变爻(少阴)
    if (randomValue < 0.25) return { line: 1, changing: true }; // 老阳，会变成阴
    if (randomValue < 0.5) return { line: 0, changing: true };  // 老阴，会变成阳
    if (randomValue < 0.75) return { line: 1, changing: false }; // 少阳，不变
    return { line: 0, changing: false }; // 少阴，不变
  } else {
    // 使用随机数生成爻
    const randomValue = Math.random();
    if (randomValue < 0.25) return { line: 1, changing: true };
    if (randomValue < 0.5) return { line: 0, changing: true };
    if (randomValue < 0.75) return { line: 1, changing: false };
    return { line: 0, changing: false };
  }
}

/**
 * 根据选项的文本计算权重
 */
function calculateOptionWeight(option: string): number {
  if (!option) return 0.5;
  
  // 简单的实现，基于文本长度和特定关键词
  let weight = 0.5; // 默认中性
  
  // 文本长度影响
  const length = option.length;
  if (length > 15) weight += 0.1;
  if (length < 5) weight -= 0.1;
  
  // 积极词汇
  const positiveWords = ['好', '喜欢', '开心', '成功', '希望', '发展', '进步', '积极'];
  // 消极词汇
  const negativeWords = ['坏', '不喜欢', '难过', '失败', '放弃', '后退', '消极', '困难'];
  
  positiveWords.forEach(word => {
    if (option.includes(word)) weight += 0.05;
  });
  
  negativeWords.forEach(word => {
    if (option.includes(word)) weight -= 0.05;
  });
  
  // 限制范围在0-1之间
  return Math.max(0, Math.min(1, weight));
}

/**
 * 根据选项权重调整生成方法
 */
function adjustGenerationMethod(
  method: 'time' | 'random',
  optionAWeight: number,
  optionBWeight: number,
  position: number
): 'time' | 'random' {
  // 这里实现微调逻辑
  return method; // 简单起见，暂时保持原方法
}

/**
 * 根据爻组合查找卦象
 */
function findHexagram(lines: number[]): Hexagram | null {
  // 检查数据是否已加载
  if (!isDataLoaded || hexagramsData.length === 0) {
    throw new Error('卦象数据尚未加载完成，请稍后再试');
  }
  if (!lines || lines.length !== 6) {
    console.error('爻组合无效:', lines);
    throw new Error('爻组合必须是6个元素的数组');
  }
  // 从hexagrams.json查找匹配的卦象
  const hexagram = hexagramsData.find(h =>
    h.lines.length === lines.length &&
    h.lines.every((line, index) => line === lines[index])
  );
  if (!hexagram) {
    console.error('未找到匹配的卦象，爻组合:', lines);
    return null;
  }
  return hexagram;
}

/**
 * 分析选项
 */
async function analyzeOptions(
  hexagram: Hexagram,
  relatedHexagram: Hexagram | undefined,
  optionA: string,
  optionB: string,
  changingLines: number[],
  useMultipleAlgorithms: boolean
): Promise<{
  optionA_score: number;
  optionB_score: number;
  optionA_analysis: string;
  optionB_analysis: string;
  recommendation: string;
  analysis: string;
}> {
  // 计算每个选项的得分
  let optionA_score = calculateOptionScore(hexagram, optionA, 'A', changingLines);
  let optionB_score = calculateOptionScore(hexagram, optionB, 'B', changingLines);
  
  // 如果使用多算法模式，则加入其他因素
  if (useMultipleAlgorithms) {
    const additionalFactors = calculateAdditionalFactors(optionA, optionB);
    optionA_score = (optionA_score + additionalFactors.optionA_score) / 2;
    optionB_score = (optionB_score + additionalFactors.optionB_score) / 2;
  }
  
  // 确定最终推荐
  let recommendation = '建议你综合考虑';
  
  if (optionA_score > optionB_score + 15) {
    recommendation = 'A';
  } else if (optionB_score > optionA_score + 15) {
    recommendation = 'B';
  } else {
    recommendation = '两者都可以考虑，建议根据个人直觉选择';
  }
  
  // 生成选项分析文本
  const optionA_analysis = generateOptionAnalysis(hexagram, optionA, 'A', changingLines);
  const optionB_analysis = generateOptionAnalysis(hexagram, optionB, 'B', changingLines);
  
  // 生成综合分析
  const analysis = await generateOverallAnalysis(hexagram, relatedHexagram, optionA, optionB, changingLines, recommendation);
  
  return {
    optionA_score,
    optionB_score,
    optionA_analysis,
    optionB_analysis,
    recommendation,
    analysis
  };
}

/**
 * 计算选项得分
 */
function calculateOptionScore(
  hexagram: Hexagram,
  option: string,
  optionType: 'A' | 'B',
  changingLines: number[]
): number {
  // 基础分数
  let score = 50;
  
  // 卦象特性影响分数
  if (optionType === 'A') {
    // 阳爻越多越有利于选项A
    const yangCount = hexagram.lines.filter(line => line === 1).length;
    score += yangCount * 5;
  } else {
    // 阴爻越多越有利于选项B
    const yinCount = hexagram.lines.filter(line => line === 0).length;
    score += yinCount * 5;
  }
  
  // 变爻会影响得分
  if (changingLines.length > 0) {
    if (changingLines.length % 2 === (optionType === 'A' ? 1 : 0)) {
      score += 5;
    } else {
      score -= 5;
    }
  }
  
  // 卦象特殊性质的影响
  switch (hexagram.name) {
    case 'Qian (The Creative)': // 乾卦
      if (optionType === 'A') score += 10;
      break;
    case 'Kun (The Receptive)': // 坤卦
      if (optionType === 'B') score += 10;
      break;
    // 可以添加更多卦象特殊处理
  }
  
  return score;
}

/**
 * 计算额外因素（用于多算法模式）
 */
function calculateAdditionalFactors(optionA: string, optionB: string) {
  // 简单的实现，可以在这里集成其他算法
  const optionA_length = optionA.length;
  const optionB_length = optionB.length;
  
  let optionA_score = 50 + (Math.random() * 30 - 15);
  let optionB_score = 50 + (Math.random() * 30 - 15);
  
  // 文本长度因素
  if (optionA_length > optionB_length) {
    optionA_score += 5;
  } else if (optionB_length > optionA_length) {
    optionB_score += 5;
  }
  
  return { optionA_score, optionB_score };
}

/**
 * 生成选项分析文本
 */
function generateOptionAnalysis(
  hexagram: Hexagram,
  option: string,
  optionType: 'A' | 'B',
  changingLines: number[]
): string {
  const attrs = calculateHexagramAttributes(hexagram);
  const analyses = [
    `这个选择体现了${hexagram.chineseName}卦的"${attrs.attribute || '特性'}"，表示${optionType === 'A' ? '主动性较强' : '适应性较强'}。`,
    `从${hexagram.chineseName}卦的角度看，这个选择有助于个人${attrs.attribute || '发展'}。`,
    `选择这条路径，需要注意${hexagram.chineseName}卦所暗示的可能挑战。`,
    `此选项符合${hexagram.chineseName}卦的整体发展方向，但需要保持${attrs.element || '平衡'}。`
  ];
  const randomIndex = Math.floor(Math.random() * analyses.length);
  return analyses[randomIndex];
}

/**
 * 生成综合分析
 */
async function generateOverallAnalysis(
  hexagram: Hexagram,
  relatedHexagram: Hexagram | undefined,
  optionA: string,
  optionB: string,
  changingLines: number[],
  recommendation: string
): Promise<string> {
  try {
    const question = optionA && optionB 
      ? `在"${optionA}"和"${optionB}"之间如何选择？` 
      : '';
      
    // 使用LLM服务生成解读
    const analysis = await LLMService.getHexagramInterpretation(
      hexagram,
      changingLines,
      relatedHexagram || null,
      question
    );
    
    return analysis;
  } catch (error) {
    console.error('获取LLM解读失败:', error);
    
    // 如果LLM服务失败，回退到本地模板（移除了选项A/B相关的文字）
    let fallbackAnalysis = '';
    fallbackAnalysis += `根据${hexagram.chineseName}卦的启示，`;
    if (relatedHexagram) {
      fallbackAnalysis += `变至${relatedHexagram.chineseName}卦，`;
    }
    
    fallbackAnalysis += `目前你需要${hexagram.modernInterpretation || hexagram.judgment || '保持平衡与耐心'}。`;
  
    if (changingLines.length > 0) {
      const linePosition = changingLines[0] + 1;
      fallbackAnalysis += ` 特别注意第${linePosition}爻的变化，暗示着${getLineAdvice(linePosition)}`;
    }
    
    return fallbackAnalysis;
  }
}

/**
 * 根据爻位获取建议
 */
function getLineAdvice(position: number): string {
  const advice = [
    '基础环节可能需要调整。',
    '内在态度决定外在结果。',
    '行动中需要保持警觉。',
    '在行动前充分考虑各种可能性。',
    '高处不胜寒，成功后仍需谨慎。',
    '达到顶点后的转变即将到来。'
  ];
  
  return advice[position - 1] || '需要综合考虑各种因素。';
}

/**
 * 计算卦象的综合属性
 */
export function calculateHexagramAttributes(hexagram: Hexagram): {
  element: string;
  attribute: string;
  nature: string;
} {
  const lowerTrigramLines = hexagram.lines.slice(0, 3);
  const upperTrigramLines = hexagram.lines.slice(3, 6);
  
  const lowerTrigram = trigrams.find(t => 
    t.lines.every((line, index) => line === lowerTrigramLines[index])
  );
  
  const upperTrigram = trigrams.find(t => 
    t.lines.every((line, index) => line === upperTrigramLines[index])
  );
  
  if (!lowerTrigram || !upperTrigram) {
    return {
      element: '未知',
      attribute: '未知',
      nature: '未知'
    };
  }
  
  return {
    element: `${lowerTrigram.nature}${upperTrigram.nature}`,
    attribute: `${lowerTrigram.attribute}${upperTrigram.attribute}`,
    nature: `${lowerTrigram.nature}下${upperTrigram.nature}上`
  };
}

// 新增generateHexagramFromLines函数
export function generateHexagramFromLines(lines: number[]): Hexagram | null {
  return findHexagram(lines);
}

// 新增异步解析功能
export async function generateAnalysisAsync(
  hexagram: Hexagram,
  changingLines: number[],
  relatedHexagram: Hexagram | null,
  question?: string
): Promise<string> {
  return await LLMService.getHexagramInterpretation(
    hexagram,
    changingLines,
    relatedHexagram,
    question || ''
  );
}

// 移除同步generateAnalysis，改用异步版本
export function generateAnalysis(hexagram: any, changingLines: number[], relatedHexagram: any): string {
  // 返回一个占位符，提示用户需要等待异步加载
  return '正在生成解读内容，请稍候...';
}

/**
 * 生成卦象和分析
 */
export async function generateHexagram(optionA: string, optionB: string, seed: number, useMultipleAlgorithms: boolean = false): Promise<AnalysisResult> {
  await ensureDataLoaded();
  
  // 使用种子生成六爻
  const lines: number[] = [];
  const results: number[] = [];
  const changingLines: number[] = [];
  
  // 初始化随机数生成器
  const rng = new Random(seed);
  
  // 生成每一爻
  for (let i = 0; i < 6; i++) {
    // 计算选项权重
    const optionAWeight = calculateOptionWeight(optionA);
    const optionBWeight = calculateOptionWeight(optionB);
    
    // 根据权重调整生成方法
    const method = adjustGenerationMethod('random', optionAWeight, optionBWeight, i);
    
    // 生成当前爻
    const lineResult = generateLine(method);
    lines.push(lineResult.line);
    results.push(lineResult.line === 1 ? (lineResult.changing ? 9 : 7) : (lineResult.changing ? 6 : 8));
    
    // 如果是变爻，记录位置
    if (lineResult.changing) {
      changingLines.push(i);
    }
  }
  
  // 查找对应的卦象
  const currentHexagram = generateHexagramFromLines(lines);
  
  if (!currentHexagram) {
    throw new Error('生成卦象失败');
  }
  
  // 如果有变爻，计算变卦
  let relatedHexagram: Hexagram | undefined = undefined;
  if (changingLines.length > 0) {
    const relatedLines = [...lines];
    changingLines.forEach(lineIndex => {
      relatedLines[lineIndex] = relatedLines[lineIndex] === 1 ? 0 : 1;
    });
    const tempHexagram = generateHexagramFromLines(relatedLines);
    if (tempHexagram) {
      relatedHexagram = tempHexagram;
    }
  }
  
  // 分析两个选项
  const analysisResult = await analyzeOptions(currentHexagram, relatedHexagram, optionA, optionB, changingLines, useMultipleAlgorithms);
  
  // 返回结果
  return {
    hexagram: currentHexagram,
    relatedHexagram: relatedHexagram || null,
    changingLines,
    optionA: optionA,
    optionB: optionB,
    optionA_score: analysisResult.optionA_score,
    optionB_score: analysisResult.optionB_score,
    optionA_analysis: analysisResult.optionA_analysis,
    optionB_analysis: analysisResult.optionB_analysis,
    recommendation: analysisResult.recommendation,
    analysis: analysisResult.analysis,
    results: results
  };
} 