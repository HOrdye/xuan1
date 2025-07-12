<template>
  <div class="global-llm-config">
    <!-- Configuration Button -->
    <button
      @click="store.openModal()"
      class="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 z-50 flex items-center justify-center"
      :class="{ 'animate-pulse': !store.isConfigured }"
    >
      <span v-if="store.isConfigured" class="text-2xl">🤖</span>
      <span v-else class="text-2xl">⚙️</span>
    </button>

    <!-- Configuration Modal -->
    <teleport to="body">
      <div
        v-if="store.isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="store.closeModal()"
      >
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl z-10">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold">AI智能服务配置</h2>
                <p class="text-purple-100 mt-1">一次配置，全站使用</p>
              </div>
              <button @click="store.closeModal()" class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <span class="text-2xl">×</span>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-6">
            <!-- Provider Selection -->
            <div class="space-y-3">
              <label class="block text-lg font-semibold text-gray-800">选择AI服务提供商</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-for="provider in providers"
                  :key="provider.value"
                  @click="selectProvider(provider.value)"
                  class="p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
                  :class="localConfig.provider === provider.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'"
                >
                  <div class="font-semibold text-gray-800">{{ provider.name }}</div>
                  <div class="text-sm text-gray-600">{{ provider.desc }}</div>
                </div>
              </div>
            </div>
            
            <!-- Custom API Fields (Conditional) -->
            <div v-if="localConfig.provider === 'custom'" class="p-4 border-2 border-purple-200 bg-purple-50 rounded-xl space-y-4">
               <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">自定义API地址 (必填)</label>
                  <input
                    v-model="localConfig.baseURL"
                    @input="handleInput"
                    type="url"
                    placeholder="例如: https://api.example.com/v1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">模型名称 (可选)</label>
                  <input
                    v-model="localConfig.model"
                    @input="handleInput"
                    type="text"
                    placeholder="留空则使用服务商默认模型"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
            </div>

            <!-- API Key Input & Validation -->
            <div class="space-y-3">
              <label class="block text-lg font-semibold text-gray-800">API密钥配置</label>
              <div class="flex items-stretch gap-2">
                <div class="relative flex-grow">
                  <input
                    v-model="localConfig.apiKey"
                    @input="handleInput"
                    :type="showApiKey ? 'text' : 'password'"
                    placeholder="在此输入您的API密钥"
                    class="w-full h-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 transition-all pr-12"
                  />
                  <button @click="showApiKey = !showApiKey" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <span class="text-2xl">👁️</span>
                  </button>
                </div>
                <button
                  @click="validateAndTest"
                  :disabled="store.validationStatus === 'loading' || !localConfig.apiKey"
                  class="px-5 py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="store.validationStatus === 'loading'">验证中...</span>
                  <span v-else>验证连接</span>
                </button>
              </div>
            </div>

            <!-- Validation Status -->
            <div v-if="store.validationStatus !== 'idle'" class="p-3 rounded-xl border text-center text-sm">
                <div v-if="store.validationStatus === 'success'" class="text-green-700 bg-green-50 border-green-200 p-2 rounded-lg">
                    ✅ 连接成功！您的配置已验证，可以保存了。
                </div>
                <div v-if="store.validationStatus === 'error'" class="text-red-700 bg-red-50 border-red-200 p-2 rounded-lg">
                    ❌ 验证失败: {{ store.validationError }}
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t">
              <button
                @click="saveConfig"
                :disabled="store.validationStatus !== 'success' || store.isLoading"
                class="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="store.isLoading">保存中...</span>
                <span v-else>💾 保存配置</span>
              </button>
              
              <button
                @click="clearConfig"
                class="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                🗑️ 清除所有配置
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useLLMConfigStore } from '../store/llmConfig'
import type { LLMConfig } from '../services/LLMService'

const store = useLLMConfigStore()
const showApiKey = ref(false)

const providers = [
  { value: 'deepseek', name: 'DeepSeek', desc: '高性价比，强大的国产AI' },
  { value: 'openai', name: 'OpenAI', desc: 'ChatGPT背后的全球领先技术' },
  { value: 'claude', name: 'Claude', desc: 'Anthropic出品，安全可靠' },
  { value: 'custom', name: '自定义API', desc: '支持兼容OpenAI接口的任何服务' }
]

const localConfig = reactive<LLMConfig>({
  provider: 'deepseek',
  apiKey: '',
  baseURL: '',
  model: '',
  temperature: 0.7,
  maxTokens: 4000
});

watch(() => store.isModalOpen, (isOpen) => {
  if (isOpen) {
    Object.assign(localConfig, store.config);
    store.resetValidationStatus();
  }
});

function handleInput() {
  store.resetValidationStatus();
}

function selectProvider(provider: string) {
    localConfig.provider = provider as LLMConfig['provider'];
    handleInput(); // Also reset validation on provider change
}

async function validateAndTest() {
  await store.validateCurrentConfig(localConfig);
}

async function saveConfig() {
  await store.updateConfig(localConfig);
  if (!store.error) {
    store.closeModal();
  }
}

function clearConfig() {
  if (confirm('确定要清除所有AI配置吗？此操作不可逆。')) {
    store.resetConfig();
    Object.assign(localConfig, store.config);
  }
}
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