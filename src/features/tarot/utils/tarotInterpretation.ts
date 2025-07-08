/**
 * 标准塔罗牌解读系统
 * 基于传统塔罗牌理论，包括数字学、元素学、占星学等
 */

import { StandardTarotCard } from './standardTarotData';

/**
 * 塔罗牌阵类型
 */
export interface TarotSpread {
  name: string;
  chineseName: string;
  positions: TarotPosition[];
  description: string;
  bestFor: string[];
}

export interface TarotPosition {
  name: string;
  chineseName: string;
  meaning: string;
  index: number;
}

/**
 * 塔罗牌解读结果
 */
export interface TarotReading {
  spreadName: string;
  question?: string;
  cards: DrawnCard[];
  overallInterpretation: string;
  elementalAnalysis: ElementalAnalysis;
  numerologicalInsight: string;
  advice: string;
  timeframe?: string;
}

export interface DrawnCard {
  card: StandardTarotCard;
  position: TarotPosition;
  isReversed: boolean;
  interpretation: CardInterpretation;
}

export interface CardInterpretation {
  positionMeaning: string;
  cardMeaning: string;
  combination: string;
  advice: string;
}

export interface ElementalAnalysis {
  dominantElement: string;
  elementalBalance: {
    fire: number;
    water: number;
    air: number;
    earth: number;
  };
  interpretation: string;
}

/**
 * 经典塔罗牌阵配置
 */
