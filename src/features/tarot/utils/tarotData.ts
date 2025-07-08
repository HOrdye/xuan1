/**
 * 塔罗牌数据类型定义
 */
export interface TarotCard {
  id: number;
  name: string;
  chineseName: string;
  category: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number?: number;
  keywords: string[];
  upright: {
    meaning: string;
    love: string;
    career: string;
    money: string;
  };
  reversed: {
    meaning: string;
    love: string;
    career: string;
    money: string;
  };
  description: string;
  imageUrl?: string;
  element?: string;
  symbol?: string;
}

/**
 * 塔罗牌数据（完整的22张大阿尔卡纳）
 */
export const tarotCards: TarotCard[] = [
  {
    id: 0,
    name: 'The Fool',
    chineseName: '愚者',
    category: 'major',
    keywords: ['新开始', '冒险', '纯真', '潜力', '自由'],
    upright: {
      meaning: '新的开始，充满无限可能，准备踏上未知的旅程',
      love: '新恋情的开始，保持开放的心态，享受爱情带来的美好',
      career: '新工作机会来临，敢于尝试新的挑战，前景光明',
      money: '理财新计划启动，小心谨慎但不要畏惧投资机会'
    },
    reversed: {
      meaning: '鲁莽行事，缺乏计划，过于天真或冲动',
      love: '感情不稳定，过于冲动导致关系破裂',
      career: '职场决策草率，需要深思熟虑后再行动',
      money: '财务管理混乱，避免冲动消费和高风险投资'
    },
    description: '愚者代表着新的开始和无限的可能性，鼓励我们保持开放的心态去探索未知的世界。',
    imageUrl: '/static/tarot/- 00_fool_jpg (愚者).png',
    element: '风',
    symbol: '🌟'
  },
  {
    id: 1,
    name: 'The Magician',
    chineseName: '魔术师',
    category: 'major',
    keywords: ['创造力', '意志力', '行动', '实现', '技能'],
    upright: {
      meaning: '具备实现目标的能力和资源，万事俱备只欠东风',
      love: '主动出击，把握爱情机会，展现个人魅力',
      career: '发挥才能，展现领导力，升职加薪指日可待',
      money: '财运亨通，投资有道，理财能力出众'
    },
    reversed: {
      meaning: '缺乏信心，能力被浪费，或存在欺骗行为',
      love: '感情操控，不够真诚，可能存在第三者',
      career: '才能未得到发挥，缺乏方向感和目标',
      money: '理财能力不足，投资失误或被他人欺骗'
    },
    description: '魔术师象征着将想法转化为现实的能力，提醒我们要善用自己的才能和资源来创造奇迹。',
    imageUrl: '/static/tarot/- 01_magician_jpg (魔术师).png',
    element: '风',
    symbol: '🪄'
  },
  {
    id: 2,
    name: 'The High Priestess',
    chineseName: '女祭司',
    category: 'major',
    keywords: ['直觉', '内在智慧', '神秘', '潜意识', '灵性'],
    upright: {
      meaning: '相信直觉，探索内在智慧，神秘力量的指引',
      love: '感情需要用心感受，不要急躁，真爱需要时间酝酿',
      career: '职业发展需要耐心，相信直觉做出正确选择',
      money: '理财决策要谨慎，相信内心判断，避免外界干扰'
    },
    reversed: {
      meaning: '忽视直觉，缺乏内省，被表面现象迷惑',
      love: '感情中缺乏理解，沟通不足，关系趋于表面',
      career: '工作中缺乏洞察力，错失重要机会',
      money: '投资决策缺乏判断力，容易受他人影响'
    },
    description: '女祭司代表内在的智慧和直觉，提醒我们要学会倾听内心的声音，探索灵魂深处的秘密。',
    imageUrl: '/static/tarot/- 02_high_priestess_jpg (女祭司).png',
    element: '水',
    symbol: '🌙'
  },
  {
    id: 3,
    name: 'The Empress',
    chineseName: '皇后',
    category: 'major',
    keywords: ['丰饶', '母性', '创造', '自然', '丰收'],
    upright: {
      meaning: '创造力丰富，生活富足，享受自然之美',
      love: '感情丰收，可能有结婚或怀孕的喜讯',
      career: '事业蒸蒸日上，创意项目大获成功',
      money: '财源滚滚，投资获得丰厚回报'
    },
    reversed: {
      meaning: '创造力受阻，过度依赖他人，缺乏自信',
      love: '感情关系不平衡，过度付出或索取',
      career: '工作压力大，创意枯竭，需要休息调整',
      money: '财务状况不稳定，支出大于收入'
    },
    description: '皇后象征着丰饶和创造力，代表着母性的关爱和自然的恩赐，提醒我们要珍惜生活中的美好。',
    imageUrl: '/static/tarot/- 03_empress_jpg (皇后).png',
    element: '土',
    symbol: '👑'
  },
  {
    id: 4,
    name: 'The Emperor',
    chineseName: '皇帝',
    category: 'major',
    keywords: ['权威', '稳定', '领导', '结构', '父权'],
    upright: {
      meaning: '具有权威和领导力，建立稳固的基础',
      love: '感情关系稳定，寻求长期承诺',
      career: '职场地位提升，成为团队领导者',
      money: '财务管理有序，长期投资策略见效'
    },
    reversed: {
      meaning: '权威被挑战，缺乏自律，过于专制',
      love: '感情中过于控制，缺乏包容和理解',
      career: '领导能力受质疑，管理方式需要调整',
      money: '财务决策过于保守，错失投资机会'
    },
    description: '皇帝代表着权威和稳定，象征着通过纪律和坚持建立起来的成功，提醒我们要承担起应有的责任。',
    imageUrl: '/static/tarot/- 04_emperor_jpg (皇帝).png',
    element: '火',
    symbol: '⚡'
  },
  {
    id: 5,
    name: 'The Hierophant',
    chineseName: '教皇',
    category: 'major',
    keywords: ['传统', '信仰', '教导', '精神导师', '智慧'],
    upright: {
      meaning: '寻求精神指导，遵循传统智慧，学习新知识',
      love: '感情需要精神层面的契合，可能通过介绍认识',
      career: '寻求导师指导，学习专业技能，遵循行业规范',
      money: '理财需要专业建议，遵循传统投资方式'
    },
    reversed: {
      meaning: '挑战传统，独立思考，可能存在欺骗或虚伪',
      love: '感情观念冲突，价值观不合',
      career: '与权威发生冲突，不愿接受指导',
      money: '理财理念与传统背道而驰，需要谨慎'
    },
    description: '教皇象征着精神导师和传统智慧，提醒我们要尊重前人的经验，同时也要独立思考。',
    imageUrl: '/static/tarot/- 05_hierophant_jpg (教皇).png',
    element: '土',
    symbol: '🙏'
  },
  {
    id: 6,
    name: 'The Lovers',
    chineseName: '恋人',
    category: 'major',
    keywords: ['爱情', '关系', '选择', '和谐', '结合'],
    upright: {
      meaning: '真爱降临，关系和谐，面临重要选择',
      love: '恋爱关系升华，可能步入婚姻殿堂',
      career: '团队合作愉快，建立良好的合作关系',
      money: '合作投资获利，财务伙伴关系稳定'
    },
    reversed: {
      meaning: '关系失衡，选择错误，价值观冲突',
      love: '感情出现裂痕，可能面临分手',
      career: '团队合作不顺，人际关系紧张',
      money: '投资合作出现问题，财务损失'
    },
    description: '恋人牌象征着爱情和选择，提醒我们在面临重要决定时要倾听内心的声音，选择真正适合自己的道路。',
    imageUrl: '/static/tarot/- 06_lovers_jpg (恋人).png',
    element: '风',
    symbol: '💕'
  },
  {
    id: 7,
    name: 'The Chariot',
    chineseName: '战车',
    category: 'major',
    keywords: ['胜利', '意志力', '控制', '前进', '决心'],
    upright: {
      meaning: '通过意志力获得胜利，控制局面，勇往直前',
      love: '主动追求爱情，克服感情障碍',
      career: '事业取得突破，升职或跳槽成功',
      money: '财运上升，投资策略见效'
    },
    reversed: {
      meaning: '缺乏方向感，失去控制，意志力薄弱',
      love: '感情方向不明，缺乏行动力',
      career: '职业发展受阻，缺乏明确目标',
      money: '财务管理混乱，投资方向不明'
    },
    description: '战车象征着通过意志力和决心获得的胜利，提醒我们要保持专注和坚持，才能到达成功的彼岸。',
    imageUrl: '/static/tarot/- 07_chariot_jpg (战车).png',
    element: '水',
    symbol: '🏹'
  },
  {
    id: 8,
    name: 'Strength',
    chineseName: '力量',
    category: 'major',
    keywords: ['勇气', '内在力量', '耐心', '自信', '温柔'],
    upright: {
      meaning: '拥有内在力量，以温柔征服强权，勇气和耐心',
      love: '用爱心和耐心经营感情，温柔的力量',
      career: '凭借个人魅力和坚持获得成功',
      money: '理财需要耐心，长期投资见效果'
    },
    reversed: {
      meaning: '缺乏自信，内心软弱，过于急躁',
      love: '感情中缺乏耐心，过于强势或软弱',
      career: '工作中缺乏坚持，容易放弃',
      money: '投资缺乏耐心，频繁换手损失'
    },
    description: '力量牌象征着内在的勇气和温柔的力量，提醒我们真正的力量来自内心的平静和坚定。',
    imageUrl: '/static/tarot/- 08_strength_jpg (力量).png',
    element: '火',
    symbol: '🦁'
  },
  {
    id: 9,
    name: 'The Hermit',
    chineseName: '隐者',
    category: 'major',
    keywords: ['内省', '寻找', '智慧', '孤独', '指引'],
    upright: {
      meaning: '寻求内在智慧，需要独处时间，精神导师',
      love: '感情需要冷静思考，可能暂时单身',
      career: '职业发展需要深度思考，寻求导师指导',
      money: '理财需要谨慎分析，避免冲动决策'
    },
    reversed: {
      meaning: '过度孤立，拒绝指导，迷失方向',
      love: '感情中过于封闭，拒绝沟通',
      career: '不愿接受建议，固执己见',
      money: '理财决策缺乏理性分析'
    },
    description: '隐者象征着寻求内在智慧和真理的过程，提醒我们有时需要独处和反思才能找到正确的方向。',
    imageUrl: '/static/tarot/- 09_hermit_jpg (隐者).png',
    element: '土',
    symbol: '🔍'
  },
  {
    id: 10,
    name: 'Wheel of Fortune',
    chineseName: '命运之轮',
    category: 'major',
    keywords: ['循环', '机遇', '变化', '命运', '转折'],
    upright: {
      meaning: '好运来临，机遇出现，命运转折点',
      love: '感情出现转机，新的恋爱机会',
      career: '事业迎来转折，把握机会升职',
      money: '财运转好，投资时机成熟'
    },
    reversed: {
      meaning: '运气下滑，错失机会，被动等待',
      love: '感情陷入低潮，需要耐心等待',
      career: '事业发展停滞，机会从手边溜走',
      money: '财务状况不佳，投资需要谨慎'
    },
    description: '命运之轮代表着生命中的循环和变化，提醒我们要把握机遇，顺应变化的潮流。',
    imageUrl: '/static/tarot/- 10_wheel_of_fortune_jpg (命运之轮).png',
    element: '火',
    symbol: '🎡'
  },
  {
    id: 11,
    name: 'Justice',
    chineseName: '正义',
    category: 'major',
    keywords: ['公正', '平衡', '真相', '法律', '因果'],
    upright: {
      meaning: '公正判断，平衡状态，真相大白',
      love: '感情关系公平，相互尊重',
      career: '工作中受到公正对待，法律问题顺利解决',
      money: '财务状况平衡，投资收益合理'
    },
    reversed: {
      meaning: '不公正，偏见，逃避责任',
      love: '感情关系不平等，存在欺骗',
      career: '职场不公，法律纠纷',
      money: '财务纠纷，投资不当'
    },
    description: '正义牌象征着公平和平衡，提醒我们要承担责任，相信因果报应的力量。',
    imageUrl: '/static/tarot/- 11_justice_jpg (正义).png',
    element: '风',
    symbol: '⚖️'
  },
  {
    id: 12,
    name: 'The Hanged Man',
    chineseName: '倒吊人',
    category: 'major',
    keywords: ['牺牲', '等待', '换位思考', '停滞', '觉醒'],
    upright: {
      meaning: '主动牺牲，换个角度看问题，等待时机',
      love: '感情需要牺牲和包容，耐心等待',
      career: '工作暂时停滞，需要调整策略',
      money: '投资需要耐心，暂时收益不明显'
    },
    reversed: {
      meaning: '无谓牺牲，拖延症，拒绝改变',
      love: '感情中过度牺牲，失去自我',
      career: '拖延重要决策，错失机会',
      money: '理财缺乏行动力，坐失良机'
    },
    description: '倒吊人象征着通过牺牲和等待获得的智慧，提醒我们有时需要放慢脚步，从不同角度思考问题。',
    imageUrl: '/static/tarot/- 12_hanged_man_jpg (倒吊人).png',
    element: '水',
    symbol: '🙃'
  },
  {
    id: 13,
    name: 'Death',
    chineseName: '死神',
    category: 'major',
    keywords: ['转变', '结束', '重生', '放下', '新开始'],
    upright: {
      meaning: '旧事物的结束，新开始的到来，重大转变',
      love: '感情关系的转变，可能分手或进入新阶段',
      career: '职业生涯的重大转折，换工作或转行',
      money: '财务状况的重大改变，投资策略调整'
    },
    reversed: {
      meaning: '拒绝改变，停滞不前，害怕结束',
      love: '不愿结束不合适的关系，拖泥带水',
      career: '拒绝职业转变，固守现状',
      money: '理财观念陈旧，不愿调整策略'
    },
    description: '死神牌象征着转变和重生，提醒我们要勇于放下过去，拥抱新的开始。',
    imageUrl: '/static/tarot/- 13_death_jpg (死神).png',
    element: '水',
    symbol: '💀'
  },
  {
    id: 14,
    name: 'Temperance',
    chineseName: '节制',
    category: 'major',
    keywords: ['平衡', '调和', '耐心', '治愈', '中庸'],
    upright: {
      meaning: '保持平衡，调和不同元素，耐心治愈',
      love: '感情关系和谐，相互理解包容',
      career: '工作中善于协调，团队合作顺利',
      money: '财务规划合理，收支平衡'
    },
    reversed: {
      meaning: '失去平衡，过度或不足，缺乏耐心',
      love: '感情关系失衡，缺乏沟通',
      career: '工作节奏失调，压力过大',
      money: '财务管理不当，收支失衡'
    },
    description: '节制牌象征着和谐与平衡，提醒我们要在各种对立面中寻找中庸之道。',
    imageUrl: '/static/tarot/- 14_temperance_jpg (节制).png',
    element: '火',
    symbol: '🧘'
  },
  {
    id: 15,
    name: 'The Devil',
    chineseName: '恶魔',
    category: 'major',
    keywords: ['诱惑', '束缚', '欲望', '依赖', '阴暗面'],
    upright: {
      meaning: '受到诱惑和束缚，需要面对阴暗面',
      love: '感情中存在不健康依赖，被欲望驱使',
      career: '工作中受到不良诱惑，道德挑战',
      money: '财务上过度贪婪，高风险投资'
    },
    reversed: {
      meaning: '摆脱束缚，克服诱惑，获得自由',
      love: '从不健康的关系中解脱，获得真爱',
      career: '摆脱职场困境，重获工作热情',
      money: '克服贪婪，建立健康理财观'
    },
    description: '恶魔牌象征着诱惑和束缚，提醒我们要认清自己的欲望，勇于面对内心的阴暗面。',
    imageUrl: '/static/tarot/- 15_devil_jpg (恶魔).png',
    element: '土',
    symbol: '😈'
  },
  {
    id: 16,
    name: 'The Tower',
    chineseName: '高塔',
    category: 'major',
    keywords: ['突变', '破坏', '启示', '解放', '重建'],
    upright: {
      meaning: '突然的变化和破坏，旧结构的崩塌',
      love: '感情关系的突然破裂，痛苦但必要',
      career: '职业生涯的重大打击，需要重新开始',
      money: '财务上的重大损失，投资失败'
    },
    reversed: {
      meaning: '灾难得到控制，从破坏中重建',
      love: '感情危机得到化解，关系重建',
      career: '职业困境逐渐改善，重新站起',
      money: '财务损失逐渐恢复，重建信心'
    },
    description: '高塔象征着突然的破坏和重建，提醒我们有时需要彻底的毁灭才能获得真正的自由。',
    imageUrl: '/static/tarot/- 16_tower_jpg (塔).png',
    element: '火',
    symbol: '🏗️'
  },
  {
    id: 17,
    name: 'The Star',
    chineseName: '星星',
    category: 'major',
    keywords: ['希望', '灵感', '指引', '治愈', '理想'],
    upright: {
      meaning: '希望和灵感，精神指引，内心治愈',
      love: '爱情充满希望，精神层面的契合',
      career: '事业前景光明，创意灵感涌现',
      money: '财运稳步上升，长期投资看好'
    },
    reversed: {
      meaning: '失去希望，缺乏信心，理想破灭',
      love: '感情缺乏希望，对爱情失望',
      career: '职业发展迷茫，缺乏方向感',
      money: '财务前景不明，投资信心不足'
    },
    description: '星星牌象征着希望和指引，提醒我们即使在最黑暗的时刻也要相信光明的存在。',
    imageUrl: '/static/tarot/- 17_star_jpg (星星).png',
    element: '风',
    symbol: '⭐'
  },
  {
    id: 18,
    name: 'The Moon',
    chineseName: '月亮',
    category: 'major',
    keywords: ['幻象', '直觉', '潜意识', '恐惧', '不确定'],
    upright: {
      meaning: '面对未知的恐惧，相信直觉，探索潜意识',
      love: '感情中存在误解，需要坦诚沟通',
      career: '工作中充满不确定性，需要小心判断',
      money: '理财决策需要谨慎，避免被假象迷惑'
    },
    reversed: {
      meaning: '克服恐惧，真相大白，直觉准确',
      love: '感情误会得到澄清，关系更加透明',
      career: '工作中的困惑得到解决，方向明确',
      money: '财务状况变得清晰，投资策略明确'
    },
    description: '月亮牌象征着幻象和潜意识，提醒我们要学会区分现实与幻想，相信内心的直觉。',
    imageUrl: '/static/tarot/- 18_moon_jpg (月亮).png',
    element: '水',
    symbol: '🌙'
  },
  {
    id: 19,
    name: 'The Sun',
    chineseName: '太阳',
    category: 'major',
    keywords: ['成功', '快乐', '活力', '真理', '光明'],
    upright: {
      meaning: '成功和快乐降临，充满活力和热情',
      love: '爱情甜蜜美满，可能有婚庆之喜',
      career: '事业蒸蒸日上，获得认可和成功',
      money: '财运亨通，投资获得丰厚回报'
    },
    reversed: {
      meaning: '成功延迟，快乐不完整，过度自信',
      love: '感情虽好但有小问题，需要调整',
      career: '成功暂时延迟，但前景依然光明',
      money: '财运不错但需要谨慎，避免过度乐观'
    },
    description: '太阳牌象征着成功和光明，是塔罗牌中最积极正面的牌之一，预示着美好的未来。',
    imageUrl: '/static/tarot/- 19_sun_jpg (太阳).png',
    element: '火',
    symbol: '☀️'
  },
  {
    id: 20,
    name: 'Judgement',
    chineseName: '审判',
    category: 'major',
    keywords: ['重生', '觉醒', '宽恕', '呼唤', '新生命'],
    upright: {
      meaning: '精神觉醒，获得重生，听从内心呼唤',
      love: '感情获得新生，原谅过去的伤害',
      career: '职业生涯的新阶段，使命感强烈',
      money: '财务状况获得改善，理财观念更新'
    },
    reversed: {
      meaning: '拒绝改变，逃避责任，缺乏宽恕',
      love: '不愿原谅过去，感情难以重新开始',
      career: '逃避职业责任，缺乏使命感',
      money: '财务管理缺乏责任心，逃避现实'
    },
    description: '审判牌象征着精神的觉醒和重生，提醒我们要听从内心的呼唤，勇于承担责任。',
    imageUrl: '/static/tarot/- 20_judgement_jpg (审判).png',
    element: '火',
    symbol: '📯'
  },
  {
    id: 21,
    name: 'The World',
    chineseName: '世界',
    category: 'major',
    keywords: ['完成', '成就', '圆满', '旅程结束', '新循环'],
    upright: {
      meaning: '目标达成，旅程圆满完成，获得成就感',
      love: '感情关系圆满，可能步入婚姻殿堂',
      career: '事业达到顶峰，获得最高成就',
      money: '财务目标实现，投资获得满意回报'
    },
    reversed: {
      meaning: '目标未完成，缺乏成就感，停滞不前',
      love: '感情关系不够圆满，还有待努力',
      career: '事业目标尚未达成，需要继续努力',
      money: '财务目标未实现，投资策略需调整'
    },
    description: '世界牌象征着完成和成就，是塔罗牌的最后一张，代表着一个完整循环的结束和新循环的开始。',
    imageUrl: '/static/tarot/- 21_world_jpg (世界).png',
    element: '土',
    symbol: '🌍'
  }
];

