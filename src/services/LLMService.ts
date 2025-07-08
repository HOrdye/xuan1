import type { Hexagram } from '../features/dilemma/types';
import type { StoryTarotCard } from '../features/tarot/utils/storyTarotData';
import type { TarotSpread } from '../features/tarot/utils/tarotInterpretation';
import { EnvConfigManager } from '../utils/envConfig';

export type TarotIntent = 
  | 'Prediction' 
  | 'Advice' 
  | 'Diagnosis' 
  | 'Relationship' 
  | 'Decision' 
  | 'Self-Exploration';

export interface InterpretationSection {
    title: string;
    content: string;
  icon: string;
}

export type StructuredTarotInterpretation = InterpretationSection[];

export interface LLMConfig {
  provider: 'openai' | 'claude' | 'deepseek' | 'qianwen' | 'custom';
  apiKey: string;
  baseURL?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMLoadingState {
  isLoading: boolean;
  progress: string;
  stage: 'preparing' | 'calling' | 'processing' | 'completed' | 'error';
}

const DEFAULT_CONFIG: LLMConfig = {
  provider: 'deepseek',
  apiKey: EnvConfigManager.getEnvVar('VITE_LLM_API_KEY', ''),
  baseURL: EnvConfigManager.getEnvVar('VITE_LLM_BASE_URL', ''),
  model: 'deepseek-chat',
  temperature: 0.7,
  maxTokens: 4000
};

console.log('🔧 LLM Service 初始化配置:', {
  provider: DEFAULT_CONFIG.provider,
  hasApiKey: !!DEFAULT_CONFIG.apiKey,
  baseURL: DEFAULT_CONFIG.baseURL || '使用默认',
  model: DEFAULT_CONFIG.model
});

export class LLMService {
  private static config: LLMConfig = DEFAULT_CONFIG;
  private static loadingCallbacks: ((state: LLMLoadingState) => void)[] = [];
  
  static setConfig(config: Partial<LLMConfig>) {
    this.config = { ...this.config, ...config };
    console.log('🔧 LLM配置已更新:', {
      provider: this.config.provider,
      hasApiKey: !!this.config.apiKey,
      model: this.config.model
    });
  }
  
  static getConfig(): LLMConfig {
    return { ...this.config };
  }
  
  static onLoadingStateChange(callback: (state: LLMLoadingState) => void) {
    this.loadingCallbacks.push(callback);
  }
  
  static offLoadingStateChange(callback: (state: LLMLoadingState) => void) {
    const index = this.loadingCallbacks.indexOf(callback);
    if (index > -1) {
      this.loadingCallbacks.splice(index, 1);
    }
  }
  
  private static updateLoadingState(state: LLMLoadingState) {
    this.loadingCallbacks.forEach(callback => callback(state));
  }

  static async getTarotInterpretation(
    cards: StoryTarotCard[],
    spread: TarotSpread,
    question: string = ''
  ): Promise<FinalTarotInterpretation> {
    this.updateLoadingState({ isLoading: true, progress: '正在准备塔罗牌解读...', stage: 'preparing' });

    try {
      console.log('🃏 V4.0 AI驱动的塔罗牌整合解读流程启动...', { cardCount: cards.length, spread: spread.name, question });

      this.updateLoadingState({ isLoading: true, progress: '正在分析您的问题意图...', stage: 'preparing' });
      const intent = await this.determineUserIntent(question);
      console.log(`🧠 AI识别到用户意图: ${intent}`);
        
      this.updateLoadingState({ isLoading: true, progress: '正在为您生成整体运势解读...', stage: 'calling' });

      const scriptRunner = this.interpretationScripts[intent] || this.interpretationScripts['Advice'];
      const mainInterpretation = await scriptRunner(cards, spread, question, intent);
      
      this.updateLoadingState({ isLoading: true, progress: '正在生成卡牌专属解读...', stage: 'processing' });

      const cardInterpretationPromises = cards.map((card, index) => {
        const positionInfo = spread.positions[index];
        return this.getSingleCardInterpretation(
            card,
            positionInfo.chineseName,
            mainInterpretation,
            intent
        );
      });
  
      const individualInterpretations = await Promise.all(cardInterpretationPromises);
  
      const cardsWithInterpretations = cards.map((card, index) => ({
        ...card,
        name: card.chineseName || card.name,
        position: spread.positions[index].chineseName,
        interpretation: individualInterpretations[index]
      }));
        
      this.updateLoadingState({ isLoading: false, progress: '解读完成', stage: 'completed' });
        
      return {
        mainInterpretation: mainInterpretation,
        cards: cardsWithInterpretations,
      };

    } catch (error) {
      console.error('❌ 塔罗解读失败:', error);
      this.updateLoadingState({ isLoading: false, progress: '解读失败，请重试', stage: 'error' });
      // Return a valid structure on error to prevent frontend crashes
      return {
        mainInterpretation: [{
          icon: '⚠️',
          title: '解读生成失败',
          content: `抱歉，在为您生成解读时遇到问题。请检查您的网络连接或稍后再试。\n\n错误信息: ${(error as Error).message}`
        }],
        cards: cards.map((card, index) => ({
          ...card,
          name: card.chineseName || card.name,
          position: spread.positions[index]?.chineseName || '未知位置',
          interpretation: '加载失败'
        }))
      };
    }
  }

