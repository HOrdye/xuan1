/**
 * 环境变量配置工具
 * 用于在运行时动态设置LLM配置
 */

interface EnvConfig {
  VITE_LLM_PROVIDER?: string;
  VITE_LLM_API_KEY?: string;
  VITE_LLM_BASE_URL?: string;
  VITE_LLM_MODEL?: string;
}

class EnvConfigManager {
  private static config: EnvConfig = {};

  /**
   * 设置环境变量配置
   */
  static setConfig(config: EnvConfig) {
    this.config = { ...this.config, ...config };
    
    // 将配置保存到localStorage以便持久化
    localStorage.setItem('tianxuan_env_config', JSON.stringify(this.config));
    
    console.log('🔧 环境配置已更新:', config);
  }

  /**
   * 获取环境变量配置
   */
  static getConfig(): EnvConfig {
    // 优先从localStorage读取
    try {
      const saved = localStorage.getItem('tianxuan_env_config');
      if (saved) {
        this.config = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('读取本地配置失败:', e);
    }

    return { ...this.config };
  }

  /**
   * 获取特定环境变量
   */
  static getEnvVar(key: keyof EnvConfig, defaultValue: string = ''): string {
    const config = this.getConfig();
    
    // 优先使用运行时配置
    if (config[key]) {
      return config[key];
    }

    // 然后使用环境变量
    try {
      const envValue = (globalThis as any).import?.meta?.env?.[key];
      if (envValue) {
        return envValue;
      }
    } catch (e) {
      // 忽略错误
    }

    return defaultValue;
  }

  /**
   * 清除配置
   */
  static clearConfig() {
    this.config = {};
    localStorage.removeItem('tianxuan_env_config');
    console.log('🗑️ 环境配置已清除');
  }

  /**
   * 检查配置是否完整
   */
  static validateConfig(): { valid: boolean; missing: string[] } {
    const config = this.getConfig();
    const missing: string[] = [];

    if (!config.VITE_LLM_PROVIDER) {
      missing.push('LLM提供商');
    }

    // API密钥是可选的，因为可以使用本地解读
    
    return {
      valid: missing.length === 0,
      missing
    };
  }
}

export { EnvConfigManager, type EnvConfig }; 