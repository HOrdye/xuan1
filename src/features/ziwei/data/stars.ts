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

