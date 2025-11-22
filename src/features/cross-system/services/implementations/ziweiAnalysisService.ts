/**
 * 紫微分析服务实现
 * 实现 IZiweiAnalysisService 接口
 */

import type {
  IZiweiAnalysisService,
  ZiweiResult,
  ZiweiPalace,
} from '../analysisService';
import { useZiweiStore } from '@/features/ziwei/store/ziweiStore';
import { ZiweiFusionService } from '@/features/ziwei/services/fusionService';

/**
 * 紫微分析服务实现类
 */
export class ZiweiAnalysisService implements IZiweiAnalysisService {
  async analyze(
    question: string,
    relatedPalace?: ZiweiPalace,
    options?: any
  ): Promise<ZiweiResult | undefined> {
    try {
      const ziweiStore = useZiweiStore();

      // 检查是否有命盘数据
      if (!ziweiStore.currentChart) {
        console.warn('用户尚未生成命盘，无法进行紫微分析');
        // 返回提示信息
        return {
          chart: {
            palaces: [],
          },
          analysis: '请先前往紫微斗数页面生成你的命盘，然后才能获得紫微命盘分析。',
          advice: '建议你先完成命盘生成，这样可以得到更准确的命盘分析。',
          relatedPalace: relatedPalace || 'ming',
        };
      }

      const chart = ziweiStore.currentChart;

      // 使用融合服务生成命盘视角
      const palacePerspective = ZiweiFusionService.generatePalacePerspective(
        chart,
        question,
        '' // 卦象名称（可选）
      );

      const palaceNames: Record<ZiweiPalace, string> = {
        ming: '命宫',
        xiongdi: '兄弟宫',
        fuqi: '夫妻宫',
        zinu: '子女宫',
        cai: '财帛宫',
        jiluan: '疾厄宫',
        qianyi: '迁移宫',
        pugu: '仆役宫',
        guanlu: '官禄宫',
        tianzhai: '田宅宫',
        fude: '福德宫',
        fumu: '父母宫',
      };

      const targetPalace = relatedPalace || 'ming';

      // 获取相关宫位
      const relatedPalaceObj =
        chart.palaces.find(p => p.name === palaceNames[targetPalace]) ||
        chart.mingGong;

      return {
        chart: {
          palaces: chart.palaces.map(p => ({
            palace: targetPalace,
            mainStars: p.stars
              .filter(s => s.category === '主星')
              .map(s => s.name as any),
            sihua: [], // TODO: 添加四化信息
          })),
        },
        analysis:
          palacePerspective.palaceAnalysis ||
          `根据你的命盘，${palaceNames[targetPalace]}显示相关能量较强，适合在这个方面采取行动。`,
        advice:
          palacePerspective.integratedAdvice ||
          '建议你在这个方面保持谨慎，同时积极寻找机会。',
        relatedPalace: targetPalace,
      };
    } catch (error) {
      console.error('紫微命盘分析失败:', error);
      return {
        chart: {
          palaces: [],
        },
        analysis: '紫微命盘分析遇到问题，请稍后重试。',
        advice: '建议你稍后重试，或先前往紫微斗数页面生成命盘。',
        relatedPalace: relatedPalace || 'ming',
      };
    }
  }
}








