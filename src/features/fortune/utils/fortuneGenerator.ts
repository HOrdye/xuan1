import type { 
  FortuneResult, 
  FortuneRequest, 
  LuckyElements,
  DailyChallenge,
  PersonalizedFortuneData,
  FortuneLevel
} from '../types/fortune';
import { LLMService } from '../../../services/LLMService';

// 运势等级描述，混合专业性和趣味性
const LEVEL_DESCRIPTIONS: Record<FortuneLevel, string[]> = {
  excellent: [
    '运势爆棚！紫气东来✨', 
    '欧皇附体，天时地利人和', 
    '今日主角光环加持，诸事皆宜'
  ],
  good: [
    '吉星高照，运势在线', 
    '福气加持，状态不错', 
    '好运来袭，干啥啥顺'
  ],
  normal: [
    '平稳运势，佛系日常', 
    '中规中矩，随缘就好', 
    '平平淡淡才是真，佛系度过一整天'
  ],
  bad: [
    '小人星动，需谨慎破解', 
    '破财星临，建议躺平充电', 
    '倒霉星附体，先冷静一下'
  ],
  terrible: [
    '太岁当头，建议闭关修炼', 
    '诸事不宜，先开摆为敬', 
    '今日建议重启系统，避免出bug'
  ]
};

// 更多样化的幸运颜色选项
const LUCKY_COLORS = [
  '红色', '橙色', '黄色', '绿色', '蓝色', '紫色', '粉色', '白色', '黑色', '金色',
  '银色', '棕色', '青色', '灰色', '米色', '天蓝色', '玫红色', '墨绿色', '浅紫色', '香槟色',
  '孔雀蓝', '翡翠绿', '宝石红', '钴蓝', '柠檬黄', '薰衣草紫', '珊瑚橙', '蜜桃粉', '淡青色', '玫瑰金'
];

// 更多样化的幸运方位选项
const LUCKY_DIRECTIONS = [
  '东', '南', '西', '北', '东南', '东北', '西南', '西北',
  '正东', '正南', '正西', '正北', '东偏南', '东偏北', '西偏南', '西偏北',
  '内城区', '外城区', '沿海地区', '山区', '高地', '低洼处', '向阳地', '背阴处'
];

// 各方面运势的建议库
const FORTUNE_ADVICE: Record<string, Record<FortuneLevel, string[]>> = {
  career: {
    excellent: [
      '贵人运旺盛，职场大杀四方',
      '文昌星闪耀，摸鱼都能被夸',
      '今天干啥啥顺利，老板都夸好'
    ],
    good: [
      '事业稳步上升，继续保持',
      '工作节奏在线，摸鱼要适度',
      '职场人缘不错，多交流有惊喜'
    ],
    normal: [
      '工作平稳，摸鱼要适可而止',
      '职场社交正常，保持队形别浪',
      '日常工作顺利，但别太放飞自我'
    ],
    bad: [
      '小心职场暗坑，谨慎发言',
      '今日不宜重要决策，建议苟着',
      '工作易出岔子，多检查多备份'
    ],
    terrible: [
      '今日宜摆烂，暂避职场风波',
      '诸事不宜冲动，建议闭关修炼',
      '工位风水犯太岁，远程办公为上'
    ]
  },
  wealth: {
    excellent: [
      '财神眷顾，理财投资都吉利',
      '偏财运旺，意外之财在路上',
      '今天花钱都能赚到钱，是真欧皇'
    ],
    good: [
      '财运稳健，适合理性投资',
      '小富即安，量力而行最重要',
      '钱包喜提充能，注意要量入为出'
    ],
    normal: [
      '财运平平，该赚赚该花花',
      '收支平衡，理性消费为上',
      '钱包日常，不会空但也不会满'
    ],
    bad: [
      '破财星动，剁手需谨慎',
      '今日不宜大额消费，钱包要静养',
      '容易冲动消费，管住剁手的手'
    ],
    terrible: [
      '破财星当头，建议开启省钱模式',
      '钱包已经罢工，速速开启节约术',
      '今日不宜花钱，囤货需谨慎'
    ]
  },
  love: {
    excellent: [
      '桃花运旺盛，脱单有望',
      '月老牵线中，缘分在靠近',
      '今天恋爱运满格，冲鸭！'
    ],
    good: [
      '桃花朵朵开，恋爱运在线',
      '感情有好兆头，保持真诚',
      '暧昧有进展，继续加油'
    ],
    normal: [
      '感情平稳，随缘最重要',
      '暧昧期继续，保持耐心',
      '单身也快乐，不急不躁'
    ],
    bad: [
      '情感易起波澜，保持理性',
      '今日不宜表白，先观察观察',
      '暧昧需谨慎，容易产生误会'
    ],
    terrible: [
      '今日感情事事休，先专注自我',
      '桃花劫在即，建议闭关修炼',
      '不宜谈情说爱，先充实自己'
    ]
  },
  health: {
    excellent: [
      '精力充沛，活力满满',
      '气血双补，状态在线',
      '今天元气满满，干啥都有劲'
    ],
    good: [
      '身体状态不错，适度运动',
      '作息规律，保持健康',
      '活力值在线，继续保持'
    ],
    normal: [
      '身体状态一般，别太操劳',
      '注意休息，保持活力',
      '该运动运动，该休息休息'
    ],
    bad: [
      '易感疲惫，需要及时充电',
      '注意身体，多休息少熬夜',
      '今日容易犯困，记得补充能量'
    ],
    terrible: [
      '今日体力值耗尽，需要充能',
      '健康预警，建议闭关修养',
      '不宜熬夜，早点休息为上'
    ]
  }
};

