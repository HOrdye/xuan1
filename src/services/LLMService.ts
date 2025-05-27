import type { Hexagram } from '../features/dilemma/types';
import { EnvConfigManager } from '../utils/envConfig';

/**
 * LLM API 配置接口
 */
interface LLMConfig {
  provider: 'openai' | 'qianwen' | 'deepseek' | 'claude' | 'custom' | 'local';
  apiKey?: string;
  baseURL?: string;
  model?: string;
  customApiKey?: string; // 自定义API的密钥
}

/**
 * LLM API 响应接口
 */
interface LLMResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * LLM加载状态接口
 */
interface LLMLoadingState {
  isLoading: boolean;
  progress: string;
  stage: 'preparing' | 'calling' | 'processing' | 'completed' | 'error';
}

/**
 * 安全获取环境变量 - 增强版本
 */
function getEnvVar(key: string, defaultValue: string = ''): string {
  return EnvConfigManager.getEnvVar(key as any, defaultValue);
}

/**
 * 默认LLM配置
 * 可以通过环境变量或用户设置覆盖
 */
const DEFAULT_CONFIG: LLMConfig = {
  provider: (getEnvVar('VITE_LLM_PROVIDER', 'qianwen') as LLMConfig['provider']) || 'qianwen',
  apiKey: getEnvVar('VITE_LLM_API_KEY', ''),
  baseURL: getEnvVar('VITE_LLM_BASE_URL', ''),
  model: getEnvVar('VITE_LLM_MODEL', 'qwen-plus')
};

// 添加调试信息
console.log('🔧 LLM Service 初始化配置:', {
  provider: DEFAULT_CONFIG.provider,
  hasApiKey: !!DEFAULT_CONFIG.apiKey,
  baseURL: DEFAULT_CONFIG.baseURL || '使用默认',
  model: DEFAULT_CONFIG.model
});

/**
 * LLM服务类 - 支持多个主流LLM提供商
 */
export class LLMService {
  private static config: LLMConfig = DEFAULT_CONFIG;
  private static loadingCallbacks: ((state: LLMLoadingState) => void)[] = [];
  
