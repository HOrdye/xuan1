import { defineStore } from 'pinia'
import { LLMService, type LLMConfig } from '../services/LLMService'

export interface LLMConfigState {
  config: LLMConfig
  isConfigured: boolean
  lastUpdated: Date | null
  isLoading: boolean
  error: string | null
}

export const useLLMConfigStore = defineStore('llmConfig', {
  state: (): LLMConfigState => ({
    config: LLMService.getConfig(),
    isConfigured: false,
    lastUpdated: null,
    isLoading: false,
    error: null
  }),
  
  getters: {
    hasApiKey: (state) => !!state.config.apiKey,
    providerName: (state) => state.config.provider,
    canUseAI: (state) => {
      return !!(state.config.apiKey && state.config.provider)
    },
    configStatus: (state) => {
      if (state.isLoading) return 'loading'
      if (state.error) return 'error'
      if (state.config.apiKey && state.config.provider) return 'configured'
      return 'unconfigured'
    }
  },
  
  actions: {
    async updateConfig(newConfig: Partial<LLMConfig>) {
      this.isLoading = true
      this.error = null
      
      try {
        // 更新本地状态
        this.config = { ...this.config, ...newConfig }
        this.lastUpdated = new Date()
        
        // 同步到LLMService
        LLMService.setConfig(this.config)
        
        // 手动保存到localStorage
        this.saveToStorage()
        
        // 简化：直接基于配置完整性设置状态
        this.isConfigured = !!(this.config.apiKey && this.config.provider)
        
        // 广播配置更新事件
        this.broadcastConfigUpdate()
        
        console.log('✅ LLM配置更新成功:', {
          provider: this.config.provider,
          hasApiKey: this.hasApiKey,
          isConfigured: this.isConfigured,
          canUseAI: this.canUseAI
        })
      } catch (error) {
        this.error = error instanceof Error ? error.message : '配置更新失败'
        console.error('❌ LLM配置更新失败:', error)
      } finally {
        this.isLoading = false
      }
    },
    
    // 简化验证逻辑，确保与Store状态判断一致
    async validateConfig(): Promise<boolean> {
      return !!(this.config.apiKey && this.config.provider)
    },
    
    broadcastConfigUpdate() {
      // 触发全局配置更新事件
      window.dispatchEvent(new CustomEvent('llm-config-updated', {
        detail: { 
          config: this.config, 
          timestamp: this.lastUpdated,
          isConfigured: this.isConfigured,
          canUseAI: this.canUseAI
        }
      }))
    },
    
    resetConfig() {
      this.config = {
        provider: 'deepseek',
        apiKey: '',
        baseURL: '',
        model: 'deepseek-chat',
        temperature: 0.7,
        maxTokens: 4000
      }
      this.isConfigured = false
      this.lastUpdated = null
      this.error = null
      
      // 同步到LLMService
      LLMService.setConfig(this.config)
      this.saveToStorage()
      this.broadcastConfigUpdate()
    },
    
    saveToStorage() {
      try {
        const storeData = {
          config: this.config,
          isConfigured: this.isConfigured,
          lastUpdated: this.lastUpdated
        }
        localStorage.setItem('llm-config-store', JSON.stringify(storeData))
      } catch (error) {
        console.warn('⚠️ 保存LLM配置到存储失败:', error)
      }
    },
    
    async initializeFromStorage() {
      try {
        // 从localStorage初始化配置
        const savedData = localStorage.getItem('llm-config-store')
        if (savedData) {
          const parsed = JSON.parse(savedData)
          if (parsed.config) {
            this.config = parsed.config
            // 重新计算配置状态，确保一致性
            this.isConfigured = !!(this.config.apiKey && this.config.provider)
            this.lastUpdated = parsed.lastUpdated ? new Date(parsed.lastUpdated) : null
            
            // 同步到LLMService
            LLMService.setConfig(this.config)
            this.broadcastConfigUpdate()
            
            console.log('🔄 从存储初始化LLM配置:', {
              provider: this.config.provider,
              hasApiKey: this.hasApiKey,
              isConfigured: this.isConfigured,
              canUseAI: this.canUseAI
            })
          }
        }
      } catch (error) {
        console.warn('⚠️ 从存储初始化LLM配置失败:', error)
      }
    }
  }
}) 