export const classicSpreads: TarotSpread[] = [
  {
    name: 'Three Card Spread',
    chineseName: '三张牌占卜法',
    positions: [
      { name: 'Past', chineseName: '过去', meaning: '影响当前情况的过去事件或经历', index: 0 },
      { name: 'Present', chineseName: '现在', meaning: '当前的状况和面临的挑战', index: 1 },
      { name: 'Future', chineseName: '未来', meaning: '基于当前路径的可能结果', index: 2 }
    ],
    description: '最经典的塔罗牌阵，展现事物的时间线发展。万能型占卜，可以应用在所有场合，常用于简单事物的占卜，根据牌面进行解析，直指核心。',
    bestFor: ['一般性问题', '了解事态发展', '快速指引', '综合分析', '单事解析']
  },
  {
    name: 'Love Pyramid Spread',
    chineseName: '恋人金字塔',
    positions: [
      { name: 'Foundation', chineseName: '关系基础', meaning: '这段关系的核心基础和根本连接', index: 0 },
      { name: 'Your Heart', chineseName: '你的内心', meaning: '你在这段关系中的真实想法和感受', index: 1 },
      { name: 'Their Heart', chineseName: '对方内心', meaning: '对方在这段关系中的真实想法和感受', index: 2 },
      { name: 'Relationship Future', chineseName: '关系未来', meaning: '这段关系的发展前景和可能走向', index: 3 }
    ],
    description: '简洁有效，条理清晰，适合占卜恋人关系的占卜。两个人之间遇到矛盾或迷茫，可以通过这个牌阵占卜未来的发展趋势。',
    bestFor: ['恋人关系', '感情发展', '关系互动', '情感分析', '爱情指引']
  },
  {
    name: 'Two Choice Spread',
    chineseName: '二选一牌阵',
    positions: [
      { name: 'Current Situation', chineseName: '当前状况', meaning: '你现在面临的具体情况和背景', index: 0 },
      { name: 'Option A', chineseName: '选择A', meaning: '第一个选择的特点、优势和可能结果', index: 1 },
      { name: 'Option B', chineseName: '选择B', meaning: '第二个选择的特点、优势和可能结果', index: 2 },
      { name: 'Hidden Factors', chineseName: '隐藏因素', meaning: '影响决策但尚未显现的关键因素', index: 3 },
      { name: 'Best Path', chineseName: '最佳路径', meaning: '宇宙为你指出的最佳选择方向', index: 4 }
    ],
    description: '需要二选一适用于三种情况选择其中一种。在判断情况、决定方向等解析中应用广泛。',
    bestFor: ['重要抉择', '职业选择', '人生决策', '方向判断', '选择困难']
  },
  {
    name: 'Wealth Tree Spread',
    chineseName: '财富之树',
    positions: [
      { name: 'Root', chineseName: '根基', meaning: '你的财富基础和赚钱能力的根源', index: 0 },
      { name: 'Growth', chineseName: '成长', meaning: '当前财富积累的状况和发展趋势', index: 1 },
      { name: 'Obstacles', chineseName: '阻碍', meaning: '影响财富增长的障碍和需要克服的问题', index: 2 },
      { name: 'Opportunity', chineseName: '机遇', meaning: '即将到来的财富机会和投资时机', index: 3 },
      { name: 'Harvest', chineseName: '收获', meaning: '通过努力可以获得的财富成果和收益', index: 4 }
    ],
    description: '解析财富的生成、可指示财富脉搏，对求财有积极的指导意义。通过对财富的梳理，健全适合自己的财富模式。',
    bestFor: ['财运分析', '投资决策', '事业发展', '财务规划', '收入提升']
  },
  {
    name: 'Six Star Spread',
    chineseName: '六芒星牌阵',
    positions: [
      { name: 'Current State', chineseName: '现状', meaning: '当前事物的整体状况和发展阶段', index: 0 },
      { name: 'Conscious Mind', chineseName: '意识层面', meaning: '你对这件事的理性认知和表面想法', index: 1 },
      { name: 'Subconscious', chineseName: '潜意识', meaning: '内心深处的真实想法和隐藏动机', index: 2 },
      { name: 'Past Influence', chineseName: '过去影响', meaning: '来自过去的经验对当前的影响', index: 3 },
      { name: 'Future Potential', chineseName: '未来潜力', meaning: '事物未来发展的可能性和潜在结果', index: 4 },
      { name: 'External Environment', chineseName: '外在环境', meaning: '周围环境和外部因素的影响', index: 5 },
      { name: 'Final Outcome', chineseName: '最终结果', meaning: '事物发展的最终走向和结果', index: 6 }
    ],
    description: '本牌阵判断事情走向，有积极的指导意义。可分析潜意识与显意识的表达，有着极强的颇视未来能力。',
    bestFor: ['事物发展', '未来预测', '深度分析', '潜意识探索', '全面指引']
  },
  {
    name: 'Celtic Cross Spread',
    chineseName: '凯尔特牌阵',
    positions: [
      { name: 'Present Situation', chineseName: '现状核心', meaning: '当前的核心问题或中心情况', index: 0 },
      { name: 'Challenge', chineseName: '挑战困难', meaning: '面临的主要障碍、冲突或需要解决的问题', index: 1 },
      { name: 'Distant Past', chineseName: '远期过去', meaning: '深层次的根源背景或形成现状的历史因素', index: 2 },
      { name: 'Recent Past', chineseName: '近期过去', meaning: '最近发生的相关事件或近期的重要影响', index: 3 },
      { name: 'Possible Future', chineseName: '可能未来', meaning: '按照当前发展路径可能出现的结果', index: 4 },
      { name: 'Near Future', chineseName: '近期未来', meaning: '接下来即将发生的事情或短期内的发展', index: 5 },
      { name: 'Your Approach', chineseName: '你的态度', meaning: '你对这个情况的内在态度和处理方式', index: 6 },
      { name: 'External Influences', chineseName: '外在影响', meaning: '周围环境、他人对你的影响和外部条件', index: 7 },
      { name: 'Hopes and Fears', chineseName: '希望恐惧', meaning: '你内心深处的期望、担忧和潜在情绪', index: 8 },
      { name: 'Final Outcome', chineseName: '最终结果', meaning: '整个情况的最终走向和结果', index: 9 }
    ],
    description: '经久弥新的古老塔罗牌阵，来自推崇、备受推崇的凯尔特十字牌阵。通过对事物的层层剖析，抽丝剥茧，帮助做出扶择。',
    bestFor: ['复杂问题', '人生重大决定', '深度自我探索', '事件整体分析', '宏观审视']
  }
];

/**
 * 塔罗牌解读引擎
 */
