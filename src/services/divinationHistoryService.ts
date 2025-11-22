/**
 * 占卜历史记录服务 - Supabase集成
 * 用于将占卜/决策历史保存到Supabase数据库
 */

import { SupabaseManager } from '../core/services/supabaseClient';
import type { AuthUser } from '../core/types/user';

export interface DivinationHistoryItem {
  id?: string;
  user_id: string;
  type: 'yijing' | 'dilemma' | 'tarot' | 'jiaobei';
  question?: string;
  result: any; // JSON格式的结果数据
  created_at?: string;
}

class DivinationHistoryService {
  /**
   * 保存历史记录到Supabase
   * @param item 历史记录项（不需要id和created_at，会自动生成）
   */
  static async saveToSupabase(
    item: Omit<DivinationHistoryItem, 'id' | 'created_at' | 'user_id'>
  ): Promise<DivinationHistoryItem | null> {
    try {
      // 检查Supabase客户端是否可用
      let client;
      try {
        client = SupabaseManager.getClient();
      } catch (err) {
        console.warn('⚠️ Supabase客户端不可用，跳过保存到Supabase');
        return null;
      }

      // 获取当前用户
      const { data: { user }, error: userError } = await client.auth.getUser();
      
      if (userError || !user) {
        console.warn('⚠️ 用户未登录，跳过保存到Supabase');
        return null;
      }

      // 准备数据
      const historyData: Omit<DivinationHistoryItem, 'id' | 'created_at'> = {
        user_id: user.id,
        type: item.type,
        question: item.question || null,
        result: item.result
      };

      // 插入到Supabase
      const { data, error } = await client
        .from('divination_history')
        .insert([historyData])
        .select()
        .single();

      if (error) {
        console.error('❌ 保存历史记录到Supabase失败:', error);
        // 不抛出错误，允许降级到localStorage
        return null;
      }

      console.log('✅ 历史记录已保存到Supabase:', data.id);
      return data as DivinationHistoryItem;
    } catch (error: any) {
      console.error('❌ 保存历史记录到Supabase异常:', error);
      // 静默失败，允许降级到localStorage
      return null;
    }
  }

  /**
   * 从Supabase获取用户的历史记录
   * @param limit 限制返回的记录数
   */
  static async getFromSupabase(limit: number = 50): Promise<DivinationHistoryItem[]> {
    try {
      const client = SupabaseManager.getClient();

      // 获取当前用户
      const { data: { user }, error: userError } = await client.auth.getUser();
      
      if (userError || !user) {
        console.warn('⚠️ 用户未登录，无法从Supabase获取历史记录');
        return [];
      }

      // 查询用户的历史记录
      const { data, error } = await client
        .from('divination_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ 从Supabase获取历史记录失败:', error);
        return [];
      }

      console.log(`✅ 从Supabase获取了 ${data.length} 条历史记录`);
      return data as DivinationHistoryItem[];
    } catch (error: any) {
      console.error('❌ 从Supabase获取历史记录异常:', error);
      return [];
    }
  }

  /**
   * 删除Supabase中的历史记录
   * @param id 记录ID
   */
  static async deleteFromSupabase(id: string): Promise<boolean> {
    try {
      const client = SupabaseManager.getClient();

      // 获取当前用户
      const { data: { user }, error: userError } = await client.auth.getUser();
      
      if (userError || !user) {
        console.warn('⚠️ 用户未登录，无法删除Supabase历史记录');
        return false;
      }

      // 删除记录（RLS策略会确保用户只能删除自己的记录）
      const { error } = await client
        .from('divination_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // 双重保险

      if (error) {
        console.error('❌ 删除Supabase历史记录失败:', error);
        return false;
      }

      console.log('✅ 历史记录已从Supabase删除:', id);
      return true;
    } catch (error: any) {
      console.error('❌ 删除Supabase历史记录异常:', error);
      return false;
    }
  }

  /**
   * 将历史记录类型从本地格式转换为Supabase格式
   * @param localType 本地类型
   */
  static convertTypeToSupabase(localType: 'fortune' | 'jiaoBei' | 'divination' | 'tarot'): 'yijing' | 'dilemma' | 'tarot' | 'jiaobei' {
    const typeMap: Record<string, 'yijing' | 'dilemma' | 'tarot' | 'jiaobei'> = {
      'fortune': 'yijing',      // 今日运势/易经占卜
      'divination': 'yijing',    // 易经占卜
      'jiaoBei': 'jiaobei',     // 筊杯占卜
      'tarot': 'tarot'          // 塔罗牌
    };

    return typeMap[localType] || 'yijing';
  }

  /**
   * 将Supabase类型转换为本地格式
   */
  static convertTypeFromSupabase(supabaseType: 'yijing' | 'dilemma' | 'tarot' | 'jiaobei'): 'fortune' | 'jiaoBei' | 'divination' | 'tarot' {
    const typeMap: Record<string, 'fortune' | 'jiaoBei' | 'divination' | 'tarot'> = {
      'yijing': 'divination',
      'dilemma': 'divination',
      'tarot': 'tarot',
      'jiaobei': 'jiaoBei'
    };

    return typeMap[supabaseType] || 'divination';
  }
}

export default DivinationHistoryService;














