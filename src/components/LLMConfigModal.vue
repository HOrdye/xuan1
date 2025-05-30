<template>
  <div v-if="show" class="llm-config-modal-overlay" @click="closeModal">
    <div class="llm-config-modal" @click.stop>
      <div class="modal-header">
        <h2>🤖 LLM API 配置</h2>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>
      
      <div class="modal-content">
        <!-- 提供商选择 -->
        <div class="form-group">
          <label for="provider">API 提供商</label>
          <select v-model="config.provider" id="provider" @change="onProviderChange">
            <option value="qianwen">通义千问 (Qwen)</option>
            <option value="deepseek">DeepSeek</option>
            <option value="openai">OpenAI</option>
            <option value="claude">Claude</option>
            <option value="custom">自定义API</option>
            <option value="local">本地</option>
          </select>
        </div>

        <!-- API密钥 -->
        <div class="form-group">
          <label for="apiKey">API 密钥</label>
          <div class="input-with-button">
            <input
              v-model="config.apiKey"
              type="password"
              id="apiKey"
              :placeholder="getApiKeyPlaceholder()"
              autocomplete="off"
            />
            <button 
              @click="toggleApiKeyVisibility" 
              class="toggle-btn"
              :title="showApiKey ? '隐藏密钥' : '显示密钥'"
            >
              {{ showApiKey ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <small class="hint">{{ getApiKeyHint() }}</small>
        </div>

        <!-- 模型选择 -->
        <div class="form-group">
          <label for="model">模型名称（可选）</label>
          <input
            v-model="config.model"
            type="text"
            id="model"
            :placeholder="getModelPlaceholder()"
          />
          <small class="hint">留空将使用默认模型</small>
        </div>

        <!-- 自定义API URL（仅当选择自定义时显示） -->
        <div v-if="config.provider === 'custom'" class="form-group">
          <label for="baseURL">API 地址</label>
          <input
            v-model="config.baseURL"
            type="url"
            id="baseURL"
            placeholder="https://api.example.com/v1/chat/completions"
          />
          <small class="hint">OpenAI兼容的API端点地址</small>
        </div>

        <!-- 测试区域 -->
        <div class="test-section">
          <h3>🧪 连接测试</h3>
          <div class="test-buttons">
            <button 
              @click="testConnection" 
              :disabled="testing || !config.apiKey"
              class="test-btn primary"
            >
              {{ testing ? '测试中...' : '测试连接' }}
            </button>
            <button 
              @click="testLLMCall" 
              :disabled="testing || !config.apiKey"
              class="test-btn"
            >
              {{ testing ? '测试中...' : '测试AI调用' }}
            </button>
          </div>
          
          <!-- 测试结果 -->
          <div v-if="testResult" class="test-result" :class="testResult.type">
            <div class="result-header">
              {{ testResult.type === 'success' ? '✅ 测试成功' : '❌ 测试失败' }}
            </div>
            <div class="result-message">{{ testResult.message }}</div>
            <div v-if="testResult.details" class="result-details">
              <details>
                <summary>详细信息</summary>
                <pre>{{ testResult.details }}</pre>
              </details>
            </div>
          </div>
        </div>

        <!-- 说明文档 -->
        <div class="docs-section">
          <details>
            <summary>📖 API密钥获取指南</summary>
            <div class="docs-content">
              <div v-if="config.provider === 'qianwen'">
                <h4>通义千问 API密钥获取：</h4>
                <ol>
                  <li>访问 <a href="https://dashscope.console.aliyun.com/" target="_blank">阿里云灵积平台</a></li>
                  <li>注册并登录账号</li>
                  <li>在控制台中创建API Key</li>
                  <li>复制API Key到上方输入框</li>
                </ol>
              </div>
              <div v-else-if="config.provider === 'deepseek'">
                <h4>DeepSeek API密钥获取：</h4>
                <ol>
                  <li>访问 <a href="https://platform.deepseek.com/" target="_blank">DeepSeek开放平台</a></li>
                  <li>注册并登录账号</li>
                  <li>在API Keys页面创建新密钥</li>
                  <li>复制API Key到上方输入框</li>
                </ol>
              </div>
              <div v-else-if="config.provider === 'openai'">
                <h4>OpenAI API密钥获取：</h4>
                <ol>
                  <li>访问 <a href="https://platform.openai.com/" target="_blank">OpenAI平台</a></li>
                  <li>注册并登录账号</li>
                  <li>在API Keys页面创建新密钥</li>
                  <li>复制API Key到上方输入框</li>
                </ol>
              </div>
              <div v-else-if="config.provider === 'claude'">
                <h4>Claude API密钥获取：</h4>
                <ol>
                  <li>访问 <a href="https://console.anthropic.com/" target="_blank">Anthropic控制台</a></li>
                  <li>注册并登录账号</li>
                  <li>在API Keys页面创建新密钥</li>
                  <li>复制API Key到上方输入框</li>
                </ol>
              </div>
            </div>
          </details>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="resetConfig" class="reset-btn">重置配置</button>
        <button @click="saveConfig" :disabled="!config.apiKey" class="save-btn">
          保存配置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { LLMService } from '../services/LLMService'
import { EnvConfigManager } from '../utils/envConfig'

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'saved'])

