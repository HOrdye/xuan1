/**
 * 问题关键词匹配工具
 * 用于判断问题是否匹配命盘相关领域，决定是否显示三维解读入口
 */

/**
 * 命盘相关领域关键词库
 */
const PALACE_RELATED_KEYWORDS = {
  // 事业相关（官禄宫）
  career: ['工作', '职业', '事业', '升职', '跳槽', '换工作', '创业', '投资', '生意', '职场', '同事', '领导', '老板', '公司', '行业', '岗位', '薪资', '收入'],
  
  // 感情相关（夫妻宫）
  relationship: ['感情', '恋爱', '结婚', '分手', '复合', '婚姻', '对象', '恋人', '伴侣', '相亲', '桃花', '缘分', '爱情', '喜欢', '暗恋'],
  
  // 财运相关（财帛宫）
  wealth: ['财运', '赚钱', '投资', '理财', '股票', '基金', '生意', '收入', '支出', '债务', '贷款', '买房', '买车'],
  
  // 健康相关（疾厄宫）
  health: ['健康', '身体', '疾病', '生病', '手术', '治疗', '养生', '锻炼', '体检'],
  
  // 学业相关（父母宫/迁移宫）
  study: ['学习', '考试', '升学', '留学', '考研', '考公', '证书', '成绩', '学业', '教育'],
  
  // 人际关系（兄弟宫/交友宫）
  social: ['朋友', '社交', '人际关系', '合作', '团队', '伙伴', '人脉', '圈子'],
  
  // 家庭相关（田宅宫/父母宫）
  family: ['家庭', '父母', '子女', '买房', '搬家', '装修', '房产', '遗产'],
  
  // 性格特质（命宫）
  personality: ['性格', '特质', '能力', '天赋', '优势', '缺点', '改变', '成长']
};

/**
 * 检查问题是否匹配命盘相关领域
 * @param question 用户问题
 * @returns 匹配的领域数组，如果匹配则返回领域列表，否则返回空数组
 */
export function matchQuestionToPalaces(question: string): string[] {
  if (!question || typeof question !== 'string') {
    return [];
  }

  const normalizedQuestion = question.toLowerCase();
  const matchedPalaces: string[] = [];

  // 遍历所有领域关键词
  for (const [palace, keywords] of Object.entries(PALACE_RELATED_KEYWORDS)) {
    // 检查问题中是否包含该领域的关键词
    const hasMatch = keywords.some(keyword => 
      normalizedQuestion.includes(keyword.toLowerCase())
    );
    
    if (hasMatch) {
      matchedPalaces.push(palace);
    }
  }

  return matchedPalaces;
}

/**
 * 判断是否应该显示三维解读入口
 * @param question 用户问题
 * @param hasChart 用户是否有命盘数据
 * @returns 是否应该显示入口
 */
export function shouldShowTripleAnalysisEntry(
  question: string, 
  hasChart: boolean
): boolean {
  // 如果用户没有命盘，不显示入口（因为需要命盘数据）
  if (!hasChart) {
    return false;
  }

  // 检查问题是否匹配命盘相关领域
  const matchedPalaces = matchQuestionToPalaces(question);
  
  // 至少匹配一个领域才显示入口
  return matchedPalaces.length > 0;
}

/**
 * 获取匹配领域的友好名称
 */
export function getPalaceFriendlyName(palace: string): string {
  const nameMap: Record<string, string> = {
    career: '事业',
    relationship: '感情',
    wealth: '财运',
    health: '健康',
    study: '学业',
    social: '人际',
    family: '家庭',
    personality: '性格'
  };
  
  return nameMap[palace] || palace;
}

/**
 * 生成三维解读入口的引导文案
 * @param matchedPalaces 匹配的领域数组
 * @returns 引导文案
 */
export function generateEntryPrompt(matchedPalaces: string[]): string {
  if (matchedPalaces.length === 0) {
    return '想结合命盘看这个问题？';
  }

  const palaceNames = matchedPalaces
    .slice(0, 2) // 最多显示2个领域
    .map(getPalaceFriendlyName)
    .join('、');

  if (matchedPalaces.length === 1) {
    return `想从${palaceNames}角度结合命盘看这个问题？`;
  } else {
    return `想从${palaceNames}等角度结合命盘看这个问题？`;
  }
}



