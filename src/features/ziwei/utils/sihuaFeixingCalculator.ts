/**
 * 四化飞星计算器
 * 实现四化飞入各宫位的算法
 */

import type { Palace, Sihua, Tiangan } from '../types';
import { getSihuaByTiangan } from '../data/sihua';

/**
 * 四化飞星结果
 */
export interface SihuaFeixingResult {
  lu: Array<{ palaceIndex: number; star: string }>;  // 化禄飞入的宫位
  quan: Array<{ palaceIndex: number; star: string }>; // 化权飞入的宫位
  ke: Array<{ palaceIndex: number; star: string }>;   // 化科飞入的宫位
  ji: Array<{ palaceIndex: number; star: string }>;    // 化忌飞入的宫位
}

/**
 * 计算四化飞星
 * 根据宫干和四化表，计算四化飞入各宫位
 * 
 * @param palaces 12个宫位
 * @param sihua 四化表（生年四化或流年四化等）
 * @returns 四化飞星结果
 */
export function calculateSihuaFeixing(
  palaces: Palace[],
  sihua: Sihua
): SihuaFeixingResult {
  const result: SihuaFeixingResult = {
    lu: [],
    quan: [],
    ke: [],
    ji: []
  };

  // 遍历所有宫位
  for (let i = 0; i < palaces.length; i++) {
    const palace = palaces[i];
    
    if (!palace.tiangan) continue; // 如果没有宫干，跳过

    // 计算该宫干的四化
    const palaceSihua = getSihuaByTiangan(palace.tiangan);

    // 检查该宫位的星曜是否有四化
    for (const star of palace.stars) {
      // 检查化禄
      if (sihua.lu && star.name === sihua.lu) {
        result.lu.push({ palaceIndex: i, star: star.name });
      }
      
      // 检查化权
      if (sihua.quan && star.name === sihua.quan) {
        result.quan.push({ palaceIndex: i, star: star.name });
      }
      
      // 检查化科
      if (sihua.ke && star.name === sihua.ke) {
        result.ke.push({ palaceIndex: i, star: star.name });
      }
      
      // 检查化忌
      if (sihua.ji && star.name === sihua.ji) {
        result.ji.push({ palaceIndex: i, star: star.name });
      }
    }

    // 检查宫干四化（四化飞星）
    // 如果宫干对应的星曜有化禄/权/科/忌，则四化飞入该宫位
    if (palaceSihua.lu && sihua.lu && palaceSihua.lu === sihua.lu) {
      result.lu.push({ palaceIndex: i, star: palaceSihua.lu });
    }
    if (palaceSihua.quan && sihua.quan && palaceSihua.quan === sihua.quan) {
      result.quan.push({ palaceIndex: i, star: palaceSihua.quan });
    }
    if (palaceSihua.ke && sihua.ke && palaceSihua.ke === sihua.ke) {
      result.ke.push({ palaceIndex: i, star: palaceSihua.ke });
    }
    if (palaceSihua.ji && sihua.ji && palaceSihua.ji === sihua.ji) {
      result.ji.push({ palaceIndex: i, star: palaceSihua.ji });
    }
  }

  return result;
}

/**
 * 获取四化飞星的说明
 */
export function getSihuaFeixingDescription(feixing: SihuaFeixingResult): string {
  const descriptions: string[] = [];

  if (feixing.lu.length > 0) {
    descriptions.push(`化禄飞入：${feixing.lu.map(f => `第${f.palaceIndex + 1}宫(${f.star})`).join('、')}`);
  }
  if (feixing.quan.length > 0) {
    descriptions.push(`化权飞入：${feixing.quan.map(f => `第${f.palaceIndex + 1}宫(${f.star})`).join('、')}`);
  }
  if (feixing.ke.length > 0) {
    descriptions.push(`化科飞入：${feixing.ke.map(f => `第${f.palaceIndex + 1}宫(${f.star})`).join('、')}`);
  }
  if (feixing.ji.length > 0) {
    descriptions.push(`化忌飞入：${feixing.ji.map(f => `第${f.palaceIndex + 1}宫(${f.star})`).join('、')}`);
  }

  return descriptions.join('\n');
}

