<template>
  <div class="global-llm-config">
    <!-- 配置按钮 -->
    <button
      @click="showModal = true"
      class="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 z-50 flex items-center justify-center"
      :class="{ 'animate-pulse': !isConfigured }"
    >
      <span v-if="isConfigured" class="text-2xl">🤖</span>
      <span v-else class="text-2xl">⚙️</span>
    </button>

    <!-- 配置状态指示器 -->
    <div 
      v-if="!isConfigured"
      class="fixed bottom-24 right-6 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg shadow-lg text-sm z-40 max-w-xs"
    >
      点击配置AI服务，获得更智能的分析
    </div>

    <!-- 配置模态框 -->
    <teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="showModal = false"
      >
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- 头部 -->
          <div class="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold">AI智能服务配置</h2>
                <p class="text-purple-100 mt-1">一次配置，全站使用</p>
              </div>
              <button
                @click="showModal = false"
                class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <span class="text-2xl">×</span>
              </button>
            </div>
          </div>

          <!-- 内容 -->
          <div class="p-6 space-y-6">
            <!-- 配置状态 -->
            <div class="p-4 rounded-xl border-2" :class="statusStyle.bg + ' ' + statusStyle.border">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" :class="statusStyle.dot"></div>
                <div>
                  <div class="font-semibold" :class="statusStyle.text">{{ statusText }}</div>
                  <div class="text-sm opacity-75" :class="statusStyle.text">{{ statusDesc }}</div>
                </div>
              </div>
            </div>

            <!-- 提供商选择 -->
            <div class="space-y-3">
              <label class="block text-lg font-semibold text-gray-800">选择AI服务提供商</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-for="provider in providers"
                  :key="provider.value"
                  @click="localConfig.provider = provider.value"
                  class="p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
                  :class="localConfig.provider === provider.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-semibold text-gray-800">{{ provider.name }}</div>
                      <div class="text-sm text-gray-600">{{ provider.desc }}</div>
                      <div class="text-xs text-purple-600 mt-1">{{ provider.features }}</div>
                    </div>
                    <div class="text-2xl">{{ provider.icon }}</div>
                  </div>
                  <div v-if="localConfig.provider === provider.value" class="mt-2 text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded">
                    ✓ 已选择
                  </div>
                </div>
              </div>
            </div>

            <!-- API密钥配置 -->
            <div class="space-y-3">
              <label class="block text-lg font-semibold text-gray-800">API密钥配置</label>
              <div class="relative">
                <input
                  v-model="localConfig.apiKey"
                  :type="showApiKey ? 'text' : 'password'"
                  :placeholder="getApiKeyPlaceholder()"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all pr-12 text-lg"
                />
                <button
                  @click="showApiKey = !showApiKey"
                  class="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span v-if="showApiKey" class="text-2xl">👁️</span>
                  <span v-else class="text-2xl">👁️‍🗨️</span>
                </button>
              </div>
              
              <!-- 特殊说明 -->
              <div v-if="localConfig.provider === 'custom'" class="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div class="text-amber-800 text-sm">
                  <strong>自定义API说明：</strong>
                  <br>支持任意兼容OpenAI格式的API接口，请在高级配置中设置API地址和密钥
                </div>
              </div>
            </div>

            <!-- 获取密钥指引 -->
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 class="font-semibold text-blue-800 mb-2">如何获取API密钥？</h4>
              <div class="text-sm text-blue-700 space-y-1">
                <div v-if="localConfig.provider === 'qianwen'">
                  <strong>通义千问：</strong>访问 <a href="https://dashscope.aliyun.com/" target="_blank" class="underline">阿里云DashScope</a> 获取API Key
                </div>
                <div v-else-if="localConfig.provider === 'openai'">
                  <strong>OpenAI：</strong>访问 <a href="https://platform.openai.com/api-keys" target="_blank" class="underline">OpenAI平台</a> 获取API Key
                </div>
                <div v-else-if="localConfig.provider === 'deepseek'">
                  <strong>DeepSeek：</strong>访问 <a href="https://platform.deepseek.com/" target="_blank" class="underline">DeepSeek平台</a> 获取API Key
                </div>
                <div v-else-if="localConfig.provider === 'claude'">
                  <strong>Claude：</strong>访问 <a href="https://console.anthropic.com/" target="_blank" class="underline">Anthropic控制台</a> 获取API Key
                </div>
                <div v-else-if="localConfig.provider === 'custom'">
                  <strong>自定义API：</strong>请联系您的API提供商获取密钥，并在高级配置中设置API地址
                </div>
              </div>
            </div>

            <!-- 高级配置 -->
            <details class="border border-gray-200 rounded-xl">
              <summary class="p-4 cursor-pointer text-lg font-semibold text-gray-800 hover:bg-gray-50 rounded-xl transition-colors">
                🔧 高级配置 (可选)
              </summary>
              <div class="p-4 border-t border-gray-200 space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">自定义API地址</label>
                  <input
                    v-model="localConfig.baseURL"
                    type="url"
                    :placeholder="localConfig.provider === 'custom' ? '必填：输入API完整地址' : '留空使用默认官方地址'"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                    :class="{'border-red-300 ring-red-200': localConfig.provider === 'custom' && !localConfig.baseURL}"
                  />
                  <p v-if="localConfig.provider === 'custom'" class="text-xs text-gray-500 mt-1">
                    例如：https://api.openai.com/v1/chat/completions
                  </p>
                </div>
                
                <div v-if="localConfig.provider === 'custom'">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">自定义API密钥</label>
                  <div class="relative">
                    <input
                      v-model="localConfig.customApiKey"
                      :type="showCustomApiKey ? 'text' : 'password'"
                      placeholder="输入自定义API的密钥..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 pr-10"
                      :class="{'border-red-300 ring-red-200': localConfig.provider === 'custom' && !localConfig.customApiKey && !localConfig.apiKey}"
                    />
                    <button
                      @click="showCustomApiKey = !showCustomApiKey"
                      class="absolute right-2 top-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <span v-if="showCustomApiKey" class="text-lg">👁️</span>
                      <span v-else class="text-lg">👁️‍🗨️</span>
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    如果留空，将使用上方的主API密钥
                  </p>
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">模型名称</label>
                  <input
                    v-model="localConfig.model"
                    type="text"
                    :placeholder="getModelPlaceholder()"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                  />
                </div>
              </div>
            </details>

            <!-- 操作按钮 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                @click="testConfig"
                :disabled="!canTest || isTesting"
                class="px-6 py-3 border-2 border-purple-500 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isTesting">🔄 测试中...</span>
                <span v-else>🔍 测试连接</span>
              </button>
              
              <button
                @click="saveConfig"
                :disabled="!canSave"
                class="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                💾 保存配置
              </button>
              
              <button
                @click="clearConfig"
                class="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                🗑️ 清除配置
              </button>
            </div>

            <!-- 测试结果 -->
            <div v-if="testResult" class="p-4 rounded-xl border-2" :class="testResult.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'">
              <div class="flex items-start">
                <span class="text-2xl mr-3">{{ testResult.success ? '✅' : '❌' }}</span>
                <div>
                  <div class="font-semibold">{{ testResult.success ? '连接成功！' : '连接失败' }}</div>
                  <div class="text-sm mt-1 opacity-90">{{ testResult.message }}</div>
                </div>
              </div>
            </div>

            <!-- 说明信息 -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <h4 class="font-semibold text-gray-800 mb-2">💡 使用说明</h4>
              <ul class="text-sm text-gray-700 space-y-1">
                <li>• 配置后将在所有功能中生效：运势分析、卦象解读等</li>
                <li>• 密钥仅存储在本地浏览器，绝不上传到服务器</li>
                <li>• 推荐通义千问：国内访问稳定，价格实惠</li>
                <li>• DeepSeek：国产新星，性价比极高，推理能力强</li>
                <li>• 自定义API：支持任意兼容OpenAI格式的API服务</li>
                <li>• 不配置时使用本地算法，功能相对简单</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { LLMService } from '../services/LLMService';

