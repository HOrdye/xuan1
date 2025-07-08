const fs = require('fs');
const path = require('path');

// 大阿尔卡纳的故事化解读
const majorArcanaStories = {
  0: "年轻的旅人背起行囊，站在悬崖边，脚下是未知的世界，心中满是对未来的憧憬与勇气。",
  1: "桌上四元素齐聚，魔术师挥动权杖，将想象变为现实，万物皆有可能。",
  2: "月光下的神庙静谧无声，女祭司守护着秘密，直觉引领你走向内心深处。",
  3: "花园中繁花盛开，皇后温柔地守护着生命的成长，丰饶与爱意在她的怀抱中流淌。",
  4: "坚实的王座上，皇帝目光坚定，权杖在手，他用秩序与规则守护着自己的疆土。",
  5: "古老的神殿里，教皇传递着智慧与信仰，传统的力量在仪式中延续。",
  6: "两颗心在花园中相遇，面对选择，爱与责任交织，命运的分岔路口等待你的决定。",
  7: "驾驭黑白双马，穿越风暴，唯有坚定的意志能抵达胜利的彼岸。",
  8: "少女温柔地抚摸着狮子的鬃毛，柔和的力量胜过一切蛮力，勇气源自内心的平静。",
  9: "夜色中，隐者举起灯笼，独自踏上寻找真理的旅途，智慧在孤独中闪闪发光。",
  10: "巨大的轮盘在天空中转动，命运的齿轮咔嚓作响，变化即将到来，机遇与挑战并存。",
  11: "天平在正义女神手中保持平衡，真相的利剑划破迷雾，公正将得到伸张。",
  12: "倒悬的智者在树上沉思，换个角度看世界，牺牲与等待中蕴含着深刻的领悟。",
  13: "死神骑着白马缓缓走来，不是终结而是转化，旧的消逝为新的诞生让路。",
  14: "天使在溪水边调和两壶清泉，平衡与耐心让你在纷扰中找到内心的安宁。",
  15: "恶魔的锁链看似牢固，实则虚幻，束缚你的往往是内心的恐惧与欲望。",
  16: "高塔在雷电中轰然倒塌，虚假的根基被摧毁，真相在废墟中重新建立。",
  17: "星光洒向大地，少女在池边倒水，希望如甘露般滋润着干涸的心田。",
  18: "月亮高悬，狼嚎声起，幻象与真实交织，直觉在迷雾中指引方向。",
  19: "太阳升起，孩童在花园中欢笑，纯真的喜悦照亮一切，成功与幸福触手可及。",
  20: "号角响起，沉睡的灵魂苏醒，过往的经历化为觉醒的力量，迎接新生。",
  21: "你在宇宙的舞台上旋转，旅程圆满，收获属于自己的荣耀与自由。"
};