export class TarotReader {
  /**
   * 进行完整的塔罗牌解读
   */
  static performReading(
    cards: StandardTarotCard[], 
    spread: TarotSpread, 
    question?: string,
    isReversed: boolean[] = []
  ): TarotReading {
    // 创建抽牌结果
    const drawnCards: DrawnCard[] = cards.map((card, index) => ({
      card,
      position: spread.positions[index],
      isReversed: isReversed[index] || false,
      interpretation: this.interpretCardInPosition(card, spread.positions[index], isReversed[index] || false)
    }));

    // 元素分析
    const elementalAnalysis = this.analyzeElements(cards);

    // 数字学洞察
    const numerologicalInsight = this.analyzeNumerology(cards);

    // 整体解读
    const overallInterpretation = this.generateOverallInterpretation(drawnCards, spread, question);

    // 建议
    const advice = this.generateAdvice(drawnCards, elementalAnalysis);

    return {
      spreadName: spread.chineseName,
      question,
      cards: drawnCards,
      overallInterpretation,
      elementalAnalysis,
      numerologicalInsight,
      advice,
      timeframe: this.suggestTimeframe(cards)
    };
  }

  /**
   * 解读单张牌在特定位置的含义
   */
  private static interpretCardInPosition(
    card: StandardTarotCard, 
    position: TarotPosition, 
    isReversed: boolean
  ): CardInterpretation {
    const cardMeaning = isReversed ? card.reversed.meaning : card.upright.meaning;
    
    const combination = this.combineCardAndPosition(card, position, isReversed);
    
    const advice = this.generateCardAdvice(card, position, isReversed);

    return {
      positionMeaning: position.meaning,
      cardMeaning,
      combination,
      advice
    };
  }

  /**
   * 结合牌意和牌位含义
   */
  private static combineCardAndPosition(
    card: StandardTarotCard, 
    position: TarotPosition, 
    isReversed: boolean
  ): string {
    const baseMeaning = isReversed ? card.reversed.meaning : card.upright.meaning;
    const keywords = card.keywords;
    
    // 根据牌位调整解读重点
    switch (position.name.toLowerCase()) {
      // 时间相关位置
      case 'past':
      case 'distant past':
      case 'recent past':
      case 'past influence':
        return `在${position.chineseName}的位置，${card.chineseName}表示：${baseMeaning}这段经历为当前情况奠定了基础，其影响依然存在。`;
      
      case 'present':
      case 'present situation':
      case 'current state':
      case 'current situation':
        return `在${position.chineseName}的位置，${card.chineseName}揭示：${baseMeaning}这是您目前需要重点关注的核心主题。`;
      
      case 'future':
      case 'near future':
      case 'possible future':
      case 'possible outcome':
      case 'final outcome':
      case 'future potential':
      case 'relationship future':
        return `在${position.chineseName}的位置，${card.chineseName}预示着：${baseMeaning}这种趋势将在未来显现。`;
      
      // 挑战和障碍
      case 'challenge':
      case 'challenges':
      case 'obstacles':
        return `作为${position.chineseName}，${card.chineseName}指出：${baseMeaning}这是您需要克服的主要障碍。`;
      
      // 建议和指导
      case 'advice':
      case 'best path':
        return `作为${position.chineseName}，${card.chineseName}建议：${baseMeaning}这将是最佳的行动方向。`;
      
      // 恋人金字塔特定位置
      case 'foundation':
        return `作为${position.chineseName}，${card.chineseName}揭示：${baseMeaning}这是你们关系的核心根基，决定了整体的稳固程度。`;
      
      case 'your heart':
        return `在${position.chineseName}的位置，${card.chineseName}反映：${baseMeaning}这代表了您内心最真实的感受和想法。`;
      
      case 'their heart':
        return `在${position.chineseName}的位置，${card.chineseName}显示：${baseMeaning}这反映了对方的真实感受和内心想法。`;
      
      // 二选一牌阵特定位置
      case 'option a':
        return `作为${position.chineseName}，${card.chineseName}表明：${baseMeaning}选择这个方向将会带来这样的结果和体验。`;
      
      case 'option b':
        return `作为${position.chineseName}，${card.chineseName}表明：${baseMeaning}选择这个方向将会带来这样的结果和体验。`;
      
      case 'hidden factors':
        return `作为${position.chineseName}，${card.chineseName}揭示：${baseMeaning}这是影响您决策但尚未被注意到的重要因素。`;
      
      // 财富之树特定位置
      case 'root':
        return `作为${position.chineseName}，${card.chineseName}显示：${baseMeaning}这是您财富能力的根本源泉，是一切财运的基础。`;
      
      case 'growth':
        return `在${position.chineseName}的位置，${card.chineseName}表示：${baseMeaning}这反映了您当前财富积累的状况和发展轨迹。`;
      
      case 'opportunity':
        return `作为${position.chineseName}，${card.chineseName}指向：${baseMeaning}这是即将到来的财富机会，需要您敏锐地把握。`;
      
      case 'harvest':
        return `在${position.chineseName}的位置，${card.chineseName}预示：${baseMeaning}这是通过努力可以获得的财富收获和成果。`;
      
      // 六芒星牌阵特定位置
      case 'conscious mind':
        return `在${position.chineseName}的位置，${card.chineseName}反映：${baseMeaning}这是您理性层面的认知和表面的想法。`;
      
      case 'subconscious':
        return `在${position.chineseName}的位置，${card.chineseName}揭示：${baseMeaning}这是您潜意识中的真实想法和隐藏的动机。`;
      
      case 'external environment':
        return `作为${position.chineseName}，${card.chineseName}显示：${baseMeaning}这是周围环境和外部因素对您的影响。`;
      
      // 凯尔特牌阵特定位置
      case 'your approach':
        return `在${position.chineseName}的位置，${card.chineseName}反映：${baseMeaning}这是您内在的态度和处理问题的方式。`;
      
      case 'external influences':
        return `作为${position.chineseName}，${card.chineseName}显示：${baseMeaning}这是来自外界的重要影响因素。`;
      
      case 'hopes and fears':
        return `在${position.chineseName}的位置，${card.chineseName}揭示：${baseMeaning}这反映了您内心深处的期望与担忧。`;
      
      default:
        return `在${position.chineseName}的位置，${card.chineseName}显示：${baseMeaning}关键词：${keywords.join('、')}`;
    }
  }

