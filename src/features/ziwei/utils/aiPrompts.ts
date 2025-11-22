/**
 * 紫微斗数AI解读提示词模板
 * 用于生成个性化的命盘解读报告
 */

import type { ZiweiChart } from '../types';

/**
 * 验证命盘数据完整性
 */
function validateChartData(chartData: ZiweiChart): boolean {
  return chartData.palaces && chartData.palaces.length === 12;
}

/**
 * 获取四化星信息
 */
function getSihuaInfo(chartData: ZiweiChart): string {
  const sihuaList: string[] = [];
  
  chartData.palaces.forEach(palace => {
    if (palace.sihua) {
      const { lu, quan, ke, ji } = palace.sihua;
      if (lu) sihuaList.push(`${lu}化禄`);
      if (quan) sihuaList.push(`${quan}化权`);
      if (ke) sihuaList.push(`${ke}化科`);
      if (ji) sihuaList.push(`${ji}化忌`);
    }
  });

  return sihuaList.length > 0 ? sihuaList.join('、') : '无';
}

/**
 * 检测杀破狼格局
 */
function checkKillBreakWolfPattern(chartData: ZiweiChart): boolean {
  const allStarNames = chartData.palaces.flatMap(p => p.stars.map(s => s.name));
  return allStarNames.includes('七杀') && 
         allStarNames.includes('破军') && 
         allStarNames.includes('贪狼');
}

/**
 * 检测机月同梁格局
 */
function checkJiYueTongLiangPattern(chartData: ZiweiChart): boolean {
  const allStarNames = chartData.palaces.flatMap(p => p.stars.map(s => s.name));
  return allStarNames.includes('天机') && 
         allStarNames.includes('太阴') && 
         allStarNames.includes('天同') && 
         allStarNames.includes('天梁');
}

/**
 * 生成性格分析提示词
 */
export function generatePersonalityPrompt(chartData: ZiweiChart): string {
  try {
    if (!validateChartData(chartData)) {
      return '抱歉，命盘数据不完整，无法生成性格分析。';
    }

    const mingGong = chartData.palaces.find(p => p.name === '命宫');
    const qianYiGong = chartData.palaces.find(p => p.name === '迁移宫'); // 对宫
    const caiBoGong = chartData.palaces.find(p => p.name === '财帛宫'); // 合宫
    const guanLuGong = chartData.palaces.find(p => p.name === '官禄宫'); // 合宫

    // 获取四化信息
    const sihuaInfo = getSihuaInfo(chartData);

    return `你是一位经验丰富的紫微斗数命理师，擅长用通俗易懂的语言解读命盘。

基于以下命盘信息，请生成一份完整的性格分析报告：

**命宫**：${mingGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**迁移宫（对宫）**：${qianYiGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**财帛宫**：${caiBoGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**官禄宫**：${guanLuGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**四化星**：${sihuaInfo}

**要求**：
1. 首先分析命宫主星的性格特质，结合亮度说明（庙旺利得平不得地陷的影响）
2. 考虑对宫（迁移宫）对性格的外在影响，说明你给别人的印象
3. 结合财帛宫和官禄宫分析价值观和事业取向
4. 如果有四化星，重点分析其对性格的影响（化禄主享受、化权主掌控、化科主名声、化忌主困扰）
5. 语言亲切自然，像朋友聊天，每段50-80字，总共300-400字
6. 给出3条具体可操作的性格发展建议
7. 用1-2个emoji适当增强可读性，但不要过度使用
8. 避免宿命论，强调主观能动性
9. 避免使用"可能"、"或许"等模糊词汇

**格式**：
## 核心性格特质
[结合命宫和对宫分析]

## 你的优势与挑战
[结合四化和合宫分析]

## 性格发展建议
1. ...
2. ...
3. ...`;
  } catch (error) {
    return '抱歉，目前无法生成性格分析，请检查命盘数据完整性。';
  }
}

/**
 * 生成事业建议提示词
 */
