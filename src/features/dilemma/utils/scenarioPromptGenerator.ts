/**
 * 场景化Prompt生成器
 * 基于情景分析结果，生成针对性的AI提示词，确保解读内容与用户场景高度相关
 */

import type { ScenarioAnalysis } from './scenarioAnalyzer';

export interface ScenarioPrompt {
  rolePrompt: string;
  contextPrompt: string;
  instructionPrompt: string;
  outputFormatPrompt: string;
  completePrompt: string;
}

export class ScenarioPromptGenerator {
  /**
   * 生成完整的场景化Prompt
   */
  static generateCompletePrompt(
    optionA: string,
    optionB: string,
    scenario: ScenarioAnalysis,
    hexagramInfo?: {
      name: string;
      chineseName: string;
      symbol: string;
      judgment: string;
      image: string;
      changingLines?: number[];
    }
  ): ScenarioPrompt {
    const rolePrompt = this.generateRolePrompt(scenario);
    const contextPrompt = this.generateContextPrompt(optionA, optionB, scenario, hexagramInfo);
    const instructionPrompt = this.generateInstructionPrompt(scenario);
    const outputFormatPrompt = this.generateOutputFormatPrompt();
    
    const completePrompt = `${rolePrompt}\n\n${contextPrompt}\n\n${instructionPrompt}\n\n${outputFormatPrompt}`;
    
    return {
      rolePrompt,
      contextPrompt,
      instructionPrompt,
      outputFormatPrompt,
      completePrompt
    };
  }

  /**
   * 生成角色扮演提示词
   */
  private static generateRolePrompt(scenario: ScenarioAnalysis): string {
    return `# Role Definition
你是一位结合了东方易经智慧与现代心理咨询技巧的决策顾问。你的名字叫"天玄"。

# Core Principles
1. **同理心优先 (Empathy First):** 你的首要任务是理解和回应用户在特定情景下的情感需求。在分析前，必须先用一两句温暖、共情的话语，承认用户面临问题的复杂性和情感压力。

2. **杜绝玄学黑话 (No Jargon):** 严禁直接使用"九五"、"上九"、"用九"等专业术语。你必须将所有易经概念（如"谦卦"、"益卦"、"变爻"）的深层含义，用现代、易懂的语言"翻译"出来，并与用户的具体问题紧密结合。

3. **聚焦"为什么"与"怎么办" (Focus on "Why" & "How"):** 不要只告诉用户"是什么"（比如"这是谦卦"），要重点解释"为什么"这个卦象与他的处境相关，以及他具体"怎么办"。

4. **提供启发而非命令 (Inspire, Don't Command):** 你的建议应该是启发性的、赋能的，帮助用户打开思路，而不是替他做决定。

5. **场景化思维 (Contextual Thinking):** 你必须将易经智慧与用户的具体生活场景深度融合，让每个建议都"量身定制"，而不是通用的套话。

# Your Expertise
你特别擅长${this.getDecisionTypeDescription(scenario.decisionType)}，并且${this.getEmotionalAdjustment(scenario.emotionalTone)}${this.getUrgencyAdjustment(scenario.urgency)}`;
  }

  /**
   * 生成上下文提示词
   */
  private static generateContextPrompt(
    optionA: string,
    optionB: string,
    scenario: ScenarioAnalysis,
    hexagramInfo?: {
      name: string;
      chineseName: string;
      symbol: string;
      judgment: string;
      image: string;
      changingLines?: number[];
    }
  ): string {
    let context = `# User Context
- **User Question:** "${optionA} vs ${optionB}"
- **Scenario Analysis (from scenarioAnalyzer.ts):**
  - **Decision Type:** ${this.getDecisionTypeText(scenario.decisionType)}
  - **Emotional State:** ${this.getEmotionalToneText(scenario.emotionalTone)}
  - **Urgency:** ${this.getUrgencyText(scenario.urgency)}
  - **Risk Level:** ${this.getRiskLevelText(scenario.riskLevel)}
  - **Time Horizon:** ${this.getTimeHorizonText(scenario.timeHorizon)}
  - **Complexity:** ${this.getComplexityText(scenario.complexity)}
  
- **Key Context:** ${scenario.context}
- **Keywords:** ${scenario.keywords.length > 0 ? scenario.keywords.join('、') : '无特定关键词'}`;
    
    // 添加易经信息（如果有）
    if (hexagramInfo) {
      context += `\n\n# Metaphysical Context
- **Initial Hexagram:** ${hexagramInfo.chineseName} (${hexagramInfo.name}) - 卦辞：${hexagramInfo.judgment}
- **Symbol:** ${hexagramInfo.symbol}
- **Image:** ${hexagramInfo.image}`;
      
      if (hexagramInfo.changingLines && hexagramInfo.changingLines.length > 0) {
        context += `\n- **Changing Lines:** ${hexagramInfo.changingLines.length} lines are changing (${hexagramInfo.changingLines.map(i => i + 1).join(', ')}), indicating a period of ${this.getTransformationDescription(hexagramInfo.changingLines.length)}.`;
      }
    }
    
    return context;
  }