// 每日建议模板库
const DAILY_ADVICE: [string[], string[], string[]] = [
  // 宜做的事
  [
    '早起冲杯手冲咖啡，提升今日运势',
    '整理工位，布置开运小物件',
    '刷刷小红书，找找灵感和能量',
    '和好友来一把游戏，放松心情',
    '尝试新的健身APP，充能补血',
    '整理心情，发条朋友圈记录生活',
    '学习新技能，提升自我属性',
    '给自己买个小礼物，提升心情值'
  ],
  // 不宜做的事
  [
    '熬夜爆肝，容易破财又伤身',
    '剁手冲动消费，钱包会破产',
    '对工作摆烂，会被老板盯上',
    '跳过早餐，容易一整天没状态',
    '一个人憋着情绪不说，容易内耗',
    '刷短视频到深夜，影响运势',
    '见人就吐槽，容易招来小人',
    '囤货不使用，会带来霉运'
  ],
  // 每日箴言
  [
    '今天也要元气满满，和生活碰个杯🍻',
    '人生就要多尝试，说不定就遇到好事了',
    '机会总是青睐有准备的人，继续加油',
    '平平淡淡才是真，佛系也是一种生活态度',
    '今天的你也在努力生活呢，给自己一个大大的拥抱',
    '不要着急，好运就在下一个路口',
    '人生就像抽卡游戏，总有欧皇时刻',
    '保持热爱，奇迹自然发生'
  ]
];

// 每日挑战模板库
const DAILY_CHALLENGES: string[] = [
  '尝试一个新的健身动作或运动',
  '学习一个工作技能或兴趣爱好',
  '主动认识一个新朋友',
  '清理手机或电脑的存储空间',
  '整理一下杂乱的工作区域',
  '给自己制定一个小目标',
  '尝试一家新店或新美食',
  '写下今天的心情或感悟'
];

// 挑战提示
const CHALLENGE_TIPS: string[] = [
  '循序渐进，一步步来就好',
  '相信自己，你比想象中更强大',
  '遇到困难可以寻求帮助',
  '记录过程，未来回看会很有趣',
  '给自己设定合理的目标',
  '失败也是成长的一部分',
  '享受挑战的过程',
  '每个人都是自己人生的主角'
];

// 每日机遇模板库
const DAILY_OPPORTUNITIES: string[] = [
  '可能遇到志同道合的朋友',
  '工作上可能有意外惊喜',
  '可能收到好消息或好运',
  '可能遇到意外的发展机会',
  '可能得到前辈或贵人指点',
  '可能发现新的兴趣爱好',
  '可能获得额外的收入',
  '可能遇到解决困扰的方法'
];

