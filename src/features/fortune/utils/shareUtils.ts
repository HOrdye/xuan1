import type { FortuneResult } from '../types';

export function generateShareText(result: FortuneResult): string {
  const { overall, aspects } = result;
  const aspectTexts = Object.entries(aspects).map(([key, value]) => {
    const aspectNames: Record<string, string> = {
      career: '事业运',
      wealth: '财运',
      love: '感情运',
      health: '健康运'
    };
    return `${aspectNames[key]}: ${value.description}`;
  });

  return `【今日运势】\n` +
    `整体运势: ${overall.description}\n` +
    `运势指数: ${overall.score}\n\n` +
    `详细运势:\n${aspectTexts.join('\n')}\n\n` +
    `幸运数字: ${result.lucky.numbers.join(', ')}\n` +
    `幸运颜色: ${result.lucky.colors.join(', ')}\n` +
    `幸运方位: ${result.lucky.directions.join(', ')}\n\n` +
    `来自天玄Web的运势预测`;
}

export async function shareFortune(result: FortuneResult): Promise<void> {
  const shareText = generateShareText(result);
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: '今日运势',
        text: shareText
      });
    } catch (error) {
      console.error('分享失败:', error);
      fallbackShare(shareText);
    }
  } else {
    fallbackShare(shareText);
  }
}

function fallbackShare(text: string): void {
  // 复制到剪贴板
  navigator.clipboard.writeText(text).then(() => {
    alert('运势已复制到剪贴板，可以粘贴到其他应用分享');
  }).catch(() => {
    // 如果剪贴板API不可用，显示文本让用户手动复制
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('运势已复制到剪贴板，可以粘贴到其他应用分享');
  });
} 