// 组件状态
const showModal = ref(false);
const showApiKey = ref(false);
const showCustomApiKey = ref(false);
const isTesting = ref(false);

// 本地配置
const localConfig = reactive<{
  provider: 'qianwen' | 'openai' | 'deepseek' | 'claude' | 'custom';
  apiKey: string;
  baseURL: string;
  model: string;
  customApiKey: string;
}>({
  provider: 'qianwen',
  apiKey: '',
  baseURL: '',
  model: '',
  customApiKey: ''
});

// 测试结果
const testResult = ref<{
  success: boolean;
  message: string;
} | null>(null);

// 提供商列表
const providers = [
  {
    value: 'qianwen' as const,
    name: '通义千问',
    desc: '阿里云出品，国内首选',
    features: '稳定快速 • 价格实惠',
    icon: '🤖'
  },
  {
    value: 'openai' as const,
    name: 'OpenAI',
    desc: 'ChatGPT背后的技术',
    features: '功能强大 • 全球领先',
    icon: '🧠'
  },
  {
    value: 'deepseek' as const,
    name: 'DeepSeek',
    desc: '深度求索，国产新星',
    features: '性价比高 • 推理能力强',
    icon: '🚀'
  },
  {
    value: 'claude' as const,
    name: 'Claude',
    desc: 'Anthropic出品',
    features: '安全可靠 • 理解深入',
    icon: '🎭'
  },
  {
    value: 'custom' as const,
    name: '自定义API',
    desc: '支持任意兼容OpenAI格式的API',
    features: '灵活配置 • 自由选择',
    icon: '⚙️'
  }
];

