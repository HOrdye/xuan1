/**
 * 紫微斗数状态管理
 */

import { defineStore } from 'pinia';
import type { ZiweiChart, BirthInfo, Star, Daxian } from '../types';
import { ZiweiChartCalculator } from '../utils/chartCalculator';
import { ChartStorageService } from '../services/chartStorageService';

interface ZiweiState {
  currentChart: ZiweiChart | null;
  savedCharts: ZiweiChart[];
  readingHistory: any[];
  collectedStars: string[];
  isLoading: boolean;
  error: string | null;
}

export const useZiweiStore = defineStore('ziwei', {
  state: (): ZiweiState => ({
    currentChart: null,
    savedCharts: [],
    readingHistory: [],
    collectedStars: [],
    isLoading: false,
    error: null
  }),

  getters: {
    /**
     * 获取当前命宫主星
     */
    mainStar(state): Star | null {
      if (!state.currentChart) return null;
      return state.currentChart.mingGong.stars.find(s => s.category === '主星') || null;
    },

    /**
     * 获取当前大限
     */
    currentDaxian(state): Daxian | null {
      if (!state.currentChart) return null;
      const currentAge = new Date().getFullYear() - state.currentChart.birthInfo.year;
      return state.currentChart.daxian.find(d => 
        currentAge >= d.startAge && currentAge <= d.endAge
      ) || null;
    },

    /**
     * 检查是否已收集指定星曜
     */
    hasCollectedStar: (state) => (starName: string) => {
      return state.collectedStars.includes(starName);
    }
  },

  actions: {
    /**
     * 生成命盘
     */
    async generateChart(birthInfo: BirthInfo): Promise<ZiweiChart> {
      this.isLoading = true;
      this.error = null;

      try {
        // 验证输入数据
        if (!birthInfo.year || !birthInfo.month || !birthInfo.day) {
          throw new Error('请填写完整的出生日期（年、月、日）');
        }
        
        if (birthInfo.hour === undefined || birthInfo.hour === null) {
          throw new Error('请选择出生时辰');
        }
        
        if (!birthInfo.gender) {
          throw new Error('请选择性别');
        }
        
        console.log('🔄 开始生成命盘，输入数据:', birthInfo);
        
        const calculator = new ZiweiChartCalculator();
        const chart = calculator.calculate(birthInfo);
        
        this.currentChart = chart;
        
        // 收集主星
        chart.palaces.forEach(palace => {
          palace.stars.forEach(star => {
            if (star.category === '主星' && !this.collectedStars.includes(star.name)) {
              this.collectedStars.push(star.name);
            }
          });
        });

        // 自动保存到用户信息和 localStorage
        try {
          await ChartStorageService.saveChartToUser(chart);
        } catch (saveError) {
          console.warn('⚠️ 保存命盘数据失败（不影响使用）:', saveError);
        }

        console.log('✅ Store: 命盘生成成功');
        return chart;
      } catch (error: any) {
        console.error('❌ Store: 命盘生成失败', error);
        
        // 确保错误是Error对象
        let errorObj: Error;
        if (error instanceof Error) {
          errorObj = error;
        } else if (typeof error === 'string') {
          errorObj = new Error(error);
        } else {
          errorObj = new Error(error?.message || '排盘失败');
        }
        
        this.error = errorObj.message;
        throw errorObj;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * 保存命盘
     */
    async saveChart(chart: ZiweiChart): Promise<void> {
      // TODO: 保存到Supabase
      this.savedCharts.push(chart);
    },

    /**
     * 加载已保存的命盘
     */
    async loadChart(chartId: string): Promise<void> {
      // TODO: 从Supabase加载
      const chart = this.savedCharts.find(c => c.birthInfo.year.toString() === chartId);
      if (chart) {
        this.currentChart = chart;
      }
    },

      /**
       * 清除当前命盘
       */
      async clearChart(): Promise<void> {
        this.currentChart = null;
        this.error = null;
        // 清除用户信息和 localStorage 中的命盘
        try {
          await ChartStorageService.clearChartFromUser();
        } catch (error) {
          console.warn('清除命盘数据失败:', error);
        }
      },

      /**
       * 从用户信息加载命盘
       */
      async loadChartFromUser(): Promise<ZiweiChart | null> {
        try {
          const chart = await ChartStorageService.loadChartFromUser();
          if (chart) {
            this.currentChart = chart;
            console.log('✅ Store: 从用户信息加载命盘成功');
          }
          return chart;
        } catch (error: any) {
          console.error('❌ Store: 从用户信息加载命盘失败', error);
          return null;
        }
      },

    /**
     * 添加收藏星曜
     */
    addCollectedStar(starName: string): void {
      if (!this.collectedStars.includes(starName)) {
        this.collectedStars.push(starName);
        // TODO: 保存到Supabase
      }
    },

    /**
     * 移除收藏星曜
     */
    removeCollectedStar(starName: string): void {
      const index = this.collectedStars.indexOf(starName);
      if (index > -1) {
        this.collectedStars.splice(index, 1);
        // TODO: 从Supabase删除
      }
    }
  }
});