export function generateCareerPrompt(chartData: ZiweiChart): string {
  try {
    if (!validateChartData(chartData)) {
      return '抱歉，命盘数据不完整，无法生成事业建议。';
    }

    const guanLuGong = chartData.palaces.find(p => p.name === '官禄宫');
    const mingGong = chartData.palaces.find(p => p.name === '命宫');
    const caiBoGong = chartData.palaces.find(p => p.name === '财帛宫');
    const fuQiGong = chartData.palaces.find(p => p.name === '夫妻宫'); // 事业宫的对宫

    // 获取四化信息
    const sihuaInfo = getSihuaInfo(chartData);

    return `你是一位经验丰富的紫微斗数命理师，擅长用通俗易懂的语言解读命盘。

基于以下命盘信息，请生成一份事业发展建议：

**事业宫**：${guanLuGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**命宫**：${mingGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**财帛宫**：${caiBoGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**夫妻宫（事业对宫）**：${fuQiGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**四化星**：${sihuaInfo}

**要求**：
1. 分析事业宫主星的特质，结合亮度说明适合的发展方向（庙旺利得平不得地陷的影响）
2. 考虑命宫性格对事业选择的影响
3. 结合财帛宫分析赚钱模式
4. 分析夫妻宫对事业成就的影响（合作、贵人等）
5. 如果有四化星，重点分析其对事业的影响（化禄主财源、化权主权力、化科主名声、化忌主阻碍）
6. 推荐3-5个具体的职业方向，说明理由
7. 给出事业发展的时间建议（适合创业、稳定发展等）
8. 语言亲切自然，每段50-80字，总共300-400字
9. 避免绝对化表述，强调努力的重要性
10. 用1-2个emoji适当增强可读性，但不要过度使用
11. 避免使用"可能"、"或许"等模糊词汇

**格式**：
## 适合的职业方向
[结合星曜特质具体分析，每个方向说明理由]

## 事业发展时机
[结合宫位关系和四化分析]

## 事业成功关键
1. ...
2. ...
3. ...`;
  } catch (error) {
    return '抱歉，目前无法生成事业建议，请检查命盘数据完整性。';
  }
}

/**
 * 生成感情指引提示词
 */
export function generateRelationshipPrompt(chartData: ZiweiChart): string {
  try {
    if (!validateChartData(chartData)) {
      return '抱歉，命盘数据不完整，无法生成感情指引。';
    }

    const fuQiGong = chartData.palaces.find(p => p.name === '夫妻宫');
    const mingGong = chartData.palaces.find(p => p.name === '命宫');
    const ziNuGong = chartData.palaces.find(p => p.name === '子女宫');
    const guanLuGong = chartData.palaces.find(p => p.name === '官禄宫'); // 夫妻宫的对宫

    // 获取四化信息
    const sihuaInfo = getSihuaInfo(chartData);

    return `你是一位经验丰富的紫微斗数命理师，擅长用通俗易懂的语言解读命盘。

基于以下命盘信息，请生成一份感情指引报告：

**夫妻宫**：${fuQiGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**命宫**：${mingGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**子女宫**：${ziNuGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**官禄宫（夫妻对宫）**：${guanLuGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**四化星**：${sihuaInfo}

**要求**：
1. 分析夫妻宫主星的特质，结合亮度说明感情模式（庙旺利得平不得地陷的影响）
2. 考虑命宫性格对感情选择的影响
3. 结合子女宫分析对家庭和孩子的态度
4. 分析官禄宫对感情的影响（事业与感情的平衡）
5. 如果有四化星，重点分析其对感情的影响（化禄主感情丰富、化权主掌控欲、化科主名声、化忌主困扰）
6. 分析感情模式和择偶标准
7. 语言亲切自然，每段50-80字，总共300-400字
8. 给出3条具体可操作的感情建议
9. 用1-2个emoji适当增强可读性，但不要过度使用
10. 避免宿命论，强调沟通和理解的重要性
11. 避免使用"可能"、"或许"等模糊词汇

**格式**：
## 你的感情模式
[结合夫妻宫和命宫分析]

## 择偶标准
[结合星曜特质和四化分析]

## 感情建议
1. ...
2. ...
3. ...`;
  } catch (error) {
    return '抱歉，目前无法生成感情指引，请检查命盘数据完整性。';
  }
}