  /**
   * 元素分析
   */
  private static analyzeElements(cards: StandardTarotCard[]): ElementalAnalysis {
    const elementCount = { fire: 0, water: 0, air: 0, earth: 0 };
    
    cards.forEach(card => {
      if (card.element) {
        elementCount[card.element as 'fire' | 'water' | 'air' | 'earth']++;
      }
    });

    // 找出主导元素
    const dominantElement = Object.entries(elementCount)
      .reduce((a, b) => elementCount[a[0] as 'fire' | 'water' | 'air' | 'earth'] > elementCount[b[0] as 'fire' | 'water' | 'air' | 'earth'] ? a : b)[0] as 'fire' | 'water' | 'air' | 'earth';

    // 元素解读
    const interpretations = {
      fire: '火元素占主导，表示这是一个充满激情、行动和创造力的时期。您需要发挥主动性和领导力。',
      water: '水元素占主导，表示情感、直觉和精神层面的因素很重要。倾听内心的声音，重视情感连接。',
      air: '风元素占主导，表示思维、沟通和学习是关键。需要理性分析，加强交流和信息收集。',
      earth: '土元素占主导，表示实际行动、物质基础和稳定性很重要。脚踏实地，注重实际结果。'
    };

    return {
      dominantElement,
      elementalBalance: elementCount,
      interpretation: interpretations[dominantElement as keyof typeof interpretations]
    };
  }

  /**
   * 数字学分析
   */
  private static analyzeNumerology(cards: StandardTarotCard[]): string {
    const numbers = cards
      .filter(card => card.number !== undefined)
      .map(card => card.number!);
    
    if (numbers.length === 0) return '这次抽牌以大阿尔卡纳为主，表示重大的人生主题和精神成长的时期。';

    const total = numbers.reduce((sum, num) => sum + num, 0);
    const average = Math.round(total / numbers.length);

    const numerologyMeanings = {
      1: '新开始的能量强烈，这是启动新项目或改变的理想时机。',
      2: '合作和平衡的主题突出，关注人际关系和双方的和谐。',
      3: '创造力和沟通力旺盛，是表达自己和展现才华的时期。',
      4: '稳定和建设的时期，需要脚踏实地地建立坚实的基础。',
      5: '变化和冒险的时期，打破常规，拥抱新的体验。',
      6: '责任和关怀的主题，关注家庭、社区和服务他人。',
      7: '内省和精神成长的时期，寻求更深层的智慧和理解。',
      8: '物质成就和权力的时期，专注于实际的成果和成功。',
      9: '完成和智慧的时期，一个周期即将结束，准备新的开始。',
      10: '完满和新循环的开始，享受成果的同时准备下一个阶段。'
    };

    return numerologyMeanings[average as keyof typeof numerologyMeanings] || 
           '数字能量复杂多样，表示生活的多个层面都在同时发展。';
  }

