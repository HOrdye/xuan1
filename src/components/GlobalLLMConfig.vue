<template>
  <div class="global-llm-config">
    <!-- 配置按钮 -->
    <button
      @click="showModal = true"
      class="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 z-50 flex items-center justify-center"
      :class="{ 'animate-pulse': !store.isConfigured }"
    >
      <span v-if="store.isConfigured" class="text-2xl">🤖</span>
      <span v-else class="text-2xl">⚙️</span>
    </button>

    <!-- 全局状态提示 -->
    <div 
      v-if="!store.isConfigured"
      class="fixed bottom-24 right-6 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg shadow-lg text-sm z-40 max-w-xs"
    >
      配置AI服务，解锁全站智能分析
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
            <div class="p-4 rounded-xl border-2" :class="statusStyle">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" :class="statusDotClass"></div>
                <div>
                  <div class="font-semibold">{{ statusText }}</div>
                  <div class="text-sm opacity-75">{{ statusDesc }}</div>
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
                    placeholder="留空使用默认官方地址"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                  />
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                @click="saveConfig"
                :disabled="!canSave || store.isLoading"
                class="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span v-if="store.isLoading">🔄 保存中...</span>
                <span v-else>💾 保存配置</span>
              </button>
              
              <button
                @click="clearConfig"
                class="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                🗑️ 清除配置
              </button>
            </div>

            <!-- 错误信息 -->
            <div v-if="store.error" class="p-4 rounded-xl border-2 bg-red-50 border-red-200 text-red-800">
              <div class="flex items-start">
                <span class="text-2xl mr-3">❌</span>
                <div>
                  <div class="font-semibold">配置错误</div>
                  <div class="text-sm mt-1 opacity-90">{{ store.error }}</div>
                </div>
              </div>
            </div>

            <!-- 使用说明 -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <h4 class="font-semibold text-gray-800 mb-2">💡 全站AI功能</h4>
              <ul class="text-sm text-gray-700 space-y-1">
                <li>• <strong>塔罗占卜</strong>：个性化卡牌解读和人生指引</li>
                <li>• <strong>易经卦象</strong>：深度分析卦象含义和建议</li>
                <li>• <strong>今日运势</strong>：结合生辰和当日能量的运势分析</li>
                <li>• <strong>笅杯占卜</strong>：解读神明回应和指引方向</li>
                <li>• 密钥仅存储在本地，绝不上传服务器</li>
                <li>• 推荐DeepSeek：国产AI，性价比高，推理能力强</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useLLMConfigStore } from '../store/llmConfig'
import type { LLMConfig } from '../services/LLMService'

// 使用全局Store
const store = useLLMConfigStore()

// 组件状态
const showModal = ref(false)
const showApiKey = ref(false)

// 本地配置
const localConfig = reactive<LLMConfig>({
  provider: 'deepseek',
  apiKey: '',
  baseURL: '',
  model: '',
  temperature: 0.7,
  maxTokens: 4000
})

// 提供商列表
const providers = [
  {
    value: 'deepseek' as const,
    name: 'DeepSeek',
    desc: '深度求索，国产新星',
    features: '性价比高 • 推理能力强',
    icon: '🚀'
  },
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
    value: 'claude' as const,
    name: 'Claude',
    desc: 'Anthropic出品',
    features: '安全可靠 • 理解深入',
    icon: '🎭'
  },
  {
    value: 'custom' as const,
    name: '自定义API',
    desc: '支持兼容OpenAI格式的API',
    features: '灵活配置 • 自由选择',
    icon: '⚙️'
  }
]

// 计算属性
const canSave = computed(() => {
  return localConfig.apiKey.trim().length > 0
})

const statusStyle = computed(() => {
  if (store.isConfigured) {
    return 'bg-green-50 border-green-200 text-green-800'
  } else {
    return 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }
})

const statusDotClass = computed(() => {
  if (store.isConfigured) {
    return 'bg-green-500'
  } else {
    return 'bg-yellow-500'
  }
})

const statusText = computed(() => {
  return store.isConfigured ? 'AI服务已配置' : '未配置AI服务'
})

const statusDesc = computed(() => {
  if (store.isConfigured) {
    return `使用${getProviderName()}提供智能分析`
  } else {
    return '当前使用基础本地算法'
  }
})

// 工具函数
function getProviderName(): string {
  const names = {
    deepseek: 'DeepSeek',
    qianwen: '通义千问',
    openai: 'OpenAI',
    claude: 'Claude',
    custom: '自定义API'
  }
  return names[store.config.provider] || '未知'
}

function getApiKeyPlaceholder(): string {
  const placeholders = {
    deepseek: '输入DeepSeek API Key...',
    qianwen: '输入通义千问API Key...',
    openai: '输入OpenAI API Key (sk-开头)...',
    claude: '输入Claude API Key...',
    custom: '输入自定义API密钥...'
  }
  return placeholders[localConfig.provider] || '输入API Key...'
}

function getModelPlaceholder(): string {
  const placeholders = {
    deepseek: 'deepseek-chat (默认)',
    qianwen: 'qwen-plus (默认)',
    openai: 'gpt-3.5-turbo (默认)',
    claude: 'claude-3-sonnet-20240229 (默认)',
    custom: '根据API提供商要求填写'
  }
  return placeholders[localConfig.provider] || ''
}

// 操作函数
async function saveConfig() {
  try {
    await store.updateConfig(localConfig)
    showModal.value = false
    console.log('✅ 全局AI配置保存成功')
  } catch (error) {
    console.error('❌ 保存配置失败:', error)
  }
}

function clearConfig() {
  if (confirm('确定要清除所有AI配置吗？清除后将使用本地基础算法。')) {
    store.resetConfig()
    // 重置本地配置
    localConfig.provider = 'deepseek'
    localConfig.apiKey = ''
    localConfig.baseURL = ''
    localConfig.model = ''
    console.log('✅ 配置已清除')
  }
}

function loadConfig() {
  // 从store同步到本地配置
  Object.assign(localConfig, store.config)
}

// 生命周期
onMounted(async () => {
  await store.initializeFromStorage()
  loadConfig()
})
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
</style> 