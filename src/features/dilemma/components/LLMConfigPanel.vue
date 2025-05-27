<template>
  <div class="llm-config-panel bg-white rounded-xl p-6 shadow-sm">
    <h3 class="text-lg font-medium text-gray-800 mb-4">AI解读配置</h3>
    
    <!-- 配置状态 -->
    <div class="mb-4 p-3 rounded-lg" :class="isConfigured ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'">
      <div class="flex items-center">
        <div class="w-2 h-2 rounded-full mr-2" :class="isConfigured ? 'bg-green-500' : 'bg-yellow-500'"></div>
        <span class="text-sm" :class="isConfigured ? 'text-green-700' : 'text-yellow-700'">
          {{ isConfigured ? 'AI解读已启用' : '未配置AI解读，当前使用本地基础解读' }}
        </span>
      </div>
    </div>
    
    <!-- 展开/收起配置 -->
    <button 
      @click="showConfig = !showConfig" 
      class="w-full text-left flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
    >
      <span class="text-sm font-medium text-gray-700">
        {{ showConfig ? '收起配置' : '展开AI配置' }}
      </span>
      <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showConfig }" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
    
    <!-- 配置表单 -->
    <div v-if="showConfig" class="mt-4 space-y-4">
      <!-- 提供商选择 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">AI服务提供商</label>
        <select v-model="localConfig.provider" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
          <option value="qianwen">通义千问 (推荐)</option>
          <option value="openai">OpenAI (ChatGPT)</option>
          <option value="wenxin">文心一言 (百度)</option>
          <option value="claude">Claude (Anthropic)</option>
        </select>
      </div>
      
      <!-- API密钥输入 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">API密钥</label>
        <div class="relative">
          <input 
            v-model="localConfig.apiKey" 
            :type="showApiKey ? 'text' : 'password'"
            :placeholder="getApiKeyPlaceholder()"
            class="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
          <button 
            @click="showApiKey = !showApiKey"
            class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <svg v-if="showApiKey" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <!-- 配置说明 -->
        <div class="mt-2 text-xs text-gray-600">
          <div v-if="localConfig.provider === 'wenxin'" class="p-2 bg-yellow-50 border border-yellow-200 rounded">
            <strong>文心一言特别说明：</strong>需要API Key和Secret Key，格式：<code class="bg-gray-100 px-1 rounded">api_key:secret_key</code>
          </div>
          <div v-else-if="localConfig.provider === 'qianwen'" class="p-2 bg-blue-50 border border-blue-200 rounded">
            <strong>通义千问：</strong>使用阿里云DashScope的API Key即可
          </div>
          <div v-else-if="localConfig.provider === 'openai'" class="p-2 bg-green-50 border border-green-200 rounded">
            <strong>OpenAI：</strong>使用以sk-开头的API Key
          </div>
          <div v-else-if="localConfig.provider === 'claude'" class="p-2 bg-purple-50 border border-purple-200 rounded">
            <strong>Claude：</strong>使用Anthropic提供的API Key
          </div>
        </div>
      </div>
      
      <!-- 高级配置 -->
      <details class="border border-gray-200 rounded-lg">
        <summary class="p-3 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-50">
          高级配置 (可选)
        </summary>
        <div class="p-3 border-t border-gray-200 space-y-3">
          <!-- 自定义API地址 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">自定义API地址</label>
            <input 
              v-model="localConfig.baseURL" 
              type="url"
              placeholder="默认使用官方API地址"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
          </div>
          
          <!-- 模型选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">模型</label>
            <input 
              v-model="localConfig.model" 
              type="text"
              :placeholder="getModelPlaceholder()"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
          </div>
        </div>
      </details>
      
      <!-- 保存按钮 -->
      <div class="flex space-x-3">
        <button 
          @click="saveConfig" 
          class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium"
          :disabled="!localConfig.apiKey.trim()"
        >
          保存配置
        </button>
        <button 
          @click="testConfig" 
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          :disabled="!localConfig.apiKey.trim() || isTesting"
        >
          <span v-if="isTesting">测试中...</span>
          <span v-else>测试连接</span>
        </button>
      </div>
      
      <!-- 测试结果 -->
      <div v-if="testResult" class="p-3 rounded-lg" :class="testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
        <div class="flex items-start">
          <svg v-if="testResult.success" class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div>
            <div class="font-medium">{{ testResult.success ? '连接成功' : '连接失败' }}</div>
            <div class="text-sm mt-1">{{ testResult.message }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 说明文字 -->
    <div class="mt-4 p-3 bg-blue-50 rounded-lg">
      <div class="text-sm text-blue-700">
        <div class="font-medium mb-1">说明：</div>
        <ul class="space-y-1 text-xs">
          <li>• 配置AI密钥后，将获得更专业、个性化的卦象解读</li>
          <li>• 密钥仅存储在本地浏览器，不会上传到服务器</li>
          <li>• 推荐使用通义千问，性价比高且稳定</li>
          <li>• 不配置密钥时使用基础本地解读</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { LLMService } from '../../../services/LLMService';

// 组件状态
const showConfig = ref(false);
const showApiKey = ref(false);
const isTesting = ref(false);

// 本地配置
const localConfig = reactive({
  provider: 'qianwen' as 'qianwen' | 'openai' | 'wenxin' | 'claude',
  apiKey: '',
  baseURL: '',
  model: ''
});

// 测试结果
const testResult = ref<{
  success: boolean;
  message: string;
} | null>(null);

// 是否已配置
const isConfigured = computed(() => {
  return localConfig.apiKey.trim().length > 0;
});

// 获取模型占位符
function getModelPlaceholder(): string {
  const placeholders = {
    qianwen: 'qwen-plus (默认)',
    openai: 'gpt-3.5-turbo (默认)',
    wenxin: 'ernie-3.5-8k (默认)',
    claude: 'claude-3-sonnet-20240229 (默认)'
  };
  return placeholders[localConfig.provider] || '';
}

// 获取API密钥占位符
function getApiKeyPlaceholder(): string {
  const placeholders: Record<string, string> = {
    qianwen: '输入你的DashScope API密钥',
    openai: '输入你的OpenAI API密钥（sk-开头）',
    wenxin: '格式：api_key:secret_key',
    claude: '输入你的Anthropic API密钥'
  };
  return placeholders[localConfig.provider] || '输入你的API密钥';
}

// 保存配置
function saveConfig() {
  // 保存到localStorage
  const config = {
    provider: localConfig.provider,
    apiKey: localConfig.apiKey,
    baseURL: localConfig.baseURL,
    model: localConfig.model
  };
  
  localStorage.setItem('llm_config', JSON.stringify(config));
  
  // 更新LLMService配置
  LLMService.setConfig(config);
  
  // 显示成功消息
  testResult.value = {
    success: true,
    message: '配置已保存，现在可以享受AI智能解读了！'
  };
  
  // 3秒后清除消息
  setTimeout(() => {
    testResult.value = null;
  }, 3000);
}

// 测试连接
async function testConfig() {
  if (isTesting.value) return;
  
  isTesting.value = true;
  testResult.value = null;
  
  try {
    // 临时设置配置进行测试
    const tempConfig = {
      provider: localConfig.provider,
      apiKey: localConfig.apiKey,
      baseURL: localConfig.baseURL,
      model: localConfig.model
    };
    
    LLMService.setConfig(tempConfig);
    
    // 创建一个简单的测试卦象
    const testHexagram = {
      name: '乾',
      chineseName: '乾',
      sequence: 1,
      lines: [1, 1, 1, 1, 1, 1],
      judgment: '元亨利贞',
      description: '乾为天',
      meaning: '刚健中正'
    };
    
    // 调用API进行测试
    const result = await LLMService.getHexagramInterpretation(
      testHexagram as any,
      [],
      null,
      '这是一个API连接测试'
    );
    
    if (result && !result.includes('※ 当前使用本地解读')) {
      testResult.value = {
        success: true,
        message: 'API连接成功！可以正常使用AI解读功能。'
      };
    } else {
      testResult.value = {
        success: false,
        message: 'API可能未正确配置，请检查密钥和设置。'
      };
    }
  } catch (error) {
    testResult.value = {
      success: false,
      message: `连接失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  } finally {
    isTesting.value = false;
  }
}

// 加载保存的配置
function loadConfig() {
  try {
    const saved = localStorage.getItem('llm_config');
    if (saved) {
      const config = JSON.parse(saved);
      Object.assign(localConfig, config);
      LLMService.setConfig(config);
    }
  } catch (error) {
    console.error('加载LLM配置失败:', error);
  }
}

// 组件挂载时加载配置
onMounted(() => {
  loadConfig();
});
</script>

<style scoped>
/* 添加一些自定义样式 */
.rotate-180 {
  transform: rotate(180deg);
}
</style> 