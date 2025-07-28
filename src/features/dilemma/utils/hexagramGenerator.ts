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
let dataLoadingPromise: Promise<Hexagram[]> | null = null;
let dataLoadingError: Error | null = null;

// 初始化加载卦象数据
function initializeData() {
  if (dataLoadingPromise) {
    console.log('🔄 initializeData: 数据加载已在进行中...');
    return dataLoadingPromise;
  }
  
  console.log('🚀 initializeData: 开始初始化卦象数据...');
  
  dataLoadingPromise = loadAllHexagrams()
    .then(data => {
      if (!data || data.length === 0) {
        const error = new Error('加载卦象数据失败：数据为空');
        console.error('❌ initializeData:', error);
        dataLoadingError = error;
        throw error;
      }
      
      if (data.length < 64) {
        console.warn(`⚠️ initializeData: 只加载了 ${data.length} 个卦象数据，理论上应有64个`);
      }
      
      hexagramsData = data;
      isDataLoaded = true;
      dataLoadingError = null;
      
      console.log(`✅ initializeData: 成功加载 ${hexagramsData.length} 个卦象数据`);
      console.log('📋 initializeData: 数据样本:', hexagramsData.slice(0, 3).map(h => ({
        sequence: h.sequence,
        name: h.name,
        chineseName: h.chineseName,
        lines: h.lines?.join('') || 'undefined'
      })));
      
      // 验证数据质量
      const invalidItems = hexagramsData.filter(h => 
        !h || !h.lines || !Array.isArray(h.lines) || h.lines.length !== 6
      );
      
      if (invalidItems.length > 0) {
        console.warn(`⚠️ initializeData: 发现 ${invalidItems.length} 个无效卦象数据`);
        console.log('🔍 无效数据详情:', invalidItems.map((h, index) => ({
          index,
          hasData: !!h,
          hasLines: !!(h && h.lines),
          isArray: !!(h && h.lines && Array.isArray(h.lines)),
          linesLength: h && h.lines && Array.isArray(h.lines) ? h.lines.length : 'N/A'
        })));
      }
      
      return data;
    })
    .catch(error => {
      console.error('💥 initializeData: 加载卦象数据失败', error);
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
    const data = await initializeData();
    return isDataLoaded && data.length > 0;
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
function generateLine(method: 'time' | 'random' = 'random'): {line: 0 | 1, changing: boolean} {
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
  _optionAWeight: number,
  _optionBWeight: number,
  _position: number
): 'time' | 'random' {
  // 这里实现微调逻辑
  return method; // 简单起见，暂时保持原方法
}

/**
 * 根据爻组合查找卦象
 */
function findHexagram(inputLines: (0 | 1)[] | number[]): Hexagram | null {
  // 检查数据是否已加载
  if (!isDataLoaded || hexagramsData.length === 0) {
    console.error('🚨 findHexagram: 卦象数据尚未加载完成');
    console.log('📊 数据状态:', { isDataLoaded, dataCount: hexagramsData.length });
    throw new Error('卦象数据尚未加载完成，请稍后再试');
  }
  
  // 确保所有爻都是0或1
  const lines: (0 | 1)[] = inputLines.map(line => {
    if (line === 0) return 0;
    if (line === 1) return 1;
    const num = Number(line);
    return num > 0 ? 1 : 0;
  }) as (0 | 1)[];
  
  if (!lines || lines.length !== 6) {
    console.error('🚨 findHexagram: 爻组合无效:', lines);
    throw new Error('爻组合必须是6个元素的数组');
  }
  
  console.log('🔍 findHexagram: 开始查找卦象', { lines, linesString: lines.join('') });
  
  console.log('🔄 findHexagram: 标准化后的爻组合:', lines);
  
  // 从hexagrams.json查找匹配的卦象
  const hexagram = hexagramsData.find((h, index) => {
    if (!h || !h.lines || !Array.isArray(h.lines) || h.lines.length !== 6) {
      console.warn(`⚠️ 跳过无效卦象数据: index ${index}`, h);
      return false;
    }
    
    // 直接比较原始数据，避免标准化导致的数据不一致
      const isMatch = h.lines.every((line, index) => {
        const actualLine = lines[index];
        // 确保双方都是 (0 | 1) 类型
        const normalizedLine = Number(line) > 0 ? 1 : 0;
        const normalizedActualLine = actualLine;
        return normalizedLine === normalizedActualLine;
      });
    
    if (isMatch) {
      console.log('✅ findHexagram: 找到匹配卦象:', { 
        name: h.name, 
        chineseName: h.chineseName || h.name,
        sequence: h.sequence, 
        searchLines: lines.join(''),
        originalHexagramLines: h.lines,
        originalSearchLines: lines
      });
    }
    
    return isMatch;
  });
  
  if (!hexagram) {
    console.error('❌ findHexagram: 未找到匹配的卦象');
    console.log('📋 详细调试信息:', {
      searchLines: lines,
      searchLinesString: lines.join(''),
      availableCount: hexagramsData.length,
      firstFewHexagrams: hexagramsData.slice(0, 5).map((h, index) => ({
        index,
        name: h?.name || 'undefined',
        chineseName: h?.chineseName || 'undefined',
        sequence: h?.sequence || 'undefined',
        lines: h?.lines || 'undefined',
        linesString: Array.isArray(h?.lines) ? h.lines.join('') : 'not-array'
      }))
    });
    
    // 尝试查找相似的卦象作为调试信息
    const similarHexagrams = hexagramsData.filter(h => {
      if (!h || !h.lines || !Array.isArray(h.lines) || h.lines.length !== 6) return false;
      
      const hexagramLines = h.lines.map(line => {
        if (line === 0) return 0;
        if (line === 1) return 1;
        const num = Number(line);
        return num > 0 ? 1 : 0;
      });
      
      const matchCount = hexagramLines.filter((line, index) => line === lines[index]).length;
      return matchCount >= 4; // 至少4爻匹配
    });
    
    if (similarHexagrams.length > 0) {
      console.log('🔍 找到相似的卦象:', similarHexagrams.map(h => ({
        name: h.name,
        chineseName: h.chineseName || h.name,
        sequence: h.sequence,
        lines: h.lines.join(''),
        matchCount: h.lines.filter((line, index) => {
          const normalizedLine = line === 0 ? 0 : 1;
          return normalizedLine === lines[index];
        }).length
      })));
    }
    
    // 尝试模糊匹配
    console.log('🔄 尝试二进制字符串匹配...');
    const searchBinary = lines.join('');
    const binaryMatch = hexagramsData.find(h => {
      if (!h || !h.lines) return false;
        const hexagramBinary = h.lines.map(line => {
          // 标准化为 0 或 1，确保处理数字和字符串
          const normalizedLine = String(line); // 先转换为字符串
          if (normalizedLine === '0') return '0';
          if (normalizedLine === '1') return '1';
          const num = Number(normalizedLine);
          return num > 0 ? '1' : '0';
        }).join('');
      
      return hexagramBinary === searchBinary;
    });
    
    if (binaryMatch) {
      console.log('✅ 通过二进制字符串找到匹配:', {
        name: binaryMatch.name,
        sequence: binaryMatch.sequence
      });
      return binaryMatch;
    }
    
    // 最后尝试：忽略爻的顺序，只比较爻的组合
    const searchSet = new Set(lines.map(String)); // 转换为字符串集合
    const similarHexagram = hexagramsData.find(h => {
      if (!h || !h.lines || !Array.isArray(h.lines)) return false;
      const hexagramSet = new Set(h.lines.map(line => String(line)));
      return (
        hexagramSet.size === searchSet.size && 
        [...hexagramSet].every(val => searchSet.has(val))
      );
    });
    
    if (similarHexagram) {
      console.log('⚠️ 使用相似卦象作为替代:', similarHexagram.name);
      return similarHexagram;
    }
    
    console.error('❌ 所有匹配尝试均失败');
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
  console.log('🎯 开始分析选项:', { optionA, optionB, hexagramName: hexagram.chineseName });
  
  // 计算每个选项的得分
  let optionA_score = calculateOptionScore(hexagram, optionA, 'A', changingLines);
  let optionB_score = calculateOptionScore(hexagram, optionB, 'B', changingLines);
  
  console.log('📊 初始得分:', { optionA_score, optionB_score });
  
  // 如果使用多算法模式，则加入其他因素
  if (useMultipleAlgorithms) {
    const additionalFactors = calculateAdditionalFactors(optionA, optionB);
    optionA_score = Math.round((optionA_score + additionalFactors.optionA_score) / 2);
    optionB_score = Math.round((optionB_score + additionalFactors.optionB_score) / 2);
    console.log('📊 多算法调整后得分:', { optionA_score, optionB_score });
  }
  
  // 确保得分在合理范围内
  optionA_score = Math.max(20, Math.min(95, optionA_score));
  optionB_score = Math.max(20, Math.min(95, optionB_score));
  
  console.log('📊 最终得分:', { optionA_score, optionB_score });
  
  // 修复推荐逻辑：基于得分差异进行推荐
  let recommendation = '';
  const scoreDiff = Math.abs(optionA_score - optionB_score);
  
  if (optionA_score > optionB_score) {
    if (scoreDiff >= 15) {
      recommendation = 'A';
      console.log('✅ 强烈推荐选项A，得分差异:', scoreDiff);
    } else if (scoreDiff >= 8) {
    recommendation = 'A';
      console.log('✅ 推荐选项A，得分差异:', scoreDiff);
    } else {
      recommendation = '两者都可以考虑，建议根据个人直觉选择';
      console.log('⚖️ 得分接近，建议综合考虑，得分差异:', scoreDiff);
    }
  } else if (optionB_score > optionA_score) {
    if (scoreDiff >= 15) {
      recommendation = 'B';
      console.log('✅ 强烈推荐选项B，得分差异:', scoreDiff);
    } else if (scoreDiff >= 8) {
    recommendation = 'B';
      console.log('✅ 推荐选项B，得分差异:', scoreDiff);
    } else {
      recommendation = '两者都可以考虑，建议根据个人直觉选择';
      console.log('⚖️ 得分接近，建议综合考虑，得分差异:', scoreDiff);
    }
  } else {
    recommendation = '两者都可以考虑，建议根据个人直觉选择';
    console.log('⚖️ 得分相等，建议综合考虑');
  }
  
  // 生成选项分析文本 - 基于实际得分
  const optionA_analysis = generateOptionAnalysis(hexagram, optionA, 'A', changingLines, optionA_score, optionB_score);
  const optionB_analysis = generateOptionAnalysis(hexagram, optionB, 'B', changingLines, optionB_score, optionA_score);
  
  // 生成综合分析
  const analysis = await generateOverallAnalysis(hexagram, relatedHexagram, optionA, optionB, changingLines, recommendation);
  
  console.log('🎯 分析完成:', { recommendation, analysis: analysis.substring(0, 100) + '...' });
  
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
 * 计算选项得分 - 改进版本
 */
function calculateOptionScore(
  hexagram: Hexagram,
  option: string,
  optionType: 'A' | 'B',
  changingLines: number[]
): number {
  console.log(`🎲 计算选项${optionType}得分:`, { option, hexagramName: hexagram.chineseName });
  
  // 基础分数
  let score = 50;
  
  // 1. 基于卦象性质的得分调整
  const hexagramName = hexagram.chineseName || '';
  const hexagramNature = getHexagramScoreModifier(hexagramName);
  
  // 选项A倾向于主动、进取的卦象
  // 选项B倾向于稳定、顺应的卦象
  if (optionType === 'A') {
    score += hexagramNature.activeScore;
  } else {
    score += hexagramNature.passiveScore;
  }
  
  console.log(`📊 卦象性质调整后得分(${optionType}):`, score);
  
  // 2. 基于阴阳爻比例的调整（更合理的逻辑）
    const yangCount = hexagram.lines.filter(line => line === 1).length;
  const yinCount = hexagram.lines.filter(line => line === 0).length;
  const yangRatio = yangCount / 6;
  
  // 阳爻多的卦象更适合主动选择，阴爻多的卦象更适合顺应选择
  if (optionType === 'A') {
    // 选项A：阳爻比例越高得分越高
    score += (yangRatio - 0.5) * 20;
  } else {
    // 选项B：阴爻比例越高得分越高
    score += ((1 - yangRatio) - 0.5) * 20;
  }
  
  console.log(`📊 阴阳爻调整后得分(${optionType}):`, score, { yangCount, yinCount, yangRatio });
  
  // 3. 变爻的影响
  if (changingLines.length > 0) {
    // 变爻多表示变化大，更适合选择改变（通常是选项A）
    const changeBonus = changingLines.length * 3;
    if (optionType === 'A') {
      score += changeBonus;
    } else {
      score -= changeBonus / 2; // 选项B受变爻影响较小
    }
    console.log(`📊 变爻调整后得分(${optionType}):`, score, { changingLinesCount: changingLines.length });
  }
  
  // 4. 基于选项文本内容的分析
  const textScore = analyzeOptionText(option, optionType);
  score += textScore;
  
  console.log(`📊 文本分析调整后得分(${optionType}):`, score, { textScore });
  
  // 5. 添加一些随机性，避免过于机械
  const randomFactor = (Math.random() - 0.5) * 10;
  score += randomFactor;
  
  console.log(`📊 最终得分(${optionType}):`, Math.round(score));
  
  return Math.round(score);
}

/**
 * 获取卦象的得分修正值
 */
function getHexagramScoreModifier(hexagramName: string): { activeScore: number; passiveScore: number } {
  const modifiers: Record<string, { activeScore: number; passiveScore: number }> = {
    '乾': { activeScore: 15, passiveScore: -5 },  // 刚健，适合主动
    '坤': { activeScore: -5, passiveScore: 15 },  // 柔顺，适合顺应
    '震': { activeScore: 12, passiveScore: -3 },  // 震动，适合行动
    '艮': { activeScore: -8, passiveScore: 12 },  // 停止，适合等待
    '坎': { activeScore: 5, passiveScore: 8 },    // 险难，需谨慎
    '离': { activeScore: 8, passiveScore: 5 },    // 光明，适度主动
    '兑': { activeScore: 10, passiveScore: 8 },   // 喜悦，两者皆可
    '巽': { activeScore: -3, passiveScore: 10 },  // 谦逊，适合顺应
    '蒙': { activeScore: -5, passiveScore: 8 },   // 蒙昧，需要学习
    '需': { activeScore: -8, passiveScore: 12 },  // 等待，需要耐心
    '讼': { activeScore: -10, passiveScore: 5 },  // 争讼，避免冲突
    '师': { activeScore: 10, passiveScore: -2 },  // 军队，需要行动
    '比': { activeScore: 3, passiveScore: 8 },    // 亲比，合作为主
    '小畜': { activeScore: -3, passiveScore: 8 }, // 小畜，积累为主
    '履': { activeScore: 5, passiveScore: 5 },    // 履行，稳步前进
    '泰': { activeScore: 12, passiveScore: 3 },   // 通泰，适合进取
    '否': { activeScore: -10, passiveScore: 10 }, // 闭塞，需要等待
    '同人': { activeScore: 8, passiveScore: 5 },  // 同人，合作行动
    '大有': { activeScore: 10, passiveScore: 2 }, // 大有，积极进取
    '谦': { activeScore: -5, passiveScore: 12 },  // 谦逊，低调行事
    '豫': { activeScore: 8, passiveScore: 8 },    // 愉悦，两者皆宜
    '随': { activeScore: -3, passiveScore: 10 },  // 随从，顺应为主
    '蛊': { activeScore: 8, passiveScore: -2 },   // 蛊惑，需要整治
    '临': { activeScore: 10, passiveScore: 3 },   // 临近，积极应对
    '观': { activeScore: -5, passiveScore: 10 },  // 观察，静观其变
  };
  
  // 寻找匹配的卦名
  for (const key in modifiers) {
    if (hexagramName.includes(key)) {
      return modifiers[key];
    }
  }
  
  // 默认值
  return { activeScore: 0, passiveScore: 0 };
}

/**
 * 分析选项文本内容
 */
function analyzeOptionText(option: string, optionType: 'A' | 'B'): number {
  let score = 0;
  
  // 主动性关键词
  const activeKeywords = ['开始', '尝试', '挑战', '改变', '创新', '进取', '主动', '争取', '突破', '发展'];
  // 稳定性关键词  
  const stableKeywords = ['保持', '继续', '稳定', '等待', '观察', '坚持', '维持', '守护', '巩固', '安全'];
  // 移除运势相关关键词检测
  
  // 检查主动性
  const activeCount = activeKeywords.filter(keyword => option.includes(keyword)).length;
  const stableCount = stableKeywords.filter(keyword => option.includes(keyword)).length;
  
  if (optionType === 'A') {
    score += activeCount * 3 - stableCount * 2;
  } else {
    score += stableCount * 3 - activeCount * 2;
  }
  
  // 移除运势评分逻辑
  
  // 文本长度因素（适中的长度更好）
  const length = option.length;
  if (length >= 5 && length <= 20) {
    score += 2;
  } else if (length > 30) {
    score -= 3;
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
 * 生成选项分析文本 - 改进版本
 */
function generateOptionAnalysis(
  hexagram: Hexagram,
  option: string,
  optionType: 'A' | 'B',
  changingLines: number[],
  currentScore: number,
  otherScore: number
): string {
  const attrs = calculateHexagramAttributes(hexagram);
  const hexagramName = hexagram.chineseName || '';
  const isRecommended = currentScore > otherScore;
  const scoreDiff = Math.abs(currentScore - otherScore);
  
  console.log(`📝 生成选项${optionType}分析:`, { 
    option, 
    hexagramName, 
    currentScore, 
    otherScore, 
    isRecommended, 
    scoreDiff 
  });
  
  let analysis = '';
  
  // 基于得分差异生成不同的分析
  if (isRecommended) {
    if (scoreDiff >= 15) {
      // 强烈推荐
      analysis = `这个选择与${hexagramName}卦的能量高度契合，`;
      analysis += `体现了${attrs.attribute || '卦象特性'}的核心要义。`;
      analysis += `从易经角度看，这是当前最适合的选择，能够顺应天时地利。`;
    } else if (scoreDiff >= 8) {
      // 一般推荐
      analysis = `这个选择比较符合${hexagramName}卦的指引，`;
      analysis += `能够发挥${attrs.attribute || '卦象特性'}的优势。`;
      analysis += `虽然不是完美匹配，但整体方向是正确的。`;
    } else {
      // 轻微推荐
      analysis = `这个选择在${hexagramName}卦的框架下略有优势，`;
      analysis += `但需要注意平衡${attrs.attribute || '各方面因素'}。`;
      analysis += `建议结合个人直觉做最终决定。`;
    }
  } else {
    if (scoreDiff >= 15) {
      // 不太推荐
      analysis = `这个选择与${hexagramName}卦的能量存在较大偏差，`;
      analysis += `可能与当前的${attrs.attribute || '卦象特性'}不太协调。`;
      analysis += `如果坚持选择，需要额外的努力来化解阻力。`;
    } else if (scoreDiff >= 8) {
      // 一般不推荐
      analysis = `这个选择在${hexagramName}卦的指引下稍显不足，`;
      analysis += `可能无法充分发挥${attrs.attribute || '卦象特性'}的优势。`;
      analysis += `建议谨慎考虑，或寻找改进的方法。`;
    } else {
      // 轻微不推荐
      analysis = `这个选择在${hexagramName}卦的框架下略有不足，`;
      analysis += `但差距不大，仍有成功的可能性。`;
      analysis += `关键在于执行过程中的调整和优化。`;
    }
  }
  
  // 添加变爻相关的分析
  if (changingLines.length > 0) {
    analysis += ` 当前有${changingLines.length}个变爻，表示情况正在变化，`;
    if (changingLines.length >= 3) {
      analysis += `变化较大，需要灵活应对。`;
    } else {
      analysis += `变化适中，可以适当调整策略。`;
    }
  }
  
  console.log(`📝 生成的选项${optionType}分析:`, analysis);
  
  return analysis;
}

/**
 * 生成综合分析 - 改进版本
 */
async function generateOverallAnalysis(
  hexagram: Hexagram,
  relatedHexagram: Hexagram | undefined,
  optionA: string,
  optionB: string,
  changingLines: number[],
  recommendation: string
): Promise<string> {
  console.log('🎯 开始生成综合分析:', { 
    hexagramName: hexagram.chineseName, 
    hasRelatedHexagram: !!relatedHexagram,
    changingLinesCount: changingLines.length,
    recommendation 
  });
  
  try {
    const question = optionA && optionB 
      ? `在"${optionA}"和"${optionB}"之间如何选择？` 
      : '';
      
    console.log('🤖 尝试调用LLM服务...');
      
    // 使用LLM服务生成解读
    const analysis = await LLMService.getHexagramInterpretation(
      hexagram,
      changingLines,
      relatedHexagram || null,
      question
    );
    
    if (analysis && analysis.trim().length > 50) {
      console.log('✅ LLM分析成功，内容长度:', analysis.length);
    return analysis;
    } else {
      console.warn('⚠️ LLM返回内容过短，使用本地分析');
      throw new Error('LLM返回内容不足');
    }
  } catch (error) {
    console.error('❌ LLM分析失败，使用本地回退:', error);
    
    // 增强的本地回退分析
    return generateEnhancedLocalAnalysis(
      hexagram, 
      relatedHexagram, 
      optionA, 
      optionB, 
      changingLines, 
      recommendation
    );
  }
}

/**
 * 生成增强的本地分析
 */
function generateEnhancedLocalAnalysis(
  hexagram: Hexagram,
  relatedHexagram: Hexagram | undefined,
  optionA: string,
  optionB: string,
  changingLines: number[],
  recommendation: string
): string {
  console.log('🏠 生成增强本地分析...');
  
  const hexagramName = hexagram.chineseName || '';
  const attrs = calculateHexagramAttributes(hexagram);
  
  let analysis = '';
  
  // 1. 完整卦象解读（核心修复）
  analysis += `【${hexagramName}卦解读】\n`;
  analysis += `卦象：${hexagram.symbol || '无'}，序号：${hexagram.sequence}\n`;
  
  // 显示卦辞
  if (hexagram.judgment) {
    analysis += `卦辞：${hexagram.judgment}\n`;
  }
  
  // 显示现代解读
  if (hexagram.modernInterpretation) {
    analysis += `现代解读：${hexagram.modernInterpretation}\n`;
  } else if (hexagram.meaning) {
    analysis += `含义：${hexagram.meaning}\n`;
  }
  
  // 显示卦象属性
  analysis += `属性：${attrs.attribute || '无'}，性质：${attrs.nature || '无'}\n`;
  
  // 2. 变卦分析
  if (relatedHexagram && changingLines.length > 0) {
    analysis += `\n【变卦分析】\n`;
    analysis += `本卦 ${hexagramName} → 变卦 ${relatedHexagram.chineseName}\n`;
    analysis += `变化爻位：${changingLines.map(pos => pos + 1).join(', ')}爻\n`;
    analysis += `含义：${getHexagramWisdom(relatedHexagram.chineseName)}`;
  }
  
  // 3. 决策建议（与卦象解读分离）
  analysis += `\n【决策建议】\n`;
  if (recommendation === 'A') {
    analysis += `建议选择"${optionA}"，因与${hexagramName}卦的能量更契合。`;
  } else if (recommendation === 'B') {
    analysis += `建议选择"${optionB}"，因符合${hexagramName}卦的指引。`;
  } else {
    analysis += `两个选项各有依据，请结合自身情况慎重选择。`;
  }
  
  // 4. 变爻指导
    if (changingLines.length > 0) {
    analysis += ` 特别注意`;
    if (changingLines.length === 1) {
      const linePosition = changingLines[0] + 1;
      analysis += `第${linePosition}爻的变化，${getLineAdvice(linePosition)}`;
    } else {
      analysis += `${changingLines.length}个变爻的影响，表示当前正处于重要的转折期，`;
      analysis += `需要保持灵活性和适应能力。`;
    }
  }
  
  console.log('🏠 本地分析生成完成，长度:', analysis.length);
  
  return analysis;
}

/**
 * 获取卦象核心智慧
 */
function getHexagramWisdom(hexagramName: string): string {
  const wisdomMap: Record<string, string> = {
    '乾': '自强不息，但要避免过于刚强，保持谦逊和开放。',
    '坤': '厚德载物，以柔克刚，在包容中寻找力量。',
    '震': '动而有节，在变化中保持方向感和原则性。',
    '艮': '知止而后有定，适时停下来思考比盲目前进更重要。',
    '坎': '险中求胜，保持冷静和智慧，困难中蕴含机遇。',
    '离': '明辨是非，保持内心的光明和清醒的判断力。',
    '兑': '和悦待人，在愉快的氛围中更容易达成目标。',
    '巽': '谦逊渐进，以温和的方式影响环境和他人。',
    '蒙': '虚心学习，承认无知是智慧的开始。',
    '需': '耐心等待，时机成熟时自然水到渠成。',
    '讼': '化解争端，和谐比胜负更重要。',
    '师': '有序行动，团结协作才能成就大事。',
    '比': '亲近贤者，在合作中实现共同发展。',
    '小畜': '积少成多，小步快跑比大步慢走更有效。',
    '履': '谨慎前行，每一步都要踏实稳重。',
    '泰': '把握机遇，在顺境中也要保持清醒。',
    '否': '守正待时，困境是暂时的，坚持就是胜利。',
  };
  
  // 寻找匹配的卦名
  for (const key in wisdomMap) {
    if (hexagramName.includes(key)) {
      return wisdomMap[key];
  }
  }
  
  return '顺应自然规律，在变化中寻找不变的智慧。';
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
export async function generateHexagramFromLines(lines: (0 | 1)[]): Promise<Hexagram | null> {
  console.log('🎯 generateHexagramFromLines: 开始处理', { lines, isDataLoaded });
  
  // 确保数据已加载，最多等待5秒
  let retryCount = 0;
  const maxRetries = 10;
  
  while (!isDataLoaded && retryCount < maxRetries) {
    console.log(`⏳ generateHexagramFromLines: 等待数据加载... (${retryCount + 1}/${maxRetries})`);
    
    try {
      await ensureDataLoaded();
      
      // 等待一小段时间让数据完全加载
      if (!isDataLoaded) {
        await new Promise(resolve => setTimeout(resolve, 500));
        retryCount++;
      }
    } catch (error) {
      console.error(`❌ generateHexagramFromLines: 第${retryCount + 1}次数据加载失败:`, error);
      retryCount++;
      
      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  // 检查最终状态
  if (!isDataLoaded) {
    console.error('💥 generateHexagramFromLines: 数据加载超时失败');
    console.log('📊 最终数据状态:', { 
      isDataLoaded, 
      dataCount: hexagramsData.length, 
      dataLoadingError: dataLoadingError?.message 
    });
    
    // 尝试直接使用当前已有的数据
    if (hexagramsData.length > 0) {
      console.log('🔄 generateHexagramFromLines: 尝试使用现有部分数据');
    } else {
      throw new Error('卦象数据加载失败，无法进行占卜。请检查网络连接后重试。');
    }
  }
  
  try {
    console.log('🔍 generateHexagramFromLines: 准备查找卦象', { 
      lines, 
      hexagramsDataLength: hexagramsData.length 
    });
    
    const result = findHexagram(lines);
    
    if (result) {
      console.log('✅ generateHexagramFromLines: 成功找到卦象', { 
        name: result.name, 
        sequence: result.sequence 
      });
    } else {
      console.error('❌ generateHexagramFromLines: 查找卦象失败', { lines });
    }
    
    return result;
  } catch (error) {
    console.error('💥 generateHexagramFromLines: 查找过程中发生错误:', error);
    
    // 如果数据尚未加载完成，返回一个临时卦象
    if (!isDataLoaded && hexagramsData.length === 0) {
      console.warn('🔄 generateHexagramFromLines: 返回临时卦象');
  return {
    number: 1,
    sequence: 1,
    name: '临时卦象',
    chineseName: '临时',
    symbol: '?',
    lines: lines as (0 | 1)[], // 确保类型匹配
    meaning: '数据加载中...',
    judgment: '请稍后重试...',
    yao_texts: Array(6).fill(''),
    trigrams: { upper: 'Unknown', lower: 'Unknown' },
    modernInterpretation: '现代解读数据加载中...'
  };
    }
    
    throw error;
  }
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
export function generateAnalysis(_hexagram: any, _changingLines: number[], _relatedHexagram: any): string {
  // 返回一个占位符，提示用户需要等待异步加载
  return '正在生成解读内容，请稍候...';
}

/**
 * 生成卦象和分析
 */
export async function generateHexagram(optionA: string, optionB: string, seed: number, useMultipleAlgorithms: boolean = false): Promise<AnalysisResult> {
  await ensureDataLoaded();
  
  // 使用种子生成六爻
  const lines: (0 | 1)[] = [];
  const results: number[] = [];
  const changingLines: number[] = [];
  
  // 初始化随机数生成器
  // const rng = new Random(seed);
  
  // 生成每一爻
  for (let i = 0; i < 6; i++) {
    // 计算选项权重
    const optionAWeight = calculateOptionWeight(optionA);
    const optionBWeight = calculateOptionWeight(optionB);
    
    // 根据权重调整生成方法
    const method = adjustGenerationMethod('random', optionAWeight, optionBWeight, i);
    
    // 生成当前爻
    const lineResult = generateLine(method);
    // 直接使用lineResult.line，它已经是0 | 1类型
    lines.push(lineResult.line);
    // 修正：使用正确的爻值（6、7、8、9）而不是0/1
    const numericValue = lineResult.line === 1 ? 
      (lineResult.changing ? 9 : 7) : 
      (lineResult.changing ? 6 : 8);
    results.push(numericValue);
    
    // 如果是变爻，记录位置
    if (lineResult.changing) {
      changingLines.push(i);
    }
  }
  
  // 查找对应的卦象 - 使用原始爻值（0或1）组成的数组
  const currentHexagram = await generateHexagramFromLines(lines as (0 | 1)[]);
  
  if (!currentHexagram) {
    throw new Error('生成卦象失败');
  }
  
  // 如果有变爻，计算变卦
  let relatedHexagram: Hexagram | undefined = undefined;
  if (changingLines.length > 0) {
    // 创建变卦的爻数组 - 基于原始爻值（0或1）
    const relatedLines: (0 | 1)[] = lines.map(line => line as 0 | 1);
    changingLines.forEach(lineIndex => {
      relatedLines[lineIndex] = relatedLines[lineIndex] === 1 ? 0 : 1;
    });
    const tempHexagram = await generateHexagramFromLines(relatedLines);
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
