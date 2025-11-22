/**
 * 跨系统分析工具函数
 * 提供跨系统一致性分析和综合洞察生成功能
 */

import { CrossSystemAnalyzerService } from '../services/crossSystemService';
import type {
  CrossSystemAnalysis,
  IntegratedInsight,
  YijingResult,
  ZiweiResult,
  TarotResult,
} from '../types/cross-system';

/**
 * 分析三个系统的一致性
 * @param yijing 易经结果
 * @param ziwei 紫微结果
 * @param tarot 塔罗结果
 * @returns 一致性分析
 */
export function analyzeConsistency(
  yijing?: YijingResult,
  ziwei?: ZiweiResult,
  tarot?: TarotResult
): {
  level: 'high' | 'medium' | 'low';
  score: number;
  analysis: string;
} {
  return CrossSystemAnalyzerService.analyzeConsistency(yijing, ziwei, tarot);
}

/**
 * 生成综合洞察
 * @param analysis 跨系统分析结果
 * @returns 综合洞察
 */
export function generateIntegratedInsight(
  analysis: CrossSystemAnalysis
): IntegratedInsight {
  return CrossSystemAnalyzerService.generateIntegratedInsight(analysis);
}

/**
 * 检查是否有足够的系统结果进行分析
 * @param analysis 跨系统分析结果
 * @param minSystems 最少需要的系统数量（默认2）
 * @returns 是否有足够的结果
 */
export function hasEnoughSystems(
  analysis: CrossSystemAnalysis,
  minSystems: number = 2
): boolean {
  const systems = [analysis.yijing, analysis.ziwei, analysis.tarot].filter(Boolean);
  return systems.length >= minSystems;
}








