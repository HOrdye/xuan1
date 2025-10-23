/**
 * 用户信息共享服务
 * 统一管理各占卜功能收集的用户信息，实现个性化集成
 */

import type { ZodiacInfo, ConstellationInfo } from '../features/fortune/types/fortune';

// 统一的用户信息接口
export interface UnifiedUserInfo {
  // 基础信息（从运势功能获取）
  basicInfo: {
    birthDate?: string;
    gender?: 'male' | 'female';
    question?: string;
  };
  
  // 玄学信息（从运势功能获取）
  mysticalInfo: {
    zodiac?: ZodiacInfo;
    constellation?: ConstellationInfo;
  };
  
  // 占卜上下文（从各功能获取）
  divinationContext: {
    questionType?: string;
    emotionalState?: string;
    decisionType?: string;
    urgency?: 'high' | 'medium' | 'low';
  };
}

// 个性化评分接口
export interface PersonalizationScore {
  relevance: number;
  personalization: number;
  userSatisfaction: number;
  overallScore: number;
}

// 用户反馈接口
export interface UserFeedback {
  feature: string;
  rating: number;
  feedback?: string;
  personalized: boolean;
}

export class UserInfoSharingService {
  private static userInfo: UnifiedUserInfo = {
    basicInfo: {},
    mysticalInfo: {},
    divinationContext: {}
  };

  private static feedbackHistory: UserFeedback[] = [];

  /**
   * 从运势功能收集信息
   */
  static collectFromFortune(fortuneData: {
    birthDate?: Date;
    gender?: 'male' | 'female';
    question?: string;
    zodiac?: ZodiacInfo;
    constellation?: ConstellationInfo;
  }): void {
    console.log('📊 从运势功能收集用户信息:', fortuneData);
    
    this.userInfo.basicInfo.birthDate = fortuneData.birthDate?.toISOString().split('T')[0];
    this.userInfo.basicInfo.gender = fortuneData.gender;
    this.userInfo.basicInfo.question = fortuneData.question;
    this.userInfo.mysticalInfo.zodiac = fortuneData.zodiac;
    this.userInfo.mysticalInfo.constellation = fortuneData.constellation;
    
    console.log('✅ 运势功能用户信息收集完成');
  }

  /**
   * 从两难抉择功能收集信息
   */
  static collectFromDilemma(optionA: string, optionB: string, question: string): void {
    console.log('📊 从两难抉择功能收集用户信息:', { optionA, optionB, question });
    
    this.userInfo.basicInfo.question = question;
    this.userInfo.divinationContext.decisionType = this.analyzeDecisionType(optionA, optionB);
    this.userInfo.divinationContext.emotionalState = this.analyzeEmotionalState(question);
    this.userInfo.divinationContext.urgency = this.analyzeUrgency(question);
    
    console.log('✅ 两难抉择功能用户信息收集完成');
  }

  /**
   * 从塔罗功能收集信息
   */
  static collectFromTarot(question: string): void {
    console.log('📊 从塔罗功能收集用户信息:', question);
    
    this.userInfo.basicInfo.question = question;
    this.userInfo.divinationContext.questionType = this.analyzeQuestionType(question);
    this.userInfo.divinationContext.emotionalState = this.analyzeEmotionalState(question);
    
    console.log('✅ 塔罗功能用户信息收集完成');
  }

  /**
   * 获取用户信息
   */
  static getUserInfo(): UnifiedUserInfo {
    return { ...this.userInfo };
  }

  /**
   * 清空用户信息
   */
  static clearUserInfo(): void {
    this.userInfo = {
      basicInfo: {},
      mysticalInfo: {},
      divinationContext: {}
    };
    console.log('🧹 用户信息已清空');
  }

  /**
   * 添加用户反馈
   */
  static addFeedback(feedback: UserFeedback): void {
    this.feedbackHistory.push(feedback);
    console.log('📝 用户反馈已记录:', feedback);
  }

  /**
   * 获取反馈历史
   */
  static getFeedbackHistory(): UserFeedback[] {
    return [...this.feedbackHistory];
  }

  /**
   * 分析决策类型
   */
  private static analyzeDecisionType(optionA: string, optionB: string): string {
    const relationshipKeywords = ['感情', '恋爱', '结婚', '分手', '复合', '表白', '追求'];
    const careerKeywords = ['工作', '跳槽', '升职', '创业', '学习', '技能', '职业'];
    const financialKeywords = ['投资', '理财', '买房', '买车', '消费', '储蓄', '债务'];
    const personalKeywords = ['健康', '减肥', '运动', '学习', '兴趣', '爱好', '生活'];

    const combinedText = `${optionA} ${optionB}`.toLowerCase();

    if (relationshipKeywords.some(keyword => combinedText.includes(keyword))) {
      return 'relationship';
    } else if (careerKeywords.some(keyword => combinedText.includes(keyword))) {
      return 'career';
    } else if (financialKeywords.some(keyword => combinedText.includes(keyword))) {
      return 'financial';
    } else if (personalKeywords.some(keyword => combinedText.includes(keyword))) {
      return 'personal';
    } else {
      return 'other';
    }
  }

  /**
   * 分析情感状态
   */
  private static analyzeEmotionalState(question: string): string {
    const positiveKeywords = ['开心', '兴奋', '期待', '希望', '乐观', '积极'];
    const negativeKeywords = ['焦虑', '担心', '害怕', '沮丧', '失望', '痛苦', '迷茫'];
    const conflictedKeywords = ['纠结', '矛盾', '犹豫', '不确定', '困惑', '两难'];

    const lowerQuestion = question.toLowerCase();

    if (conflictedKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return 'conflicted';
    } else if (negativeKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return 'negative';
    } else if (positiveKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return 'positive';
    } else {
      return 'neutral';
    }
  }

  /**
   * 分析问题类型
   */
  private static analyzeQuestionType(question: string): string {
    const predictionKeywords = ['会', '将', '未来', '预测', '结果'];
    const adviceKeywords = ['应该', '如何', '怎么', '建议', '指导'];
    const diagnosisKeywords = ['为什么', '原因', '根源', '问题'];
    const relationshipKeywords = ['他', '她', '对方', '关系', '感情'];
    const decisionKeywords = ['选择', '还是', '或者', '决定'];

    const lowerQuestion = question.toLowerCase();

    if (decisionKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return 'decision';
    } else if (relationshipKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return 'relationship';
    } else if (diagnosisKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return 'diagnosis';
    } else if (adviceKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return 'advice';
    } else if (predictionKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return 'prediction';
    } else {
      return 'self-exploration';
    }
  }

  /**
   * 分析紧急程度
   */
  private static analyzeUrgency(question: string): 'high' | 'medium' | 'low' {
    const urgentKeywords = ['紧急', '急', '马上', '立即', '现在', '今天'];
    const mediumKeywords = ['最近', '近期', '这个月', '下个月'];

    const lowerQuestion = question.toLowerCase();

    if (urgentKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return 'high';
    } else if (mediumKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return 'medium';
    } else {
      return 'low';
    }
  }
}

