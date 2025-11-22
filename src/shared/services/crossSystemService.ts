/**
 * 跨系统融合服务
 * 提供问题类型识别、宫位匹配、跨系统分析等核心功能
 */

import type {
  QuestionType,
  QuestionClassification,
  ZiweiPalace,
  CrossSystemAnalysis,
  IntegratedInsight,
  YijingResult,
  ZiweiResult,
  TarotResult,
} from '../types/cross-system';

/**
 * 问题类型与宫位的映射关系
 */
const QUESTION_TYPE_TO_PALACE: Record<QuestionType, ZiweiPalace> = {
  career: 'guanlu', // 事业 -> 官禄宫
  wealth: 'cai', // 财运 -> 财帛宫
  love: 'fuqi', // 感情 -> 夫妻宫
  marriage: 'fuqi', // 婚姻 -> 夫妻宫
  health: 'jiluan', // 健康 -> 疾厄宫
  study: 'fumu', // 学习 -> 父母宫（或官禄宫）
  family: 'fumu', // 家庭 -> 父母宫
  friendship: 'pugu', // 友情 -> 仆役宫
  travel: 'qianyi', // 出行 -> 迁移宫
  property: 'tianzhai', // 房产 -> 田宅宫
  general: 'ming', // 一般性问题 -> 命宫
};

/**
 * 问题类型关键词库
 */
const QUESTION_KEYWORDS: Record<QuestionType, string[]> = {
  career: ['工作', '事业', '职业', '升职', '跳槽', '创业', '公司', '老板', '同事', '项目', '业绩'],
  wealth: ['钱', '财运', '投资', '理财', '股票', '基金', '赚钱', '收入', '支出', '债务', '财务'],
  love: ['恋爱', '感情', '喜欢', '暗恋', '表白', '分手', '复合', '暧昧', '约会', '恋人'],
  marriage: ['结婚', '婚姻', '配偶', '夫妻', '离婚', '婚礼', '求婚', '订婚'],
  health: ['健康', '身体', '疾病', '生病', '医院', '治疗', '康复', '体检', '养生'],
  study: ['学习', '考试', '成绩', '作业', '复习', '考研', '留学', '教育', '知识'],
  family: ['家庭', '父母', '子女', '兄弟姐妹', '家人', '亲情', '家事'],
  friendship: ['朋友', '友情', '社交', '人际关系', '伙伴', '同学', '同事'],
  travel: ['旅行', '出行', '出差', '搬家', '迁移', '远行', '旅游'],
  property: ['房子', '房产', '买房', '租房', '装修', '搬家', '不动产'],
  general: [], // 一般性问题无特定关键词
};

/**
 * 问题类型识别服务
 * 根据用户问题自动识别问题类型，并匹配对应的紫微宫位
 */
export class QuestionClassifierService {
  /**
   * 识别问题类型
   * @param question 用户问题
   * @returns 问题类型识别结果
   */
  static classify(question: string): QuestionClassification {
    if (!question || question.trim().length === 0) {
      return {
        type: 'general',
        confidence: 0,
        keywords: [],
        relatedPalace: 'ming',
      };
    }

    const normalizedQuestion = question.toLowerCase();
    const matchedTypes: Array<{ type: QuestionType; score: number; keywords: string[] }> = [];

    // 遍历所有问题类型，计算匹配度
    for (const [type, keywords] of Object.entries(QUESTION_KEYWORDS)) {
      const matchedKeywords: string[] = [];
      let score = 0;

      for (const keyword of keywords) {
        if (normalizedQuestion.includes(keyword)) {
          matchedKeywords.push(keyword);
          score += 10; // 每个关键词10分
        }
      }

      if (score > 0) {
        matchedTypes.push({
          type: type as QuestionType,
          score,
          keywords: matchedKeywords,
        });
      }
    }

    // 如果没有匹配到任何类型，返回一般性问题
    if (matchedTypes.length === 0) {
      return {
        type: 'general',
        confidence: 50,
        keywords: [],
        relatedPalace: QUESTION_TYPE_TO_PALACE.general,
      };
    }

    // 选择得分最高的类型
    const bestMatch = matchedTypes.reduce((prev, current) =>
      current.score > prev.score ? current : prev
    );

    // 计算置信度（基于匹配关键词数量和得分）
    const confidence = Math.min(100, bestMatch.score + matchedTypes.length * 5);

    return {
      type: bestMatch.type,
      confidence,
      keywords: bestMatch.keywords,
      relatedPalace: QUESTION_TYPE_TO_PALACE[bestMatch.type],
    };
  }

