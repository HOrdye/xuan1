/**
 * 个性化算法
 * 基于用户信息生成个性化内容
 */

import type { UnifiedUserInfo } from './UserInfoSharingService';

export class PersonalizationAlgorithm {
  /**
   * 基于星座元素的解读调整
   */
  static adjustForZodiacElement(interpretation: string, element: string): string {
    const elementKeywords = {
      fire: ['行动', '领导', '激情', '冒险', '创新', '突破'],
      water: ['情感', '直觉', '深度', '流动', '包容', '理解'],
      air: ['沟通', '思考', '变化', '自由', '灵活', '交流'],
      earth: ['稳定', '实用', '耐心', '坚持', '务实', '可靠']
    };

    const keywords = elementKeywords[element as keyof typeof elementKeywords] || [];
    return this.emphasizeKeywords(interpretation, keywords);
  }

  /**
   * 基于性别的语气调整
   */
  static adjustToneForGender(interpretation: string, gender: string): string {
    if (gender === 'male') {
      return this.makeDirect(interpretation);
    } else {
      return this.makeGentle(interpretation);
    }
  }

  /**
   * 基于问题类型的重点调整
   */
  static adjustFocusForQuestionType(interpretation: string, questionType: string): string {
    const focusAreas = {
      relationship: ['沟通', '理解', '包容', '成长', '信任', '支持'],
      career: ['发展', '机会', '挑战', '规划', '技能', '目标'],
      financial: ['风险', '收益', '规划', '稳定', '投资', '理财'],
      personal: ['成长', '健康', '平衡', '幸福', '自我', '内心'],
      decision: ['选择', '权衡', '后果', '影响', '时机', '准备'],
      prediction: ['趋势', '可能', '时机', '准备', '机遇', '挑战'],
      advice: ['行动', '策略', '方法', '步骤', '技巧', '建议'],
      diagnosis: ['根源', '原因', '问题', '解决', '改善', '调整']
    };

    const areas = focusAreas[questionType as keyof typeof focusAreas] || [];
    return this.emphasizeFocusAreas(interpretation, areas);
  }

  /**
   * 基于情感状态的语气调整
   */
  static adjustToneForEmotionalState(interpretation: string, emotionalState: string): string {
    switch (emotionalState) {
      case 'positive':
        return this.makeEncouraging(interpretation);
      case 'negative':
        return this.makeSupportive(interpretation);
      case 'conflicted':
        return this.makeBalanced(interpretation);
      case 'neutral':
        return this.makeAnalytical(interpretation);
      default:
        return interpretation;
    }
  }

  /**
   * 基于决策类型的建议调整
   */
  static adjustAdviceForDecisionType(advice: string[], decisionType: string): string[] {
    const decisionSpecificAdvice = {
      relationship: [
        '多沟通，了解对方的真实想法',
        '保持耐心，感情需要时间培养',
        '学会倾听，理解对方的感受'
      ],
      career: [
        '评估自己的技能和兴趣',
        '考虑长期职业发展规划',
        '寻找学习和成长的机会'
      ],
      financial: [
        '评估风险承受能力',
        '制定合理的财务规划',
        '寻求专业理财建议'
      ],
      personal: [
        '关注自己的内心需求',
        '保持身心健康',
        '追求个人成长和幸福'
      ]
    };

    const specificAdvice = decisionSpecificAdvice[decisionType as keyof typeof decisionSpecificAdvice] || [];
    return [...advice, ...specificAdvice];
  }

  /**
   * 生成个性化开场白
   */
  static generatePersonalizedOpening(userInfo: UnifiedUserInfo): string {
    let opening = '';

    // 基于星座的个性化开场
    if (userInfo.mysticalInfo.zodiac) {
      const zodiacSign = userInfo.mysticalInfo.zodiac.sign;
      const zodiacElement = userInfo.mysticalInfo.zodiac.element;
      
      opening += `作为${zodiacSign}座的你，`;
      
      switch (zodiacElement) {
        case 'fire':
          opening += '你的热情和行动力是解决问题的关键。';
          break;
        case 'water':
          opening += '你的直觉和情感智慧将指引你找到答案。';
          break;
        case 'air':
          opening += '你的思维敏捷和沟通能力将帮助你理清思路。';
          break;
        case 'earth':
          opening += '你的稳重和务实将帮助你做出明智的选择。';
          break;
      }
    }

    // 基于问题类型的个性化开场
    if (userInfo.divinationContext.questionType) {
      const questionType = userInfo.divinationContext.questionType;
      
      switch (questionType) {
        case 'relationship':
          opening += '在感情的世界里，真诚和理解是最重要的。';
          break;
        case 'career':
          opening += '职业发展需要清晰的规划和持续的努力。';
          break;
        case 'financial':
          opening += '财务决策需要理性分析和风险控制。';
          break;
        case 'personal':
          opening += '个人成长是一个持续的过程，需要耐心和坚持。';
          break;
      }
    }

    return opening || '让我们一起来探索这个问题的答案。';
  }

  /**
   * 强调关键词
   */
  private static emphasizeKeywords(text: string, keywords: string[]): string {
    let result = text;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      result = result.replace(regex, `**$1**`);
    });
    
    return result;
  }

  /**
   * 强调重点领域
   */
  private static emphasizeFocusAreas(text: string, areas: string[]): string {
    let result = text;
    
    areas.forEach(area => {
      const regex = new RegExp(`(${area})`, 'gi');
      result = result.replace(regex, `*$1*`);
    });
    
    return result;
  }

  /**
   * 使语气更直接
   */
  private static makeDirect(text: string): string {
    return text
      .replace(/建议/g, '建议')
      .replace(/可以/g, '应该')
      .replace(/或许/g, '肯定');
  }

  /**
   * 使语气更温和
   */
  private static makeGentle(text: string): string {
    return text
      .replace(/应该/g, '建议')
      .replace(/必须/g, '可以')
      .replace(/肯定/g, '或许');
  }

  /**
   * 使语气更鼓励
   */
  private static makeEncouraging(text: string): string {
    return text
      .replace(/困难/g, '挑战')
      .replace(/问题/g, '机会')
      .replace(/失败/g, '学习');
  }

  /**
   * 使语气更支持
   */
  private static makeSupportive(text: string): string {
    return text
      .replace(/错误/g, '经验')
      .replace(/失败/g, '成长')
      .replace(/困难/g, '考验');
  }

  /**
   * 使语气更平衡
   */
  private static makeBalanced(text: string): string {
    return text
      .replace(/一定/g, '可能')
      .replace(/肯定/g, '或许')
      .replace(/必须/g, '建议');
  }

  /**
   * 使语气更分析性
   */
  private static makeAnalytical(text: string): string {
    return text
      .replace(/感觉/g, '分析')
      .replace(/直觉/g, '逻辑')
      .replace(/相信/g, '考虑');
  }
}

