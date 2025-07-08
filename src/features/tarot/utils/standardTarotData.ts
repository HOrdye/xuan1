/**
 * 标准塔罗牌数据集 (完整78张塔罗牌)
 * 基于韦特塔罗牌（Rider-Waite Tarot）标准
 */

export interface StandardTarotCard {
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
    spiritual: string;
  };
  reversed: {
    meaning: string;
    love: string;
    career: string;
    money: string;
    spiritual: string;
  };
  description: string;
  symbolism: string[];
  element?: 'fire' | 'water' | 'air' | 'earth';
  astrology?: string;
  numerology?: string;
  imageUrl?: string;
}

/**
 * 22张大阿尔卡纳 (Major Arcana)
 * 代表人生的重大主题和精神成长的旅程
 */
export const majorArcana: StandardTarotCard[] = [
  {
    id: 0,
    name: 'The Fool',
    chineseName: '愚者',
    category: 'major',
    keywords: ['新开始', '冒险精神', '纯真', '自由', '无限可能'],
    upright: {
      meaning: '代表新的开始、纯真和无限的可能性。愚者踏上人生旅程的第一步，充满希望和勇气。',
      love: '新恋情的开始，保持开放心态，真诚相待。可能遇到意外的浪漫机会。',
      career: '新工作或项目的开始，需要勇气和冒险精神。创新思维将带来机遇。',
      money: '财务新计划的开始，但需要谨慎行事。投资需要详细研究。',
      spiritual: '精神觉醒的开始，对未知保持开放态度，相信直觉的指引。'
    },
    reversed: {
      meaning: '鲁莽、缺乏计划、过于天真或冲动行事。需要更加谨慎和深思熟虑。',
      love: '感情中过于冲动，缺乏理性思考。可能因为天真而受伤。',
      career: '职业决策过于草率，缺乏长远规划。需要更多准备和考虑。',
      money: '财务管理混乱，冲动消费。避免高风险投资和不理智的决定。',
      spiritual: '精神成长受阻，过于依赖他人意见，缺乏独立思考。'
    },
    description: '愚者是塔罗牌的起点，象征着纯真的开始和无限的潜能。他代表我们内心那个勇于探索、不畏未知的部分。',
    symbolism: ['白玫瑰（纯洁）', '悬崖（未知的风险）', '小狗（忠诚的伴侣）', '背包（过往经验）', '白色衣服（纯洁无瑕）'],
    element: 'air',
    astrology: '天王星',
    numerology: '0 - 无限可能的数字',
    imageUrl: '/static/tarot/- 00_fool_jpg (愚者).png'
  },
  {
    id: 1,
    name: 'The Magician',
    chineseName: '魔术师',
    category: 'major',
    keywords: ['创造力', '意志力', '技能', '实现', '沟通'],
    upright: {
      meaning: '拥有实现目标所需的所有工具和资源，意志力集中，能够将想法变为现实。',
      love: '主动追求爱情，展现个人魅力，关系中取得主导地位。',
      career: '工作技能得到发挥，领导能力显现，项目进展顺利。',
      money: '财务管理能力强，投资决策明智，收入稳定增长。',
      spiritual: '精神力量集中，能够实现精神目标，与高我连接。'
    },
    reversed: {
      meaning: '滥用权力，欺骗他人，技能被浪费，缺乏自信或方向。',
      love: '操控感情，不够真诚，可能存在欺骗行为。',
      career: '能力未得到认可，缺乏领导力，工作进展受阻。',
      money: '财务决策失误，投资被欺骗，理财能力不足。',
      spiritual: '精神力量被误用，缺乏真正的智慧，自我欺骗。'
    },
    description: '魔术师代表意志力和创造力的完美结合，象征着将精神世界的想法转化为物质世界的能力。',
    symbolism: ['权杖（意志）', '圣杯（情感）', '宝剑（理智）', '金币（物质）', '无限符号（永恒）'],
    element: 'air',
    astrology: '水星',
    numerology: '1 - 开始和意志',
    imageUrl: '/static/tarot/- 01_magician_jpg (魔术师).png'
  },
  {
    id: 2,
    name: 'The High Priestess',
    chineseName: '女祭司',
    category: 'major',
    keywords: ['直觉', '潜意识', '神秘', '内在智慧', '精神'],
    upright: {
      meaning: '依靠直觉和内在智慧做决定，探索潜意识，重视精神层面的发展。',
      love: '感情需要时间发展，重视精神契合，相信直觉的指引。',
      career: '依靠直觉做职业决策，适合精神性或创意性工作。',
      money: '理财需要耐心和直觉，避免冲动的投资决定。',
      spiritual: '精神修行深入，与潜意识连接，神秘体验增多。'
    },
    reversed: {
      meaning: '忽视直觉，缺乏内省，被表面现象迷惑，精神混乱。',
      love: '感情中缺乏深度理解，忽视对方的真实需求。',
      career: '工作中缺乏洞察力，错失重要信息和机会。',
      money: '投资决策过于理性，忽视市场的微妙变化。',
      spiritual: '精神修行停滞，与内在智慧失去联系。'
    },
    description: '女祭司象征着内在的神秘智慧和直觉力量，提醒我们倾听内心深处的声音。',
    symbolism: ['月亮（直觉）', '帷幕（神秘）', '石榴（丰饶）', '水（潜意识）'],
    element: 'water',
    astrology: '月亮',
    numerology: '2 - 二元性和平衡',
    imageUrl: '/static/tarot/- 02_high_priestess_jpg (女祭司).png'
  }
];