  /**
   * 生成整体解读
   */
  private static generateOverallInterpretation(
    drawnCards: DrawnCard[], 
    spread: TarotSpread, 
    question?: string
  ): string {
    let interpretation = '';
    
    if (question) {
      interpretation += `针对您的问题"${question}"，塔罗牌给出了以下指引：\n\n`;
    }

    interpretation += `这次使用${spread.chineseName}进行占卜，从多个角度为您揭示当前的状况：\n\n`;

    // 根据不同牌阵提供专业解读
    interpretation += this.generateSpreadSpecificInterpretation(spread, drawnCards);

    // 分析主要主题
    const majorArcanaCount = drawnCards.filter(dc => dc.card.category === 'major').length;
    const reversedCount = drawnCards.filter(dc => dc.isReversed).length;

    if (majorArcanaCount > drawnCards.length / 2) {
      interpretation += `这次抽牌中大阿尔卡纳较多，表示您正处于人生的重要转折点，面临的是具有深远影响的重大主题。\n\n`;
    }

    if (reversedCount > drawnCards.length / 2) {
      interpretation += `较多的逆位牌出现，提醒您需要内省和调整，关注内在的阻碍和需要改善的方面。\n\n`;
    }

    // 添加牌与牌之间的关联
    interpretation += this.analyzeCardConnections(drawnCards);

    return interpretation;
  }

  /**
   * 根据牌阵类型生成专业解读
   */
  private static generateSpreadSpecificInterpretation(spread: TarotSpread, drawnCards: DrawnCard[]): string {
    switch (spread.name) {
      case 'Love Pyramid Spread':
        return this.interpretLovePyramid(drawnCards);
      
      case 'Two Choice Spread':
        return this.interpretTwoChoice(drawnCards);
      
      case 'Wealth Tree Spread':
        return this.interpretWealthTree(drawnCards);
      
      case 'Six Star Spread':
        return this.interpretSixStar(drawnCards);
      
      case 'Celtic Cross Spread':
        return this.interpretCelticCross(drawnCards);
      
      case 'Three Card Spread':
        return this.interpretThreeCard(drawnCards);
      
      default:
        return '';
    }
  }

  /**
   * 恋人金字塔专业解读
   */
  private static interpretLovePyramid(drawnCards: DrawnCard[]): string {
    const [foundation, yourHeart, theirHeart, future] = drawnCards;
    
    let interpretation = '💕 恋人金字塔显示了你们关系的完整图景：\n\n';
    
    // 分析关系基础
    interpretation += `关系的根基显示${foundation.card.chineseName}，`;
    if (foundation.card.category === 'major') {
      interpretation += '这表明你们的连接具有深刻的精神意义和重要的人生意义。';
    } else if (foundation.card.suit === 'cups') {
      interpretation += '情感基础深厚，你们之间有真挚的情感连接。';
    } else if (foundation.card.suit === 'wands') {
      interpretation += '关系充满激情和活力，彼此激发创造力。';
    } else if (foundation.card.suit === 'swords') {
      interpretation += '理性沟通是你们关系的基础，重视精神交流。';
    } else if (foundation.card.suit === 'pentacles') {
      interpretation += '关系建立在实际考虑之上，注重稳定和安全感。';
    }
    interpretation += '\n\n';
    
    // 对比双方内心
    interpretation += `从内心世界来看，你的感受是${yourHeart.card.chineseName}，对方的感受是${theirHeart.card.chineseName}。`;
    if (yourHeart.card.suit === theirHeart.card.suit) {
      interpretation += '你们在情感层面非常同步，有着相似的感受和期待。';
    } else {
      interpretation += '你们的感受有所不同，需要更多的理解和沟通来达成共识。';
    }
    interpretation += '\n\n';
    
    return interpretation;
  }