  private static async getSingleCardInterpretation(
    card: StoryTarotCard,
    positionName: string,
    mainInterpretation: StructuredTarotInterpretation,
    intent: TarotIntent
  ): Promise<string> {
    if (!this.config.apiKey) {
      return 'AI服务未配置，无法生成此卡的详细解读。';
    }
    const prompt = `你是一位塔罗解读大师，正在进行一次完整的解读。
- **整体解读概览**: "${mainInterpretation.map(s => s.title).join(', ')}"
- **用户意图**: ${intent}
- **当前卡牌**: ${card.chineseName}
- **所在位置**: ${positionName}
- **卡牌故事与关键词**: ${card.storyInterpretation} ${card.keywords.join(', ')}

请为【${card.chineseName}】在【${positionName}】这个位置上，提供一段深刻、具体、不超过120字的独立解读。解读需与整体解读方向和用户意图保持一致，但聚焦于这张牌本身揭示的细节。请直接返回解读文本，不要任何多余的开场白或标题。`;
    try {
      const response = await this.callLLMAPI(prompt);
      return response.content || 'AI未能返回有效的解读内容。';
    } catch (error) {
      console.error(`生成单牌 "${card.name}" 解读失败:`, error);
      return `生成此部分解读时遇到错误。`;
    }
  }

