/**
 * 包含故事化解读的完整78张塔罗牌数据
 * 每张牌都有独特的、富有画面感和故事性的固定解读
 * 生成时间: 2025/6/13 17:16:30
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

export const storyTarotDeck: StoryTarotCard[] = [
  {
    "id": 0,
    "name": "The Fool",
    "chineseName": "愚者",
    "category": "major",
    "element": "air",
    "storyInterpretation": "年轻的旅人背起行囊，站在悬崖边，脚下是未知的世界，心中满是对未来的憧憬与勇气。",
    "keywords": [
      "新开始",
      "冒险精神",
      "纯真",
      "自由",
      "无限可能"
    ],
    "imageUrl": "/static/tarot/- 00_fool_jpg (愚者).png"
  },
  {
    "id": 1,
    "name": "The Magician",
    "chineseName": "魔术师",
    "category": "major",
    "element": "air",
    "storyInterpretation": "桌上四元素齐聚，魔术师挥动权杖，将想象变为现实，万物皆有可能。",
    "keywords": [
      "创造力",
      "意志力",
      "技能",
      "实现",
      "沟通"
    ],
    "imageUrl": "/static/tarot/- 01_magician_jpg (魔术师).png"
  },
  {
    "id": 2,
    "name": "The High Priestess",
    "chineseName": "女祭司",
    "category": "major",
    "element": "water",
    "storyInterpretation": "月光下的神庙静谧无声，女祭司守护着秘密，直觉引领你走向内心深处。",
    "keywords": [
      "直觉",
      "潜意识",
      "神秘",
      "内在智慧",
      "精神"
    ],
    "imageUrl": "/static/tarot/- 02_high_priestess_jpg (女祭司).png"
  },
  {
    "id": 3,
    "name": "The Empress",
    "chineseName": "皇后",
    "category": "major",
    "element": "earth",
    "storyInterpretation": "花园中繁花盛开，皇后温柔地守护着生命的成长，丰饶与爱意在她的怀抱中流淌。",
    "keywords": [
      "丰饶",
      "母性",
      "创造",
      "自然",
      "丰收"
    ],
    "imageUrl": "/static/tarot/- 03_empress_jpg (皇后).png"
  },
  {
    "id": 4,
    "name": "The Emperor",
    "chineseName": "皇帝",
    "category": "major",
    "element": "fire",
    "storyInterpretation": "坚实的王座上，皇帝目光坚定，权杖在手，他用秩序与规则守护着自己的疆土。",
    "keywords": [
      "权威",
      "稳定",
      "领导",
      "结构",
      "父权"
    ],
    "imageUrl": "/static/tarot/- 04_emperor_jpg (皇帝).png"
  },
  {
    "id": 5,
    "name": "The Hierophant",
    "chineseName": "教皇",
    "category": "major",
    "element": "earth",
    "storyInterpretation": "古老的神殿里，教皇传递着智慧与信仰，传统的力量在仪式中延续。",
    "keywords": [
      "传统",
      "信仰",
      "教导",
      "精神导师",
      "智慧"
    ],
    "imageUrl": "/static/tarot/- 05_hierophant_jpg (教皇).png"
  },
  {
    "id": 6,
    "name": "The Lovers",
    "chineseName": "恋人",
    "category": "major",
    "element": "air",
    "storyInterpretation": "两颗心在花园中相遇，面对选择，爱与责任交织，命运的分岔路口等待你的决定。",
    "keywords": [
      "爱情",
      "关系",
      "选择",
      "和谐",
      "结合"
    ],
    "imageUrl": "/static/tarot/- 06_lovers_jpg (恋人).png"
  },
  {
    "id": 7,
    "name": "The Chariot",
    "chineseName": "战车",
    "category": "major",
    "element": "water",
    "storyInterpretation": "驾驭黑白双马，穿越风暴，唯有坚定的意志能抵达胜利的彼岸。",
    "keywords": [
      "胜利",
      "意志力",
      "控制",
      "前进",
      "决心"
    ],
    "imageUrl": "/static/tarot/- 07_chariot_jpg (战车).png"
  },
  {
    "id": 8,
    "name": "Strength",
    "chineseName": "力量",
    "category": "major",
    "element": "fire",
    "storyInterpretation": "少女温柔地抚摸着狮子的鬃毛，柔和的力量胜过一切蛮力，勇气源自内心的平静。",
    "keywords": [
      "内在力量",
      "勇气",
      "耐心",
      "自控",
      "温柔"
    ],
    "imageUrl": "/static/tarot/- 08_strength_jpg (力量).png"
  },
  {
    "id": 9,
    "name": "The Hermit",
    "chineseName": "隐者",
    "category": "major",
    "element": "earth",
    "storyInterpretation": "夜色中，隐者举起灯笼，独自踏上寻找真理的旅途，智慧在孤独中闪闪发光。",
    "keywords": [
      "内省",
      "寻找",
      "指导",
      "智慧",
      "孤独"
    ],
    "imageUrl": "/static/tarot/- 09_hermit_jpg (隐者).png"
  },
  {
    "id": 10,
    "name": "Wheel of Fortune",
    "chineseName": "命运之轮",
    "category": "major",
    "element": "fire",
    "storyInterpretation": "巨大的轮盘在天空中转动，命运的齿轮咔嚓作响，变化即将到来，机遇与挑战并存。",
    "keywords": [
      "变化",
      "循环",
      "命运",
      "机会",
      "转折"
    ],
    "imageUrl": "/static/tarot/- 10_wheel_of_fortune_jpg (命运之轮).png"
  },
  {
    "id": 11,
    "name": "Justice",
    "chineseName": "正义",
    "category": "major",
    "element": "air",
    "storyInterpretation": "天平在正义女神手中保持平衡，真相的利剑划破迷雾，公正将得到伸张。",
    "keywords": [
      "公正",
      "平衡",
      "真相",
      "法律",
      "道德"
    ],
    "imageUrl": "/static/tarot/- 11_justice_jpg (正义).png"
  },
  {
    "id": 12,
    "name": "The Hanged Man",
    "chineseName": "倒吊人",
    "category": "major",
    "element": "water",
    "storyInterpretation": "倒悬的智者在树上沉思，换个角度看世界，牺牲与等待中蕴含着深刻的领悟。",
    "keywords": [
      "牺牲",
      "等待",
      "换位思考",
      "暂停",
      "领悟"
    ],
    "imageUrl": "/static/tarot/- 12_hanged_man_jpg (倒吊人).png"
  },
  {
    "id": 13,
    "name": "Death",
    "chineseName": "死神",
    "category": "major",
    "element": "water",
    "storyInterpretation": "死神骑着白马缓缓走来，不是终结而是转化，旧的消逝为新的诞生让路。",
    "keywords": [
      "转化",
      "结束",
      "重生",
      "释放",
      "变革"
    ],
    "imageUrl": "/static/tarot/- 13_death_jpg (死神).png"
  },
  {
    "id": 14,
    "name": "Temperance",
    "chineseName": "节制",
    "category": "major",
    "element": "fire",
    "storyInterpretation": "天使在溪水边调和两壶清泉，平衡与耐心让你在纷扰中找到内心的安宁。",
    "keywords": [
      "平衡",
      "调和",
      "耐心",
      "治愈",
      "节制"
    ],
    "imageUrl": "/static/tarot/- 14_temperance_jpg (节制).png"
  },
  {
    "id": 15,
    "name": "The Devil",
    "chineseName": "恶魔",
    "category": "major",
    "element": "earth",
    "storyInterpretation": "恶魔的锁链看似牢固，实则虚幻，束缚你的往往是内心的恐惧与欲望。",
    "keywords": [
      "束缚",
      "诱惑",
      "物质主义",
      "恐惧",
      "依赖"
    ],
    "imageUrl": "/static/tarot/- 15_devil_jpg (恶魔).png"
  },
  {
    "id": 16,
    "name": "The Tower",
    "chineseName": "塔",
    "category": "major",
    "element": "fire",
    "storyInterpretation": "高塔在雷电中轰然倒塌，虚假的根基被摧毁，真相在废墟中重新建立。",
    "keywords": [
      "突然变化",
      "觉醒",
      "解放",
      "启示",
      "破坏"
    ],
    "imageUrl": "/static/tarot/- 16_tower_jpg (塔).png"
  },
  {
    "id": 17,
    "name": "The Star",
    "chineseName": "星星",
    "category": "major",
    "element": "air",
    "storyInterpretation": "星光洒向大地，少女在池边倒水，希望如甘露般滋润着干涸的心田。",
    "keywords": [
      "希望",
      "灵感",
      "指引",
      "平静",
      "信仰"
    ],
    "imageUrl": "/static/tarot/- 17_star_jpg (星星).png"
  },
  {
    "id": 18,
    "name": "The Moon",
    "chineseName": "月亮",
    "category": "major",
    "element": "water",
    "storyInterpretation": "月亮高悬，狼嚎声起，幻象与真实交织，直觉在迷雾中指引方向。",
    "keywords": [
      "幻象",
      "直觉",
      "潜意识",
      "恐惧",
      "迷惑"
    ],
    "imageUrl": "/static/tarot/- 18_moon_jpg (月亮).png"
  },
  {
    "id": 19,
    "name": "The Sun",
    "chineseName": "太阳",
    "category": "major",
    "element": "fire",
    "storyInterpretation": "太阳升起，孩童在花园中欢笑，纯真的喜悦照亮一切，成功与幸福触手可及。",
    "keywords": [
      "成功",
      "喜悦",
      "活力",
      "乐观",
      "成就"
    ],
    "imageUrl": "/static/tarot/- 19_sun_jpg (太阳).png"
  },
  {
    "id": 20,
    "name": "Judgement",
    "chineseName": "审判",
    "category": "major",
    "element": "fire",
    "storyInterpretation": "号角响起，沉睡的灵魂苏醒，过往的经历化为觉醒的力量，迎接新生。",
    "keywords": [
      "觉醒",
      "重生",
      "宽恕",
      "内在呼唤",
      "判断"
    ],
    "imageUrl": "/static/tarot/- 20_judgement_jpg (审判).png"
  },
  {
    "id": 21,
    "name": "The World",
    "chineseName": "世界",
    "category": "major",
    "element": "earth",
    "storyInterpretation": "你在宇宙的舞台上旋转，旅程圆满，收获属于自己的荣耀与自由。",
    "keywords": [
      "完成",
      "成就",
      "旅程结束",
      "圆满",
      "成功"
    ],
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
    "storyInterpretation": "权杖从云中伸出，新的创意如火花般迸发，行动的时刻已经到来。",
    "keywords": [
      "新开始",
      "创意",
      "灵感",
      "潜力",
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
    "storyInterpretation": "站在城堡上眺望远方，手握权杖，世界在你的掌控之中，计划正在酝酿。",
    "keywords": [
      "计划",
      "远见",
      "控制",
      "个人力量",
      "未来"
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
    "storyInterpretation": "商人望向海港，船只即将启航，合作与扩展带来新的机遇。",
    "keywords": [
      "扩展",
      "远见",
      "领导",
      "合作",
      "贸易"
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
    "storyInterpretation": "四根权杖搭建起庆祝的拱门，家庭和睦，成就值得庆贺。",
    "keywords": [
      "庆祝",
      "和谐",
      "稳定",
      "家庭",
      "成就"
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
    "storyInterpretation": "五个年轻人挥舞权杖，竞争激烈但充满活力，冲突中孕育着成长。",
    "keywords": [
      "竞争",
      "冲突",
      "挑战",
      "分歧",
      "混乱"
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
    "storyInterpretation": "骑士高举权杖凯旋归来，胜利的桂冠戴在头上，努力终有回报。",
    "keywords": [
      "胜利",
      "成功",
      "认可",
      "进步",
      "自信"
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
    "storyInterpretation": "山顶上的勇士手持权杖，面对挑战毫不退缩，坚持就是胜利。",
    "keywords": [
      "挑战",
      "竞争",
      "坚持",
      "勇气",
      "防御"
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
    "storyInterpretation": "八根权杖如箭矢般飞向目标，快速的行动带来迅猛的进展。",
    "keywords": [
      "快速行动",
      "进展",
      "消息",
      "旅行",
      "急速"
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
    "storyInterpretation": "伤痕累累的战士依然坚守，最后的防线考验着你的意志。",
    "keywords": [
      "坚持",
      "韧性",
      "防御",
      "毅力",
      "边界"
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
    "storyInterpretation": "重担压身但目标在望，承担责任虽然辛苦，成功就在前方。",
    "keywords": [
      "负担",
      "责任",
      "压力",
      "成功",
      "目标"
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
    "storyInterpretation": "权杖骑士策马奔腾，冲动与热情驱使着前进的步伐。",
    "keywords": [
      "冲动",
      "冒险",
      "热情",
      "鲁莽",
      "行动"
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
    "storyInterpretation": "权杖王后手持向日葵，温暖的能量感染着周围的一切。",
    "keywords": [
      "创造力",
      "热情",
      "自信",
      "慷慨",
      "温暖"
    ],
    "imageUrl": "/static/tarot/- 33_wands_knight_jpg (权杖骑士 Knight of Wands).png"
  },
  {
    "id": 34,
    "name": "Queen of Wands",
    "chineseName": "权杖王后",
    "category": "minor",
    "suit": "wands",
    "number": 13,
    "element": "fire",
    "storyInterpretation": "权杖国王坐在火焰王座上，领导力与远见指引着团队前进。",
    "keywords": [
      "领导",
      "远见",
      "成熟",
      "控制",
      "企业家精神"
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
    "storyInterpretation": "权杖侍从手持嫩绿的权杖，新的想法如春芽般破土而出。",
    "keywords": [
      "热情",
      "冲动",
      "学习",
      "消息",
      "新想法"
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
    "storyInterpretation": "圣杯从云中降下，爱与灵感如甘露般注入心田，情感的新篇章开启。",
    "keywords": [
      "新爱情",
      "情感开始",
      "直觉",
      "灵性",
      "创造力"
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
    "storyInterpretation": "两人举杯相对，心灵的交流超越言语，真挚的情感在此刻绽放。",
    "keywords": [
      "伙伴关系",
      "爱情",
      "友谊",
      "合作",
      "平衡"
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
    "storyInterpretation": "三个朋友举杯庆祝，友谊的温暖如阳光般洒向大地。",
    "keywords": [
      "友谊",
      "庆祝",
      "创造力",
      "合作",
      "社区"
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
    "storyInterpretation": "树下沉思的人对眼前的圣杯视而不见，内心的不满需要新的视角。",
    "keywords": [
      "冷漠",
      "沉思",
      "重新评估",
      "内省",
      "不满"
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
    "storyInterpretation": "三杯倾倒，两杯依然挺立，失去中蕴含着希望，悲伤终将过去。",
    "keywords": [
      "失望",
      "悲伤",
      "后悔",
      "失落",
      "专注剩余"
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
    "storyInterpretation": "孩童在花园中嬉戏，纯真的快乐唤起心中最美好的回忆。",
    "keywords": [
      "怀旧",
      "童年",
      "纯真",
      "快乐回忆",
      "给予"
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
    "storyInterpretation": "云中浮现七个圣杯，幻想与现实交织，选择需要清醒的头脑。",
    "keywords": [
      "幻想",
      "选择",
      "愿望",
      "想象",
      "机会"
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
    "storyInterpretation": "背影渐行渐远，八个圣杯被抛在身后，寻找更高层次的满足。",
    "keywords": [
      "放弃",
      "寻找",
      "失望",
      "撤退",
      "内心召唤"
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
    "storyInterpretation": "满足的商人坐在九个圣杯前，愿望成真，内心充满感恩。",
    "keywords": [
      "满足",
      "幸福",
      "愿望成真",
      "感恩",
      "奢华"
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
    "storyInterpretation": "彩虹下的家庭其乐融融，十个圣杯象征着情感的圆满与幸福。",
    "keywords": [
      "幸福",
      "和谐",
      "情感满足",
      "家庭",
      "关系"
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
    "storyInterpretation": "圣杯骑士手持圣杯，浪漫的理想主义驱使着追求完美的爱。",
    "keywords": [
      "浪漫",
      "理想主义",
      "敏感",
      "创造力",
      "直觉"
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
    "storyInterpretation": "圣杯王后坐在海边，直觉如潮水般涌来，情感的智慧指引方向。",
    "keywords": [
      "直觉",
      "情感成熟",
      "同情",
      "平静",
      "内在知识"
    ],
    "imageUrl": "/static/tarot/- 47_cups_knight_jpg (圣杯骑士 Knight of Cups).png"
  },
  {
    "id": 48,
    "name": "Queen of Cups",
    "chineseName": "圣杯王后",
    "category": "minor",
    "suit": "cups",
    "number": 13,
    "element": "water",
    "storyInterpretation": "圣杯国王在波涛中保持平静，情感的成熟带来内心的安宁。",
    "keywords": [
      "情感平衡",
      "同情",
      "外交",
      "冷静",
      "慷慨"
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
    "storyInterpretation": "圣杯侍从手捧圣杯，纯真的心灵如清泉般透明无瑕。",
    "keywords": [
      "情感新开始",
      "创造力",
      "直觉",
      "艺术",
      "敏感"
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
    "storyInterpretation": "利剑刺破云层，真相如闪电般划破黑暗，清晰的思维带来突破。",
    "keywords": [
      "新想法",
      "心理清晰",
      "突破",
      "沟通",
      "真相"
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
    "storyInterpretation": "蒙眼的女子手持双剑，在迷茫中寻找平衡，决定需要内心的声音。",
    "keywords": [
      "困难决定",
      "平衡",
      "僵局",
      "选择",
      "和平"
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
    "storyInterpretation": "心脏被三剑刺穿，痛苦虽然深刻，但治愈的过程已经开始。",
    "keywords": [
      "心碎",
      "悲伤",
      "痛苦",
      "分离",
      "悲伤"
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
    "storyInterpretation": "骑士在石棺上安息，暂时的休息为下一次战斗积蓄力量。",
    "keywords": [
      "休息",
      "沉思",
      "恢复",
      "和平",
      "静止"
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
    "storyInterpretation": "胜利者收集败者的剑，冲突的代价沉重，反思比胜利更重要。",
    "keywords": [
      "冲突",
      "失败",
      "不和谐",
      "失败",
      "羞耻"
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
    "storyInterpretation": "船夫载着乘客渡过平静的水面，困境正在远去，平静即将到来。",
    "keywords": [
      "过渡",
      "改变",
      "旅行",
      "搬家",
      "恢复"
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
    "storyInterpretation": "小偷在夜色中潜行，策略与技巧有时比正面对抗更有效。",
    "keywords": [
      "欺骗",
      "策略",
      "偷窃",
      "逃避",
      "单独行动"
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
    "storyInterpretation": "被剑围困的女子，束缚往往来自内心的恐惧，解脱需要勇气。",
    "keywords": [
      "限制",
      "束缚",
      "受害者心态",
      "无力",
      "困境"
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
    "storyInterpretation": "噩梦中惊醒的人，焦虑如影随形，但黎明总会到来。",
    "keywords": [
      "焦虑",
      "担忧",
      "恐惧",
      "噩梦",
      "内疚"
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
    "storyInterpretation": "背部插满利剑的身影，背叛的痛苦深入骨髓，但这也是结束。",
    "keywords": [
      "背叛",
      "痛苦",
      "失败",
      "结束",
      "底部"
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
    "storyInterpretation": "宝剑骑士策马冲锋，理智与冲动并存，行动需要智慧的指引。",
    "keywords": [
      "冲动",
      "鲁莽",
      "不耐烦",
      "缺乏方向",
      "行动"
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
    "storyInterpretation": "宝剑王后高举利剑，独立与坚强是她最美的装饰。",
    "keywords": [
      "独立",
      "坚强",
      "直接",
      "公正",
      "清晰"
    ],
    "imageUrl": "/static/tarot/- 61_swords_knight_jpg (宝剑骑士 Knight of Swords).png"
  },
  {
    "id": 62,
    "name": "Queen of Swords",
    "chineseName": "宝剑王后",
    "category": "minor",
    "suit": "swords",
    "number": 13,
    "element": "air",
    "storyInterpretation": "宝剑国王端坐王座，公正与智慧是他统治的基石。",
    "keywords": [
      "权威",
      "清晰思维",
      "智力力量",
      "真相",
      "公正"
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
    "storyInterpretation": "宝剑侍从举剑向天，年轻的心灵渴望真理与正义。",
    "keywords": [
      "好奇",
      "渴望学习",
      "新想法",
      "沟通",
      "警觉"
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
    "storyInterpretation": "金币从云中显现，新的机会如种子般落地，物质的丰收即将开始。",
    "keywords": [
      "新机会",
      "表现",
      "新工作",
      "金钱",
      "健康"
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
    "storyInterpretation": "杂耍者抛接两枚金币，平衡各种责任需要灵活的技巧。",
    "keywords": [
      "平衡",
      "适应性",
      "时间管理",
      "优先级",
      "灵活性"
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
    "storyInterpretation": "工匠在教堂中雕刻，专业的技能得到认可，合作带来成功。",
    "keywords": [
      "团队合作",
      "学习",
      "实施",
      "建设",
      "合作"
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
    "storyInterpretation": "守财奴紧抱金币，过度的保守可能错失成长的机会。",
    "keywords": [
      "安全",
      "控制",
      "保守",
      "占有",
      "稳定"
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
    "storyInterpretation": "雪夜中的乞丐路过教堂，困难是暂时的，帮助就在身边。",
    "keywords": [
      "经济困难",
      "不安全",
      "担忧",
      "孤立",
      "失业"
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
    "storyInterpretation": "商人用天平称量金币，公平的交易建立信任的基础。",
    "keywords": [
      "慷慨",
      "分享",
      "公平",
      "社区",
      "感恩"
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
    "storyInterpretation": "农夫望着茂盛的葡萄藤，耐心的等待即将迎来丰收的季节。",
    "keywords": [
      "长期视野",
      "毅力",
      "投资",
      "努力工作",
      "进展"
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
    "storyInterpretation": "工匠专心雕刻星币，精益求精的态度是成功的关键。",
    "keywords": [
      "技能发展",
      "勤奋",
      "熟练",
      "质量",
      "细节"
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
    "storyInterpretation": "贵妇在花园中享受成果，独立与优雅是努力的回报。",
    "keywords": [
      "独立",
      "自给自足",
      "奢华",
      "成功",
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
    "storyInterpretation": "三代同堂的富裕家庭，财富的传承需要智慧的管理。",
    "keywords": [
      "财富",
      "遗产",
      "家庭",
      "建立",
      "长期成功"
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
    "storyInterpretation": "星币骑士手持金币，稳重与可靠是他最大的优势。",
    "keywords": [
      "实用",
      "可靠",
      "努力工作",
      "承诺",
      "常识"
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
    "storyInterpretation": "星币王后手捧金币，慷慨与实用的智慧指引着生活。",
    "keywords": [
      "实用",
      "慷慨",
      "安全",
      "独立",
      "资源丰富"
    ],
    "imageUrl": "/static/tarot/- 75_pentacles_knight_jpg (星币骑士 Knight of Pentacles).png"
  },
  {
    "id": 76,
    "name": "Queen of Pentacles",
    "chineseName": "星币王后",
    "category": "minor",
    "suit": "pentacles",
    "number": 13,
    "element": "earth",
    "storyInterpretation": "星币国王坐在丰饶的花园中，成功与慷慨是他的标志。",
    "keywords": [
      "成功",
      "领导",
      "安全",
      "纪律",
      "控制"
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
    "storyInterpretation": "星币侍从专注地研究金币，学习与实践是成长的阶梯。",
    "keywords": [
      "雄心",
      "渴望",
      "勤奋",
      "目标",
      "表现"
    ],
    "imageUrl": "/static/tarot/- 77_pentacles_king_jpg (星币国王 King of Pentacles).png"
  }
];

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
    missing.push(`大阿尔卡纳缺失: 应有22张，实际${majorCards.length}张`);
  }
  
  // 检查小阿尔卡纳 (应该有56张)
  if (minorCards.length !== 56) {
    missing.push(`小阿尔卡纳缺失: 应有56张，实际${minorCards.length}张`);
  }
  
  // 检查故事解读
  if (cardsWithStories.length !== 78) {
    missing.push(`故事解读缺失: 应有78个，实际${cardsWithStories.length}个`);
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
