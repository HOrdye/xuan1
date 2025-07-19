/**
 * 用户相关类型定义
 */

// 用户基础信息
export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// 用户扩展信息（用于生辰八字等玄学计算）
export interface UserMetadata {
  id: string;
  user_id: string;
  // 基础生辰信息
  birth_date?: string;           // 出生日期 YYYY-MM-DD
  birth_time?: string;           // 出生时间 HH:mm
  birth_location?: string;       // 出生地点
  timezone?: string;             // 时区
  
  // 自动计算的信息
  zodiac_sign?: string;          // 星座
  chinese_zodiac?: string;       // 生肖
  bazi?: {                       // 八字
    year_pillar: string;
    month_pillar: string;
    day_pillar: string;
    hour_pillar: string;
  };
  
  // 用户偏好
  preferred_language?: string;    // 偏好语言
  preferred_divination?: string[]; // 偏好的占卜方式
  
  created_at: string;
  updated_at: string;
}

// 用户统计信息
export interface UserStats {
  id: string;
  user_id: string;
  total_readings: number;        // 总占卜次数
  favorite_count: number;        // 收藏数量
  last_reading_date?: string;    // 最后占卜时间
  most_used_method?: string;     // 最常用的占卜方法
  accuracy_rating?: number;      // 用户评价的准确度（1-5）
  created_at: string;
  updated_at: string;
}

// 用户认证状态
export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    username?: string;
    avatar_url?: string;
  };
  app_metadata: Record<string, any>;
  aud: string;
  created_at: string;
  updated_at: string;
}

// 登录/注册请求
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  username?: string;
  confirm_password: string;
}

// 认证响应
export interface AuthResponse {
  user: AuthUser | null;
  session: any | null;
  error: Error | null;
}

// 用户完整信息（包含所有关联数据）
export interface CompleteUserInfo {
  profile: UserProfile;
  metadata?: UserMetadata;
  stats?: UserStats;
  isAuthenticated: boolean;
}

// 用户更新数据
export interface UserUpdateData {
  username?: string;
  avatar_url?: string;
  birth_date?: string;
  birth_time?: string;
  birth_location?: string;
  timezone?: string;
  preferred_language?: string;
  preferred_divination?: string[];
}

// 用户操作结果
export interface UserOperationResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
} 