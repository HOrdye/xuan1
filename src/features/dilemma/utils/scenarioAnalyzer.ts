/**
 * 情景分析器模块
 * 分析用户输入的两个选择，提取关键信息，为场景化Prompt生成提供基础
 */

export interface ScenarioAnalysis {
  decisionType: 'relationship' | 'career' | 'financial' | 'personal' | 'other';
  emotionalTone: 'positive' | 'negative' | 'neutral' | 'conflicted';
  urgency: 'high' | 'medium' | 'low';
  complexity: 'simple' | 'moderate' | 'complex';
  keywords: string[];
  context: string;
  riskLevel: 'low' | 'medium' | 'high';
  timeHorizon: 'immediate' | 'short' | 'long';
}

export class ScenarioAnalyzer {
  // 决策类型关键词映射
  private static readonly DECISION_TYPE_KEYWORDS = {
    relationship: ['分手', '离婚', '复合', '表白', '结婚', '恋爱', '感情', '关系', '爱情', '婚姻', '家庭', '朋友', '同事', '老板', '客户'],
    career: ['跳槽', '辞职', '创业', '升职', '转行', '工作', '职业', '事业', '公司', '项目', '团队', '管理', '技能', '学习'],
    financial: ['投资', '理财', '买房', '买车', '股票', '基金', '创业', '消费', '储蓄', '债务', '保险', '税务'],
    personal: ['减肥', '健身', '学习', '旅行', '搬家', '装修', '医疗', '手术', '心理', '成长', '兴趣', '爱好'],
    other: []
  };

  // 情感倾向关键词映射
  private static readonly EMOTIONAL_KEYWORDS = {
    positive: ['开心', '兴奋', '期待', '希望', '梦想', '机会', '成功', '幸福', '快乐', '满足', '成长', '进步'],
    negative: ['痛苦', '焦虑', '恐惧', '愤怒', '悲伤', '绝望', '压力', '困难', '失败', '损失', '伤害', '痛苦'],
    conflicted: ['纠结', '犹豫', '矛盾', '困惑', '迷茫', '不确定', '两难', '选择', '权衡', '比较', '分析'],
    neutral: ['考虑', '思考', '分析', '评估', '比较', '选择', '决定', '判断', '权衡']
  };

  // 紧急程度关键词映射
  private static readonly URGENCY_KEYWORDS = {
    high: ['紧急', '马上', '立即', '立刻', '现在', '今天', '明天', '这周', '下周', '月底', '截止', '最后期限'],
    medium: ['近期', '这个月', '下个月', '季度', '半年', '年内', '计划', '安排', '准备'],
    low: ['将来', '未来', '以后', '长远', '规划', '目标', '梦想', '理想']
  };

  // 风险程度关键词映射
  private static readonly RISK_KEYWORDS = {
    high: ['风险', '危险', '损失', '失败', '破产', '失业', '分手', '离婚', '手术', '投资', '创业', '赌博'],
    medium: ['变化', '改变', '调整', '转型', '升级', '挑战', '困难', '压力', '竞争', '市场'],
    low: ['稳定', '安全', '保守', '稳妥', '保险', '保障', '保护', '维护', '保持']
  };

  /**
   * 分析用户输入，生成场景分析结果
   */
  static analyzeUserInput(optionA: string, optionB: string, question?: string): ScenarioAnalysis {
    const combinedText = `${optionA} ${optionB} ${question || ''}`.toLowerCase();
    
    // 分析决策类型
    const decisionType = this.determineDecisionType(combinedText);
    
    // 分析情感倾向
    const emotionalTone = this.determineEmotionalTone(combinedText);
    
    // 分析紧急程度
    const urgency = this.determineUrgency(combinedText);
    
    // 分析复杂度
    const complexity = this.determineComplexity(optionA, optionB, question);
    
    // 提取关键词
    const keywords = this.extractKeywords(combinedText);
    
    // 分析风险程度
    const riskLevel = this.determineRiskLevel(combinedText);
    
    // 分析时间跨度
    const timeHorizon = this.determineTimeHorizon(combinedText);
    
    // 生成上下文描述
    const context = this.generateContext(optionA, optionB, question, decisionType);
    
    return {
      decisionType,
      emotionalTone,
      urgency,
      complexity,
      keywords,
      context,
      riskLevel,
      timeHorizon
    };
  }

