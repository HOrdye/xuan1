/**
 * 核心模块类型定义
 * 
 * 包含所有核心服务相关的类型定义
 */

// 服务状态类型
export interface ServiceStatus {
  isInitialized: boolean;
  isRunning: boolean;
  lastUpdated: number;
  error?: string;
}

// 核心服务配置类型
export interface ServiceConfig {
  enableLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  persistData: boolean;
  storageKey?: string;
} 