/**
 * 56张小阿尔卡纳 (Minor Arcana)
 * 分为四个花色，每个花色14张牌
 */

// 权杖花色 (Wands) - 火元素，代表创造力、热情、事业
export const wands: StandardTarotCard[] = [
  {
    id: 22,
    name: 'Ace of Wands',
    chineseName: '权杖王牌',
    category: 'minor',
    suit: 'wands',
    number: 1,
    keywords: ['新机会', '创造力', '热情', '灵感', '潜能'],
    upright: {
      meaning: '新的创意项目或机会的开始，充满热情和创造力的时期。',
      love: '激情的新恋情开始，或现有关系重燃火花。',
      career: '新工作机会或创意项目启动，展现领导才能的时机。',
      money: '新的收入来源或投资机会，财务状况有望改善。',
      spiritual: '精神能量的觉醒，创造力和直觉力增强。'
    },
    reversed: {
      meaning: '缺乏方向，创意受阻，机会被错过或延迟。',
      love: '感情缺乏激情，关系进展缓慢或停滞。',
      career: '工作缺乏动力，创意枯竭，项目进展困难。',
      money: '投资时机不当，财务计划需要重新考虑。',
      spiritual: '精神能量低迷，缺乏灵感和动力。'
    },
    description: '权杖王牌代表火元素的纯粹能量，象征着新的开始和无限的创造潜能。',
    symbolism: ['从云中伸出的手（神圣启示）', '权杖发芽（新生命力）', '山脉（挑战和目标）'],
    element: 'fire',
    numerology: '1 - 开始和统一',
    imageUrl: '/static/tarot/- 22_wands_ace_jpg (权杖王牌 Ace of Wands).png'
  },
  // ... 权杖花色的其他13张牌
];

// 圣杯花色 (Cups) - 水元素，代表情感、关系、精神
export const cups: StandardTarotCard[] = [
  {
    id: 36,
    name: 'Ace of Cups',
    chineseName: '圣杯王牌',
    category: 'minor',
    suit: 'cups',
    number: 1,
    keywords: ['新感情', '精神觉醒', '爱', '直觉', '情感满足'],
    upright: {
      meaning: '情感的新开始，精神层面的觉醒，内心充满爱与和谐。',
      love: '真爱的开始，深层精神连接，情感关系达到新高度。',
      career: '工作带来情感满足，与同事关系和谐，创意工作特别有利。',
      money: '通过情感投入获得财务回报，艺术投资或慈善事业。',
      spiritual: '精神觉醒的重要时刻，与高我连接，直觉力大增。'
    },
    reversed: {
      meaning: '情感封闭，精神空虚，关系不和谐，缺乏爱的表达。',
      love: '感情受挫，缺乏真诚沟通，情感需求得不到满足。',
      career: '工作缺乏激情，人际关系紧张，创造力受阻。',
      money: '因情感因素导致财务损失，投资决策过于感性。',
      spiritual: '精神成长停滞，与内心失去连接，需要情感治愈。'
    },
    description: '圣杯王牌象征着纯洁的爱和精神觉醒，代表情感世界的新开始。',
    symbolism: ['从云中伸出的手（神圣恩赐）', '圣杯溢出（丰盛的爱）', '鸽子（和平与灵性）', '荷花（精神纯洁）'],
    element: 'water',
    numerology: '1 - 情感的统一和开始',
    imageUrl: '/static/tarot/- 36_cups_ace_jpg (圣杯王牌 Ace of Cups).png'
  },
  // ... 圣杯花色的其他13张牌
];

