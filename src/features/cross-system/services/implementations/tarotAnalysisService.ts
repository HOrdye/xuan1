/**
 * 塔罗分析服务实现
 * 实现 ITarotAnalysisService 接口
 */

import type { ITarotAnalysisService, TarotResult } from '../analysisService';
import { TarotReader, classicSpreads } from '@/features/tarot/utils/tarotInterpretation';
import { drawCards } from '@/features/tarot/utils/standardTarotData';

/**
 * 塔罗分析服务实现类
 */
export class TarotAnalysisService implements ITarotAnalysisService {
  async analyze(question: string, options?: any): Promise<TarotResult | undefined> {
    try {
      // 选择三张牌牌阵（最通用）
      const spread =
        classicSpreads.find(s => s.name === 'Three Card Spread') ||
        classicSpreads[0];

      // 抽取三张牌
      const drawnCards = drawCards(spread.positions.length);

      // 生成逆位数组（30%概率逆位）
      const isReversed = drawnCards.map(() => Math.random() > 0.7);

      // 进行解读
      const reading = TarotReader.performReading(
        drawnCards,
        spread,
        question,
        isReversed
      );

      // 转换为结果格式
      return {
        cards: reading.cards.map((drawnCard, index) => ({
          name: drawnCard.card.chineseName || drawnCard.card.name,
          position:
            spread.positions[index]?.chineseName ||
            spread.positions[index]?.name ||
            '',
          meaning: drawnCard.interpretation.cardMeaning,
        })),
        overallInterpretation: reading.overallInterpretation,
        advice: reading.advice,
      };
    } catch (error) {
      console.error('塔罗占卜分析失败:', error);
      // 降级方案：返回基础牌阵信息
      return {
        cards: [
          {
            name: '愚者',
            position: '过去',
            meaning: '代表新的开始和冒险精神',
          },
          {
            name: '魔术师',
            position: '现在',
            meaning: '代表行动力和创造力',
          },
          {
            name: '世界',
            position: '未来',
            meaning: '代表完成和圆满',
          },
        ],
        overallInterpretation: '整体来看，这是一个充满希望和可能性的牌阵。',
        advice: '保持开放的心态，勇敢地迎接新的挑战。',
      };
    }
  }
}








