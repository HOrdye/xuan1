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
    summary: string;
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
    cards: (StoryTarotCard & { orientation: 'upright' | 'reversed' })[],
    spread: TarotSpread,
    question: string = ''
  ): Promise<FinalTarotInterpretation> {
    this.updateLoadingState({ isLoading: true, progress: '正在准备塔罗牌解读...', stage: 'preparing' });

    try {
      console.log('🃏 V5.0 AI塔罗牌正逆位整合解读启动...', { cardCount: cards.length, spread: spread.name, question });

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
      return {
        mainInterpretation: [{
          icon: '⚠️',
          title: '解读生成失败',
          summary: '服务出现异常',
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
    card: StoryTarotCard & { orientation: 'upright' | 'reversed' },
    positionName: string,
    mainInterpretation: StructuredTarotInterpretation,
    intent: TarotIntent
  ): Promise<string> {
    if (!this.config.apiKey) {
      return 'AI服务未配置，无法生成此卡的详细解读。';
    }

    const orientationText = card.orientation === 'upright' ? '正位' : '逆位';
    const keywords = card.orientation === 'upright' ? card.uprightKeywords : card.reversedKeywords;

    const prompt = `你是一位塔罗解读大师，正在进行一次完整的解读。
- **整体解读概览**: "${mainInterpretation.map(s => s.title).join(', ')}"
- **用户意图**: ${intent}
- **当前卡牌**: ${card.chineseName} (${orientationText})
- **所在位置**: ${positionName}
- **此状态核心关键词**: ${keywords.join(', ')}
- **卡牌故事**: ${card.storyInterpretation}

请为【${card.chineseName}】在【${positionName}】这个位置上，结合其【${orientationText}】状态和核心关键词，提供一段深刻、具体、不超过120字的独立解读。解读需与整体解读方向和用户意图保持一致，但聚焦于这张牌本身揭示的细节。请直接返回解读文本，不要任何多余的开场白或标题。`;
    try {
      const response = await this.callLLMAPI(prompt);
      return (response.content || 'AI未能返回有效的解读内容。').replace(/\*/g, '');
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

  private static interpretationScripts: Record<TarotIntent, (cards: (StoryTarotCard & { orientation: 'upright' | 'reversed' })[], spread: TarotSpread, question: string, intent: TarotIntent) => Promise<StructuredTarotInterpretation>> = {
    Prediction: (cards, spread, question, intent) => Promise.all([
      this.getAISection({ icon: '🔮', title: '核心预兆' }, cards, spread, question, intent),
      this.getAISection({ icon: '🔑', title: '关键节点与影响' }, cards, spread, question, intent),
      this.getAISection({ icon: '🔭', title: '可能性展望' }, cards, spread, question, intent)
    ]),
    Advice: (cards, spread, question, intent) => Promise.all([
      this.getAISection({ icon: '🔍', title: '整体能量分析' }, cards, spread, question, intent),
      this.getAISection({ icon: '💡', title: '行动指南与策略' }, cards, spread, question, intent),
      this.getAISection({ icon: '✨', title: '核心启示与反思' }, cards, spread, question, intent)
    ]),
    Diagnosis: (cards, spread, question, intent) => Promise.all([
      this.getAISection({ icon: '🩺', title: '表层现象' }, cards, spread, question, intent),
      this.getAISection({ icon: '🌿', title: '深层根源' }, cards, spread, question, intent),
      this.getAISection({ icon: '💊', title: '疗愈路径' }, cards, spread, question, intent)
    ]),
    Relationship: (cards, spread, question, intent) => Promise.all([
      this.getAISection({ icon: '👤', title: '你的视角与状态' }, cards, spread, question, intent),
      this.getAISection({ icon: '💖', title: '对方的视角与状态' }, cards, spread, question, intent),
      this.getAISection({ icon: '🤝', title: '关系动态与未来' }, cards, spread, question, intent)
    ]),
    Decision: (cards, spread, question, intent) => Promise.all([
      this.getAISection({ icon: '🅰️', title: '选择A的图景' }, cards, spread, question, intent),
      this.getAISection({ icon: '🅱️', title: '选择B的图景' }, cards, spread, question, intent),
      this.getAISection({ icon: '⚖️', title: '权衡的关键' }, cards, spread, question, intent)
    ]),
    'Self-Exploration': (cards, spread, question, intent) => Promise.all([
      this.getAISection({ icon: '🌌', title: '内在宇宙的探索' }, cards, spread, question, intent),
      this.getAISection({ icon: '🌱', title: '成长的种子' }, cards, spread, question, intent),
      this.getAISection({ icon: '🗺️', title: '前行的地图' }, cards, spread, question, intent)
    ])
  };

  private static async getAISection(
    section: { icon: string, title: string },
    cards: (StoryTarotCard & { orientation: 'upright' | 'reversed' })[],
    spread: TarotSpread,
    question: string,
    intent: TarotIntent
  ): Promise<InterpretationSection> {
    const prompt = this.buildSectionPrompt(section.title, cards, spread, question, intent);
    try {
      const response = await this.callLLMAPI(prompt);
      const rawContent = response.content || '{}';
      try {
        const parsed = JSON.parse(rawContent);
        return {
          ...section,
          summary: parsed.summary || 'AI未能提供核心洞见。',
          content: (parsed.content || 'AI未能返回有效的解读内容。').replace(/\*/g, '')
        };
      } catch (e) {
        console.error(`解析解读部分 "${section.title}" 的JSON失败:`, e, "Raw content:", rawContent);
        // Fallback for non-JSON response
        return {
          ...section,
          summary: 'AI返回格式错误',
          content: rawContent.replace(/\*/g, '')
        };
      }
    } catch (error) {
      console.error(`生成解读部分 "${section.title}" 失败:`, error);
      return { 
        ...section, 
        summary: '生成解读失败',
        content: `生成此部分解读时遇到错误：${(error as Error).message}` 
      };
    }
  }

  private static buildSectionPrompt(
    sectionTitle: string,
    cards: (StoryTarotCard & { orientation: 'upright' | 'reversed' })[], 
    spread: TarotSpread, 
    question: string,
    intent: TarotIntent
  ): string {
    const questionText = question ? `\n- **用户问题**: "${question}"` : '';

    return `你是塔罗牌解读领域的宗师级专家，拥有20年经验，能将零散的牌意融合成富有洞见、逻辑连贯的深度分析。
你的解读风格深刻、精准、充满共情，能直击提问者内心深处。

**解读任务**: 
- **核心主题**: ${intent}
${questionText}
- **牌阵名称**: ${spread.chineseName}

- **牌阵布局**: 
${cards.map((card, index) => `  - 位置 ${index + 1} (${spread.positions[index].chineseName}): ${card.chineseName} (${card.orientation === 'upright' ? '正位' : '逆位'})`).join('\n')}

- **各牌核心信息**:
${cards.map(card => {
  const orientationText = card.orientation === 'upright' ? '正位' : '逆位';
  const keywords = card.orientation === 'upright' ? card.uprightKeywords : card.reversedKeywords;
  return `  - ${card.chineseName} (${orientationText}):\n    - 核心关键词: ${keywords.join(', ')}\n    - 牌面故事: ${card.storyInterpretation}`;
}).join('\n')}

- **解读要求**:
  请你扮演一位深刻、富有洞察力且充满共情能力的塔罗解读大师。
  你的任务是综合以上所有信息，为用户撰写关于【${sectionTitle}】的深入分析。
  - **聚焦**: 你的分析必须严格围绕【${sectionTitle}】这个标题展开。
  - **整合**: 不要孤立地解释单张牌，而是将所有牌的信息（特别是它们的位置、正逆位状态和关键词）有机地整合起来，形成一个连贯、统一的叙事。
  - **输出格式**: 你必须严格按照以下JSON格式返回内容，不要包含任何markdown语法或多余的文字：
    {
      "summary": "针对【${sectionTitle}】这个特定主题，用一句话提炼出最关键、最具体的核心洞见。要求独特、深刻、且高度相关，避免空泛的套话。",
      "content": "针对【${sectionTitle}】的详细分析。段落之间请使用 \\n 分隔，确保内容层次分明，易于阅读。语言要优美、充满智慧，同时通俗易懂。"
    }
  - **禁止**: 不要在JSON结构之外包含任何文字、解释或markdown符号。`;
  }

  private static async callLLMAPI(prompt: string): Promise<LLMResponse> {
    const { provider, apiKey, baseURL, model, temperature, maxTokens } = this.config;
    if (!apiKey) {
      throw new Error("LLM API key is not configured.");
    }
    
    let effectiveBaseURL = baseURL;
    let effectiveModel = model;

    switch(provider) {
        case 'openai':
            effectiveBaseURL = effectiveBaseURL || 'https://api.openai.com/v1';
            effectiveModel = effectiveModel || 'gpt-4-turbo-preview';
            break;
        case 'claude':
            effectiveBaseURL = effectiveBaseURL || 'https://api.anthropic.com/v1';
            effectiveModel = effectiveModel || 'claude-3-opus-20240229';
            break;
        case 'deepseek':
            effectiveBaseURL = effectiveBaseURL || 'https://api.deepseek.com/v1';
            effectiveModel = effectiveModel || 'deepseek-chat';
            break;
        case 'qianwen':
            effectiveBaseURL = effectiveBaseURL || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
            effectiveModel = effectiveModel || 'qwen-turbo';
            break;
        case 'custom':
        default:
            if (!effectiveBaseURL) {
                throw new Error("Custom LLM provider requires a baseURL to be set.");
            }
            break;
    }

    const endpoint = provider === 'qianwen' ? effectiveBaseURL : `${effectiveBaseURL}/chat/completions`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    const body = JSON.stringify({
      model: effectiveModel,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens
    });

    try {
      this.updateLoadingState({ isLoading: true, progress: '正在与AI建立连接...', stage: 'calling' });
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('LLM API Error:', response.status, errorBody);
        throw new Error(`LLM API request failed with status ${response.status}: ${errorBody}`);
      }
      
      const data = await response.json();
      this.updateLoadingState({ isLoading: true, progress: '正在处理AI的回应...', stage: 'processing' });

      return {
        content: data.choices[0].message.content,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        }
      };
    } catch (error) {
      console.error('Failed to call LLM API:', error);
      throw error;
    }
  }

  // --- Hexagram Service (Kept for other functionalities) ---
  static async getHexagramInterpretation(hexagram: Hexagram, question?: string): Promise<string> {
    if (!this.config.apiKey) {
      return this.getLocalHexagramInterpretation(hexagram, question);
    }
    const prompt = this.buildHexagramPrompt(hexagram, question);
    const response = await this.callLLMAPI(prompt);
    return response.content || 'AI未能返回有效的解读内容。';
  }

  private static getLocalHexagramInterpretation(hexagram: Hexagram, question?: string): string {
    const questionText = question ? `\n\n**您的问题**: ${question}` : '';
    return `## ${hexagram.name} (${hexagram.chineseName})\n\n**卦象**: ${hexagram.symbol}\n**卦辞**: ${hexagram.judgment}\n**现代解读**: ${hexagram.modernInterpretation}\n**核心含义**: ${hexagram.description}\n\n**人生启示**: \n${hexagram.modernInterpretation || '此卦提醒我们要顺应自然规律，以智慧和耐心面对人生的挑战与机遇。'}\n\n**建议**: \n根据这一卦象，建议您保持内心的平静与智慧，相信事物的发展都有其规律。${questionText}\n\n愿这一卦象为您带来智慧与指引。🙏`;
  }

  private static buildHexagramPrompt(hexagram: Hexagram, question?: string): string {
    const questionText = question ? `\n\n用户问题: ${question}` : '';
    return `请为以下易经卦象提供深入的现代解读：\n\n卦名: ${hexagram.name} (${hexagram.chineseName})\n卦象: ${hexagram.symbol}\n卦辞: ${hexagram.judgment}\n现代解读: ${hexagram.modernInterpretation}\n核心含义: ${hexagram.description}${questionText}\n\n请提供深入分析和建议。`;
  }
}

export interface FinalTarotInterpretation {
  mainInterpretation: StructuredTarotInterpretation;
  cards: (StoryTarotCard & {
    position: string;
    interpretation: string;
    orientation: 'upright' | 'reversed';
  })[];
}
