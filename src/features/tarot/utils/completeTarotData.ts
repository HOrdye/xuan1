/**
 * 完整的78张标准塔罗牌数据
 * 自动生成 - 请勿手动修改
 */

export interface CompleteTarotCard {
  id: number;
  name: string;
  chineseName: string;
  category: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number?: number;
  keywords: string[];
  element: 'fire' | 'water' | 'air' | 'earth';
  imageUrl: string;
}

export const completeTarotDeck: CompleteTarotCard[] = [
  {
    "id": 0,
    "name": "The Fool",
    "chineseName": "愚者",
    "keywords": [
      "新开始",
      "冒险精神",
      "纯真",
      "自由",
      "无限可能"
    ],
    "category": "major",
    "element": "air",
    "imageUrl": "/static/tarot/- 00_fool_jpg (愚者).png"
  },
  {
    "id": 1,
    "name": "The Magician",
    "chineseName": "魔术师",
    "keywords": [
      "创造力",
      "意志力",
      "技能",
      "实现",
      "沟通"
    ],
    "category": "major",
    "element": "air",
    "imageUrl": "/static/tarot/- 01_magician_jpg (魔术师).png"
  },
  {
    "id": 2,
    "name": "The High Priestess",
    "chineseName": "女祭司",
    "keywords": [
      "直觉",
      "潜意识",
      "神秘",
      "内在智慧",
      "精神"
    ],
    "category": "major",
    "element": "water",
    "imageUrl": "/static/tarot/- 02_high_priestess_jpg (女祭司).png"
  },
  {
    "id": 3,
    "name": "The Empress",
    "chineseName": "皇后",
    "keywords": [
      "丰饶",
      "母性",
      "创造",
      "自然",
      "丰收"
    ],
    "category": "major",
    "element": "earth",
    "imageUrl": "/static/tarot/- 03_empress_jpg (皇后).png"
  },
  {
    "id": 4,
    "name": "The Emperor",
    "chineseName": "皇帝",
    "keywords": [
      "权威",
      "稳定",
      "领导",
      "结构",
      "父权"
    ],
    "category": "major",
    "element": "fire",
    "imageUrl": "/static/tarot/- 04_emperor_jpg (皇帝).png"
  },
  {
    "id": 5,
    "name": "The Hierophant",
    "chineseName": "教皇",
    "keywords": [
      "传统",
      "信仰",
      "教导",
      "精神导师",
      "智慧"
    ],
    "category": "major",
    "element": "earth",
    "imageUrl": "/static/tarot/- 05_hierophant_jpg (教皇).png"
  },
  {
    "id": 6,
    "name": "The Lovers",
    "chineseName": "恋人",
    "keywords": [
      "爱情",
      "关系",
      "选择",
      "和谐",
      "结合"
    ],
    "category": "major",
    "element": "air",
    "imageUrl": "/static/tarot/- 06_lovers_jpg (恋人).png"
  },
  {
    "id": 7,
    "name": "The Chariot",
    "chineseName": "战车",
    "keywords": [
      "胜利",
      "意志力",
      "控制",
      "前进",
      "决心"
    ],
    "category": "major",
    "element": "water",
    "imageUrl": "/static/tarot/- 07_chariot_jpg (战车).png"
  },
  {
    "id": 8,
    "name": "Strength",
    "chineseName": "力量",
    "keywords": [
      "内在力量",
      "勇气",
      "耐心",
      "自控",
      "温柔"
    ],
    "category": "major",
    "element": "fire",
    "imageUrl": "/static/tarot/- 08_strength_jpg (力量).png"
  },
  {
    "id": 9,
    "name": "The Hermit",
    "chineseName": "隐者",
    "keywords": [
      "内省",
      "寻找",
      "指导",
      "智慧",
      "孤独"
    ],
    "category": "major",
    "element": "earth",
    "imageUrl": "/static/tarot/- 09_hermit_jpg (隐者).png"
  },
  {
    "id": 10,
    "name": "Wheel of Fortune",
    "chineseName": "命运之轮",
    "keywords": [
      "变化",
      "循环",
      "命运",
      "机会",
      "转折"
    ],
    "category": "major",
    "element": "fire",
    "imageUrl": "/static/tarot/- 10_wheel_of_fortune_jpg (命运之轮).png"
  },
  {
    "id": 11,
    "name": "Justice",
    "chineseName": "正义",
    "keywords": [
      "公正",
      "平衡",
      "真相",
      "法律",
      "道德"
    ],
    "category": "major",
    "element": "air",
    "imageUrl": "/static/tarot/- 11_justice_jpg (正义).png"
  },
  {
    "id": 12,
    "name": "The Hanged Man",
    "chineseName": "倒吊人",
    "keywords": [
      "牺牲",
      "等待",
      "新视角",
      "放手",
      "暂停"
    ],
    "category": "major",
    "element": "water",
    "imageUrl": "/static/tarot/- 12_hanged_man_jpg (倒吊人).png"
  },
  {
    "id": 13,
    "name": "Death",
    "chineseName": "死神",
    "keywords": [
      "转变",
      "结束",
      "重生",
      "释放",
      "新开始"
    ],
    "category": "major",
    "element": "water",
    "imageUrl": "/static/tarot/- 13_death_jpg (死神).png"
  },
  {
    "id": 14,
    "name": "Temperance",
    "chineseName": "节制",
    "keywords": [
      "平衡",
      "调和",
      "耐心",
      "适度",
      "治愈"
    ],
    "category": "major",
    "element": "fire",
    "imageUrl": "/static/tarot/- 14_temperance_jpg (节制).png"
  },
  {
    "id": 15,
    "name": "The Devil",
    "chineseName": "恶魔",
    "keywords": [
      "束缚",
      "诱惑",
      "物质",
      "依赖",
      "阴影"
    ],
    "category": "major",
    "element": "earth",
    "imageUrl": "/static/tarot/- 15_devil_jpg (恶魔).png"
  },
  {
    "id": 16,
    "name": "The Tower",
    "chineseName": "塔",
    "keywords": [
      "突变",
      "破坏",
      "启示",
      "解放",
      "觉醒"
    ],
    "category": "major",
    "element": "fire",
    "imageUrl": "/static/tarot/- 16_tower_jpg (塔).png"
  },
  {
    "id": 17,
    "name": "The Star",
    "chineseName": "星星",
    "keywords": [
      "希望",
      "灵感",
      "治愈",
      "指引",
      "信仰"
    ],
    "category": "major",
    "element": "air",
    "imageUrl": "/static/tarot/- 17_star_jpg (星星).png"
  },
  {
    "id": 18,
    "name": "The Moon",
    "chineseName": "月亮",
    "keywords": [
      "幻象",
      "直觉",
      "恐惧",
      "潜意识",
      "迷惑"
    ],
    "category": "major",
    "element": "water",
    "imageUrl": "/static/tarot/- 18_moon_jpg (月亮).png"
  },
  {
    "id": 19,
    "name": "The Sun",
    "chineseName": "太阳",
    "keywords": [
      "成功",
      "快乐",
      "活力",
      "真相",
      "成就"
    ],
    "category": "major",
    "element": "fire",
    "imageUrl": "/static/tarot/- 19_sun_jpg (太阳).png"
  },
  {
    "id": 20,
    "name": "Judgement",
    "chineseName": "审判",
    "keywords": [
      "重生",
      "觉醒",
      "宽恕",
      "救赎",
      "新生"
    ],
    "category": "major",
    "element": "fire",
    "imageUrl": "/static/tarot/- 20_judgement_jpg (审判).png"
  },
  {
    "id": 21,
    "name": "The World",
    "chineseName": "世界",
    "keywords": [
      "完成",
      "成就",
      "圆满",
      "成功",
      "统一"
    ],
    "category": "major",
    "element": "earth",
    "imageUrl": "/static/tarot/- 21_world_jpg (世界).png"
  },
  {
    "id": 22,
    "name": "Ace of Wands",
    "chineseName": "权杖王牌",
    "category": "minor",
    "suit": "wands",
    "number": 1,
    "element": "fire",
    "keywords": [
      "创造",
      "热情",
      "行动",
      "事业",
      "能量",
      "新开始",
      "潜能",
      "机会"
    ],
    "imageUrl": "/static/tarot/- 22_wands_ace_jpg (权杖王牌 Ace of Wands).png"
  },
  {
    "id": 23,
    "name": "Two of Wands",
    "chineseName": "权杖二",
    "category": "minor",
    "suit": "wands",
    "number": 2,
    "element": "fire",
    "keywords": [
      "创造",
      "热情",
      "行动",
      "事业",
      "能量",
      "平衡",
      "选择",
      "合作"
    ],
    "imageUrl": "/static/tarot/- 23_wands_2_jpg (权杖二 Two of Wands).png"
  },
  {
    "id": 24,
    "name": "Three of Wands",
    "chineseName": "权杖三",
    "category": "minor",
    "suit": "wands",
    "number": 3,
    "element": "fire",
    "keywords": [
      "创造",
      "热情",
      "行动",
      "事业",
      "能量",
      "创造",
      "成长",
      "表达"
    ],
    "imageUrl": "/static/tarot/- 24_wands_3_jpg (权杖三 Three of Wands).png"
  },
  {
    "id": 25,
    "name": "Four of Wands",
    "chineseName": "权杖四",
    "category": "minor",
    "suit": "wands",
    "number": 4,
    "element": "fire",
    "keywords": [
      "创造",
      "热情",
      "行动",
      "事业",
      "能量",
      "稳定",
      "基础",
      "结构"
    ],
    "imageUrl": "/static/tarot/- 25_wands_4_jpg (权杖四 Four of Wands).png"
  },
  {
    "id": 26,
    "name": "Five of Wands",
    "chineseName": "权杖五",
    "category": "minor",
    "suit": "wands",
    "number": 5,
    "element": "fire",
    "keywords": [
      "创造",
      "热情",
      "行动",
      "事业",
      "能量",
      "挑战",
      "冲突",
      "变化"
    ],
    "imageUrl": "/static/tarot/- 26_wands_5_jpg (权杖五 Five of Wands).png"
  },
  {
    "id": 27,
    "name": "Six of Wands",
    "chineseName": "权杖六",
    "category": "minor",
    "suit": "wands",
    "number": 6,
    "element": "fire",
    "keywords": [
      "创造",
      "热情",
      "行动",
      "事业",
      "能量",
      "和谐",
      "给予",
      "平衡"
    ],
    "imageUrl": "/static/tarot/- 27_wands_6_jpg (权杖六 Six of Wands).png"
  },
  {
    "id": 28,
    "name": "Seven of Wands",
    "chineseName": "权杖七",
    "category": "minor",
    "suit": "wands",
    "number": 7,
    "element": "fire",
    "keywords": [
      "创造",
      "热情",
      "行动",
      "事业",
      "能量",
      "评估",
      "耐心",
      "坚持"
    ],
    "imageUrl": "/static/tarot/- 28_wands_7_jpg (权杖七 Seven of Wands).png"
  },
  {
    "id": 29,
    "name": "Eight of Wands",
    "chineseName": "权杖八",
    "category": "minor",
    "suit": "wands",
    "number": 8,
    "element": "fire",
    "keywords": [
      "创造",
      "热情",
      "行动",
      "事业",
      "能量",
      "掌握",
      "技能",
      "努力"
    ],
    "imageUrl": "/static/tarot/- 29_wands_8_jpg (权杖八 Eight of Wands).png"
  },
  {
    "id": 30,
    "name": "Nine of Wands",
    "chineseName": "权杖九",
    "category": "minor",
    "suit": "wands",
    "number": 9,
    "element": "fire",
    "keywords": [
      "创造",
      "热情",
      "行动",
      "事业",
      "能量",
      "完成",
      "满足",
      "成就"
    ],
    "imageUrl": "/static/tarot/- 30_wands_9_jpg (权杖九 Nine of Wands).png"
  },
  {
    "id": 31,
    "name": "Ten of Wands",
    "chineseName": "权杖十",
    "category": "minor",
    "suit": "wands",
    "number": 10,
    "element": "fire",
    "keywords": [
      "创造",
      "热情",
      "行动",
      "事业",
      "能量",
      "圆满",
      "负担",
      "传承"
    ],
    "imageUrl": "/static/tarot/- 31_wands_10_jpg (权杖十 Ten of Wands).png"
  },
  {
    "id": 32,
    "name": "Page of Wands",
    "chineseName": "权杖侍从",
    "category": "minor",
    "suit": "wands",
    "number": 11,
    "element": "fire",
    "keywords": [
      "创造",
      "热情",
      "行动",
      "事业",
      "能量",
      "学习",
      "消息",
      "开始"
    ],
    "imageUrl": "/static/tarot/- 32_wands_page_jpg (权杖侍从 Page of Wands).png"
  },
  {
    "id": 33,
    "name": "Knight of Wands",
    "chineseName": "权杖骑士",
    "category": "minor",
    "suit": "wands",
    "number": 12,
    "element": "fire",
    "keywords": [
      "创造",
      "热情",
      "行动",
      "事业",
      "能量",
      "行动",
      "冒险",
      "追求"
    ],
    "imageUrl": "/static/tarot/- 33_wands_knight_jpg (权杖骑士 Knight of Wands).png"
  },
  {
    "id": 34,
    "name": "Queen of Wands",
    "chineseName": "权杖皇后",
    "category": "minor",
    "suit": "wands",
    "number": 13,
    "element": "fire",
    "keywords": [
      "创造",
      "热情",
      "行动",
      "事业",
      "能量",
      "成熟",
      "关怀",
      "直觉"
    ],
    "imageUrl": "/static/tarot/- 34_wands_queen_jpg (权杖皇后 Queen of Wands).png"
  },
  {
    "id": 35,
    "name": "King of Wands",
    "chineseName": "权杖国王",
    "category": "minor",
    "suit": "wands",
    "number": 14,
    "element": "fire",
    "keywords": [
      "创造",
      "热情",
      "行动",
      "事业",
      "能量",
      "权威",
      "控制",
      "成就"
    ],
    "imageUrl": "/static/tarot/- 35_wands_king_jpg (权杖国王 King of Wands).png"
  },
  {
    "id": 36,
    "name": "Ace of Cups",
    "chineseName": "圣杯王牌",
    "category": "minor",
    "suit": "cups",
    "number": 1,
    "element": "water",
    "keywords": [
      "情感",
      "爱情",
      "直觉",
      "关系",
      "精神",
      "新开始",
      "潜能",
      "机会"
    ],
    "imageUrl": "/static/tarot/- 36_cups_ace_jpg (圣杯王牌 Ace of Cups).png"
  },
  {
    "id": 37,
    "name": "Two of Cups",
    "chineseName": "圣杯二",
    "category": "minor",
    "suit": "cups",
    "number": 2,
    "element": "water",
    "keywords": [
      "情感",
      "爱情",
      "直觉",
      "关系",
      "精神",
      "平衡",
      "选择",
      "合作"
    ],
    "imageUrl": "/static/tarot/- 37_cups_2_jpg (圣杯二 Two of Cups).png"
  },
  {
    "id": 38,
    "name": "Three of Cups",
    "chineseName": "圣杯三",
    "category": "minor",
    "suit": "cups",
    "number": 3,
    "element": "water",
    "keywords": [
      "情感",
      "爱情",
      "直觉",
      "关系",
      "精神",
      "创造",
      "成长",
      "表达"
    ],
    "imageUrl": "/static/tarot/- 38_cups_3_jpg (圣杯三 Three of Cups).png"
  },
  {
    "id": 39,
    "name": "Four of Cups",
    "chineseName": "圣杯四",
    "category": "minor",
    "suit": "cups",
    "number": 4,
    "element": "water",
    "keywords": [
      "情感",
      "爱情",
      "直觉",
      "关系",
      "精神",
      "稳定",
      "基础",
      "结构"
    ],
    "imageUrl": "/static/tarot/- 39_cups_4_jpg (圣杯四 Four of Cups).png"
  },
  {
    "id": 40,
    "name": "Five of Cups",
    "chineseName": "圣杯五",
    "category": "minor",
    "suit": "cups",
    "number": 5,
    "element": "water",
    "keywords": [
      "情感",
      "爱情",
      "直觉",
      "关系",
      "精神",
      "挑战",
      "冲突",
      "变化"
    ],
    "imageUrl": "/static/tarot/- 40_cups_5_jpg (圣杯五 Five of Cups).png"
  },
  {
    "id": 41,
    "name": "Six of Cups",
    "chineseName": "圣杯六",
    "category": "minor",
    "suit": "cups",
    "number": 6,
    "element": "water",
    "keywords": [
      "情感",
      "爱情",
      "直觉",
      "关系",
      "精神",
      "和谐",
      "给予",
      "平衡"
    ],
    "imageUrl": "/static/tarot/- 41_cups_6_jpg (圣杯六 Six of Cups).png"
  },
  {
    "id": 42,
    "name": "Seven of Cups",
    "chineseName": "圣杯七",
    "category": "minor",
    "suit": "cups",
    "number": 7,
    "element": "water",
    "keywords": [
      "情感",
      "爱情",
      "直觉",
      "关系",
      "精神",
      "评估",
      "耐心",
      "坚持"
    ],
    "imageUrl": "/static/tarot/- 42_cups_7_jpg (圣杯七 Seven of Cups).png"
  },
  {
    "id": 43,
    "name": "Eight of Cups",
    "chineseName": "圣杯八",
    "category": "minor",
    "suit": "cups",
    "number": 8,
    "element": "water",
    "keywords": [
      "情感",
      "爱情",
      "直觉",
      "关系",
      "精神",
      "掌握",
      "技能",
      "努力"
    ],
    "imageUrl": "/static/tarot/- 43_cups_8_jpg (圣杯八 Eight of Cups).png"
  },
  {
    "id": 44,
    "name": "Nine of Cups",
    "chineseName": "圣杯九",
    "category": "minor",
    "suit": "cups",
    "number": 9,
    "element": "water",
    "keywords": [
      "情感",
      "爱情",
      "直觉",
      "关系",
      "精神",
      "完成",
      "满足",
      "成就"
    ],
    "imageUrl": "/static/tarot/- 44_cups_9_jpg (圣杯九 Nine of Cups).png"
  },
  {
    "id": 45,
    "name": "Ten of Cups",
    "chineseName": "圣杯十",
    "category": "minor",
    "suit": "cups",
    "number": 10,
    "element": "water",
    "keywords": [
      "情感",
      "爱情",
      "直觉",
      "关系",
      "精神",
      "圆满",
      "负担",
      "传承"
    ],
    "imageUrl": "/static/tarot/- 45_cups_10_jpg (圣杯十 Ten of Cups).png"
  },
  {
    "id": 46,
    "name": "Page of Cups",
    "chineseName": "圣杯侍从",
    "category": "minor",
    "suit": "cups",
    "number": 11,
    "element": "water",
    "keywords": [
      "情感",
      "爱情",
      "直觉",
      "关系",
      "精神",
      "学习",
      "消息",
      "开始"
    ],
    "imageUrl": "/static/tarot/- 46_cups_page_jpg (圣杯侍从 Page of Cups).png"
  },
  {
    "id": 47,
    "name": "Knight of Cups",
    "chineseName": "圣杯骑士",
    "category": "minor",
    "suit": "cups",
    "number": 12,
    "element": "water",
    "keywords": [
      "情感",
      "爱情",
      "直觉",
      "关系",
      "精神",
      "行动",
      "冒险",
      "追求"
    ],
    "imageUrl": "/static/tarot/- 47_cups_knight_jpg (圣杯骑士 Knight of Cups).png"
  },
  {
    "id": 48,
    "name": "Queen of Cups",
    "chineseName": "圣杯皇后",
    "category": "minor",
    "suit": "cups",
    "number": 13,
    "element": "water",
    "keywords": [
      "情感",
      "爱情",
      "直觉",
      "关系",
      "精神",
      "成熟",
      "关怀",
      "直觉"
    ],
    "imageUrl": "/static/tarot/- 48_cups_queen_jpg (圣杯皇后 Queen of Cups).png"
  },
  {
    "id": 49,
    "name": "King of Cups",
    "chineseName": "圣杯国王",
    "category": "minor",
    "suit": "cups",
    "number": 14,
    "element": "water",
    "keywords": [
      "情感",
      "爱情",
      "直觉",
      "关系",
      "精神",
      "权威",
      "控制",
      "成就"
    ],
    "imageUrl": "/static/tarot/- 49_cups_king_jpg (圣杯国王 King of Cups).png"
  },
  {
    "id": 50,
    "name": "Ace of Swords",
    "chineseName": "宝剑王牌",
    "category": "minor",
    "suit": "swords",
    "number": 1,
    "element": "air",
    "keywords": [
      "思想",
      "沟通",
      "挑战",
      "冲突",
      "真相",
      "新开始",
      "潜能",
      "机会"
    ],
    "imageUrl": "/static/tarot/- 50_swords_ace_jpg (宝剑王牌 Ace of Swords).png"
  },
  {
    "id": 51,
    "name": "Two of Swords",
    "chineseName": "宝剑二",
    "category": "minor",
    "suit": "swords",
    "number": 2,
    "element": "air",
    "keywords": [
      "思想",
      "沟通",
      "挑战",
      "冲突",
      "真相",
      "平衡",
      "选择",
      "合作"
    ],
    "imageUrl": "/static/tarot/- 51_swords_2_jpg (宝剑二 Two of Swords).png"
  },
  {
    "id": 52,
    "name": "Three of Swords",
    "chineseName": "宝剑三",
    "category": "minor",
    "suit": "swords",
    "number": 3,
    "element": "air",
    "keywords": [
      "思想",
      "沟通",
      "挑战",
      "冲突",
      "真相",
      "创造",
      "成长",
      "表达"
    ],
    "imageUrl": "/static/tarot/- 52_swords_3_jpg (宝剑三 Three of Swords).png"
  },
  {
    "id": 53,
    "name": "Four of Swords",
    "chineseName": "宝剑四",
    "category": "minor",
    "suit": "swords",
    "number": 4,
    "element": "air",
    "keywords": [
      "思想",
      "沟通",
      "挑战",
      "冲突",
      "真相",
      "稳定",
      "基础",
      "结构"
    ],
    "imageUrl": "/static/tarot/- 53_swords_4_jpg (宝剑四 Four of Swords).png"
  },
  {
    "id": 54,
    "name": "Five of Swords",
    "chineseName": "宝剑五",
    "category": "minor",
    "suit": "swords",
    "number": 5,
    "element": "air",
    "keywords": [
      "思想",
      "沟通",
      "挑战",
      "冲突",
      "真相",
      "挑战",
      "冲突",
      "变化"
    ],
    "imageUrl": "/static/tarot/- 54_swords_5_jpg (宝剑五 Five of Swords).png"
  },
  {
    "id": 55,
    "name": "Six of Swords",
    "chineseName": "宝剑六",
    "category": "minor",
    "suit": "swords",
    "number": 6,
    "element": "air",
    "keywords": [
      "思想",
      "沟通",
      "挑战",
      "冲突",
      "真相",
      "和谐",
      "给予",
      "平衡"
    ],
    "imageUrl": "/static/tarot/- 55_swords_6_jpg (宝剑六 Six of Swords).png"
  },
  {
    "id": 56,
    "name": "Seven of Swords",
    "chineseName": "宝剑七",
    "category": "minor",
    "suit": "swords",
    "number": 7,
    "element": "air",
    "keywords": [
      "思想",
      "沟通",
      "挑战",
      "冲突",
      "真相",
      "评估",
      "耐心",
      "坚持"
    ],
    "imageUrl": "/static/tarot/- 56_swords_7_jpg (宝剑七 Seven of Swords).png"
  },
  {
    "id": 57,
    "name": "Eight of Swords",
    "chineseName": "宝剑八",
    "category": "minor",
    "suit": "swords",
    "number": 8,
    "element": "air",
    "keywords": [
      "思想",
      "沟通",
      "挑战",
      "冲突",
      "真相",
      "掌握",
      "技能",
      "努力"
    ],
    "imageUrl": "/static/tarot/- 57_swords_8_jpg (宝剑八 Eight of Swords).png"
  },
  {
    "id": 58,
    "name": "Nine of Swords",
    "chineseName": "宝剑九",
    "category": "minor",
    "suit": "swords",
    "number": 9,
    "element": "air",
    "keywords": [
      "思想",
      "沟通",
      "挑战",
      "冲突",
      "真相",
      "完成",
      "满足",
      "成就"
    ],
    "imageUrl": "/static/tarot/- 58_swords_9_jpg (宝剑九 Nine of Swords).png"
  },
  {
    "id": 59,
    "name": "Ten of Swords",
    "chineseName": "宝剑十",
    "category": "minor",
    "suit": "swords",
    "number": 10,
    "element": "air",
    "keywords": [
      "思想",
      "沟通",
      "挑战",
      "冲突",
      "真相",
      "圆满",
      "负担",
      "传承"
    ],
    "imageUrl": "/static/tarot/- 59_swords_10_jpg (宝剑十 Ten of Swords).png"
  },
  {
    "id": 60,
    "name": "Page of Swords",
    "chineseName": "宝剑侍从",
    "category": "minor",
    "suit": "swords",
    "number": 11,
    "element": "air",
    "keywords": [
      "思想",
      "沟通",
      "挑战",
      "冲突",
      "真相",
      "学习",
      "消息",
      "开始"
    ],
    "imageUrl": "/static/tarot/- 60_swords_page_jpg (宝剑侍从 Page of Swords).png"
  },
  {
    "id": 61,
    "name": "Knight of Swords",
    "chineseName": "宝剑骑士",
    "category": "minor",
    "suit": "swords",
    "number": 12,
    "element": "air",
    "keywords": [
      "思想",
      "沟通",
      "挑战",
      "冲突",
      "真相",
      "行动",
      "冒险",
      "追求"
    ],
    "imageUrl": "/static/tarot/- 61_swords_knight_jpg (宝剑骑士 Knight of Swords).png"
  },
  {
    "id": 62,
    "name": "Queen of Swords",
    "chineseName": "宝剑皇后",
    "category": "minor",
    "suit": "swords",
    "number": 13,
    "element": "air",
    "keywords": [
      "思想",
      "沟通",
      "挑战",
      "冲突",
      "真相",
      "成熟",
      "关怀",
      "直觉"
    ],
    "imageUrl": "/static/tarot/- 62_swords_queen_jpg (宝剑皇后 Queen of Swords).png"
  },
  {
    "id": 63,
    "name": "King of Swords",
    "chineseName": "宝剑国王",
    "category": "minor",
    "suit": "swords",
    "number": 14,
    "element": "air",
    "keywords": [
      "思想",
      "沟通",
      "挑战",
      "冲突",
      "真相",
      "权威",
      "控制",
      "成就"
    ],
    "imageUrl": "/static/tarot/- 63_swords_king_jpg (宝剑国王 King of Swords).png"
  },
  {
    "id": 64,
    "name": "Ace of Pentacles",
    "chineseName": "星币王牌",
    "category": "minor",
    "suit": "pentacles",
    "number": 1,
    "element": "earth",
    "keywords": [
      "物质",
      "金钱",
      "实用",
      "稳定",
      "成就",
      "新开始",
      "潜能",
      "机会"
    ],
    "imageUrl": "/static/tarot/- 64_pentacles_ace_jpg (星币王牌 Ace of Pentacles).png"
  },
  {
    "id": 65,
    "name": "Two of Pentacles",
    "chineseName": "星币二",
    "category": "minor",
    "suit": "pentacles",
    "number": 2,
    "element": "earth",
    "keywords": [
      "物质",
      "金钱",
      "实用",
      "稳定",
      "成就",
      "平衡",
      "选择",
      "合作"
    ],
    "imageUrl": "/static/tarot/- 65_pentacles_2_jpg (星币二 Two of Pentacles).png"
  },
  {
    "id": 66,
    "name": "Three of Pentacles",
    "chineseName": "星币三",
    "category": "minor",
    "suit": "pentacles",
    "number": 3,
    "element": "earth",
    "keywords": [
      "物质",
      "金钱",
      "实用",
      "稳定",
      "成就",
      "创造",
      "成长",
      "表达"
    ],
    "imageUrl": "/static/tarot/- 66_pentacles_3_jpg (星币三 Three of Pentacles).png"
  },
  {
    "id": 67,
    "name": "Four of Pentacles",
    "chineseName": "星币四",
    "category": "minor",
    "suit": "pentacles",
    "number": 4,
    "element": "earth",
    "keywords": [
      "物质",
      "金钱",
      "实用",
      "稳定",
      "成就",
      "稳定",
      "基础",
      "结构"
    ],
    "imageUrl": "/static/tarot/- 67_pentacles_4_jpg (星币四 Four of Pentacles).png"
  },
  {
    "id": 68,
    "name": "Five of Pentacles",
    "chineseName": "星币五",
    "category": "minor",
    "suit": "pentacles",
    "number": 5,
    "element": "earth",
    "keywords": [
      "物质",
      "金钱",
      "实用",
      "稳定",
      "成就",
      "挑战",
      "冲突",
      "变化"
    ],
    "imageUrl": "/static/tarot/- 68_pentacles_5_jpg (星币五 Five of Pentacles).png"
  },
  {
    "id": 69,
    "name": "Six of Pentacles",
    "chineseName": "星币六",
    "category": "minor",
    "suit": "pentacles",
    "number": 6,
    "element": "earth",
    "keywords": [
      "物质",
      "金钱",
      "实用",
      "稳定",
      "成就",
      "和谐",
      "给予",
      "平衡"
    ],
    "imageUrl": "/static/tarot/- 69_pentacles_6_jpg (星币六 Six of Pentacles).png"
  },
  {
    "id": 70,
    "name": "Seven of Pentacles",
    "chineseName": "星币七",
    "category": "minor",
    "suit": "pentacles",
    "number": 7,
    "element": "earth",
    "keywords": [
      "物质",
      "金钱",
      "实用",
      "稳定",
      "成就",
      "评估",
      "耐心",
      "坚持"
    ],
    "imageUrl": "/static/tarot/- 70_pentacles_7_jpg (星币七 Seven of Pentacles).png"
  },
  {
    "id": 71,
    "name": "Eight of Pentacles",
    "chineseName": "星币八",
    "category": "minor",
    "suit": "pentacles",
    "number": 8,
    "element": "earth",
    "keywords": [
      "物质",
      "金钱",
      "实用",
      "稳定",
      "成就",
      "掌握",
      "技能",
      "努力"
    ],
    "imageUrl": "/static/tarot/- 71_pentacles_8_jpg (星币八 Eight of Pentacles).png"
  },
  {
    "id": 72,
    "name": "Nine of Pentacles",
    "chineseName": "星币九",
    "category": "minor",
    "suit": "pentacles",
    "number": 9,
    "element": "earth",
    "keywords": [
      "物质",
      "金钱",
      "实用",
      "稳定",
      "成就",
      "完成",
      "满足",
      "成就"
    ],
    "imageUrl": "/static/tarot/- 72_pentacles_9_jpg (星币九 Nine of Pentacles).png"
  },
  {
    "id": 73,
    "name": "Ten of Pentacles",
    "chineseName": "星币十",
    "category": "minor",
    "suit": "pentacles",
    "number": 10,
    "element": "earth",
    "keywords": [
      "物质",
      "金钱",
      "实用",
      "稳定",
      "成就",
      "圆满",
      "负担",
      "传承"
    ],
    "imageUrl": "/static/tarot/- 73_pentacles_10_jpg (星币十 Ten of Pentacles).png"
  },
  {
    "id": 74,
    "name": "Page of Pentacles",
    "chineseName": "星币侍从",
    "category": "minor",
    "suit": "pentacles",
    "number": 11,
    "element": "earth",
    "keywords": [
      "物质",
      "金钱",
      "实用",
      "稳定",
      "成就",
      "学习",
      "消息",
      "开始"
    ],
    "imageUrl": "/static/tarot/- 74_pentacles_page_jpg (星币侍从 Page of Pentacles).png"
  },
  {
    "id": 75,
    "name": "Knight of Pentacles",
    "chineseName": "星币骑士",
    "category": "minor",
    "suit": "pentacles",
    "number": 12,
    "element": "earth",
    "keywords": [
      "物质",
      "金钱",
      "实用",
      "稳定",
      "成就",
      "行动",
      "冒险",
      "追求"
    ],
    "imageUrl": "/static/tarot/- 75_pentacles_knight_jpg (星币骑士 Knight of Pentacles).png"
  },
  {
    "id": 76,
    "name": "Queen of Pentacles",
    "chineseName": "星币皇后",
    "category": "minor",
    "suit": "pentacles",
    "number": 13,
    "element": "earth",
    "keywords": [
      "物质",
      "金钱",
      "实用",
      "稳定",
      "成就",
      "成熟",
      "关怀",
      "直觉"
    ],
    "imageUrl": "/static/tarot/- 76_pentacles_queen_jpg (星币皇后 Queen of Pentacles).png"
  },
  {
    "id": 77,
    "name": "King of Pentacles",
    "chineseName": "星币国王",
    "category": "minor",
    "suit": "pentacles",
    "number": 14,
    "element": "earth",
    "keywords": [
      "物质",
      "金钱",
      "实用",
      "稳定",
      "成就",
      "权威",
      "控制",
      "成就"
    ],
    "imageUrl": "/static/tarot/- 77_pentacles_king_jpg (星币国王 King of Pentacles).png"
  }
];

