/**
 * 内容格式化工具
 * 用于突出显示解读内容中的关键词句
 */

export type HighlightStyle = 'scheme1' | 'scheme2' | 'scheme3' | 'scheme4';

/**
 * 方案一：高亮标签 + 引用框（仅标记最关键信息）
 */
export function formatContentScheme1(content: string): string {
  if (!content) return '';
  
  let formatted = content;

  // 1. 突出章节标题（【本卦分析】、【动爻推演】等）
  // 这是结构性信息，必须保留
  formatted = formatted.replace(
    /【([^】]+)】/g,
    '<div class="interpretation-section-title"><span class="section-icon">📖</span><span class="section-text">$1</span></div>'
  );

  // 2. 不标记引用（移除所有引号标记，避免过度标记）
  // 只保留章节标题、关键建议和结论的标记

  // 3. 只标记最核心的建议词汇（极简版，只标记最关键的行动建议）
  const coreKeyPhrases = [
    '见好即收',
    '见善则迁',
    '有过则改'
  ];
  
  coreKeyPhrases.forEach(phrase => {
    const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedPhrase})(?![^<]*>)`, 'g');
    formatted = formatted.replace(
      regex,
      (match) => {
        // 如果已经被处理过，跳过
        if (match.includes('key-advice') || match.includes('<span')) return match;
        return `<span class="key-advice">${match}</span>`;
      }
    );
  });

  // 4. 只标记真正的综合结论（极简版，只标记"综合结论"开头的段落）
  formatted = formatted.replace(
    /(综合结论[^。]+[。！？])(?=\s|$|<)/g,
    (match) => {
      // 如果已经被处理过，跳过
      if (match.includes('conclusion-highlight')) return match;
      // 只标记长度适中的结论（不超过150字符）
      if (match.length > 150) return match;
      return `<div class="conclusion-highlight">${match}</div>`;
    }
  );

  // 5. 突出重要数字和时间（保留，这是关键信息）
  formatted = formatted.replace(
    /(\d+[-\u2013\u2014至]\d+个月?|四到五个月|4-5个月|四至五个月)/g,
    (match) => {
      // 如果已经被处理过，跳过
      if (match.includes('time-badge')) return match;
      return `<span class="time-badge">${match}</span>`;
    }
  );

  // 6. 将换行符转换为HTML（最后处理）
  formatted = formatted.replace(/\n/g, '<br>');

  return formatted;
}

/**
 * 方案二：卡片式摘要 + 行内强调
 */
export function formatContentScheme2(content: string): string {
  let formatted = content;

  // 1. 章节标题 - 更大更醒目
  formatted = formatted.replace(
    /【([^】]+)】/g,
    '<div class="scheme2-section-title">$1</div>'
  );

  // 2. 关键句 - 加粗 + 紫色
  const keyPatterns = [
    /(适合[^。]+。)/g,
    /(建议[^。]+。)/g,
    /(注意[^。]+。)/g,
    /(关键[^。]+。)/g
  ];
  keyPatterns.forEach(pattern => {
    formatted = formatted.replace(pattern, '<strong class="key-sentence">$1</strong>');
  });

  // 3. 重要数字/时间 - 徽章样式
  formatted = formatted.replace(
    /(\d+[-\u2013\u2014]\d+个月?|四到五个月|4-5个月)/g,
    '<span class="number-badge">$1</span>'
  );

  // 4. 结论段落 - 浅色背景
  formatted = formatted.replace(
    /(综合[^。]+。)/g,
    '<div class="conclusion-box">$1</div>'
  );

  // 5. 换行符
  formatted = formatted.replace(/\n/g, '<br>');

  return formatted;
}

/**
 * 方案三：侧边栏摘要 + 行内标记
 */
export function formatContentScheme3(content: string): string {
  let formatted = content;

  // 1. 章节标题
  formatted = formatted.replace(
    /【([^】]+)】/g,
    '<div class="scheme3-section-title">$1</div>'
  );

  // 2. 关键句 - 下划线 + 高亮
  formatted = formatted.replace(
    /(见好即收|见善则迁|有过则改|利涉大川|中行)/g,
    '<span class="highlighted-text">$1</span>'
  );

  // 3. 易经引用 - 斜体 + 金色
  formatted = formatted.replace(
    /"([^"]+)"/g,
    '<em class="yijing-quote-gold">"$1"</em>'
  );

  // 4. 换行符
  formatted = formatted.replace(/\n/g, '<br>');

  return formatted;
}

/**
 * 方案四：渐进式强调（最简洁）
 */
export function formatContentScheme4(content: string): string {
  let formatted = content;

  // 1. 章节标题 - 更大字号 + 渐变
  formatted = formatted.replace(
    /【([^】]+)】/g,
    '<div class="scheme4-section-title">$1</div>'
  );

  // 2. 关键句 - 加粗 + 紫色
  formatted = formatted.replace(
    /(见好即收|见善则迁|有过则改|利涉大川)/g,
    '<strong class="scheme4-keyword">$1</strong>'
  );

  // 3. 易经引用 - 引号样式
  formatted = formatted.replace(
    /"([^"]+)"/g,
    '<span class="quote-style">"$1"</span>'
  );

  // 4. 换行符
  formatted = formatted.replace(/\n/g, '<br>');

  return formatted;
}

/**
 * 统一入口函数
 */
export function formatContent(content: string, scheme: HighlightStyle = 'scheme1'): string {
  switch (scheme) {
    case 'scheme1':
      return formatContentScheme1(content);
    case 'scheme2':
      return formatContentScheme2(content);
    case 'scheme3':
      return formatContentScheme3(content);
    case 'scheme4':
      return formatContentScheme4(content);
    default:
      return content.replace(/\n/g, '<br>');
  }
}