const testing = ref(false)
const showApiKey = ref(false)
const testResult = ref<{
  type: 'success' | 'error'
  message: string
  details?: string
} | null>(null)

const config = reactive({
  provider: 'qianwen' as 'qianwen' | 'deepseek' | 'openai' | 'claude' | 'custom' | 'local',
  apiKey: '',
  model: '',
  baseURL: ''
})

// 监听显示状态，加载当前配置
watch(() => props.show, (newVal) => {
  if (newVal) {
    loadCurrentConfig()
  }
})

function loadCurrentConfig() {
  const currentConfig = LLMService.getConfig()
  config.provider = (currentConfig.provider === 'local' ? 'qianwen' : currentConfig.provider) || 'qianwen'
  config.apiKey = currentConfig.apiKey || ''
  config.model = currentConfig.model || ''
  config.baseURL = currentConfig.baseURL || ''
}

function onProviderChange() {
  // 切换提供商时清除之前的配置
  config.model = ''
  config.baseURL = ''
  testResult.value = null
}

function getApiKeyPlaceholder() {
  switch (config.provider) {
    case 'qianwen': return 'sk-xxxxxxxx...'
    case 'deepseek': return 'sk-xxxxxxxx...'
    case 'openai': return 'sk-xxxxxxxx...'
    case 'claude': return 'sk-ant-xxxxxxxx...'
    case 'custom': return '输入自定义API的密钥'
    case 'local': return '本地API密钥'
    default: return '输入API密钥'
  }
}

function getApiKeyHint() {
  switch (config.provider) {
    case 'qianwen': return '从阿里云灵积平台获取的API Key'
    case 'deepseek': return '从DeepSeek开放平台获取的API Key'
    case 'openai': return '从OpenAI平台获取的API Key'
    case 'claude': return '从Anthropic控制台获取的API Key'
    case 'custom': return '自定义API服务的认证密钥'
    case 'local': return '本地API密钥'
    default: return ''
  }
}

function getModelPlaceholder() {
  switch (config.provider) {
    case 'qianwen': return 'qwen-plus, qwen-turbo 等'
    case 'deepseek': return 'deepseek-chat, deepseek-coder 等'
    case 'openai': return 'gpt-3.5-turbo, gpt-4 等'
    case 'claude': return 'claude-3-sonnet-20240229 等'
    case 'custom': return '根据API文档填写'
    case 'local': return '本地API模型'
    default: return ''
  }
}

function toggleApiKeyVisibility() {
  showApiKey.value = !showApiKey.value
  const input = document.getElementById('apiKey') as HTMLInputElement
  if (input) {
    input.type = showApiKey.value ? 'text' : 'password'
  }
}

async function testConnection() {
  testing.value = true
  testResult.value = null
  
  try {
    // 简单的OPTIONS请求测试连接
    const response = await fetch(`/api/${config.provider}`, {
      method: 'OPTIONS'
    })
    
    if (response.ok || response.status === 405) {
      // 405 Method Not Allowed 通常意味着端点存在但不支持OPTIONS
      testResult.value = {
        type: 'success',
        message: `${config.provider} API 连接正常`
      }
    } else {
      testResult.value = {
        type: 'error',
        message: `连接失败: ${response.status} ${response.statusText}`,
        details: `状态码: ${response.status}\n状态文本: ${response.statusText}`
      }
    }
  } catch (error) {
    testResult.value = {
      type: 'error',
      message: `连接异常: ${error}`,
      details: String(error)
    }
  } finally {
    testing.value = false
  }
}