// 工具函数
export function getCompleteCardById(id: number): CompleteTarotCard | undefined {
  return completeTarotDeck.find(card => card.id === id);
}

export function getCompleteCardsByCategory(category: 'major' | 'minor'): CompleteTarotCard[] {
  return completeTarotDeck.filter(card => card.category === category);
}

export function getCompleteCardsBySuit(suit: 'wands' | 'cups' | 'swords' | 'pentacles'): CompleteTarotCard[] {
  return completeTarotDeck.filter(card => card.suit === suit);
}

export function shuffleCompleteDeck(): CompleteTarotCard[] {
  const shuffled = [...completeTarotDeck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function drawCompleteCards(count: number): CompleteTarotCard[] {
  return shuffleCompleteDeck().slice(0, count);
}

// 验证数据完整性
export function validateTarotDeck(): { isComplete: boolean; missing: string[]; total: number } {
  const missing: string[] = [];
  
  // 检查大阿尔卡纳 (0-21)
  for (let i = 0; i <= 21; i++) {
    if (!completeTarotDeck.find(card => card.id === i)) {
      missing.push(`Major Arcana ${i}`);
    }
  }
  
  // 检查小阿尔卡纳 (22-77)
  const suits = ['wands', 'cups', 'swords', 'pentacles'];
  suits.forEach((suit, suitIndex) => {
    for (let i = 1; i <= 14; i++) {
      const expectedId = 22 + suitIndex * 14 + (i - 1);
      if (!completeTarotDeck.find(card => card.id === expectedId)) {
        missing.push(`${suit} ${i}`);
      }
    }
  });
  
  return {
    isComplete: missing.length === 0,
    missing,
    total: completeTarotDeck.length
  };
}
