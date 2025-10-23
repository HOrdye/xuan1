/**
 * 结果后处理器
 * 将AI输出转换为结构化、易读的格式，并增强可读性
 */

export interface ProcessedResult {
  openingStatement: string;
  coreNarrative: {
    title: string;
    story: string;
    coreConflict: string;
    development: string;
    coreRevelation: string;
  };
  optionAnalysis: Array<{
    optionName: string;
    narrativeAlignment: string;
    concreteAdvantage: string;
    concreteRisk: string;
  }>;
  breakthroughPlan: {
    clearRecommendation: string;
    actionList: Array<{
      actionTitle: string;
      actionDetail: string;
      rationale: string;
    }>;
  };
  scenarioContext?: {
    decisionType: string;
    emotionalTone: string;
    urgency: string;
    riskLevel: string;
  };
}

export interface RawAIResponse {
  openingStatement?: string;
  coreNarrative?: {
    title?: string;
    story?: string;
    coreConflict?: string;
    development?: string;
    coreRevelation?: string;
  };
  optionAnalysis?: Array<{
    optionName?: string;
    narrativeAlignment?: string;
    concreteAdvantage?: string;
    concreteRisk?: string;
  }>;
  breakthroughPlan?: {
    clearRecommendation?: string;
    actionList?: Array<{
      actionTitle?: string;
      actionDetail?: string;
      rationale?: string;
    }>;
  };
  [key: string]: any;
}

export class ResultPostProcessor {
  /**
   * 解析AI响应并转换为结构化结果
   */
  static parseAIResponse(response: string): ProcessedResult {
    try {
      // 尝试解析JSON响应
      const parsed = this.extractJSONFromResponse(response);
      const rawResult = this.normalizeRawResult(parsed);
      
      // 转换为标准格式
      const result = this.convertToStandardFormat(rawResult);
      
      // 增强可读性
      return this.enhanceReadability(result);
    } catch (error) {
      console.error('解析AI响应失败:', error);
      return this.generateFallbackResult();
    }
  }

  /**
   * 从AI响应中提取JSON内容
   */
  private static extractJSONFromResponse(response: string): any {
    // 尝试直接解析
    try {
      return JSON.parse(response.trim());
    } catch (e) {
      // 尝试提取JSON部分
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e2) {
          console.warn('无法提取有效的JSON内容');
        }
      }
      
