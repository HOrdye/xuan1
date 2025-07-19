import type { ShareData, ShareContent, ShareContentType, SocialPlatform } from '../types/share';

// 默认分享配置
export const DEFAULT_SHARE_CONFIG = {
  enableNativeShare: true,
  enableSocialPlatforms: true,
  defaultHashtags: ['天玄Web', '玄学助手', '占卜指引'],
  captionTemplates: {
    fortune: [
      '刚刚在天玄Web获得了今日运势解读，感觉很准呢！✨ #今日运势 #玄学助手',
      '今天的运势分析让我对未来更有信心了 💫 #运势 #正能量',
      '分享一下我的玄学小确幸，天玄Web真的很有意思 🌟 #玄学 #日常分享'
    ],
    tarot: [
      '🔮 通过塔罗占卜找到了内心深处的答案，每张卡牌都有独特的启示 ✨ #塔罗占卜 #心灵成长',
      '✨ 塔罗牌给了我关于人生的深刻洞察，正位逆位都有其意义 🌟 #塔罗解读 #生活指南',
      '🎴 今天的塔罗占卜让我对当前困境有了新的理解，感谢宇宙的指引 💫 #塔罗占卜 #玄学智慧',
      '🌟 塔罗牌的象征意义真的很深刻，每次占卜都能获得建设性的建议 ✨ #塔罗牌 #心灵指引',
      '💡 通过塔罗占卜获得了具体的行动方向，卡牌的智慧令人惊叹 🔮 #塔罗占卜 #人生指导'
    ],
    jiaoBei: [
      '在天玄Web进行了笅杯占卜，获得了神明的指引！🙏 #笅杯占卜 #神明指引',
      '笅杯给了我清晰的方向，感谢神明的庇佑 ✨ #笅杯 #祈福',
      '通过笅杯占卜得到了重要的启示 🌟 #笅杯占卜 #传统文化'
    ],
    divination: [
      '用天玄Web进行了玄选两难分析，易经的智慧真的很深刻！📖 #玄选两难 #易经智慧',
      '在两难选择中得到了易经的指引，方向更清晰了 ✨ #易经 #人生选择',
      '通过易经占卜解决了困扰已久的问题 🌟 #易经占卜 #智慧指引'
    ]
  }
};

// 社交平台配置
export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    name: '微信',
    color: '#07C160',
    icon: {
      template: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.162 4.203 2.985 5.55l-.666 3.015 3.315-1.65c.840.157 1.726.264 2.691.264.216 0 .431-.008.645-.024-.137-.464-.21-.957-.21-1.467 0-3.264 2.723-5.918 6.115-5.918.846 0 1.674.174 2.445.492C16.955 5.886 13.531 2.188 8.691 2.188zm-2.362 2.769c.496 0 .898.402.898.898s-.402.898-.898.898-.898-.402-.898-.898.402-.898.898-.898zm4.724 0c.496 0 .898.402.898.898s-.402.898-.898.898-.898-.402-.898-.898.402-.898.898-.898z"/><path d="M17.297 11.113c-3.069 0-5.568 2.036-5.568 4.542 0 1.613 1.027 3.041 2.569 3.926l-.57 2.184 2.427-1.206c.681.122 1.39.203 2.142.203 3.069 0 5.568-2.036 5.568-4.542s-2.499-4.542-5.568-4.542zm-1.774 1.816c.345 0 .625.28.625.625s-.28.625-.625.625-.625-.28-.625-.625.28-.625.625-.625zm3.548 0c.345 0 .625.28.625.625s-.28.625-.625.625-.625-.28-.625-.625.28-.625.625-.625z"/></svg>`
    },
    shareUrl: () => '' // 微信需要特殊处理
  },
  {
    name: '微博',
    color: '#E6162D',
    icon: {
      template: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zm8.717-8.922c-.332-.062-.559-.134-.385-.482.377-.753.416-1.403.115-1.868-.564-.871-2.116-.823-3.898-.026 0 0-.56.252-.416-.205.275-1.217.233-2.237-.249-2.824-1.089-1.331-3.991.052-6.479 3.081-1.858 2.267-2.937 4.665-2.937 6.74 0 3.959 4.869 6.364 9.635 6.364 6.255 0 10.426-3.74 10.426-6.709-.002-1.78-1.45-2.794-2.812-3.071z"/></svg>`
    },
    shareUrl: (data) => `https://service.weibo.com/share/share.php?title=${encodeURIComponent(data.text || '')}&url=${encodeURIComponent(data.url || window.location.href)}`
  },
  {
    name: 'QQ空间',
    color: '#12B7F5',
    icon: {
      template: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.95-.199-2.405.042-3.441.219-.937 1.404-5.958 1.404-5.958s-.359-.719-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.688 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.747-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/></svg>`
    },
    shareUrl: (data) => `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=${encodeURIComponent(data.title || '')}&desc=${encodeURIComponent(data.text || '')}&url=${encodeURIComponent(data.url || window.location.href)}`
  },
  {
    name: '小红书',
    color: '#FF2442',
    icon: {
      template: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
    },
    shareUrl: () => '' // 小红书需要特殊处理
  }
];

/**
 * 生成分享文案
 */
export function generateShareCaption(type: ShareContentType, customText?: string): string {
  if (customText) return customText;
  
  const templates = DEFAULT_SHARE_CONFIG.captionTemplates[type];
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * 生成分享数据
 */
export function createShareData(content: ShareContent): ShareData {
  return {
    title: content.title,
    text: content.generateCaption(),
    url: window.location.href,
    hashtags: [...content.hashtags, ...DEFAULT_SHARE_CONFIG.defaultHashtags]
  };
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
}

/**
 * 检查是否支持原生分享
 */
export function canUseNativeShare(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

/**
 * 分享到社交平台
 */
export function shareToSocialPlatform(platform: SocialPlatform, data: ShareData): void {
  if (platform.name === '微信') {
    alert('请长按图片保存，然后在微信中发送');
    return;
  }

  if (platform.name === '小红书') {
    alert('请保存图片后在小红书APP中发布');
    return;
  }

  const shareUrl = platform.shareUrl(data);
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
}

/**
 * 原生分享
 */
export async function nativeShare(data: ShareData, imageFile?: File): Promise<boolean> {
  if (!canUseNativeShare()) {
    return false;
  }

  try {
    const shareData: any = {
      title: data.title,
      text: data.text,
      url: data.url
    };

    if (imageFile) {
      shareData.files = [imageFile];
    }

    await navigator.share(shareData);
    return true;
  } catch (error) {
    console.error('原生分享失败:', error);
    return false;
  }
} 