  /**
   * 二选一牌阵专业解读
   */
  private static interpretTwoChoice(drawnCards: DrawnCard[]): string {
    const [current, optionA, optionB, hidden, bestPath] = drawnCards;
    
    let interpretation = '⚖️ 二选一牌阵为您的抉择提供清晰指引：\n\n';
    
    interpretation += `当前状况：${current.card.chineseName}表明您正处在需要做出重要决定的关键时刻。\n\n`;
    
    // 对比两个选择
    interpretation += `选择对比分析：\n`;
    interpretation += `• 选择A (${optionA.card.chineseName})：`;
    if (optionA.card.category === 'major') {
      interpretation += '这个选择将带来重大的人生转变，';
    }
    interpretation += `${optionA.isReversed ? '可能面临一些挑战，需要谨慎考虑' : '发展前景积极，值得考虑'}。\n`;
    
    interpretation += `• 选择B (${optionB.card.chineseName})：`;
    if (optionB.card.category === 'major') {
      interpretation += '这个选择同样具有深远意义，';
    }
    interpretation += `${optionB.isReversed ? '可能遇到阻碍，需要额外努力' : '展现良好的发展潜力'}。\n\n`;
    
    // 隐藏因素分析
    interpretation += `隐藏因素${hidden.card.chineseName}提醒您注意：可能有您尚未察觉的重要因素会影响最终决定。\n\n`;
    
    // 最佳路径指引
    interpretation += `宇宙的指引${bestPath.card.chineseName}表明：`;
    if (!bestPath.isReversed) {
      interpretation += '遵循这个指引将帮助您做出最佳选择。';
    } else {
      interpretation += '避免冲动决定，需要更多时间思考和准备。';
    }
    interpretation += '\n\n';
    
    return interpretation;
  }

  /**
   * 财富之树专业解读
   */
  private static interpretWealthTree(drawnCards: DrawnCard[]): string {
    const [root, growth, obstacles, opportunity, harvest] = drawnCards;
    
    let interpretation = '💰 财富之树展现了您的财运全貌：\n\n';
    
    interpretation += `财富根基：${root.card.chineseName}揭示了您的赚钱能力来源。`;
    if (root.card.suit === 'pentacles') {
      interpretation += '您有良好的理财基础和实用技能。';
    } else if (root.card.suit === 'wands') {
      interpretation += '您的财富主要来自创造力和领导才能。';
    } else if (root.card.suit === 'cups') {
      interpretation += '人际关系和情感智慧是您的财富源泉。';
    } else if (root.card.suit === 'swords') {
      interpretation += '知识、技能和沟通能力是您的财富基础。';
    }
    interpretation += '\n\n';
    
    // 分析成长和障碍
    interpretation += `成长状况：${growth.card.chineseName}显示您当前的财富积累${growth.isReversed ? '遇到瓶颈，需要调整策略' : '呈现积极发展态势'}。\n\n`;
    
    interpretation += `主要障碍：${obstacles.card.chineseName}指出了影响财富增长的因素，`;
    interpretation += `${obstacles.isReversed ? '这些障碍正在被克服' : '需要重点关注和解决'}。\n\n`;
    
    // 机遇和收获
    interpretation += `财富机遇：${opportunity.card.chineseName}预示着即将到来的机会，`;
    interpretation += `${opportunity.isReversed ? '需要耐心等待更好的时机' : '是抓住机遇的好时机'}。\n\n`;
    
    interpretation += `预期收获：${harvest.card.chineseName}展现了努力的成果，`;
    interpretation += `${harvest.isReversed ? '收获需要更多时间和努力' : '将会获得满意的财富回报'}。\n\n`;
    
    return interpretation;
  }

  /**
   * 六芒星牌阵专业解读
   */
  private static interpretSixStar(drawnCards: DrawnCard[]): string {
    const [current, conscious, subconscious, pastInfluence, futurePotential, externalEnv, finalOutcome] = drawnCards;
    
    let interpretation = '✨ 六芒星牌阵揭示了事物发展的深层奥秘：\n\n';
    
    interpretation += `核心状况：${current.card.chineseName}代表当前的整体局面。\n\n`;
    
    // 意识层面分析
    interpretation += `意识vs潜意识分析：\n`;
    interpretation += `• 意识层面：${conscious.card.chineseName} - 这是您表面的想法和认知\n`;
    interpretation += `• 潜意识层面：${subconscious.card.chineseName} - 这是您内心深处的真实想法\n`;
    
    if (conscious.card.suit === subconscious.card.suit) {
      interpretation += '您的意识和潜意识非常一致，内心没有冲突。\n\n';
    } else {
      interpretation += '您的理性和感性存在分歧，需要平衡内在的不同声音。\n\n';
    }
    
    // 时间线分析
    interpretation += `时间发展线：\n`;
    interpretation += `• 过去影响：${pastInfluence.card.chineseName} - 来自过去的重要影响\n`;
    interpretation += `• 未来潜力：${futurePotential.card.chineseName} - 事物发展的可能性\n\n`;
    
    // 环境因素
    interpretation += `外在环境：${externalEnv.card.chineseName}显示了周围环境对您的影响`;
    interpretation += `${externalEnv.isReversed ? '，需要注意负面的外在因素' : '，外在条件对您有利'}。\n\n`;
    
    // 最终结果
    interpretation += `最终走向：${finalOutcome.card.chineseName}预示了事物的最终发展方向`;
    interpretation += `${finalOutcome.isReversed ? '，可能需要更多努力才能达到理想结果' : '，前景积极乐观'}。\n\n`;
    
    return interpretation;
  }

