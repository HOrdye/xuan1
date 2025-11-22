/**
 * 认知阶梯埋点工具
 * 用于追踪用户在紫微斗数功能中的认知路径转化率
 * 
 * 认知阶梯设计：
 * 第一层（认知）：测试开始 → 测试完成 → 输入生日 → 查看命盘
 * 第二层（兴趣）：查看命盘 → 使用三维解读
 * 第三层（价值）：三维解读 → 付费转化
 */

export type CognitiveLadderEvent =
  | 'test_start'           // 测试开始
  | 'test_complete'         // 测试完成
  | 'birthday_input'        // 输入生日
  | 'chart_view'            // 查看命盘
  | 'triple_analysis_use'   // 使用三维解读
  | 'paywall_click';        // 点击付费了解

export interface CognitiveLadderEventData {
  event: CognitiveLadderEvent;
  timestamp: string;
  sessionId?: string;
  userId?: string;
  [key: string]: any; // 允许额外的自定义数据
}

/**
 * 追踪认知阶梯事件
 */
export function trackCognitiveLadder(event: CognitiveLadderEvent, data?: any): void {
  try {
    // 生成或获取会话ID
    let sessionId = sessionStorage.getItem('ziwei_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('ziwei_session_id', sessionId);
    }

    // 获取用户ID（如果有）
    const userId = localStorage.getItem('user_id') || undefined;

    const eventData: CognitiveLadderEventData = {
      event,
      timestamp: new Date().toISOString(),
      sessionId,
      userId,
      ...data
    };

    // 保存到localStorage（后续可以发送到分析服务）
    const events = JSON.parse(localStorage.getItem('ziwei_cognitive_ladder_events') || '[]');
    events.push(eventData);

    // 限制事件数量（最多保存1000条）
    if (events.length > 1000) {
      events.splice(0, events.length - 1000);
    }

    localStorage.setItem('ziwei_cognitive_ladder_events', JSON.stringify(events));

    console.log('📊 认知阶梯埋点:', event, eventData);
  } catch (error) {
    console.warn('⚠️ 埋点记录失败:', error);
  }
}

/**
 * 获取认知阶梯转化率数据
 */
export function getCognitiveLadderStats(): {
  testStart: number;
  testComplete: number;
  birthdayInput: number;
  chartView: number;
  tripleAnalysisUse: number;
  paywallClick: number;
  conversionRates: {
    testStartToComplete: number;      // 测试完成率
    testCompleteToBirthday: number;   // 输入生日转化率
    birthdayToChartView: number;      // 查看命盘转化率
    chartViewToTripleAnalysis: number; // 三维解读使用率
    tripleAnalysisToPaywall: number;  // 付费转化率
  };
} {
  try {
    const events: CognitiveLadderEventData[] = JSON.parse(
      localStorage.getItem('ziwei_cognitive_ladder_events') || '[]'
    );

    // 按会话分组统计
    const sessionGroups: Record<string, CognitiveLadderEventData[]> = {};
    events.forEach(event => {
      const sessionId = event.sessionId || 'unknown';
      if (!sessionGroups[sessionId]) {
        sessionGroups[sessionId] = [];
      }
      sessionGroups[sessionId].push(event);
    });

    // 统计各阶段事件数
    let testStart = 0;
    let testComplete = 0;
    let birthdayInput = 0;
    let chartView = 0;
    let tripleAnalysisUse = 0;
    let paywallClick = 0;

    Object.values(sessionGroups).forEach(sessionEvents => {
      const eventTypes = sessionEvents.map(e => e.event);
      if (eventTypes.includes('test_start')) testStart++;
      if (eventTypes.includes('test_complete')) testComplete++;
      if (eventTypes.includes('birthday_input')) birthdayInput++;
      if (eventTypes.includes('chart_view')) chartView++;
      if (eventTypes.includes('triple_analysis_use')) tripleAnalysisUse++;
      if (eventTypes.includes('paywall_click')) paywallClick++;
    });

    // 计算转化率
    const conversionRates = {
      testStartToComplete: testStart > 0 ? (testComplete / testStart) * 100 : 0,
      testCompleteToBirthday: testComplete > 0 ? (birthdayInput / testComplete) * 100 : 0,
      birthdayToChartView: birthdayInput > 0 ? (chartView / birthdayInput) * 100 : 0,
      chartViewToTripleAnalysis: chartView > 0 ? (tripleAnalysisUse / chartView) * 100 : 0,
      tripleAnalysisToPaywall: tripleAnalysisUse > 0 ? (paywallClick / tripleAnalysisUse) * 100 : 0,
    };

    return {
      testStart,
      testComplete,
      birthdayInput,
      chartView,
      tripleAnalysisUse,
      paywallClick,
      conversionRates
    };
  } catch (error) {
    console.warn('⚠️ 获取认知阶梯统计数据失败:', error);
    return {
      testStart: 0,
      testComplete: 0,
      birthdayInput: 0,
      chartView: 0,
      tripleAnalysisUse: 0,
      paywallClick: 0,
      conversionRates: {
        testStartToComplete: 0,
        testCompleteToBirthday: 0,
        birthdayToChartView: 0,
        chartViewToTripleAnalysis: 0,
        tripleAnalysisToPaywall: 0,
      }
    };
  }
}