  /**
   * 生成指令提示词
   */
  private static generateInstructionPrompt(scenario: ScenarioAnalysis): string {
    return `# Core Task & Step-by-Step Instructions
请遵循以下思维链，一步步完成本次解读。**重要：你必须先生成核心叙事，再基于叙事进行分析！**

**Step 1: 共情与开场 (Empathize & Open)**
首先，基于[User Context]中的情感状态，用一段温暖的话作为开场，承认这是一个艰难的决定。必须体现对用户当前情感状态的理解和关怀。

**Step 2: 核心叙事生成 (The Core Narrative) - 这是最关键的一步！**
你必须将卦象的含义，**完全代入到用户的具体问题场景中**，生成一个连贯的"解读故事"。

**核心任务**：对于用户"${this.getDecisionTypeText(scenario.decisionType)}"这个两难处境，这个卦象到底在讲述一个什么样的故事？

**具体要求**：
1. **场景代入**：将卦象的每个元素都映射到用户的具体情况中
   - 如果卦象有"天"和"水"，解释它们在这个具体问题中代表什么
   - 如果有变爻，说明这个变化在用户情况中意味着什么阶段

2. **故事连贯性**：生成一个完整的、有逻辑的解读故事
   - 当前状况是什么？
   - 卦象揭示的核心冲突是什么？
   - 这个冲突正在向哪个方向发展？
   - 最终可能的结果是什么？

3. **核心启示**：从这个故事中提炼出一个给用户的、独一无二的、一针见血的"核心启示"

**Step 3: 基于核心叙事的选项分析 (Option Analysis Based on Core Narrative)**
现在，**严格基于你刚才生成的"核心叙事"**，来分析用户的两个选项。

对于每个选项，必须回答：
- **它如何实践/回避核心叙事中的启示？**
- **这样做的好处是什么？（必须是具体的，不是套话）**
- **风险又是什么？（同样必须是具体的）**

**Step 4: 破局行动建议 (Breakthrough Action Plan)**
基于以上全部分析，生成最终建议：
- **明确倾向**：给出一个明确的倾向性建议
- **破局行动清单**：提供2-3个具体的、可执行的行动建议
  - 每个建议都必须是解决核心冲突的具体行动
  - 不是模棱两可的空话
  - 必须与卦象智慧和用户场景紧密结合

**Step 5: 输出JSON (Format Output)**
将以上所有分析结果，严格按照下面的JSON格式进行输出。

# Critical Requirements
1. **叙事优先**: 必须先有完整的核心叙事，再基于叙事进行分析
2. **场景映射**: 每个抽象概念都必须映射到用户的具体生活场景
3. **逻辑连贯**: 所有内容都必须基于同一个核心叙事，避免自相矛盾
4. **具体可执行**: 每个建议都必须是具体的行动，不是抽象思考`;
  }