/**
 * 根据ID获取塔罗牌
 */
export function getTarotCardById(id: number): TarotCard | undefined {
  return tarotCards.find(card => card.id === id);
}

/**
 * 随机抽取塔罗牌
 */
export function drawRandomCard(): TarotCard {
  const randomIndex = Math.floor(Math.random() * tarotCards.length);
  return tarotCards[randomIndex];
}

/**
 * 抽取多张塔罗牌
 */
export function drawMultipleCards(count: number): TarotCard[] {
  const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, tarotCards.length));
}

/**
 * 塔罗牌解读类型
 */
export interface TarotReading {
  cards: TarotCard[];
  positions: string[];
  interpretation: string;
  advice: string;
}

/**
 * 生成塔罗牌解读
 */
export function generateTarotReading(cards: TarotCard[], question?: string): TarotReading {
  const positions = ['过去', '现在', '未来'];
  
  let interpretation = `您抽到的三张牌分别是：\n`;
  cards.forEach((card, index) => {
    interpretation += `\n${positions[index]}：${card.chineseName}(${card.name})\n`;
    interpretation += `关键词：${card.keywords.join('、')}\n`;
    interpretation += `含义：${card.upright.meaning}\n`;
  });

  const advice = generateAdvice(cards, question);

  return {
    cards,
    positions,
    interpretation,
    advice
  };
}

/**
 * 生成建议
 */
function generateAdvice(cards: TarotCard[], question?: string): string {
  const themes = cards.flatMap(card => card.keywords);
  const uniqueThemes = [...new Set(themes)];
  
  let advice = '根据您抽到的牌，以下是一些建议：\n\n';
  
  if (uniqueThemes.includes('新开始') || uniqueThemes.includes('机遇')) {
    advice += '• 这是一个新开始的好时机，勇敢地迈出第一步\n';
  }
  
  if (uniqueThemes.includes('直觉') || uniqueThemes.includes('内在智慧')) {
    advice += '• 相信您的直觉，内心的声音会为您指引方向\n';
  }
  
  if (uniqueThemes.includes('耐心') || uniqueThemes.includes('等待')) {
    advice += '• 保持耐心，好事需要时间来酝酿\n';
  }
  
  if (uniqueThemes.includes('行动') || uniqueThemes.includes('意志力')) {
    advice += '• 是时候采取行动了，用您的意志力去实现目标\n';
  }
  
  advice += '\n记住，塔罗牌只是提供指引，最终的决定权在您自己手中。';
  
  return advice;
} 