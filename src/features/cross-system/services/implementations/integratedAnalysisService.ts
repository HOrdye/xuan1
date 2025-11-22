/**
 * 综合分析服务实现
 * 实现 IIntegratedAnalysisService 接口
 */

import type {
  IIntegratedAnalysisService,
  IntegratedInsight,
  CrossSystemAnalysis,
} from '../analysisService';
import { generateIntegratedInsight } from '@/shared/utils/crossAnalyzer';
import { LLMService } from '@/services/LLMService';
import { CrossSystemAnalyzerService } from '@/shared/services/crossSystemService';

/**
 * 综合分析服务实现类
 * 支持LLM生成智能综合分析，包含一致性、冲突性、互补性等多维度分析
 */
export class IntegratedAnalysisService implements IIntegratedAnalysisService {
  /**
   * 生成综合洞察
   * 优先使用LLM生成，失败时降级到基础算法
   */
  async generateInsight(
    analysis: CrossSystemAnalysis
  ): Promise<IntegratedInsight> {
    try {
      // 尝试使用LLM生成智能综合分析
      const llmInsight = await this.generateLLMInsight(analysis);
      if (llmInsight) {
        return llmInsight;
      }
    } catch (error) {
      console.warn('LLM综合分析生成失败，使用基础算法:', error);
    }

    // 降级方案：使用基础算法 + 增强的多维度分析
    return this.generateEnhancedInsight(analysis);
  }

  /**
   * 使用LLM生成智能综合分析
   */
  private async generateLLMInsight(
    analysis: CrossSystemAnalysis
  ): Promise<IntegratedInsight | null> {
    const config = LLMService.getConfig();
    if (!config.apiKey) {
      return null; // 没有配置LLM，返回null使用降级方案
    }

    try {
      // 构建提示词
      const prompt = this.buildAnalysisPrompt(analysis);

      // 调用LLM
      const response = await LLMService.getCustomInterpretation(prompt);

      // 解析LLM响应
      return this.parseLLMResponse(response, analysis);
    } catch (error) {
      console.error('LLM综合分析生成失败:', error);
      return null;
    }
  }

  /**
   * 构建分析提示词
   */
  private buildAnalysisPrompt(analysis: CrossSystemAnalysis): string {
    const parts: string[] = [];

    parts.push('你是一位资深的玄学咨询师，擅长整合多个占卜系统的分析结果。');
    parts.push('请根据以下三个系统的分析结果，生成综合的决策建议。\n');

    parts.push(`用户问题：${analysis.question}\n`);

    if (analysis.yijing) {
      parts.push('【易经占卜分析】');
      parts.push(`卦象：${analysis.yijing.hexagram.name} (${analysis.yijing.hexagram.symbol})`);
      parts.push(`解读：${analysis.yijing.interpretation}`);
      parts.push(`建议：${analysis.yijing.advice}\n`);
    }

    if (analysis.ziwei) {
      parts.push('【紫微命盘分析】');
      parts.push(`相关宫位：${analysis.ziwei.relatedPalace || '命宫'}`);
      parts.push(`分析：${analysis.ziwei.analysis}`);
      parts.push(`建议：${analysis.ziwei.advice}\n`);
    }

    if (analysis.tarot) {
      parts.push('【塔罗指引分析】');
      parts.push('抽到的牌：');
      analysis.tarot.cards.forEach((card, index) => {
        parts.push(`${index + 1}. ${card.position} - ${card.name}: ${card.meaning}`);
      });
      parts.push(`整体解读：${analysis.tarot.overallInterpretation}`);
      parts.push(`建议：${analysis.tarot.advice}\n`);
    }

    parts.push('请生成综合分析，包括：');
    parts.push('1. 一致性分析：分析三个系统结果的一致性程度和原因');
    parts.push('2. 冲突性分析：如果存在冲突，分析冲突的原因和如何调和');
    parts.push('3. 互补性分析：分析三个系统如何互补，提供更全面的视角');
    parts.push('4. 综合建议：基于三个系统的分析，给出统一的行动建议');
    parts.push('5. 优先行动：列出3-5个优先行动项，按重要性排序');

    parts.push('\n请以JSON格式返回，格式如下：');
    parts.push(`{
  "consistency": {
    "level": "high|medium|low",
    "score": 0-100,
    "analysis": "一致性分析文本"
  },
  "conflict": {
    "hasConflict": true|false,
    "analysis": "冲突性分析文本（如果有冲突）"
  },
  "complementarity": {
    "analysis": "互补性分析文本"
  },
  "comprehensiveAdvice": "综合建议文本",
  "keyInsights": ["核心洞察1", "核心洞察2", "核心洞察3"],
  "priorityActions": [
    {"action": "行动1", "priority": "high|medium|low", "reason": "原因"},
    {"action": "行动2", "priority": "high|medium|low", "reason": "原因"}
  ]
}`);

    return parts.join('\n');
  }

