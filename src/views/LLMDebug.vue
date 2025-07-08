<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-3xl font-bold text-center mb-8 text-purple-800">
          🔧 LLM 连接调试工具
        </h1>
        
        <!-- 当前配置显示 -->
        <div class="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">当前配置</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">提供商</label>
              <div class="p-2 bg-white rounded border">{{ currentConfig.provider }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">模型</label>
              <div class="p-2 bg-white rounded border">{{ currentConfig.model || '默认' }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">API密钥状态</label>
              <div class="p-2 bg-white rounded border flex items-center">
                <span :class="hasApiKey ? 'text-green-600' : 'text-red-600'">
                  {{ hasApiKey ? '✅ 已配置' : '❌ 未配置' }}
                </span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">基础URL</label>
              <div class="p-2 bg-white rounded border">{{ currentConfig.baseURL || '使用默认' }}</div>
            </div>
          </div>
        </div>

        <!-- 测试区域 -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">连接测试</h2>
          
          <!-- 测试输入 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-600 mb-2">测试问题</label>
            <textarea 
              v-model="testQuestion"
              class="w-full p-3 border rounded-lg resize-none"
              rows="3"
              placeholder="输入一个测试问题，比如：请解读乾卦"
            ></textarea>
          </div>

          <!-- 测试按钮 -->
          <div class="flex gap-4 mb-4">
            <button 
              @click="testConnection"
              :disabled="isLoading"
              class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {{ isLoading ? '测试中...' : '🧪 测试连接' }}
            </button>
            
            <button 
              @click="testProxies"
              :disabled="isProxyTesting"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {{ isProxyTesting ? '检测中...' : '🔍 检测代理' }}
            </button>
            
            <button 
              @click="clearResults"
              class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              🗑️ 清除结果
            </button>
          </div>

          <!-- 代理检测结果 -->
          <div v-if="proxyReport" class="mb-6 p-4 border rounded-lg bg-blue-50">
            <h3 class="text-lg font-semibold text-blue-800 mb-2">🔍 代理检测报告</h3>
            <div class="mb-3">
              <span class="font-medium">状态：</span>
              <span :class="getStatusColor(proxyReport.summary)">{{ proxyReport.summary }}</span>
            </div>
            
            <div v-if="proxyReport.recommendations.length > 0" class="mb-3">
              <strong class="text-blue-700">建议：</strong>
              <ul class="list-disc list-inside mt-1 text-sm text-blue-600">
                <li v-for="(rec, index) in proxyReport.recommendations" :key="index">{{ rec }}</li>
              </ul>
            </div>
            
            <div class="text-sm">
              <strong class="text-blue-700">详细结果：</strong>
              <div class="mt-1 space-y-1">
                <div v-for="result in proxyReport.results" :key="result.endpoint" class="flex items-center gap-2">
                  <span class="font-mono text-xs bg-blue-100 px-2 py-1 rounded">{{ result.endpoint }}</span>
                  <span :class="getStatusColor(result.status)">{{ result.status }}</span>
                  <span v-if="result.statusCode" class="text-xs text-gray-500">({{ result.statusCode }})</span>
                  <span v-if="result.responseTime" class="text-xs text-gray-500">{{ result.responseTime }}ms</span>
                  <span v-if="result.error" class="text-xs text-red-600">{{ result.error }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 结果显示 -->
          <div v-if="testResults.length > 0" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-800">测试结果</h3>
            <div 
              v-for="(result, index) in testResults" 
              :key="index"
              class="p-4 border rounded-lg"
              :class="result.success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'"
            >
              <div class="flex items-center mb-2">
                <span :class="result.success ? 'text-green-600' : 'text-red-600'" class="font-medium">
                  {{ result.success ? '✅ 成功' : '❌ 失败' }}
                </span>
                <span class="ml-2 text-sm text-gray-500">{{ result.timestamp }}</span>
              </div>
              
              <div v-if="result.error" class="mb-2">
                <strong class="text-red-600">错误:</strong>
                <code class="block mt-1 p-2 bg-red-100 text-red-800 rounded text-sm">{{ result.error }}</code>
              </div>
              
              <div v-if="result.response" class="mb-2">
                <strong class="text-green-600">响应:</strong>
                <div class="mt-1 p-2 bg-white border rounded text-sm max-h-40 overflow-y-auto">
                  {{ result.response }}
                </div>
              </div>
              
              <div v-if="result.duration" class="text-xs text-gray-500">
                耗时: {{ result.duration }}ms
              </div>
            </div>
          </div>
        </div>

        <!-- 配置指南 -->
        <div class="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 class="text-xl font-semibold mb-4 text-blue-800">🔧 配置指南</h2>
          
          <div class="space-y-4 text-sm text-blue-700">
            <div>
              <h3 class="font-semibold mb-2">如何配置LLM API密钥？</h3>
              <ol class="list-decimal list-inside space-y-1 ml-4">
                <li>在项目根目录创建 <code class="bg-blue-100 px-1 rounded">.env</code> 文件</li>
                <li>添加配置项：<code class="bg-blue-100 px-1 rounded">VITE_LLM_API_KEY=你的API密钥</code></li>
                <li>重启开发服务器：<code class="bg-blue-100 px-1 rounded">npm run dev</code></li>
              </ol>
            </div>
            
            <div>
              <h3 class="font-semibold mb-2">支持的LLM提供商</h3>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li><strong>qianwen</strong>: 阿里云通义千问 (推荐)</li>
                <li><strong>openai</strong>: OpenAI GPT系列</li>
                <li><strong>wenxin</strong>: 百度文心一言</li>
                <li><strong>claude</strong>: Anthropic Claude</li>
                <li><strong>local</strong>: 仅使用本地解读 (无需API密钥)</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold mb-2">常见问题</h3>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li>如果出现404错误，请检查API代理配置</li>
                <li>如果出现401错误，请检查API密钥是否正确</li>
                <li>如果没有API密钥，系统会自动使用本地解读</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 返回按钮 -->
        <div class="mt-8 text-center">
          <router-link to="/" class="inline-block px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
            🏠 返回首页
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { LLMService } from '../services/LLMService'
import { EnvConfigManager, type EnvConfig } from '../utils/envConfig'
import { ProxyDetector } from '../utils/proxyDetector'

// 响应式数据
const currentConfig = ref({
  provider: '',
  model: '',
  baseURL: '',
  apiKey: ''
})

const hasApiKey = ref(false)
const testQuestion = ref('请解读乾卦的基本含义')
const isLoading = ref(false)

// 配置编辑
const showConfigEdit = ref(false)
const editConfig = ref<EnvConfig>({})

// 代理检测
const isProxyTesting = ref(false)
const proxyReport = ref<{
  summary: string;
  recommendations: string[];
  results: any[];
} | null>(null)

interface TestResult {
  success: boolean
  response?: string
  error?: string
  timestamp: string
  duration?: number
}

const testResults = ref<TestResult[]>([])

// 获取当前配置
function getCurrentConfig() {
  const config = LLMService.getConfig()
  currentConfig.value = {
    provider: config.provider,
    model: config.model || '',
    baseURL: config.baseURL || '',
    apiKey: config.apiKey || ''
  }
  hasApiKey.value = !!config.apiKey
}

// 开始编辑配置
function _startEditConfig() {
  const runtimeConfig = EnvConfigManager.getConfig()
  editConfig.value = {
    VITE_LLM_PROVIDER: runtimeConfig.VITE_LLM_PROVIDER || 'qianwen',
    VITE_LLM_API_KEY: runtimeConfig.VITE_LLM_API_KEY || '',
    VITE_LLM_BASE_URL: runtimeConfig.VITE_LLM_BASE_URL || '',
    VITE_LLM_MODEL: runtimeConfig.VITE_LLM_MODEL || 'qwen-plus'
  }
  showConfigEdit.value = true
}

// 保存配置
function _saveConfig() {
  EnvConfigManager.setConfig(editConfig.value)
  
  // 更新LLMService配置
  LLMService.setConfig({
    provider: editConfig.value.VITE_LLM_PROVIDER as any,
    apiKey: editConfig.value.VITE_LLM_API_KEY,
    baseURL: editConfig.value.VITE_LLM_BASE_URL,
    model: editConfig.value.VITE_LLM_MODEL
  })
  
  getCurrentConfig()
  showConfigEdit.value = false
  
  alert('配置已保存！')
}

// 取消编辑
function _cancelEdit() {
  showConfigEdit.value = false
  editConfig.value = {}
}

// 清除配置
function _clearConfig() {
  if (confirm('确定要清除所有配置吗？')) {
    EnvConfigManager.clearConfig()
    getCurrentConfig()
    alert('配置已清除！')
  }
}

// 测试连接
async function testConnection() {
  if (!testQuestion.value.trim()) {
    alert('请输入测试问题')
    return
  }

  isLoading.value = true
  const startTime = Date.now()

  try {
    console.log('🧪 开始测试LLM连接...')
    
    // 创建测试用的卦象数据
    const testHexagram = {
      sequence: 1,
      number: 1,
      name: 'qian',
      symbol: '☰',
      chineseName: '乾',
      description: '乾为天，纯阳之卦',
      lines: [1, 1, 1, 1, 1, 1],
      judgment: '乾：元，亨，利，贞。',
      meaning: '刚健',
      modernInterpretation: '积极进取，自强不息',
      nature: '刚健中正',
      yao_texts: ['初九：潜龙勿用。', '九二：见龙在田，利见大人。', '九三：君子终日乾乾，夕惕若厉，无咎。', '九四：或跃在渊，无咎。', '九五：飞龙在天，利见大人。', '上九：亢龙有悔。'],
      trigrams: { upper: 'qian', lower: 'qian' }
    }

    const response = await LLMService.getHexagramInterpretation(
      testHexagram,
      [],
      null,
      testQuestion.value
    )

    const duration = Date.now() - startTime

    testResults.value.unshift({
      success: true,
      response,
      timestamp: new Date().toLocaleString(),
      duration
    })

    console.log('✅ LLM连接测试成功')
  } catch (error) {
    const duration = Date.now() - startTime

    testResults.value.unshift({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toLocaleString(),
      duration
    })

    console.error('❌ LLM连接测试失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 清除结果
function clearResults() {
  testResults.value = []
}

// 获取状态颜色
function getStatusColor(status: string): string {
  if (status.includes('✅') || status === 'success') {
    return 'text-green-600'
  } else if (status.includes('⚠️') || status === 'timeout') {
    return 'text-yellow-600'
  } else if (status.includes('❌') || status === 'error') {
    return 'text-red-600'
  }
  return 'text-gray-600'
}

// 代理检测
async function testProxies() {
  isProxyTesting.value = true
  proxyReport.value = null
  
  try {
    console.log('🔍 开始代理检测...')
    const report = await ProxyDetector.getDiagnosticReport()
    proxyReport.value = report
    console.log('📊 代理检测完成:', report)
  } catch (error) {
    console.error('❌ 代理检测失败:', error)
    proxyReport.value = {
      summary: '❌ 代理检测失败',
      recommendations: ['检查网络连接', '重新启动开发服务器'],
      results: []
    }
  } finally {
    isProxyTesting.value = false
  }
}

// 页面挂载时获取配置
onMounted(() => {
  getCurrentConfig()
})
</script> 