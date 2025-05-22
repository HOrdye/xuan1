/**
 * 系统状态管理存储
 * 
 * 管理应用全局状态、加载状态、错误信息等
 */

import { defineStore } from 'pinia';

// 系统状态类型
export interface SystemState {
  isLoading: boolean;
  loadingMessage: string;
  errors: SystemError[];
  notifications: SystemNotification[];
  appVersion: string;
  lastUpdated: string;
}

// 系统错误类型
export interface SystemError {
  id: string;
  message: string;
  code?: string;
  timestamp: number;
  context?: Record<string, any>;
  handled: boolean;
}

// 系统通知类型
export interface SystemNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  title?: string;
  timestamp: number;
  duration?: number;
  read: boolean;
}

// 定义系统状态存储
export const useSystemStore = defineStore('system', {
  state: (): SystemState => ({
    isLoading: false,
    loadingMessage: '',
    errors: [],
    notifications: [],
    appVersion: '0.1.0',
    lastUpdated: new Date().toISOString(),
  }),
  
  getters: {
    // 是否有未处理的错误
    hasUnhandledErrors: (state) => state.errors.some(error => !error.handled),
    
    // 未读通知数量
    unreadNotificationCount: (state) => state.notifications.filter(n => !n.read).length,
    
    // 最近的错误
    latestError: (state) => {
      if (state.errors.length === 0) return null;
      return [...state.errors].sort((a, b) => b.timestamp - a.timestamp)[0];
    },
  },
  
  actions: {
    // 设置加载状态
    setLoading(isLoading: boolean, message = '') {
      this.isLoading = isLoading;
      this.loadingMessage = message;
    },
    
    // 添加错误
    addError(error: Omit<SystemError, 'id' | 'timestamp' | 'handled'>) {
      const newError: SystemError = {
        id: `error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: Date.now(),
        handled: false,
        ...error,
      };
      
      this.errors.push(newError);
      
      // 同时添加错误通知
      this.addNotification({
        type: 'error',
        title: '发生错误',
        message: error.message,
      });
      
      return newError.id;
    },
    
    // 标记错误为已处理
    markErrorHandled(errorId: string) {
      const error = this.errors.find(e => e.id === errorId);
      if (error) {
        error.handled = true;
      }
    },
    
    // 清除所有错误
    clearErrors() {
      this.errors = [];
    },
    
    // 添加通知
    addNotification(notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) {
      const newNotification: SystemNotification = {
        id: `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: Date.now(),
        read: false,
        ...notification,
      };
      
      this.notifications.push(newNotification);
      
      // 如果设置了持续时间，自动标记为已读
      if (notification.duration) {
        setTimeout(() => {
          this.markNotificationRead(newNotification.id);
        }, notification.duration);
      }
      
      return newNotification.id;
    },
    
    // 标记通知为已读
    markNotificationRead(notificationId: string) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    },
    
    // 标记所有通知为已读
    markAllNotificationsRead() {
      this.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    
    // 清除所有通知
    clearNotifications() {
      this.notifications = [];
    },
    
    // 清除已读通知
    clearReadNotifications() {
      this.notifications = this.notifications.filter(n => !n.read);
    },
    
    // 更新应用版本
    updateAppVersion(version: string) {
      this.appVersion = version;
      this.lastUpdated = new Date().toISOString();
    },
  },
  
  // 持久化配置
  persist: {
    key: 'tianxuan-system-state',
    storage: localStorage,
    paths: ['appVersion', 'lastUpdated', 'notifications'],
  },
}); 