  /**
   * 凯尔特牌阵专业解读
   */
  private static interpretCelticCross(drawnCards: DrawnCard[]): string {
    const [present, challenge, distantPast, recentPast, possibleFuture, nearFuture, approach, external, hopesFearsm, finalOutcome] = drawnCards;
    
    let interpretation = '🌟 凯尔特牌阵提供了最全面深入的人生指引：\n\n';
    
    interpretation += `核心问题：${present.card.chineseName}是您当前最需要关注的核心主题。\n\n`;
    
    interpretation += `主要挑战：${challenge.card.chineseName}横亘在您面前，这是必须面对和解决的关键问题。\n\n`;
    
    // 时间背景分析
    interpretation += `背景分析：\n`;
    interpretation += `• 深层根源：${distantPast.card.chineseName} - 形成现状的历史根源\n`;
    interpretation += `• 近期影响：${recentPast.card.chineseName} - 最近的重要事件\n\n`;
    
    // 未来展望
    interpretation += `未来展望：\n`;
    interpretation += `• 可能发展：${possibleFuture.card.chineseName} - 按当前路径的可能结果\n`;
    interpretation += `• 近期趋势：${nearFuture.card.chineseName} - 短期内的发展方向\n\n`;
    
    // 内在和外在因素
    interpretation += `影响因素分析：\n`;
    interpretation += `• 您的态度：${approach.card.chineseName} - 您内在的态度和方法\n`;
    interpretation += `• 外在影响：${external.card.chineseName} - 来自外界的重要影响\n`;
    interpretation += `• 内心期望：${hopesFearsm.card.chineseName} - 您的希望与担忧\n\n`;
    
    // 最终结果
    interpretation += `最终结果：${finalOutcome.card.chineseName}揭示了整个情况的最终走向`;
    interpretation += `${finalOutcome.isReversed ? '，需要调整策略以获得更好结果' : '，前景令人期待'}。\n\n`;
    
    return interpretation;
  }

  /**
   * 三张牌占卜法专业解读
   */
  private static interpretThreeCard(drawnCards: DrawnCard[]): string {
    const [past, present, future] = drawnCards;
    
    let interpretation = '🔮 三张牌占卜法展现了时间的连续性：\n\n';
    
    // 分析时间流
    interpretation += `时间发展脉络：\n`;
    interpretation += `• 过去：${past.card.chineseName} - 为现状奠定基础的过往经历\n`;
    interpretation += `• 现在：${present.card.chineseName} - 当前需要重点关注的核心状况\n`;
    interpretation += `• 未来：${future.card.chineseName} - 基于当前发展的趋势预测\n\n`;
    
    // 分析发展趋势
    if (past.card.category === 'major' && future.card.category === 'major') {
      interpretation += '从过去到未来都出现大阿尔卡纳，表明这是人生重要的转折期。\n\n';
    }
    
    const trendAnalysis = this.analyzeTrend([past, present, future]);
    interpretation += trendAnalysis;
    
    return interpretation;
  }

