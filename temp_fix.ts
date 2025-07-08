/**
 * 本地塔罗牌解读（备用方案）- 改进版
 */
private static getLocalTarotReading(
  cards: Array<{chineseName: string, name: string, keywords: string[]}>,
  positions: string[],
  question: string
): StructuredTarotInterpretation {
  // 为每张牌生成基础解读
  const cardAnalyses = cards.map((card, index) => {
    const position = positions[index];
    const positionMeaning = this.getPositionMeaning(position, this.analyzeQuestionType(question));
    
    return {
      cardName: card.chineseName,
      position: position,
      interpretation: `在${position}位置，${card.chineseName}代表${card.keywords.slice(0, 2).join('、')}。${positionMeaning}这张牌提示您关注${card.keywords[0]}的能量，为当前的情况带来${card.keywords[1] || '智慧'}的指引。`
    };
  });

  const elementalGuidance = this.analyzeCardCombination(cards);

  return {
    overallInterpretation: {
      title: '整体解读 (本地分析)',
      content: `${question ? `针对您的问题"${question}"，` : ''}塔罗牌给出了以下指引：\n\n牌阵的整体能量显示：${elementalGuidance}`
    },
    cardInterpretations: cardAnalyses,
    guidance: {
      title: '行动指导',
      content: `根据中心牌 ${cards[1]?.chineseName || cards[0].chineseName} 的启示，您当前最需要的是${cards[1]?.keywords[0] || cards[0].keywords[0]}。请相信您的内在智慧，果断行动。`
    },
    summary: {
      title: '占卜总结',
      content: '本地解读提供基础指引。每个人都是自己命运的创造者，请拥抱变化，信任过程。如需更深度分析，请配置LLM API。'
    }
  };
} 