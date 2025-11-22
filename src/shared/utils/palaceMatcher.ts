/**
 * 宫位匹配工具函数
 * 提供选项与宫位的匹配功能
 */

import { PalaceMatcherService } from '../services/crossSystemService';
import type { QuestionType, ZiweiPalace } from '../types/cross-system';

/**
 * 匹配选项到宫位（用于两难抉择）
 * @param option 选项文本
 * @param questionType 问题类型
 * @returns 匹配的宫位和评分
 */
export function matchOptionToPalace(
  option: string,
  questionType: QuestionType
): {
  palace: ZiweiPalace;
  matchScore: number;
  keywords: string[];
} {
  return PalaceMatcherService.matchOptionToPalace(option, questionType);
}

/**
 * 批量匹配多个选项到宫位
 * @param options 选项数组
 * @param questionType 问题类型
 * @returns 匹配结果数组
 */
export function matchOptionsToPalaces(
  options: string[],
  questionType: QuestionType
): Array<{
  option: string;
  palace: ZiweiPalace;
  matchScore: number;
  keywords: string[];
}> {
  return options.map(option => ({
    option,
    ...matchOptionToPalace(option, questionType),
  }));
}