      // 如果都失败了，尝试手动解析
      return this.manualParseResponse(response);
    }
  }

  /**
   * 手动解析响应内容（备用方案）
   */
  private static manualParseResponse(response: string): RawAIResponse {
    const result: RawAIResponse = {};
    
    // 尝试提取核心洞察
    const insightMatch = response.match(/核心洞见[：:]\s*(.+?)(?:\n|$)/);
    if (insightMatch) {
      result.coreInsight = insightMatch[1].trim();
    }
    
    // 尝试提取选项分析
    const optionAMatch = response.match(/选项A[：:]\s*(.+?)(?:\n|$)/);
    const optionBMatch = response.match(/选项B[：:]\s*(.+?)(?:\n|$)/);
    
    if (optionAMatch || optionBMatch) {
      result.optionAnalysis = {};
      if (optionAMatch) {
        result.optionAnalysis.optionA = { insight: optionAMatch[1].trim() };
      }
      if (optionBMatch) {
        result.optionAnalysis.optionB = { insight: optionBMatch[1].trim() };
      }
    }
    
    // 尝试提取行动指南
    const actionsMatch = response.match(/行动建议[：:]\s*(.+?)(?:\n|$)/);
    if (actionsMatch) {
      result.actionGuide = {
        immediateActions: [actionsMatch[1].trim()],
        reflectionQuestions: [],
        timingAdvice: ''
      };
    }
    
    // 尝试提取总结
    const summaryMatch = response.match(/总结[：:]\s*(.+?)(?:\n|$)/);
    if (summaryMatch) {
      result.summary = summaryMatch[1].trim();
    }
    
    return result;
  }

  /**
   * 标准化原始结果
   */
  private static normalizeRawResult(raw: any): RawAIResponse {
    const normalized: RawAIResponse = {};
    
    // 标准化核心洞察
    if (raw.coreInsight) {
      normalized.coreInsight = String(raw.coreInsight).trim();
    }
    
    // 标准化选项分析
    if (raw.optionAnalysis) {
      normalized.optionAnalysis = {};
      
      if (raw.optionAnalysis.optionA) {
        normalized.optionAnalysis.optionA = {
          insight: String(raw.optionAnalysis.optionA.insight || raw.optionAnalysis.optionA).trim(),
          advantages: Array.isArray(raw.optionAnalysis.optionA.advantages) 
            ? raw.optionAnalysis.optionA.advantages.map(String) 
            : [],
          considerations: Array.isArray(raw.optionAnalysis.optionA.considerations) 
            ? raw.optionAnalysis.optionA.considerations.map(String) 
            : []
        };
      }
      
      if (raw.optionAnalysis.optionB) {
        normalized.optionAnalysis.optionB = {
          insight: String(raw.optionAnalysis.optionB.insight || raw.optionAnalysis.optionB).trim(),
          advantages: Array.isArray(raw.optionAnalysis.optionB.advantages) 
            ? raw.optionAnalysis.optionB.advantages.map(String) 
            : [],
          considerations: Array.isArray(raw.optionAnalysis.optionB.considerations) 
            ? raw.optionAnalysis.optionB.considerations.map(String) 
            : []
        };
      }
    }
    
    // 标准化行动指南
    if (raw.actionGuide) {
      normalized.actionGuide = {
        immediateActions: Array.isArray(raw.actionGuide.immediateActions) 
          ? raw.actionGuide.immediateActions.map(String) 
          : [],
        reflectionQuestions: Array.isArray(raw.actionGuide.reflectionQuestions) 
          ? raw.actionGuide.reflectionQuestions.map(String) 
          : [],
        timingAdvice: String(raw.actionGuide.timingAdvice || '').trim()
      };
    }
    
    // 标准化总结
    if (raw.summary) {
      normalized.summary = String(raw.summary).trim();
    }
    
    return normalized;
  }

  /**
   * 转换为标准格式
   */
  private static convertToStandardFormat(raw: RawAIResponse): ProcessedResult {
    return {
      openingStatement: raw.openingStatement || '',
      coreNarrative: {
        title: raw.coreNarrative?.title || '',
        story: raw.coreNarrative?.story || '',
        coreConflict: raw.coreNarrative?.coreConflict || '',
        development: raw.coreNarrative?.development || '',
        coreRevelation: raw.coreNarrative?.coreRevelation || ''
      },
      optionAnalysis: raw.optionAnalysis?.map(option => ({
        optionName: option.optionName || '选项',
        narrativeAlignment: option.narrativeAlignment || '与核心叙事有一定关联',
        concreteAdvantage: option.concreteAdvantage || '具有具体优势',
        concreteRisk: option.concreteRisk || '需要注意具体风险'
      })) || [
        {
          optionName: '选项A',
          narrativeAlignment: '需要进一步分析',
          concreteAdvantage: '具有独特价值',
          concreteRisk: '需要仔细权衡'
        },
        {
          optionName: '选项B',
          narrativeAlignment: '需要进一步分析',
          concreteAdvantage: '具有独特价值',
          concreteRisk: '需要仔细权衡'
        }
      ],
      breakthroughPlan: {
        clearRecommendation: raw.breakthroughPlan?.clearRecommendation || '',
        actionList: raw.breakthroughPlan?.actionList || [
          {
            actionTitle: '深入思考',
            actionDetail: '仔细权衡两个选项的利弊得失。',
            rationale: '这能帮助您理清思路。'
          },
          {
            actionTitle: '寻求指引',
            actionDetail: '倾听内心的声音，找到最适合的选择。',
            rationale: '内在智慧往往最可靠。'
          }
        ]
      }
    };
  }

  /**
   * 增强可读性
   */
  private static enhanceReadability(result: ProcessedResult): ProcessedResult {
    return {
      ...result,
      openingStatement: this.enhanceText(result.openingStatement),
      coreNarrative: {
        title: this.enhanceText(result.coreNarrative.title),
        story: this.enhanceText(result.coreNarrative.story),
        coreConflict: this.enhanceText(result.coreNarrative.coreConflict),
        development: this.enhanceText(result.coreNarrative.development),
        coreRevelation: this.enhanceText(result.coreNarrative.coreRevelation)
      },
      optionAnalysis: result.optionAnalysis.map(option => ({
        ...option,
        optionName: this.enhanceText(option.optionName),
        narrativeAlignment: this.enhanceText(option.narrativeAlignment),
        concreteAdvantage: this.enhanceText(option.concreteAdvantage),
        concreteRisk: this.enhanceText(option.concreteRisk)
      })),
      breakthroughPlan: {
        clearRecommendation: this.enhanceText(result.breakthroughPlan.clearRecommendation),
        actionList: result.breakthroughPlan.actionList.map(action => ({
          actionTitle: this.enhanceText(action.actionTitle),
          actionDetail: this.enhanceText(action.actionDetail),
          rationale: this.enhanceText(action.rationale)
        }))
      }
    };
  }

  /**
   * 增强文本可读性
   */
  private static enhanceText(text: string): string {
    if (!text) return text;
    
    let enhanced = text
      // 确保句子以标点符号结尾
      .replace(/([^。！？.!?])\s*$/, '$1。')
      // 修复常见的标点符号问题
      .replace(/[，,]+/g, '，')
      .replace(/[。.]+/g, '。')
      // 确保中文和英文之间有空格
      .replace(/([a-zA-Z])([\u4e00-\u9fa5])/g, '$1 $2')
      .replace(/([\u4e00-\u9fa5])([a-zA-Z])/g, '$1 $2')
      // 确保数字和中文之间有空格
      .replace(/(\d)([\u4e00-\u9fa5])/g, '$1 $2')
      .replace(/([\u4e00-\u9fa5])(\d)/g, '$1 $2');
    
    return enhanced;
  }

  /**
   * 生成备用结果
   */
  private static generateFallbackResult(): ProcessedResult {
    return {
      openingStatement: '',
      coreNarrative: {
        title: '',
        story: '',
        coreConflict: '',
        development: '',
        coreRevelation: ''
      },
      optionAnalysis: [
        {
          optionName: '选项A',
          narrativeAlignment: '与核心叙事有一定关联，需要进一步分析',
          concreteAdvantage: '具有独特价值，值得认真考虑',
          concreteRisk: '需要仔细权衡，避免冲动决策'
        },
        {
          optionName: '选项B',
          narrativeAlignment: '同样与核心叙事有关联，需要客观评估',
          concreteAdvantage: '具有独特价值，值得认真考虑',
          concreteRisk: '需要仔细权衡，避免冲动决策'
        }
      ],
      breakthroughPlan: {
        clearRecommendation: '',
        actionList: [
          {
            actionTitle: '深入思考',
            actionDetail: '仔细权衡两个选项的利弊得失，列出各自的优缺点。',
            rationale: '这能帮助您理清思路，避免冲动决策。'
          },
          {
            actionTitle: '寻求指引',
            actionDetail: '倾听内心的声音，找到最适合的选择。哪个选择更符合我的价值观？',
            rationale: '内在智慧往往最可靠，能帮助您找到真正的答案。'
          }
        ]
      }
    };
  }

  /**
   * 添加场景上下文信息
   */
  static addScenarioContext(
    result: ProcessedResult, 
    scenarioContext: {
      decisionType: string;
      emotionalTone: string;
      urgency: string;
      riskLevel: string;
    }
  ): ProcessedResult {
    return {
      ...result,
      scenarioContext
    };
  }

  /**
   * 验证结果完整性
   */
  static validateResult(result: ProcessedResult): boolean {
    return !!(
      result.coreInsight &&
      result.optionAnalysis?.optionA?.insight &&
      result.optionAnalysis?.optionB?.insight &&
      result.actionGuide?.immediateActions?.length > 0 &&
      result.summary
    );
  }

  /**
   * 获取结果摘要
   */
  static getResultSummary(result: ProcessedResult): string {
    const parts = [
      result.openingStatement,
      `核心叙事: ${result.coreNarrative.title}`,
      result.coreNarrative.story,
      `核心冲突: ${result.coreNarrative.coreConflict}`,
      `发展方向: ${result.coreNarrative.development}`,
      `核心启示: ${result.coreNarrative.coreRevelation}`,
      ...result.optionAnalysis.map(option => 
        `${option.optionName}: ${option.narrativeAlignment}`
      ),
      `建议: ${result.breakthroughPlan.clearRecommendation}`,
      `破局行动: ${result.breakthroughPlan.actionList.map(action => action.actionTitle).join('、')}`
    ];
    
    return parts.filter(Boolean).join('\n\n');
  }

  /**
   * 格式化结果用于显示
   */
  static formatForDisplay(result: ProcessedResult): {
    sections: Array<{
      title: string;
      content: string | string[];
      type: 'text' | 'list' | 'mixed';
    }>;
  } {
    const sections = [
      {
        title: '开场白',
        content: result.openingStatement,
        type: 'text' as const
      },
      {
        title: '核心叙事',
        content: [
          `标题: ${result.coreNarrative.title}`,
          `故事: ${result.coreNarrative.story}`,
          `核心冲突: ${result.coreNarrative.coreConflict}`,
          `发展方向: ${result.coreNarrative.development}`,
          `核心启示: ${result.coreNarrative.coreRevelation}`
        ],
        type: 'list' as const
      },
      ...result.optionAnalysis.map((option, index) => ({
        title: `${option.optionName}分析`,
        content: [
          `叙事关联: ${option.narrativeAlignment}`,
          `具体优势: ${option.concreteAdvantage}`,
          `具体风险: ${option.concreteRisk}`
        ],
        type: 'list' as const
      })),
      {
        title: '破局计划',
        content: [
          `明确建议: ${result.breakthroughPlan.clearRecommendation}`,
          ...result.breakthroughPlan.actionList.map(action => 
            `${action.actionTitle}: ${action.actionDetail} (理由: ${action.rationale})`
          )
        ],
        type: 'list' as const
      }
    ];

    return { sections };
  }
}