  /**
   * 生成输出格式提示词
   */
  private static generateOutputFormatPrompt(): string {
    return `# Output Format Constraint
你必须严格按照以下JSON格式返回内容，不要包含任何markdown语法或多余的文字：

{
  "openingStatement": "string", // 温暖的、共情式的开场白，体现对用户情感状态的理解
  "coreNarrative": {
    "title": "string", // 核心叙事的标题，例如："天水讼：婚姻冲突的深层解读"
    "story": "string", // 完整的解读故事，将卦象完全代入用户具体场景
    "coreConflict": "string", // 核心冲突是什么，在用户情况中的具体表现
    "development": "string", // 冲突正在向哪个方向发展
    "coreRevelation": "string" // 从这个故事中提炼出的核心启示
  },
  "optionAnalysis": [
    {
      "optionName": "string", // 选项名称
      "narrativeAlignment": "string", // 该选项如何实践/回避核心叙事中的启示
      "concreteAdvantage": "string", // 具体的好处，不是套话
      "concreteRisk": "string" // 具体的风险，不是套话
    }
  ],
  "breakthroughPlan": {
    "clearRecommendation": "string", // 明确的倾向性建议
    "actionList": [ // 破局行动清单
      {
        "actionTitle": "string", // 行动标题
        "actionDetail": "string", // 具体行动步骤，必须是可执行的
        "rationale": "string" // 为什么这个行动能解决核心冲突
      }
    ]
  },
  "hexagramData": {
    "起卦卦名": {
      "meaning": "string"
    },
    "变卦卦名": {
      "meaning": "string"
    }
  },
  "transformationInsights": {
    "起卦卦名-变卦卦名": "string"
  },
  "hexagramChanges": {
    "起卦卦名-变卦卦名": {
      "insight": "string",
      "lines": [number]
    }
  }
}

# Critical Output Requirements
1. **JSON格式严格**: 必须是可以直接解析的JSON，不要包含任何markdown符号
2. **核心叙事完整**: coreNarrative必须是一个完整的、连贯的解读故事
3. **场景映射清晰**: 每个抽象概念都必须映射到用户的具体生活场景
4. **逻辑连贯**: 所有内容都必须基于同一个核心叙事，避免自相矛盾
5. **行动具体**: 每个建议都必须是具体的行动，不是抽象思考
6. **卦象解读完整**: hexagramData必须包含起卦和变卦的现代解读
7. **变化趋势清晰**: transformationInsights必须解释从起卦到变卦的变化趋势
8. **变爻含义具体**: hexagramChanges必须解释变爻的具体含义

**重要提醒**: 不要在JSON结构之外包含任何文字、解释或markdown符号。`;
  }

  /**
   * 获取情感倾向的角色调整
   */
  private static getEmotionalAdjustment(tone: ScenarioAnalysis['emotionalTone']): string {
    const adjustments = {
      positive: '你特别擅长帮助积极乐观的人保持理性，在热情中保持清醒的判断。',
      negative: '你特别擅长为处于困境中的人提供情感支持，帮助他们重拾信心和希望。',
      conflicted: '你特别擅长帮助内心冲突的人理清思路，找到内心的真实声音。',
      neutral: '你特别擅长帮助冷静理性的人进行深度分析，找到最佳的决策路径。'
    };
    return adjustments[tone];
  }

  /**
   * 获取紧急程度的角色调整
   */
  private static getUrgencyAdjustment(urgency: ScenarioAnalysis['urgency']): string {
    const adjustments = {
      high: '你擅长在时间压力下帮助人们做出快速而明智的决策，既保证速度，又保证质量。',
      medium: '你擅长帮助人们充分利用时间，进行深入的分析和思考，做出最明智的选择。',
      low: '你擅长帮助人们进行长期规划，制定详细的行动计划，确保决策的可持续性。'
    };
    return adjustments[urgency];
  }

  /**
   * 获取决策类型的中文描述
   */
  private static getDecisionTypeText(type: ScenarioAnalysis['decisionType']): string {
    const texts = {
      relationship: '人际关系决策',
      career: '职业发展决策',
      financial: '财务规划决策',
      personal: '个人生活决策',
      other: '其他重要决策'
    };
    return texts[type];
  }

  /**
   * 获取情感状态的中文描述
   */
  private static getEmotionalToneText(tone: ScenarioAnalysis['emotionalTone']): string {
    const texts = {
      positive: '积极乐观',
      negative: '面临困难',
      conflicted: '内心冲突',
      neutral: '冷静理性'
    };
    return texts[tone];
  }

  /**
   * 获取时间压力的中文描述
   */
  private static getUrgencyText(urgency: ScenarioAnalysis['urgency']): string {
    const texts = {
      high: '时间紧迫',
      medium: '时间适中',
      low: '时间充裕'
    };
    return texts[urgency];
  }

