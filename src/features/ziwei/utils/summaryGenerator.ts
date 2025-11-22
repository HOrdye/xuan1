/**
 * 紫微斗数命盘总结生成器
 * 生成一句话总结、核心标签、综合评分
 */

import type { ZiweiChart } from '../types';
import { generateSummaryPrompt } from './aiPrompts';
import { LLMService } from '../../../services/LLMService';

/**
 * 核心标签类型
 */
export interface CoreTag {
  type: 'advantage' | 'attention';
  icon: string;
  text: string;
}

/**
 * 总结结果
 */
export interface SummaryResult {
  summaryText: string;
  summaryDescription: string;
  coreTags: CoreTag[];
  overallScore: number;
}

/**
 * 生成一句话总结
 * 优先使用AI生成，失败时使用本地算法
 */
export async function generateSummary(chartData: ZiweiChart): Promise<string> {
  try {
    // 尝试使用AI生成
    const config = LLMService.getConfig();
    if (config.apiKey) {
      try {
        const prompt = generateSummaryPrompt(chartData);
        const response = await LLMService.getCustomInterpretation(prompt);
        if (response && response.trim().length > 20) {
          return response.trim();
        }
      } catch (error) {
        console.warn('⚠️ AI生成总结失败，使用本地算法:', error);
      }
    }
    
    // 降级到本地算法
    return generateLocalSummary(chartData);
  } catch (error) {
    console.error('❌ 生成总结失败:', error);
    return '命盘数据正在分析中...';
  }
}

/**
 * 本地算法生成一句话总结
 */
function generateLocalSummary(chartData: ZiweiChart): string {
  const mingGong = chartData.palaces.find(p => p.name === '命宫');
  const caiBoGong = chartData.palaces.find(p => p.name === '财帛宫');
  const guanLuGong = chartData.palaces.find(p => p.name === '官禄宫');
  const fuQiGong = chartData.palaces.find(p => p.name === '夫妻宫');

  const parts: string[] = [];

  // 命宫主星
  if (mingGong && mingGong.stars.length > 0) {
    const mainStar = mingGong.stars.find(s => s.category === '主星') || mingGong.stars[0];
    if (mainStar) {
      const brightness = mainStar.brightness === '庙' || mainStar.brightness === '旺' 
        ? '强' 
        : mainStar.brightness === '陷' 
        ? '弱' 
        : '中';
      parts.push(`命宫${mainStar.name}${brightness}`);
    }
  }

  // 财帛宫
  if (caiBoGong && caiBoGong.stars.length > 0) {
    const hasGoodStars = caiBoGong.stars.some(s => 
      s.brightness === '庙' || s.brightness === '旺' || s.name === '武曲' || s.name === '天府'
    );
    if (hasGoodStars) {
      parts.push('财运');
    }
  }

  // 官禄宫
  if (guanLuGong && guanLuGong.stars.length > 0) {
    const hasGoodStars = guanLuGong.stars.some(s => 
      s.brightness === '庙' || s.brightness === '旺' || s.name === '紫微' || s.name === '天府'
    );
    if (hasGoodStars) {
      parts.push('事业');
    }
  }

  // 夫妻宫
  if (fuQiGong && fuQiGong.stars.length > 0) {
    const hasJi = fuQiGong.sihua?.ji;
    if (hasJi) {
      parts.push('感情需注意');
    } else {
      parts.push('感情');
    }
  }

  if (parts.length === 0) {
    return '命盘正在分析中，请稍候...';
  }

  return `你的命盘显示：${parts.join('、')}方面较为突出。`;
}

/**
 * 提取核心标签
 * 分析命盘，提取优势（庙旺的星曜）和需要注意的方面（陷的星曜或化忌）
 */
