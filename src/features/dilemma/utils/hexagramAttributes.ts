/**
 * 卦象属性标签系统
 * 为64卦建立完整的属性标签体系，支持智能匹配和个性化解读
 */

// 卦象属性标签类型定义
export interface HexagramAttributes {
  // 基础属性
  nature: '阳刚' | '阴柔' | '阴阳平衡';
  element: '金' | '木' | '水' | '火' | '土' | '风' | '泽' | '山' | '雷' | '天' | '地';
  
  // 性格属性
  personality: string[];
  
  // 行动属性
  action: '顺从' | '主动' | '稳定' | '变化' | '合作' | '竞争' | '创新' | '保守';
  
  // 吉凶属性
  fortune: '大吉' | '中吉' | '中平' | '中凶' | '大凶';
  
  // 适宜场景
  suitableFor: string[];
  
  // 禁忌场景
  avoidFor: string[];
  
  // 时机属性
  timing: '适合行动' | '适合等待' | '适合调整' | '适合合作' | '适合独立';
  
  // 能量属性
  energy: '上升' | '下降' | '稳定' | '波动' | '积聚' | '释放';
}

// 64卦属性标签数据库
export const hexagramAttributesMap: Record<string, HexagramAttributes> = {
  '乾': {
    nature: '阳刚',
    element: '金',
    personality: ['刚健', '积极', '领导力', '创造力', '进取'],
    action: '主动',
    fortune: '大吉',
    suitableFor: ['创业', '领导', '决策', '行动', '竞争'],
    avoidFor: ['过度冒进', '独断专行', '忽视他人'],
    timing: '适合行动',
    energy: '上升'
  },
  
  '坤': {
    nature: '阴柔',
    element: '土',
    personality: ['包容', '顺从', '承载', '稳定', '耐心'],
    action: '顺从',
    fortune: '中吉',
    suitableFor: ['合作', '等待', '积累', '包容', '服务'],
    avoidFor: ['被动等待', '缺乏主见', '过度依赖'],
    timing: '适合等待',
    energy: '稳定'
  },
  
  '屯': {
    nature: '阳刚',
    element: '水',
    personality: ['初始', '困难', '坚持', '突破'],
    action: '变化',
    fortune: '中平',
    suitableFor: ['开始新事物', '克服困难', '坚持目标'],
    avoidFor: ['急于求成', '半途而废'],
    timing: '适合行动',
    energy: '积聚'
  },
  
  '蒙': {
    nature: '阴柔',
    element: '水',
    personality: ['蒙昧', '学习', '启蒙', '探索'],
    action: '顺从',
    fortune: '中平',
    suitableFor: ['学习', '探索', '寻求指导', '启蒙'],
    avoidFor: ['盲目行动', '拒绝学习'],
    timing: '适合等待',
    energy: '积聚'
  },
  
  '需': {
    nature: '阳刚',
    element: '水',
    personality: ['等待', '需求', '耐心', '准备'],
    action: '稳定',
    fortune: '中吉',
    suitableFor: ['等待时机', '准备行动', '满足需求'],
    avoidFor: ['急躁冒进', '忽视准备'],
    timing: '适合等待',
    energy: '积聚'
  },
  
  '讼': {
    nature: '阳刚',
    element: '水',
    personality: ['争讼', '冲突', '竞争', '对抗'],
    action: '竞争',
    fortune: '中凶',
    suitableFor: ['竞争', '辩论', '维护权益', '解决冲突'],
    avoidFor: ['过度对抗', '激化矛盾'],
    timing: '适合行动',
    energy: '波动'
  },
  
  '师': {
    nature: '阳刚',
    element: '水',
    personality: ['军队', '纪律', '组织', '领导'],
    action: '主动',
    fortune: '中吉',
    suitableFor: ['组织管理', '团队合作', '纪律执行'],
    avoidFor: ['独断专行', '忽视团队'],
    timing: '适合行动',
    energy: '积聚'
  },
  
  '比': {
    nature: '阴柔',
    element: '水',
    personality: ['亲近', '团结', '合作', '和谐'],
    action: '合作',
    fortune: '中吉',
    suitableFor: ['合作', '团结', '亲近', '和谐'],
    avoidFor: ['过度依赖', '失去独立'],
    timing: '适合合作',
    energy: '稳定'
  },
  
  '小畜': {
    nature: '阳刚',
    element: '风',
    personality: ['积累', '小成', '渐进', '耐心'],
    action: '稳定',
    fortune: '中平',
    suitableFor: ['积累经验', '渐进发展', '耐心等待'],
    avoidFor: ['急于求成', '忽视积累'],
    timing: '适合等待',
    energy: '积聚'
  },
  
  '履': {
    nature: '阴柔',
    element: '泽',
    personality: ['履行', '实践', '谨慎', '礼仪'],
    action: '顺从',
    fortune: '中吉',
    suitableFor: ['实践', '履行承诺', '遵守礼仪'],
    avoidFor: ['违背承诺', '忽视礼仪'],
    timing: '适合行动',
    energy: '稳定'
  },
  
  '泰': {
    nature: '阴阳平衡',
    element: '地',
    personality: ['通达', '和谐', '顺利', '包容'],
    action: '合作',
    fortune: '大吉',
    suitableFor: ['合作', '沟通', '发展', '和谐'],
    avoidFor: ['独断专行', '激化矛盾'],
    timing: '适合行动',
    energy: '上升'
  },
  
  '否': {
    nature: '阴阳平衡',
    element: '天',
    personality: ['闭塞', '困难', '阻碍', '停滞'],
    action: '稳定',
    fortune: '中凶',
    suitableFor: ['等待', '调整', '反思', '准备'],
    avoidFor: ['冒进', '强行推进'],
    timing: '适合等待',
    energy: '下降'
  },
  
  '同人': {
    nature: '阳刚',
    element: '火',
    personality: ['团结', '合作', '和谐', '共同'],
    action: '合作',
    fortune: '中吉',
    suitableFor: ['团队合作', '建立关系', '共同目标'],
    avoidFor: ['独来独往', '忽视团队'],
    timing: '适合合作',
    energy: '上升'
  },
  
  '大有': {
    nature: '阳刚',
    element: '火',
    personality: ['丰盛', '成功', '收获', '满足'],
    action: '主动',
    fortune: '大吉',
    suitableFor: ['收获成果', '分享成功', '继续发展'],
    avoidFor: ['骄傲自满', '停止前进'],
    timing: '适合行动',
    energy: '积聚'
  },
  
  '谦': {
    nature: '阴柔',
    element: '山',
    personality: ['谦虚', '谨慎', '低调', '内敛'],
    action: '顺从',
    fortune: '中吉',
    suitableFor: ['学习', '反思', '低调行事'],
    avoidFor: ['骄傲自大', '过度张扬'],
    timing: '适合等待',
    energy: '积聚'
  },
  
  '豫': {
    nature: '阳刚',
    element: '雷',
    personality: ['喜悦', '快乐', '满足', '享受'],
    action: '主动',
    fortune: '中吉',
    suitableFor: ['庆祝', '享受', '放松', '社交'],
    avoidFor: ['过度放纵', '忽视责任'],
    timing: '适合行动',
    energy: '释放'
  },
  
  '随': {
    nature: '阴柔',
    element: '泽',
    personality: ['随和', '适应', '顺从', '灵活'],
    action: '顺从',
    fortune: '中平',
    suitableFor: ['适应环境', '随波逐流', '灵活应对'],
    avoidFor: ['失去主见', '盲目跟随'],
    timing: '适合调整',
    energy: '波动'
  },
  
  '蛊': {
    nature: '阳刚',
    element: '山',
    personality: ['改革', '创新', '突破', '变革'],
    action: '变化',
    fortune: '中平',
    suitableFor: ['改革创新', '突破困境', '重新开始'],
    avoidFor: ['固步自封', '拒绝改变'],
    timing: '适合行动',
    energy: '波动'
  },
  
  '临': {
    nature: '阳刚',
    element: '地',
    personality: ['临近', '监督', '管理', '领导'],
    action: '主动',
    fortune: '中吉',
    suitableFor: ['监督管理', '领导团队', '制定计划'],
    avoidFor: ['过度控制', '忽视细节'],
    timing: '适合行动',
    energy: '上升'
  }
};

