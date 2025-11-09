/**
 * 八卦五行对应表
 * 定义八个基本卦象对应的五行属性
 */

export type TrigramName = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤';
export type Element = '金' | '木' | '水' | '火' | '土';

export interface TrigramElement {
  /** 八卦名称 */
  trigram: TrigramName;
  /** 五行属性 */
  element: Element;
  /** 自然象征 */
  nature: string;
  /** 英文名（兼容旧系统） */
  englishName?: string;
}

/**
 * 八卦五行对应关系
 */
export const TRIGRAM_ELEMENTS: Record<TrigramName, TrigramElement> = {
  '乾': {
    trigram: '乾',
    element: '金',
    nature: '天',
    englishName: 'Heaven'
  },
  '兑': {
    trigram: '兑',
    element: '金',
    nature: '泽',
    englishName: 'Lake'
  },
  '离': {
    trigram: '离',
    element: '火',
    nature: '火',
    englishName: 'Fire'
  },
  '震': {
    trigram: '震',
    element: '木',
    nature: '雷',
    englishName: 'Thunder'
  },
  '巽': {
    trigram: '巽',
    element: '木',
    nature: '风',
    englishName: 'Wind'
  },
  '坎': {
    trigram: '坎',
    element: '水',
    nature: '水',
    englishName: 'Water'
  },
  '艮': {
    trigram: '艮',
    element: '土',
    nature: '山',
    englishName: 'Mountain'
  },
  '坤': {
    trigram: '坤',
    element: '土',
    nature: '地',
    englishName: 'Earth'
  }
};

/**
 * 五行生克关系
 */
export type ElementRelationship = 'ke' | 'sheng' | 'bihe';

/**
 * 判断两个五行之间的生克关系
 * @param element1 第一个五行
 * @param element2 第二个五行
 * @returns 关系类型：'ke'=相克, 'sheng'=相生, 'bihe'=比和（相同）
 */
export function getElementRelationship(element1: Element, element2: Element): ElementRelationship {
  if (element1 === element2) {
    return 'bihe';
  }

  // 相生关系：金生水 → 水生木 → 木生火 → 火生土 → 土生金
  const shengMap: Record<Element, Element> = {
    '金': '水',
    '水': '木',
    '木': '火',
    '火': '土',
    '土': '金'
  };

  // 相克关系：金克木 → 木克土 → 土克水 → 水克火 → 火克金
  const keMap: Record<Element, Element> = {
    '金': '木',
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金'
  };

  if (shengMap[element1] === element2) {
    return 'sheng'; // element1 生 element2
  }

  if (keMap[element1] === element2) {
    return 'ke'; // element1 克 element2
  }

  // 反过来检查
  if (shengMap[element2] === element1) {
    return 'ke'; // element2 生 element1，意味着 element1 被生（在体用关系中，用生体）
  }

  if (keMap[element2] === element1) {
    return 'ke'; // element2 克 element1，意味着 element1 被克（在体用关系中，用克体）
  }

  return 'bihe'; // 默认返回比和（虽然理论上不会到这里）
}

/**
 * 获取八卦的五行属性
 * @param trigram 八卦名称
 * @returns 五行属性
 */
export function getTrigramElement(trigram: TrigramName): Element {
  return TRIGRAM_ELEMENTS[trigram].element;
}

/**
 * 根据英文卦名获取五行（兼容旧系统）
 * @param englishName 英文卦名
 * @returns 五行属性或null
 */
export function getElementByEnglishName(englishName: string): Element | null {
  for (const trigram in TRIGRAM_ELEMENTS) {
    const data = TRIGRAM_ELEMENTS[trigram as TrigramName];
    if (data.englishName === englishName) {
      return data.element;
    }
  }
  return null;
}