// 是否已配置
const isConfigured = computed(() => {
  if (localConfig.provider === 'custom') {
    return !!(localConfig.baseURL && (localConfig.customApiKey || localConfig.apiKey));
  }
  return localConfig.apiKey.trim().length > 0;
});

// 是否可以测试
const canTest = computed(() => {
  if (localConfig.provider === 'custom') {
    return !!(localConfig.baseURL && (localConfig.customApiKey || localConfig.apiKey));
  }
  return localConfig.apiKey.trim().length > 0;
});

// 是否可以保存
const canSave = computed(() => {
  if (localConfig.provider === 'custom') {
    return !!(localConfig.baseURL && (localConfig.customApiKey || localConfig.apiKey));
  }
  return localConfig.apiKey.trim().length > 0;
});

// 配置状态样式
const statusStyle = computed(() => {
  if (isConfigured.value) {
    return {
      bg: 'bg-green-50',
      border: 'border-green-200',
      dot: 'bg-green-500',
      text: 'text-green-800'
    };
  } else {
    return {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      dot: 'bg-yellow-500',
      text: 'text-yellow-800'
    };
  }
});

// 状态文字
const statusText = computed(() => {
  return isConfigured.value ? 'AI服务已配置' : '未配置AI服务';
});

const statusDesc = computed(() => {
  if (isConfigured.value) {
    return `使用${getProviderName()}提供智能分析`;
  } else {
    return '当前使用基础本地算法';
  }
});

// 获取提供商名称
function getProviderName(): string {
  const names = {
    qianwen: '通义千问',
    openai: 'OpenAI',
    deepseek: 'DeepSeek',
    claude: 'Claude',
    custom: '自定义API'
  };
  return names[localConfig.provider] || '未知';
}

// 获取API密钥占位符
function getApiKeyPlaceholder(): string {
  const placeholders = {
    qianwen: '输入通义千问API Key...',
    openai: '输入OpenAI API Key (sk-开头)...',
    deepseek: '输入DeepSeek API Key...',
    claude: '输入Claude API Key...',
    custom: '输入主API密钥（可在高级配置中单独设置）...'
  };
  return placeholders[localConfig.provider] || '输入API Key...';
}

// 获取模型占位符
function getModelPlaceholder(): string {
  const placeholders = {
    qianwen: 'qwen-plus (默认)',
    openai: 'gpt-3.5-turbo (默认)',
    deepseek: 'deepseek-chat (默认)',
    claude: 'claude-3-sonnet-20240229 (默认)',
    custom: '根据API提供商要求填写模型名称'
  };
  return placeholders[localConfig.provider] || '';
}

