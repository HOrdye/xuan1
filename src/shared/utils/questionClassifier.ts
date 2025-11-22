/**
 * 问题类型识别工具函数
 * 导出便捷函数供各功能模块使用
 */

import { QuestionClassifierService } from '../services/crossSystemService';
import type { QuestionClassification, QuestionType, ZiweiPalace } from '../types/cross-system';

/**
 * 识别问题类型（便捷函数）
 * @param question 用户问题
 * @returns 问题类型识别结果
 */
export function classifyQuestion(question: string): QuestionClassification {
  return QuestionClassifierService.classify(question);
}

/**
 * 根据问题类型获取对应宫位（便捷函数）
 * @param questionType 问题类型
 * @returns 对应的紫微宫位
 */
export function getPalaceByQuestionType(questionType: QuestionType): ZiweiPalace {
  return QuestionClassifierService.getPalaceByQuestionType(questionType);
}

/**
 * 快速判断问题是否属于某个类型
 * @param question 用户问题
 * @param type 问题类型
 * @returns 是否匹配
 */
export function isQuestionType(question: string, type: QuestionType): boolean {
  const classification = classifyQuestion(question);
  return classification.type === type;
}








