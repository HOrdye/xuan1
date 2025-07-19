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

// 每日建议模板库 - 更有趣且不重复
const DAILY_ADVICE: [string[], string[], string[]] = [
  // 宜做的事 - 实用且有趣
  [
    '早起冲杯手冲咖啡，提升今日运势',
    '整理工位，布置开运小物件',
    '刷刷小红书，找找灵感和能量',
    '和好友来一把游戏，放松心情',
    '尝试新的健身APP，充能补血',
    '整理心情，发条朋友圈记录生活',
    '学习新技能，提升自我属性',
    '给自己买个小礼物，提升心情值',
    '尝试一个新的表情包，增加聊天趣味',
    '学会用Excel快捷键，提升工作效率',
    '整理手机相册，给数字生活减负',
    '主动跟同事聊一个工作之外的话题',
    '尝试一个新的穿搭风格，换个心情',
    '学会用手机拍出更好看的照片',
    '给自己制定一个小目标，比如今天不熬夜',
    '尝试一家新店或新美食，美食治愈一切',
    '写下今天的心情或感悟，记录生活的小确幸',
    '给家人或朋友打个电话，亲情友情都需要维护',
    '学习一个网络热梗，跟上年轻人的节奏',
    '给自己拍一张美美的照片，记录美好时光',
    '尝试一个新的学习方法，比如番茄工作法',
    '整理一下自己的收藏夹，清理数字垃圾',
    '给自己买一束花，生活需要仪式感',
    '尝试一个新的APP，发现更多可能性',
    '给陌生人一个微笑，传递正能量',
    '尝试一个新的表情，比如地铁老人看手机',
    '给自己定个小目标，比如今天不刷短视频'
  ],
  // 不宜做的事 - 避免重复
  [
    '熬夜爆肝，容易破财又伤身',
    '剁手冲动消费，钱包会破产',
    '对工作摆烂，会被老板盯上',
    '跳过早餐，容易一整天没状态',
    '一个人憋着情绪不说，容易内耗',
    '刷短视频到深夜，影响运势',
    '见人就吐槽，容易招来小人',
    '囤货不使用，会带来霉运',
    '过度焦虑，容易影响判断力',
    '盲目跟风，容易失去自我',
    '忽视健康，容易后悔莫及',
    '过度依赖他人，容易失去独立性',
    '逃避问题，容易让问题更严重',
    '过度完美主义，容易让自己疲惫',
    '忽视细节，容易错失机会',
    '过度自信，容易忽视风险',
    '拖延症发作，容易错过最佳时机',
    '情绪化决策，容易后悔',
    '忽视学习，容易被时代淘汰',
    '过度消费，容易陷入财务困境'
  ],
  // 每日箴言 - 更有深度
  [
    '今天也要元气满满，和生活碰个杯🍻',
    '人生就要多尝试，说不定就遇到好事了',
    '机会总是青睐有准备的人，继续加油',
    '平平淡淡才是真，佛系也是一种生活态度',
    '今天的你也在努力生活呢，给自己一个大大的拥抱',
    '不要着急，好运就在下一个路口',
    '人生就像抽卡游戏，总有欧皇时刻',
    '保持热爱，奇迹自然发生',
    '每一个今天都是明天的铺垫，珍惜当下',
    '困难只是暂时的，坚持就是胜利',
    '相信自己，你比想象中更强大',
    '生活不会辜负每一个努力的人',
    '保持好奇心，世界会给你惊喜',
    '简单的事情重复做，你就是专家',
    '不要害怕失败，失败是成功之母',
    '保持善良，善良的人运气不会太差',
    '学会感恩，感恩的人更容易获得幸福',
    '保持学习，学习是人生最好的投资',
    '相信自己，你值得拥有美好的一切',
    '保持希望，希望是人生最美好的东西'
  ]
];

