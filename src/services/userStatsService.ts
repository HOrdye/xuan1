/**
 * 用户统计服务
 * 用于获取和计算用户的各种历史数据统计
 */

import { useUserStore } from '../store/userStore';
import type { HistoryItem } from './historyService';

export interface UserStats {
  divination_count: number; // 占卜次数
  fortune_count: number; // 运势查询次数
  tarot_count: number; // 塔罗牌占卜次数
  total_count: number; // 总记录数
  favorite_count: number; // 收藏数
  last_activity: string; // 最后活动时间
}

export class UserStatsService {
  /**
   * 获取用户统计数据
   */
  static async getUserStats(userId?: string): Promise<UserStats> {
    const userStore = useUserStore();
    const currentUserId = userId || userStore.currentUser?.id;
    
    if (!currentUserId) {
      return this.getEmptyStats();
    }

    try {
      // 从localStorage获取历史记录
      const history = JSON.parse(localStorage.getItem('tianxuan_history') || '[]');
      
      // 过滤当前用户的记录
      const userHistory = history.filter((record: any) => record.userId === currentUserId);
      
      // 统计各类型的数量
      const divinationCount = userHistory.filter((record: any) => 
        record.type === 'divination'
      ).length;
      
      const fortuneCount = userHistory.filter((record: any) => 
        record.type === 'fortune'
      ).length;
      
      const tarotCount = userHistory.filter((record: any) => 
        record.type === 'tarot'
      ).length;
      
      // 获取收藏数据
      const favorites = JSON.parse(localStorage.getItem('tianxuan_favorites') || '[]');
      const userFavorites = favorites.filter((fav: any) => fav.userId === currentUserId);
      
      // 获取最后活动时间
      const lastActivity = userHistory.length > 0 
        ? Math.max(...userHistory.map((record: any) => new Date(record.timestamp || record.created_at).getTime()))
        : new Date().getTime();

      return {
        divination_count: divinationCount,
        fortune_count: fortuneCount,
        tarot_count: tarotCount,
        total_count: userHistory.length,
        favorite_count: userFavorites.length,
        last_activity: new Date(lastActivity).toISOString()
      };
    } catch (error) {
      console.error('获取用户统计数据失败:', error);
      return this.getEmptyStats();
    }
  }

