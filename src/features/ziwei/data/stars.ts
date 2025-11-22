/**
 * 紫微斗数星曜数据
 * 包含108颗星曜的基本属性
 */

import type { Star } from '../types';

/**
 * 14主星数据
 */
export const MAIN_STARS: Star[] = [
  {
    id: 'ziwei',
    name: '紫微',
    category: '主星',
    brightness: '庙',
    element: '土',
    yinyang: '阴',
    personality: ['决策果断', '责任感强', '格局宏大', '领导力强'],
    color: '#9333EA',
    emoji: '👑',
    description: '帝王型 - 天生领袖'
  },
  {
    id: 'tianji',
    name: '天机',
    category: '主星',
    brightness: '庙',
    element: '木',
    yinyang: '阴',
    personality: ['思维敏捷', '善于谋划', '多变灵活', '智慧型'],
    color: '#0EA5E9',
    emoji: '🧙‍♂️',
    description: '军师型 - 智慧谋士'
  },
  {
    id: 'taiyang',
    name: '太阳',
    category: '主星',
    brightness: '庙',
    element: '火',
    yinyang: '阳',
    personality: ['光明磊落', '热情开朗', '乐于助人', '光明型'],
    color: '#F59E0B',
    emoji: '☀️',
    description: '光明型 - 温暖导师'
  },
  {
    id: 'wuqu',
    name: '武曲',
    category: '主星',
    brightness: '庙',
    element: '金',
    yinyang: '阴',
    personality: ['刚毅果断', '执行力强', '理财能力强', '武勇型'],
    color: '#EF4444',
    emoji: '⚔️',
    description: '武勇型 - 执行者'
  },
  {
    id: 'tiantong',
    name: '天同',
    category: '主星',
    brightness: '庙',
    element: '水',
    yinyang: '阳',
    personality: ['温和善良', '人缘好', '享受生活', '和谐型'],
    color: '#10B981',
    emoji: '🌸',
    description: '和谐型 - 和平使者'
  },
  {
    id: 'lianzhen',
    name: '廉贞',
    category: '主星',
    brightness: '庙',
    element: '火',
    yinyang: '阴',
    personality: ['廉洁自律', '原则性强', '情感丰富', '廉洁型'],
    color: '#8B5CF6',
    emoji: '💎',
    description: '廉洁型 - 原则守护者'
  },
  {
    id: 'tianfu',
    name: '天府',
    category: '主星',
    brightness: '庙',
    element: '土',
    yinyang: '阳',
    personality: ['稳重可靠', '理财能力强', '有领导力', '稳重型'],
    color: '#FCD34D',
    emoji: '🏛️',
    description: '稳重型 - 可靠后盾'
  },
  {
    id: 'taiyin',
    name: '太阴',
    category: '主星',
    brightness: '庙',
    element: '水',
    yinyang: '阴',
    personality: ['温柔细腻', '情感丰富', '有艺术天赋', '温柔型'],
    color: '#60A5FA',
    emoji: '🌙',
    description: '温柔型 - 情感细腻'
  },
  {
    id: 'tanlang',
    name: '贪狼',
    category: '主星',
    brightness: '庙',
    element: '水',
    yinyang: '阳',
    personality: ['多才多艺', '善于交际', '欲望强烈', '多才型'],
    color: '#F472B6',
    emoji: '🐺',
    description: '多才型 - 社交达人'
  },
  {
    id: 'jumen',
    name: '巨门',
    category: '主星',
    brightness: '庙',
    element: '水',
    yinyang: '阴',
    personality: ['口才好', '善于分析', '有时多疑', '口才型'],
    color: '#8B5CF6',
    emoji: '🗣️',
    description: '口才型 - 沟通专家'
  },
  {
    id: 'tianxiang',
    name: '天相',
    category: '主星',
    brightness: '庙',
    element: '水',
    yinyang: '阳',
    personality: ['协调能力强', '善于合作', '有责任感', '协调型'],
    color: '#34D399',
    emoji: '🤝',
    description: '协调型 - 合作专家'
  },
  {
    id: 'tianliang',
    name: '天梁',
    category: '主星',
    brightness: '庙',
    element: '土',
    yinyang: '阳',
    personality: ['稳重可靠', '有智慧', '乐于助人', '智慧型'],
    color: '#FBBF24',
    emoji: '🏔️',
    description: '智慧型 - 长者风范'
  },
  {
    id: 'qisha',
    name: '七杀',
    category: '主星',
    brightness: '庙',
    element: '金',
    yinyang: '阴',
    personality: ['果断勇敢', '执行力强', '有时冲动', '果断型'],
    color: '#DC2626',
    emoji: '⚡',
    description: '果断型 - 行动派'
  },
  {
    id: 'pojun',
    name: '破军',
    category: '主星',
    brightness: '庙',
    element: '水',
    yinyang: '阴',
    personality: ['勇于创新', '喜欢变化', '有破坏力', '创新型'],
    color: '#7C3AED',
    emoji: '💥',
    description: '创新型 - 变革者'
  }
];