  private static async determineUserIntent(question: string): Promise<TarotIntent> {
    if (!question.trim() || !this.config.apiKey) {
      const fallbackIntent: TarotIntent = question.includes('还是') || question.includes('或者') ? 'Decision' : 'Advice';
      const reason = !question.trim() ? '问题为空' : '未配置API Key';
      console.log(`🧠 意图识别回退: ${reason}，使用 '${fallbackIntent}'`);
      return fallbackIntent;
    }
    
    const prompt = this.buildIntentPrompt(question);
    try {
      const response = await this.callLLMAPI(prompt);
      const intent = response.content.trim().replace(/"/g, '') as TarotIntent;
      const validIntents: TarotIntent[] = ['Prediction', 'Advice', 'Diagnosis', 'Relationship', 'Decision', 'Self-Exploration'];
      
      if (validIntents.includes(intent)) {
        return intent;
      }
      
      console.warn(`LLM返回了未知的意图: '${intent}', 回退到 'Advice'`);
      return 'Advice';
    } catch (error) {
      console.error('意图识别API调用失败:', error);
      return 'Advice';
    }
  }

  private static buildIntentPrompt(question: string): string {
    return `你是一位资深的塔罗解读专家，擅长洞察提问者背后的真实意图。请将用户的提问精准地归类到以下类别之一：
- Prediction: 询问未来事件或趋势。(例如: "我今年的财运会怎样？")
- Advice: 寻求具体的行动指导。(例如: "我应该如何改善我的工作状态？")
- Diagnosis: 探究问题发生的深层原因。(例如: "为什么我总是存不到钱？")
- Relationship: 分析与他人的关系状况或对方想法。(例如: "TA现在是怎么想我的？")
- Decision: 在两个或多个选项中进行选择。(例如: "我应该跳槽去A公司，还是留在B公司？")
- Self-Exploration: 探索自我、人生课题或内在成长。(例如: "我的人生课题是什么？")

请只返回最匹配的类别名称（例如 'Prediction'），不要任何多余的文字。
用户问题是："${question}"`;
  }

  private static interpretationScripts: Record<TarotIntent, (cards: StoryTarotCard[], spread: TarotSpread, question: string, intent: TarotIntent) => Promise<StructuredTarotInterpretation>> = {
    Prediction: async (cards, spread, question, intent) => Promise.all([
      this.getAISection({ icon: '🔮', title: '核心预兆' }, cards, spread, question, intent),
      this.getAISection({ icon: '🔑', title: '关键节点与影响' }, cards, spread, question, intent),
      this.getAISection({ icon: '🔭', title: '可能性展望' }, cards, spread, question, intent)
    ]),
    Advice: async (cards, spread, question, intent) => Promise.all([
      this.getAISection({ icon: '🔍', title: '整体能量分析' }, cards, spread, question, intent),
      this.getAISection({ icon: '💡', title: '行动指南与策略' }, cards, spread, question, intent),
      this.getAISection({ icon: '✨', title: '核心启示与反思' }, cards, spread, question, intent)
    ]),
    Diagnosis: async (cards, spread, question, intent) => Promise.all([
      this.getAISection({ icon: '🩺', title: '表层现象' }, cards, spread, question, intent),
      this.getAISection({ icon: '🌿', title: '深层根源' }, cards, spread, question, intent),
      this.getAISection({ icon: '💊', title: '疗愈路径' }, cards, spread, question, intent)
    ]),
    Relationship: async (cards, spread, question, intent) => Promise.all([
      this.getAISection({ icon: '👤', title: '你的视角与状态' }, cards, spread, question, intent),
      this.getAISection({ icon: '💖', title: '对方的视角与状态' }, cards, spread, question, intent),
      this.getAISection({ icon: '🤝', title: '关系动态与未来' }, cards, spread, question, intent)
    ]),
    Decision: async (cards, spread, question, intent) => Promise.all([
      this.getAISection({ icon: '🅰️', title: '选择A的图景' }, cards, spread, question, intent),
      this.getAISection({ icon: '🅱️', title: '选择B的图景' }, cards, spread, question, intent),
      this.getAISection({ icon: '⚖️', title: '权衡的关键' }, cards, spread, question, intent)
    ]),
    'Self-Exploration': async (cards, spread, question, intent) => Promise.all([
      this.getAISection({ icon: '🌌', title: '当下的你：内在能量图景' }, cards, spread, question, intent),
      this.getAISection({ icon: '🧠', title: '潜意识的讯息' }, cards, spread, question, intent),
      this.getAISection({ icon: '🧭', title: '灵性成长之路' }, cards, spread, question, intent)
    ])
  };

  private static async getAISection(
    section: { icon: string, title: string },
    cards: StoryTarotCard[],
    spread: TarotSpread,
    question: string,
    intent: TarotIntent
  ): Promise<InterpretationSection> {
    if (!this.config.apiKey) {
      return { ...section, content: 'AI服务未配置，无法生成解读。请检查API Key。' };
    }
    try {
      const prompt = this.buildSectionPrompt(section.title, cards, spread, question, intent);
      const response = await this.callLLMAPI(prompt);
      return {
        ...section,
        content: (response.content || 'AI未能返回有效的解读内容。').replace(/\*/g, '')
      };
    } catch (error) {
      console.error(`生成解读部分 "${section.title}" 失败:`, error);
      return { ...section, content: `生成此部分解读时遇到错误：${(error as Error).message}` };
    }
  }

  private static buildSectionPrompt(
    sectionTitle: string,
    cards: StoryTarotCard[], 
    spread: TarotSpread, 
    question: string,
    intent: TarotIntent
  ): string {
    const cardsInfo = cards.map((card, index) => 
      `${index + 1}. **${card.chineseName || card.name}** (在 **${spread.positions[index]?.chineseName || `位置${index+1}`}**): 关键词 - ${card.keywords.join(', ')}。故事 - ${card.storyInterpretation}`
    ).join('\n');
    
    const questionContext = question ? `**用户的问题是**: "${question}"` : "用户没有提出具体问题，请提供一次通用的、深刻的人生智慧解读。";

    const basePrompt = `你是一位拥有30年经验、精通心理学、充满智慧与慈悲的塔罗解读大师。你的解读风格深刻、温暖、富有启发性，并且总是紧密结合用户的具体问题和牌面信息。

**基本信息**:
- ${questionContext}
- **牌阵**: ${spread.name} (${spread.description})
- **抽到的牌**:
${cardsInfo}

**你的任务**:
请只针对下面的【解读板块标题】，生成一段深刻、具体、高度相关的解读内容。内容必须温暖、易懂、有启发性，并且直接针对用户的问题。严禁输出标题、icon或者与任务无关的内容。`;

    const expertRoles: Record<string, string> = {
        '核心预兆': `作为一位趋势观察家，请基于所有牌面，提炼出一个核心的、贯穿始终的预兆或主题。`,
        '关键节点与影响': `作为一位历史学家，请分析"过去"的牌如何影响了"现在"，以及"现在"的牌如何为"未来"的牌奠定基础。`,
        '可能性展望': `作为一位务实的预言家，请聚焦于代表"未来"的牌，描绘一个最可能发生的、具体的未来图景，并指出其中的机遇和挑战。`,
        '整体能量分析': `作为一位能量整合专家，请综合所有牌的能量（元素、数字、大/小阿卡纳），用生动而非术语化的语言，描绘当前状况的整体能量氛围。`,
        '行动指南与策略': `作为一位战略顾问，请提供具体、可执行、分阶段的行动建议，直接回应用户的问题。`,
        '核心启示与反思': `作为一位哲学家，请从本次解读中提炼出最深刻的人生智慧，并提出一个直击灵魂的反思性问题。`,
        '表层现象': `作为一位诊断医生，请描述用户当前能感受到的、最明显的困扰或状况是什么。`,
        '深层根源': `作为一位心理学家，请深入挖掘导致表层现象的、隐藏在潜意识或过往经历中的根本原因。`,
        '疗愈路径': `作为一位治疗师，请提供具体的、可行的建议来处理诊断出的根源问题。`,
        '你的视角与状态': `作为一位读心者，请深入分析代表提问者一方的牌，揭示其当下的心态、期望和挑战。`,
        '对方的视角与状态': `作为一位读心者，请深入分析代表另一方的牌，推测其可能的想法、感受和动机。`,
        '关系动态与未来': `作为一位关系顾问，请整合双方信息，分析这段关系的核心动态、潜在问题和未来走向。`,
        '选择A的图景': `作为一位情景规划师，请生动描绘出如果用户选择A，可能会出现的状况、感受和结果。`,
        '选择B的图景': `作为一位情景规划师，请生动描绘出如果用户选择B，可能会出现的状况、感受和结果。`,
        '权衡的关键': `作为一位决策分析师，请明确指出做出选择的核心考量点和需要权衡的利弊。`,
        '当下的你：内在能量图景': `作为一位灵性导师，请描绘出用户当前的内在能量状态、优势和需要关注的领域。`,
        '潜意识的讯息': `作为一位解梦师，请解读牌阵所揭示的来自用户潜意识的深层信息或渴望。`,
        '灵性成长之路': `作为一位向导，请根据牌阵指示，为用户的灵性成长或人生课题提供方向性的指引。`
    };
    
    // Base formatting rules applicable to all intents
    let finalFormattingRules = `
**格式化指令**:
- **必须使用Markdown语法**来增强可读性。
- 使用项目符号 (例如: \`* 关键点1\`) 来分点列出关键洞察，使逻辑更清晰。
- 使用粗体 (例如: \`**核心概念**\`) 来强调最重要的术语和概念。`;

    // Define which intents should receive a direct "Action Instruction"
    const actionOrientedIntents: TarotIntent[] = ['Advice', 'Decision', 'Diagnosis'];
    
    // Conditionally add the action instruction based on the user's intent
    if (actionOrientedIntents.includes(intent)) {
      finalFormattingRules += `
- 在解读的结尾，根据内容提炼一句最核心的行动建议，并以\`**行动指令：**\`开头。`;
    }

    const rolePrompt = expertRoles[sectionTitle] || `请深入解读【${sectionTitle}】这个板块。`;
    
    return `${basePrompt}\n${rolePrompt}\n${finalFormattingRules}`;
  }

  private static async callLLMAPI(prompt: string): Promise<LLMResponse> {
    const { provider, apiKey, baseURL, model, temperature, maxTokens } = this.config;
    console.log('🔗 调用LLM API:', { provider, hasApiKey: !!apiKey, baseURL: baseURL || '默认', model: model || '默认' });
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    let url = '';
    let body: any = {};
    switch (provider) {
      case 'openai':
        url = baseURL || 'https://api.openai.com/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiKey}`;
        body = { model: model || 'gpt-3.5-turbo', messages: [{ role: 'user', content: prompt }], temperature, max_tokens: maxTokens };
        break;
      case 'deepseek':
        url = baseURL || 'https://api.deepseek.com/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiKey}`;
        body = { model: model || 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature, max_tokens: maxTokens };
        break;
      case 'qianwen':
        url = baseURL || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
        headers['Authorization'] = `Bearer ${apiKey}`;
        headers['X-DashScope-SSE'] = 'disable';
        body = { model: model || 'qwen-plus', input: { messages: [{ role: 'user', content: prompt }] }, parameters: { temperature, max_tokens: maxTokens } };
        break;
      case 'claude':
        url = baseURL || 'https://api.anthropic.com/v1/messages';
        headers['Authorization'] = `Bearer ${apiKey}`;
        headers['anthropic-version'] = '2023-06-01';
        body = { model: model || 'claude-3-sonnet-20240229', messages: [{ role: 'user', content: prompt }], max_tokens: maxTokens || 4000 };
        break;
      case 'custom':
        if (!baseURL) throw new Error('自定义API需要配置baseURL');
        url = baseURL;
        headers['Authorization'] = `Bearer ${apiKey}`;
        body = { model: model || 'gpt-3.5-turbo', messages: [{ role: 'user', content: prompt }], temperature, max_tokens: maxTokens };
        break;
      default:
        throw new Error(`不支持的LLM提供商: ${provider}`);
    }
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API请求失败:', { status: response.status, statusText: response.statusText, error: errorText });
      throw new Error(`LLM API请求失败: ${response.status} - ${errorText}`);
      }
    const data = await response.json();
    let content = '';
    switch (provider) {
      case 'openai': case 'deepseek': case 'custom':
        content = data.choices?.[0]?.message?.content || ''; break;
      case 'qianwen':
        content = data.output?.text || data.output?.choices?.[0]?.message?.content || ''; break;
      case 'claude':
        content = data.content?.[0]?.text || ''; break;
      default:
        content = data.content || data.text || '';
    }
    return { content, usage: data.usage };
  }
  