async function testLLMCall() {
  testing.value = true
  testResult.value = null
  
  try {
    const startTime = Date.now()
    
    // 构建测试请求
    const requestBody: any = {
      messages: [
        {
          role: 'user',
          content: '请简单回答：你好'
        }
      ],
      temperature: 0.7,
      max_tokens: 50
    }
    
    // 根据不同提供商设置不同的模型参数
    switch (config.provider) {
      case 'qianwen':
        requestBody.model = config.model || 'qwen-plus'
        break
      case 'deepseek':
        requestBody.model = config.model || 'deepseek-chat'
        break
      case 'openai':
        requestBody.model = config.model || 'gpt-3.5-turbo'
        break
      case 'claude':
        requestBody.model = config.model || 'claude-3-sonnet-20240229'
        requestBody.system = '你是一个有用的助手。'
        break
      case 'custom':
        requestBody.model = config.model || 'gpt-3.5-turbo'
        break
    }
    
    const url = config.provider === 'custom' ? config.baseURL : `/api/${config.provider}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        ...(config.provider === 'claude' ? { 'anthropic-version': '2023-06-01' } : {})
      },
      body: JSON.stringify(requestBody)
    })
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    if (response.ok) {
      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || 
                     data.content?.[0]?.text || 
                     data.output?.text || 
                     '获取到响应但无法解析内容'
      
      testResult.value = {
        type: 'success',
        message: `AI调用成功 (${duration}ms)`,
        details: `响应内容: ${content}\n耗时: ${duration}ms\nToken使用: ${JSON.stringify(data.usage || {}, null, 2)}`
      }
    } else {
      const errorText = await response.text()
      testResult.value = {
        type: 'error',
        message: `AI调用失败: ${response.status} ${response.statusText}`,
        details: `状态码: ${response.status}\n错误响应: ${errorText}`
      }
    }
  } catch (error) {
    testResult.value = {
      type: 'error',
      message: `AI调用异常: ${error}`,
      details: String(error)
    }
  } finally {
    testing.value = false
  }
}

function resetConfig() {
  config.provider = 'qianwen'
  config.apiKey = ''
  config.model = ''
  config.baseURL = ''
  testResult.value = null
  EnvConfigManager.clearConfig()
}

function saveConfig() {
  // 保存到环境配置管理器
  EnvConfigManager.setConfig({
    VITE_LLM_PROVIDER: config.provider,
    VITE_LLM_API_KEY: config.apiKey,
    VITE_LLM_MODEL: config.model,
    VITE_LLM_BASE_URL: config.baseURL
  })
  
  // 更新LLM服务配置
  LLMService.setConfig({
    provider: config.provider,
    apiKey: config.apiKey,
    model: config.model,
    baseURL: config.baseURL
  })
  
  emit('saved')
  closeModal()
}

function closeModal() {
  emit('close')
}
</script>

<style scoped>
.llm-config-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.llm-config-modal {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-content {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #374151;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-with-button {
  position: relative;
}

.input-with-button input {
  padding-right: 48px;
}

.toggle-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 16px;
}

.toggle-btn:hover {
  background: #f3f4f6;
}

.hint {
  display: block;
  margin-top: 4px;
  color: #6b7280;
  font-size: 12px;
}

.test-section {
  margin: 24px 0;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.test-section h3 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 1rem;
}

.test-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.test-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.test-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.test-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.test-btn.primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.test-btn.primary:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.test-result {
  margin-top: 12px;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid #d1d5db;
}

.test-result.success {
  background: #f0fdf4;
  border-left-color: #22c55e;
}

.test-result.error {
  background: #fef2f2;
  border-left-color: #ef4444;
}

.result-header {
  font-weight: 600;
  margin-bottom: 4px;
}

.test-result.success .result-header {
  color: #15803d;
}

.test-result.error .result-header {
  color: #dc2626;
}

.result-message {
  color: #374151;
  margin-bottom: 8px;
}

.result-details {
  margin-top: 8px;
}

.result-details summary {
  cursor: pointer;
  color: #6b7280;
  font-size: 14px;
}

.result-details pre {
  margin-top: 8px;
  padding: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
}

.docs-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.docs-section summary {
  cursor: pointer;
  color: #3b82f6;
  font-weight: 500;
  margin-bottom: 12px;
}

.docs-content {
  margin-top: 12px;
  color: #374151;
}

.docs-content h4 {
  margin: 0 0 8px 0;
  color: #1f2937;
}

.docs-content ol {
  margin: 8px 0 16px 20px;
}

.docs-content a {
  color: #3b82f6;
  text-decoration: underline;
}

.docs-content a:hover {
  color: #2563eb;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 12px 12px;
}

.reset-btn,
.save-btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.reset-btn {
  background: white;
  color: #6b7280;
}

.reset-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.save-btn {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.save-btn:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style> 