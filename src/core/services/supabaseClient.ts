/**
 * Supabase客户端配置
 * 用于管理用户认证和数据库连接
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { EnvConfigManager } from '../../utils/envConfig';

interface SupabaseConfig {
  url: string;
  anonKey: string;
  options?: {
    auth?: {
      autoRefreshToken?: boolean;
      persistSession?: boolean;
      detectSessionInUrl?: boolean;
    };
  };
}

class SupabaseManager {
  private static client: SupabaseClient | null = null;
  private static config: SupabaseConfig | null = null;

  /**
   * 初始化Supabase客户端
   */
  static async initialize(): Promise<SupabaseClient> {
    try {
      if (this.client) {
        return this.client;
      }

      const config = this.getConfig();
      if (!config.url || !config.anonKey) {
        throw new Error('Supabase配置不完整，请检查环境变量');
      }

      this.client = createClient(config.url, config.anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        },
        ...config.options
      });

      console.log('✅ Supabase客户端初始化成功');
      return this.client;
    } catch (error) {
      console.error('❌ Supabase客户端初始化失败:', error);
      throw error;
    }
  }

  /**
   * 获取Supabase客户端实例
   */
  static getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase客户端未初始化，请先调用initialize()');
    }
    return this.client;
  }

  /**
   * 获取配置信息
   */
  private static getConfig(): SupabaseConfig {
    if (this.config) {
      return this.config;
    }

    // 从环境变量或本地配置获取
    const envConfig = EnvConfigManager.getConfig();
    
    this.config = {
      url: envConfig.VITE_SUPABASE_URL || 
           import.meta.env.VITE_SUPABASE_URL || 
           'https://your-project.supabase.co',
      anonKey: envConfig.VITE_SUPABASE_ANON_KEY || 
               import.meta.env.VITE_SUPABASE_ANON_KEY || 
               'your-anon-key'
    };

    return this.config;
  }

  /**
   * 更新配置
   */
  static updateConfig(config: Partial<SupabaseConfig>) {
    this.config = { ...this.getConfig(), ...config };
    
    // 保存到环境配置管理器
    EnvConfigManager.setConfig({
      VITE_SUPABASE_URL: this.config.url,
      VITE_SUPABASE_ANON_KEY: this.config.anonKey
    });

    // 重新初始化客户端
    this.client = null;
    this.initialize();
  }

  /**
   * 健康检查
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const client = this.getClient();
      const { error } = await client.from('_health_check').select('*').limit(1);
      
      if (error && error.code !== 'PGRST116') { // PGRST116 是表不存在的错误，这里是正常的
        console.warn('⚠️ Supabase健康检查警告:', error.message);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Supabase健康检查失败:', error);
      return false;
    }
  }

  /**
   * 重置客户端（用于错误恢复）
   */
  static reset() {
    this.client = null;
    this.config = null;
    console.log('🔄 Supabase客户端已重置');
  }
}

export { SupabaseManager, type SupabaseConfig };
export default SupabaseManager.getClient; 