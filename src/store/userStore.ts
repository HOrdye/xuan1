/**
 * 用户状态管理
 * 管理用户认证状态、个人信息和会话状态
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import AuthService from '../core/services/authService';
import { SupabaseManager } from '../core/services/supabaseClient';
import type { 
  AuthUser, 
  UserProfile, 
  UserMetadata, 
  UserStats, 
  CompleteUserInfo,
  UserOperationResult 
} from '../core/types/user';

export const useUserStore = defineStore('user', () => {
  // 响应式状态
  const currentUser = ref<AuthUser | null>(null);
  const userProfile = ref<UserProfile | null>(null);
  const userMetadata = ref<UserMetadata | null>(null);
  const userStats = ref<UserStats | null>(null);
  const isLoading = ref(false);
  const isInitialized = ref(false);
  const error = ref<string | null>(null);

  // 计算属性
  const isAuthenticated = computed(() => !!currentUser.value);
  const username = computed(() => 
    userProfile.value?.username || 
    currentUser.value?.user_metadata?.username || 
    currentUser.value?.email?.split('@')[0] || 
    '未知用户'
  );
  const email = computed(() => currentUser.value?.email || '');
  const avatarUrl = computed(() => 
    userProfile.value?.avatar_url || 
    currentUser.value?.user_metadata?.avatar_url || 
    ''
  );

  // 完整用户信息
  const completeUserInfo = computed<CompleteUserInfo>(() => ({
    profile: userProfile.value || {
      id: currentUser.value?.id || '',
      email: email.value,
      username: username.value,
      avatar_url: avatarUrl.value,
      created_at: currentUser.value?.created_at || '',
      updated_at: currentUser.value?.updated_at || ''
    },
    metadata: userMetadata.value || undefined,
    stats: userStats.value || undefined,
    isAuthenticated: isAuthenticated.value
  }));

  /**
   * 初始化用户状态
   */
  const initialize = async (): Promise<void> => {
    if (isInitialized.value) return;
    
    try {
      isLoading.value = true;
      error.value = null;

      // 检查Supabase是否可用
      try {
        // 获取当前用户
        const user = await AuthService.getCurrentUser();
        if (user) {
          currentUser.value = user;
          await loadUserData(user.id);
        }

        // 监听认证状态变化
        AuthService.onAuthStateChange(async (event, session) => {
          console.log('🔄 认证状态变化:', event);
          
          if (event === 'SIGNED_IN' && session?.user) {
            currentUser.value = session.user as AuthUser;
            await loadUserData(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            await clearUserData();
          }
        });
      } catch (supabaseError) {
        console.warn('⚠️ Supabase不可用，用户系统将以本地模式运行:', supabaseError);
        // 在本地模式下，用户始终处于未登录状态
        currentUser.value = null;
      }

      isInitialized.value = true;
    } catch (err: any) {
      console.error('❌ 用户状态初始化失败:', err);
      error.value = '初始化用户状态失败';
      // 确保在错误情况下用户状态为未登录
      currentUser.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 用户登录
   */
  const signIn = async (email: string, password: string): Promise<UserOperationResult> => {
    try {
      isLoading.value = true;
      error.value = null;

      const result = await AuthService.signIn({ email, password });
      
      if (result.success && result.data) {
        currentUser.value = result.data;
        await loadUserData(result.data.id);
      } else {
        error.value = result.error || '登录失败';
      }

      return result;
    } catch (err: any) {
      console.error('❌ 登录异常:', err);
      error.value = err.message;
      return {
        success: false,
        error: err.message,
        message: '登录时发生错误'
      };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 用户注册
   */
  const signUp = async (email: string, password: string, confirmPassword: string, username?: string): Promise<UserOperationResult> => {
    try {
      isLoading.value = true;
      error.value = null;

      const result = await AuthService.signUp({
        email,
        password,
        confirm_password: confirmPassword,
        username
      });

      if (result.success && result.data) {
        currentUser.value = result.data;
        // 注册后可能需要邮箱验证，所以不立即加载用户数据
      } else {
        error.value = result.error || '注册失败';
      }

      return result;
    } catch (err: any) {
      console.error('❌ 注册异常:', err);
      error.value = err.message;
      return {
        success: false,
        error: err.message,
        message: '注册时发生错误'
      };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 用户登出
   */
  const signOut = async (): Promise<UserOperationResult> => {
    try {
      isLoading.value = true;
      error.value = null;

      const result = await AuthService.signOut();
      
      if (result.success) {
        await clearUserData();
      } else {
        error.value = result.error || '登出失败';
      }

      return result;
    } catch (err: any) {
      console.error('❌ 登出异常:', err);
      error.value = err.message;
      return {
        success: false,
        error: err.message,
        message: '登出时发生错误'
      };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 加载用户数据
   */
  const loadUserData = async (userId: string): Promise<void> => {
    try {
      const client = SupabaseManager.getClient();
      
      // 并行加载用户数据
      const [profileResult, metadataResult, statsResult] = await Promise.allSettled([
        client.from('user_profiles').select('*').eq('id', userId).single(),
        client.from('user_metadata').select('*').eq('user_id', userId).single(),
        client.from('user_stats').select('*').eq('user_id', userId).single()
      ]);

      // 处理用户档案
      if (profileResult.status === 'fulfilled' && profileResult.value.data) {
        userProfile.value = profileResult.value.data;
      }

      // 处理用户元数据
      if (metadataResult.status === 'fulfilled' && metadataResult.value.data) {
        userMetadata.value = metadataResult.value.data;
      }

      // 处理用户统计
      if (statsResult.status === 'fulfilled' && statsResult.value.data) {
        userStats.value = statsResult.value.data;
      }

      console.log('✅ 用户数据加载完成');
    } catch (err) {
      console.error('❌ 加载用户数据失败:', err);
      // 不设置error，因为这不是致命错误
    }
  };

  /**
   * 清空用户数据
   */
  const clearUserData = async (): Promise<void> => {
    currentUser.value = null;
    userProfile.value = null;
    userMetadata.value = null;
    userStats.value = null;
    error.value = null;
    console.log('🧹 用户数据已清空');
  };

  /**
   * 更新用户档案
   */
  const updateProfile = async (data: Partial<UserProfile>): Promise<UserOperationResult> => {
    try {
      if (!currentUser.value) {
        return {
          success: false,
          error: 'not_authenticated',
          message: '请先登录'
        };
      }

      isLoading.value = true;
      const client = SupabaseManager.getClient();

      const { data: updatedProfile, error } = await client
        .from('user_profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', currentUser.value.id)
        .select()
        .single();

      if (error) {
        console.error('❌ 更新用户档案失败:', error);
        return {
          success: false,
          error: error.message,
          message: '更新用户信息失败'
        };
      }

      userProfile.value = updatedProfile;
      return {
        success: true,
        data: updatedProfile,
        message: '用户信息已更新'
      };
    } catch (err: any) {
      console.error('❌ 更新用户档案异常:', err);
      return {
        success: false,
        error: err.message,
        message: '更新时发生错误'
      };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 重置所有状态
   */
  const reset = (): void => {
    currentUser.value = null;
    userProfile.value = null;
    userMetadata.value = null;
    userStats.value = null;
    isLoading.value = false;
    isInitialized.value = false;
    error.value = null;
  };

  return {
    // 状态
    currentUser,
    userProfile,
    userMetadata,
    userStats,
    isLoading,
    isInitialized,
    error,
    
    // 计算属性
    isAuthenticated,
    username,
    email,
    avatarUrl,
    completeUserInfo,
    
    // 方法
    initialize,
    signIn,
    signUp,
    signOut,
    loadUserData,
    clearUserData,
    updateProfile,
    reset
  };
}); 