  static async getHexagramInterpretation(hexagram: Hexagram, question?: string): Promise<string> {
    this.updateLoadingState({ isLoading: true, progress: '正在准备卦象解读...', stage: 'preparing' });
    try {
      if (!this.config.apiKey) {
        console.warn('⚠️ 未配置LLM API密钥，使用本地卦象解读');
        const result = this.getLocalHexagramInterpretation(hexagram, question);
        this.updateLoadingState({ isLoading: false, progress: '卦象解读完成', stage: 'completed' });
        return result;
      }
      const prompt = this.buildHexagramPrompt(hexagram, question);
      const response = await this.callLLMAPI(prompt);
      this.updateLoadingState({ isLoading: false, progress: '卦象解读完成', stage: 'completed' });
      return response.content || this.getLocalHexagramInterpretation(hexagram, question);
    } catch (error) {
      console.error('❌ 卦象解读失败:', error);
      this.updateLoadingState({ isLoading: false, progress: '解读失败，使用本地备用解读', stage: 'error' });
      return this.getLocalHexagramInterpretation(hexagram, question);
    }
  }

  static async getGenericInterpretation(prompt: string): Promise<string> {
    this.updateLoadingState({ isLoading: true, progress: '正在为您生成专属解读...', stage: 'calling' });
    try {
      if (!this.config.apiKey) {
        return "AI服务未配置，无法生成解读。";
      }
      const response = await this.callLLMAPI(prompt);
      this.updateLoadingState({ isLoading: false, progress: '解读完成', stage: 'completed' });
      return response.content || "AI未能返回有效的解读内容。";
    } catch (error) {
      console.error('❌ 通用解读失败:', error);
      this.updateLoadingState({ isLoading: false, progress: '解读失败', stage: 'error' });
      return `生成此部分解读时遇到错误：${(error as Error).message}`;
    }
  }