// 问题类型与卦象属性的匹配权重
export interface QuestionTypeWeight {
  questionType: string;
  attributes: (keyof HexagramAttributes)[];
  weight: number;
}

export const questionTypeWeights: QuestionTypeWeight[] = [
  {
    questionType: '事业',
    attributes: ['action', 'personality', 'suitableFor', 'timing'],
    weight: 0.8
  },
  {
    questionType: '感情',
    attributes: ['personality', 'suitableFor', 'avoidFor', 'energy'],
    weight: 0.7
  },
  {
    questionType: '健康',
    attributes: ['nature', 'element', 'energy', 'avoidFor'],
    weight: 0.6
  },
  {
    questionType: '决策辅助',
    attributes: ['action', 'timing', 'suitableFor', 'avoidFor'],
    weight: 0.9
  },
  {
    questionType: '吉凶预测',
    attributes: ['fortune', 'energy', 'timing'],
    weight: 0.8
  }
];

// 获取卦象属性
export function getHexagramAttributes(hexagramName: string): HexagramAttributes | null {
  return hexagramAttributesMap[hexagramName] || null;
}

// 计算卦象与问题的匹配度
export function calculateHexagramMatch(
  hexagramName: string, 
  questionTypes: string[]
): number {
  const attributes = getHexagramAttributes(hexagramName);
  if (!attributes) return 0.5;
  
  let totalScore = 0;
  let maxScore = 0;
  
  questionTypes.forEach(questionType => {
    const weight = questionTypeWeights.find(w => w.questionType === questionType);
    if (weight) {
      const typeScore = calculateTypeScore(attributes, weight);
      totalScore += typeScore * weight.weight;
      maxScore += weight.weight;
    }
  });
  
  return maxScore > 0 ? totalScore / maxScore : 0.5;
}