  /**
   * 确定决策类型
   */
  private static determineDecisionType(text: string): ScenarioAnalysis['decisionType'] {
    for (const [type, keywords] of Object.entries(this.DECISION_TYPE_KEYWORDS)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return type as ScenarioAnalysis['decisionType'];
      }
    }
    return 'other';
  }

  /**
   * 确定情感倾向
   */
  private static determineEmotionalTone(text: string): ScenarioAnalysis['emotionalTone'] {
    const scores = {
      positive: 0,
      negative: 0,
      conflicted: 0,
      neutral: 0
    };

    for (const [tone, keywords] of Object.entries(this.EMOTIONAL_KEYWORDS)) {
      scores[tone as keyof typeof scores] = keywords.filter(keyword => text.includes(keyword)).length;
    }

    // 如果冲突性关键词较多，优先返回conflicted
    if (scores.conflicted > 0) {
      return 'conflicted';
    }

    // 返回得分最高的情感倾向
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return 'neutral';
    
    for (const [tone, score] of Object.entries(scores)) {
      if (score === maxScore) {
        return tone as ScenarioAnalysis['emotionalTone'];
      }
    }
    
    return 'neutral';
  }

  /**
   * 确定紧急程度
   */
  private static determineUrgency(text: string): ScenarioAnalysis['urgency'] {
    for (const [urgency, keywords] of Object.entries(this.URGENCY_KEYWORDS)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return urgency as ScenarioAnalysis['urgency'];
      }
    }
    return 'medium';
  }

  /**
   * 确定复杂度
   */
  private static determineComplexity(optionA: string, optionB: string, question?: string): ScenarioAnalysis['complexity'] {
    const totalLength = optionA.length + optionB.length + (question?.length || 0);
    
    if (totalLength < 20) return 'simple';
    if (totalLength < 50) return 'moderate';
    return 'complex';
  }

  /**
   * 确定风险程度
   */
  private static determineRiskLevel(text: string): ScenarioAnalysis['riskLevel'] {
    for (const [risk, keywords] of Object.entries(this.RISK_KEYWORDS)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return risk as ScenarioAnalysis['riskLevel'];
      }
    }
    return 'medium';
  }

  /**
   * 确定时间跨度
   */
  private static determineTimeHorizon(text: string): ScenarioAnalysis['timeHorizon'] {
    if (this.URGENCY_KEYWORDS.high.some(keyword => text.includes(keyword))) {
      return 'immediate';
    }
    if (this.URGENCY_KEYWORDS.medium.some(keyword => text.includes(keyword))) {
      return 'short';
    }
    return 'long';
  }

  /**
   * 提取关键词
   */
  private static extractKeywords(text: string): string[] {
    const allKeywords = [
      ...Object.values(this.DECISION_TYPE_KEYWORDS).flat(),
      ...Object.values(this.EMOTIONAL_KEYWORDS).flat(),
      ...Object.values(this.URGENCY_KEYWORDS).flat(),
      ...Object.values(this.RISK_KEYWORDS).flat()
    ];

    const foundKeywords = allKeywords.filter(keyword => text.includes(keyword));
    
    // 去重并限制数量
    const uniqueKeywords = [...new Set(foundKeywords)];
    return uniqueKeywords.slice(0, 10); // 最多返回10个关键词
  }

  /**
   * 生成上下文描述
   */
  private static generateContext(
    optionA: string, 
    optionB: string, 
    question: string | undefined, 
    decisionType: ScenarioAnalysis['decisionType']
  ): string {
    const typeDescriptions = {
      relationship: '这是一个关于人际关系的重要决策',
      career: '这是一个关于职业发展的重要决策',
      financial: '这是一个关于财务规划的重要决策',
      personal: '这是一个关于个人生活的重要决策',
      other: '这是一个需要仔细考虑的重要决策'
    };

    const baseDescription = typeDescriptions[decisionType];
    const questionContext = question ? `，具体问题是：${question}` : '';
    
    return `${baseDescription}${questionContext}。您需要在"${optionA}"和"${optionB}"之间做出选择。`;
  }

  /**
   * 获取决策类型的详细描述
   */
  static getDecisionTypeDescription(type: ScenarioAnalysis['decisionType']): string {
    const descriptions = {
      relationship: '人际关系决策通常涉及感情、信任和长期承诺，需要特别关注双方的真实需求和感受。',
      career: '职业发展决策影响个人成长和收入，需要平衡短期利益和长期规划。',
      financial: '财务决策涉及资金安全和增值，需要谨慎评估风险和收益。',
      personal: '个人生活决策关乎生活质量和幸福感，需要倾听内心的真实声音。',
      other: '重要决策需要全面考虑各种因素，权衡利弊得失。'
    };
    return descriptions[type];
  }

  /**
   * 获取情感倾向的建议
   */
  static getEmotionalToneAdvice(tone: ScenarioAnalysis['emotionalTone']): string {
    const advice = {
      positive: '您当前的心态比较积极，这有助于做出明智的决策。建议保持这种乐观态度，同时也要理性分析。',
      negative: '您当前可能面临一些困难或压力。建议先调整心态，寻求支持，然后再做决定。',
      conflicted: '您正在经历内心的冲突和纠结，这是正常的。建议通过深入思考来理清思路。',
      neutral: '您的心态比较平和，这有利于客观分析问题。建议充分利用这种冷静状态进行理性决策。'
    };
    return advice[tone];
  }

  /**
   * 获取紧急程度的建议
   */
  static getUrgencyAdvice(urgency: ScenarioAnalysis['urgency']): string {
    const advice = {
      high: '这是一个需要尽快做出决定的紧急情况。建议在保证决策质量的前提下，适当加快决策节奏。',
      medium: '您有相对充足的时间来考虑这个决定。建议充分利用这段时间，进行深入的分析和思考。',
      low: '这是一个长期规划类决策，时间压力较小。建议进行充分的调研和思考，制定详细的行动计划。'
    };
    return advice[urgency];
  }
}










