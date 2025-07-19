/**
 * 用户认证服务
 * 管理用户登录、注册、会话状态等
 */

import { SupabaseManager } from './supabaseClient';
import type { 
  AuthCredentials, 
  RegisterData, 
  // AuthResponse, // 暂未使用 
  AuthUser, 
  UserOperationResult 
} from '../types/user';

class AuthService {
  /**
   * 用户登录
   */
  static async signIn(credentials: AuthCredentials): Promise<UserOperationResult> {
    try {
      try {
        // 尝试初始化并获取Supabase客户端
        const client = await SupabaseManager.initialize();
        
        const { data, error } = await client.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        });

        if (error) {
          console.error('❌ Supabase登录失败:', error.message);
          throw new Error(`Supabase登录失败: ${error.message}`);
        }

        console.log('✅ Supabase用户登录成功:', data.user?.email);
        return {
          success: true,
          data: data.user,
          message: '登录成功，欢迎回来！'
        };
      } catch (supabaseError: any) {
        console.warn('⚠️ Supabase登录失败，使用本地登录模式:', supabaseError.message);
        
        // 如果Supabase不可用，使用本地存储验证登录
        return await this.localSignIn(credentials);
      }
    } catch (error: any) {
      console.error('❌ 登录异常:', error);
      return {
        success: false,
        error: error.message,
        message: '登录时发生错误，请稍后重试'
      };
    }
  }

  /**
   * 本地存储模拟登录（当Supabase不可用时使用）
   */
  private static async localSignIn(credentials: AuthCredentials): Promise<UserOperationResult> {
    try {
      console.log('🔄 开始本地登录流程:', credentials.email);
      
      // 简单的密码解码函数（仅用于演示）
      const decodePassword = (encodedPassword: string): string => {
        try {
          return atob(encodedPassword);
        } catch (e) {
          // 如果atob不可用，使用简单的字符串转换
          return encodedPassword.split('-').map(code => String.fromCharCode(parseInt(code))).join('');
        }
      };

      // 从本地存储中查找用户
      const existingUsers = JSON.parse(localStorage.getItem('tianxuan_local_users') || '[]');
      console.log('📋 检查用户数据库，用户数量:', existingUsers.length);
      
      const user = existingUsers.find((u: any) => {
        const isEmailMatch = u.email === credentials.email;
        const isPasswordMatch = decodePassword(u.password_hash) === credentials.password;
        console.log(`🔍 检查用户 ${u.email}: 邮箱匹配=${isEmailMatch}, 密码匹配=${isPasswordMatch}`);
        return isEmailMatch && isPasswordMatch;
      });

      if (!user) {
        console.log('❌ 登录失败: 用户不存在或密码错误');
        return {
          success: false,
          error: 'invalid_credentials',
          message: '邮箱或密码错误'
        };
      }

      // 保存当前登录用户到会话存储
      const userSession = {
        ...user,
        password_hash: undefined // 移除密码哈希
      };
      localStorage.setItem('tianxuan_current_user', JSON.stringify(userSession));

      console.log('✅ 本地用户登录成功:', user.email);

      return {
        success: true,
        data: userSession as any,
        message: '登录成功，欢迎回来！（注意：当前使用本地存储模式）'
      };
    } catch (error: any) {
      console.error('❌ 本地登录失败:', error);
      return {
        success: false,
        error: error.message,
        message: '登录失败，请稍后重试'
      };
    }
  }

  /**
   * 用户注册
   */
  static async signUp(registerData: RegisterData): Promise<UserOperationResult> {
    try {
      // 密码确认检查
      if (registerData.password !== registerData.confirm_password) {
        return {
          success: false,
          error: 'password_mismatch',
          message: '两次输入的密码不一致'
        };
      }

      try {
        // 尝试初始化并获取Supabase客户端
        const client = await SupabaseManager.initialize();
        
        const { data, error } = await client.auth.signUp({
          email: registerData.email,
          password: registerData.password,
          options: {
            data: {
              username: registerData.username || registerData.email.split('@')[0]
            }
          }
        });

        if (error) {
          console.error('❌ Supabase注册失败:', error.message);
          throw new Error(`Supabase注册失败: ${error.message}`);
        }

        console.log('✅ Supabase用户注册成功:', data.user?.email);
        
        // 如果需要邮箱验证
        if (data.user && !data.session) {
          return {
            success: true,
            data: data.user,
            message: '注册成功！请检查您的邮箱并点击验证链接。'
          };
        }

        return {
          success: true,
          data: data.user,
          message: '注册成功，欢迎加入天玄Web！'
        };
      } catch (supabaseError: any) {
        console.warn('⚠️ Supabase注册失败，使用本地注册模式:', supabaseError.message);
        
        // 如果Supabase不可用，使用本地存储模拟注册
        return await this.localSignUp(registerData);
      }
    } catch (error: any) {
      console.error('❌ 注册异常:', error);
      return {
        success: false,
        error: error.message,
        message: '注册时发生错误，请稍后重试'
      };
    }
  }

  /**
   * 本地存储模拟注册（当Supabase不可用时使用）
   */
  private static async localSignUp(registerData: RegisterData): Promise<UserOperationResult> {
    try {
      console.log('🔄 开始本地注册流程:', registerData.email);
      console.log('📝 注册数据:', { email: registerData.email, username: registerData.username });
      
      // 检查本地存储中是否已存在该邮箱
      const existingUsers = JSON.parse(localStorage.getItem('tianxuan_local_users') || '[]');
      console.log('📋 现有用户数量:', existingUsers.length);
      
      const userExists = existingUsers.some((user: any) => user.email === registerData.email);
      
      if (userExists) {
        console.log('❌ 用户已存在:', registerData.email);
        return {
          success: false,
          error: 'user_exists',
          message: '该邮箱已被注册'
        };
      }

      // 简单的密码编码函数（仅用于演示）
      const encodePassword = (password: string): string => {
        try {
          return btoa(password);
        } catch (e) {
          // 如果btoa不可用，使用简单的字符串转换
          return password.split('').map(c => c.charCodeAt(0)).join('-');
        }
      };

      // 生成唯一用户ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 创建新用户对象
      const newUser = {
        id: userId,
        email: registerData.email,
        username: registerData.username || registerData.email.split('@')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_metadata: {
          username: registerData.username || registerData.email.split('@')[0],
          avatar_url: '', // 默认头像为空，稍后设置默认头像
          bio: '', // 个人简介/签名
          location: '', // 位置信息
          birthday: '', // 生日信息
          gender: '', // 性别
          phone: '', // 电话号码
          website: '', // 个人网站
          preferences: {
            theme: 'default', // 主题设置
            language: 'zh-CN', // 语言偏好
            notifications: true // 通知设置
          }
        },
        // 注意：在实际项目中绝不应该明文存储密码，这里仅为演示目的
        password_hash: encodePassword(registerData.password)
      };

      // 保存到本地存储
      existingUsers.push(newUser);
      localStorage.setItem('tianxuan_local_users', JSON.stringify(existingUsers));

      console.log('✅ 本地用户注册成功:', newUser.email);
      console.log('💾 已保存用户数据到localStorage');

      return {
        success: true,
        data: newUser as any,
        message: '注册成功！您现在可以使用账户登录。（注意：当前使用本地存储模式）'
      };
    } catch (error: any) {
      console.error('❌ 本地注册失败:', error);
      return {
        success: false,
        error: error.message,
        message: '注册失败，请稍后重试'
      };
    }
  }

  /**
   * 用户登出
   */
  static async signOut(): Promise<UserOperationResult> {
    try {
      try {
        // 尝试初始化并获取Supabase客户端
        const client = await SupabaseManager.initialize();
        
        const { error } = await client.auth.signOut();

        if (error) {
          console.error('❌ Supabase登出失败:', error.message);
          throw new Error(`Supabase登出失败: ${error.message}`);
        }

        console.log('✅ Supabase用户已登出');
      } catch (supabaseError: any) {
        console.warn('⚠️ Supabase登出失败，使用本地模式登出:', supabaseError.message);
      }

      // 无论Supabase是否可用，都清除本地存储的用户数据
      localStorage.removeItem('tianxuan_current_user');
      console.log('✅ 本地用户数据已清除');

      return {
        success: true,
        message: '已安全登出'
      };
    } catch (error: any) {
      console.error('❌ 登出异常:', error);
      
      // 即使出错也要尝试清除本地数据
      localStorage.removeItem('tianxuan_current_user');
      
      return {
        success: false,
        error: error.message,
        message: '登出时发生错误'
      };
    }
  }

  /**
   * 获取当前用户
   */
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      try {
        // 尝试初始化并获取Supabase客户端
        const client = await SupabaseManager.initialize();
        
        const { data: { user }, error } = await client.auth.getUser();

        if (error) {
          console.error('❌ Supabase获取用户信息失败:', error.message);
          throw new Error(`Supabase获取用户失败: ${error.message}`);
        }

        return user as AuthUser;
      } catch (supabaseError: any) {
        console.warn('⚠️ Supabase获取用户失败，使用本地模式:', supabaseError.message);
        
        // 如果Supabase不可用，从本地存储获取当前用户
        const currentUser = localStorage.getItem('tianxuan_current_user');
        if (currentUser) {
          return JSON.parse(currentUser) as AuthUser;
        }
        
        return null;
      }
    } catch (error) {
      console.error('❌ 获取用户信息异常:', error);
      return null;
    }
  }

  /**
   * 获取当前会话
   */
  static async getCurrentSession() {
    try {
      const client = SupabaseManager.getClient();
      
      const { data: { session }, error } = await client.auth.getSession();

      if (error) {
        console.error('❌ 获取会话失败:', error.message);
        return null;
      }

      return session;
    } catch (error) {
      console.error('❌ 获取会话异常:', error);
      return null;
    }
  }

  /**
   * 重置密码
   */
  static async resetPassword(email: string): Promise<UserOperationResult> {
    try {
      const client = SupabaseManager.getClient();
      
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('❌ 密码重置失败:', error.message);
        return {
          success: false,
          error: error.message,
          message: this.getAuthErrorMessage(error.message)
        };
      }

      return {
        success: true,
        message: '密码重置邮件已发送，请检查您的邮箱'
      };
    } catch (error: any) {
      console.error('❌ 密码重置异常:', error);
      return {
        success: false,
        error: error.message,
        message: '发送重置邮件时发生错误'
      };
    }
  }

  /**
   * 监听认证状态变化
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    try {
      const client = SupabaseManager.getClient();
      
      const { data: { subscription } } = client.auth.onAuthStateChange(callback);
      
      return subscription;
    } catch (error) {
      console.error('❌ 监听认证状态异常:', error);
      return null;
    }
  }

  /**
   * 转换错误消息为用户友好的提示
   */
  private static getAuthErrorMessage(errorMessage: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': '邮箱或密码错误',
      'User already registered': '该邮箱已被注册',
      'Password should be at least 6 characters': '密码至少需要6个字符',
      'Invalid email': '邮箱格式不正确',
      'Email not confirmed': '请先验证您的邮箱',
      'Too many requests': '请求过于频繁，请稍后再试',
      'Network error': '网络连接错误，请检查网络设置',
      'user_exists': '该邮箱已被注册',
      'invalid_credentials': '邮箱或密码错误',
      'password_mismatch': '两次输入的密码不一致'
    };

    return errorMap[errorMessage] || '操作失败，请稍后重试';
  }

  /**
   * 验证邮箱格式
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 验证密码强度
   */
  static validatePassword(password: string): { isValid: boolean; message: string } {
    if (password.length < 6) {
      return { isValid: false, message: '密码至少需要6个字符' };
    }
    
    if (password.length > 128) {
      return { isValid: false, message: '密码不能超过128个字符' };
    }

    // 可以根据需要添加更多密码强度规则
    return { isValid: true, message: '密码格式正确' };
  }
}

export default AuthService; 