  private static getLocalHexagramInterpretation(hexagram: Hexagram, question?: string): string {
    const questionText = question ? `\n\n**您的问题**: ${question}` : '';
    return `## ${hexagram.name} (${hexagram.chineseName})\n\n**卦象**: ${hexagram.symbol}\n**卦辞**: ${hexagram.judgment}\n**现代解读**: ${hexagram.modernInterpretation}\n**核心含义**: ${hexagram.description}\n\n**人生启示**: \n${hexagram.modernInterpretation || '此卦提醒我们要顺应自然规律，以智慧和耐心面对人生的挑战与机遇。'}\n\n**建议**: \n根据这一卦象，建议您保持内心的平静与智慧，相信事物的发展都有其规律。${questionText}\n\n愿这一卦象为您带来智慧与指引。🙏`;
  }

  private static buildHexagramPrompt(hexagram: Hexagram, question?: string): string {
    const questionText = question ? `\n\n用户问题: ${question}` : '';
    return `请为以下易经卦象提供深入的现代解读：\n\n卦名: ${hexagram.name} (${hexagram.chineseName})\n卦象: ${hexagram.symbol}\n卦辞: ${hexagram.judgment}\n现代解读: ${hexagram.modernInterpretation}\n核心含义: ${hexagram.description}${questionText}\n\n请提供深入分析和建议。`;
  }
  
