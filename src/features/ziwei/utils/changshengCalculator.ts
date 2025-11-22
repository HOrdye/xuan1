/**
 * 长生十二神计算器
 * 实现长生十二神在12宫位的分布计算
 */

import type { WuxingJu, Dizhi, ChangshengStatus } from '../types';
import { getDizhiIndex } from './dizhiCalculator';

/**
 * 长生十二神列表（按顺序）
 */
export const CHANGSHENG_LIST: ChangshengStatus[] = [
  '长生', '沐浴', '冠带', '临官', '帝旺', '衰',
  '病', '死', '墓', '绝', '胎', '养'
];

/**
 * 五行局对应的长生位置
 * 
 * 规则：
 * - 水二局：长生在申（金生水）
 * - 木三局：长生在亥（水生木）
 * - 金四局：长生在巳（火生金，但金长生在巳）
 * - 土五局：长生在申（土长生在申）
 * - 火六局：长生在寅（木生火）
 * 
 * 注意：实际规则更复杂，这里使用标准规则
 */
const WUXINGJU_CHANGSHENG_POSITION: Record<WuxingJu, Dizhi> = {
  '水二局': '申', // 水长生在申
  '木三局': '亥', // 木长生在亥
  '金四局': '巳', // 金长生在巳
  '土五局': '申', // 土长生在申
  '火六局': '寅'  // 火长生在寅
};

/**
 * 计算长生十二神在12宫位的分布
 * 
 * @param wuxingJu 五行局
 * @param mingGongDizhi 命宫地支
 * @param palaceDizhiList 12个宫位的地支数组
 * @returns 12个宫位的长生十二神状态数组（索引0对应命宫）
 */
export function calculateChangsheng(
  wuxingJu: WuxingJu,
  mingGongDizhi: Dizhi,
  palaceDizhiList: Dizhi[]
): Record<number, ChangshengStatus> {
  // 获取长生位置的地支
  const changshengDizhi = WUXINGJU_CHANGSHENG_POSITION[wuxingJu];
  const changshengDizhiIndex = getDizhiIndex(changshengDizhi);
  
  const result: Record<number, ChangshengStatus> = {};
  
  // 为每个宫位计算长生十二神状态
  for (let i = 0; i < 12; i++) {
    const palaceDizhi = palaceDizhiList[i];
    const palaceDizhiIndex = getDizhiIndex(palaceDizhi);
    
    // 计算该宫位地支与长生位置的差
    // 注意：需要判断是顺行还是逆行
    // 标准规则：从长生位置开始，顺时针排列长生十二神
    
    // 计算地支差（考虑顺行）
    let dizhiDiff = (palaceDizhiIndex - changshengDizhiIndex + 12) % 12;
    
    // 获取对应的长生十二神状态
    result[i] = CHANGSHENG_LIST[dizhiDiff];
  }
  
  return result;
}

/**
 * 获取长生十二神的含义说明
 */
export function getChangshengDescription(status: ChangshengStatus): string {
  const descriptions: Record<ChangshengStatus, string> = {
    '长生': '新生、开始、成长',
    '沐浴': '学习、变化、不稳定',
    '冠带': '成长、发展、准备',
    '临官': '成熟、胜任、发展',
    '帝旺': '最旺、巅峰、最强',
    '衰': '衰退、减弱、下降',
    '病': '问题、困难、需要调理',
    '死': '结束、静止、无活力',
    '墓': '收藏、隐藏、积累',
    '绝': '断绝、最低点、重新开始',
    '胎': '孕育、准备、萌芽',
    '养': '培养、滋养、成长'
  };
  
  return descriptions[status] || '';
}