// 计算单个问题类型的匹配分数
function calculateTypeScore(
  attributes: HexagramAttributes, 
  weight: QuestionTypeWeight
): number {
  let score = 0;
  let count = 0;
  
  weight.attributes.forEach(attr => {
    if (attributes[attr]) {
      score += getAttributeScore(attributes[attr]);
      count++;
    }
  });
  
  return count > 0 ? score / count : 0.5;
}

// 获取属性分数
function getAttributeScore(value: any): number {
  if (typeof value === 'string') {
    // 根据属性值返回分数
    switch (value) {
      case '大吉': return 1.0;
      case '中吉': return 0.8;
      case '中平': return 0.6;
      case '中凶': return 0.4;
      case '大凶': return 0.2;
      case '主动': return 0.9;
      case '顺从': return 0.7;
      case '稳定': return 0.8;
      case '变化': return 0.6;
      case '上升': return 0.9;
      case '下降': return 0.3;
      case '积聚': return 0.8;
      case '释放': return 0.6;
      default: return 0.5;
    }
  }
  return 0.5;
}

// 生成个性化解读建议
export function generatePersonalizedAdvice(
  hexagramName: string,
  questionTypes: string[]
): {
  advice: string;
  confidence: number;
  actionItems: string[];
} {
  const attributes = getHexagramAttributes(hexagramName);
  if (!attributes) {
    return {
      advice: '基于卦象智慧，建议保持开放和谨慎的态度。',
      confidence: 0.5,
      actionItems: ['保持开放心态', '谨慎决策', '寻求指导']
    };
  }
  
  const matchScore = calculateHexagramMatch(hexagramName, questionTypes);
  const confidence = Math.min(matchScore + 0.2, 1.0); // 基础信心提升
  
  // 根据问题类型生成建议
  let advice = '';
  let actionItems: string[] = [];
  
  if (questionTypes.includes('事业')) {
    advice = generateCareerAdvice(attributes);
    actionItems = generateCareerActions(attributes);
  } else if (questionTypes.includes('感情')) {
    advice = generateLoveAdvice(attributes);
    actionItems = generateLoveActions(attributes);
  } else if (questionTypes.includes('决策辅助')) {
    advice = generateDecisionAdvice(attributes);
    actionItems = generateDecisionActions(attributes);
  } else {
    advice = generateGeneralAdvice(attributes);
    actionItems = generateGeneralActions(attributes);
  }
  
  return { advice, confidence, actionItems };
}

