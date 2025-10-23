/**
 * 筊杯占卜核心算法
 * 基于传统筊杯占卜规则实现
 */

// 筊杯结果类型
export type JiaoBeiResult = '圣杯' | '笑杯' | '阴杯' | '立杯' | '叠杯';

// 筊杯问题类型
export interface JiaoBeiQuestion {
  content: string;
  category: '事业' | '感情' | '健康' | '学业' | '财运' | '其他';
  timestamp: number;
  userName?: string;
  userBirth?: string;
  userAddress?: string;
}

// 筊杯组合结果
export interface JiaoBeiCombination {
  first: JiaoBeiResult;
  second: JiaoBeiResult;
  third: JiaoBeiResult;
  combination: string;
  meaning: string;
  advice: string;
  energy: 'positive' | 'neutral' | 'negative';
  category: '事业' | '感情' | '健康' | '学业' | '财运' | '其他';
  traditionalSign: string; // 传统签文
  traditionalPoem: string; // 传统诗句
}

// 筊杯解读结果
export interface JiaoBeiInterpretation {
  personalizedAdvice: string;
  luckyElements: string;
  warnings: string;
  timing: string; // 时机分析
  traditionalMeaning: string; // 传统含义
}

// 传统二十八签注解
const TRADITIONAL_SIGNS = {
  '圣杯、圣杯、圣杯': {
    sign: '上签',
    title: '郭子仪全禄',
    poem: '福如东海寿南山，君尔何故苦中间？富贵荣华天注定，太白贵人守身边。',
    meaning: '凡事大吉，暗劝世人',
    energy: 'positive' as const
  },
  '笑杯、笑杯、笑杯': {
    sign: '上吉',
    title: '四皓八仙，十八学士',
    poem: '风恬浪静好行舟，高歌鼓舞乐悠悠；四皓八仙齐畅饮，十八学士登瀛洲。',
    meaning: '功名大吉，出外大吉',
    energy: 'positive' as const
  },
  '阴杯、阴杯、阴杯': {
    sign: '下下',
    title: '武则天坐天',
    poem: '鬼门关上撞无常，破船更遇浪头风；久远冤家相罗网，运交吉时也遭殃。',
    meaning: '暗阴有财气，光阳则不吉',
    energy: 'negative' as const
  },
  '圣杯、圣杯、笑杯': {
    sign: '中平',
    title: '孔子在陈',
    poem: '哑子得梦事难言，瞎子穿针更不然；九曲明珠穿得过，在陈绝粮全因贤。',
    meaning: '凡事艰难，有贵人助',
    energy: 'neutral' as const
  },
  '圣杯、圣杯、阴杯': {
    sign: '上吉',
    title: '王安石小登科',
    poem: '宝镜团圆似月明，琴瑟和鸣畅我情；红杏枝头春意闹，登科一举状元名。',
    meaning: '照时婚姻买卖大吉，初一至十五求大吉',
    energy: 'positive' as const
  },
  '圣杯、笑杯、圣杯': {
    sign: '中平',
    title: '刘福妻劝夫',
    poem: '叶落根深霜不怕，枯木逢春再发芽；虽是中间多进退，钱财到底属我家。',
    meaning: '求财照时吉，事磨但终成',
    energy: 'neutral' as const
  },
  '圣杯、笑杯、笑杯': {
    sign: '中平',
    title: '张飞义释严颜',
    poem: '梅花冻雪抖芳菲，江上渔翁把钓飞；夜静水寒鱼不饵，满船空载月明归。',
    meaning: '凡事平常，心诚运至',
    energy: 'neutral' as const
  },
  '圣杯、笑杯、阴杯': {
    sign: '上吉',
    title: '刘秀兴汉',
    poem: '皇天降下紫微星，除妖灭怪得安宁；二十八宿扶圣主，汉王家国再重兴。',
    meaning: '暗时星出大吉，凡事二次大吉',
    energy: 'positive' as const
  },
  '圣杯、阴杯、圣杯': {
    sign: '上吉',
    title: '舜历山耕田',
    poem: '富贵总是天注定，五谷丰登胜上年；共享太平歌舜日，含哺鼓腹乐尧天。',
    meaning: '凡事大吉，白天大吉',
    energy: 'positive' as const
  },
  '圣杯、阴杯、笑杯': {
    sign: '中吉',
    title: '吕蒙正破窑齐志',
    poem: '鲤鱼志气本英雄，屈守池中运未通；一旦峥嵘头角现，风云际会化成龙。',
    meaning: '求财潮涨吉，出外风雨吉',
    energy: 'positive' as const
  },
  '圣杯、阴杯、阴杯': {
    sign: '下下',
    title: '韩信逼钟离昧自刎',
    poem: '白虎出山欲害人，鱼入罗网难脱身；害人之心则害已，飞虫扑火自伤生。',
    meaning: '宜守本份，谨防口舌',
    energy: 'negative' as const
  },
  '笑杯、圣杯、圣杯': {
    sign: '中吉',
    title: '太公遇文王',
    poem: '太公钓鱼八十秋，除商灭纣再兴周；民安国定太平日，江山万里任君游。',
    meaning: '凡事照旧，潮涨大吉',
    energy: 'positive' as const
  },
  '笑杯、圣杯、笑杯': {
    sign: '下下',
    title: '夷齐耻食周粟',
    poem: '鱼在小涧生长难，深处安身浅水寒；清冷香中抱膝吟，夷齐饿死首阳山。',
    meaning: '头好尾衰，财气趋淡',
    energy: 'negative' as const
  },
  '笑杯、圣杯、阴杯': {
    sign: '中吉',
    title: '释迦，老君，真宗，梁纥',
    poem: '释迦幻化妙应身，老君抛送玉麒麟；真宗求嗣生太子，梁纥祷丘出圣人。',
    meaning: '诚信立世，有求必应，添油向善',
    energy: 'positive' as const
  },
  '笑杯、笑杯、圣杯': {
    sign: '上吉',
    title: '观音渡众生',
    poem: '日上东方如火轮，十分光彩照乾坤；二十四气尽清洁，一年四季太平春。',
    meaning: '凡事大吉，日照大吉',
    energy: 'positive' as const
  },
  '笑杯、笑杯、阴杯': {
    sign: '中平',
    title: '朱寿昌弃官寻母',
    poem: '一盏孤灯对面休，富贵钱财水上舟；任他险处不见险，主人有福再添油。',
    meaning: '凡事不须强求，向善即逢凶化吉',
    energy: 'neutral' as const
  },
  '笑杯、阴杯、圣杯': {
    sign: '中吉',
    title: '桃园结义',
    poem: '三人各姓同一心，桃园结义情意深；山中石头皆是宝，运来都能变成金。',
    meaning: '凡事人和，能成事业',
    energy: 'positive' as const
  },
  '笑杯、阴杯、笑杯': {
    sign: '中平',
    title: '程咬金遇赦',
    poem: '囚人出禁上酒楼，畅饮宽杯解闷头；劝君慎忍一时气，非干已事且相饶。',
    meaning: '直守本份，以退为进',
    energy: 'neutral' as const
  },
  '笑杯、阴杯、阴杯': {
    sign: '下下',
    title: '梅妃的故事',
    poem: '若要求财未得时，只恐鬼贼相侵害；关门闭户家中坐，灾祸偏从天上来。',
    meaning: '遇事不吉，须防小人，防患灾祸',
    energy: 'negative' as const
  },
  '阴杯、圣杯、圣杯': {
    sign: '中吉',
    title: '苏小妹答诗',
    poem: '夫妇有意两相求，绸缪未合各成愁；心有灵犀一点通，天注姻缘不须忧。',
    meaning: '逢春大吉，暗事大吉，凡事有成',
    energy: 'positive' as const
  },
  '阴杯、圣杯、笑杯': {
    sign: '中吉',
    title: '七夕相会',
    poem: '牛郎织女各天边，阻隔银河路查然；百年富贵风前烛，一旦荣华云里仙。',
    meaning: '凡事无实，财气五分',
    energy: 'positive' as const
  },
  '阴杯、圣杯、阴杯': {
    sign: '中平',
    title: '后羿射日，嫦娥奔月',
    poem: '张弓射日总虚空，朽木难雕白费工；平生常念千声佛，作恶枉烧万炷香。',
    meaning: '凡事慎言，事满招损',
    energy: 'neutral' as const
  },
  '阴杯、笑杯、圣杯': {
    sign: '中平',
    title: '刘文定买父',
    poem: '雷霆霹雳震虚空，天公差我察吉凶；积善之家有余庆，积恶之家有余殃。',
    meaning: '作事应随运，求财遇春吉',
    energy: 'neutral' as const
  },
  '阴杯、笑杯、笑杯': {
    sign: '中平',
    title: '伏羲画八卦',
    poem: '伏羲八卦最精灵，六十甲子推五星；暗虚亏心天地见，举头三尺有神明。',
    meaning: '隐忍则善，静以待时，夜求昌吉，财气三分',
    energy: 'neutral' as const
  },
  '阴杯、笑杯、阴杯': {
    sign: '下下',
    title: '吕后害韩信',
    poem: '昔日螳螂去捕蝉，岂知黄雀在后边；莫信他人直中直，须防心里仁不仁。',
    meaning: '凡事太险，谨防则吉',
    energy: 'negative' as const
  },
  '阴杯、阴杯、圣杯': {
    sign: '中平',
    title: '三藏取经',
    poem: '三藏取经往西天，路途险阻劳圣贤；云横秦岭家何在？雪拥蓝关马不前。',
    meaning: '凡事艰难，财运未到，忍以待时',
    energy: 'neutral' as const
  },
  '阴杯、阴杯、笑杯': {
    sign: '中平',
    title: '八仙过海',
    poem: '八仙过海赴蟠桃，龙王降夺蓝采和；因贪玉皮动刀战，慈心惟佛来讲和。',
    meaning: '凡事曲折，有贵人助，财运未到',
    energy: 'neutral' as const
  },
  '立杯、立杯、立杯': {
    sign: '衰签',
    title: '赛卢医歹心害人',
    poem: '口占昆山玉，行人问吉凶；劝君急退步，不久落坑中。',
    meaning: '歹心作恶，天降横祸',
    energy: 'negative' as const
  },
  '叠杯、叠杯、叠杯': {
    sign: '奇签',
    title: '双杯重叠显神迹',
    poem: '双杯重叠显神迹，天机玄妙不可测；神明有意示玄机，静心领悟得真谛。',
    meaning: '神明特别关注，需要仔细领悟',
    energy: 'positive' as const
  }
};

