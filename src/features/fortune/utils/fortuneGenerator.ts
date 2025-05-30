import type { FortuneResult, FortuneRequest, FortuneAspect, LuckyElements } from '../types/fortune';
import { LLMService } from '../../../services/LLMService';

// 丰富的运势等级描述，增加多样性
const LEVEL_DESCRIPTIONS = {
  excellent: [
    '极佳', '非常好', '特别顺利', '大吉大利', '万事如意',
    '事事顺心', '吉星高照', '福气满满', '势如破竹', '前途光明'
  ],
  good: [
    '良好', '不错', '顺利', '平稳向上', '较为顺遂',
    '整体向好', '颇为有利', '吉祥如意', '机遇不断', '稳步前进'
  ],
  normal: [
    '一般', '平稳', '普通', '中规中矩', '平平常常',
    '不温不火', '有喜有忧', '有得有失', '喜忧参半', '有起有伏'
  ],
  bad: [
    '不佳', '不顺', '需要谨慎', '注意变数', '多有阻碍',
    '困难重重', '多加小心', '谨慎行事', '宜守不宜进', '静待时机'
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
const FORTUNE_ADVICE = {
  career: {
    excellent: [
      '把握当前的黄金机会，大胆提出创新想法',
      '事业发展正值巅峰期，适合大展拳脚',
      '领导能力受到赏识，可争取更多责任',
      '适合开展新项目或接受新挑战',
      '职场人缘极佳，团队协作事半功倍',
      '能力得到充分发挥，成就感满满',
      '工作效率高，能轻松完成目标',
      '适合展示专业能力，提升个人影响力'
    ],
    good: [
      '职场发展稳步向前，保持专注和努力',
      '适合完善专业技能，为晋升做准备',
      '工作关系和谐，沟通顺畅',
      '努力会得到相应回报，坚持是关键',
      '适合巩固现有成果，稳中求进',
      '团队协作顺利，能得到同事支持',
      '保持积极态度，不错过任何机会',
      '工作充满动力，进展顺利'
    ],
    normal: [
      '工作稳定但缺乏亮点，需主动创造价值',
      '职场中保持低调，踏实做事',
      '按部就班完成工作，暂不宜冒进',
      '完善自我，等待机会到来',
      '职场人际关系需要维护，保持友善',
      '适当提升技能，增加竞争力',
      '工作中可能遇到小波折，保持平常心',
      '努力工作，但不要期望立竿见影的效果'
    ],
    bad: [
      '工作中可能面临挑战，需谨慎应对',
      '暂时不适合做重大决策或转变',
      '与同事沟通时注意技巧，避免冲突',
      '做好本职工作，不要轻易尝试新事物',
      '工作压力较大，注意调整心态',
      '可能遇到不公平对待，保持冷静',
      '工作进展受阻，需要耐心等待',
      '职场中需保持低调，避免锋芒毕露'
    ]
  },
  wealth: {
    excellent: [
      '财运亨通，适合投资或理财规划',
      '可能有意外收入或财富增长',
      '投资眼光敏锐，容易找到好机会',
      '收入有明显增长，财务状况改善',
      '可考虑适当扩大投资范围',
      '有偏财运，可能获得额外收益',
      '理财决策正确，回报丰厚',
      '财务状况稳健，可适当冒险'
    ],
    good: [
      '财务状况稳定向好，收支平衡',
      '投资有稳定回报，继续保持',
      '适合制定长期理财计划',
      '收入稳定，可小额投资尝试',
      '理财眼光不错，坚持当前策略',
      '工作努力带来相应回报',
      '财务管理得当，积累持续增长',
      '可能有小额额外收入'
    ],
    normal: [
      '财务状况一般，量入为出',
      '投资需谨慎，避免盲目跟风',
      '收支基本平衡，注意开源节流',
      '适合保守理财，确保资金安全',
      '暂不宜大额消费或投资',
      '理财需稳健，避免冒险',
      '工作收入稳定，但无明显增长',
      '保持当前财务状态，暂不宜改变'
    ],
    bad: [
      '财务状况不佳，需控制支出',
      '投资宜缓行，避免资金损失',
      '可能面临意外支出，注意储备',
      '投资回报不如预期，需调整计划',
      '避免冲动消费，控制欲望',
      '暂缓大额投资决策',
      '财务可能面临压力，提前做好准备',
      '注意资金安全，谨防诈骗或损失'
    ]
  },
  love: {
    excellent: [
      '感情甜蜜和谐，关系更进一步',
      '单身者桃花运旺，易遇良缘',
      '情侣间沟通顺畅，互相理解',
      '适合表白或求婚，成功率高',
      '感情生活充满惊喜和浪漫',
      '夫妻感情升温，恩爱有加',
      '异性缘好，受到关注和青睐',
      '适合参加社交活动，扩展人脉'
    ],
    good: [
      '感情发展良好，关系稳定',
      '单身者有机会遇到心仪对象',
      '情侣间相处融洽，互相支持',
      '适合增进情感交流，加深理解',
      '伴侣关系温馨，共同成长',
      '感情中懂得相互体谅',
      '异性朋友相处自然，有好感',
      '感情中充满信任和尊重'
    ],
    normal: [
      '感情状况一般，平淡中有温馨',
      '单身者桃花不多，需主动一些',
      '情侣间偶有小摩擦，及时沟通',
      '夫妻生活平平，可增加情趣',
      '对感情期望适度，不要着急',
      '感情中需要更多耐心和包容',
      '可能遇到心动的人，但需时间发展',
      '感情需要双方共同维护'
    ],
    bad: [
      '感情可能遇到波折，需耐心处理',
      '单身者桃花较少，暂时专注自我提升',
      '情侣间沟通不畅，易产生误会',
      '感情中不要过于强势或固执',
      '避免感情纠纷，冷静处理矛盾',
      '不适合冲动表白或做重大决定',
      '感情中需要多一些理解和宽容',
      '可能面临情感选择，慎重决定'
    ]
  },
  health: {
    excellent: [
      '身体状况极佳，精力充沛',
      '免疫力强，抵抗力好',
      '作息规律，sleep质量高',
      '饮食健康，营养均衡',
      '运动效果显著，体能提升',
      '心情愉悦，精神状态佳',
      '恢复能力强，疲劳感少',
      '生活充满活力，充满正能量'
    ],
    good: [
      '身体状况良好，精力充足',
      '免疫系统正常，少生病',
      '作息相对规律，休息充分',
      '饮食较为健康，注意营养',
      '保持适量运动，身体灵活',
      '心情较好，压力可控',
      '有些小疲劳，但能及时恢复',
      '整体健康，偶有小不适'
    ],
    normal: [
      '身体状况一般，偶有疲惫',
      '免疫力一般，注意保护',
      '作息不太规律，调整作息',
      '饮食有所不均，注意调整',
      '运动量不足，增加活动',
      '压力较大，注意减压',
      '易感疲劳，需要休息',
      '小问题较多，注意健康管理'
    ],
    bad: [
      '身体状况欠佳，需要休息',
      '抵抗力下降，易感不适',
      '作息紊乱，影响健康',
      '饮食不规律或不健康',
      '缺乏运动，身体僵硬',
      '精神紧张，压力过大',
      '疲劳感明显，恢复慢',
      '注意潜在健康隐患'
    ]
  }
};

// 每日建议模板库，用于生成更丰富的建议
const DAILY_ADVICE = [
  // 通用建议
  [
    '尝试一项新的活动或爱好，激发创造力',
    '花时间阅读一本启发思考的书籍',
    '整理工作或生活空间，提升效率',
    '与久未联系的朋友或家人聊天',
    '制定短期目标，并分解为可行动的步骤',
    '尝试冥想或深呼吸，放松身心',
    '记录三件感恩的事，培养积极心态',
    '提前规划明天的任务，减少压力'
  ],
  // 职业建议
  [
    '主动向主管寻求反馈，了解提升空间',
    '学习一项新的职业技能，增加竞争力',
    '整理工作计划，提高工作效率',
    '与同事建立更紧密的合作关系',
    '参加行业研讨会或线上课程',
    '更新个人简历和职业档案',
    '拓展专业人脉，寻找合作机会',
    '设定明确的职业目标并制定行动计划'
  ],
  // 财务建议
  [
    '检查财务状况，调整预算计划',
    '研究理财知识，提升财商',
    '寻找节约开支的方法，减少浪费',
    '考虑多元化投资，分散风险',
    '制定长期财务目标和储蓄计划',
    '整理账单和收支记录，掌握财务状况',
    '学习税务知识，合理规划纳税',
    '咨询专业理财顾问，获取建议'
  ],
  // 健康建议
  [
    '保证充足睡眠，早睡早起',
    '增加水分摄入，保持身体水分平衡',
    '尝试新的健康食谱，改善饮食结构',
    '进行20-30分钟有氧运动',
    '保持正确坐姿，减少颈椎和腰椎压力',
    '减少屏幕时间，保护视力',
    '尝试舒缓的瑜伽或拉伸运动',
    '定期体检，关注身体变化'
  ],
  // 人际关系建议
  [
    '主动向亲友表达感谢和关爱',
    '学习积极倾听，提升沟通技巧',
    '参加社交活动，扩展人际圈',
    '解决未解决的冲突，修复关系',
    '花时间陪伴重要的人',
    '表达真实感受，避免误解',
    '尊重他人界限，建立健康关系',
    '学习处理冲突的技巧和方法'
  ]
];

export function generateFortune(birthDate?: Date, birthdayString?: string): FortuneResult {
  try {
    console.log('🔮 开始生成运势...', { birthDate, birthdayString });
    
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    // 构建运势请求参数
    const request: FortuneRequest = {
      birthDate: birthdayString || birthDate?.toISOString().split('T')[0],
      gender: undefined, // 可以从用户设置中获取
      zodiacSign: birthdayString ? getZodiacFromDate(birthdayString) : undefined,
      constellation: birthdayString ? getConstellationFromDate(birthdayString) : undefined
    };
    
    console.log('📝 运势请求参数:', request);
    
    // 使用新的FortuneGenerator类生成运势，并添加日期
    const result = FortuneGenerator.generateFortune(request);
    console.log('✅ 运势生成完成:', result);
    
    return {
      date: dateString,
      ...result
    };
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
      score: 75,
      level: 'good',
      description: '运势良好',
      suggestion: '保持积极心态，把握今日机会'
    },
    aspects: {
      career: {
        score: 70,
        level: 'good',
        description: '工作顺利',
        suggestion: '专注当前任务，稳步前进'
      },
      wealth: {
        score: 65,
        level: 'normal',
        description: '财运平稳',
        suggestion: '理性消费，稳健理财'
      },
      love: {
        score: 80,
        level: 'good',
        description: '感情和谐',
        suggestion: '多关心身边的人'
      },
      health: {
        score: 85,
        level: 'excellent',
        description: '身体健康',
        suggestion: '保持良好作息'
      }
    },
    lucky: {
      numbers: [3, 7, 21],
      colors: ['蓝色', '绿色'],
      directions: ['东', '南']
    },
    advice: [
      '保持积极乐观的心态',
      '适当休息，劳逸结合',
      '关注身边人的需要'
    ]
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

  private static getLevelFromScore(score: number): 'excellent' | 'good' | 'normal' | 'bad' {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'normal';
    return 'bad';
  }

  private static generateAspectFortune(aspect: 'career' | 'wealth' | 'love' | 'health'): {
    score: number;
    level: 'excellent' | 'good' | 'normal' | 'bad';
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
    
    // 随机选择2个专项领域，每个领域抽取1条建议
    const categories = [1, 2, 3, 4]; // 对应职业、财务、健康、人际关系
    const selectedCategories = this.getRandomElements(categories, 2);
    
    selectedCategories.forEach(category => {
      result.push(this.getRandomElement(DAILY_ADVICE[category]));
    });
    
    return result;
  }

  /**
   * 生成运势，集成LLM分析
   */
  public static async generateFortuneWithAI(request: FortuneRequest): Promise<FortuneResult> {
    try {
      console.log('🤖 开始生成AI增强运势...', request);
      
      // 先生成基础运势
      const baseFortune = this.generateFortune(request);
      
      // 如果有生日等个人信息，尝试获取AI分析
      if (request.birthDate && request.zodiacSign && request.constellation) {
        try {
          console.log('🧠 调用LLM进行个性化分析...');
          
          const aiAnalysis = await LLMService.getFortuneAnalysis(
            request.birthDate,
            request.gender || 'male',
            request.zodiacSign,
            request.constellation,
            request.question || ''
          );
          
          console.log('✅ AI分析完成');
          
          // 将AI分析结果整合到运势中
          return {
            ...baseFortune,
            aiAnalysis,
            personalizedTips: this.extractTipsFromAIAnalysis(aiAnalysis)
          };
        } catch (error) {
          console.warn('⚠️ AI分析失败，使用基础运势:', error);
        }
      }
      
      return baseFortune;
    } catch (error) {
      console.error('❌ 运势生成失败:', error);
      throw error;
    }
  }
  
  /**
   * 从AI分析中提取个性化建议
   */
  private static extractTipsFromAIAnalysis(aiAnalysis: string): string[] {
    const tips: string[] = [];
    
    // 简单的文本处理，提取建议类内容
    const lines = aiAnalysis.split('\n');
    
    for (const line of lines) {
      const cleanLine = line.trim();
      
      // 查找包含建议性词汇的句子
      if (
        cleanLine.length > 10 &&
        (cleanLine.includes('建议') ||
         cleanLine.includes('适合') ||
         cleanLine.includes('宜') ||
         cleanLine.includes('应该') ||
         cleanLine.includes('可以') ||
         cleanLine.includes('注意'))
      ) {
        // 清理格式字符
        const cleanTip = cleanLine
          .replace(/^[•\-\*\d\.]+\s*/, '')
          .replace(/【.*?】/g, '')
          .trim();
        
        if (cleanTip.length > 5) {
          tips.push(cleanTip);
        }
      }
    }
    
    return tips.slice(0, 5); // 最多返回5条建议
  }

  public static generateFortune(request: FortuneRequest): Omit<FortuneResult, 'date'> {
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
    const aspects = {
      career: this.generateAspectFortune('career'),
      wealth: this.generateAspectFortune('wealth'),
      love: this.generateAspectFortune('love'),
      health: this.generateAspectFortune('health')
    };

    // 生成幸运信息
    const lucky: LuckyElements = {
      numbers: this.generateLuckyNumbers(),
      colors: this.generateLuckyColors(),
      directions: this.generateLuckyDirections()
    };

    // 生成建议，加入问题相关的个性化建议
    const baseAdvice = this.generateAdvice();
    let advice = [...baseAdvice];
    
    // 如果有问题，添加针对性建议
    if (request.question) {
      const questionLowerCase = request.question.toLowerCase();
      
      if (questionLowerCase.includes('工作') || questionLowerCase.includes('事业') || questionLowerCase.includes('职业')) {
        advice.push(this.getRandomElement(FORTUNE_ADVICE.career[overallLevel]));
      } else if (questionLowerCase.includes('钱') || questionLowerCase.includes('财') || questionLowerCase.includes('投资')) {
        advice.push(this.getRandomElement(FORTUNE_ADVICE.wealth[overallLevel]));
      } else if (questionLowerCase.includes('爱情') || questionLowerCase.includes('感情') || questionLowerCase.includes('恋爱')) {
        advice.push(this.getRandomElement(FORTUNE_ADVICE.love[overallLevel]));
      } else if (questionLowerCase.includes('健康') || questionLowerCase.includes('身体')) {
        advice.push(this.getRandomElement(FORTUNE_ADVICE.health[overallLevel]));
      }
    }

    return {
      overall: {
        score: overallScore,
        level: overallLevel,
        description: overallDescription,
        suggestion: this.getRandomElement(FORTUNE_ADVICE.career[overallLevel]) // 可以优化为更通用的建议
      },
      aspects,
      lucky,
      advice
    };
  }
} 