// 机遇提示
const OPPORTUNITY_TIPS: string[] = [
  '保持开放的心态迎接机会',
  '准备好自己，机会随时来临',
  '把握当下，不要犹豫太久',
  '相信自己的直觉和判断',
  '勇于尝试新的可能性',
  '保持积极乐观的态度',
  '多和他人交流互动',
  '对生活保持好奇心'
];

export async function generateFortune(personalData: PersonalizedFortuneData, useAI: boolean = true): Promise<FortuneResult> {
  try {
    console.log('🔮 开始生成运势...', personalData, '使用AI:', useAI);
    
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    // 构建运势请求参数
    const request: FortuneRequest = {
      birthDate: personalData.birthDate?.toISOString().split('T')[0],
      gender: personalData.gender,
      zodiacSign: personalData.zodiac?.sign,
      constellation: personalData.constellation?.name,
      question: personalData.question
    };
    
    console.log('📝 运势请求参数:', request);
    
    // 根据useAI参数决定使用哪种生成方式
    if (useAI) {
      // 尝试使用AI增强的运势生成
      try {
        console.log('🤖 尝试使用AI增强运势分析...');
        const result = await FortuneGenerator.generateFortuneWithAI(request);
        result.date = dateString; // 更新日期
        console.log('✅ AI运势生成完成:', result);
        return result;
      } catch (error) {
        console.warn('⚠️ AI运势分析失败，回退到基础运势:', error);
        // 如果AI失败，使用基础运势生成
        const result = FortuneGenerator.generateFortune(request);
        result.date = dateString; // 更新日期
        console.log('✅ 基础运势生成完成:', result);
        return result;
      }
    } else {
      // 直接使用快速本地算法
      console.log('⚡ 使用快速分析模式...');
    const result = FortuneGenerator.generateFortune(request);
      result.date = dateString; // 更新日期
      console.log('✅ 快速运势生成完成:', result);
      return result;
    }
  } catch (error) {
    console.error('❌ 生成运势失败:', error);
    // 返回默认运势
    return getDefaultFortune();
  }
}

/**
 * 从日期获取生肖
 */
function getZodiacFromDate(dateString: string): string {
  const year = new Date(dateString).getFullYear();
  const zodiacSigns = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  const zodiacIndex = (year - 4) % 12;
  return zodiacSigns[zodiacIndex];
}

/**
 * 从日期获取星座
 */
function getConstellationFromDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const constellations = [
    { name: '水瓶座', start: [1, 20], end: [2, 18] },
    { name: '双鱼座', start: [2, 19], end: [3, 20] },
    { name: '白羊座', start: [3, 21], end: [4, 19] },
    { name: '金牛座', start: [4, 20], end: [5, 20] },
    { name: '双子座', start: [5, 21], end: [6, 21] },
    { name: '巨蟹座', start: [6, 22], end: [7, 22] },
    { name: '狮子座', start: [7, 23], end: [8, 22] },
    { name: '处女座', start: [8, 23], end: [9, 22] },
    { name: '天秤座', start: [9, 23], end: [10, 23] },
    { name: '天蝎座', start: [10, 24], end: [11, 22] },
    { name: '射手座', start: [11, 23], end: [12, 21] },
    { name: '摩羯座', start: [12, 22], end: [1, 19] }
  ];
  
  for (const constellation of constellations) {
    const [startMonth, startDay] = constellation.start;
    const [endMonth, endDay] = constellation.end;
    
    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay) ||
      (startMonth > endMonth && (month === startMonth || month === endMonth))
    ) {
      return constellation.name;
    }
  }
  
  return '摩羯座'; // 默认
}

/**
 * 获取默认运势（当生成失败时使用）
 */