// 创建种子随机数生成器
function createSeededRandom(seed: number) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// 生成单个筊杯结果
function generateSingleJiaoBei(question: JiaoBeiQuestion, throwIndex: number): JiaoBeiResult {
  const random = createSeededRandom(question.timestamp + throwIndex);
  const rand = random();
  
  // 立杯概率极低（0.5%）- 传统上极为罕见
  if (rand < 0.005) {
    return '立杯';
  }
  
  // 叠杯概率极低（0.3%）- 传统上极为罕见
  if (rand < 0.008) {
    return '叠杯';
  }
  
  // 圣杯45%，笑杯35%，阴杯20% - 更符合传统概率
  if (rand < 0.45) {
    return '圣杯';
  } else if (rand < 0.8) {
    return '笑杯';
  } else {
    return '阴杯';
  }
}

// 生成筊杯组合结果
export function generateJiaoBeiResult(question: JiaoBeiQuestion): JiaoBeiCombination {
  // 传统筊杯需要投掷三次
  const first = generateSingleJiaoBei(question, 1);
  const second = generateSingleJiaoBei(question, 2);
  const third = generateSingleJiaoBei(question, 3);
  
  const combination = `${first}、${second}、${third}`;
  const traditionalData = TRADITIONAL_SIGNS[combination as keyof typeof TRADITIONAL_SIGNS];
  
  if (!traditionalData) {
    // 如果没有找到对应的传统签文，使用默认解读
    return {
      first,
      second,
      third,
      combination,
      meaning: '此组合暂无传统解读，请以虔诚之心理解神明的指引。',
      advice: '保持虔诚，静心思考，神明自有安排。',
      energy: 'neutral',
      category: question.category,
      traditionalSign: '未知',
      traditionalPoem: '传统签文暂缺'
    };
  }
  
  return {
    first,
    second,
    third,
    combination,
    meaning: traditionalData.meaning,
    advice: getAdviceByEnergy(traditionalData.energy, question.category),
    energy: traditionalData.energy,
    category: question.category,
    traditionalSign: traditionalData.sign,
    traditionalPoem: traditionalData.poem
  };
}

