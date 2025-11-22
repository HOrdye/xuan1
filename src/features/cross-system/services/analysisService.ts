/**
 * 分析服务接口框架
 * 支持独立分析和综合分析两种模式
 */

import type {
  CrossSystemAnalysis,
  YijingResult,
  ZiweiResult,
  TarotResult,
  QuestionType,
  ZiweiPalace,
  IntegratedInsight,
} from '@/shared/types/cross-system';
import { QuestionClassifierService } from '@/shared/services/crossSystemService';
import { generateIntegratedInsight } from '@/shared/utils/crossAnalyzer';

/**
 * 分析模式枚举
 */
export enum AnalysisMode {
  /** 独立分析：各个系统独立运行，不进行综合分析 */
  INDEPENDENT = 'independent',
  /** 综合分析：多个系统协同分析，生成综合洞察 */
  INTEGRATED = 'integrated',
}

/**
 * 分析服务接口
 * 定义各个分析系统的标准接口
 */
export interface IAnalysisService {
  /**
   * 执行分析
   * @param question 用户问题
   * @param options 分析选项（可选）
   * @returns 分析结果
   */
  analyze(question: string, options?: any): Promise<any>;
}

/**
 * 易经分析服务接口
 */
export interface IYijingAnalysisService extends IAnalysisService {
  analyze(question: string, options?: any): Promise<YijingResult | undefined>;
}

/**
 * 紫微分析服务接口
 */
export interface IZiweiAnalysisService extends IAnalysisService {
  analyze(
    question: string,
    relatedPalace?: ZiweiPalace,
    options?: any
  ): Promise<ZiweiResult | undefined>;
}

/**
 * 塔罗分析服务接口
 */
export interface ITarotAnalysisService extends IAnalysisService {
  analyze(question: string, options?: any): Promise<TarotResult | undefined>;
}

/**
 * 综合分析服务接口
 */
export interface IIntegratedAnalysisService {
  /**
   * 生成综合分析
   * @param analysis 跨系统分析结果
   * @returns 综合洞察
   */
  generateInsight(analysis: CrossSystemAnalysis): Promise<IntegratedInsight>;
}

/**
 * 分析服务管理器
 * 管理各个分析服务的注册和调用
 */
export class AnalysisServiceManager {
  private static yijingService: IYijingAnalysisService | null = null;
  private static ziweiService: IZiweiAnalysisService | null = null;
  private static tarotService: ITarotAnalysisService | null = null;
  private static integratedService: IIntegratedAnalysisService | null = null;

  /**
   * 注册易经分析服务
   */
  static registerYijingService(service: IYijingAnalysisService) {
    this.yijingService = service;
  }

  /**
   * 注册紫微分析服务
   */
  static registerZiweiService(service: IZiweiAnalysisService) {
    this.ziweiService = service;
  }

  /**
   * 注册塔罗分析服务
   */
  static registerTarotService(service: ITarotAnalysisService) {
    this.tarotService = service;
  }

  /**
   * 注册综合分析服务
   */
  static registerIntegratedService(service: IIntegratedAnalysisService) {
    this.integratedService = service;
  }

  /**
   * 获取易经分析服务
   */
  static getYijingService(): IYijingAnalysisService | null {
    return this.yijingService;
  }

  /**
   * 获取紫微分析服务
   */
  static getZiweiService(): IZiweiAnalysisService | null {
    return this.ziweiService;
  }

  /**
   * 获取塔罗分析服务
   */
  static getTarotService(): ITarotAnalysisService | null {
    return this.tarotService;
  }

  /**
   * 获取综合分析服务
   */
  static getIntegratedService(): IIntegratedAnalysisService | null {
    return this.integratedService;
  }

  /**
   * 执行独立分析（各个系统独立运行）
   * @param question 用户问题
   * @param selectedSystems 选择的系统列表
   * @param onProgress 进度回调（可选）
   * @returns 跨系统分析结果（不包含综合洞察）
   */
  static async performIndependentAnalysis(
    question: string,
    selectedSystems: string[],
    onProgress?: (system: string, status: 'start' | 'complete' | 'error', error?: Error) => void
  ): Promise<CrossSystemAnalysis> {
    const classification = QuestionClassifierService.classify(question);

    const analysis: CrossSystemAnalysis = {
      question,
      questionType: classification.type,
      timestamp: Date.now(),
    };

    // 并行调用各个系统的分析
    const promises: Promise<any>[] = [];

    if (selectedSystems.includes('yijing') && this.yijingService) {
      onProgress?.('yijing', 'start');
      promises.push(
        this.yijingService.analyze(question)
          .then(result => {
            analysis.yijing = result;
            onProgress?.('yijing', 'complete');
            return result;
          })
          .catch(error => {
            onProgress?.('yijing', 'error', error);
            throw error;
          })
      );
    }

    if (selectedSystems.includes('ziwei') && this.ziweiService) {
      onProgress?.('ziwei', 'start');
      promises.push(
        this.ziweiService
          .analyze(question, classification.relatedPalace)
          .then(result => {
            analysis.ziwei = result;
            onProgress?.('ziwei', 'complete');
            return result;
          })
          .catch(error => {
            onProgress?.('ziwei', 'error', error);
            throw error;
          })
      );
    }

    if (selectedSystems.includes('tarot') && this.tarotService) {
      onProgress?.('tarot', 'start');
      promises.push(
        this.tarotService.analyze(question)
          .then(result => {
            analysis.tarot = result;
            onProgress?.('tarot', 'complete');
            return result;
          })
          .catch(error => {
            onProgress?.('tarot', 'error', error);
            throw error;
          })
      );
    }

    // 使用Promise.allSettled确保即使某个系统失败，其他系统仍能完成
    await Promise.allSettled(promises);

    return analysis;
  }

  /**
   * 执行综合分析（包含综合洞察）
   * @param question 用户问题
   * @param selectedSystems 选择的系统列表
   * @param onProgress 进度回调（可选）
   * @returns 跨系统分析结果（包含综合洞察）
   */
  static async performIntegratedAnalysis(
    question: string,
    selectedSystems: string[],
    onProgress?: (system: string, status: 'start' | 'complete' | 'error', error?: Error) => void
  ): Promise<CrossSystemAnalysis> {
    // 先执行独立分析
    const analysis = await this.performIndependentAnalysis(
      question,
      selectedSystems,
      onProgress
    );

    // 如果有综合分析服务，生成综合洞察
    if (this.integratedService) {
      try {
        onProgress?.('integrated', 'start');
        analysis.integratedInsight =
          await this.integratedService.generateInsight(analysis);
        onProgress?.('integrated', 'complete');
      } catch (error) {
        console.error('生成综合洞察失败:', error);
        onProgress?.('integrated', 'error', error as Error);
        // 使用默认的综合分析
        analysis.integratedInsight = generateIntegratedInsight(analysis);
      }
    } else {
      // 使用默认的综合分析
      analysis.integratedInsight = generateIntegratedInsight(analysis);
    }

    return analysis;
  }
}

