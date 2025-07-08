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
  uprightKeywords: string[];
  reversedKeywords: string[];
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
    "uprightKeywords": ["新的开始", "冒险", "自由"],
    "reversedKeywords": ["冲动", "逃避责任", "依赖他人"],
    "imageUrl": "/static/tarot/- 00_fool_jpg (愚者).png"
  },
  {
    "id": 1,
    "name": "The Magician",
    "chineseName": "魔术师",
    "category": "major",
    "element": "air",
    "storyInterpretation": "桌上四元素齐聚，魔术师挥动权杖，将想象变为现实，万物皆有可能。",
    "uprightKeywords": ["创造力", "自信", "实现目标"],
    "reversedKeywords": ["欺骗", "能量散失", "不切实际"],
    "imageUrl": "/static/tarot/- 01_magician_jpg (魔术师).png"
  },
  {
    "id": 2,
    "name": "The High Priestess",
    "chineseName": "女祭司",
    "category": "major",
    "element": "water",
    "storyInterpretation": "月光下的神庙静谧无声，女祭司守护着秘密，直觉引领你走向内心深处。",
    "uprightKeywords": ["直觉", "神秘", "内在智慧"],
    "reversedKeywords": ["迷失", "不信任", "忽略直觉"],
    "imageUrl": "/static/tarot/- 02_high_priestess_jpg (女祭司).png"
  },
  {
    "id": 3,
    "name": "The Empress",
    "chineseName": "皇后",
    "category": "major",
    "element": "earth",
    "storyInterpretation": "花园中繁花盛开，皇后温柔地守护着生命的成长，丰饶与爱意在她的怀抱中流淌。",
    "uprightKeywords": ["丰饶", "母爱", "创造力"],
    "reversedKeywords": ["控制", "过度保护", "情感压抑"],
    "imageUrl": "/static/tarot/- 03_empress_jpg (皇后).png"
  },
  {
    "id": 4,
    "name": "The Emperor",
    "chineseName": "皇帝",
    "category": "major",
    "element": "fire",
    "storyInterpretation": "坚实的王座上，皇帝目光坚定，权杖在手，他用秩序与规则守护着自己的疆土。",
    "uprightKeywords": ["权威", "稳定", "自律"],
    "reversedKeywords": ["专制", "混乱", "缺乏自律"],
    "imageUrl": "/static/tarot/- 04_emperor_jpg (皇帝).png"
  },
  {
    "id": 5,
    "name": "The Hierophant",
    "chineseName": "教皇",
    "category": "major",
    "element": "earth",
    "storyInterpretation": "古老的神殿里，教皇传递着智慧与信仰，传统的力量在仪式中延续。",
    "uprightKeywords": ["传统", "信仰", "指导"],
    "reversedKeywords": ["叛逆", "打破规则", "迷失方向"],
    "imageUrl": "/static/tarot/- 05_hierophant_jpg (教皇).png"
  },
  {
    "id": 6,
    "name": "The Lovers",
    "chineseName": "恋人",
    "category": "major",
    "element": "air",
    "storyInterpretation": "两颗心在花园中相遇，面对选择，爱与责任交织，命运的分岔路口等待你的决定。",
    "uprightKeywords": ["爱情", "选择", "和谐"],
    "reversedKeywords": ["冲突", "分离", "不稳定"],
    "imageUrl": "/static/tarot/- 06_lovers_jpg (恋人).png"
  },
  {
    "id": 7,
    "name": "The Chariot",
    "chineseName": "战车",
    "category": "major",
    "element": "water",
    "storyInterpretation": "驾驭黑白双马，穿越风暴，唯有坚定的意志能抵达胜利的彼岸。",
    "uprightKeywords": ["决心", "胜利", "掌控"],
    "reversedKeywords": ["失控", "冲动", "失败"],
    "imageUrl": "/static/tarot/- 07_chariot_jpg (战车).png"
  },
  {
    "id": 8,
    "name": "Strength",
    "chineseName": "力量",
    "category": "major",
    "element": "fire",
    "storyInterpretation": "少女温柔地抚摸着狮子的鬃毛，柔和的力量胜过一切蛮力，勇气源自内心的平静。",
    "uprightKeywords": ["勇气", "耐心", "内在力量"],
    "reversedKeywords": ["软弱", "恐惧", "消极抵抗"],
    "imageUrl": "/static/tarot/- 08_strength_jpg (力量).png"
  },
  {
    "id": 9,
    "name": "The Hermit",
    "chineseName": "隐者",
    "category": "major",
    "element": "earth",
    "storyInterpretation": "夜色中，隐者举起灯笼，独自踏上寻找真理的旅途，智慧在孤独中闪闪发光。",
    "uprightKeywords": ["内省", "寻求智慧", "孤独"],
    "reversedKeywords": ["孤立", "逃避现实", "迷失"],
    "imageUrl": "/static/tarot/- 09_hermit_jpg (隐者).png"
  },
  {
    "id": 10,
    "name": "Wheel of Fortune",
    "chineseName": "命运之轮",
    "category": "major",
    "element": "fire",
    "storyInterpretation": "巨大的轮盘在天空中转动，命运的齿轮咔嚓作响，变化即将到来，机遇与挑战并存。",
    "uprightKeywords": ["命运转折", "好运", "机会"],
    "reversedKeywords": ["逆境", "坏运", "错失机会"],
    "imageUrl": "/static/tarot/- 10_wheel_of_fortune_jpg (命运之轮).png"
  },
  {
    "id": 11,
    "name": "Justice",
    "chineseName": "正义",
    "category": "major",
    "element": "air",
    "storyInterpretation": "天平在正义女神手中保持平衡，真相的利剑划破迷雾，公正将得到伸张。",
    "uprightKeywords": ["公正", "平衡", "决断"],
    "reversedKeywords": ["偏见", "不公", "优柔寡断"],
    "imageUrl": "/static/tarot/- 11_justice_jpg (正义).png"
  },
  {
    "id": 12,
    "name": "The Hanged Man",
    "chineseName": "倒吊人",
    "category": "major",
    "element": "water",
    "storyInterpretation": "倒悬的智者在树上沉思，换个角度看世界，牺牲与等待中蕴含着深刻的领悟。",
    "uprightKeywords": ["牺牲", "等待", "新视角"],
    "reversedKeywords": ["抗拒", "固执", "无意义的牺牲"],
    "imageUrl": "/static/tarot/- 12_hanged_man_jpg (倒吊人).png"
  },
  {
    "id": 13,
    "name": "Death",
    "chineseName": "死神",
    "category": "major",
    "element": "water",
    "storyInterpretation": "死神骑着白马缓缓走来，不是终结而是转化，旧的消逝为新的诞生让路。",
    "uprightKeywords": ["结束", "转变", "重生"],
    "reversedKeywords": ["抗拒改变", "停滞", "恐惧"],
    "imageUrl": "/static/tarot/- 13_death_jpg (死神).png"
  },
  {
    "id": 14,
    "name": "Temperance",
    "chineseName": "节制",
    "category": "major",
    "element": "fire",
    "storyInterpretation": "天使在溪水边调和两壶清泉，平衡与耐心让你在纷扰中找到内心的安宁。",
    "uprightKeywords": ["平衡", "调和", "适应"],
    "reversedKeywords": ["极端", "冲突", "失衡"],
    "imageUrl": "/static/tarot/- 14_temperance_jpg (节制).png"
  },
  {
    "id": 15,
    "name": "The Devil",
    "chineseName": "恶魔",
    "category": "major",
    "element": "earth",
    "storyInterpretation": "恶魔的锁链看似牢固，实则虚幻，束缚你的往往是内心的恐惧与欲望。",
    "uprightKeywords": ["束缚", "欲望", "物质沉溺"],
    "reversedKeywords": ["解脱", "觉醒", "摆脱控制"],
    "imageUrl": "/static/tarot/- 15_devil_jpg (恶魔).png"
  },
  {
    "id": 16,
    "name": "The Tower",
    "chineseName": "塔",
    "category": "major",
    "element": "fire",
    "storyInterpretation": "高塔在雷电中轰然倒塌，虚假的根基被摧毁，真相在废墟中重新建立。",
    "uprightKeywords": ["突变", "解放", "震撼"],
    "reversedKeywords": ["抗拒改变", "拖延", "崩溃"],
    "imageUrl": "/static/tarot/- 16_tower_jpg (塔).png"
  },
  {
    "id": 17,
    "name": "The Star",
    "chineseName": "星星",
    "category": "major",
    "element": "air",
    "storyInterpretation": "星光洒向大地，少女在池边倒水，希望如甘露般滋润着干涸的心田。",
    "uprightKeywords": ["希望", "灵感", "疗愈"],
    "reversedKeywords": ["失望", "迷失", "信心丧失"],
    "imageUrl": "/static/tarot/- 17_star_jpg (星星).png"
  },
  {
    "id": 18,
    "name": "The Moon",
    "chineseName": "月亮",
    "category": "major",
    "element": "water",
    "storyInterpretation": "月亮高悬，狼嚎声起，幻象与真实交织，直觉在迷雾中指引方向。",
    "uprightKeywords": ["潜意识", "幻想", "直觉"],
    "reversedKeywords": ["恐惧", "欺骗", "混乱"],
    "imageUrl": "/static/tarot/- 18_moon_jpg (月亮).png"
  },
  {
    "id": 19,
    "name": "The Sun",
    "chineseName": "太阳",
    "category": "major",
    "element": "fire",
    "storyInterpretation": "太阳升起，孩童在花园中欢笑，纯真的喜悦照亮一切，成功与幸福触手可及。",
    "uprightKeywords": ["快乐", "成功", "光明"],
    "reversedKeywords": ["自负", "骄傲", "不安"],
    "imageUrl": "/static/tarot/- 19_sun_jpg (太阳).png"
  },
  {
    "id": 20,
    "name": "Judgement",
    "chineseName": "审判",
    "category": "major",
    "element": "fire",
    "storyInterpretation": "号角响起，沉睡的灵魂苏醒，过往的经历化为觉醒的力量，迎接新生。",
    "uprightKeywords": ["觉醒", "重生", "清晰判断"],
    "reversedKeywords": ["逃避", "消极", "不愿面对"],
    "imageUrl": "/static/tarot/- 20_judgement_jpg (审判).png"
  },
  {
    "id": 21,
    "name": "The World",
    "chineseName": "世界",
    "category": "major",
    "element": "earth",
    "storyInterpretation": "你在宇宙的舞台上旋转，旅程圆满，收获属于自己的荣耀与自由。",
    "uprightKeywords": ["完成", "圆满", "成功"],
    "reversedKeywords": ["未完成", "错失机会", "不满足"],
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
    "uprightKeywords": ["新机会", "激情", "行动"],
    "reversedKeywords": ["挫折", "延迟", "缺乏动力"],
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
    "uprightKeywords": ["计划", "未来展望", "决策"],
    "reversedKeywords": ["犹豫", "恐惧改变", "错失机会"],
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
    "uprightKeywords": ["远见", "合作", "成功在望"],
    "reversedKeywords": ["延迟", "孤立", "计划受阻"],
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
    "uprightKeywords": ["庆祝", "稳定", "归属感"],
    "reversedKeywords": ["不稳定", "家庭冲突", "短暂快乐"],
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
    "uprightKeywords": ["竞争", "冲突", "挑战"],
    "reversedKeywords": ["逃避冲突", "内耗", "不公平竞争"],
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
    "uprightKeywords": ["胜利", "认可", "自信"],
    "reversedKeywords": ["骄傲", "失败", "不被认可"],
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
    "uprightKeywords": ["坚持", "防御", "勇气"],
    "reversedKeywords": ["退缩", "自我怀疑", "被压制"],
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
    "uprightKeywords": ["快速进展", "消息", "行动力"],
    "reversedKeywords": ["延迟", "混乱", "冲动"],
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
    "uprightKeywords": ["毅力", "防御", "警惕"],
    "reversedKeywords": ["疲惫", "放弃", "过度防御"],
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
    "uprightKeywords": ["负担", "责任", "压力"],
    "reversedKeywords": ["解脱", "放弃责任", "过度劳累"],
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
    "storyInterpretation": "权杖侍从手持嫩绿的权杖，新的想法如春芽般破土而出。",
    "uprightKeywords": ["新想法", "热情", "探索"],
    "reversedKeywords": ["冲动", "不成熟", "半途而废"],
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
    "storyInterpretation": "权杖骑士策马奔腾，冲动与热情驱使着前进的步伐。",
    "uprightKeywords": ["冒险", "行动", "激情"],
    "reversedKeywords": ["鲁莽", "急躁", "冲突"],
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
    "storyInterpretation": "权杖王后手持向日葵，温暖的能量感染着周围的一切。",
    "uprightKeywords": ["自信", "领导力", "魅力"],
    "reversedKeywords": ["嫉妒", "控制欲", "缺乏自信"],
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
    "storyInterpretation": "权杖国王坐在火焰王座上，领导力与远见指引着团队前进。",
    "uprightKeywords": ["权威", "远见", "魄力"],
    "reversedKeywords": ["专制", "冲动", "滥用权力"],
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
    "uprightKeywords": ["新感情", "爱", "直觉"],
    "reversedKeywords": ["情感封闭", "空虚", "拒绝爱"],
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
    "uprightKeywords": ["和谐", "合作", "爱情"],
    "reversedKeywords": ["分离", "误解", "不平衡"],
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
    "uprightKeywords": ["庆祝", "友谊", "欢乐"],
    "reversedKeywords": ["过度享乐", "冲突", "背叛"],
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
    "uprightKeywords": ["沉思", "不满", "新机会"],
    "reversedKeywords": ["错失机会", "冷漠", "拒绝成长"],
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
    "uprightKeywords": ["失落", "悲伤", "遗憾"],
    "reversedKeywords": ["释怀", "接受", "新希望"],
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
    "uprightKeywords": ["回忆", "童年", "单纯"],
    "reversedKeywords": ["沉溺过去", "拒绝成长"],
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
    "uprightKeywords": ["幻想", "选择", "可能性"],
    "reversedKeywords": ["混乱", "不切实际", "错误决定"],
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
    "uprightKeywords": ["离开", "寻求更高意义"],
    "reversedKeywords": ["逃避", "犹豫", "无法放手"],
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
    "uprightKeywords": ["满足", "愿望实现"],
    "reversedKeywords": ["过度放纵", "虚假快乐"],
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
    "uprightKeywords": ["幸福", "家庭和谐"],
    "reversedKeywords": ["家庭冲突", "虚假幸福"],
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
    "storyInterpretation": "圣杯侍从手捧圣杯，纯真的心灵如清泉般透明无瑕。",
    "uprightKeywords": ["直觉", "创意", "纯真"],
    "reversedKeywords": ["情绪化", "不成熟", "幻想破灭"],
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
    "storyInterpretation": "圣杯骑士手持圣杯，浪漫的理想主义驱使着追求完美的爱。",
    "uprightKeywords": ["浪漫", "理想主义", "追求"],
    "reversedKeywords": ["不切实际", "情绪化", "欺骗"],
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
    "storyInterpretation": "圣杯王后坐在海边，直觉如潮水般涌来，情感的智慧指引方向。",
    "uprightKeywords": ["同理心", "直觉", "滋养"],
    "reversedKeywords": ["情绪失控", "依赖", "过度敏感"],
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
    "storyInterpretation": "圣杯国王在波涛中保持平静，情感的成熟带来内心的安宁。",
    "uprightKeywords": ["智慧", "情感平衡"],
    "reversedKeywords": ["情绪压抑", "冷漠", "操纵"],
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
    "uprightKeywords": ["突破", "清晰", "胜利"],
    "reversedKeywords": ["混乱", "错误判断", "冲突"],
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
    "uprightKeywords": ["抉择", "僵局", "平衡"],
    "reversedKeywords": ["逃避决定", "矛盾", "焦虑"],
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
    "uprightKeywords": ["心碎", "痛苦", "分离"],
    "reversedKeywords": ["疗愈", "释怀", "接受现实"],
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
    "uprightKeywords": ["休息", "恢复", "沉思"],
    "reversedKeywords": ["逃避", "停滞", "过度疲劳"],
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
    "uprightKeywords": ["冲突", "胜利但孤独"],
    "reversedKeywords": ["和解", "避免冲突", "道德胜利"],
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
    "uprightKeywords": ["过渡", "疗愈", "离开痛苦"],
    "reversedKeywords": ["停滞", "无法前进", "逃避问题"],
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
    "uprightKeywords": ["欺骗", "策略", "秘密行动"],
    "reversedKeywords": ["自我欺骗", "揭露真相", "失败计划"],
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
    "uprightKeywords": ["限制", "自我束缚"],
    "reversedKeywords": ["解脱", "看清困境", "新视角"],
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
    "uprightKeywords": ["焦虑", "担忧", "恐惧"],
    "reversedKeywords": ["释怀", "面对恐惧", "寻求帮助"],
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
    "uprightKeywords": ["终结", "痛苦", "新开始"],
    "reversedKeywords": ["缓慢恢复", "抗拒结束"],
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
    "storyInterpretation": "宝剑侍从举剑向天，年轻的心灵渴望真理与正义。",
    "uprightKeywords": ["好奇心", "新想法"],
    "reversedKeywords": ["轻率", "言语伤人", "不成熟"],
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
    "storyInterpretation": "宝剑骑士策马冲锋，理智与冲动并存，行动需要智慧的指引。",
    "uprightKeywords": ["行动力", "果断"],
    "reversedKeywords": ["鲁莽", "冲突", "言语攻击"],
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
    "storyInterpretation": "宝剑王后高举利剑，独立与坚强是她最美的装饰。",
    "uprightKeywords": ["理性", "独立", "清晰"],
    "reversedKeywords": ["冷酷", "苛刻", "情感封闭"],
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
    "storyInterpretation": "宝剑国王端坐王座，公正与智慧是他统治的基石。",
    "uprightKeywords": ["权威", "公正", "智慧"],
    "reversedKeywords": ["专制", "冷酷", "滥用权力"],
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
    "uprightKeywords": ["新机会", "财富", "稳定"],
    "reversedKeywords": ["错失机会", "财务损失"],
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
    "uprightKeywords": ["平衡", "适应", "灵活"],
    "reversedKeywords": ["失衡", "财务压力", "混乱"],
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
    "uprightKeywords": ["合作", "技能", "成长"],
    "reversedKeywords": ["缺乏合作", "技能不足"],
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
    "uprightKeywords": ["稳定", "储蓄", "控制"],
    "reversedKeywords": ["吝啬", "恐惧失去", "固执"],
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
    "uprightKeywords": ["贫困", "孤立", "困难"],
    "reversedKeywords": ["互助", "希望", "改善"],
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
    "uprightKeywords": ["慷慨", "分享", "公平"],
    "reversedKeywords": ["不平等", "自私", "财务依赖"],
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
    "uprightKeywords": ["耐心", "投资", "等待"],
    "reversedKeywords": ["失望", "放弃", "缺乏回报"],
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
    "uprightKeywords": ["努力", "专注", "技能提升"],
    "reversedKeywords": ["倦怠", "缺乏进步", "机械工作"],
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
    "uprightKeywords": ["独立", "富足", "享受"],
    "reversedKeywords": ["过度依赖", "财务风险"],
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
    "uprightKeywords": ["家族财富", "传承", "稳定"],
    "reversedKeywords": ["家庭冲突", "财务不稳定"],
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
    "storyInterpretation": "星币侍从专注地研究金币，学习与实践是成长的阶梯。",
    "uprightKeywords": ["学习", "务实", "新机会"],
    "reversedKeywords": ["懒惰", "短视", "错失机会"],
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
    "storyInterpretation": "星币骑士手持金币，稳重与可靠是他最大的优势。",
    "uprightKeywords": ["稳定", "耐心", "责任感"],
    "reversedKeywords": ["停滞", "保守", "缺乏激情"],
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
    "storyInterpretation": "星币王后手捧金币，慷慨与实用的智慧指引着生活。",
    "uprightKeywords": ["滋养", "富足", "务实"],
    "reversedKeywords": ["物质主义", "忽视情感"],
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
    "storyInterpretation": "星币国王坐在丰饶的花园中，成功与慷慨是他的标志。",
    "uprightKeywords": ["财富", "成功", "领导"],
    "reversedKeywords": ["贪婪", "吝啬", "滥用权力"],
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