// 根据三次投掷结果生成组合
export function generateJiaoBeiResultFromThrows(question: JiaoBeiQuestion, throwResults: string[]): JiaoBeiCombination {
  if (throwResults.length !== 3) {
    throw new Error('筊杯占卜需要三次投掷结果');
  }
  
  const [first, second, third] = throwResults as [JiaoBeiResult, JiaoBeiResult, JiaoBeiResult];
  const combination = `${first}、${second}、${third}`;
  const traditionalData = TRADITIONAL_SIGNS[combination as keyof typeof TRADITIONAL_SIGNS];
  
  if (!traditionalData) {
    // 如果没有找到对应的传统签文，使用默认解读
    return {
      first,
      second,
      third,
      combination,
      meaning: '此组合暂无传统解读，请以虔诚之心理解神明的指引。',
      advice: '保持虔诚，静心思考，神明自有安排。',
      energy: 'neutral',
      category: question.category,
      traditionalSign: '未知',
      traditionalPoem: '传统签文暂缺'
    };
  }
  
  return {
    first,
    second,
    third,
    combination,
    meaning: traditionalData.meaning,
    advice: getAdviceByEnergy(traditionalData.energy, question.category),
    energy: traditionalData.energy,
    category: question.category,
    traditionalSign: traditionalData.sign,
    traditionalPoem: traditionalData.poem
  };
}

