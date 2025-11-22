/**
 * 内容格式化工具
 * 用于突出显示解读内容中的关键词句
 */

export type HighlightStyle = 'scheme1' | 'scheme2' | 'scheme3' | 'scheme4';

/**
 * 方案一：高亮标签 + 引用框（仅突出每个部分的关键语句，特别是建议部分）
 */
export function formatContentScheme1(content: string): string {
  if (!content) return '';

  let formatted = content;

  // 1. 将换行符转换为HTML
  formatted = formatted.replace(/\n/g, '<br>');

  // 2. 替换章节标题为HTML格式
  formatted = formatted.replace(
    /【([^】]+)】/g,
    '<div class="interpretation-section-title"><span class="section-icon">📖</span><span class="section-text">$1</span></div>'                                  
  );

  // 3. 按章节分割并处理每个章节
  const sectionParts = formatted.split(/(<div class="interpretation-section-title">[\s\S]*?<\/div>)/);
  let result = '';
  
  for (let i = 0; i < sectionParts.length; i++) {
    const part = sectionParts[i];
    
    // 如果是章节标题
    if (part.includes('interpretation-section-title')) {
      result += part;
      
      // 获取下一个部分作为章节内容
      if (i + 1 < sectionParts.length) {
        const content = sectionParts[i + 1];
        
        // 提取章节标题
        const titleMatch = part.match(/<span class="section-text">([^<]+)<\/span>/);
        const title = titleMatch ? titleMatch[1] : '';
        
        // 根据章节类型突出关键语句
        if (title.includes('综合结论') || title.includes('结论')) {
          // 综合结论部分：突出关键建议语句
          result += highlightKeySentencesInConclusion(content);
        } else {
          // 其他部分：突出最后一句关键语句
          result += highlightKeySentenceInSection(content);
        }
        
        i++; // 跳过内容部分，因为已经处理了
      }
    } else {
      // 普通内容（章节之前的内容）
      result += part;
    }
  }

  return result;
}

/**
 * 突出章节中的关键句子（通常是最后一句）
 */
function highlightKeySentenceInSection(content: string): string {
  if (!content || content.trim().length === 0) return content;

  // 提取纯文本（移除HTML标签）来识别句子
  const pureText = content.replace(/<[^>]+>/g, '');

  // 按句号、问号、感叹号分割句子
  const sentences = pureText.split(/([。！？])/);
  const validSentences: string[] = [];

  for (let i = 0; i < sentences.length - 1; i += 2) {
    const text = sentences[i]?.trim();
    const punctuation = sentences[i + 1] || '';
    if (text && text.length > 10) {
      validSentences.push(text + punctuation);
    }
  }

  if (validSentences.length === 0) return content;

  // 只突出最后一句关键语句
  const lastSentence = validSentences[validSentences.length - 1];
  
  // 在原始内容中找到并标记最后一句（需要处理HTML标签）
  const htmlWithoutTags = content.replace(/<[^>]+>/g, '');
  const lastSentenceIndex = htmlWithoutTags.lastIndexOf(lastSentence);
  
  if (lastSentenceIndex === -1) return content;

  // 找到HTML中对应的位置
  let textIndex = 0;
  let foundStart = false;
  let startPos = 0;
  let endPos = content.length;

  for (let i = 0; i < content.length; i++) {
    if (content[i] === '<') {
      // 跳过HTML标签
      while (i < content.length && content[i] !== '>') {
        i++;
      }
      continue;
    }

    if (textIndex === lastSentenceIndex && !foundStart) {
      startPos = i;
      foundStart = true;
    }

    if (foundStart && textIndex === lastSentenceIndex + lastSentence.length) {
      endPos = i;
      break;
    }

    textIndex++;
  }

  if (!foundStart) return content;

  // 检查是否已经被标记
  const sentenceHtml = content.substring(startPos, endPos);
  if (sentenceHtml.includes('key-advice') || sentenceHtml.includes('<span class="key-advice">')) {
    return content;
  }

  // 标记最后一句
  return content.substring(0, startPos) + 
         `<span class="key-advice">${sentenceHtml}</span>` + 
         content.substring(endPos);
}

/**
 * 突出综合结论部分的关键建议语句
 */
function highlightKeySentencesInConclusion(content: string): string {
  if (!content || content.trim().length === 0) return content;

  // 提取纯文本识别句子
  const pureText = content.replace(/<[^>]+>/g, '');
  
  const sentences = pureText.split(/([。！？])/);
  const validSentences: string[] = [];
  
  for (let i = 0; i < sentences.length - 1; i += 2) {
    const text = sentences[i]?.trim();
    const punctuation = sentences[i + 1] || '';
    if (text && text.length > 10) {
      validSentences.push(text + punctuation);
    }
  }

  if (validSentences.length === 0) {
    // 如果没有有效句子，直接包裹整个内容
    if (!content.includes('conclusion-highlight')) {
      return `<div class="conclusion-highlight">${content}</div>`;
    }
    return content;
  }

  let result = content;

  // 突出包含建议关键词的句子
  const adviceKeywords = ['建议', '应该', '可以', '需要', '宜', '不宜', '适合', '不适合', '保持', '避免', '注意', '需谨慎', '建议您', '推荐', '应当'];
  
  validSentences.forEach(sentence => {
    if (sentence.includes('key-advice') || sentence.includes('conclusion-highlight')) {
      return;
    }

    if (sentence.trim().length < 10) {
      return;
    }

    const hasAdviceKeyword = adviceKeywords.some(keyword => sentence.includes(keyword));
    const isLastFewSentences = validSentences.indexOf(sentence) >= validSentences.length - 3;
    
    if (hasAdviceKeyword || isLastFewSentences) {
      // 在HTML中找到对应的句子并标记
      const sentenceEscaped = sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const htmlWithoutTags = result.replace(/<[^>]+>/g, '');
      const sentenceIndex = htmlWithoutTags.indexOf(sentence);
      
      if (sentenceIndex !== -1) {
        // 找到HTML中对应的位置并标记
        let htmlIndex = 0;
        let textIndex = 0;
        let startPos = 0;
        let endPos = result.length;

        for (let i = 0; i < result.length; i++) {
          if (result[i] === '<') {
            while (i < result.length && result[i] !== '>') {
              i++;
            }
            continue;
          }

          if (textIndex === sentenceIndex && startPos === 0) {
            startPos = i;
          }

          if (textIndex === sentenceIndex + sentence.length && endPos === result.length) {
            endPos = i;
            break;
          }

          textIndex++;
        }

        const sentenceHtml = result.substring(startPos, endPos);
        if (!sentenceHtml.includes('key-advice') && !sentenceHtml.includes('<span class="key-advice">')) {
          result = result.substring(0, startPos) + 
                   `<span class="key-advice">${sentenceHtml}</span>` + 
                   result.substring(endPos);
        }
      }
    }
  });

  // 整个结论部分用高亮框包裹
  if (!result.includes('conclusion-highlight')) {
    result = `<div class="conclusion-highlight">${result}</div>`;
  }

  return result;
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
