import { ref, computed } from 'vue';
import type { ShareData, ShareContent, ShareContentType, SocialPlatform } from '../types/share';
import { 
  generateShareCaption, 
  createShareData, 
  copyToClipboard, 
  canUseNativeShare, 
  shareToSocialPlatform, 
  nativeShare,
  SOCIAL_PLATFORMS 
} from '../utils/shareUtils';

export function useShare() {
  const isSharePanelOpen = ref(false);
  const isGeneratingCaption = ref(false);
  const shareCaption = ref('');
  const canShare = ref(canUseNativeShare());

  /**
   * 打开分享面板
   */
  const openSharePanel = () => {
    isSharePanelOpen.value = true;
  };

  /**
   * 关闭分享面板
   */
  const closeSharePanel = () => {
    isSharePanelOpen.value = false;
    shareCaption.value = '';
  };

  /**
   * 生成智能文案
   */
  const generateCaption = async (type: ShareContentType, customText?: string) => {
    isGeneratingCaption.value = true;
    try {
      // 模拟AI生成过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      shareCaption.value = generateShareCaption(type, customText);
    } catch (error) {
      console.error('生成文案失败:', error);
      shareCaption.value = generateShareCaption(type);
    } finally {
      isGeneratingCaption.value = false;
    }
  };

  /**
   * 复制文案
   */
  const copyCaption = async () => {
    const success = await copyToClipboard(shareCaption.value);
    if (success) {
      console.log('文案已复制到剪贴板');
      // 这里可以添加成功提示
    }
    return success;
  };

  /**
   * 分享到社交平台
   */
  const shareToSocial = (platform: SocialPlatform, data: ShareData) => {
    shareToSocialPlatform(platform, {
      ...data,
      text: shareCaption.value || data.text
    });
  };

  /**
   * 原生系统分享
   */
  const shareNative = async (data: ShareData, imageFile?: File) => {
    return await nativeShare({
      ...data,
      text: shareCaption.value || data.text
    }, imageFile);
  };

  /**
   * 创建分享内容
   */
  const createShareContent = (
    type: ShareContentType,
    title: string,
    description: string,
    hashtags: string[] = []
  ): ShareContent => {
    return {
      type,
      title,
      description,
      hashtags,
      generateCaption: () => generateShareCaption(type, description)
    };
  };

  /**
   * 获取社交平台列表
   */
  const socialPlatforms = computed(() => SOCIAL_PLATFORMS);

  return {
    // 状态
    isSharePanelOpen,
    isGeneratingCaption,
    shareCaption,
    canShare,
    socialPlatforms,

    // 方法
    openSharePanel,
    closeSharePanel,
    generateCaption,
    copyCaption,
    shareToSocial,
    shareNative,
    createShareContent,
    createShareData
  };
} 