// 根据能量和分类生成建议
function getAdviceByEnergy(energy: 'positive' | 'neutral' | 'negative', category: string): string {
  const adviceMap = {
    positive: {
      '事业': '事业运势良好，可大胆进取，贵人相助。',
      '感情': '感情运势顺遂，桃花运旺，可主动追求。',
      '健康': '身体健康，精神饱满，适合运动锻炼。',
      '学业': '学业进步，思维清晰，考试顺利。',
      '财运': '财运亨通，投资有利，收入增加。',
      '其他': '运势良好，诸事顺遂，可积极行动。'
    },
    neutral: {
      '事业': '事业平稳发展，需要耐心等待时机。',
      '感情': '感情平淡，需要用心经营，保持耐心。',
      '健康': '身体状况一般，注意保养，规律作息。',
      '学业': '学业进展平稳，需要更加努力。',
      '财运': '财运平稳，量入为出，避免冒险。',
      '其他': '运势平稳，保持现状，静待时机。'
    },
    negative: {
      '事业': '事业遇到阻碍，需要谨慎行事，避免冲突。',
      '感情': '感情有波折，需要包容理解，避免争吵。',
      '健康': '身体状况欠佳，需要及时调理，注意休息。',
      '学业': '学业有困难，需要加倍努力，寻求帮助。',
      '财运': '财运不佳，避免投资，节约开支。',
      '其他': '运势不佳，诸事谨慎，避免冒险。'
    }
  };
  
  return adviceMap[energy][category as keyof typeof adviceMap.positive] || adviceMap[energy]['其他'];
}

// 生成个性化解读
export function generateInterpretation(combination: JiaoBeiCombination, question: JiaoBeiQuestion): JiaoBeiInterpretation {
  const traditionalData = TRADITIONAL_SIGNS[combination.combination as keyof typeof TRADITIONAL_SIGNS];
  
  return {
    personalizedAdvice: generatePersonalizedAdvice(combination, question),
    luckyElements: getLuckyElements(combination.energy, question.category),
    warnings: getWarnings(combination.energy, question.category),
    timing: getTimingAdvice(combination),
    traditionalMeaning: traditionalData ? traditionalData.meaning : '传统解读暂缺'
  };
}