export function extractCoreTags(chartData: ZiweiChart): CoreTag[] {
  const tags: CoreTag[] = [];
  
  // 分析命宫、财帛宫、官禄宫、夫妻宫
  const keyPalaces = [
    { name: '命宫', icon: '🌟', field: 'personality' },
    { name: '财帛宫', icon: '💰', field: 'wealth' },
    { name: '官禄宫', icon: '💼', field: 'career' },
    { name: '夫妻宫', icon: '❤️', field: 'relationship' },
  ];

  for (const palaceInfo of keyPalaces) {
    const palace = chartData.palaces.find(p => p.name === palaceInfo.name);
    if (!palace) continue;

    // 检查是否有庙旺的主星
    const hasExcellentStars = palace.stars.some(s => 
      s.category === '主星' && (s.brightness === '庙' || s.brightness === '旺')
    );

    // 检查是否有化忌
    const hasJi = palace.sihua?.ji;

    if (hasExcellentStars && !hasJi) {
      // 优势标签
      let advantageText = '';
      if (palaceInfo.name === '命宫') advantageText = '性格';
      else if (palaceInfo.name === '财帛宫') advantageText = '财运';
      else if (palaceInfo.name === '官禄宫') advantageText = '事业';
      else if (palaceInfo.name === '夫妻宫') advantageText = '感情';

      tags.push({
        type: 'advantage',
        icon: palaceInfo.icon,
        text: `${advantageText}运佳`
      });
    } else if (hasJi || palace.stars.some(s => s.brightness === '陷')) {
      // 需要注意的标签
      let attentionText = '';
      if (palaceInfo.name === '命宫') attentionText = '性格';
      else if (palaceInfo.name === '财帛宫') attentionText = '财运';
      else if (palaceInfo.name === '官禄宫') attentionText = '事业';
      else if (palaceInfo.name === '夫妻宫') attentionText = '感情';

      tags.push({
        type: 'attention',
        icon: '⚠️',
        text: `${attentionText}需注意`
      });
    }
  }

  // 限制标签数量，最多3个
  return tags.slice(0, 3);
}

/**
 * 计算综合评分
 * 基于星曜亮度、四化、格局等因素计算0-100的分数
 */
export function calculateOverallScore(chartData: ZiweiChart): number {
  let score = 50; // 基础分

  // 1. 命宫主星亮度（+20分）
  const mingGong = chartData.palaces.find(p => p.name === '命宫');
  if (mingGong) {
    const mainStar = mingGong.stars.find(s => s.category === '主星');
    if (mainStar) {
      if (mainStar.brightness === '庙') score += 20;
      else if (mainStar.brightness === '旺') score += 15;
      else if (mainStar.brightness === '利') score += 10;
      else if (mainStar.brightness === '得') score += 5;
      else if (mainStar.brightness === '陷') score -= 10;
    }
  }

  // 2. 财帛宫、官禄宫、夫妻宫评分（+15分）
  const keyPalaces = ['财帛宫', '官禄宫', '夫妻宫'];
  for (const palaceName of keyPalaces) {
    const palace = chartData.palaces.find(p => p.name === palaceName);
    if (palace) {
      const hasGoodStars = palace.stars.some(s => 
        s.category === '主星' && (s.brightness === '庙' || s.brightness === '旺')
      );
      const hasJi = palace.sihua?.ji;
      
      if (hasGoodStars && !hasJi) score += 5;
      else if (hasJi) score -= 3;
    }
  }

  // 3. 四化影响（+10分）
  let sihuaScore = 0;
  chartData.palaces.forEach(palace => {
    if (palace.sihua) {
      if (palace.sihua.lu) sihuaScore += 2; // 化禄加分
      if (palace.sihua.quan) sihuaScore += 2; // 化权加分
      if (palace.sihua.ke) sihuaScore += 1; // 化科加分
      if (palace.sihua.ji) sihuaScore -= 2; // 化忌减分
    }
  });
  score += Math.min(sihuaScore, 10); // 最多+10分

  // 4. 格局加分（+5分）
  if (chartData.patterns && chartData.patterns.length > 0) {
    const excellentPatterns = chartData.patterns.filter(p => p.level === 'excellent');
    const goodPatterns = chartData.patterns.filter(p => p.level === 'good');
    score += excellentPatterns.length * 3;
    score += goodPatterns.length * 1;
  }

  // 限制在0-100之间
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * 生成完整的总结结果
 */
export async function generateSummaryResult(chartData: ZiweiChart): Promise<SummaryResult> {
  const summaryText = await generateSummary(chartData);
  const coreTags = extractCoreTags(chartData);
  const overallScore = calculateOverallScore(chartData);

  return {
    summaryText,
    summaryDescription: '基于你的命盘分析，以下是核心特点和建议',
    coreTags,
    overallScore
  };
}