  /**
   * 根据问题类型获取对应宫位
   * @param questionType 问题类型
   * @returns 对应的紫微宫位
   */
  static getPalaceByQuestionType(questionType: QuestionType): ZiweiPalace {
    return QUESTION_TYPE_TO_PALACE[questionType];
  }
}

/**
 * 跨系统分析服务
 * 整合易经、紫微、塔罗三个系统的分析结果
 */
export class CrossSystemAnalyzerService {
  /**
   * 分析三个系统的一致性
   * @param yijing 易经结果
   * @param ziwei 紫微结果
   * @param tarot 塔罗结果
   * @returns 一致性分析
   */
  static analyzeConsistency(
    yijing?: YijingResult,
    ziwei?: ZiweiResult,
    tarot?: TarotResult
  ): {
    level: 'high' | 'medium' | 'low';
    score: number;
    analysis: string;
  } {
    const results = [yijing, ziwei, tarot].filter(Boolean);
    
    if (results.length < 2) {
      return {
        level: 'low',
        score: 0,
        analysis: '需要至少两个系统的结果才能进行一致性分析',
      };
    }

    // 简单的关键词匹配算法（后续可以优化为更复杂的语义分析）
    const allAdvice = [
      yijing?.advice,
      ziwei?.advice,
      tarot?.advice,
    ].filter(Boolean) as string[];

    // 计算关键词重叠度
    const keywords = allAdvice.flatMap(advice => 
      advice.split(/[，。、\s]/).filter(word => word.length > 1)
    );

    const uniqueKeywords = new Set(keywords);
    const overlapRatio = uniqueKeywords.size / keywords.length;

    // 根据重叠度计算一致性评分
    let score = 0;
    let level: 'high' | 'medium' | 'low' = 'low';

    if (overlapRatio > 0.7) {
      score = 80 + (overlapRatio - 0.7) * 100;
      level = 'high';
    } else if (overlapRatio > 0.4) {
      score = 50 + (overlapRatio - 0.4) * 100;
      level = 'medium';
    } else {
      score = overlapRatio * 125;
      level = 'low';
    }

    const analysis = this.generateConsistencyAnalysis(level, score, results.length);

    return {
      level,
      score: Math.min(100, Math.max(0, score)),
      analysis,
    };
  }

  /**
   * 生成一致性分析文本
   */
  private static generateConsistencyAnalysis(
    level: 'high' | 'medium' | 'low',
    score: number,
    systemCount: number
  ): string {
    const levelText = {
      high: '高度一致',
      medium: '中等一致',
      low: '一致性较低',
    }[level];

    return `三个系统（易经、紫微、塔罗）的分析结果${levelText}（一致性评分：${Math.round(score)}分）。这表明${this.getConsistencyMeaning(level)}`;
  }

  /**
   * 获取一致性含义
   */
  private static getConsistencyMeaning(level: 'high' | 'medium' | 'low'): string {
    return {
      high: '三个系统指向了相似的方向，建议可以更有信心地采取行动。',
      medium: '三个系统给出了部分一致的建议，需要综合考虑各系统的意见。',
      low: '三个系统的建议存在差异，建议深入思考问题的不同方面，或寻求更多信息。',
    }[level];
  }

  /**
   * 生成综合洞察（简化版，完整版需要调用LLM）
   * @param analysis 跨系统分析结果
   * @returns 综合洞察
   */
  static generateIntegratedInsight(
    analysis: CrossSystemAnalysis
  ): IntegratedInsight {
    const consistency = this.analyzeConsistency(
      analysis.yijing,
      analysis.ziwei,
      analysis.tarot
    );

    // 提取关键洞察
    const keyInsights: string[] = [];
    
    if (analysis.yijing) {
      keyInsights.push(`易经提示：${analysis.yijing.advice.substring(0, 50)}...`);
    }
    if (analysis.ziwei) {
      keyInsights.push(`紫微分析：${analysis.ziwei.advice.substring(0, 50)}...`);
    }
    if (analysis.tarot) {
      keyInsights.push(`塔罗指引：${analysis.tarot.advice.substring(0, 50)}...`);
    }

    // 生成综合建议（简化版，完整版需要LLM）
    const comprehensiveAdvice = this.generateComprehensiveAdvice(analysis, consistency);

    // 提取优先行动（简化版）
    const priorityActions = this.extractPriorityActions(analysis);

    return {
      consistency,
      keyInsights,
      comprehensiveAdvice,
      confidence: consistency.score,
      priorityActions,
    };
  }