// 小阿尔卡纳各花色的故事主题
const suitThemes = {
  wands: {
    element: "火",
    theme: "激情与创造",
    stories: {
      1: "权杖从云中伸出，新的创意如火花般迸发，行动的时刻已经到来。",
      2: "站在城堡上眺望远方，手握权杖，世界在你的掌控之中，计划正在酝酿。",
      3: "商人望向海港，船只即将启航，合作与扩展带来新的机遇。",
      4: "四根权杖搭建起庆祝的拱门，家庭和睦，成就值得庆贺。",
      5: "五个年轻人挥舞权杖，竞争激烈但充满活力，冲突中孕育着成长。",
      6: "骑士高举权杖凯旋归来，胜利的桂冠戴在头上，努力终有回报。",
      7: "山顶上的勇士手持权杖，面对挑战毫不退缩，坚持就是胜利。",
      8: "八根权杖如箭矢般飞向目标，快速的行动带来迅猛的进展。",
      9: "伤痕累累的战士依然坚守，最后的防线考验着你的意志。",
      10: "重担压身但目标在望，承担责任虽然辛苦，成功就在前方。",
      11: "权杖骑士策马奔腾，冲动与热情驱使着前进的步伐。",
      12: "权杖王后手持向日葵，温暖的能量感染着周围的一切。",
      13: "权杖国王坐在火焰王座上，领导力与远见指引着团队前进。",
      14: "权杖侍从手持嫩绿的权杖，新的想法如春芽般破土而出。"
    }
  },
  cups: {
    element: "水",
    theme: "情感与直觉",
    stories: {
      1: "圣杯从云中降下，爱与灵感如甘露般注入心田，情感的新篇章开启。",
      2: "两人举杯相对，心灵的交流超越言语，真挚的情感在此刻绽放。",
      3: "三个朋友举杯庆祝，友谊的温暖如阳光般洒向大地。",
      4: "树下沉思的人对眼前的圣杯视而不见，内心的不满需要新的视角。",
      5: "三杯倾倒，两杯依然挺立，失去中蕴含着希望，悲伤终将过去。",
      6: "孩童在花园中嬉戏，纯真的快乐唤起心中最美好的回忆。",
      7: "云中浮现七个圣杯，幻想与现实交织，选择需要清醒的头脑。",
      8: "背影渐行渐远，八个圣杯被抛在身后，寻找更高层次的满足。",
      9: "满足的商人坐在九个圣杯前，愿望成真，内心充满感恩。",
      10: "彩虹下的家庭其乐融融，十个圣杯象征着情感的圆满与幸福。",
      11: "圣杯骑士手持圣杯，浪漫的理想主义驱使着追求完美的爱。",
      12: "圣杯王后坐在海边，直觉如潮水般涌来，情感的智慧指引方向。",
      13: "圣杯国王在波涛中保持平静，情感的成熟带来内心的安宁。",
      14: "圣杯侍从手捧圣杯，纯真的心灵如清泉般透明无瑕。"
    }
  },
  swords: {
    element: "风",
    theme: "思维与挑战",
    stories: {
      1: "利剑刺破云层，真相如闪电般划破黑暗，清晰的思维带来突破。",
      2: "蒙眼的女子手持双剑，在迷茫中寻找平衡，决定需要内心的声音。",
      3: "心脏被三剑刺穿，痛苦虽然深刻，但治愈的过程已经开始。",
      4: "骑士在石棺上安息，暂时的休息为下一次战斗积蓄力量。",
      5: "胜利者收集败者的剑，冲突的代价沉重，反思比胜利更重要。",
      6: "船夫载着乘客渡过平静的水面，困境正在远去，平静即将到来。",
      7: "小偷在夜色中潜行，策略与技巧有时比正面对抗更有效。",
      8: "被剑围困的女子，束缚往往来自内心的恐惧，解脱需要勇气。",
      9: "噩梦中惊醒的人，焦虑如影随形，但黎明总会到来。",
      10: "背部插满利剑的身影，背叛的痛苦深入骨髓，但这也是结束。",
      11: "宝剑骑士策马冲锋，理智与冲动并存，行动需要智慧的指引。",
      12: "宝剑王后高举利剑，独立与坚强是她最美的装饰。",
      13: "宝剑国王端坐王座，公正与智慧是他统治的基石。",
      14: "宝剑侍从举剑向天，年轻的心灵渴望真理与正义。"
    }
  },
  pentacles: {
    element: "土",
    theme: "物质与实现",
    stories: {
      1: "金币从云中显现，新的机会如种子般落地，物质的丰收即将开始。",
      2: "杂耍者抛接两枚金币，平衡各种责任需要灵活的技巧。",
      3: "工匠在教堂中雕刻，专业的技能得到认可，合作带来成功。",
      4: "守财奴紧抱金币，过度的保守可能错失成长的机会。",
      5: "雪夜中的乞丐路过教堂，困难是暂时的，帮助就在身边。",
      6: "商人用天平称量金币，公平的交易建立信任的基础。",
      7: "农夫望着茂盛的葡萄藤，耐心的等待即将迎来丰收的季节。",
      8: "工匠专心雕刻星币，精益求精的态度是成功的关键。",
      9: "贵妇在花园中享受成果，独立与优雅是努力的回报。",
      10: "三代同堂的富裕家庭，财富的传承需要智慧的管理。",
      11: "星币骑士手持金币，稳重与可靠是他最大的优势。",
      12: "星币王后手捧金币，慷慨与实用的智慧指引着生活。",
      13: "星币国王坐在丰饶的花园中，成功与慷慨是他的标志。",
      14: "星币侍从专注地研究金币，学习与实践是成长的阶梯。"
    }
  }
};

