/**
 * 分析服务统一导出
 * 初始化所有服务并注册到管理器
 */

import { AnalysisServiceManager } from './analysisService';
import { YijingAnalysisService } from './implementations/yijingAnalysisService';
import { ZiweiAnalysisService } from './implementations/ziweiAnalysisService';
import { TarotAnalysisService } from './implementations/tarotAnalysisService';
import { IntegratedAnalysisService } from './implementations/integratedAnalysisService';

// 初始化服务实例
const yijingService = new YijingAnalysisService();
const ziweiService = new ZiweiAnalysisService();
const tarotService = new TarotAnalysisService();
const integratedService = new IntegratedAnalysisService();

// 注册服务到管理器
AnalysisServiceManager.registerYijingService(yijingService);
AnalysisServiceManager.registerZiweiService(ziweiService);
AnalysisServiceManager.registerTarotService(tarotService);
AnalysisServiceManager.registerIntegratedService(integratedService);

// 导出管理器和服务
export { AnalysisServiceManager, AnalysisMode } from './analysisService';
export type {
  IAnalysisService,
  IYijingAnalysisService,
  IZiweiAnalysisService,
  ITarotAnalysisService,
  IIntegratedAnalysisService,
} from './analysisService';

// 导出服务实例（如果需要直接使用）
export { yijingService, ziweiService, tarotService, integratedService };