function getDefaultFortune(): FortuneResult {
  const today = new Date().toISOString().split('T')[0];
  
  return {
    date: today,
    overall: {
      level: 'good' as FortuneLevel,
      description: '运势良好',
      energyScore: 75,
      energyDescription: '运势良好，继续保持'
    },
      career: {
      level: 'good' as FortuneLevel,
        description: '工作顺利',
      energyScore: 70,
      energyDescription: '工作状态不错'
      },
      wealth: {
      level: 'normal' as FortuneLevel,
        description: '财运平稳',
      energyScore: 65,
      energyDescription: '理性消费为主'
      },
      love: {
      level: 'good' as FortuneLevel,
        description: '感情和谐',
      energyScore: 80,
      energyDescription: '桃花运不错'
      },
      health: {
      level: 'excellent' as FortuneLevel,
        description: '身体健康',
      energyScore: 85,
      energyDescription: '活力满满'
    },
    tips: {
      do: ['保持积极乐观的心态', '适当休息，劳逸结合'],
      dont: ['熬夜伤身', '过度消费']
    },
    luckyElements: {
      color: '蓝色',
      number: 7,
      direction: '东'
    },
    zodiac: {
      sign: '未知',
      element: '未知',
      luckyColor: '蓝色'
    },
    aspects: {
      career: { score: 70, description: '工作顺利' },
      wealth: { score: 65, description: '财运平稳' },
      love: { score: 80, description: '感情和谐' },
      health: { score: 85, description: '身体健康' }
    },
    advice: [
      '保持积极乐观的心态',
      '适当休息，劳逸结合',
      '关注身边人的需要'
    ],
    dailyChallenge: {
      type: 'challenge',
      content: '尝试一个新的运动',
      tips: '循序渐进，一步步来',
      difficulty: 'easy',
      isUnlocked: false
    },
    dailyOpportunity: {
      type: 'opportunity',
      content: '可能遇到新朋友',
      tips: '保持开放的心态',
      difficulty: 'easy',
      isUnlocked: false
    }
  };
}

