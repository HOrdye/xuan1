/**
 * 紫微斗数状态管理
 */

import { defineStore } from 'pinia';
import type { ZiweiChart, BirthInfo, Star, Daxian } from '../types';
import { ZiweiChartCalculator } from '../utils/chartCalculator';

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

        // TODO: 保存到Supabase
        // await this.saveChartToDatabase(chart);

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
    clearChart(): void {
      this.currentChart = null;
      this.error = null;
    }
  }
});