// 宝剑花色 (Swords) - 风元素，代表思想、沟通、挑战
export const swords: StandardTarotCard[] = [
  {
    id: 50,
    name: 'Ace of Swords',
    chineseName: '宝剑王牌',
    category: 'minor',
    suit: 'swords',
    number: 1,
    keywords: ['新思想', '真相', '清晰思维', '突破', '智慧'],
    upright: {
      meaning: '思维清晰，新想法涌现，能够看清真相并做出明智决定。',
      love: '关系中的真相大白，诚实沟通带来突破，理性分析感情。',
      career: '工作中的重大突破，新策略见效，智慧和分析能力受到认可。',
      money: '投资策略清晰，财务分析准确，理性决策带来收益。',
      spiritual: '精神上的重大洞察，真理的领悟，思维的净化和提升。'
    },
    reversed: {
      meaning: '思维混乱，缺乏清晰度，真相被掩盖，决策困难。',
      love: '沟通不畅，误解加深，感情中缺乏诚实和透明。',
      career: '工作思路不清，决策失误，信息不准确导致问题。',
      money: '财务分析错误，投资决策缺乏理性，被虚假信息误导。',
      spiritual: '精神困惑，真理模糊，需要清理思维和重新聚焦。'
    },
    description: '宝剑王牌代表心智的力量和真理的彰显，象征着清晰思维的重要性。',
    symbolism: ['双刃剑（真理的两面性）', '王冠（智慧的权威）', '山峰（高远的视野）', '云朵（思维的流动）'],
    element: 'air',
    numerology: '1 - 思维的统一和开始',
    imageUrl: '/static/tarot/- 50_swords_ace_jpg (宝剑王牌 Ace of Swords).png'
  },
  // ... 宝剑花色的其他13张牌
];

// 金币花色 (Pentacles) - 土元素，代表物质、金钱、实用
export const pentacles: StandardTarotCard[] = [
  {
    id: 64,
    name: 'Ace of Pentacles',
    chineseName: '金币王牌',
    category: 'minor',
    suit: 'pentacles',
    number: 1,
    keywords: ['新财富', '物质基础', '实用', '机会', '繁荣'],
    upright: {
      meaning: '物质层面的新开始，财务机会出现，实用的解决方案。',
      love: '关系中的物质稳定，实用的爱情观，共同的财务目标。',
      career: '新的职业机会，实际技能的应用，稳定的工作基础。',
      money: '新的收入来源，投资机会，财务基础的建立。',
      spiritual: '精神与物质的平衡，实用的精神修行，踏实的成长。'
    },
    reversed: {
      meaning: '财务机会错失，物质贪婪，缺乏实用性。',
      love: '关系中过于物质化，缺乏精神层面的连接。',
      career: '工作机会流失，缺乏实际技能，基础不稳。',
      money: '投资失误，财务管理不当，收入不稳定。',
      spiritual: '精神与物质失衡，修行缺乏实际行动。'
    },
    description: '金币王牌象征着物质世界的新开始，提醒我们要在精神与物质之间找到平衡。',
    symbolism: ['金币（物质财富）', '花园（培育与成长）', '山径（实用的道路）', '云朵（天赐机会）'],
    element: 'earth',
    numerology: '1 - 物质的统一和开始',
    imageUrl: '/static/tarot/- 64_pentacles_ace_jpg (星币王牌 Ace of Pentacles).png'
  },
  // ... 金币花色的其他13张牌
];

/**
 * 完整的78张标准塔罗牌组合
 */
export const standardTarotDeck: StandardTarotCard[] = [
  // 大阿尔卡纳 (22张)
  ...majorArcana,
  // 小阿尔卡纳 (56张)
  ...wands,
  ...cups, 
  ...swords,
  ...pentacles
];

/**
 * 塔罗牌工具函数
 */
export function getCardById(id: number): StandardTarotCard | undefined {
  return standardTarotDeck.find(card => card.id === id);
}

export function getCardsByCategory(category: 'major' | 'minor'): StandardTarotCard[] {
  return standardTarotDeck.filter(card => card.category === category);
}

export function getCardsBySuit(suit: 'wands' | 'cups' | 'swords' | 'pentacles'): StandardTarotCard[] {
  return standardTarotDeck.filter(card => card.suit === suit);
}

export function shuffleDeck(): StandardTarotCard[] {
  const shuffled = [...standardTarotDeck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function drawCards(count: number): StandardTarotCard[] {
  return shuffleDeck().slice(0, count);
} 