export class FortuneGenerator {
  private static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static getRandomElements<T>(array: T[], count: number): T[] {
    // 返回不重复的随机元素
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private static generateAspectScore(): number {
    return this.getRandomInt(40, 95);
  }

  private static getLevelFromScore(score: number): 'excellent' | 'good' | 'normal' | 'bad' | 'terrible' {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'normal';
    if (score >= 30) return 'bad';
    return 'terrible';
  }

  private static generateAspectFortune(aspect: 'career' | 'wealth' | 'love' | 'health'): {
    score: number;
    level: 'excellent' | 'good' | 'normal' | 'bad' | 'terrible';
    description: string;
    suggestion: string;
  } {
    const score = this.generateAspectScore();
    const level = this.getLevelFromScore(score);
    const descriptions = LEVEL_DESCRIPTIONS[level];
    
    // 使用指定方面的建议库
    const suggestions = FORTUNE_ADVICE[aspect][level];
    
    return {
      score,
      level,
      description: this.getRandomElement(descriptions),
      suggestion: this.getRandomElement(suggestions)
    };
  }

  private static generateLuckyNumbers(): number[] {
    const numbers: number[] = [];
    // 产生更多的幸运数字
    const count = this.getRandomInt(3, 5);
    
    while (numbers.length < count) {
      const num = this.getRandomInt(1, 99);
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    return numbers.sort((a, b) => a - b);
  }

  private static generateLuckyColors(): string[] {
    // 返回3-4个不同的幸运颜色
    const count = this.getRandomInt(3, 4);
    return this.getRandomElements(LUCKY_COLORS, count);
  }

  private static generateLuckyDirections(): string[] {
    // 返回2-3个不同的幸运方位
    const count = this.getRandomInt(2, 3);
    return this.getRandomElements(LUCKY_DIRECTIONS, count);
  }

  private static generateAdvice(): string[] {
    // 生成更丰富的建议，从不同类别中抽取
    const result: string[] = [];
    
    // 从通用建议中抽取1-2条
    const generalCount = this.getRandomInt(1, 2);
    result.push(...this.getRandomElements(DAILY_ADVICE[0], generalCount));
    
    // 从其他类别中抽取建议（修复索引错误）
    const availableCategories = [1, 2]; // 只访问存在的索引：1(不宜做的事), 2(每日箴言)
    const selectedCategories = this.getRandomElements(availableCategories, 1);
    
    selectedCategories.forEach(category => {
      if (DAILY_ADVICE[category] && DAILY_ADVICE[category].length > 0) {
      result.push(this.getRandomElement(DAILY_ADVICE[category]));
      }
    });
    
    // 如果结果太少，补充一些通用建议
    if (result.length < 3) {
      result.push(...this.getRandomElements(DAILY_ADVICE[0], 3 - result.length));
    }
    
    return result.slice(0, 5); // 最多返回5条建议
  }

  /**
   * 生成每日挑战
   */
  private static generateDailyChallenge(): DailyChallenge {
    return {
      type: 'challenge',
      content: this.getRandomElement(DAILY_CHALLENGES),
      tips: this.getRandomElement(CHALLENGE_TIPS),
      difficulty: this.getRandomElement(['easy', 'medium', 'hard']),
      isUnlocked: false
    };
  }

  /**
   * 生成每日机遇
   */
  private static generateDailyOpportunity(): DailyChallenge {
    return {
      type: 'opportunity',
      content: this.getRandomElement(DAILY_OPPORTUNITIES),
      tips: this.getRandomElement(OPPORTUNITY_TIPS),
      difficulty: this.getRandomElement(['easy', 'medium', 'hard']),
      isUnlocked: false
    };
  }

  /**
   * 生成运势，集成LLM分析
   */
  public static async generateFortuneWithAI(request: FortuneRequest): Promise<FortuneResult> {
    const basicFortune = this.generateFortune(request);
    const today = new Date();
    
    try {
      console.log('🤖 开始生成AI增强运势...', request);
      
      // 如果有生日等个人信息，尝试获取AI分析
      if (request.birthDate && request.zodiacSign) {
        try {
          console.log('🧠 调用LLM进行个性化分析...');
          
          const aiAnalysis = await LLMService.getFortuneAnalysis(
            request.birthDate,
            request.gender || 'male',
            request.zodiacSign,
            request.constellation || '',
            request.question || ''
          );
          
          console.log('✅ AI分析完成');
          
          // 使用新的AI解析器整合AI分析结果
          const enhancedFortune = this.parseAIAnalysis(aiAnalysis, basicFortune);
          
          return {
            ...enhancedFortune,
            date: today.toISOString().split('T')[0],
            dailyChallenge: this.generateDailyChallenge(),
            dailyOpportunity: this.generateDailyOpportunity()
          };
        } catch (error) {
          console.warn('⚠️ AI分析失败，使用基础运势:', error);
        }
      }
      
      return {
        ...basicFortune,
        date: today.toISOString().split('T')[0],
        dailyChallenge: this.generateDailyChallenge(),
        dailyOpportunity: this.generateDailyOpportunity()
      };
    } catch (error) {
      console.error('❌ 运势生成失败:', error);
      throw error;
    }
  }
  
  /**
   * 解析AI分析结果并整合到运势数据中（健壮性升级）
   */
  private static parseAIAnalysis(aiAnalysis: string, basicFortune: FortuneResult): FortuneResult {
    try {
      console.log('🔍 开始解析AI分析结果...');
      let jsonStr = aiAnalysis;
      // 1. 优先提取```json代码块
      const jsonMatch = aiAnalysis.match(/```json[\s\S]*?({[\s\S]*?})[\s\S]*?```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      } else {
        // 2. 提取第一个大括号包围的内容
        const braceMatch = aiAnalysis.match(/\{[\s\S]*\}/);
        if (braceMatch) {
          jsonStr = braceMatch[0];
        } else {
          // 3. 尝试去除多余前后缀，只保留JSON部分
          const firstBrace = aiAnalysis.indexOf('{');
          const lastBrace = aiAnalysis.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            jsonStr = aiAnalysis.slice(firstBrace, lastBrace + 1);
          }
        }
      }
      // 4. 尝试修复常见JSON格式问题
      jsonStr = jsonStr.replace(/\n/g, '\\n').replace(/\t/g, '');
      // 5. 尝试解析
      let aiData: any = {};
      try {
        aiData = JSON.parse(jsonStr);
      } catch (err) {
        // 6. 尝试用eval兜底（极端情况）
        try {
          // eslint-disable-next-line no-eval
          aiData = eval('(' + jsonStr + ')');
        } catch (e2) {
          throw new Error('AI JSON解析失败，已降级为原文');
        }
      }
      console.log('✅ AI数据解析成功:', aiData);
      // 7. 只用能解析出来的字段，缺失字段用本地默认
      const safe = (v: any, def: any) => (v !== undefined && v !== null ? v : def);
      const enhancedFortune: FortuneResult = {
        ...basicFortune,
        overall: {
          level: this.mapAILevelToFortuneLevel(safe(aiData.overall?.level, basicFortune.overall.level)),
          description: safe(aiData.overall?.description, basicFortune.overall.description),
          energyScore: safe(aiData.overall?.score, basicFortune.overall.energyScore),
          energyDescription: safe(aiData.overall?.analysis, basicFortune.overall.energyDescription)
        },
        career: {
          level: this.mapAILevelToFortuneLevel(safe(aiData.career?.level, basicFortune.career.level)),
          description: safe(aiData.career?.description, basicFortune.career.description),
          energyScore: safe(aiData.career?.score, basicFortune.career.energyScore),
          energyDescription: safe(aiData.career?.analysis, basicFortune.career.energyDescription)
        },
        wealth: {
          level: this.mapAILevelToFortuneLevel(safe(aiData.wealth?.level, basicFortune.wealth.level)),
          description: safe(aiData.wealth?.description, basicFortune.wealth.description),
          energyScore: safe(aiData.wealth?.score, basicFortune.wealth.energyScore),
          energyDescription: safe(aiData.wealth?.analysis, basicFortune.wealth.energyDescription)
        },
        love: {
          level: this.mapAILevelToFortuneLevel(safe(aiData.love?.level, basicFortune.love.level)),
          description: safe(aiData.love?.description, basicFortune.love.description),
          energyScore: safe(aiData.love?.score, basicFortune.love.energyScore),
          energyDescription: safe(aiData.love?.analysis, basicFortune.love.energyDescription)
        },
        health: {
          level: this.mapAILevelToFortuneLevel(safe(aiData.health?.level, basicFortune.health.level)),
          description: safe(aiData.health?.description, basicFortune.health.description),
          energyScore: safe(aiData.health?.score, basicFortune.health.energyScore),
          energyDescription: safe(aiData.health?.analysis, basicFortune.health.energyDescription)
        },
        luckyElements: {
          color: safe(aiData.luckyElements?.colors?.[0], basicFortune.luckyElements.color),
          number: safe(aiData.luckyElements?.numbers?.[0], basicFortune.luckyElements.number),
          direction: safe(aiData.luckyElements?.direction, basicFortune.luckyElements.direction)
        },
        tips: {
          do: safe(aiData.dailyAdvice?.do, basicFortune.tips.do),
          dont: safe(aiData.dailyAdvice?.dont, basicFortune.tips.dont)
        },
        advice: [
          ...(aiData.dailyAdvice?.do || []),
          aiData.dailyAdvice?.special || '',
          ...(aiData.personalizedInsights ? [aiData.personalizedInsights] : [])
        ].filter(Boolean),
        aiAnalysis,
        personalizedTips: aiData.dailyAdvice?.do,
        personalizedInsights: aiData.personalizedInsights,
        questionAnswer: aiData.questionAnswer,
      };
      // 更新aspects
      enhancedFortune.aspects = {
        career: { score: enhancedFortune.career.energyScore || 0, description: enhancedFortune.career.description },
        wealth: { score: enhancedFortune.wealth.energyScore || 0, description: enhancedFortune.wealth.description },
        love: { score: enhancedFortune.love.energyScore || 0, description: enhancedFortune.love.description },
        health: { score: enhancedFortune.health.energyScore || 0, description: enhancedFortune.health.description }
      };
      console.log('🎨 AI数据整合完成，增强运势:', enhancedFortune);
      return enhancedFortune;
    } catch (error) {
      console.warn('⚠️ AI分析结果解析失败，已降级为原文:', error);
      // 解析失败时，至少保存AI分析文本
      return {
        ...basicFortune,
        aiAnalysis,
        advice: [aiAnalysis, ...(basicFortune.advice || [])]
      };
    }
  }
  
  /**
   * 将AI的level映射到FortuneLevel类型
   */
  private static mapAILevelToFortuneLevel(aiLevel: string): FortuneLevel {
    const levelMap: {[key: string]: FortuneLevel} = {
      'excellent': 'excellent',
      'good': 'good',
      'normal': 'normal',
      'bad': 'bad',
      'terrible': 'terrible'
    };
    
    return levelMap[aiLevel] || 'normal';
  }

  public static generateFortune(request: FortuneRequest): FortuneResult {
    const today = new Date();
    
    // 基于request中的信息进行个性化调整
    const birthDateFactor = request.birthDate ? 0.1 : 0;
    const questionFactor = request.question ? 0.05 : 0;
    const zodiacFactor = request.zodiacSign ? 0.08 : 0;
    
    // 通过这些因素微调分数
    const personalizedFactor = birthDateFactor + questionFactor + zodiacFactor;
    
    // 生成整体运势，加入个性化因素
    const baseOverallScore = this.generateAspectScore();
    const overallScore = Math.min(99, Math.round(baseOverallScore * (1 + personalizedFactor)));
    const overallLevel = this.getLevelFromScore(overallScore);
    const overallDescription = this.getRandomElement(LEVEL_DESCRIPTIONS[overallLevel]);

    // 生成各方面运势
    const career = this.generateAspectFortune('career');
    const wealth = this.generateAspectFortune('wealth');
    const love = this.generateAspectFortune('love');
    const health = this.generateAspectFortune('health');

    // 生成幸运信息
    const luckyElements: LuckyElements = {
      color: this.getRandomElement(LUCKY_COLORS),
      number: this.getRandomInt(0, 9),
      direction: this.getRandomElement(LUCKY_DIRECTIONS)
    };

    // 生成建议
    const baseAdvice = this.generateAdvice();
    let advice = [...baseAdvice];
    
    // 如果有问题，添加针对性建议
    if (request.question) {
      const questionLowerCase = request.question.toLowerCase();
      
      if (questionLowerCase.includes('工作') || questionLowerCase.includes('事业')) {
        advice.push(this.getRandomElement(FORTUNE_ADVICE.career[overallLevel]));
      } else if (questionLowerCase.includes('财') || questionLowerCase.includes('钱')) {
        advice.push(this.getRandomElement(FORTUNE_ADVICE.wealth[overallLevel]));
      } else if (questionLowerCase.includes('感情') || questionLowerCase.includes('爱情')) {
        advice.push(this.getRandomElement(FORTUNE_ADVICE.love[overallLevel]));
      } else if (questionLowerCase.includes('健康') || questionLowerCase.includes('身体')) {
        advice.push(this.getRandomElement(FORTUNE_ADVICE.health[overallLevel]));
      }
    }

    return {
      date: today.toISOString().split('T')[0],
      birthday: request.birthDate,
      overall: {
        level: overallLevel,
        description: overallDescription,
        energyScore: overallScore,
        energyDescription: `整体运势 ${overallScore}分，${overallDescription}`
      },
      career: {
        level: career.level,
        description: career.description,
        energyScore: career.score,
        energyDescription: career.suggestion
      },
      wealth: {
        level: wealth.level,
        description: wealth.description,
        energyScore: wealth.score,
        energyDescription: wealth.suggestion
      },
      love: {
        level: love.level,
        description: love.description,
        energyScore: love.score,
        energyDescription: love.suggestion
      },
      health: {
        level: health.level,
        description: health.description,
        energyScore: health.score,
        energyDescription: health.suggestion
      },
      tips: {
        do: this.getRandomElements(DAILY_ADVICE[0], 3),
        dont: this.getRandomElements(DAILY_ADVICE[1], 2)
      },
      story: this.getRandomElement(DAILY_ADVICE[2]),
      luckyElements,
      zodiac: {
        sign: request.zodiacSign || '未知',
        element: '未知',
        luckyColor: luckyElements.color
      },
      aspects: {
        career: { score: career.score, description: career.description },
        wealth: { score: wealth.score, description: wealth.description },
        love: { score: love.score, description: love.description },
        health: { score: health.score, description: health.description }
      },
      advice,
      dailyChallenge: this.generateDailyChallenge(),
      dailyOpportunity: this.generateDailyOpportunity()
    };
  }
} 