// 分享数据接口
export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  hashtags?: string[];
}

// 社交平台接口
export interface SocialPlatform {
  name: string;
  color: string;
  icon: any;
  shareUrl: (data: ShareData) => string;
}

// 分享内容类型
export type ShareContentType = 'fortune' | 'tarot' | 'jiaoBei' | 'divination';

// 分享内容接口
export interface ShareContent {
  type: ShareContentType;
  title: string;
  description: string;
  hashtags: string[];
  generateCaption: () => string;
}

// 分享结果接口
export interface ShareResult {
  success: boolean;
  platform?: string;
  error?: string;
}

// 分享配置接口
export interface ShareConfig {
  enableNativeShare: boolean;
  enableSocialPlatforms: boolean;
  defaultHashtags: string[];
  captionTemplates: Record<ShareContentType, string[]>;
} 