// 保存配置
function saveConfig(): void {
  try {
    // 验证自定义API配置
    if (localConfig.provider === 'custom') {
      if (!localConfig.baseURL) {
        alert('❌ 自定义API需要配置API地址');
        return;
      }
      if (!localConfig.customApiKey && !localConfig.apiKey) {
        alert('❌ 自定义API需要配置API密钥');
        return;
      }
    }
    
    // 保存到localStorage
    const config = {
      provider: localConfig.provider,
      apiKey: localConfig.apiKey,
      baseURL: localConfig.baseURL,
      model: localConfig.model,
      customApiKey: localConfig.customApiKey
    };
    localStorage.setItem('llm-config', JSON.stringify(config));
    
    // 更新LLMService配置
    LLMService.setConfig(config);
    
    // 显示成功消息
    alert('🎉 配置保存成功！AI服务现在可以在所有功能中使用了。');
    showModal.value = false;
  } catch (error) {
    console.error('保存配置失败:', error);
    alert('❌ 保存配置失败，请重试。');
  }
}

// 测试配置
async function testConfig(): Promise<void> {
  if (!canTest.value) {
    return;
  }
  
  isTesting.value = true;
  testResult.value = null;
  
  try {
    // 临时应用配置
    LLMService.setConfig(localConfig);
    
    // 进行测试调用
    const testPrompt = '你好，请简单回复"连接成功"以确认API工作正常。';
    const response = await LLMService.getHexagramInterpretation(
      // 模拟一个简单的测试卦象
      { 
        name: '测试', 
        chineseName: '测试', 
        number: 1,
        sequence: 1, 
        symbol: '☰',
        lines: [1, 1, 1, 1, 1, 1],
        meaning: '测试连接',
        judgment: '测试卦辞',
        yao_texts: ['初九', '九二', '九三', '九四', '九五', '上九'],
        trigrams: { upper: '乾', lower: '乾' }
      },
      [],
      null,
      testPrompt
    );
    
    testResult.value = {
      success: true,
      message: `${getProviderName()}连接正常，返回内容长度：${response.length}字符`
    };
  } catch (error) {
    console.error('测试连接失败:', error);
    testResult.value = {
      success: false,
      message: error instanceof Error ? error.message : '未知错误'
    };
  } finally {
    isTesting.value = false;
  }
}

// 清除配置
function clearConfig(): void {
  if (confirm('确定要清除所有AI配置吗？清除后将使用本地基础算法。')) {
    localStorage.removeItem('llm-config');
    localConfig.provider = 'qianwen';
    localConfig.apiKey = '';
    localConfig.baseURL = '';
    localConfig.model = '';
    localConfig.customApiKey = '';
    
    // 重置LLMService配置
    LLMService.setConfig({
      provider: 'qianwen',
      apiKey: '',
      baseURL: '',
      model: '',
      customApiKey: ''
    });
    
    testResult.value = null;
    alert('✅ 配置已清除');
  }
}

// 加载保存的配置
function loadConfig(): void {
  try {
    const saved = localStorage.getItem('llm-config');
    if (saved) {
      const config = JSON.parse(saved);
      // 确保provider的类型正确
      if (config.provider && ['qianwen', 'openai', 'deepseek', 'claude', 'custom'].includes(config.provider)) {
        localConfig.provider = config.provider;
      }
      if (config.apiKey) localConfig.apiKey = config.apiKey;
      if (config.baseURL) localConfig.baseURL = config.baseURL;
      if (config.model) localConfig.model = config.model;
      if (config.customApiKey) localConfig.customApiKey = config.customApiKey;
      
      // 同步到LLMService
      LLMService.setConfig(localConfig);
    }
  } catch (error) {
    console.error('加载配置失败:', error);
  }
}

// 组件挂载时加载配置
onMounted(() => {
  loadConfig();
});
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 链接样式 */
a {
  color: inherit;
  text-decoration: underline;
}

a:hover {
  color: #7c3aed;
}
</style> 