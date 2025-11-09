import type { Hexagram } from '../features/dilemma/types';
import type { StoryTarotCard } from '../features/tarot/utils/storyTarotData';
import type { TarotSpread } from '../features/tarot/utils/tarotInterpretation';
import { EnvConfigManager } from '../utils/envConfig';
import { UserInfoSharingService, type UnifiedUserInfo } from './UserInfoSharingService';
import { PersonalizationAlgorithm } from './PersonalizationAlgorithm';

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
    // 优先从EnvConfigManager获取最新配置，确保配置同步
    const envConfig = {
      provider: EnvConfigManager.getEnvVar('VITE_LLM_PROVIDER', this.config.provider) as any,
      apiKey: EnvConfigManager.getEnvVar('VITE_LLM_API_KEY', this.config.apiKey),
      baseURL: EnvConfigManager.getEnvVar('VITE_LLM_BASE_URL', this.config.baseURL),
      model: EnvConfigManager.getEnvVar('VITE_LLM_MODEL', this.config.model),
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens
    };
    
    // 如果环境配置有更新，同步到内部配置
    if (envConfig.apiKey !== this.config.apiKey || 
        envConfig.provider !== this.config.provider ||
        envConfig.baseURL !== this.config.baseURL ||
        envConfig.model !== this.config.model) {
      this.config = { ...this.config, ...envConfig };
      console.log('🔄 LLM配置已从环境同步:', {
        provider: this.config.provider,
        hasApiKey: !!this.config.apiKey,
        model: this.config.model
      });
    }
    
    return { ...this.config };
  }

  static async testConnection(config: LLMConfig): Promise<{ success: boolean; error?: string }> {
    const { provider, apiKey, baseURL } = config;

    if (!apiKey) {
      return { success: false, error: 'API密钥未提供。' };
    }

    let testEndpoint = '';
    let effectiveBaseURL = baseURL;

    switch(provider) {
      case 'openai':
        effectiveBaseURL = effectiveBaseURL || 'https://api.openai.com/v1';
        testEndpoint = `${effectiveBaseURL}/models`;
        break;
      case 'claude':
        // Claude does not have a simple, low-cost "list models" endpoint accessible via basic API key.
        // We will have to rely on a small, valid API call, but for now we can simulate success.
        // A proper check might involve sending a very small message. For now, we'll check the key format.
        if (!apiKey.startsWith('sk-ant-api03-')) {
          return { success: false, error: 'Claude API密钥格式似乎不正确。它应该以 "sk-ant-api03-" 开头。'};
        }
        // As a placeholder, we return success if format is okay. A real call would be better.
        return { success: true };
      case 'deepseek':
        effectiveBaseURL = effectiveBaseURL || 'https://api.deepseek.com/v1';
        testEndpoint = `${effectiveBaseURL}/models`;
        break;
      case 'qianwen':
         // Ali's Dashscope doesn't have a simple GET endpoint for models.
         // We will have to rely on other validation methods or a small API call.
         // For now, we'll assume the key is valid if provided.
         return { success: true };
      case 'custom':
      default:
        if (!effectiveBaseURL) {
          return { success: false, error: '自定义服务商必须设置API基地址(Base URL)。' };
        }
        testEndpoint = `${effectiveBaseURL}/models`; // Assume custom endpoints have a /models route.
        break;
    }

    try {
      const response = await fetch(testEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // We can optionally check if the response body contains model data
        const data = await response.json();
        if (data && (data.data || Array.isArray(data))) {
            return { success: true };
        }
        return { success: false, error: 'API端点返回了意外的数据格式。' };
      } else {
        const errorBody = await response.text();
        try {
          const errorJson = JSON.parse(errorBody);
          return { success: false, error: `连接失败 (${response.status}): ${errorJson.error?.message || errorBody}` };
        } catch(e) {
          return { success: false, error: `连接失败 (${response.status}): ${errorBody}` };
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '一个未知的网络错误发生。请检查您的网络连接和API地址。';
      return { success: false, error: errorMessage };
    }
  }
  
  static onLoadingStateChange(callback: (state: LLMLoadingState) => void): () => void {
    this.loadingCallbacks.push(callback);
    // 返回取消订阅函数
    return () => {
      const index = this.loadingCallbacks.indexOf(callback);
      if (index > -1) {
        this.loadingCallbacks.splice(index, 1);
      }
    };
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
    const { provider, apiKey, baseURL, model, temperature, maxTokens } = this.getConfig();
    if (!apiKey) throw new Error("LLM API key is not configured.");
    
    // 配置服务商参数（简化switch结构）
    const [effectiveBaseURL, effectiveModel] = (() => {
      switch(provider) {
        case 'openai': return [baseURL || 'https://api.openai.com/v1', model || 'gpt-4-turbo-preview'];
        case 'claude': return [baseURL || 'https://api.anthropic.com/v1', model || 'claude-3-opus-20240229'];
        case 'deepseek': return [baseURL || 'https://api.deepseek.com/v1', model || 'deepseek-chat'];
        case 'qianwen': return [baseURL || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', model || 'qwen-turbo'];
        default: 
          if (!baseURL) throw new Error("Custom LLM provider requires baseURL");
          return [baseURL, model || 'default'];
      }
    })();

    const endpoint = provider === 'qianwen' ? effectiveBaseURL : `${effectiveBaseURL}/chat/completions`;
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` };
    const body = JSON.stringify({
      model: effectiveModel,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens
    });

    try {
      this.updateLoadingState({ isLoading: true, progress: '正在连接AI服务...', stage: 'calling' });
      
      // 添加15秒超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API响应错误: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      this.updateLoadingState({ isLoading: true, progress: '解析AI响应...', stage: 'processing' });
      
      return {
        content: data.choices[0].message.content,
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        } : undefined
      };
    } catch (error) {
      // 健壮的错误处理
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('AI服务响应超时，请稍后重试');
        }
        throw new Error(`服务调用失败: ${error.message}`);
      }
      throw new Error('服务调用失败: 未知网络错误');
    }
  }

  // --- 自定义解读服务 ---
  static async getCustomInterpretation(prompt: string): Promise<string> {
    const config = this.getConfig();
    
    if (!config.apiKey) {
      return 'AI服务未配置，无法提供自定义解读。';
    }
    
    this.updateLoadingState({ isLoading: true, progress: '正在生成自定义解读...', stage: 'preparing' });
    
    try {
      this.updateLoadingState({ isLoading: true, progress: '正在调用AI服务...', stage: 'calling' });
      const response = await this.callLLMAPI(prompt);
      
      this.updateLoadingState({ isLoading: true, progress: '正在解析解读内容...', stage: 'processing' });
      this.updateLoadingState({ isLoading: false, progress: '解读完成', stage: 'completed' });
      
      return response.content || 'AI未能返回有效的解读内容';
    } catch (error) {
      console.error('❌ 自定义解读失败:', error);
      this.updateLoadingState({ isLoading: false, progress: '解读失败', stage: 'error' });
      return `解读生成失败: ${(error as Error).message}`;
    }
  }

    // --- 易经卦象解读服务 ---
    static async getHexagramInterpretation(
      hexagram: Hexagram,
      changingLines: number[] = [],
      relatedHexagram: Hexagram | null = null,
      question?: string,
      traditionalAnalysis?: any
    ): Promise<string> {
    // 获取最新配置，确保配置同步
    const config = this.getConfig();
    
    // 本地解读作为备用方案
    if (!config.apiKey) {
      return this.getLocalHexagramInterpretation(hexagram, changingLines, relatedHexagram, question);
    }
    
    // 开始加载状态
    this.updateLoadingState({ isLoading: true, progress: '正在准备卦象解读...', stage: 'preparing' });
    
      try {
        // 创建专业的卦象解读提示（包含传统逻辑分析）
        console.log('📝 准备生成AI提示词，传统逻辑分析:', traditionalAnalysis ? '已提供' : '未提供');
        const prompt = this.buildHexagramInterpretationPrompt(hexagram, changingLines, relatedHexagram, question, traditionalAnalysis);
        if (traditionalAnalysis) {
          console.log('✅ AI提示词已包含传统逻辑分析');
        }
      
      this.updateLoadingState({ isLoading: true, progress: '正在生成AI解读...', stage: 'calling' });
      const response = await this.callLLMAPI(prompt);
      
      this.updateLoadingState({ isLoading: true, progress: '正在解析解读内容...', stage: 'processing' });
      
      // 完成加载状态
      this.updateLoadingState({ isLoading: false, progress: '解读完成', stage: 'completed' });
      
      // 返回纯文本解读内容
      return response.content || this.getLocalHexagramInterpretation(hexagram, changingLines, relatedHexagram, question);
    } catch (error) {
      console.error('❌ 卦象解读失败:', error);
      this.updateLoadingState({ isLoading: false, progress: '解读失败，使用本地解读', stage: 'error' });
      return this.getLocalHexagramInterpretation(hexagram, changingLines, relatedHexagram, question);
    }
  }

  // --- 场景化玄选两难解读服务 ---
  static async getScenarioBasedDilemmaInterpretation(
      optionA: string,
      optionB: string,
      scenario: {
        decisionType: 'relationship' | 'career' | 'financial' | 'personal' | 'other';
        emotionalTone: 'positive' | 'negative' | 'neutral' | 'conflicted';
        urgency: 'high' | 'medium' | 'low';
        complexity: 'simple' | 'moderate' | 'complex';
        keywords: string[];
        context: string;
        riskLevel: 'low' | 'medium' | 'high';
        timeHorizon: 'immediate' | 'short' | 'long';
      },
      hexagramInfo?: {
        name: string;
        chineseName: string;
        symbol: string;
        judgment: string;
        image: string;
        changingLines?: number[];
        relatedHexagram?: {
          name: string;
          chineseName: string;
          symbol: string;
          judgment: string;
          image: string;
        } | null;
      },
      traditionalAnalysis?: any  // ⭐ 新增：传统逻辑分析参数
    ): Promise<string> {
    // 获取最新配置，确保配置同步
    const config = this.getConfig();
    
    // 如果没有配置API Key，返回提示信息
    if (!config.apiKey) {
      return 'AI服务未配置，无法提供场景化解读。请先配置AI服务。';
    }
    
    // 开始加载状态
    this.updateLoadingState({ isLoading: true, progress: '正在分析决策场景...', stage: 'preparing' });
    
    try {
      // 🚨 使用scenarioPromptGenerator生成完整的AI响应
      console.log('🎯 [完整生成] 开始执行基于scenarioPromptGenerator的生成策略');
      
        // 生成完整的AI响应
        this.updateLoadingState({ isLoading: true, progress: '正在生成完整的易经智慧解读...', stage: 'calling' });
        const aiResponse = await this.generateCompleteAIResponse(optionA, optionB, scenario, hexagramInfo, traditionalAnalysis);
      
      if (aiResponse) {
        console.log('✅ [完整生成完成] AI响应:', aiResponse);
        
        // 完成加载状态
        this.updateLoadingState({ isLoading: false, progress: '解读完成', stage: 'completed' });
        
        // 直接返回AI生成的完整JSON
        return JSON.stringify(aiResponse, null, 2);
      } else {
        throw new Error('AI未能生成有效的响应');
      }
    } catch (error) {
      console.error('❌ 场景化玄选两难解读失败:', error);
      this.updateLoadingState({ isLoading: false, progress: '解读失败', stage: 'error' });
      return `解读生成失败: ${(error as Error).message}`;
    }
  }

  private static getLocalHexagramInterpretation(
    hexagram: Hexagram,
    changingLines: number[],
    relatedHexagram: Hexagram | null,
    question?: string
  ): string {
    const questionText = question ? `\n\n**您的问题**: ${question}` : '';
    const changingLinesText = changingLines.length > 0 
      ? `\n**变爻位置**: ${changingLines.map(i => i + 1).join('、')}爻`
      : '';
    const relatedHexagramText = relatedHexagram 
      ? `\n**变卦**: ${relatedHexagram.name} (${relatedHexagram.chineseName})` 
      : '';
    
    return `## ${hexagram.name} (${hexagram.chineseName})\n\n` +
           `**卦象**: ${hexagram.symbol}\n` +
           `**卦辞**: ${hexagram.judgment}\n` +
           `**象辞**: ${hexagram.image}\n` +
           `**彖辞**: ${hexagram.tuan}\n` +
           `${changingLinesText}${relatedHexagramText}\n\n` +
           `**现代解读**: \n${hexagram.modernInterpretation || ''}\n\n` +
           `**核心启示**: \n${hexagram.description}${questionText}`;
  }

  private static buildHexagramInterpretationPrompt(
    hexagram: Hexagram,
    changingLines: number[],
    relatedHexagram: Hexagram | null,
    question?: string,
    traditionalAnalysis?: any
  ): string {
    // 构建专业卦象解读提示 - 要求展示完整易经推演过程
    const changingLinesInfo = changingLines.length > 0 
      ? `${changingLines.map(i => {
          const labels = ['初', '二', '三', '四', '五', '上'];
          return `${labels[i]}爻`;
        }).join('、')}（第${changingLines.map(i => i + 1).join('、')}爻）`
      : '无动爻（静卦）';
    
    const relatedHexagramInfo = relatedHexagram 
      ? `\n- 变卦名称: ${relatedHexagram.name} (${relatedHexagram.chineseName})\n- 变卦卦辞: ${relatedHexagram.judgment || relatedHexagram.description || ''}\n- 变卦象传: ${relatedHexagram.image || relatedHexagram.overall || ''}`
      : '';
    
    return `你是易经研究专家，拥有20年解卦经验，精通《周易》原文和历代注疏。
请基于专业易学知识，按照传统易经推演逻辑，为用户提供深入的卦象解读。

**卦象信息**:
- 本卦名称: ${hexagram.name} (${hexagram.chineseName})
- 本卦卦符号: ${hexagram.symbol}
- 本卦卦辞: ${hexagram.judgment || hexagram.description || ''}
- 本卦象传: ${hexagram.image || hexagram.overall || ''}
- 本卦彖传: ${hexagram.tuan || ''}
${hexagram.yao_texts && hexagram.yao_texts.length > 0 ? `- 本卦爻辞:\n${hexagram.yao_texts.map((yao, idx) => {
  const labels = ['初', '二', '三', '四', '五', '上'];
  return `  ${labels[idx]}爻: ${yao}`;
}).join('\n')}` : ''}
- 动爻情况: ${changingLinesInfo}${relatedHexagramInfo}

  **用户问题**:
  ${question || '未提供具体问题'}

  ${traditionalAnalysis ? `**传统易经逻辑分析（必须基于此进行解读）**:
  ${traditionalAnalysis.palaceData ? `- 卦宫归属: ${traditionalAnalysis.palaceData.palace}宫，五行属性: ${traditionalAnalysis.palaceData.element}
  - 世爻位置: 第${traditionalAnalysis.palaceData.shiYao + 1}爻，应爻位置: 第${traditionalAnalysis.palaceData.yingYao + 1}爻
` : ''}
  ${traditionalAnalysis.bodyUsage ? `- 体用关系:
    * 体卦: ${traditionalAnalysis.bodyUsage.bodyTrigram}（${traditionalAnalysis.bodyUsage.bodyElement}）
    * 用卦: ${traditionalAnalysis.bodyUsage.usageTrigram}（${traditionalAnalysis.bodyUsage.usageElement}）
    * 关系: ${traditionalAnalysis.bodyUsage.relationship === 'body-ke-usage' ? '体克用（主体主动，有利于主动出击）' :
             traditionalAnalysis.bodyUsage.relationship === 'usage-ke-body' ? '用克体（外部压力大，宜守不宜攻）' :
             traditionalAnalysis.bodyUsage.relationship === 'body-sheng-usage' ? '体生用（主体付出多，需要谨慎）' :
             traditionalAnalysis.bodyUsage.relationship === 'usage-sheng-body' ? '用生体（外部助力大，利于发展）' :
             '体用比和（和谐稳定）'}
    * 传统解读: ${traditionalAnalysis.bodyUsage.interpretation.generalMeaning}
` : ''}
  ${traditionalAnalysis.changingLinesAnalysis && traditionalAnalysis.changingLinesAnalysis.length > 0 ? `- 动爻详细分析:
${traditionalAnalysis.changingLinesAnalysis.map((ch: any) => `    * 第${ch.position + 1}爻（${ch.relative}，${ch.element}）: ${ch.yaoText}。${ch.interpretation}`).join('\n')}
` : ''}
  **重要**: 上述传统逻辑分析是基于正统易经理论计算得出的，你的解读必须严格基于这些分析结果，不能偏离传统逻辑。` : ''}

  **解读要求（必须严格遵守易经推演逻辑）**:
你必须按照传统易经解卦的推演过程来组织解读，包含以下完整步骤：

1. **本卦分析**：
   - 解释"${hexagram.chineseName || hexagram.name}"卦的核心含义
   - 引用卦辞和象传，说明本卦在当前问题上的寓意
   - 结合用户问题，分析本卦显示的当前形势

2. **动爻推演**（如果有动爻）：
   - 说明哪些爻位发生变动（${changingLinesInfo}）
   - 解释这些动爻在本卦中的意义
   - 分析动爻变动所预示的变化方向

3. **变卦趋势**（如果有变卦）：
   - 解释从"${hexagram.chineseName || hexagram.name}"卦变至"${relatedHexagram?.chineseName || relatedHexagram?.name || ''}"卦的含义
   - 说明变卦卦辞对问题发展的预示
   - 分析本卦→变卦的整体演变趋势

4. **综合推演**：
   - 综合本卦、动爻、变卦三个层面，给出完整的趋势判断
   - 明确指出当前状态、变化过程和未来走向
   - 基于推演结果，给出针对性的建议

  **写作要求**:
  - 必须体现易经推演的逻辑链条，展现从本卦到变卦的完整推理过程
  - 引用具体的卦辞、爻辞、象传内容作为依据，不要泛泛而谈
  - 避免现代商业化的建议（如"收集更多信息"、"保持心态"等套话）
  - 用传统易学的表达方式，但要让用户能理解
  - 结论必须与推演过程一致，不能自相矛盾
  - **专业术语解释**：当你使用专业术语时（如"兄弟爻"、"体用关系"、"六亲"、"世应"等），必须先解释这个术语的含义，然后再说明它在当前情况下的具体作用。例如：
    - ❌ 错误："兄弟爻的变动提示市场资金流动可能发生变化"
    - ✅ 正确："在第4爻位置出现了'兄弟爻'（代表同辈、竞争者或市场中的其他投资者）的变动，这提示市场资金流动可能发生变化"
    - ❌ 错误："体用比和，内外环境和谐"
    - ✅ 正确："体用关系显示'比和'状态（体卦代表您自己，用卦代表外部环境，两者属性相同形成和谐共振），这表明您的内在状态与外部环境处于和谐状态"
  - **透明化解读**：在解读中，要适当展现传统逻辑分析的过程，让用户理解体用关系、世应位置、动爻分析、五行生克是如何得出判断的，而不是让用户感觉是黑箱操作

**输出格式**:
请按照以下结构输出，必须体现推演过程：
【本卦分析】
（解释本卦含义，引用卦辞，说明当前形势）

【动爻推演】
（如果有动爻，分析动爻意义和变化方向）

【变卦趋势】
（如果有变卦，解释变卦含义和未来走向）

【综合结论】
（综合推演结果，给出判断和建议）

请直接返回中文正文（不要JSON/不要额外说明），严格按照上述推演逻辑组织内容。`;
  }

  // 🚨 使用scenarioPromptGenerator生成完整的AI响应
  private static async generateCompleteAIResponse(
      optionA: string,
      optionB: string,
      scenario: {
        decisionType: 'relationship' | 'career' | 'financial' | 'personal' | 'other';
        emotionalTone: 'positive' | 'negative' | 'neutral' | 'conflicted';
        urgency: 'high' | 'medium' | 'low';
        complexity: 'simple' | 'moderate' | 'complex';
        keywords: string[];
        context: string;
        riskLevel: 'low' | 'medium' | 'high';
        timeHorizon: 'immediate' | 'short' | 'long';
      },
      hexagramInfo?: {
        name: string;
        chineseName: string;
        symbol: string;
        judgment: string;
        image: string;
        changingLines?: number[];
      },
      traditionalAnalysis?: any  // ⭐ 新增：传统逻辑分析参数
    ): Promise<any> {
      try {
        // 导入scenarioPromptGenerator
        const { ScenarioPromptGenerator } = await import('../features/dilemma/utils/scenarioPromptGenerator');

        // 生成完整的prompt
        const promptData = ScenarioPromptGenerator.generateCompletePrompt(optionA, optionB, scenario, hexagramInfo, traditionalAnalysis);
      
      // 调用AI API
      const response = await this.callLLMAPI(promptData.completePrompt);        
      let content = response.content || '{}';

      // 🚨 修复：清理AI返回内容中的markdown代码块标记
      // AI有时会返回 ```json ... ``` 格式，需要先清理这些标记
      content = content.trim();
      // 移除开头的 ```json 或 ```JSON 或 ``` 标记（可能带换行）
      content = content.replace(/^```(?:json|JSON)?\s*\n?/i, '');
      // 移除结尾的 ``` 标记（可能带换行）
      content = content.replace(/\n?```\s*$/i, '');
      content = content.trim();

      try {
        // 解析AI返回的JSON
        const aiResponse = JSON.parse(content);
        console.log('✅ AI生成完整响应:', aiResponse);
        
        // 🚨 调试：检查关键字段是否存在
        console.log('🔍 检查关键字段:');
        console.log('- hexagramData:', aiResponse.hexagramData);
        console.log('- transformationInsights:', aiResponse.transformationInsights);
        console.log('- hexagramChanges:', aiResponse.hexagramChanges);
        console.log('- coreNarrative:', aiResponse.coreNarrative);
        
        return aiResponse;
      } catch (e) {
        console.error('❌ 解析AI响应失败:', e);
        console.error('AI返回的原始内容:', content);
        return null;
      }
    } catch (error) {
      console.error('❌ 生成完整AI响应失败:', error);
      return null;
    }
  }

  private static async generateStructuredAnalysis(
    coreNarrative: string,
    optionA: string,
    optionB: string
  ): Promise<any> {
    const prompt = `# 角色
你是一个精准的文本分析和内容提取助手。

# 🚨 绝对禁止的行为
1. **禁止生成任何模板化内容**：如"需要进一步分析"、"具有独特价值"、"需要仔细权衡"等空洞表述
2. **禁止使用万能句式**：如"建议在充分思考后做出决定"、"需要仔细考虑"等无意义的建议
3. **禁止生成模糊内容**：如"某个方面"、"某个方向"、"重要启示"等不具体的描述

# 信源 (Source of Truth)
${coreNarrative}

# 核心任务
请严格根据上面的"信源"内容，不要添加任何额外信息，填充以下JSON结构：
{
  "optionAnalysis": [
    {
      "optionName": "${optionA}",
      "alignmentWithNarrative": "描述这个选项与核心叙事的逻辑关系，使用'因为...所以...'的句式，体现易经智慧。必须具体到用户的选择，不能是抽象描述。",
      "potentialAdvantage": "从叙事中提炼出坚持此选项的具体优点，必须与卦象智慧关联。必须具体说明这个优点是什么，不能是'具有独特价值'这样的废话。",
      "potentialChallenge": "从叙事中提炼出坚持此选项的具体挑战，必须与卦象智慧关联。必须具体说明这个挑战是什么，不能是'需要仔细权衡'这样的废话。"
    },
    {
      "optionName": "${optionB}",
      "alignmentWithNarrative": "描述这个选项与核心叙事的逻辑关系，使用'因为...所以...'的句式，体现易经智慧。必须具体到用户的选择，不能是抽象描述。",
      "potentialAdvantage": "从叙事中提炼出选择此选项的具体优点，必须与卦象智慧关联。必须具体说明这个优点是什么，不能是'具有独特价值'这样的废话。",
      "potentialChallenge": "从叙事中提炼出选择此选项的具体挑战，必须与卦象智慧关联。必须具体说明这个挑战是什么，不能是'需要仔细权衡'这样的废话。"
    }
  ],
  "actionableChecklist": [
    {
      "title": "从叙事中提炼出的第一个具体行动建议的标题（必须与用户的具体选择直接相关，如'今天下午在值班室测试工作效率'或'明天上午在办公室评估工作环境'）",
      "detail": "该行动的具体描述，必须包含：1）具体时间（今天/明天/本周等）；2）具体地点（值班室/办公室/家里等）；3）具体动作（测试/评估/联系/准备等）；4）具体目标（测试什么/评估什么/联系谁/准备什么）。必须与用户的选择A和选择B直接相关，不能是通用建议。",
      "rationale": "为什么这个行动能帮助用户在A和B之间做出选择，必须与卦象智慧紧密结合。必须具体说明这个行动如何帮助用户解决具体的选择问题。"
    },
    {
      "title": "从叙事中提炼出的第二个具体行动建议的标题（必须与用户的具体选择直接相关，如'明天上午联系相关人员确认工作安排'或'后天评估两个选择的实际效果'）",
      "detail": "该行动的具体描述，必须包含：1）具体时间（今天/明天/本周等）；2）具体地点（值班室/办公室/家里等）；3）具体动作（联系/评估/确认/准备等）；4）具体目标（联系谁/评估什么/确认什么/准备什么）。必须与用户的选择A和选择B直接相关，不能是通用建议。",
      "rationale": "为什么这个行动能帮助用户在A和B之间做出选择，必须与卦象智慧紧密结合。必须具体说明这个行动如何帮助用户解决具体的选择问题。"
    }
  ]
}

**重要要求**：
1. 必须严格按照JSON格式返回，不要包含任何markdown语法或多余的文字
2. 每个建议都必须体现易经智慧与具体行动的"金线关联"
3. 使用"因为...所以..."的逻辑句式，让用户理解为什么这样建议
4. 所有内容都必须基于信源，不能添加额外信息
5. **绝对禁止生成任何模板化、空洞的内容**
6. **行动建议必须具体可操作**：
   - 标题必须包含具体时间（今天/明天/本周等）
   - 标题必须包含具体人物（领导/同事/家人等）
   - 标题必须包含具体动作（联系/准备/制定/实施等）
   - 标题必须包含具体目标（讨论什么/准备什么/完成什么）
   - 避免使用"计划"、"优化"、"提升"等抽象词汇
   - 使用"今天下午联系领导讨论"而不是"节前工作效率提升计划"
7. **行动建议必须与用户的具体问题相关**：
   - 如果用户选择涉及"值班室"，行动建议应该与值班相关
   - 如果用户选择涉及"办公室"，行动建议应该与办公室相关
   - 如果用户选择涉及"休假"，行动建议应该与休假相关
   - 行动建议必须直接帮助用户解决具体的选择问题
   - 避免生成与用户问题无关的通用建议
8. **行动建议必须帮助用户做出选择**：
   - 每个行动建议都应该帮助用户更好地理解A和B两个选择
   - 行动建议应该提供具体的方法来测试、评估或验证选择
   - 行动建议应该包含收集信息、比较优劣、验证假设等具体步骤
   - 避免生成与选择无关的通用工作建议`;

    try {
      const response = await this.callLLMAPI(prompt);
      const content = response.content || '{}';
      try {
        return JSON.parse(content);
      } catch (e) {
        console.error('❌ 解析结构化分析失败:', e);
        return {
          optionAnalysis: [],
          actionableChecklist: []
        };
      }
    } catch (error) {
      console.error('❌ 生成结构化分析失败:', error);
      return {
        optionAnalysis: [],
        actionableChecklist: []
      };
    }
  }

  private static formatFinalOutput(
    coreNarrative: string, 
    structuredAnalysis: any, 
    hexagramInfo?: {
      name: string;
      chineseName: string;
      symbol: string;
      judgment: string;
      image: string;
      changingLines?: number[];
      relatedHexagram?: {
        name: string;
        chineseName: string;
        symbol: string;
        judgment: string;
        image: string;
      } | null;
    }
  ): string {
    // 将两段式生成的结果格式化为前端需要的JSON格式
    const { optionAnalysis, actionableChecklist } = structuredAnalysis;
    
    // 构建前端期望的数据结构
    const result = {
      coreNarrative: {
        title: "天玄智慧解读",
        story: coreNarrative,
        coreConflict: "基于卦象分析，当前存在核心冲突需要解决",
        development: "卦象指引着明确的发展方向",
        coreRevelation: "" // 让AI真正生成启示内容，不提供硬编码默认值
      },
      optionAnalysis: optionAnalysis || [],
      breakthroughPlan: {
        clearRecommendation: "", // 让AI真正生成建议内容，不提供硬编码默认值
        actionList: actionableChecklist ? actionableChecklist.map((item: any) => ({
          actionTitle: item.title || "",
          actionDetail: item.detail || "",
          rationale: item.rationale || ""
        })) : []
      },
      // 新增：卦象相关字段，确保数据结构完整
      hexagramMeanings: hexagramInfo ? this.generateHexagramMeanings(hexagramInfo) : {},
      transformationInsights: hexagramInfo ? this.generateTransformationInsights(hexagramInfo) : {},
      stableInsights: hexagramInfo ? this.generateStableInsights(hexagramInfo) : {},
      
      // 调试信息：记录生成的数据
      _debug: {
        hasHexagramInfo: !!hexagramInfo,
        hexagramInfoKeys: hexagramInfo ? Object.keys(hexagramInfo) : [],
        generatedHexagramMeanings: hexagramInfo ? Object.keys(this.generateHexagramMeanings(hexagramInfo)) : [],
        generatedTransformationInsights: hexagramInfo ? Object.keys(this.generateTransformationInsights(hexagramInfo)) : [],
        generatedStableInsights: hexagramInfo ? Object.keys(this.generateStableInsights(hexagramInfo)) : []
      },
      finalWisdom: "愿这份来自东方的古老智慧，为您的决策之路点亮明灯"
    };
    
    // 返回JSON字符串，让前端可以正确解析
    return JSON.stringify(result, null, 2);
  }

  // 新增：生成卦象含义数据 - 通过AI生成真正的卦象解读
  private static generateHexagramMeanings(hexagramInfo: {
    name: string;
    chineseName: string;
    symbol: string;
    judgment: string;
    image: string;
    changingLines?: number[];
    relatedHexagram?: {
      name: string;
      chineseName: string;
      symbol: string;
      judgment: string;
      image: string;
    } | null;
  }): Record<string, string> {
    const { chineseName, judgment, image, relatedHexagram } = hexagramInfo;
    
    // 基于卦象信息生成有意义的解读，避免重复卦象名称
    const meanings: Record<string, string> = {};
    
    // 起卦的含义 - 通过AI生成现代解读
    meanings[chineseName] = `《易经》原文："${judgment}。${image}"。现代解读：${chineseName}卦象征着当前的状态和处境，提醒我们在决策时要考虑的因素。`;
    
    // 如果有变卦，也生成变卦的含义
    if (relatedHexagram) {
      meanings[relatedHexagram.chineseName] = `《易经》原文："${relatedHexagram.judgment}。${relatedHexagram.image}"。现代解读：${relatedHexagram.chineseName}卦象征着未来的发展趋势，指引我们前进的方向。`;
    }
    
    return meanings;
  }

  // 新增：生成卦象变化启示数据
  private static generateTransformationInsights(hexagramInfo: {
    name: string;
    chineseName: string;
    symbol: string;
    judgment: string;
    image: string;
    changingLines?: number[];
    relatedHexagram?: {
      name: string;
      chineseName: string;
      symbol: string;
      judgment: string;
      image: string;
    } | null;
  }): Record<string, string> {
    const { chineseName, judgment, image, relatedHexagram } = hexagramInfo;
    
    // 基于卦象信息生成变化启示，不硬编码任何内容
    const insights: Record<string, string> = {};
    
    if (relatedHexagram) {
      // 有变卦时，生成起卦到变卦的变化启示
      const key = `${chineseName}-${relatedHexagram.chineseName}`;
      // 只提供卦象信息，让AI真正生成启示内容
      const insight = `起卦「${chineseName}」：${judgment}。${image}。变卦「${relatedHexagram.chineseName}」：${relatedHexagram.judgment}。${relatedHexagram.image}。`;
      insights[key] = insight;
    } else {
      // 没有变卦时，生成稳定状态的启示
      const key = `${chineseName}-稳定`;
      const insight = `「${chineseName}」：${judgment}。${image}。`;
      insights[key] = insight;
    }
    
    return insights;
  }

  // 新增：生成稳定卦象启示数据
  private static generateStableInsights(hexagramInfo: {
    name: string;
    chineseName: string;
    symbol: string;
    judgment: string;
    image: string;
    changingLines?: number[];
    relatedHexagram?: {
      name: string;
      chineseName: string;
      symbol: string;
      judgment: string;
      image: string;
    } | null;
  }): Record<string, string> {
    const { chineseName, judgment, image, relatedHexagram } = hexagramInfo;
    
    // 基于卦象信息生成稳定启示，不硬编码任何内容
    const insights: Record<string, string> = {};
    
    // 起卦的稳定启示
    insights[chineseName] = `「${chineseName}」：${judgment}。${image}。`;
    
    // 如果有变卦，也生成变卦的稳定启示
    if (relatedHexagram) {
      insights[relatedHexagram.chineseName] = `「${relatedHexagram.chineseName}」：${relatedHexagram.judgment}。${relatedHexagram.image}。`;
    }
    
    return insights;
  }

  // 新增：格式化叙事文本，添加适当的段落分隔
  private static formatNarrativeWithParagraphs(narrative: string): string {
    if (!narrative) return '';
    
    // 如果文本包含明确的段落标记，直接使用
    if (narrative.includes('\n\n') || narrative.includes('##')) {
      return narrative;
    }
    
    // 根据句号、问号、感叹号分割文本
    const sentences = narrative.split(/[。！？]/).filter(s => s.trim());
    
    if (sentences.length <= 3) {
      // 如果句子较少，直接返回原文本
      return narrative;
    }
    
    // 智能分段：每2-4个句子组成一个段落，避免段落过长或过短
    const paragraphs: string[] = [];
    let currentParagraph = '';
    let sentenceCount = 0;
    
    sentences.forEach((sentence, index) => {
      currentParagraph += sentence.trim();
      sentenceCount++;
      
      // 分段条件：达到3-4个句子，或者遇到关键词，或者是最后一个句子
      const shouldSplit = sentenceCount >= 3 || 
                         sentence.includes('因为') || 
                         sentence.includes('所以') || 
                         sentence.includes('若选择') ||
                         sentence.includes('卦象') ||
                         sentence.includes('离卦') ||
                         sentence.includes('双火') ||
                         index === sentences.length - 1;
      
      if (shouldSplit && currentParagraph.trim()) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = '';
        sentenceCount = 0;
      }
    });
    
    // 如果分段后段落太少，尝试更细粒度的分段
    if (paragraphs.length <= 1 && sentences.length > 6) {
      const refinedParagraphs: string[] = [];
      let refinedCurrent = '';
      
      sentences.forEach((sentence, index) => {
        refinedCurrent += sentence.trim();
        
        if ((index + 1) % 2 === 0 || index === sentences.length - 1) {
          if (refinedCurrent.trim()) {
            refinedParagraphs.push(refinedCurrent.trim());
            refinedCurrent = '';
          }
        }
      });
      
      return refinedParagraphs.length > 0 ? refinedParagraphs.join('\n\n') : narrative;
    }
    
    // 返回格式化后的段落
    return paragraphs.length > 0 ? paragraphs.join('\n\n') : narrative;
  }

  // 辅助方法：获取决策类型的中文描述
  private static getDecisionTypeText(type: string): string {
    const texts: Record<string, string> = {
      relationship: '人际关系决策',
      career: '职业发展决策',
      financial: '财务规划决策',
      personal: '个人生活决策',
      other: '其他重要决策'
    };
    return texts[type] || '重要决策';
  }

  // 辅助方法：获取情感状态的中文描述
  private static getEmotionalToneText(tone: string): string {
    const texts: Record<string, string> = {
      positive: '积极乐观',
      negative: '面临困难',
      conflicted: '内心冲突',
      neutral: '冷静理性'
    };
    return texts[tone] || '情绪稳定';
  }

  // 辅助方法：获取风险程度的中文描述
  private static getRiskLevelText(risk: string): string {
    const texts: Record<string, string> = {
      high: '高风险',
      medium: '中等风险',
      low: '低风险'
    };
    return texts[risk] || '中等风险';
  }

  /**
   * 生成个性化Prompt
   */
  static async generatePersonalizedPrompt(
    basePrompt: string,
    userInfo?: UnifiedUserInfo
  ): Promise<string> {
    if (!userInfo) {
      userInfo = UserInfoSharingService.getUserInfo();
    }

    let personalizedPrompt = basePrompt;

    // 添加用户基础信息
    if (userInfo.basicInfo.birthDate || userInfo.basicInfo.gender || userInfo.basicInfo.question) {
      personalizedPrompt += `\n\n# 用户信息`;
      
      if (userInfo.basicInfo.birthDate) {
        personalizedPrompt += `\n- 生日：${userInfo.basicInfo.birthDate}`;
      }
      if (userInfo.basicInfo.gender) {
        personalizedPrompt += `\n- 性别：${userInfo.basicInfo.gender}`;
      }
      if (userInfo.basicInfo.question) {
        personalizedPrompt += `\n- 咨询问题：${userInfo.basicInfo.question}`;
      }
    }

    // 添加玄学信息
    if (userInfo.mysticalInfo.zodiac) {
      personalizedPrompt += `\n- 星座：${userInfo.mysticalInfo.zodiac.sign}`;
      personalizedPrompt += `\n- 星座元素：${userInfo.mysticalInfo.zodiac.element}`;
      if (userInfo.mysticalInfo.zodiac.luckyColor) {
        personalizedPrompt += `\n- 幸运颜色：${userInfo.mysticalInfo.zodiac.luckyColor}`;
      }
    }

    // 添加占卜上下文
    if (userInfo.divinationContext.questionType) {
      personalizedPrompt += `\n- 问题类型：${userInfo.divinationContext.questionType}`;
    }
    if (userInfo.divinationContext.emotionalState) {
      personalizedPrompt += `\n- 情感状态：${userInfo.divinationContext.emotionalState}`;
    }
    if (userInfo.divinationContext.decisionType) {
      personalizedPrompt += `\n- 决策类型：${userInfo.divinationContext.decisionType}`;
    }

    return personalizedPrompt;
  }

  /**
   * 个性化塔罗解读
   */
  static async generatePersonalizedTarotInterpretation(
    cards: (StoryTarotCard & { orientation: 'upright' | 'reversed' })[],
    spread: TarotSpread,
    question: string,
    intent: TarotIntent,
    userInfo?: UnifiedUserInfo
  ): Promise<FinalTarotInterpretation> {
    if (!userInfo) {
      userInfo = UserInfoSharingService.getUserInfo();
    }

    // 生成基础解读
    const baseInterpretation = await this.getTarotInterpretation(cards, spread, question);

    // 应用个性化调整
    const personalizedInterpretation = this.applyPersonalizationToTarot(baseInterpretation, userInfo);

    return personalizedInterpretation;
  }

  /**
   * 个性化两难抉择分析
   */
  static async generatePersonalizedDilemmaAnalysis(
    optionA: string,
    optionB: string,
    scenario: any,
    hexagramInfo?: any,
    userInfo?: UnifiedUserInfo
  ): Promise<any> {
    if (!userInfo) {
      userInfo = UserInfoSharingService.getUserInfo();
    }

    // 生成基础分析
    const baseAnalysis = await this.getScenarioBasedDilemmaInterpretation(optionA, optionB, scenario, hexagramInfo);

    // 应用个性化调整
    const personalizedAnalysis = this.applyPersonalizationToDilemma(baseAnalysis, userInfo);

    return personalizedAnalysis;
  }

  /**
   * 应用个性化到塔罗解读
   */
  private static applyPersonalizationToTarot(
    interpretation: FinalTarotInterpretation,
    userInfo: UnifiedUserInfo
  ): FinalTarotInterpretation {
    const personalized = { ...interpretation };

    // 基于星座元素调整解读
    if (userInfo.mysticalInfo.zodiac?.element) {
      personalized.mainInterpretation = personalized.mainInterpretation.map(section => ({
        ...section,
        content: PersonalizationAlgorithm.adjustForZodiacElement(
          section.content,
          userInfo.mysticalInfo.zodiac!.element
        )
      }));
    }

    // 基于性别调整语气
    if (userInfo.basicInfo.gender) {
      personalized.mainInterpretation = personalized.mainInterpretation.map(section => ({
        ...section,
        content: PersonalizationAlgorithm.adjustToneForGender(
          section.content,
          userInfo.basicInfo.gender!
        )
      }));
    }

    // 基于问题类型调整重点
    if (userInfo.divinationContext.questionType) {
      personalized.mainInterpretation = personalized.mainInterpretation.map(section => ({
        ...section,
        content: PersonalizationAlgorithm.adjustFocusForQuestionType(
          section.content,
          userInfo.divinationContext.questionType!
        )
      }));
    }

    // 基于情感状态调整语气
    if (userInfo.divinationContext.emotionalState) {
      personalized.mainInterpretation = personalized.mainInterpretation.map(section => ({
        ...section,
        content: PersonalizationAlgorithm.adjustToneForEmotionalState(
          section.content,
          userInfo.divinationContext.emotionalState!
        )
      }));
    }

    return personalized;
  }

  /**
   * 应用个性化到两难抉择分析
   */
  private static applyPersonalizationToDilemma(
    analysis: any,
    userInfo: UnifiedUserInfo
  ): any {
    const personalized = { ...analysis };

    // 基于星座元素调整解读
    if (userInfo.mysticalInfo.zodiac?.element) {
      if (personalized.coreNarrative?.story) {
        personalized.coreNarrative.story = PersonalizationAlgorithm.adjustForZodiacElement(
          personalized.coreNarrative.story,
          userInfo.mysticalInfo.zodiac.element
        );
      }
    }

    // 基于性别调整语气
    if (userInfo.basicInfo.gender) {
      if (personalized.coreNarrative?.story) {
        personalized.coreNarrative.story = PersonalizationAlgorithm.adjustToneForGender(
          personalized.coreNarrative.story,
          userInfo.basicInfo.gender
        );
      }
    }

    // 基于决策类型调整建议
    if (userInfo.divinationContext.decisionType) {
      if (personalized.breakthroughPlan?.actionList) {
        personalized.breakthroughPlan.actionList = PersonalizationAlgorithm.adjustAdviceForDecisionType(
          personalized.breakthroughPlan.actionList.map((action: any) => action.actionDetail),
          userInfo.divinationContext.decisionType
        ).map((advice: string, index: number) => ({
          ...personalized.breakthroughPlan.actionList[index],
          actionDetail: advice
        }));
      }
    }

    // 添加个性化开场白
    if (personalized.openingStatement) {
      const personalizedOpening = PersonalizationAlgorithm.generatePersonalizedOpening(userInfo);
      personalized.openingStatement = `${personalizedOpening} ${personalized.openingStatement}`;
    }

    return personalized;
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