/**
 * 获取主星数据
 */
export function getMainStar(name: string): Star | undefined {
  return MAIN_STARS.find(star => star.name === name);
}

/**
 * 获取所有主星名称
 */
export function getAllMainStarNames(): string[] {
  return MAIN_STARS.map(star => star.name);
}

/**
 * 主要辅星数据
 */
export const AUXILIARY_STARS: Star[] = [
  {
    id: 'zuofu',
    name: '左辅',
    category: '辅星',
    brightness: '庙',
    element: '土',
    yinyang: '阳',
    personality: ['辅助能力强', '有贵人运', '协调性好'],
    color: '#84CC16',
    emoji: '🤝',
    description: '辅助型 - 贵人相助'
  },
  {
    id: 'youbi',
    name: '右弼',
    category: '辅星',
    brightness: '庙',
    element: '水',
    yinyang: '阴',
    personality: ['辅助能力强', '有贵人运', '协调性好'],
    color: '#06B6D4',
    emoji: '🤝',
    description: '辅助型 - 贵人相助'
  },
  {
    id: 'wenchang',
    name: '文昌',
    category: '辅星',
    brightness: '庙',
    element: '金',
    yinyang: '阳',
    personality: ['文才出众', '学习能力强', '有艺术天赋'],
    color: '#3B82F6',
    emoji: '📚',
    description: '文才型 - 学识渊博'
  },
  {
    id: 'wenqu',
    name: '文曲',
    category: '辅星',
    brightness: '庙',
    element: '水',
    yinyang: '阴',
    personality: ['文才出众', '口才好', '有艺术天赋'],
    color: '#8B5CF6',
    emoji: '🎨',
    description: '文才型 - 艺术天赋'
  },
  {
    id: 'tiankui',
    name: '天魁',
    category: '吉星',
    brightness: '庙',
    element: '火',
    yinyang: '阳',
    personality: ['有贵人运', '容易得到帮助', '运气好'],
    color: '#F59E0B',
    emoji: '⭐',
    description: '贵人型 - 天助自助'
  },
  {
    id: 'tianyue',
    name: '天钺',
    category: '吉星',
    brightness: '庙',
    element: '火',
    yinyang: '阴',
    personality: ['有贵人运', '容易得到帮助', '运气好'],
    color: '#F59E0B',
    emoji: '⭐',
    description: '贵人型 - 天助自助'
  },
  {
    id: 'dikong',
    name: '地空',
    category: '煞星',
    brightness: '陷',
    element: '火',
    yinyang: '阴',
    personality: ['容易空想', '不切实际', '有创意但难落实'],
    color: '#6B7280',
    emoji: '🌫️',
    description: '空想型 - 理想主义'
  },
  {
    id: 'dijie',
    name: '地劫',
    category: '煞星',
    brightness: '陷',
    element: '火',
    yinyang: '阳',
    personality: ['容易破财', '不稳定', '变化大'],
    color: '#6B7280',
    emoji: '💥',
    description: '变动型 - 不稳定'
  },
  {
    id: 'huoxing',
    name: '火星',
    category: '煞星',
    brightness: '庙',
    element: '火',
    yinyang: '阳',
    personality: ['脾气急躁', '行动力强', '容易冲动'],
    color: '#EF4444',
    emoji: '🔥',
    description: '急躁型 - 行动派'
  },
  {
    id: 'lingxing',
    name: '铃星',
    category: '煞星',
    brightness: '庙',
    element: '火',
    yinyang: '阴',
    personality: ['内心急躁', '容易焦虑', '有爆发力'],
    color: '#F97316',
    emoji: '⚡',
    description: '焦虑型 - 内心急躁'
  },
  {
    id: 'qingyang',
    name: '擎羊',
    category: '煞星',
    brightness: '庙',
    element: '金',
    yinyang: '阳',
    personality: ['刚强果断', '容易冲突', '有攻击性'],
    color: '#DC2626',
    emoji: '🗡️',
    description: '刚强型 - 易生冲突'
  },
  {
    id: 'tuoluo',
    name: '陀罗',
    category: '煞星',
    brightness: '陷',
    element: '金',
    yinyang: '阴',
    personality: ['拖延犹豫', '容易纠结', '行动迟缓'],
    color: '#991B1B',
    emoji: '🌀',
    description: '拖延型 - 行动迟缓'
  },
  
  // ========== 其他重要辅星 ==========
  
  {
    id: 'lucun',
    name: '禄存',
    category: '辅星',
    brightness: '庙',
    element: '土',
    yinyang: '阴',
    personality: ['财禄丰厚', '理财能力强', '守财'],
    color: '#FCD34D',
    emoji: '💰',
    description: '财禄型 - 理财高手'
  },
  {
    id: 'tianma',
    name: '天马',
    category: '辅星',
    brightness: '庙',
    element: '火',
    yinyang: '阳',
    personality: ['变动频繁', '喜欢旅行', '行动力强'],
    color: '#10B981',
    emoji: '🐴',
    description: '变动型 - 驿马星'
  },
  {
    id: 'hongluan',
    name: '红鸾',
    category: '辅星',
    brightness: '庙',
    element: '水',
    yinyang: '阴',
    personality: ['桃花运旺', '感情丰富', '容易恋爱'],
    color: '#EC4899',
    emoji: '💕',
    description: '桃花型 - 感情丰富'
  },
  {
    id: 'tianxi',
    name: '天喜',
    category: '辅星',
    brightness: '庙',
    element: '水',
    yinyang: '阳',
    personality: ['喜庆吉祥', '容易结婚', '感情顺利'],
    color: '#F472B6',
    emoji: '🎉',
    description: '喜庆型 - 婚姻顺利'
  },
  {
    id: 'tianxing',
    name: '天刑',
    category: '辅星',
    brightness: '庙',
    element: '火',
    yinyang: '阳',
    personality: ['有法律意识', '原则性强', '容易受罚'],
    color: '#7C2D12',
    emoji: '⚖️',
    description: '法律型 - 原则性强'
  },
  {
    id: 'tianyao',
    name: '天姚',
    category: '辅星',
    brightness: '庙',
    element: '水',
    yinyang: '阴',
    personality: ['桃花运旺', '魅力强', '容易吸引异性'],
    color: '#DB2777',
    emoji: '💋',
    description: '魅力型 - 桃花星'
  },
  {
    id: 'guchen',
    name: '孤辰',
    category: '辅星',
    brightness: '陷',
    element: '火',
    yinyang: '阳',
    personality: ['性格孤僻', '喜欢独处', '不容易合群'],
    color: '#6B7280',
    emoji: '🏔️',
    description: '孤独型 - 性格孤僻'
  },
  {
    id: 'guasu',
    name: '寡宿',
    category: '辅星',
    brightness: '陷',
    element: '火',
    yinyang: '阴',
    personality: ['容易孤独', '感情淡薄', '晚婚'],
    color: '#6B7280',
    emoji: '🌙',
    description: '孤独型 - 感情淡薄'
  },
  {
    id: 'longchi',
    name: '龙池',
    category: '辅星',
    brightness: '庙',
    element: '水',
    yinyang: '阳',
    personality: ['有才艺', '文化修养高', '艺术天赋'],
    color: '#0EA5E9',
    emoji: '🎭',
    description: '才艺型 - 文化修养'
  },
  {
    id: 'fengge',
    name: '凤阁',
    category: '辅星',
    brightness: '庙',
    element: '土',
    yinyang: '阴',
    personality: ['有才艺', '文化修养高', '艺术天赋'],
    color: '#8B5CF6',
    emoji: '🏛️',
    description: '才艺型 - 文化修养'
  },
  {
    id: 'santai',
    name: '三台',
    category: '辅星',
    brightness: '庙',
    element: '土',
    yinyang: '阳',
    personality: ['有地位', '容易升迁', '有权威'],
    color: '#F59E0B',
    emoji: '👑',
    description: '地位型 - 权威之星'
  },
  {
    id: 'bazuo',
    name: '八座',
    category: '辅星',
    brightness: '庙',
    element: '土',
    yinyang: '阴',
    personality: ['有地位', '容易升迁', '有权威'],
    color: '#FCD34D',
    emoji: '🏆',
    description: '地位型 - 权威之星'
  },
  {
    id: 'enguang',
    name: '恩光',
    category: '辅星',
    brightness: '庙',
    element: '火',
    yinyang: '阳',
    personality: ['有荣誉', '容易受赏识', '有恩惠'],
    color: '#F59E0B',
    emoji: '✨',
    description: '荣誉型 - 受赏识'
  },
  {
    id: 'tiangui',
    name: '天贵',
    category: '辅星',
    brightness: '庙',
    element: '火',
    yinyang: '阴',
    personality: ['有荣誉', '容易受赏识', '有恩惠'],
    color: '#FBBF24',
    emoji: '🌟',
    description: '荣誉型 - 受赏识'
  },
  {
    id: 'taifu',
    name: '台辅',
    category: '辅星',
    brightness: '庙',
    element: '土',
    yinyang: '阳',
    personality: ['有贵人运', '容易得到帮助', '有辅佐能力'],
    color: '#84CC16',
    emoji: '🤝',
    description: '贵人型 - 辅佐之星'
  },
  {
    id: 'fengao',
    name: '封诰',
    category: '辅星',
    brightness: '庙',
    element: '土',
    yinyang: '阴',
    personality: ['有贵人运', '容易得到帮助', '有辅佐能力'],
    color: '#10B981',
    emoji: '📜',
    description: '贵人型 - 辅佐之星'
  },
  {
    id: 'tianguan',
    name: '天官',
    category: '辅星',
    brightness: '庙',
    element: '土',
    yinyang: '阳',
    personality: ['有官运', '容易升迁', '有管理能力'],
    color: '#3B82F6',
    emoji: '👔',
    description: '官运型 - 管理能力'
  },
  {
    id: 'tianfu2',
    name: '天福',
    category: '辅星',
    brightness: '庙',
    element: '土',
    yinyang: '阴',
    personality: ['有福气', '容易享受', '有福报'],
    color: '#FCD34D',
    emoji: '🍀',
    description: '福气型 - 有福报'
  },
  {
    id: 'tianchu',
    name: '天厨',
    category: '辅星',
    brightness: '庙',
    element: '火',
    yinyang: '阳',
    personality: ['有食禄', '喜欢美食', '有口福'],
    color: '#F59E0B',
    emoji: '🍽️',
    description: '食禄型 - 有口福'
  },
  {
    id: 'tiancai',
    name: '天才',
    category: '辅星',
    brightness: '庙',
    element: '木',
    yinyang: '阳',
    personality: ['有才华', '聪明过人', '有天赋'],
    color: '#0EA5E9',
    emoji: '🧠',
    description: '才华型 - 聪明过人'
  },
  {
    id: 'tianshou',
    name: '天寿',
    category: '辅星',
    brightness: '庙',
    element: '土',
    yinyang: '阳',
    personality: ['长寿', '身体健康', '有寿元'],
    color: '#10B981',
    emoji: '🌳',
    description: '长寿型 - 身体健康'
  },
  {
    id: 'tianyue',
    name: '天月',
    category: '辅星',
    brightness: '陷',
    element: '水',
    yinyang: '阴',
    personality: ['容易生病', '体质较弱', '需要注意健康'],
    color: '#6B7280',
    emoji: '🌙',
    description: '疾病型 - 体质较弱'
  },
  {
    id: 'yinsha',
    name: '阴煞',
    category: '辅星',
    brightness: '陷',
    element: '土',
    yinyang: '阴',
    personality: ['容易阴暗', '有小人', '需要注意'],
    color: '#4B5563',
    emoji: '🌑',
    description: '阴暗型 - 需注意'
  },
  {
    id: 'tiankong',
    name: '天空',
    category: '辅星',
    brightness: '陷',
    element: '火',
    yinyang: '阴',
    personality: ['容易空想', '不切实际', '有创意但难落实'],
    color: '#6B7280',
    emoji: '☁️',
    description: '空想型 - 不切实际'
  },
  {
    id: 'jiekong',
    name: '截空',
    category: '辅星',
    brightness: '陷',
    element: '火',
    yinyang: '阳',
    personality: ['容易中断', '不顺利', '有阻碍'],
    color: '#6B7280',
    emoji: '🚫',
    description: '中断型 - 有阻碍'
  },
  {
    id: 'xunkong',
    name: '旬空',
    category: '辅星',
    brightness: '陷',
    element: '火',
    yinyang: '阴',
    personality: ['容易落空', '不顺利', '有阻碍'],
    color: '#6B7280',
    emoji: '🌀',
    description: '落空型 - 有阻碍'
  },
  
  // ========== 博士十二神 ==========
  
  {
    id: 'boshi',
    name: '博士',
    category: '辅星',
    brightness: '庙',
    element: '水',
    yinyang: '阳',
    personality: ['有学问', '知识渊博', '有研究能力'],
    color: '#3B82F6',
    emoji: '🎓',
    description: '学问型 - 知识渊博'
  },
  {
    id: 'lishi',
    name: '力士',
    category: '辅星',
    brightness: '庙',
    element: '火',
    yinyang: '阳',
    personality: ['有力量', '行动力强', '有执行力'],
    color: '#EF4444',
    emoji: '💪',
    description: '力量型 - 行动力强'
  },
  {
    id: 'qinglong',
    name: '青龙',
    category: '辅星',
    brightness: '庙',
    element: '木',
    yinyang: '阳',
    personality: ['吉祥', '有贵人运', '容易成功'],
    color: '#10B981',
    emoji: '🐉',
    description: '吉祥型 - 有贵人运'
  },
  {
    id: 'xiaohao',
    name: '小耗',
    category: '辅星',
    brightness: '陷',
    element: '火',
    yinyang: '阴',
    personality: ['容易破小财', '有小损失', '需要注意'],
    color: '#6B7280',
    emoji: '💸',
    description: '破财型 - 小损失'
  },
  {
    id: 'jiangjun',
    name: '将军',
    category: '辅星',
    brightness: '庙',
    element: '金',
    yinyang: '阳',
    personality: ['有权威', '有领导力', '有决断力'],
    color: '#DC2626',
    emoji: '⚔️',
    description: '权威型 - 有领导力'
  },
  {
    id: 'zoushu',
    name: '奏书',
    category: '辅星',
    brightness: '庙',
    element: '金',
    yinyang: '阴',
    personality: ['有文书运', '容易得到文件', '有沟通能力'],
    color: '#3B82F6',
    emoji: '📝',
    description: '文书型 - 沟通能力'
  },
  {
    id: 'feilian',
    name: '飞廉',
    category: '辅星',
    brightness: '陷',
    element: '火',
    yinyang: '阳',
    personality: ['容易有口舌', '容易是非', '需要注意'],
    color: '#6B7280',
    emoji: '🗣️',
    description: '口舌型 - 容易是非'
  },
  {
    id: 'xishen',
    name: '喜神',
    category: '辅星',
    brightness: '庙',
    element: '火',
    yinyang: '阳',
    personality: ['有喜事', '容易开心', '有快乐'],
    color: '#EC4899',
    emoji: '😊',
    description: '喜庆型 - 容易开心'
  },
  {
    id: 'bingfu',
    name: '病符',
    category: '辅星',
    brightness: '陷',
    element: '水',
    yinyang: '阴',
    personality: ['容易生病', '体质较弱', '需要注意健康'],
    color: '#6B7280',
    emoji: '🏥',
    description: '疾病型 - 需要注意健康'
  },
  {
    id: 'dahao',
    name: '大耗',
    category: '辅星',
    brightness: '陷',
    element: '火',
    yinyang: '阳',
    personality: ['容易破大财', '有大损失', '需要注意'],
    color: '#991B1B',
    emoji: '💔',
    description: '破财型 - 大损失'
  },
  {
    id: 'fubing',
    name: '伏兵',
    category: '辅星',
    brightness: '陷',
    element: '火',
    yinyang: '阴',
    personality: ['容易有暗害', '容易有小人', '需要注意'],
    color: '#4B5563',
    emoji: '🗡️',
    description: '暗害型 - 容易有小人'
  },
  {
    id: 'guanfu',
    name: '官府',
    category: '辅星',
    brightness: '庙',
    element: '土',
    yinyang: '阳',
    personality: ['有官运', '容易升迁', '有管理能力'],
    color: '#3B82F6',
    emoji: '🏛️',
    description: '官运型 - 管理能力'
  },
  
  // ========== 流年岁前十二星 ==========
  
  {
    id: 'suijian',
    name: '岁建',
    category: '辅星',
    brightness: '庙',
    element: '木',
    yinyang: '阳',
    personality: ['流年主星', '影响一年', '有主导力'],
    color: '#10B981',
    emoji: '📅',
    description: '流年型 - 影响一年'
  },
  {
    id: 'huiqi',
    name: '晦气',
    category: '辅星',
    brightness: '陷',
    element: '火',
    yinyang: '阴',
    personality: ['容易晦气', '不顺利', '需要注意'],
    color: '#6B7280',
    emoji: '🌫️',
    description: '晦气型 - 不顺利'
  },
  {
    id: 'sangmen',
    name: '丧门',
    category: '辅星',
    brightness: '陷',
    element: '水',
    yinyang: '阴',
    personality: ['容易有丧事', '需要注意', '有悲伤'],
    color: '#4B5563',
    emoji: '⚫',
    description: '丧事型 - 需要注意'
  },
  {
    id: 'guansuo',
    name: '贯索',
    category: '辅星',
    brightness: '陷',
    element: '火',
    yinyang: '阳',
    personality: ['容易有束缚', '不自由', '有阻碍'],
    color: '#6B7280',
    emoji: '🔗',
    description: '束缚型 - 有阻碍'
  },
  {
    id: 'guanfu2',
    name: '官符',
    category: '辅星',
    brightness: '陷',
    element: '火',
    yinyang: '阴',
    personality: ['容易有官非', '容易有诉讼', '需要注意'],
    color: '#7C2D12',
    emoji: '⚖️',
    description: '官非型 - 需要注意'
  },
  {
    id: 'xiaohao2',
    name: '小耗',
    category: '辅星',
    brightness: '陷',
    element: '火',
    yinyang: '阴',
    personality: ['容易破小财', '有小损失', '需要注意'],
    color: '#6B7280',
    emoji: '💸',
    description: '破财型 - 小损失'
  },
  {
    id: 'dahao2',
    name: '大耗',
    category: '辅星',
    brightness: '陷',
    element: '火',
    yinyang: '阳',
    personality: ['容易破大财', '有大损失', '需要注意'],
    color: '#991B1B',
    emoji: '💔',
    description: '破财型 - 大损失'
  },
  {
    id: 'longde',
    name: '龙德',
    category: '辅星',
    brightness: '庙',
    element: '火',
    yinyang: '阳',
    personality: ['有德行', '有福报', '容易成功'],
    color: '#10B981',
    emoji: '🐉',
    description: '德行型 - 有福报'
  },
  {
    id: 'baihu',
    name: '白虎',
    category: '辅星',
    brightness: '陷',
    element: '金',
    yinyang: '阳',
    personality: ['容易有凶险', '容易有意外', '需要注意'],
    color: '#DC2626',
    emoji: '🐅',
    description: '凶险型 - 需要注意'
  },
  {
    id: 'tiande',
    name: '天德',
    category: '辅星',
    brightness: '庙',
    element: '火',
    yinyang: '阳',
    personality: ['有德行', '有福报', '容易成功'],
    color: '#10B981',
    emoji: '✨',
    description: '德行型 - 有福报'
  },
  {
    id: 'diaoke',
    name: '吊客',
    category: '辅星',
    brightness: '陷',
    element: '水',
    yinyang: '阴',
    personality: ['容易有丧事', '需要注意', '有悲伤'],
    color: '#4B5563',
    emoji: '⚫',
    description: '丧事型 - 需要注意'
  },
  {
    id: 'bingfu2',
    name: '病符',
    category: '辅星',
    brightness: '陷',
    element: '水',
    yinyang: '阴',
    personality: ['容易生病', '体质较弱', '需要注意健康'],
    color: '#6B7280',
    emoji: '🏥',
    description: '疾病型 - 需要注意健康'
  },
];

/**
 * 获取辅星数据
 */
export function getAuxiliaryStar(name: string): Star | undefined {
  return AUXILIARY_STARS.find(star => star.name === name);
}

/**
 * 获取所有辅星名称
 */
export function getAllAuxiliaryStarNames(): string[] {
  return AUXILIARY_STARS.map(star => star.name);
}

/**
 * 获取所有星曜（主星 + 辅星）
 */
export function getAllStars(): Star[] {
  return [...MAIN_STARS, ...AUXILIARY_STARS];
}

/**
 * 获取所有星曜名称
 */
export function getAllStarNames(): string[] {
  return [...getAllMainStarNames(), ...getAllAuxiliaryStarNames()];
}

/**
 * 根据名称获取星曜（先查主星，再查辅星）
 */
export function getStarByName(name: string): Star | undefined {
  return getMainStar(name) || getAuxiliaryStar(name);
}

