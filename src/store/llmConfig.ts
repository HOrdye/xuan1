import { defineStore } from 'pinia'
import { LLMService, type LLMConfig } from '../services/LLMService'
import { EnvConfigManager } from '../utils/envConfig'

export interface LLMConfigState {
  config: LLMConfig
  isConfigured: boolean
  isModalOpen: boolean
  validationStatus: 'idle' | 'loading' | 'success' | 'error';
  validationError: string | null;
  lastUpdated: Date | null
  isLoading: boolean // For saving operation
  error: string | null
}

export const useLLMConfigStore = defineStore('llmConfig', {
  state: (): LLMConfigState => ({
    config: LLMService.getConfig(),
    isConfigured: false,
    isModalOpen: false,
    validationStatus: 'idle',
    validationError: null,
    lastUpdated: null,
    isLoading: false,
    error: null
  }),
  
  getters: {
    hasApiKey: (state) => !!state.config.apiKey,
    providerName: (state) => state.config.provider,
    canUseAI: (state) => !!(state.config.apiKey && state.config.provider),
    configStatus: (state) => {
      if (state.isLoading) return 'loading'
      if (state.error) return 'error'
      if (state.isConfigured) return 'configured'
      return 'unconfigured'
    }
  },
  
  actions: {
    openModal() {
      this.isModalOpen = true;
    },

    closeModal() {
      this.isModalOpen = false;
    },

    resetValidationStatus() {
      this.validationStatus = 'idle';
      this.validationError = null;
    },

    async validateCurrentConfig(configToValidate: LLMConfig) {
      this.validationStatus = 'loading';
      this.validationError = null;
      try {
        const result = await LLMService.testConnection(configToValidate);
        if (result.success) {
          this.validationStatus = 'success';
        } else {
          this.validationStatus = 'error';
          this.validationError = result.error || 'An unknown validation error occurred.';
        }
      } catch (error) {
        this.validationStatus = 'error';
        this.validationError = error instanceof Error ? error.message : 'A client-side error occurred during validation.';
      }
    },

    async updateConfig(newConfig: Partial<LLMConfig>) {
      this.isLoading = true
      this.error = null
      
      try {
        this.config = { ...this.config, ...newConfig }
        this.lastUpdated = new Date()
        
        // 同时更新LLMService和EnvConfigManager，确保配置同步
        LLMService.setConfig(this.config)
        EnvConfigManager.setConfig({
          VITE_LLM_PROVIDER: this.config.provider,
          VITE_LLM_API_KEY: this.config.apiKey,
          VITE_LLM_BASE_URL: this.config.baseURL,
          VITE_LLM_MODEL: this.config.model
        })
        
        this.saveToStorage()
        this.isConfigured = !!(this.config.apiKey && this.config.provider)
        this.broadcastConfigUpdate()
        
        console.log('✅ LLM config updated and saved.', {
          provider: this.config.provider,
          isConfigured: this.isConfigured,
        })
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update config'
        console.error('❌ LLM config update failed:', error)
      } finally {
        this.isLoading = false
      }
    },
    
    broadcastConfigUpdate() {
      window.dispatchEvent(new CustomEvent('llm-config-updated', {
        detail: { 
          config: this.config, 
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
      this.validationStatus = 'idle';
      this.validationError = null;
      
      // 同时清除LLMService和EnvConfigManager的配置
      LLMService.setConfig(this.config)
      EnvConfigManager.clearConfig()
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
        console.warn('⚠️ Failed to save LLM config to storage:', error)
      }
    },
    
    async initializeFromStorage() {
      try {
        const savedData = localStorage.getItem('llm-config-store')
        if (savedData) {
          const parsed = JSON.parse(savedData)
          if (parsed.config) {
            this.config = { ...this.config, ...parsed.config };
            this.isConfigured = !!(this.config.apiKey && this.config.provider);
            this.lastUpdated = parsed.lastUpdated ? new Date(parsed.lastUpdated) : null;
            
            // 同时初始化LLMService和EnvConfigManager
            LLMService.setConfig(this.config)
            EnvConfigManager.setConfig({
              VITE_LLM_PROVIDER: this.config.provider,
              VITE_LLM_API_KEY: this.config.apiKey,
              VITE_LLM_BASE_URL: this.config.baseURL,
              VITE_LLM_MODEL: this.config.model
            })
            this.broadcastConfigUpdate()
            
            console.log('🔄 Initialized LLM config from storage.')
          }
        }
      } catch (error) {
        console.warn('⚠️ Failed to initialize LLM config from storage:', error)
      }
    }
  }
}) 