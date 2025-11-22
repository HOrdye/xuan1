/**
 * 命盘存储服务
 * 负责将命盘数据保存到用户信息和从用户信息加载命盘数据
 */

import { SupabaseManager } from '../../../core/services/supabaseClient';
import { useUserStore } from '../../../store/userStore';
import type { ZiweiChart, BirthInfo } from '../types';

/**
 * 命盘存储服务类
 */
export class ChartStorageService {
  /**
   * 保存命盘数据到用户信息
   * @param chart 命盘数据
   * @returns 是否保存成功
   */
  static async saveChartToUser(chart: ZiweiChart): Promise<boolean> {
    try {
      const userStore = useUserStore();
      
      // 检查用户是否登录
      if (!userStore.isAuthenticated || !userStore.currentUser) {
        console.log('📝 用户未登录，保存到 localStorage');
        return this.saveChartToLocalStorage(chart);
      }

      // 准备保存的数据（只保存必要的生辰信息，不保存完整的命盘对象）
      const chartData = {
        birthInfo: chart.birthInfo,
        createdAt: chart.createdAt ? chart.createdAt.toISOString() : new Date().toISOString(),
        id: chart.id
      };

      // 尝试保存到 Supabase
      try {
        const client = SupabaseManager.getClient();
        
        // 获取当前用户的 profile
        const { data: profile, error: fetchError } = await client
          .from('profiles')
          .select('preferences')
          .eq('id', userStore.currentUser.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 表示未找到记录
          throw fetchError;
        }

        // 更新 preferences，添加命盘数据
        const preferences = profile?.preferences || {};
        const updatedPreferences = {
          ...preferences,
          ziweiChart: chartData
        };

        const { error: updateError } = await client
          .from('profiles')
          .upsert({
            id: userStore.currentUser.id,
            preferences: updatedPreferences,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });

        if (updateError) {
          throw updateError;
        }

        console.log('✅ 命盘数据已保存到用户信息');
        
        // 同时保存到 localStorage 作为备份
        this.saveChartToLocalStorage(chart);
        
        return true;
      } catch (supabaseError: any) {
        console.warn('⚠️ 保存到 Supabase 失败，降级到 localStorage:', supabaseError);
        return this.saveChartToLocalStorage(chart);
      }
    } catch (error: any) {
      console.error('❌ 保存命盘数据失败:', error);
      // 降级到 localStorage
      return this.saveChartToLocalStorage(chart);
    }
  }

  /**
   * 从用户信息加载命盘数据
   * @returns 命盘数据或 null
   */
  static async loadChartFromUser(): Promise<ZiweiChart | null> {
    try {
      const userStore = useUserStore();
      
      // 检查用户是否登录
      if (!userStore.isAuthenticated || !userStore.currentUser) {
        console.log('📝 用户未登录，从 localStorage 加载');
        return this.loadChartFromLocalStorage();
      }

      // 尝试从 Supabase 加载
      try {
        const client = SupabaseManager.getClient();
        
        const { data: profile, error } = await client
          .from('profiles')
          .select('preferences')
          .eq('id', userStore.currentUser.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // 未找到记录，尝试从 localStorage 加载
            return this.loadChartFromLocalStorage();
          }
          throw error;
        }

        const preferences = profile?.preferences || {};
        const chartData = preferences.ziweiChart;

        if (!chartData || !chartData.birthInfo) {
          // 用户信息中没有命盘数据，尝试从 localStorage 加载
          return this.loadChartFromLocalStorage();
        }

        // 从生辰信息重新生成命盘（因为命盘数据可能很大，我们只保存生辰信息）
        const { ZiweiChartCalculator } = await import('../utils/chartCalculator');
        const calculator = new ZiweiChartCalculator();
        const chart = calculator.calculate(chartData.birthInfo);
        
        // 恢复创建时间
        if (chartData.createdAt) {
          chart.createdAt = new Date(chartData.createdAt);
        }
        
        // 恢复 ID
        if (chartData.id) {
          chart.id = chartData.id;
        }

        console.log('✅ 从用户信息加载命盘数据成功');
        
        // 同时保存到 localStorage 作为缓存
        this.saveChartToLocalStorage(chart);
        
        return chart;
      } catch (supabaseError: any) {
        console.warn('⚠️ 从 Supabase 加载失败，降级到 localStorage:', supabaseError);
        return this.loadChartFromLocalStorage();
      }
    } catch (error: any) {
      console.error('❌ 加载命盘数据失败:', error);
      return this.loadChartFromLocalStorage();
    }
  }

  /**
   * 保存命盘到 localStorage
   */
  private static saveChartToLocalStorage(chart: ZiweiChart): boolean {
    try {
      localStorage.setItem('ziwei_current_chart', JSON.stringify(chart));
      console.log('✅ 命盘数据已保存到 localStorage');
      return true;
    } catch (error) {
      console.error('❌ 保存到 localStorage 失败:', error);
      return false;
    }
  }

  /**
   * 从 localStorage 加载命盘
   */
  private static loadChartFromLocalStorage(): ZiweiChart | null {
    try {
      const savedChartStr = localStorage.getItem('ziwei_current_chart');
      if (!savedChartStr) {
        return null;
      }

      const savedChart = JSON.parse(savedChartStr) as ZiweiChart;
      
      // 恢复日期对象
      if (savedChart.createdAt) {
        savedChart.createdAt = new Date(savedChart.createdAt);
      }

      console.log('✅ 从 localStorage 加载命盘数据成功');
      return savedChart;
    } catch (error) {
      console.error('❌ 从 localStorage 加载失败:', error);
      return null;
    }
  }

  /**
   * 清除用户信息中的命盘数据
   */
  static async clearChartFromUser(): Promise<boolean> {
    try {
      const userStore = useUserStore();
      
      // 清除 localStorage
      localStorage.removeItem('ziwei_current_chart');

      // 如果用户已登录，也清除 Supabase 中的数据
      if (userStore.isAuthenticated && userStore.currentUser) {
        try {
          const client = SupabaseManager.getClient();
          
          const { data: profile } = await client
            .from('profiles')
            .select('preferences')
            .eq('id', userStore.currentUser.id)
            .single();

          if (profile) {
            const preferences = profile.preferences || {};
            delete preferences.ziweiChart;

            await client
              .from('profiles')
              .update({
                preferences,
                updated_at: new Date().toISOString()
              })
              .eq('id', userStore.currentUser.id);

            console.log('✅ 已清除用户信息中的命盘数据');
          }
        } catch (supabaseError: any) {
          console.warn('⚠️ 清除 Supabase 数据失败:', supabaseError);
        }
      }

      return true;
    } catch (error: any) {
      console.error('❌ 清除命盘数据失败:', error);
      return false;
    }
  }
}