  /**
   * 分析三张牌的发展趋势
   */
  private static analyzeTrend(cards: DrawnCard[]): string {
    const [past, present, future] = cards;
    
    // 分析数字趋势（如果是小阿尔卡纳）
    if (past.card.number && present.card.number && future.card.number) {
      const trend = future.card.number - past.card.number;
      if (trend > 0) {
        return '数字能量呈上升趋势，情况朝着更加积极的方向发展。\n\n';
      } else if (trend < 0) {
        return '数字能量呈下降趋势，需要调整策略或心态。\n\n';
      } else {
        return '数字能量保持稳定，当前的方法和态度是正确的。\n\n';
      }
    }
    
    // 分析逆位情况
    const reversedCount = cards.filter(c => c.isReversed).length;
    if (reversedCount === 0) {
      return '所有牌都是正位，表明发展方向正确，能量流动顺畅。\n\n';
    } else if (reversedCount === 3) {
      return '全部逆位出现，提醒您需要深度反思和内在调整。\n\n';
    } else {
      return '正逆位混合出现，表明发展过程中会有起伏，需要保持平衡。\n\n';
    }
  }

  /**
   * 分析牌与牌之间的关联
   */
  private static analyzeCardConnections(drawnCards: DrawnCard[]): string {
    let connections = '';

    // 检查是否有同花色的牌
    const suits = drawnCards
      .filter(dc => dc.card.suit)
      .map(dc => dc.card.suit);
    
    const suitCounts = suits.reduce((acc, suit) => {
      acc[suit!] = (acc[suit!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(suitCounts).forEach(([suit, count]) => {
      if (count > 1) {
        const suitMeanings = {
          wands: '权杖花色的重复出现强调了事业、创造力和行动的重要性。',
          cups: '圣杯花色的重复出现突出了情感、直觉和人际关系的主题。',
          swords: '宝剑花色的重复出现表明思维、沟通和挑战是关键因素。',
          pentacles: '金币花色的重复出现强调了物质、实用性和稳定性的重要性。'
        };
        connections += suitMeanings[suit as keyof typeof suitMeanings] + '\n';
      }
    });

    return connections;
  }

  /**
   * 生成建议
   */
  private static generateAdvice(drawnCards: DrawnCard[], elementalAnalysis: ElementalAnalysis): string {
    let advice = '基于这次塔罗牌解读，为您提供以下建议：\n\n';

    // 基于主导元素的建议
    const elementAdvice = {
      fire: '• 发挥您的领导力和创造力，勇敢地采取行动\n• 相信您的直觉，但也要考虑他人的感受\n• 保持热情，但避免过于冲动的决定\n',
      water: '• 重视您的情感和直觉，它们是重要的指引\n• 加强与他人的情感连接和沟通\n• 给自己一些时间和空间来处理情感\n',
      air: '• 多收集信息，进行理性分析后再做决定\n• 加强沟通和交流，清晰表达您的想法\n• 学习新知识，提升您的思维能力\n',
      earth: '• 制定实际可行的计划，脚踏实地地执行\n• 关注细节和实际结果，建立稳固的基础\n• 在变化中保持稳定，循序渐进地发展\n'
    };

    advice += elementAdvice[elementalAnalysis.dominantElement as keyof typeof elementAdvice];

    // 基于逆位牌的建议
    const reversedCards = drawnCards.filter(dc => dc.isReversed);
    if (reversedCards.length > 0) {
      advice += '\n• 注意内在的阻碍和限制性信念，需要进行自我调整\n';
      advice += '• 考虑是否有被忽视的方面需要重新关注\n';
    }

    advice += '\n记住，塔罗牌提供的是指引和建议，最终的选择和行动权始终在您自己手中。相信您的内在智慧，做出最适合自己的决定。';

    return advice;
  }

  /**
   * 生成单张牌的建议
   */
  private static generateCardAdvice(
    card: StandardTarotCard, 
    position: TarotPosition, 
    isReversed: boolean
  ): string {
    const advice = isReversed ? card.reversed.spiritual : card.upright.spiritual;
    
    return `基于${card.chineseName}在${position.chineseName}位置的指引：${advice}`;
  }

  /**
   * 建议时间框架
   */
  private static suggestTimeframe(cards: StandardTarotCard[]): string {
    const hasWands = cards.some(card => card.suit === 'wands');
    const hasSwords = cards.some(card => card.suit === 'swords');
    
    if (hasWands && hasSwords) {
      return '1-3个月内会有显著发展';
    } else if (cards.some(card => card.suit === 'cups')) {
      return '情感和关系的发展需要3-6个月的时间';
    } else if (cards.some(card => card.suit === 'pentacles')) {
      return '物质和实际的改变可能需要6个月到1年的时间';
    }
    
    return '时间框架取决于您的行动和外在环境的配合';
  }
} 