  static async getFortuneInterpretation(date: Date, birthDate?: Date, question?: string): Promise<string> {
    this.updateLoadingState({ isLoading: true, progress: '正在准备运势解读...', stage: 'preparing' });
    try {
      if (!this.config.apiKey) {
        const result = this.getLocalFortuneInterpretation(date, birthDate, question);
        this.updateLoadingState({ isLoading: false, progress: '运势解读完成', stage: 'completed' });
        return result;
      }
      const prompt = this.buildFortunePrompt(date, birthDate, question);
      const response = await this.callLLMAPI(prompt);
      this.updateLoadingState({ isLoading: false, progress: '运势解读完成', stage: 'completed' });
      return response.content || this.getLocalFortuneInterpretation(date, birthDate, question);
    } catch (error) {
      console.error('❌ 运势解读失败:', error);
      this.updateLoadingState({ isLoading: false, progress: '解读失败，使用本地备用解读', stage: 'error' });
      return this.getLocalFortuneInterpretation(date, birthDate, question);
    }
  }

  private static getLocalFortuneInterpretation(date: Date, birthDate?: Date, question?: string): string {
    const dateStr = date.toLocaleDateString('zh-CN');
    const constellation = birthDate ? this.getConstellation(birthDate) : null;
    const questionText = question ? `\n\n**您的关注**: ${question}` : '';
    const fortuneElements = ['今日宜保持积极乐观的心态', '适合与他人交流合作', '注意把握机遇，但要谨慎决策'];
    const selectedElements = fortuneElements.sort(() => Math.random() - 0.5).slice(0, 2);
    let result = `## ${dateStr} 运势简报\n\n`;
    if (constellation) {
      result += `**您的星座**: ${constellation} (${this.getConstellationTrait(constellation)})\n\n`;
    }
    result += selectedElements.map(el => `• ${el}`).join('\n');
    result += questionText;
    result += `\n\n愿您今日顺心如意！`;
    return result;
  }

  private static buildFortunePrompt(date: Date, _birthDate?: Date, _question?: string): string {
    return `请为${date.toLocaleDateString('zh-CN')}提供一份运势解读。`;
  }
  
  private static getConstellation(birthDate: Date): string {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '白羊座';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '金牛座';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '双子座';
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '巨蟹座';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '狮子座';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '处女座';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return '天秤座';
    if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return '天蝎座';
    if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return '射手座';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '摩羯座';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return '双鱼座';
    return '未知';
  }
  
  private static getConstellationTrait(constellation: string): string {
    const traits: { [key: string]: string } = {
      '白羊座': '充满活力，勇于挑战', '金牛座': '稳重踏实，今日适合处理实际事务',
      '双子座': '多变灵活，适合社交和交流', '巨蟹座': '情感丰富，家庭观念强',
      '狮子座': '自信大方，喜欢成为焦点', '处女座': '细致认真，追求完美',
      '天秤座': '公正平衡，喜欢和谐', '天蝎座': '神秘深邃，喜欢探索',
      '射手座': '自由乐观，喜欢冒险', '摩羯座': '实际稳重，追求事业成功',
      '水瓶座': '独立思考，喜欢创新', '双鱼座': '富有同情心，充满想象力'
    };
    return traits[constellation] || traits['白羊座'];
  }
}

export interface FinalTarotInterpretation {
  mainInterpretation: StructuredTarotInterpretation;
  cards: (StoryTarotCard & {
    position: string;
    interpretation: string;
  })[];
}

export interface EnhancedTarotInterpretation {
  base: StructuredTarotInterpretation;
  enhancements: {
    theme?: string;
    actionStep?: string;
    reflectionQuestion?: string;
  } | null;
}