  /**
   * 获取风险程度的中文描述
   */
  private static getRiskLevelText(risk: ScenarioAnalysis['riskLevel']): string {
    const texts = {
      high: '高风险',
      medium: '中等风险',
      low: '低风险'
    };
    return texts[risk];
  }

  /**
   * 获取时间跨度的中文描述
   */
  private static getTimeHorizonText(horizon: ScenarioAnalysis['timeHorizon']): string {
    const texts = {
      immediate: '立即决策',
      short: '短期规划',
      long: '长期规划'
    };
    return texts[horizon];
  }

  /**
   * 获取场景特定的指令
   */
  private static getScenarioSpecificInstructions(scenario: ScenarioAnalysis): string[] {
    const instructions = {
      relationship: [
        '6. 重点关注双方的真实需求和感受，避免表面化的建议',
        '7. 考虑决策对双方关系长期发展的影响',
        '8. 提供改善沟通和增进理解的具体方法'
      ],
      career: [
        '6. 分析两个选择对个人职业发展的长期影响',
        '7. 考虑市场趋势和个人能力的匹配度',
        '8. 提供技能提升和资源整合的具体建议'
      ],
      financial: [
        '6. 平衡收益和风险，提供风险控制的具体措施',
        '7. 考虑个人财务状况和风险承受能力',
        '8. 提供资金管理和投资策略的实用建议'
      ],
      personal: [
        '6. 关注个人成长和内心满足感',
        '7. 考虑决策对生活质量和幸福感的影响',
        '8. 提供自我认知和价值观澄清的具体方法'
      ],
      other: [
        '6. 全面分析各种影响因素和可能后果',
        '7. 考虑决策的长期影响和可持续性',
        '8. 提供决策框架和评估工具的使用建议'
      ]
    };
    
    return instructions[scenario.decisionType];
  }

  /**
   * 获取情感相关的指令
   */
  private static getEmotionalInstructions(scenario: ScenarioAnalysis): string[] {
    const instructions = {
      positive: [
        '9. 在保持用户积极心态的同时，提醒他们理性分析的重要性',
        '10. 帮助用户将积极情绪转化为明智决策的动力'
      ],
      negative: [
        '9. 首先提供情感支持和安慰，帮助用户稳定情绪',
        '10. 在情绪稳定后，引导用户进行理性分析'
      ],
      conflicted: [
        '9. 帮助用户理清内心的矛盾和冲突',
        '10. 提供具体的思考框架，帮助用户找到内心的真实声音'
      ],
      neutral: [
        '9. 充分利用用户的冷静状态，进行深入的分析和思考',
        '10. 帮助用户建立系统的决策评估体系'
      ]
    };
    
    return instructions[scenario.emotionalTone];
  }

  /**
   * 获取决策类型的详细描述
   */
  private static getDecisionTypeDescription(type: ScenarioAnalysis['decisionType']): string {
    const descriptions = {
      relationship: '人际关系决策，特别是感情、婚姻、家庭等涉及深层情感连接的选择',
      career: '职业发展决策，包括工作选择、技能提升、事业规划等关乎个人成长的选择',
      financial: '财务规划决策，涉及投资、理财、消费等需要理性分析的选择',
      personal: '个人生活决策，包括健康、兴趣、生活方式等关乎个人幸福感的选择',
      other: '其他重要决策，需要全面考虑各种影响因素和可能后果的选择'
    };
    return descriptions[type];
  }

  /**
   * 获取复杂度的中文描述
   */
  private static getComplexityText(complexity: ScenarioAnalysis['complexity']): string {
    const texts = {
      simple: '简单决策',
      moderate: '中等复杂度决策',
      complex: '复杂决策'
    };
    return texts[complexity];
  }

  /**
   * 获取变爻数量的描述
   */
  private static getTransformationDescription(changingLinesCount: number): string {
    if (changingLinesCount === 0) return 'stability and consistency';
    if (changingLinesCount <= 2) return 'minor transformation and adjustment';
    if (changingLinesCount <= 4) return 'significant transformation and change';
    return 'major transformation and upheaval';
  }
}