  /**
   * 生成综合建议（简化版）
   */
  private static generateComprehensiveAdvice(
    analysis: CrossSystemAnalysis,
    consistency: { level: string; score: number; analysis: string }
  ): string {
    const parts: string[] = [];
    
    parts.push(`针对"${analysis.question}"这个问题，三个系统的综合分析如下：`);
    parts.push(consistency.analysis);
    
    if (analysis.yijing) {
      parts.push(`易经占卜建议：${analysis.yijing.advice}`);
    }
    if (analysis.ziwei) {
      parts.push(`紫微命盘分析：${analysis.ziwei.advice}`);
    }
    if (analysis.tarot) {
      parts.push(`塔罗牌指引：${analysis.tarot.advice}`);
    }

    return parts.join('\n\n');
  }

  /**
   * 提取优先行动（简化版）
   */
  private static extractPriorityActions(
    analysis: CrossSystemAnalysis
  ): Array<{ action: string; priority: 'high' | 'medium' | 'low'; reason: string }> {
    const actions: Array<{ action: string; priority: 'high' | 'medium' | 'low'; reason: string }> = [];

    // 根据问题类型生成通用行动建议
    const actionMap: Record<QuestionType, string[]> = {
      career: ['深入分析当前工作环境', '评估个人能力与岗位匹配度', '制定职业发展规划'],
      wealth: ['评估财务状况', '制定理财计划', '谨慎投资决策'],
      love: ['真诚沟通', '理解对方需求', '给予时间和空间'],
      marriage: ['加强沟通', '共同规划未来', '处理家庭关系'],
      health: ['关注身体信号', '及时就医', '调整生活习惯'],
      study: ['制定学习计划', '专注重点内容', '保持良好心态'],
      family: ['加强家庭沟通', '理解家人需求', '维护家庭和谐'],
      friendship: ['真诚对待朋友', '维护友谊关系', '处理人际矛盾'],
      travel: ['做好出行准备', '注意安全', '享受旅程'],
      property: ['评估房产价值', '考虑地理位置', '规划资金安排'],
      general: ['深入思考问题', '收集相关信息', '做出明智决策'],
    };

    const suggestions = actionMap[analysis.questionType] || actionMap.general;
    
    suggestions.forEach((suggestion, index) => {
      actions.push({
        action: suggestion,
        priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
        reason: `基于${analysis.questionType}类型问题的通用建议`,
      });
    });

    return actions;
  }
}

/**
 * 宫位匹配服务
 * 提供选项与宫位的匹配算法
 */
export class PalaceMatcherService {
  /**
   * 匹配选项到宫位（用于两难抉择）
   * @param option 选项文本
   * @param questionType 问题类型
   * @returns 匹配的宫位和评分
   */
  static matchOptionToPalace(
    option: string,
    questionType: QuestionType
  ): {
    palace: ZiweiPalace;
    matchScore: number;
    keywords: string[];
  } {
    // 首先根据问题类型确定主要宫位
    const primaryPalace = QUESTION_TYPE_TO_PALACE[questionType];

    // 分析选项中的关键词，判断是否匹配主要宫位
    const normalizedOption = option.toLowerCase();
    const keywords: string[] = [];
    let matchScore = 50; // 基础分

    // 检查选项是否包含与主要宫位相关的关键词
    const palaceKeywords: Record<ZiweiPalace, string[]> = {
      ming: ['自己', '个人', '性格', '能力'],
      guanlu: ['工作', '事业', '职业', '升职', '业绩'],
      cai: ['钱', '财富', '投资', '理财'],
      fuqi: ['感情', '恋爱', '婚姻', '配偶'],
      jiluan: ['健康', '身体', '疾病'],
      tianzhai: ['房子', '房产', '家'],
      qianyi: ['出行', '旅行', '迁移', '搬家'],
      fumu: ['父母', '家庭', '学习'],
      xiongdi: ['兄弟', '朋友', '伙伴'],
      zinu: ['子女', '孩子', '教育'],
      pugu: ['朋友', '同事', '社交'],
      fude: ['精神', '内心', '修养'],
    };

    const relevantKeywords = palaceKeywords[primaryPalace] || [];
    for (const keyword of relevantKeywords) {
      if (normalizedOption.includes(keyword)) {
        keywords.push(keyword);
        matchScore += 10;
      }
    }

    // 限制评分在0-100之间
    matchScore = Math.min(100, Math.max(0, matchScore));

    return {
      palace: primaryPalace,
      matchScore,
      keywords,
    };
  }
}








