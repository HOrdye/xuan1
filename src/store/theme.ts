/**
 * 主题设置存储
 * 
 * 管理应用主题颜色、变量和样式
 */

import { defineStore } from 'pinia';

// 主题变量类型
export interface ThemeVariables {
  // 基础色彩
  primary: string;
  secondary: string;
  accent: string;
  mystic: string;
  
  // 状态色彩
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // 背景色彩
  background: string;
  surface: string;
  
  // 文本色彩
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  
  // 边框和阴影
  border: string;
  shadow: string;
  
  // 交互状态
  hover: string;
  active: string;
  focus: string;
}

// 预设主题类型
export type ThemePreset = 'default' | 'mystic' | 'cosmic' | 'earthy' | 'custom';

// 预设主题映射
const themePresets: Record<Exclude<ThemePreset, 'custom'>, ThemeVariables> = {
  // 默认主题
  default: {
    primary: '#4C7EF3',
    secondary: '#7B42D6',
    accent: '#FC6162',
    mystic: '#9D63D2',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    background: '#f9f9fb',
    surface: '#ffffff',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    textMuted: '#9ca3af',
    border: '#e5e7eb',
    shadow: 'rgba(0, 0, 0, 0.1)',
    hover: 'rgba(76, 126, 243, 0.1)',
    active: 'rgba(76, 126, 243, 0.2)',
    focus: 'rgba(76, 126, 243, 0.3)',
  },
  
  // 神秘主题
  mystic: {
    primary: '#7E57C2',
    secondary: '#5E35B1',
    accent: '#FF5722',
    mystic: '#9575CD',
    success: '#26A69A',
    warning: '#FFA000',
    error: '#F44336',
    info: '#42A5F5',
    background: '#F5F0FF',
    surface: '#ffffff',
    textPrimary: '#1A1A3E',
    textSecondary: '#4C4977',
    textMuted: '#9E9EB3',
    border: '#E0D8F0',
    shadow: 'rgba(126, 87, 194, 0.1)',
    hover: 'rgba(126, 87, 194, 0.1)',
    active: 'rgba(126, 87, 194, 0.2)',
    focus: 'rgba(126, 87, 194, 0.3)',
  },
  
  // 宇宙主题
  cosmic: {
    primary: '#3F51B5',
    secondary: '#00BCD4',
    accent: '#FF5252',
    mystic: '#673AB7',
    success: '#00C853',
    warning: '#FFD600',
    error: '#FF1744',
    info: '#00B0FF',
    background: '#121212',
    surface: '#1E1E1E',
    textPrimary: '#FFFFFF',
    textSecondary: '#B0BEC5',
    textMuted: '#78909C',
    border: '#333333',
    shadow: 'rgba(0, 0, 0, 0.5)',
    hover: 'rgba(63, 81, 181, 0.2)',
    active: 'rgba(63, 81, 181, 0.3)',
    focus: 'rgba(63, 81, 181, 0.4)',
  },
  
  // 自然主题
  earthy: {
    primary: '#8D6E63',
    secondary: '#5D4037',
    accent: '#FF6E40',
    mystic: '#795548',
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
    info: '#4DD0E1',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    textPrimary: '#3E2723',
    textSecondary: '#5D4037',
    textMuted: '#A1887F',
    border: '#D7CCC8',
    shadow: 'rgba(0, 0, 0, 0.1)',
    hover: 'rgba(141, 110, 99, 0.1)',
    active: 'rgba(141, 110, 99, 0.2)',
    focus: 'rgba(141, 110, 99, 0.3)',
  },
};

// 定义主题存储
export const useThemeStore = defineStore('theme', {
  state: () => ({
    // 当前主题预设
    currentPreset: 'default' as ThemePreset,
    
    // 自定义主题变量
    customVariables: { ...themePresets.default },
    
    // 是否为暗色模式
    isDarkMode: false,
    
    // 使用系统主题
    useSystemTheme: false,
  }),
  
  getters: {
    // 获取当前主题变量
    currentThemeVariables(): ThemeVariables {
      if (this.currentPreset === 'custom') {
        return this.customVariables;
      }
      return themePresets[this.currentPreset];
    },
    
    // 获取CSS变量对象
    cssVariables(): Record<string, string> {
      const variables: Record<string, string> = {};
      const theme = this.currentThemeVariables;
      
      // 将主题变量转换为CSS变量
      Object.entries(theme).forEach(([key, value]) => {
        // 将驼峰命名转换为连字符命名
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        variables[`--${cssKey}`] = value as string;
      });
      
      return variables;
    },
  },
  
  actions: {
    // 设置主题预设
    setThemePreset(preset: ThemePreset) {
      this.currentPreset = preset;
      this.applyTheme();
    },
    
    // 设置暗色模式
    setDarkMode(isDark: boolean) {
      this.isDarkMode = isDark;
      this.applyTheme();
    },
    
    // 切换暗色模式
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      this.applyTheme();
    },
    
    // 设置是否使用系统主题
    setUseSystemTheme(useSystem: boolean) {
      this.useSystemTheme = useSystem;
      
      if (useSystem) {
        // 添加系统主题变化监听
        this.setupSystemThemeListener();
        
        // 立即应用系统主题
        this.applySystemTheme();
      } else {
        // 移除系统主题监听
        this.removeSystemThemeListener();
      }
    },
    
    // 更新自定义主题变量
    updateCustomVariables(variables: Partial<ThemeVariables>) {
      this.customVariables = {
        ...this.customVariables,
        ...variables,
      };
      
      // 如果当前使用的是自定义主题，立即应用
      if (this.currentPreset === 'custom') {
        this.applyTheme();
      }
    },
    
    // 应用当前主题到DOM
    applyTheme() {
      const root = document.documentElement;
      const variables = this.cssVariables;
      
      // 应用CSS变量
      Object.entries(variables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      
      // 切换暗色模式类
      if (this.isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    },
    
    // 监听系统主题变化
    setupSystemThemeListener() {
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // 定义回调函数
        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
          this.isDarkMode = e.matches;
          this.applyTheme();
        };
        
        // 添加监听
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleChange);
        } else {
          // 兼容旧版本
          mediaQuery.addListener(handleChange as any);
        }
        
        // 存储媒体查询和处理函数
        (this as any)._mediaQuery = mediaQuery;
        (this as any)._handleChange = handleChange;
      }
    },
    
    // 移除系统主题监听
    removeSystemThemeListener() {
      if ((this as any)._mediaQuery && (this as any)._handleChange) {
        const mediaQuery = (this as any)._mediaQuery;
        const handleChange = (this as any)._handleChange;
        
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange);
        } else {
          // 兼容旧版本
          mediaQuery.removeListener(handleChange as any);
        }
      }
    },
    
    // 应用系统主题
    applySystemTheme() {
      if (window.matchMedia) {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDarkMode = isDark;
        this.applyTheme();
      }
    },
  },
  
  // 持久化配置
  persist: {
    key: 'tianxuan-theme-settings',
    storage: localStorage,
  },
}); 