// 生成个性化建议
function generatePersonalizedAdvice(combination: JiaoBeiCombination, question: JiaoBeiQuestion): string {
  const baseAdvice = combination.advice;
  const traditionalPoem = combination.traditionalPoem;
  const userQuestion = question.content;
  const category = question.category;
  
  // 根据用户具体问题生成针对性建议
  let personalizedAdvice = '';
  
  // 分析用户问题中的关键词
  const questionLower = userQuestion.toLowerCase();
  
  if (category === '感情') {
    if (questionLower.includes('分手') || questionLower.includes('离婚') || questionLower.includes('复合')) {
      personalizedAdvice = `关于您提到的${userQuestion.includes('分手') ? '分手' : userQuestion.includes('离婚') ? '离婚' : '复合'}问题，`;
    } else if (questionLower.includes('桃花') || questionLower.includes('恋爱') || questionLower.includes('结婚')) {
      personalizedAdvice = `关于您的${userQuestion.includes('桃花') ? '桃花运' : userQuestion.includes('恋爱') ? '恋爱' : '婚姻'}问题，`;
    } else {
      personalizedAdvice = `关于您的感情问题"${userQuestion}"，`;
    }
  } else if (category === '事业') {
    if (questionLower.includes('工作') || questionLower.includes('跳槽') || questionLower.includes('升职')) {
      personalizedAdvice = `关于您的${userQuestion.includes('工作') ? '工作' : userQuestion.includes('跳槽') ? '跳槽' : '升职'}问题，`;
    } else if (questionLower.includes('创业') || questionLower.includes('投资') || questionLower.includes('合作')) {
      personalizedAdvice = `关于您的${userQuestion.includes('创业') ? '创业' : userQuestion.includes('投资') ? '投资' : '合作'}问题，`;
    } else {
      personalizedAdvice = `关于您的事业问题"${userQuestion}"，`;
    }
  } else if (category === '财运') {
    if (questionLower.includes('投资') || questionLower.includes('理财') || questionLower.includes('股票')) {
      personalizedAdvice = `关于您的${userQuestion.includes('投资') ? '投资' : userQuestion.includes('理财') ? '理财' : '股票'}问题，`;
    } else if (questionLower.includes('买房') || questionLower.includes('买车') || questionLower.includes('消费')) {
      personalizedAdvice = `关于您的${userQuestion.includes('买房') ? '买房' : userQuestion.includes('买车') ? '买车' : '消费'}问题，`;
    } else {
      personalizedAdvice = `关于您的财运问题"${userQuestion}"，`;
    }
  } else if (category === '健康') {
    if (questionLower.includes('疾病') || questionLower.includes('治疗') || questionLower.includes('手术')) {
      personalizedAdvice = `关于您的${userQuestion.includes('疾病') ? '疾病' : userQuestion.includes('治疗') ? '治疗' : '手术'}问题，`;
    } else if (questionLower.includes('锻炼') || questionLower.includes('减肥') || questionLower.includes('养生')) {
      personalizedAdvice = `关于您的${userQuestion.includes('锻炼') ? '锻炼' : userQuestion.includes('减肥') ? '减肥' : '养生'}问题，`;
    } else {
      personalizedAdvice = `关于您的健康问题"${userQuestion}"，`;
    }
  } else if (category === '学业') {
    if (questionLower.includes('考试') || questionLower.includes('学习') || questionLower.includes('升学')) {
      personalizedAdvice = `关于您的${userQuestion.includes('考试') ? '考试' : userQuestion.includes('学习') ? '学习' : '升学'}问题，`;
    } else if (questionLower.includes('考研') || questionLower.includes('留学') || questionLower.includes('专业')) {
      personalizedAdvice = `关于您的${userQuestion.includes('考研') ? '考研' : userQuestion.includes('留学') ? '留学' : '专业选择'}问题，`;
    } else {
      personalizedAdvice = `关于您的学业问题"${userQuestion}"，`;
    }
  } else {
    personalizedAdvice = `关于您的问题"${userQuestion}"，`;
  }
  
  // 根据筊杯结果和能量给出具体建议
  if (combination.energy === 'positive') {
    personalizedAdvice += `神明给予积极的指引。${baseAdvice} 建议您保持信心，积极行动。`;
  } else if (combination.energy === 'neutral') {
    personalizedAdvice += `神明建议您保持耐心。${baseAdvice} 需要您谨慎考虑，稳中求进。`;
  } else {
    personalizedAdvice += `神明提醒您需要谨慎。${baseAdvice} 建议您重新审视，避免冲动。`;
  }
  
  return `${personalizedAdvice}

传统签文：${traditionalPoem}

请以虔诚之心理解神明的指引，结合自身情况做出明智的选择。`;
}

// 获取幸运元素
function getLuckyElements(energy: string, category: string): string {
  const elements = {
    positive: {
      '事业': '贵人相助、机遇良多、贵人运旺',
      '感情': '桃花运旺、缘分深厚、感情和谐',
      '健康': '身体康健、精神饱满、活力充沛',
      '学业': '思维清晰、学习进步、考试顺利',
      '财运': '财运亨通、投资有利、收入增加',
      '其他': '诸事顺遂、贵人相助、机遇良多'
    },
    neutral: {
      '事业': '平稳发展、稳中求进、循序渐进',
      '感情': '平淡是真、细水长流、用心经营',
      '健康': '保养得当、规律作息、适度运动',
      '学业': '稳扎稳打、循序渐进、厚积薄发',
      '财运': '量入为出、稳健理财、避免冒险',
      '其他': '平稳发展、静待时机、稳中求进'
    },
    negative: {
      '事业': '谨慎行事、避免冲突、寻求帮助',
      '感情': '包容理解、避免争吵、用心沟通',
      '健康': '及时调理、注意休息、寻求医疗',
      '学业': '加倍努力、寻求帮助、调整方法',
      '财运': '节约开支、避免投资、稳健理财',
      '其他': '谨慎行事、避免冒险、寻求帮助'
    }
  };
  
  return elements[energy as keyof typeof elements][category as keyof typeof elements.positive] || elements[energy as keyof typeof elements]['其他'];
}

