/**
 * 代理状态检测工具
 * 用于诊断Vite代理配置是否正常工作
 */

interface ProxyTestResult {
  endpoint: string;
  status: 'success' | 'error' | 'timeout';
  statusCode?: number;
  error?: string;
  responseTime?: number;
}

export class ProxyDetector {
  private static readonly TIMEOUT = 10000; // 10秒超时

  /**
   * 测试API代理是否可用
   */
  static async testProxy(endpoint: string, method: 'GET' | 'POST' = 'POST'): Promise<ProxyTestResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🔍 测试代理端点: ${endpoint}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method === 'POST' ? JSON.stringify({
          model: 'test',
          messages: [{ role: 'user', content: 'test' }]
        }) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      console.log(`📡 代理测试结果: ${response.status} ${response.statusText} (${responseTime}ms)`);

      return {
        endpoint,
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error(`⏰ 代理测试超时: ${endpoint} (${this.TIMEOUT}ms)`);
          return {
            endpoint,
            status: 'timeout',
            error: '请求超时',
            responseTime
          };
        }
        
        console.error(`❌ 代理测试失败: ${endpoint}`, error.message);
        return {
          endpoint,
          status: 'error',
          error: error.message,
          responseTime
        };
      }
      
      return {
        endpoint,
        status: 'error',
        error: String(error),
        responseTime
      };
    }
  }

  /**
   * 测试所有LLM API代理
   */
  static async testAllProxies(): Promise<ProxyTestResult[]> {
    const endpoints = [
      '/api/qianwen',
      '/api/openai', 
      '/api/wenxin',
      '/api/claude'
    ];

    console.log('🧪 开始测试所有API代理...');
    
    const results = await Promise.all(
      endpoints.map(endpoint => this.testProxy(endpoint))
    );

    console.log('📊 代理测试完成:', results);
    return results;
  }

  /**
   * 获取代理诊断报告
   */
  static async getDiagnosticReport(): Promise<{
    summary: string;
    recommendations: string[];
    results: ProxyTestResult[];
  }> {
    const results = await this.testAllProxies();
    
    const workingProxies = results.filter(r => r.status === 'success');
    const failedProxies = results.filter(r => r.status === 'error');
    const timeoutProxies = results.filter(r => r.status === 'timeout');

    let summary = '';
    const recommendations: string[] = [];

    if (workingProxies.length === 0) {
      summary = '❌ 所有API代理都无法正常工作';
      recommendations.push('检查Vite开发服务器是否正常运行');
      recommendations.push('检查vite.config.ts中的proxy配置');
      recommendations.push('检查网络连接');
      recommendations.push('尝试重启开发服务器');
    } else if (failedProxies.length > 0) {
      summary = `⚠️ 部分API代理工作正常 (${workingProxies.length}/${results.length})`;
      recommendations.push('检查失败代理的目标URL是否正确');
      recommendations.push('验证相关API服务是否可用');
    } else {
      summary = '✅ 所有API代理工作正常';
    }

    if (timeoutProxies.length > 0) {
      recommendations.push('网络连接较慢，考虑增加超时时间');
    }

    return {
      summary,
      recommendations,
      results
    };
  }
} 