// 每日挑战模板库 - 融入网络热梗和具体行动指引
const DAILY_CHALLENGES: string[] = [
  // 网络热梗类挑战
  '今天不当"躺平青年"，至少完成一件拖延已久的事',
  '学习一个网络热梗，比如"你没事吧"的正确用法',
  '尝试用左手完成一件小事，体验不一样的视角',
  '给一个很久没联系的朋友发个消息，说不定会有惊喜',
  '尝试一个新的表情包，增加聊天趣味',
  '学会用Excel快捷键，提升工作效率',
  '整理手机相册，给数字生活减负',
  '主动跟同事聊一个工作之外的话题',
  '尝试一个新的穿搭风格，换个心情',
  '学会用手机拍出更好看的照片',
  '给自己制定一个小目标，比如今天不熬夜',
  '尝试一家新店或新美食，美食治愈一切',
  '写下今天的心情或感悟，记录生活的小确幸',
  '给家人或朋友打个电话，亲情友情都需要维护',
  '学习一个网络热梗，跟上年轻人的节奏',
  '给自己拍一张美美的照片，记录美好时光',
  '尝试一个新的学习方法，比如番茄工作法',
  '整理一下自己的收藏夹，清理数字垃圾',
  '给自己买一束花，生活需要仪式感',
  '尝试一个新的APP，发现更多可能性',
  '给陌生人一个微笑，传递正能量',
  '尝试一个新的表情，比如地铁老人看手机',
  '给自己定个小目标，比如今天不刷短视频',
  '学习一个简单的魔术，给朋友表演',
  '尝试用不同的语言说"你好"，增加国际化视野',
  '整理一下自己的书桌，环境整洁心情好',
  '尝试一个新的运动，比如瑜伽或者跳舞',
  '学习一个简单的折纸，送给朋友',
  '尝试用不同的方式记录今天，比如画画或者录音',
  '给自己买一个小礼物，犒劳一下自己',
  '尝试一个新的音乐风格，发现新的喜好',
  '学习一个简单的烹饪技巧，提升生活品质',
  '尝试用不同的方式表达感谢，比如写感谢信',
  '整理一下自己的衣柜，发现被遗忘的衣服',
  '尝试一个新的游戏，放松心情',
  '学习一个简单的摄影技巧，记录美好瞬间',
  '尝试用不同的方式学习，比如看纪录片',
  '给自己制定一个健康计划，比如多喝水',
  '尝试一个新的社交方式，比如参加线上活动',
  '学习一个简单的理财知识，提升财商',
  '尝试用不同的方式放松，比如冥想',
  '整理一下自己的电脑桌面，提升工作效率',
  '尝试一个新的阅读方式，比如听书',
  '学习一个简单的园艺技巧，养一盆植物',
  '尝试用不同的方式表达爱意，比如拥抱',
  '给自己制定一个学习计划，比如学一门新技能',
  '尝试一个新的旅行方式，比如城市漫步',
  '学习一个简单的DIY技巧，制作手工艺品',
  '尝试用不同的方式记录灵感，比如思维导图',
  '给自己制定一个环保计划，比如减少塑料使用',
  '尝试一个新的沟通方式，比如写日记',
  '学习一个简单的心理技巧，提升情商',
  '尝试用不同的方式庆祝，比如给自己颁奖',
  '整理一下自己的人生目标，重新规划未来',
  '尝试一个新的创意表达，比如写诗',
  '学习一个简单的投资知识，提升财商',
  '尝试用不同的方式帮助他人，比如志愿服务',
  '给自己制定一个成长计划，比如每天进步一点点',
  '尝试一个新的生活方式，比如极简主义',
  '学习一个简单的艺术技巧，比如绘画',
  '尝试用不同的方式表达情感，比如写情书',
  '给自己制定一个梦想清单，勇敢追梦',
  '尝试一个新的思维方式，比如逆向思维',
  '学习一个简单的管理技巧，提升领导力',
  '尝试用不同的方式创造价值，比如分享知识',
  '给自己制定一个幸福计划，追求内心平静',
  '尝试一个新的表达方式，比如演讲',
  '学习一个简单的设计技巧，提升审美',
  '尝试用不同的方式解决问题，比如头脑风暴',
  '给自己制定一个成功计划，设定明确目标',
  '尝试一个新的学习方法，比如费曼技巧',
  '学习一个简单的谈判技巧，提升沟通能力',
  '尝试用不同的方式建立关系，比如主动关心',
  '给自己制定一个平衡计划，工作生活两不误',
  '尝试一个新的决策方式，比如直觉判断',
  '学习一个简单的销售技巧，提升说服力',
  '尝试用不同的方式表达观点，比如辩论',
  '给自己制定一个创新计划，突破思维局限',
  '尝试一个新的合作方式，比如团队协作',
  '学习一个简单的营销技巧，提升影响力',
  '尝试用不同的方式传播正能量，比如分享故事',
  '给自己制定一个卓越计划，追求完美',
  '尝试一个新的领导方式，比如服务型领导',
  '学习一个简单的战略技巧，提升格局',
  '尝试用不同的方式创造奇迹，比如突破极限',
  '给自己制定一个传奇计划，书写人生传奇',
  '尝试用"栓Q"、"泰酷辣"等网络用语跟朋友聊天',
  '模仿一个抖音热门手势舞，录个小视频',
  '用"地铁老人看手机"的表情包回应朋友消息',
  
  // 实用技能类挑战
  '学会用Excel做一个简单的数据表格，提升工作效率',
  '学习一个Excel快捷键，比如Ctrl+D快速填充',
  '整理电脑桌面，把文件分类放到对应文件夹',
  '学会用手机拍出更好看的照片，调整构图和光线',
  '学习一个简单的理财知识，比如基金定投',
  
  // 社交突破类挑战
  '主动跟同事或同学聊一个工作/学习之外的话题',
  '在群里分享一个有趣的观点或经历',
  '给一个很久没联系的朋友发消息，聊聊近况',
  '参加一个线上或线下的社交活动',
  '主动帮助一个需要帮助的人',
  
  // 生活品质类挑战
  '尝试一个新的健身动作，比如平板支撑或深蹲',
  '学会做一道简单的家常菜，比如番茄炒蛋',
  '整理衣柜，把不穿的衣服捐给需要的人',
  '学习一个简单的化妆技巧，提升个人形象',
  '尝试一个新的兴趣爱好，比如绘画或摄影',
  
  // 数字生活类挑战
  '清理手机相册，删除重复和模糊的照片',
  '整理微信收藏夹，把有用的内容分类保存',
  '学会用手机备忘录记录重要事项',
  '尝试一个新的学习APP，比如背单词软件',
  '学会用手机银行进行简单的理财操作'
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

// 每日机遇模板库 - 更具体和实用的机遇
const DAILY_OPPORTUNITIES: string[] = [
  // 职业发展机遇
  '可能遇到行业内的专业人士，获得职业指导',
  '可能收到猎头或HR的联系，有新的工作机会',
  '可能被邀请参加重要的会议或项目',
  '可能获得培训或进修的机会',
  '可能遇到潜在的合作伙伴或客户',
  
  // 学习成长机遇
  '可能发现一个非常适合的学习资源或课程',
  '可能遇到一位经验丰富的导师或前辈',
  '可能获得参加行业会议或研讨会的邀请',
  '可能发现一个解决当前问题的好方法',
  '可能获得免费试用高级工具或服务的机会',
  
  // 人际关系机遇
  '可能遇到志同道合的朋友，建立新的社交圈',
  '可能重新联系上一位老朋友，恢复友谊',
  '可能遇到一位能够互相帮助的同事',
  '可能获得参加社交活动的邀请',
  '可能遇到一位能够分享经验和资源的同行',
  
  // 财务机遇
  '可能发现一个不错的投资机会',
  '可能获得额外的收入来源',
  '可能遇到优惠的购物或服务机会',
  '可能获得理财建议或金融产品推荐',
  '可能遇到创业或副业的机会',
  
  // 生活品质机遇
  '可能发现一个改善生活质量的实用技巧',
  '可能获得健康检查或健身指导的机会',
  '可能遇到旅行或体验新事物的机会',
  '可能发现一个提升效率的工具或方法',
  '可能获得改善居住环境的建议或资源'
];

// 机遇提示 - 更具体和实用的建议
const OPPORTUNITY_TIPS: string[] = [
  // 心态准备类
  '保持开放的心态，机会往往在不经意间出现',
  '提前做好准备，当机会来临时才能抓住',
  '相信自己的直觉，但也要理性分析',
  '保持积极乐观，好运气总是眷顾乐观的人',
  
  // 行动指导类
  '主动出击，不要等待机会自己上门',
  '多参加社交活动，扩大人脉圈',
  '持续学习新技能，提升自己的竞争力',
  '保持好奇心，对新事物保持开放态度',
  
  // 具体建议类
  '关注行业动态，了解最新的发展趋势',
  '建立个人品牌，让别人更容易记住你',
  '学会理财，为未来的机会储备资金',
  '保持健康的生活方式，身体是革命的本钱',
  
  // 网络时代类
  '善用社交媒体，展示自己的专业能力',
  '关注优质内容，提升自己的认知水平',
  '参与线上社群，结识志同道合的朋友',
  '利用网络资源，发现更多可能性'
];

export async function generateFortune(personalData: PersonalizedFortuneData, useAI: boolean = true): Promise<FortuneResult> {
  try {
    console.log('🔮 开始生成运势...', personalData, '使用AI:', useAI);

    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    // 构建运势请求参数
    const request: FortuneRequest = {
      birthDate: personalData.birthDate?.toISOString().split('T')[0],
      zodiacSign: personalData.zodiac?.sign,
      question: personalData.question
    };

    console.log('📝 运势请求参数:', request);

    let result: FortuneResult;
    // 根据useAI参数决定使用哪种生成方式
    if (useAI) {
      // 尝试使用AI增强的运势生成
      try {
        console.log('🤖 尝试使用AI增强运势分析...');
        result = await FortuneGenerator.generateFortuneWithAI(request);
      } catch (error: any) {
        console.warn('⚠️ AI运势分析失败，回退到基础运势:', error);
        // 如果AI失败，使用基础运势生成
        result = FortuneGenerator.generateFortune(request);
      }
    } else {
      // 直接使用快速本地算法
      console.log('⚡ 使用快速分析模式...');
      result = FortuneGenerator.generateFortune(request);
    }
    
    result.date = dateString; // 统一更新日期
    console.log('✅ 运势生成完成:', result);
    return result;

  } catch (error: any) {
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
    story: '平平淡淡才是真，佛系也是一种生活态度',
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

  private static generateAdvice(fortuneLevel?: FortuneLevel): string[] {
    // 生成更丰富的建议，从不同类别中抽取，确保不重复
    const result: string[] = [];
    
    // 从宜做的事中抽取2-3条
    const doCount = this.getRandomInt(2, 3);
    const doAdvice = this.getRandomElements(DAILY_ADVICE[0], doCount);
    result.push(...doAdvice);
    
    // 从不宜做的事中抽取1条
    const dontAdvice = this.getRandomElement(DAILY_ADVICE[1]);
    result.push(dontAdvice);
    
    // 从每日箴言中抽取1-2条
    const wisdomCount = this.getRandomInt(1, 2);
    const wisdomAdvice = this.getRandomElements(DAILY_ADVICE[2], wisdomCount);
    result.push(...wisdomAdvice);
    
    // 去重处理，确保没有重复内容
    const uniqueAdvice = Array.from(new Set(result));
    
    // 如果去重后数量不足，从其他类别补充
    if (uniqueAdvice.length < 5) {
      const allAdvice = [...DAILY_ADVICE[0], ...DAILY_ADVICE[1], ...DAILY_ADVICE[2]];
      const remainingAdvice = allAdvice.filter(item => !uniqueAdvice.includes(item));
      
      while (uniqueAdvice.length < 5 && remainingAdvice.length > 0) {
        const randomAdvice = this.getRandomElement(remainingAdvice);
        uniqueAdvice.push(randomAdvice);
        const index = remainingAdvice.indexOf(randomAdvice);
        if (index > -1) {
          remainingAdvice.splice(index, 1);
        }
      }
    }
    
    return uniqueAdvice.slice(0, 5); // 最多返回5条建议
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
    
    let aiAnalysis = '';
    try {
      // 确保获取最新的LLM配置
      const llmConfig = LLMService.getConfig();
      console.log('🔧 当前LLM配置状态:', {
        provider: llmConfig.provider,
        hasApiKey: !!llmConfig.apiKey,
        model: llmConfig.model
      });
      
      if (llmConfig.apiKey) {
        console.log('🤖 调用LLMService进行深度解读...');
        
        // 构建有效的卦象数据用于AI分析
        const simulatedHexagram = {
          name: '今日运势卦',
          chineseName: '运势分析',
          symbol: '☯',
          judgment: basicFortune.overall.description,
          modernInterpretation: `今日整体运势${basicFortune.overall.level}，各方面运势均衡发展。`,
          description: `基于您的个人信息和当前时空能量，为您提供专业的运势指导。${basicFortune.overall.description}`
        };

        aiAnalysis = await LLMService.getHexagramInterpretation(
          simulatedHexagram as any, 
          `今日运势分析：我的问题是 "${request.question}"`
        );
        console.log('✅ AI解读成功完成。');
        return this.parseAIAnalysis(aiAnalysis, basicFortune);

      } else {
        console.log('⚠️ AI Key未配置，跳过深度解读。');
        aiAnalysis = 'AI功能未开启。';
      }
    } catch (error: any) {
      console.error('❌ AI运势分析失败:', error);
      aiAnalysis = 'AI分析服务暂时不可用，已为您生成基础运势。';
    }

    // 如果AI未执行或失败，将分析文本附加到建议中并返回基础运势
    basicFortune.aiAnalysis = typeof aiAnalysis === 'string' ? aiAnalysis : JSON.stringify(aiAnalysis);
    basicFortune.advice.push(typeof aiAnalysis === 'string' ? aiAnalysis : JSON.stringify(aiAnalysis));
    return basicFortune;
  }

  /**
   * 解析AI分析结果并整合到运势数据中
   */
  private static parseAIAnalysis(aiAnalysis: string, basicFortune: FortuneResult): FortuneResult {
    try {
      console.log('🔍 开始解析AI分析结果...');
      console.log('📝 原始AI响应:', aiAnalysis);
      
      let jsonStr = this.extractJSONFromResponse(aiAnalysis);
      
      if (!jsonStr) {
        console.warn('⚠️ 未找到有效的JSON内容，使用降级处理');
        return this.createFallbackFortune(basicFortune, aiAnalysis);
      }

      // 验证和清理JSON字符串
      jsonStr = this.cleanAndValidateJSON(jsonStr);
      
      const aiData: any = JSON.parse(jsonStr);
      console.log('✅ AI数据解析成功:', aiData);

      const safe = (v: any, def: any) => (v !== undefined && v !== null ? v : def);
      
      const enhancedFortune: FortuneResult = {
        ...basicFortune,
        aiAnalysis: aiAnalysis,
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
        personalizedTips: aiData.dailyAdvice?.do,
      };

      enhancedFortune.aspects = {
        career: { score: enhancedFortune.career.energyScore || 0, description: enhancedFortune.career.description },
        wealth: { score: enhancedFortune.wealth.energyScore || 0, description: enhancedFortune.wealth.description },
        love: { score: enhancedFortune.love.energyScore || 0, description: enhancedFortune.love.description },
        health: { score: enhancedFortune.health.energyScore || 0, description: enhancedFortune.health.description }
      };
      console.log('🎨 AI数据整合完成，增强运势:', enhancedFortune);
      return enhancedFortune;
    } catch (error: any) {
      console.warn('⚠️ AI分析结果解析失败，已降级为原文:', error);
      
      // 尝试从AI响应中提取有用的文本内容
      const usefulContent = this.extractUsefulContent(aiAnalysis);
      
      return this.createFallbackFortune(basicFortune, usefulContent);
    }
  }

  /**
   * 创建降级运势数据（当AI解析失败时使用）
   */
  private static createFallbackFortune(basicFortune: FortuneResult, aiAnalysis: string): FortuneResult {
    // 生成更有意义的降级建议
    const fallbackAdvice = this.generateFallbackAdvice(basicFortune);
    
    // 如果AI分析内容不是默认文本，尝试整合到建议中
    const enhancedAdvice = aiAnalysis !== '基于传统命理学为您生成的专业运势分析' 
      ? [...fallbackAdvice, aiAnalysis]
      : fallbackAdvice;
    
    return {
      ...basicFortune,
      aiAnalysis: typeof aiAnalysis === 'string' ? aiAnalysis : JSON.stringify(aiAnalysis) || '基于传统命理学为您生成的专业运势分析',
      advice: enhancedAdvice
    };
  }

  /**
   * 生成降级建议（当AI不可用时使用）
   */
  private static generateFallbackAdvice(basicFortune: FortuneResult): string[] {
    // 复用generateAdvice方法，传入运势等级以生成个性化建议
    return this.generateAdvice(basicFortune.overall.level);
  }
  
  /**
   * 从AI响应中提取JSON字符串
   */
  private static extractJSONFromResponse(response: string): string {
    // 1. 优先提取```json代码块
    const jsonMatch = response.match(/```json[\s\S]*?({[\s\S]*?})[\s\S]*?```/);
    if (jsonMatch && jsonMatch[1]) {
      return jsonMatch[1];
    }
    
    // 2. 提取```代码块（不指定语言）
    const codeMatch = response.match(/```[\s\S]*?({[\s\S]*?})[\s\S]*?```/);
    if (codeMatch && codeMatch[1]) {
      return codeMatch[1];
    }
    
    // 3. 提取第一个大括号包围的内容
    const firstBrace = response.indexOf('{');
    const lastBrace = response.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      return response.substring(firstBrace, lastBrace + 1);
    }
    
    // 4. 尝试查找任何可能的JSON结构
    const jsonPattern = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/;
    const match = response.match(jsonPattern);
    if (match) {
      return match[0];
    }
    
    return '';
  }

  /**
   * 清理和验证JSON字符串
   */
  private static cleanAndValidateJSON(jsonStr: string): string {
    // 移除可能的markdown标记
    jsonStr = jsonStr.replace(/^```.*?\n/, '').replace(/\n```$/, '');
    
    // 修复常见的JSON格式问题
    jsonStr = jsonStr
      // 修复缺少逗号的问题
      .replace(/([}\]"\d])\s*\n\s*"/g, '$1,\n"')
      // 修复多余的逗号
      .replace(/,(\s*[}\]])/g, '$1')
      // 修复未闭合的字符串
      .replace(/"([^"]*)$/g, '"$1"')
      // 修复未闭合的数组/对象
      .replace(/([}\]])[^,}\]\s]*$/g, '$1');
    
    // 验证JSON格式
    try {
      JSON.parse(jsonStr);
      return jsonStr;
    } catch (error) {
      console.warn('⚠️ JSON清理后仍无效，尝试进一步修复:', error);
      
      // 尝试提取有效的JSON片段
      const validJsonMatch = jsonStr.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
      if (validJsonMatch) {
        try {
          JSON.parse(validJsonMatch[0]);
          return validJsonMatch[0];
        } catch (e) {
          console.warn('⚠️ 无法修复JSON格式');
        }
      }
      
      throw new Error('JSON格式无法修复');
    }
  }

  /**
   * 从AI响应中提取有用的文本内容
   */
  private static extractUsefulContent(aiResponse: string): string {
    // 移除JSON代码块
    let content = aiResponse.replace(/```json[\s\S]*?```/g, '');
    content = content.replace(/```[\s\S]*?```/g, '');
    
    // 移除JSON对象
    content = content.replace(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, '');
    
    // 清理多余的空行和空格
    content = content.replace(/\n\s*\n/g, '\n').trim();
    
    // 如果清理后没有内容，返回默认文本
    if (!content) {
      return '基于传统命理学为您生成的专业运势分析';
    }
    
    // 限制内容长度，避免过长
    if (content.length > 500) {
      content = content.substring(0, 500) + '...';
    }
    
    return content;
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
    const baseAdvice = this.generateAdvice(overallLevel);
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