/**
 * 生成健康建议提示词
 */
export function generateHealthPrompt(chartData: ZiweiChart): string {
  try {
    if (!validateChartData(chartData)) {
      return '抱歉，命盘数据不完整，无法生成健康建议。';
    }

    const jiEGong = chartData.palaces.find(p => p.name === '疾厄宫');
    const mingGong = chartData.palaces.find(p => p.name === '命宫');
    const fuMuGong = chartData.palaces.find(p => p.name === '父母宫'); // 疾厄宫的对宫

    // 获取四化信息
    const sihuaInfo = getSihuaInfo(chartData);

    return `你是一位经验丰富的紫微斗数命理师，擅长用通俗易懂的语言解读命盘。

基于以下命盘信息，请生成一份健康建议报告：

**疾厄宫**：${jiEGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**命宫**：${mingGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**父母宫（疾厄对宫）**：${fuMuGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**四化星**：${sihuaInfo}

**要求**：
1. 分析疾厄宫主星的特质，结合亮度说明体质特点（庙旺利得平不得地陷的影响）
2. 考虑命宫性格对健康习惯的影响
3. 结合父母宫分析遗传体质和先天健康基础
4. 如果有四化星，重点分析其对健康的影响（化禄主享受需注意、化权主压力、化科主保养、化忌主困扰）
5. 分析体质特点和健康倾向
6. 语言亲切自然，每段50-80字，总共200-300字
7. 给出3条具体可操作的健康建议
8. 用1-2个emoji适当增强可读性，但不要过度使用
9. 强调预防和保养，避免过度担忧
10. 避免使用"可能"、"或许"等模糊词汇

**格式**：
## 你的体质特点
[结合疾厄宫和命宫分析]

## 健康建议
1. ...
2. ...
3. ...`;
  } catch (error) {
    return '抱歉，目前无法生成健康建议，请检查命盘数据完整性。';
  }
}

/**
 * 生成财运分析提示词
 */
export function generateWealthPrompt(chartData: ZiweiChart): string {
  try {
    if (!validateChartData(chartData)) {
      return '抱歉，命盘数据不完整，无法生成财运分析。';
    }

    const caiBoGong = chartData.palaces.find(p => p.name === '财帛宫');
    const mingGong = chartData.palaces.find(p => p.name === '命宫');
    const tianZhaiGong = chartData.palaces.find(p => p.name === '田宅宫');
    const guanLuGong = chartData.palaces.find(p => p.name === '官禄宫'); // 财帛宫的对宫

    // 获取四化信息
    const sihuaInfo = getSihuaInfo(chartData);

    return `你是一位经验丰富的紫微斗数命理师，擅长用通俗易懂的语言解读命盘。

基于以下命盘信息，请生成一份财运分析报告：

**财帛宫**：${caiBoGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**命宫**：${mingGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**田宅宫**：${tianZhaiGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**官禄宫（财帛对宫）**：${guanLuGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**四化星**：${sihuaInfo}

**要求**：
1. 分析财帛宫主星的特质，结合亮度说明赚钱方式（庙旺利得平不得地陷的影响）
2. 考虑命宫性格对理财观念的影响
3. 结合田宅宫分析不动产和资产积累能力
4. 分析官禄宫对财运的影响（事业与财富的关系）
5. 如果有四化星，重点分析其对财运的影响（化禄主财源、化权主掌控、化科主名声、化忌主破耗）
6. 分析赚钱方式和理财能力
7. 语言亲切自然，每段50-80字，总共300-400字
8. 给出3条具体可操作的理财建议
9. 用1-2个emoji适当增强可读性，但不要过度使用
10. 强调合理理财，避免过度消费
11. 避免使用"可能"、"或许"等模糊词汇

**格式**：
## 你的赚钱方式
[结合财帛宫和命宫分析]

## 理财能力分析
[结合田宅宫和四化分析]

## 理财建议
1. ...
2. ...
3. ...`;
  } catch (error) {
    return '抱歉，目前无法生成财运分析，请检查命盘数据完整性。';
  }
}

/**
 * 生成一句话总结提示词
 */