// 生成完整的塔罗牌数据
function generateStoryTarotData() {
  const cards = [];
  
  // 大阿尔卡纳 (0-21)
  const majorArcanaNames = [
    { name: "The Fool", chinese: "愚者", element: "air" },
    { name: "The Magician", chinese: "魔术师", element: "air" },
    { name: "The High Priestess", chinese: "女祭司", element: "water" },
    { name: "The Empress", chinese: "皇后", element: "earth" },
    { name: "The Emperor", chinese: "皇帝", element: "fire" },
    { name: "The Hierophant", chinese: "教皇", element: "earth" },
    { name: "The Lovers", chinese: "恋人", element: "air" },
    { name: "The Chariot", chinese: "战车", element: "water" },
    { name: "Strength", chinese: "力量", element: "fire" },
    { name: "The Hermit", chinese: "隐者", element: "earth" },
    { name: "Wheel of Fortune", chinese: "命运之轮", element: "fire" },
    { name: "Justice", chinese: "正义", element: "air" },
    { name: "The Hanged Man", chinese: "倒吊人", element: "water" },
    { name: "Death", chinese: "死神", element: "water" },
    { name: "Temperance", chinese: "节制", element: "fire" },
    { name: "The Devil", chinese: "恶魔", element: "earth" },
    { name: "The Tower", chinese: "塔", element: "fire" },
    { name: "The Star", chinese: "星星", element: "air" },
    { name: "The Moon", chinese: "月亮", element: "water" },
    { name: "The Sun", chinese: "太阳", element: "fire" },
    { name: "Judgement", chinese: "审判", element: "fire" },
    { name: "The World", chinese: "世界", element: "earth" }
  ];

  majorArcanaNames.forEach((card, index) => {
    cards.push({
      id: index,
      name: card.name,
      chineseName: card.chinese,
      category: 'major',
      element: card.element,
      storyInterpretation: majorArcanaStories[index],
      keywords: getKeywordsForMajor(index),
      imageUrl: `/static/tarot/- ${index.toString().padStart(2, '0')}_${card.name.toLowerCase().replace(/\s+/g, '_')}_jpg (${card.chinese}).png`
    });
  });

  // 小阿尔卡纳 (22-77)
  const suits = ['wands', 'cups', 'swords', 'pentacles'];
  const suitChinese = { wands: '权杖', cups: '圣杯', swords: '宝剑', pentacles: '星币' };
  const numbers = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
  const numbersChinese = ['王牌', '二', '三', '四', '五', '六', '七', '八', '九', '十', '侍从', '骑士', '王后', '国王'];

  let cardId = 22;
  suits.forEach(suit => {
    numbers.forEach((number, numIndex) => {
      const storyIndex = numIndex + 1; // 故事索引从1开始
      cards.push({
        id: cardId,
        name: `${number} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
        chineseName: `${suitChinese[suit]}${numbersChinese[numIndex]}`,
        category: 'minor',
        suit: suit,
        number: numIndex + 1,
        element: getSuitElement(suit),
        storyInterpretation: suitThemes[suit].stories[storyIndex],
        keywords: getKeywordsForMinor(suit, numIndex + 1),
        imageUrl: `/static/tarot/${suit}/${number.toLowerCase()}_of_${suit}.png`
      });
      cardId++;
    });
  });

  return cards;
}

// 获取大阿尔卡纳关键词
function getKeywordsForMajor(index) {
  const majorKeywords = {
    0: ["新开始", "冒险精神", "纯真", "自由", "无限可能"],
    1: ["创造力", "意志力", "技能", "实现", "沟通"],
    2: ["直觉", "潜意识", "神秘", "内在智慧", "精神"],
    3: ["丰饶", "母性", "创造", "自然", "丰收"],
    4: ["权威", "稳定", "领导", "结构", "父权"],
    5: ["传统", "信仰", "教导", "精神导师", "智慧"],
    6: ["爱情", "关系", "选择", "和谐", "结合"],
    7: ["胜利", "意志力", "控制", "前进", "决心"],
    8: ["内在力量", "勇气", "耐心", "自控", "温柔"],
    9: ["内省", "寻找", "指导", "智慧", "孤独"],
    10: ["变化", "循环", "命运", "机会", "转折"],
    11: ["公正", "平衡", "真相", "法律", "道德"],
    12: ["牺牲", "等待", "换位思考", "暂停", "领悟"],
    13: ["转化", "结束", "重生", "释放", "变革"],
    14: ["平衡", "调和", "耐心", "治愈", "节制"],
    15: ["束缚", "诱惑", "物质主义", "恐惧", "依赖"],
    16: ["突然变化", "觉醒", "解放", "启示", "破坏"],
    17: ["希望", "灵感", "指引", "平静", "信仰"],
    18: ["幻象", "直觉", "潜意识", "恐惧", "迷惑"],
    19: ["成功", "喜悦", "活力", "乐观", "成就"],
    20: ["觉醒", "重生", "宽恕", "内在呼唤", "判断"],
    21: ["完成", "成就", "旅程结束", "圆满", "成功"]
  };
  return majorKeywords[index] || [];
}

// 获取花色对应的英文元素
function getSuitElement(suit) {
  const suitElements = {
    'wands': 'fire',
    'cups': 'water', 
    'swords': 'air',
    'pentacles': 'earth'
  };
  return suitElements[suit] || 'earth';
}

// 获取小阿尔卡纳关键词
function getKeywordsForMinor(suit, number) {
  const suitKeywords = {
    wands: {
      1: ["新开始", "创意", "灵感", "潜力", "机会"],
      2: ["计划", "远见", "控制", "个人力量", "未来"],
      3: ["扩展", "远见", "领导", "合作", "贸易"],
      4: ["庆祝", "和谐", "稳定", "家庭", "成就"],
      5: ["竞争", "冲突", "挑战", "分歧", "混乱"],
      6: ["胜利", "成功", "认可", "进步", "自信"],
      7: ["挑战", "竞争", "坚持", "勇气", "防御"],
      8: ["快速行动", "进展", "消息", "旅行", "急速"],
      9: ["坚持", "韧性", "防御", "毅力", "边界"],
      10: ["负担", "责任", "压力", "成功", "目标"],
      11: ["冲动", "冒险", "热情", "鲁莽", "行动"],
      12: ["创造力", "热情", "自信", "慷慨", "温暖"],
      13: ["领导", "远见", "成熟", "控制", "企业家精神"],
      14: ["热情", "冲动", "学习", "消息", "新想法"]
    },
    cups: {
      1: ["新爱情", "情感开始", "直觉", "灵性", "创造力"],
      2: ["伙伴关系", "爱情", "友谊", "合作", "平衡"],
      3: ["友谊", "庆祝", "创造力", "合作", "社区"],
      4: ["冷漠", "沉思", "重新评估", "内省", "不满"],
      5: ["失望", "悲伤", "后悔", "失落", "专注剩余"],
      6: ["怀旧", "童年", "纯真", "快乐回忆", "给予"],
      7: ["幻想", "选择", "愿望", "想象", "机会"],
      8: ["放弃", "寻找", "失望", "撤退", "内心召唤"],
      9: ["满足", "幸福", "愿望成真", "感恩", "奢华"],
      10: ["幸福", "和谐", "情感满足", "家庭", "关系"],
      11: ["浪漫", "理想主义", "敏感", "创造力", "直觉"],
      12: ["直觉", "情感成熟", "同情", "平静", "内在知识"],
      13: ["情感平衡", "同情", "外交", "冷静", "慷慨"],
      14: ["情感新开始", "创造力", "直觉", "艺术", "敏感"]
    },
    swords: {
      1: ["新想法", "心理清晰", "突破", "沟通", "真相"],
      2: ["困难决定", "平衡", "僵局", "选择", "和平"],
      3: ["心碎", "悲伤", "痛苦", "分离", "悲伤"],
      4: ["休息", "沉思", "恢复", "和平", "静止"],
      5: ["冲突", "失败", "不和谐", "失败", "羞耻"],
      6: ["过渡", "改变", "旅行", "搬家", "恢复"],
      7: ["欺骗", "策略", "偷窃", "逃避", "单独行动"],
      8: ["限制", "束缚", "受害者心态", "无力", "困境"],
      9: ["焦虑", "担忧", "恐惧", "噩梦", "内疚"],
      10: ["背叛", "痛苦", "失败", "结束", "底部"],
      11: ["冲动", "鲁莽", "不耐烦", "缺乏方向", "行动"],
      12: ["独立", "坚强", "直接", "公正", "清晰"],
      13: ["权威", "清晰思维", "智力力量", "真相", "公正"],
      14: ["好奇", "渴望学习", "新想法", "沟通", "警觉"]
    },
    pentacles: {
      1: ["新机会", "表现", "新工作", "金钱", "健康"],
      2: ["平衡", "适应性", "时间管理", "优先级", "灵活性"],
      3: ["团队合作", "学习", "实施", "建设", "合作"],
      4: ["安全", "控制", "保守", "占有", "稳定"],
      5: ["经济困难", "不安全", "担忧", "孤立", "失业"],
      6: ["慷慨", "分享", "公平", "社区", "感恩"],
      7: ["长期视野", "毅力", "投资", "努力工作", "进展"],
      8: ["技能发展", "勤奋", "熟练", "质量", "细节"],
      9: ["独立", "自给自足", "奢华", "成功", "成就"],
      10: ["财富", "遗产", "家庭", "建立", "长期成功"],
      11: ["实用", "可靠", "努力工作", "承诺", "常识"],
      12: ["实用", "慷慨", "安全", "独立", "资源丰富"],
      13: ["成功", "领导", "安全", "纪律", "控制"],
      14: ["雄心", "渴望", "勤奋", "目标", "表现"]
    }
  };
  return suitKeywords[suit]?.[number] || [];
}

// 生成TypeScript文件内容
function generateTypeScriptFile(cards) {
  const content = `/**
 * 包含故事化解读的完整78张塔罗牌数据
 * 每张牌都有独特的、富有画面感和故事性的固定解读
 * 生成时间: ${new Date().toLocaleString('zh-CN')}
 */

export interface StoryTarotCard {
  id: number;
  name: string;
  chineseName: string;
  category: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number?: number;
  keywords: string[];
  element: 'fire' | 'water' | 'air' | 'earth';
  storyInterpretation: string;
  imageUrl: string;
}

export const storyTarotDeck: StoryTarotCard[] = ${JSON.stringify(cards, null, 2)};

// 工具函数
export function getStoryCardById(id: number): StoryTarotCard | undefined {
  return storyTarotDeck.find(card => card.id === id);
}

export function getStoryCardsByCategory(category: 'major' | 'minor'): StoryTarotCard[] {
  return storyTarotDeck.filter(card => card.category === category);
}

export function getStoryCardsBySuit(suit: 'wands' | 'cups' | 'swords' | 'pentacles'): StoryTarotCard[] {
  return storyTarotDeck.filter(card => card.suit === suit);
}

export function shuffleStoryDeck(): StoryTarotCard[] {
  const shuffled = [...storyTarotDeck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function drawStoryCards(count: number): StoryTarotCard[] {
  const shuffled = shuffleStoryDeck();
  return shuffled.slice(0, count);
}

export function validateStoryTarotDeck(): { 
  isComplete: boolean; 
  missing: string[]; 
  total: number;
  majorCount: number;
  minorCount: number;
  storiesCount: number;
} {
  const missing: string[] = [];
  const majorCards = getStoryCardsByCategory('major');
  const minorCards = getStoryCardsByCategory('minor');
  const cardsWithStories = storyTarotDeck.filter(card => card.storyInterpretation && card.storyInterpretation.length > 0);
  
  // 检查大阿尔卡纳 (应该有22张)
  if (majorCards.length !== 22) {
    missing.push(\`大阿尔卡纳缺失: 应有22张，实际\${majorCards.length}张\`);
  }
  
  // 检查小阿尔卡纳 (应该有56张)
  if (minorCards.length !== 56) {
    missing.push(\`小阿尔卡纳缺失: 应有56张，实际\${minorCards.length}张\`);
  }
  
  // 检查故事解读
  if (cardsWithStories.length !== 78) {
    missing.push(\`故事解读缺失: 应有78个，实际\${cardsWithStories.length}个\`);
  }
  
  return {
    isComplete: missing.length === 0,
    missing,
    total: storyTarotDeck.length,
    majorCount: majorCards.length,
    minorCount: minorCards.length,
    storiesCount: cardsWithStories.length
  };
}

// 获取随机故事解读
export function getRandomStoryInterpretation(): string {
  const randomCard = storyTarotDeck[Math.floor(Math.random() * storyTarotDeck.length)];
  return randomCard.storyInterpretation;
}

// 按元素分组
export function getStoryCardsByElement(element: 'fire' | 'water' | 'air' | 'earth'): StoryTarotCard[] {
  return storyTarotDeck.filter(card => card.element === element);
}
`;

  return content;
}

// 主函数
function main() {
  console.log('🎨 开始生成故事化塔罗牌数据...');
  
  try {
    // 生成数据
    const cards = generateStoryTarotData();
    console.log(`✅ 成功生成 ${cards.length} 张塔罗牌数据`);
    
    // 生成TypeScript文件
    const tsContent = generateTypeScriptFile(cards);
    const outputPath = path.join(__dirname, '..', 'src', 'features', 'tarot', 'utils', 'storyTarotData.ts');
    
    // 确保目录存在
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // 写入文件
    fs.writeFileSync(outputPath, tsContent, 'utf8');
    console.log(`📝 数据文件已生成: ${outputPath}`);
    
    // 验证数据
    const majorCount = cards.filter(c => c.category === 'major').length;
    const minorCount = cards.filter(c => c.category === 'minor').length;
    const storiesCount = cards.filter(c => c.storyInterpretation && c.storyInterpretation.length > 0).length;
    
    console.log('\n📊 数据统计:');
    console.log(`  总牌数: ${cards.length}/78`);
    console.log(`  大阿尔卡纳: ${majorCount}/22`);
    console.log(`  小阿尔卡纳: ${minorCount}/56`);
    console.log(`  故事解读: ${storiesCount}/78`);
    
    if (cards.length === 78 && majorCount === 22 && minorCount === 56 && storiesCount === 78) {
      console.log('\n🎉 所有数据生成完成！每张牌都有独特的故事化解读。');
    } else {
      console.log('\n⚠️ 数据可能不完整，请检查。');
    }
    
  } catch (error) {
    console.error('❌ 生成过程中出现错误:', error);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { generateStoryTarotData, generateTypeScriptFile };