  /**
   * 解析LLM响应
   */
  private parseLLMResponse(
    response: string,
    analysis: CrossSystemAnalysis
  ): IntegratedInsight {
    try {
      // 尝试提取JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          consistency: {
            level: parsed.consistency?.level || 'medium',
            score: parsed.consistency?.score || 50,
            analysis: parsed.consistency?.analysis || '综合分析中...',
          },
          keyInsights: parsed.keyInsights || [],
          comprehensiveAdvice: parsed.comprehensiveAdvice || response,
          confidence: parsed.consistency?.score || 50,
          priorityActions: parsed.priorityActions || [],
          // 扩展字段
          conflict: parsed.conflict ? {
            hasConflict: parsed.conflict.hasConflict || false,
            analysis: parsed.conflict.analysis || '',
          } : undefined,
          complementarity: parsed.complementarity ? {
            analysis: parsed.complementarity.analysis || '',
          } : undefined,
        };
      }
    } catch (error) {
      console.warn('解析LLM响应失败，使用原始文本:', error);
    }

    // 如果解析失败，使用原始响应作为综合建议
    return {
      consistency: CrossSystemAnalyzerService.analyzeConsistency(
        analysis.yijing,
        analysis.ziwei,
        analysis.tarot
      ),
      keyInsights: [response.substring(0, 200) + '...'],
      comprehensiveAdvice: response,
      confidence: 60,
      priorityActions: [],
    };
  }

  /**
   * 生成增强的综合洞察（多维度分析）
   */
  private generateEnhancedInsight(
    analysis: CrossSystemAnalysis
  ): IntegratedInsight {
    // 基础一致性分析
    const consistency = CrossSystemAnalyzerService.analyzeConsistency(
      analysis.yijing,
      analysis.ziwei,
      analysis.tarot
    );

    // 冲突性分析
    const conflict = this.analyzeConflict(analysis);

    // 互补性分析
    const complementarity = this.analyzeComplementarity(analysis);

    // 生成综合建议
    const comprehensiveAdvice = this.generateComprehensiveAdvice(
      analysis,
      consistency,
      conflict,
      complementarity
    );

    // 提取关键洞察
    const keyInsights = this.extractKeyInsights(analysis, consistency, conflict, complementarity);

    // 提取优先行动
    const priorityActions = this.extractPriorityActions(analysis, consistency);

    return {
      consistency,
      keyInsights,
      comprehensiveAdvice,
      confidence: consistency.score,
      priorityActions,
      // 扩展字段
      conflict,
      complementarity,
    };
  }

  /**
   * 分析冲突性
   */
  private analyzeConflict(analysis: CrossSystemAnalysis): {
    hasConflict: boolean;
    analysis: string;
  } {
    const results = [
      analysis.yijing?.advice,
      analysis.ziwei?.advice,
      analysis.tarot?.advice,
    ].filter(Boolean) as string[];

    if (results.length < 2) {
      return {
        hasConflict: false,
        analysis: '需要至少两个系统的结果才能进行冲突性分析。',
      };
    }

    // 简单的关键词冲突检测
    const positiveKeywords = ['积极', '行动', '前进', '抓住', '把握', '主动'];
    const negativeKeywords = ['谨慎', '等待', '观察', '保守', '避免', '暂停'];

    let positiveCount = 0;
    let negativeCount = 0;

    results.forEach(advice => {
      const lowerAdvice = advice.toLowerCase();
      positiveKeywords.forEach(keyword => {
        if (lowerAdvice.includes(keyword)) positiveCount++;
      });
      negativeKeywords.forEach(keyword => {
        if (lowerAdvice.includes(keyword)) negativeCount++;
      });
    });

    const hasConflict = Math.abs(positiveCount - negativeCount) > 2;

    if (hasConflict) {
      return {
        hasConflict: true,
        analysis: `检测到系统间存在一定的观点差异。部分系统建议采取积极行动，而部分系统建议保持谨慎。这反映了问题的复杂性，建议综合考虑各系统的建议，找到平衡点。`,
      };
    }

    return {
      hasConflict: false,
      analysis: '各系统的建议基本一致，没有明显的冲突。',
    };
  }

  /**
   * 分析互补性
   */
  private analyzeComplementarity(analysis: CrossSystemAnalysis): {
    analysis: string;
  } {
    const parts: string[] = [];

    if (analysis.yijing && analysis.ziwei && analysis.tarot) {
      parts.push('三个系统从不同维度提供了互补的视角：');
      parts.push('- 易经占卜提供了"何时做"的时机指导；');
      parts.push('- 紫微命盘提供了"适合做什么"的特质分析；');
      parts.push('- 塔罗指引提供了"内心真实想法"的情感洞察。');
      parts.push('三者结合，形成了完整的决策支持体系。');
    } else if (analysis.yijing && analysis.ziwei) {
      parts.push('易经和紫微的结合提供了时机与特质的双重指导。');
    } else if (analysis.yijing && analysis.tarot) {
      parts.push('易经和塔罗的结合提供了时机与情感的平衡视角。');
    } else if (analysis.ziwei && analysis.tarot) {
      parts.push('紫微和塔罗的结合提供了特质与情感的深度洞察。');
    }

    return {
      analysis: parts.join(' ') || '各系统提供了不同角度的分析。',
    };
  }

  /**
   * 生成综合建议
   */
  private generateComprehensiveAdvice(
    analysis: CrossSystemAnalysis,
    consistency: any,
    conflict: any,
    complementarity: any
  ): string {
    const parts: string[] = [];

    parts.push(`针对"${analysis.question}"这个问题，综合分析如下：\n`);

    if (consistency.level === 'high') {
      parts.push('三个系统的分析结果高度一致，这表明建议的方向是明确的。');
    } else if (consistency.level === 'medium') {
      parts.push('三个系统的分析结果部分一致，建议综合考虑各系统的意见。');
    } else {
      parts.push('三个系统的分析结果存在差异，这反映了问题的复杂性，需要深入思考。');
    }

    if (conflict.hasConflict) {
      parts.push(conflict.analysis);
    }

    parts.push(complementarity.analysis);

    parts.push('\n【综合建议】');
    if (analysis.yijing) {
      parts.push(`易经提示：${analysis.yijing.advice}`);
    }
    if (analysis.ziwei) {
      parts.push(`紫微分析：${analysis.ziwei.advice}`);
    }
    if (analysis.tarot) {
      parts.push(`塔罗指引：${analysis.tarot.advice}`);
    }

    return parts.join('\n');
  }

  /**
   * 提取关键洞察
   */
  private extractKeyInsights(
    analysis: CrossSystemAnalysis,
    consistency: any,
    conflict: any,
    complementarity: any
  ): string[] {
    const insights: string[] = [];

    if (analysis.yijing) {
      insights.push(`易经提示：${analysis.yijing.advice.substring(0, 50)}...`);
    }
    if (analysis.ziwei) {
      insights.push(`紫微分析：${analysis.ziwei.advice.substring(0, 50)}...`);
    }
    if (analysis.tarot) {
      insights.push(`塔罗指引：${analysis.tarot.advice.substring(0, 50)}...`);
    }

    if (consistency.level === 'high') {
      insights.push('三个系统的建议高度一致，可以更有信心地采取行动。');
    }

    if (conflict.hasConflict) {
      insights.push('系统间存在观点差异，需要找到平衡点。');
    }

    return insights;
  }

  /**
   * 提取优先行动
   */
  private extractPriorityActions(analysis: CrossSystemAnalysis, consistency: any): Array<{
    action: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
  }> {
    const actions: Array<{
      action: string;
      priority: 'high' | 'medium' | 'low';
      reason: string;
    }> = [];

    // 根据问题类型生成通用行动建议
    const actionMap: Record<string, string[]> = {
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

    // 如果一致性高，添加"采取行动"作为高优先级
    if (consistency.level === 'high') {
      actions.unshift({
        action: '基于三个系统的一致建议，采取行动',
        priority: 'high',
        reason: '三个系统的建议高度一致，可以更有信心地行动',
      });
    }

    return actions;
  }
}