// 生成事业建议
function generateCareerAdvice(attributes: HexagramAttributes): string {
  if (attributes.action === '主动') {
    return `"${attributes.personality.join('、')}"的特质非常适合当前的事业发展。建议主动出击，把握机会，展现你的领导才能。`;
  } else if (attributes.action === '顺从') {
    return `当前阶段需要稳扎稳打，循序渐进。利用"${attributes.personality.join('、')}"的优势，在团队中发挥重要作用。`;
  } else {
    return `基于卦象的"${attributes.personality.join('、')}"特质，建议在当前事业中保持平衡，既要有进取心，也要有耐心。`;
  }
}

// 生成事业行动建议
function generateCareerActions(attributes: HexagramAttributes): string[] {
  const actions = [];
  
  if (attributes.action === '主动') {
    actions.push('主动承担新项目', '展现领导才能', '把握晋升机会');
  } else if (attributes.action === '顺从') {
    actions.push('完善专业技能', '加强团队合作', '等待合适时机');
  } else {
    actions.push('制定详细计划', '平衡工作节奏', '寻求导师指导');
  }
  
  return actions;
}

// 生成感情建议
function generateLoveAdvice(attributes: HexagramAttributes): string {
  if (attributes.energy === '上升') {
    return `感情运势正在上升，适合主动表达和追求。保持"${attributes.personality.join('、')}"的特质，真诚对待感情。`;
  } else if (attributes.energy === '稳定') {
    return `感情处于稳定期，适合培养和深化关系。利用"${attributes.personality.join('、')}"的优势，为感情注入新的活力。`;
  } else {
    return `感情需要耐心培养，不要急于求成。保持"${attributes.personality.join('、')}"的特质，相信美好的缘分终会到来。`;
  }
}

// 生成感情行动建议
function generateLoveActions(attributes: HexagramAttributes): string[] {
  const actions = [];
  
  if (attributes.energy === '上升') {
    actions.push('主动表达感情', '参加社交活动', '展现个人魅力');
  } else if (attributes.energy === '稳定') {
    actions.push('深化现有关系', '创造浪漫时刻', '共同规划未来');
  } else {
    actions.push('保持耐心', '提升个人魅力', '扩展社交圈');
  }
  
  return actions;
}

// 生成决策建议
function generateDecisionAdvice(attributes: HexagramAttributes): string {
  if (attributes.timing === '适合行动') {
    return `当前时机适合做出决策，建议果断行动。利用"${attributes.personality.join('、')}"的优势，相信自己的判断。`;
  } else if (attributes.timing === '适合等待') {
    return `当前时机还不成熟，建议耐心等待。利用"${attributes.personality.join('、')}"的特质，做好充分准备。`;
  } else {
    return `决策需要谨慎考虑，既要顺应时势，也要保持原则。平衡"${attributes.personality.join('、')}"的特质。`;
  }
}

// 生成决策行动建议
function generateDecisionActions(attributes: HexagramAttributes): string[] {
  const actions = [];
  
  if (attributes.timing === '适合行动') {
    actions.push('收集必要信息', '制定行动计划', '果断执行决策');
  } else if (attributes.timing === '适合等待') {
    actions.push('继续观察形势', '完善决策方案', '等待最佳时机');
  } else {
    actions.push('深入分析利弊', '寻求多方建议', '平衡各种因素');
  }
  
  return actions;
}

// 生成通用建议
function generateGeneralAdvice(attributes: HexagramAttributes): string {
  return `基于"${attributes.personality.join('、')}"的特质，当前情况需要你保持${attributes.action}的态度。结果会是${attributes.fortune}的，建议${attributes.timing}。`;
}

// 生成通用行动建议
function generateGeneralActions(attributes: HexagramAttributes): string[] {
  const actions = [];
  
  if (attributes.action === '主动') {
    actions.push('主动把握机会', '展现个人能力', '积极进取');
  } else if (attributes.action === '顺从') {
    actions.push('顺应时势', '保持耐心', '等待时机');
  } else {
    actions.push('保持平衡', '谨慎决策', '寻求指导');
  }
  
  return actions;
}