export function generateSummaryPrompt(chartData: ZiweiChart): string {
  try {
    if (!validateChartData(chartData)) {
      return '抱歉，命盘数据不完整，无法生成总结。';
    }

    const mingGong = chartData.palaces.find(p => p.name === '命宫');
    const caiBoGong = chartData.palaces.find(p => p.name === '财帛宫');
    const guanLuGong = chartData.palaces.find(p => p.name === '官禄宫');
    const fuQiGong = chartData.palaces.find(p => p.name === '夫妻宫');

    // 获取四化信息
    const sihuaInfo = getSihuaInfo(chartData);

    // 检测格局
    const patterns: string[] = [];
    if (checkKillBreakWolfPattern(chartData)) patterns.push('杀破狼格局');
    if (checkJiYueTongLiangPattern(chartData)) patterns.push('机月同梁格局');

    return `你是一位经验丰富的紫微斗数命理师，擅长用通俗易懂的语言解读命盘。

基于以下命盘信息，请生成一句话总结（50-80字）：

**命宫**：${mingGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**财帛宫**：${caiBoGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**事业宫**：${guanLuGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**夫妻宫**：${fuQiGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}
**四化星**：${sihuaInfo}
${patterns.length > 0 ? `**格局**：${patterns.join('、')}` : ''}

**要求**：
1. 语言亲切自然，像朋友聊天
2. 一句话概括命盘特点（50-80字）
3. 包含性格、事业、财运、感情中的2-3个方面
4. 如果有格局，可以提及格局特点
5. 如果有重要四化，可以提及四化影响
6. 用1个emoji适当增强可读性
7. 避免使用"可能"、"或许"等模糊词汇
8. 要结合命盘中的星曜特质，但用通俗的语言表达

**格式**：
[一句话总结]`;
  } catch (error) {
    return '抱歉，目前无法生成总结，请检查命盘数据完整性。';
  }
}

/**
 * 生成整体命盘格局分析提示词
 */
export function generatePatternAnalysisPrompt(chartData: ZiweiChart): string {
  try {
    if (!validateChartData(chartData)) {
      return '抱歉，命盘数据不完整，无法生成格局分析。';
    }

    const mingGong = chartData.palaces.find(p => p.name === '命宫');
    const allPalaces = chartData.palaces;

    // 检测重要格局
    const patterns: string[] = [];
    if (checkKillBreakWolfPattern(chartData)) patterns.push('杀破狼格局');
    if (checkJiYueTongLiangPattern(chartData)) patterns.push('机月同梁格局');

    // 统计各宫位星曜分布
    const palaceInfo = allPalaces.map(p => 
      `**${p.name}**：${p.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}`
    ).join('\n');

    // 获取四化信息
    const sihuaInfo = getSihuaInfo(chartData);

    return `你是一位经验丰富的紫微斗数命理师，请分析以下命盘的整体格局：

**命宫**：${mingGong?.stars.map(s => `${s.name}（${s.brightness || '平'}）`).join('、') || '空宫'}

**各宫位星曜分布**：
${palaceInfo}

**检测到格局**：${patterns.length > 0 ? patterns.join('、') : '无明显特殊格局'}

**四化星**：${sihuaInfo}

**要求**：
1. 分析整体命盘格局的特点和能量分布
2. 说明命盘的优势领域和需要注意的方面
3. 如果有特殊格局，详细分析格局的影响和特点
4. 分析四化星对整体命盘的影响
5. 结合各宫位关系分析人生不同领域的发展潜力
6. 给出人生发展的整体建议
7. 语言积极正向，强调把握机遇和应对挑战
8. 每段50-80字，总共400-500字
9. 用1-2个emoji适当增强可读性，但不要过度使用
10. 避免宿命论，强调主观能动性
11. 避免使用"可能"、"或许"等模糊词汇

**格式**：
## 命盘整体特点
[格局分析和能量分布]

## 人生发展优势
[优势领域分析，结合各宫位]

## 需要注意的方面
[挑战和注意事项]

## 综合发展建议
[整体建议，强调把握机遇]`;
  } catch (error) {
    return '抱歉，目前无法生成格局分析，请检查命盘数据完整性。';
  }
}