  /**
   * 设置LLM配置
   */
  static setConfig(config: Partial<LLMConfig>) {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * 获取当前配置
   */
  static getConfig(): LLMConfig {
    return { ...this.config };
  }

  /**
   * 订阅加载状态变化
   */
  static onLoadingStateChange(callback: (state: LLMLoadingState) => void) {
    this.loadingCallbacks.push(callback);
    return () => {
      const index = this.loadingCallbacks.indexOf(callback);
      if (index > -1) {
        this.loadingCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * 更新加载状态
   */
  private static updateLoadingState(state: LLMLoadingState) {
    this.loadingCallbacks.forEach(callback => callback(state));
  }
  
  /**
   * 获取每日运势分析 - 新增接口
   * @param birthDate 出生日期
   * @param gender 性别
   * @param zodiacSign 生肖
   * @param constellation 星座
   * @param question 特定问题
   * @returns 运势分析内容
   */
  static async getFortuneAnalysis(
    birthDate: string,
    gender: 'male' | 'female',
    zodiacSign: string,
    constellation: string,
    question: string = ''
  ): Promise<string> {
    // 开始加载
    this.updateLoadingState({
      isLoading: true,
      progress: '正在分析您的运势...',
      stage: 'preparing'
    });

    try {
      console.log('🔮 开始获取每日运势分析...', {
        birthDate,
        gender,
        zodiacSign,
        constellation,
        hasQuestion: !!question,
        provider: this.config.provider
      });

      // 如果没有配置API密钥，使用本地备用分析
      if (!this.config.apiKey) {
        console.warn('⚠️ 未配置LLM API密钥，使用本地备用分析');
        
        this.updateLoadingState({
          isLoading: true,
          progress: '使用传统命理学分析中...',
          stage: 'processing'
        });
        
        // 模拟处理时间
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const result = this.getLocalFortuneAnalysis(birthDate, gender, zodiacSign, constellation, question);
        
        this.updateLoadingState({
          isLoading: false,
          progress: '运势分析完成',
          stage: 'completed'
        });
        
        return result;
      }
      
      // 构建运势分析提示词
      this.updateLoadingState({
        isLoading: true,
        progress: '正在构建分析参数...',
        stage: 'preparing'
      });
      
      const prompt = this.buildFortunePrompt(birthDate, gender, zodiacSign, constellation, question);
      console.log('📝 构建的运势分析提示词长度:', prompt.length);
      
      // 调用LLM API
      this.updateLoadingState({
        isLoading: true,
        progress: `正在调用AI运势分析...`,
        stage: 'calling'
      });
      
      const response = await this.callLLMAPI(prompt);
      
      this.updateLoadingState({
        isLoading: true,
        progress: '正在生成个性化运势...',
        stage: 'processing'
      });
      
      if (response.content) {
        console.log('✅ 运势分析成功，返回内容长度:', response.content.length);
        
        this.updateLoadingState({
          isLoading: false,
          progress: '运势分析完成',
          stage: 'completed'
        });
        
        return response.content;
      } else {
        throw new Error('AI返回空的运势分析');
      }
    } catch (error) {
      console.error('❌ 运势分析失败:', error);
      
      this.updateLoadingState({
        isLoading: false,
        progress: '分析失败',
        stage: 'error'
      });
      
      // 出错时使用本地备用分析
      return this.getLocalFortuneAnalysis(birthDate, gender, zodiacSign, constellation, question);
    }
  }

  /**
   * 获取卦象解读 - 主要接口
   * @param hexagram 主卦
   * @param changingLines 变爻位置
   * @param relatedHexagram 变卦
   * @param question 用户问题
   * @returns 解读内容
   */
  static async getHexagramInterpretation(
    hexagram: Hexagram,
    changingLines: number[] = [],
    relatedHexagram: Hexagram | null = null,
    question: string = ''
  ): Promise<string> {
    // 开始加载
    this.updateLoadingState({
      isLoading: true,
      progress: '正在准备解读...',
      stage: 'preparing'
    });

    try {
      console.log('🔮 开始获取卦象解读...', {
        hexagram: hexagram.chineseName || hexagram.name,
        changingLines,
        question: question.substring(0, 50) + (question.length > 50 ? '...' : ''),
        provider: this.config.provider,
        hasApiKey: !!this.config.apiKey
      });

      // 如果没有配置API密钥，使用本地备用解读
      if (!this.config.apiKey) {
        console.warn('⚠️ 未配置LLM API密钥，使用本地备用解读');
        console.info('💡 如需AI解读，请配置环境变量 VITE_LLM_API_KEY');
        
        this.updateLoadingState({
          isLoading: true,
          progress: '使用本地智慧解读中...',
          stage: 'processing'
        });
        
        // 模拟处理时间
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const result = this.getLocalFallbackInterpretation(hexagram, changingLines, relatedHexagram, question);
        
        this.updateLoadingState({
          isLoading: false,
          progress: '解读完成',
          stage: 'completed'
        });
        
        return result;
      }
      
      // 构建提示词
      this.updateLoadingState({
        isLoading: true,
        progress: '正在构建提示词...',
        stage: 'preparing'
      });
      
      const prompt = this.buildPrompt(hexagram, changingLines, relatedHexagram, question);
      console.log('📝 构建的提示词长度:', prompt.length);
      
      // 调用对应的LLM API
      this.updateLoadingState({
        isLoading: true,
        progress: `正在调用${this.config.provider}模型...`,
        stage: 'calling'
      });
      
      console.log('🌐 正在调用 LLM API...', this.config.provider);
      const response = await this.callLLMAPI(prompt);
      
      this.updateLoadingState({
        isLoading: true,
        progress: '正在处理AI响应...',
        stage: 'processing'
      });
      
      if (response.content) {
        console.log('✅ LLM API 调用成功，返回内容长度:', response.content.length);
        if (response.usage) {
          console.log('📊 Token 使用情况:', response.usage);
        }
        
        this.updateLoadingState({
          isLoading: false,
          progress: '解读完成',
          stage: 'completed'
        });
        
        return response.content;
      } else {
        throw new Error('LLM返回空内容');
      }
    } catch (error) {
      console.error('❌ LLM API调用失败:', {
        error: error instanceof Error ? error.message : String(error),
        provider: this.config.provider,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      this.updateLoadingState({
        isLoading: true,
        progress: 'AI调用失败，切换到本地解读...',
        stage: 'processing'
      });
      
      console.log('🔄 正在切换到本地备用解读...');
      
      // 模拟处理时间
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = this.getLocalFallbackInterpretation(hexagram, changingLines, relatedHexagram, question);
      
      this.updateLoadingState({
        isLoading: false,
        progress: '解读完成（本地模式）',
        stage: 'completed'
      });
      
      return result;
    }
  }
  
  /**
   * 调用LLM API
   */
  private static async callLLMAPI(prompt: string): Promise<LLMResponse> {
    switch (this.config.provider) {
      case 'openai':
        return this.callOpenAI(prompt);
      case 'qianwen':
        return this.callQianwen(prompt);
      case 'deepseek':
        return this.callDeepSeek(prompt);
      case 'claude':
        return this.callClaude(prompt);
      case 'custom':
        return this.callCustomAPI(prompt);
      default:
        throw new Error(`不支持的LLM提供商: ${this.config.provider}`);
    }
  }
  
  /**
   * 调用OpenAI API
   */
  private static async callOpenAI(prompt: string): Promise<LLMResponse> {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一位精通《易经》的国学大师，擅长解读六十四卦。请用专业而通俗的语言为用户解读卦象，给出实用的人生指导。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API错误: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || '',
      usage: data.usage
    };
  }
  
  /**
   * 调用通义千问API
   */
  private static async callQianwen(prompt: string): Promise<LLMResponse> {
    try {
      console.log('🌐 开始调用通义千问API...');
      console.log('📍 API路径: /api/qianwen');
      console.log('🔑 API密钥长度:', this.config.apiKey?.length || 0);

      const response = await fetch('/api/qianwen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model || 'qwen-plus',
          messages: [
            {
              role: 'system',
              content: '你是一位精通《易经》的国学大师，擅长解读六十四卦。请用专业而通俗的语言为用户解读卦象，给出实用的人生指导。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      console.log('📡 API响应状态:', response.status, response.statusText);

      if (!response.ok) {
        // 详细的错误处理
        if (response.status === 404) {
          console.error('❌ 404错误：API代理未配置或代理目标不可达');
          console.error('💡 可能原因：');
          console.error('   1. Vite开发服务器代理配置有误');
          console.error('   2. 代理目标URL不正确');
          console.error('   3. 网络连接问题');
          console.error('💡 建议：重启开发服务器或检查vite.config.ts中的proxy配置');
          throw new Error(`API代理404错误 - 请检查Vite代理配置。状态：${response.status}`);
        } else if (response.status === 401) {
          console.error('❌ 401错误：API密钥无效或已过期');
          throw new Error(`API密钥验证失败 - 请检查密钥是否正确。状态：${response.status}`);
        } else if (response.status === 403) {
          console.error('❌ 403错误：API密钥权限不足或配额已用完');
          throw new Error(`API访问被拒绝 - 请检查密钥权限或配额。状态：${response.status}`);
        } else {
          throw new Error(`通义千问API错误: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log('✅ API调用成功，返回数据结构:', Object.keys(data));
      
      return {
        content: data.choices?.[0]?.message?.content || '',
        usage: data.usage
      };
    } catch (error) {
      console.error('💥 通义千问API调用异常:', error);
      
      // 如果是网络或代理问题，抛出详细错误
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('网络连接失败 - 请检查网络连接或代理配置');
      }
      
      throw error;
    }
  }
  
  /**
   * 调用DeepSeek API
   */
  private static async callDeepSeek(prompt: string): Promise<LLMResponse> {
    try {
      console.log('🌐 开始调用DeepSeek API...');
      
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model || 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一位精通《易经》的国学大师，擅长解读六十四卦。请用专业而通俗的语言为用户解读卦象，给出实用的人生指导。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      console.log('📡 DeepSeek API响应状态:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`DeepSeek API代理404错误 - 请检查Vite代理配置。状态：${response.status}`);
        } else if (response.status === 401) {
          throw new Error(`DeepSeek API密钥验证失败 - 请检查密钥是否正确。状态：${response.status}`);
        } else if (response.status === 403) {
          throw new Error(`DeepSeek API访问被拒绝 - 请检查密钥权限或配额。状态：${response.status}`);
        } else {
          throw new Error(`DeepSeek API错误: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log('✅ DeepSeek API调用成功');
      
      return {
        content: data.choices?.[0]?.message?.content || '',
        usage: data.usage
      };
    } catch (error) {
      console.error('💥 DeepSeek API调用异常:', error);
      throw error;
    }
  }
  
  /**
   * 调用Claude API
   */
  private static async callClaude(prompt: string): Promise<LLMResponse> {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        temperature: 0.7,
        system: '你是一位精通《易经》的国学大师，擅长解读六十四卦。请用专业而通俗的语言为用户解读卦象，给出实用的人生指导。',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Claude API错误: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      content: data.content[0]?.text || '',
      usage: data.usage
    };
  }
  
  /**
   * 调用自定义API
   */
  private static async callCustomAPI(prompt: string): Promise<LLMResponse> {
    try {
      console.log('🌐 开始调用自定义API...');
      
      if (!this.config.baseURL) {
        throw new Error('自定义API需要配置baseURL');
      }
      
      // 使用自定义API密钥或主密钥
      const apiKey = this.config.customApiKey || this.config.apiKey;
      if (!apiKey) {
        throw new Error('自定义API需要配置API密钥');
      }
      
      const response = await fetch(this.config.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '你是一位精通《易经》的国学大师，擅长解读六十四卦。请用专业而通俗的语言为用户解读卦象，给出实用的人生指导。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      console.log('📡 自定义API响应状态:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`自定义API 404错误 - 请检查API地址是否正确。状态：${response.status}`);
        } else if (response.status === 401) {
          throw new Error(`自定义API密钥验证失败 - 请检查密钥是否正确。状态：${response.status}`);
        } else if (response.status === 403) {
          throw new Error(`自定义API访问被拒绝 - 请检查密钥权限或配额。状态：${response.status}`);
        } else {
          throw new Error(`自定义API错误: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log('✅ 自定义API调用成功');
      
      return {
        content: data.choices?.[0]?.message?.content || data.content || '',
        usage: data.usage
      };
    } catch (error) {
      console.error('💥 自定义API调用异常:', error);
      throw error;
    }
  }
  
  /**
   * 构建LLM提示词
   */
  private static buildPrompt(
    hexagram: Hexagram,
    changingLines: number[],
    relatedHexagram: Hexagram | null,
    question: string
  ): string {
    let prompt = '';
    
    // 基本卦象信息
    prompt += `请为我解读以下卦象：\n\n`;
    prompt += `【主卦】${hexagram.chineseName || hexagram.name}卦（第${hexagram.sequence}卦）\n`;
    prompt += `爻组合：${hexagram.lines?.join('') || '未知'}\n`;
    prompt += `卦辞：${hexagram.judgment || hexagram.description || '无'}\n`;
    
    // 变爻信息
    if (changingLines.length > 0) {
      const lineNames = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
      const changingLineNames = changingLines.map(i => lineNames[i]).join('、');
      prompt += `变爻：${changingLineNames}\n`;
      
      if (relatedHexagram) {
        prompt += `【变卦】${relatedHexagram.chineseName || relatedHexagram.name}卦\n`;
      }
    }
    
    // 用户问题
    if (question) {
      prompt += `\n【问题】${question}\n`;
    }
    
    // 解读要求
    prompt += `\n请从以下几个方面进行详细解读：\n`;
    prompt += `1. 卦象的核心含义和象征\n`;
    prompt += `2. 针对当前情况的分析\n`;
    prompt += `3. 具体的行动建议\n`;
    
    if (changingLines.length > 0) {
      prompt += `4. 变爻的特殊意义\n`;
    }
    
    if (question) {
      prompt += `5. 针对问题"${question}"的专门指导\n`;
    }
    
    prompt += `\n请用通俗易懂的现代语言解释，结合传统易学智慧给出实用建议。`;
    
    return prompt;
  }
  
  /**
   * 本地备用解读（当API不可用时使用）
   */
  private static getLocalFallbackInterpretation(
    hexagram: Hexagram,
    changingLines: number[],
    relatedHexagram: Hexagram | null,
    question: string
  ): string {
    // 使用原有的本地解读逻辑
    let interpretation = '';
    
    if (question) {
      interpretation += `关于"${question}"的问题，${hexagram.chineseName || hexagram.name}卦给出的启示是：\n\n`;
    } else {
      interpretation += `${hexagram.chineseName || hexagram.name}卦的解读：\n\n`;
    }
    
    interpretation += `【卦象含义】\n`;
    interpretation += `${hexagram.chineseName || hexagram.name}卦代表${hexagram.meaning || hexagram.modernInterpretation || '变化与平衡'}。`;
    interpretation += `这个卦象提示当前形势${hexagram.nature || '需要谨慎应对'}。\n\n`;
    
    interpretation += `【基本建议】\n`;
    interpretation += `1. 保持内心平静，客观分析当前局势\n`;
    interpretation += `2. 顺应自然规律，不要强求改变\n`;
    interpretation += `3. 根据实际情况灵活调整策略\n\n`;
    
    if (changingLines.length > 0 && relatedHexagram) {
      interpretation += `【变化分析】\n`;
      interpretation += `当前有${changingLines.length}个变爻，局势正从${hexagram.chineseName || hexagram.name}转向${relatedHexagram.chineseName || relatedHexagram.name}，`;
      interpretation += `建议在变化中保持稳定，适时调整方向。\n\n`;
    }
    
    if (question) {
      interpretation += `【针对问题的建议】\n`;
      interpretation += `对于"${question}"，建议你根据${hexagram.chineseName || hexagram.name}卦的指引，`;
      interpretation += `${Math.random() > 0.5 ? '耐心等待时机成熟' : '积极主动寻找机会'}，`;
      interpretation += `最终能够找到适合的解决方案。`;
    }
    
    interpretation += `\n\n※ 当前使用本地解读，如需更详细的分析，请配置LLM API密钥。`;
    
    return interpretation;
  }

  /**
   * 构建运势分析提示词
   */
  private static buildFortunePrompt(
    birthDate: string,
    gender: 'male' | 'female',
    zodiacSign: string,
    constellation: string,
    question: string
  ): string {
    const today = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let prompt = '';
    prompt += `请为我分析今日（${today}）的个人运势。\n\n`;
    
    // 基本信息
    prompt += `【个人信息】\n`;
    prompt += `出生日期：${birthDate}\n`;
    prompt += `性别：${gender === 'male' ? '男性' : '女性'}\n`;
    prompt += `生肖：${zodiacSign}\n`;
    prompt += `星座：${constellation}\n`;
    
    // 特定问题
    if (question) {
      prompt += `\n【咨询问题】\n${question}\n`;
    }
    
    // 分析要求
    prompt += `\n请基于传统命理学、生肖特征、星座特点，为我详细分析今日运势：\n\n`;
    prompt += `1. 【综合运势】（★★★★★五星评级）- 今日整体运势概况\n`;
    prompt += `2. 【工作运势】（★★★★★五星评级）- 事业和工作方面的运势\n`;
    prompt += `3. 【感情运势】（★★★★★五星评级）- 爱情和人际关系运势\n`;
    prompt += `4. 【财富运势】（★★★★★五星评级）- 财运和投资理财运势\n`;
    prompt += `5. 【健康运势】（★★★★★五星评级）- 身体健康方面的运势\n`;
    prompt += `6. 【幸运色彩】- 推荐今日的幸运颜色\n`;
    prompt += `7. 【幸运数字】- 推荐今日的幸运数字\n`;
    prompt += `8. 【开运贴士】- 今日的具体开运建议\n`;
    
    if (question) {
      prompt += `9. 【问题解答】- 针对您的咨询问题给出专业分析和建议\n`;
    }
    
    prompt += `\n请用专业又通俗易懂的语言，结合${zodiacSign}生肖和${constellation}星座的特点，`;
    prompt += `给出具体、实用的运势分析和生活指导。每个运势类型都要给出星级评分（用★表示）和详细解释。`;
    
    return prompt;
  }

  /**
   * 本地运势分析（当API不可用时使用）
   */
  private static getLocalFortuneAnalysis(
    birthDate: string,
    gender: 'male' | 'female',
    zodiacSign: string,
    constellation: string,
    question: string
  ): string {
    const today = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // 生成基于时间种子的随机评分
    const seed = new Date().getDate() + new Date().getMonth();
    const getRandomRating = (base: number = 3) => {
      const random = (seed + base * 17) % 5 + 1;
      return '★'.repeat(random) + '☆'.repeat(5 - random);
    };

    // 根据生肖和星座特征生成个性化内容
    const zodiacTraits = this.getZodiacTraits(zodiacSign);
    const constellationTraits = this.getConstellationTraits(constellation);

    let analysis = `🌟 ${today} 专属运势分析\n\n`;
    analysis += `💫 ${constellation}座 ${zodiacSign}年出生的${gender === 'male' ? '您' : '您'}：\n\n`;
    
    analysis += `📊 【综合运势】${getRandomRating(3)}\n`;
    analysis += `今天是您${constellation}的幸运日！${zodiacTraits.todayAdvice}，`;
    analysis += `结合${constellation}座的${constellationTraits.trait}，今日适合${constellationTraits.advice}。\n\n`;
    
    analysis += `💼 【工作运势】${getRandomRating(4)}\n`;
    analysis += `工作方面呈现良好势头。${zodiacTraits.workLuck}，`;
    analysis += `建议发挥${constellation}座特有的${constellationTraits.strength}，会有不错的表现。\n\n`;
    
    analysis += `💕 【感情运势】${getRandomRating(2)}\n`;
    analysis += `感情方面需要多一些耐心。${constellationTraits.loveAdvice}，`;
    analysis += `${zodiacSign}年的您天生${zodiacTraits.personality}，今日适合温和沟通。\n\n`;
    
    analysis += `💰 【财富运势】${getRandomRating(3)}\n`;
    analysis += `财运平稳，有小幅上升趋势。${zodiacTraits.moneyLuck}，`;
    analysis += `${constellation}座今日不宜进行大额投资，稳健为主。\n\n`;
    
    analysis += `🏃‍♀️ 【健康运势】${getRandomRating(4)}\n`;
    analysis += `健康状况良好，精神状态佳。注意${zodiacTraits.healthTip}，`;
    analysis += `${constellation}座容易${constellationTraits.healthConcern}，建议多休息。\n\n`;
    
    analysis += `🎨 【幸运色彩】${constellationTraits.luckyColor}\n`;
    analysis += `今日穿戴${constellationTraits.luckyColor}色的服饰或配件，有助于提升运势。\n\n`;
    
    analysis += `🔢 【幸运数字】${zodiacTraits.luckyNumber}\n`;
    analysis += `数字${zodiacTraits.luckyNumber}是您今日的幸运数字，在重要决策时可以参考。\n\n`;
    
    analysis += `✨ 【开运贴士】\n`;
    analysis += `• ${zodiacTraits.tip1}\n`;
    analysis += `• ${constellationTraits.tip}\n`;
    analysis += `• 保持积极心态，遇事多从正面角度思考\n\n`;
    
    if (question) {
      analysis += `🤔 【问题解答】\n`;
      analysis += `关于"${question}"，根据您${constellation}座${zodiacSign}年的命理特点，`;
      analysis += `建议您${constellationTraits.problemAdvice}。${zodiacTraits.wisdomAdvice}\n\n`;
    }
    
    analysis += `📝 本分析基于传统命理学理论，仅供参考。如需更详细的AI智能分析，请配置LLM API密钥。`;
    
    return analysis;
  }

  /**
   * 获取生肖特征
   */
  private static getZodiacTraits(zodiac: string) {
    const traits: {[key: string]: any} = {
      '鼠': {
        personality: '机智灵活',
        todayAdvice: '适合动脑思考',
        workLuck: '思维敏捷，容易找到解决方案',
        moneyLuck: '理财头脑清晰，适合小额投资',
        healthTip: '避免过度用脑',
        luckyNumber: '3, 5, 8',
        tip1: '多与朋友交流，会有意外收获',
        wisdomAdvice: '发挥您天生的敏锐直觉'
      },
      '牛': {
        personality: '踏实稳重',
        todayAdvice: '脚踏实地做事',
        workLuck: '坚持不懈，会有稳定收获',
        moneyLuck: '保守理财，稳中求进',
        healthTip: '注意颈椎和肩膀健康',
        luckyNumber: '1, 6, 9',
        tip1: '按部就班完成计划，不要急躁',
        wisdomAdvice: '用您的坚韧和毅力克服困难'
      },
      '虎': {
        personality: '勇敢果断',
        todayAdvice: '勇于尝试新事物',
        workLuck: '领导能力突出，适合主导项目',
        moneyLuck: '投资运不错，但要控制风险',
        healthTip: '避免过度激烈运动',
        luckyNumber: '2, 7, 9',
        tip1: '发挥天生的领导魅力',
        wisdomAdvice: '在勇敢的同时保持理性思考'
      },
      '兔': {
        personality: '温和善良',
        todayAdvice: '以和为贵，避免冲突',
        workLuck: '人际关系和谐，团队合作顺利',
        moneyLuck: '财运平稳，适合储蓄',
        healthTip: '注意肠胃健康',
        luckyNumber: '4, 6, 8',
        tip1: '多关心家人朋友，情感联系更紧密',
        wisdomAdvice: '用您的善良和智慧化解矛盾'
      },
      '龙': {
        personality: '自信威严',
        todayAdvice: '展现个人魅力',
        workLuck: '创新能力强，容易获得认可',
        moneyLuck: '财运旺盛，有意外收入',
        healthTip: '注意心血管健康',
        luckyNumber: '1, 5, 9',
        tip1: '相信自己的能力，大胆行动',
        wisdomAdvice: '用您的智慧和魅力去影响他人'
      },
      '蛇': {
        personality: '智慧深邃',
        todayAdvice: '深思熟虑再行动',
        workLuck: '分析能力强，适合策划工作',
        moneyLuck: '投资眼光敏锐，但要谨慎',
        healthTip: '注意神经系统健康',
        luckyNumber: '2, 6, 7',
        tip1: '相信自己的直觉判断',
        wisdomAdvice: '用您的洞察力看穿问题本质'
      },
      '马': {
        personality: '热情奔放',
        todayAdvice: '保持积极向上的心态',
        workLuck: '行动力强，执行效率高',
        moneyLuck: '财运活跃，但要避免冲动消费',
        healthTip: '注意腿部和运动安全',
        luckyNumber: '3, 7, 8',
        tip1: '把握机会，勇往直前',
        wisdomAdvice: '在追求目标时保持初心'
      },
      '羊': {
        personality: '温柔体贴',
        todayAdvice: '多关注内心感受',
        workLuck: '创意思维活跃，适合艺术创作',
        moneyLuck: '理财需要他人建议',
        healthTip: '注意情绪调节',
        luckyNumber: '2, 4, 9',
        tip1: '发挥艺术天赋，美化生活',
        wisdomAdvice: '用您的温柔去感化他人'
      },
      '猴': {
        personality: '聪明机灵',
        todayAdvice: '灵活变通，随机应变',
        workLuck: '学习能力强，适合技能提升',
        moneyLuck: '投资嗅觉敏锐，但要稳健',
        healthTip: '注意手部和大脑健康',
        luckyNumber: '1, 4, 8',
        tip1: '多学习新知识新技能',
        wisdomAdvice: '用您的智慧巧妙解决问题'
      },
      '鸡': {
        personality: '勤劳务实',
        todayAdvice: '早起的鸟儿有虫吃',
        workLuck: '责任心强，容易获得信任',
        moneyLuck: '勤俭持家，积少成多',
        healthTip: '注意呼吸系统健康',
        luckyNumber: '5, 7, 9',
        tip1: '制定详细计划并严格执行',
        wisdomAdvice: '用您的勤劳和毅力创造价值'
      },
      '狗': {
        personality: '忠诚可靠',
        todayAdvice: '诚待他人，建立信任',
        workLuck: '团队精神强，适合协作项目',
        moneyLuck: '理财保守，但很稳健',
        healthTip: '注意关节和骨骼健康',
        luckyNumber: '3, 6, 8',
        tip1: '多帮助他人，会有意外回报',
        wisdomAdvice: '用您的忠诚和正直赢得尊重'
      },
      '猪': {
        personality: '善良纯真',
        todayAdvice: '保持乐观开朗的心情',
        workLuck: '人缘好，容易得到贵人相助',
        moneyLuck: '财运不错，但要控制开支',
        healthTip: '注意饮食健康',
        luckyNumber: '2, 5, 8',
        tip1: '享受生活中的小美好',
        wisdomAdvice: '用您的善良去温暖身边的人'
      }
    };
    
    return traits[zodiac] || traits['鼠'];
  }

  /**
   * 获取星座特征
   */
  private static getConstellationTraits(constellation: string) {
    const traits: {[key: string]: any} = {
      '白羊座': {
        trait: '积极主动',
        advice: '开展新项目',
        strength: '领导能力',
        loveAdvice: '主动表达感情',
        healthConcern: '上火发炎',
        luckyColor: '红色',
        tip: '冲动前先冷静三秒',
        problemAdvice: '直接面对，快速行动'
      },
      '金牛座': {
        trait: '稳重踏实',
        advice: '专注现有工作',
        strength: '坚持不懈',
        loveAdvice: '慢慢培养感情',
        healthConcern: '颈椎问题',
        luckyColor: '绿色',
        tip: '享受美食和音乐',
        problemAdvice: '按部就班，稳扎稳打'
      },
      '双子座': {
        trait: '聪明好学',
        advice: '学习新知识',
        strength: '沟通能力',
        loveAdvice: '多聊天交流',
        healthConcern: '神经紧张',
        luckyColor: '黄色',
        tip: '保持好奇心和学习热情',
        problemAdvice: '多角度思考，灵活应变'
      },
      '巨蟹座': {
        trait: '温柔体贴',
        advice: '关爱家人朋友',
        strength: '同理心',
        loveAdvice: '注重情感交流',
        healthConcern: '情绪波动',
        luckyColor: '银色',
        tip: '营造温馨的家庭氛围',
        problemAdvice: '倾听内心声音，相信直觉'
      },
      '狮子座': {
        trait: '自信阳光',
        advice: '展现个人魅力',
        strength: '感染力',
        loveAdvice: '大方表达爱意',
        healthConcern: '心血管压力',
        luckyColor: '金色',
        tip: '做自己的国王/女王',
        problemAdvice: '勇敢面对，展现自信'
      },
      '处女座': {
        trait: '细致认真',
        advice: '完善工作细节',
        strength: '分析能力',
        loveAdvice: '理性分析感情',
        healthConcern: '肠胃不适',
        luckyColor: '米色',
        tip: '追求完美但不苛求',
        problemAdvice: '仔细分析，制定详细计划'
      },
      '天秤座': {
        trait: '优雅和谐',
        advice: '平衡各方关系',
        strength: '协调能力',
        loveAdvice: '寻求关系平衡',
        healthConcern: '腰部不适',
        luckyColor: '粉色',
        tip: '追求美和艺术',
        problemAdvice: '寻求平衡点，避免极端'
      },
      '天蝎座': {
        trait: '深邃神秘',
        advice: '深入研究问题',
        strength: '洞察力',
        loveAdvice: '真诚深入交流',
        healthConcern: '内分泌失调',
        luckyColor: '深红色',
        tip: '相信自己的直觉',
        problemAdvice: '深入挖掘问题根源'
      },
      '射手座': {
        trait: '乐观自由',
        advice: '探索新领域',
        strength: '适应能力',
        loveAdvice: '给彼此自由空间',
        healthConcern: '运动损伤',
        luckyColor: '紫色',
        tip: '保持乐观和冒险精神',
        problemAdvice: '换个角度看问题，保持乐观'
      },
      '摩羯座': {
        trait: '稳重务实',
        advice: '制定长远计划',
        strength: '执行力',
        loveAdvice: '认真对待感情',
        healthConcern: '骨骼关节',
        luckyColor: '深蓝色',
        tip: '一步一个脚印前进',
        problemAdvice: '制定实际可行的解决方案'
      },
      '水瓶座': {
        trait: '独立创新',
        advice: '尝试创新方法',
        strength: '创新思维',
        loveAdvice: '保持独立个性',
        healthConcern: '循环系统',
        luckyColor: '青色',
        tip: '做独一无二的自己',
        problemAdvice: '跳出传统思维，寻找创新解决方案'
      },
      '双鱼座': {
        trait: '感性浪漫',
        advice: '发挥想象力',
        strength: '共情能力',
        loveAdvice: '用心感受对方',
        healthConcern: '免疫力下降',
        luckyColor: '海蓝色',
        tip: '相信内心的美好',
        problemAdvice: '用直觉和感性去理解问题'
      }
    };
    
    return traits[constellation] || traits['白羊座'];
  }
} 