// 获取注意事项
function getWarnings(energy: string, category: string): string {
  const warnings = {
    positive: {
      '事业': '虽然运势良好，但不可骄傲自满，仍需努力。',
      '感情': '桃花运旺时要注意专一，避免感情纠葛。',
      '健康': '身体好时也要注意保养，不可过度劳累。',
      '学业': '学习顺利时不可松懈，要继续努力。',
      '财运': '财运好时不可贪心，要理性投资。',
      '其他': '运势好时不可得意忘形，要保持谦逊。'
    },
    neutral: {
      '事业': '平稳时期要耐心等待，不可急于求成。',
      '感情': '平淡时期要用心经营，不可忽视感情。',
      '健康': '身体状况一般时要及时调理，不可忽视。',
      '学业': '学习平稳时要更加努力，不可满足现状。',
      '财运': '财运平稳时要量入为出，不可冒险。',
      '其他': '平稳时期要保持耐心，不可急躁。'
    },
    negative: {
      '事业': '遇到阻碍时要谨慎行事，避免冲突。',
      '感情': '感情波折时要包容理解，避免争吵。',
      '健康': '身体欠佳时要及时调理，不可拖延。',
      '学业': '学习困难时要寻求帮助，不可放弃。',
      '财运': '财运不佳时要节约开支，避免投资。',
      '其他': '运势不佳时要谨慎行事，避免冒险。'
    }
  };
  
  return warnings[energy as keyof typeof warnings][category as keyof typeof warnings.positive] || warnings[energy as keyof typeof warnings]['其他'];
}

// 获取时机建议
function getTimingAdvice(combination: JiaoBeiCombination): string {
  const traditionalData = TRADITIONAL_SIGNS[combination.combination as keyof typeof TRADITIONAL_SIGNS];
  
  if (!traditionalData) {
    return '时机需要根据具体情况判断，保持虔诚之心。';
  }
  
  // 根据传统签文中的时机提示
  const timingHints = {
    '上签': '时机极佳，可大胆行动',
    '上吉': '时机良好，适合行动',
    '中吉': '时机尚可，谨慎行动',
    '中平': '时机一般，需要等待',
    '下下': '时机不佳，需要等待',
    '衰签': '时机极差，需要等待'
  };
  
  return timingHints[traditionalData.sign as keyof typeof timingHints] || '时机需要根据具体情况判断';
}

// 获取筊杯表情符号
export function getJiaoBeiEmoji(result: JiaoBeiResult): string {
  const emojiMap = {
    '圣杯': '🙏',
    '笑杯': '😊',
    '阴杯': '😔',
    '立杯': '⚡',
    '叠杯': '🥤'
  };
  return emojiMap[result] || '🥤';
}

// 获取筊杯样式
export function getJiaoBeiStyle(result: JiaoBeiResult): string {
  const styleMap = {
    '圣杯': 'border-green-500 bg-green-50 text-green-800',
    '笑杯': 'border-yellow-500 bg-yellow-50 text-yellow-800',
    '阴杯': 'border-red-500 bg-red-50 text-red-800',
    '立杯': 'border-purple-500 bg-purple-50 text-purple-800',
    '叠杯': 'border-blue-500 bg-blue-50 text-blue-800'
  };
  return styleMap[result] || 'border-gray-500 bg-gray-50 text-gray-800';
}

// 获取能量样式
export function getEnergyStyle(energy: string): string {
  const styleMap = {
    'positive': 'border-green-500 bg-green-50 text-green-800',
    'neutral': 'border-yellow-500 bg-yellow-50 text-yellow-800',
    'negative': 'border-red-500 bg-red-50 text-red-800'
  };
  return styleMap[energy as keyof typeof styleMap] || 'border-gray-500 bg-gray-50 text-gray-800';
} 