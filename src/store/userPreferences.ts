/**
 * 用户偏好设置存储
 * 
 * 管理用户界面偏好、主题设置等个性化配置
 * 注意：此存储专门处理用户偏好，与用户认证系统(userStore.ts)分离
 */

import { defineStore } from 'pinia';

// 定义用户偏好设置类型
export interface UserPreferences {
  // 主题设置
  theme: 'light' | 'dark' | 'auto';
  
  // 字体大小
  fontSize: 'small' | 'medium' | 'large';
  
  // 动画效果
  enableAnimations: boolean;
  
  // 通知设置
  notifications: {
    enabled: boolean;
    daily: boolean;
    results: boolean;
  };
  
  // 历史记录
  history: {
    saveResults: boolean;
    maxItems: number;
  };
}

// 定义默认偏好设置
const defaultPreferences: UserPreferences = {
  theme: 'light',
  fontSize: 'medium',
  enableAnimations: true,
  notifications: {
    enabled: true,
    daily: true,
    results: true,
  },
  history: {
    saveResults: true,
    maxItems: 50,
  },
};

// 定义用户偏好设置存储
export const useUserPreferencesStore = defineStore('userPreferences', {
  state: () => ({
    preferences: { ...defaultPreferences },
    isFirstVisit: true,
    lastVisit: new Date().toISOString(),
  }),
  
  getters: {
    // 获取当前主题
    currentTheme: (state) => {
      if (state.preferences.theme === 'auto') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return state.preferences.theme;
    },
    
    // 获取字体大小CSS值
    fontSizeValue: (state) => {
      const sizes = {
        small: '14px',
        medium: '16px',
        large: '18px',
      };
      return sizes[state.preferences.fontSize];
    },
    
    // 检查是否启用动画
    isAnimationEnabled: (state) => state.preferences.enableAnimations,
    
    // 检查是否启用通知
    isNotificationEnabled: (state) => state.preferences.notifications.enabled,
  },
  
  actions: {
    // 更新主题设置
    setTheme(theme: 'light' | 'dark' | 'auto') {
      this.preferences.theme = theme;
      this.applyTheme();
    },
    
    // 更新字体大小
    setFontSize(size: 'small' | 'medium' | 'large') {
      this.preferences.fontSize = size;
      document.documentElement.style.fontSize = this.fontSizeValue;
    },
    
    // 切换动画开关
    toggleAnimations(enabled?: boolean) {
      if (typeof enabled === 'boolean') {
        this.preferences.enableAnimations = enabled;
      } else {
        this.preferences.enableAnimations = !this.preferences.enableAnimations;
      }
    },
    
    // 更新通知设置
    updateNotifications(settings: Partial<UserPreferences['notifications']>) {
      this.preferences.notifications = {
        ...this.preferences.notifications,
        ...settings,
      };
    },
    
    // 更新历史记录设置
    updateHistorySettings(settings: Partial<UserPreferences['history']>) {
      this.preferences.history = {
        ...this.preferences.history,
        ...settings,
      };
    },
    
    // 重置为默认设置
    resetToDefaults() {
      this.preferences = { ...defaultPreferences };
      this.applyTheme();
      document.documentElement.style.fontSize = this.fontSizeValue;
    },
    
    // 应用主题到DOM
    applyTheme() {
      const theme = this.currentTheme;
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    
    // 记录访问
    recordVisit() {
      this.isFirstVisit = false;
      this.lastVisit = new Date().toISOString();
    },
  },
  
  // 持久化配置
  persist: {
    key: 'tianxuan-user-preferences',
    storage: localStorage,
  },
}); 