  /**
   * 添加用户活动记录
   */
  static async addUserActivity(activityData: {
    type: 'divination' | 'fortune' | 'tarot' | 'jiaoBei';
    title: string;
    data: any;
    result?: any;
  }): Promise<void> {
    const userStore = useUserStore();
    const currentUser = userStore.currentUser;
    
    if (!currentUser) {
      console.warn('用户未登录，无法保存活动记录');
      return;
    }

    try {
      // 创建活动记录，符合HistoryItem格式
      const activity: HistoryItem = {
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: activityData.type,
        title: activityData.title,
        date: new Date().toISOString(),
        question: activityData.data?.question || '',
        result: activityData.result || activityData.data
      };

      // 添加用户ID用于过滤（虽然不是HistoryItem接口的一部分，但用于本地存储）
      const activityWithUserId = {
        ...activity,
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      // 保存到localStorage
      const history = JSON.parse(localStorage.getItem('tianxuan_history') || '[]');
      history.unshift(activityWithUserId); // 添加到开头

      // 限制历史记录数量（最多保存1000条）
      if (history.length > 1000) {
        history.splice(1000);
      }

      localStorage.setItem('tianxuan_history', JSON.stringify(history));
      
      console.log('✅ 用户活动记录已保存:', activity.type, activity.title);
    } catch (error) {
      console.error('❌ 保存用户活动记录失败:', error);
    }
  }

  /**
   * 获取用户历史记录
   */
  static async getUserHistory(userId?: string, limit?: number): Promise<HistoryItem[]> {
    const userStore = useUserStore();
    const currentUserId = userId || userStore.currentUser?.id;
    
    if (!currentUserId) {
      return [];
    }

    try {
      const history = JSON.parse(localStorage.getItem('tianxuan_history') || '[]');
      let userHistory = history.filter((record: any) => record.userId === currentUserId);
      
      // 按时间倒序排列
      userHistory.sort((a: any, b: any) => 
        new Date(b.timestamp || b.created_at || b.date).getTime() - new Date(a.timestamp || a.created_at || a.date).getTime()
      );
      
      // 转换为HistoryItem格式
      const historyItems: HistoryItem[] = userHistory.map((record: any) => ({
        id: record.id,
        type: record.type,
        title: record.title,
        date: record.date || record.timestamp || record.created_at,
        question: record.question || record.data?.question || '',
        result: record.result || record.data
      }));
      
      // 如果指定了限制数量
      if (limit && limit > 0) {
        return historyItems.slice(0, limit);
      }
      
      return historyItems;
    } catch (error) {
      console.error('获取用户历史记录失败:', error);
      return [];
    }
  }

  /**
   * 删除用户历史记录
   */
  static async deleteUserActivity(activityId: string): Promise<boolean> {
    try {
      const history = JSON.parse(localStorage.getItem('tianxuan_history') || '[]');
      const filteredHistory = history.filter((record: any) => record.id !== activityId);
      
      if (filteredHistory.length !== history.length) {
        localStorage.setItem('tianxuan_history', JSON.stringify(filteredHistory));
        console.log('✅ 历史记录已删除:', activityId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ 删除历史记录失败:', error);
      return false;
    }
  }

  /**
   * 清空用户所有历史记录
   */
  static async clearUserHistory(userId?: string): Promise<boolean> {
    const userStore = useUserStore();
    const currentUserId = userId || userStore.currentUser?.id;
    
    if (!currentUserId) {
      return false;
    }

    try {
      const history = JSON.parse(localStorage.getItem('tianxuan_history') || '[]');
      const otherUsersHistory = history.filter((record: any) => record.userId !== currentUserId);
      
      localStorage.setItem('tianxuan_history', JSON.stringify(otherUsersHistory));
      console.log('✅ 用户历史记录已清空:', currentUserId);
      return true;
    } catch (error) {
      console.error('❌ 清空历史记录失败:', error);
      return false;
    }
  }

  /**
   * 添加到收藏
   */
  static async addToFavorites(item: any): Promise<boolean> {
    const userStore = useUserStore();
    const currentUser = userStore.currentUser;
    
    if (!currentUser) {
      return false;
    }

    try {
      const favorites = JSON.parse(localStorage.getItem('tianxuan_favorites') || '[]');
      
      const favorite = {
        id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: currentUser.id,
        item: item,
        created_at: new Date().toISOString()
      };
      
      favorites.unshift(favorite);
      localStorage.setItem('tianxuan_favorites', JSON.stringify(favorites));
      
      console.log('✅ 已添加到收藏:', item.title || item.name);
      return true;
    } catch (error) {
      console.error('❌ 添加收藏失败:', error);
      return false;
    }
  }

  /**
   * 从收藏中移除
   */
  static async removeFromFavorites(favoriteId: string): Promise<boolean> {
    try {
      const favorites = JSON.parse(localStorage.getItem('tianxuan_favorites') || '[]');
      const filteredFavorites = favorites.filter((fav: any) => fav.id !== favoriteId);
      
      if (filteredFavorites.length !== favorites.length) {
        localStorage.setItem('tianxuan_favorites', JSON.stringify(filteredFavorites));
        console.log('✅ 已从收藏中移除:', favoriteId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ 移除收藏失败:', error);
      return false;
    }
  }

  /**
   * 获取空的统计数据
   */
  private static getEmptyStats(): UserStats {
    return {
      divination_count: 0,
      fortune_count: 0,
      tarot_count: 0,
      total_count: 0,
      favorite_count: 0,
      last_activity: new Date().toISOString()
    };
  }
} 