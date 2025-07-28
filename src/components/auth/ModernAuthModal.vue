<template>
  <transition name="modal-fade">
    <div 
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="relative w-full max-w-4xl mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        <!-- 关闭按钮 -->
        <button 
          @click="closeModal" 
          class="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-all z-10"
        >
          ✕
        </button>

        <!-- 左侧表单区域 -->
        <div class="w-full md:w-1/2 p-8 lg:p-12">
          <div class="max-w-sm mx-auto">
            <!-- 标题 -->
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-900 mb-2">
                {{ isLoginMode ? '欢迎回来' : '欢迎使用天玄Web' }}
              </h2>
              <p class="text-gray-600">
                {{ isLoginMode ? '登录您的账户，继续探索命运' : '加入天玄，开启玄学之旅' }}
              </p>
            </div>

            <!-- 第三方登录选项 -->
            <div class="space-y-3 mb-6">
              <!-- 微信登录 -->
              <button 
                @click="handleThirdPartyLogin('wechat')"
                class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
                :disabled="isLoading"
              >
                <div class="w-5 h-5 mr-3 bg-green-500 rounded flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.974 8.245c-.275-.027-.55-.027-.825 0-2.768.275-4.95 2.64-4.95 5.508 0 .138.028.275.055.412-3.85-.413-6.892-3.713-6.892-7.84 0-4.4 3.713-7.978 8.25-7.978 4.263 0 7.7 3.163 8.087 7.288-.247-.22-.494-.413-.725-.55zm-6.6 7.84c-.275 0-.55-.027-.825-.055-2.768-.275-4.95-2.64-4.95-5.508 0-.137.028-.275.055-.412 3.85.413 6.892 3.713 6.892 7.84 0 4.4-3.713 7.978-8.25 7.978-4.263 0-7.7-3.163-8.087-7.288.247.22.494.413.725.55 2.768-.275 4.95-2.64 4.95-5.508"/>
                  </svg>
                </div>
                <span class="text-gray-700 font-medium">使用微信登录</span>
              </button>

              <!-- 支付宝登录 -->
              <button 
                @click="handleThirdPartyLogin('alipay')"
                class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
                :disabled="isLoading"
              >
                <div class="w-5 h-5 mr-3 bg-blue-500 rounded flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span class="text-gray-700 font-medium">使用支付宝登录</span>
              </button>

              <!-- 抖音登录 -->
              <button 
                @click="handleThirdPartyLogin('douyin')"
                class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
                :disabled="isLoading"
              >
                <div class="w-5 h-5 mr-3 bg-black rounded flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </div>
                <span class="text-gray-700 font-medium">使用抖音登录</span>
              </button>
            </div>

            <!-- 分割线 -->
            <div class="relative mb-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">或</span>
              </div>
            </div>

            <!-- 邮箱登录表单 -->
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- 邮箱输入 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  邮箱地址
                </label>
                <input
                  v-model="formData.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="请输入您的邮箱"
                  :disabled="isLoading"
                />
              </div>

              <!-- 用户名输入 (仅注册时显示) -->
              <div v-if="!isLoginMode">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  用户名 (可选)
                </label>
                <input
                  v-model="formData.username"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="请输入用户名"
                  :disabled="isLoading"
                />
              </div>

              <!-- 密码输入 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  密码
                </label>
                <div class="relative">
                  <input
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="请输入密码"
                    :disabled="isLoading"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabindex="-1"
                  >
                    {{ showPassword ? '🙈' : '👁️' }}
                  </button>
                </div>
              </div>

              <!-- 确认密码输入 (仅注册时显示) -->
              <div v-if="!isLoginMode">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  确认密码
                </label>
                <input
                  v-model="formData.confirmPassword"
                  type="password"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="请再次输入密码"
                  :disabled="isLoading"
                />
              </div>

              <!-- 错误和成功消息 -->
              <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-3">
                <p class="text-red-600 text-sm">{{ errorMessage }}</p>
              </div>

              <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-3">
                <p class="text-green-600 text-sm">{{ successMessage }}</p>
              </div>

              <!-- 提交按钮 -->
              <button
                type="submit"
                :disabled="isLoading || !isFormValid"
                class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isLoading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </span>
                <span v-else>
                  {{ isLoginMode ? '登录' : '注册' }}
                </span>
              </button>
            </form>

            <!-- 模式切换 -->
            <div class="mt-6 text-center">
              <p class="text-gray-600 text-sm">
                {{ isLoginMode ? '还没有账户？' : '已有账户？' }}
                <button
                  @click="toggleMode"
                  class="text-purple-600 hover:text-purple-500 font-medium transition-colors ml-1"
                  :disabled="isLoading"
                >
                  {{ isLoginMode ? '立即注册' : '登录' }}
                </button>
              </p>
            </div>

            <!-- 使用邮件登录按钮 -->
            <div class="mt-4 text-center">
              <button
                @click="handleEmailLogin"
                class="text-gray-500 hover:text-purple-600 text-sm transition-colors"
                :disabled="isLoading"
              >
                使用邮件登录
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧装饰区域 -->
        <div class="hidden md:block md:w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 relative overflow-hidden">
          <!-- 装饰元素 -->
          <div class="absolute inset-0 bg-black bg-opacity-20"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center text-white px-8">
              <div class="w-20 h-20 mx-auto mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold mb-4">天玄Web</h3>
              <p class="text-lg opacity-90 mb-6">您的专属网页版玄学决策助手</p>
              <div class="space-y-3 text-left">
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span>专业塔罗牌解读</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span>六爻占卜预测</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span>个性化运势分析</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 装饰图案 -->
          <div class="absolute top-10 right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
          <div class="absolute bottom-10 left-10 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useUserStore } from '../../store/userStore';
import AuthService from '../../core/services/authService';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'success']);

const userStore = useUserStore();

// 表单状态
const isLoginMode = ref(true);
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// 表单数据
const formData = ref({
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
});

// 表单验证
const isFormValid = computed(() => {
  const emailValid = AuthService.validateEmail(formData.value.email);
  const passwordValid = AuthService.validatePassword(formData.value.password).isValid;
  
  if (isLoginMode.value) {
    return emailValid && passwordValid;
  } else {
    const confirmPasswordValid = formData.value.password === formData.value.confirmPassword;
    return emailValid && passwordValid && confirmPasswordValid;
  }
});

// 监听模式切换，清空表单
watch(isLoginMode, () => {
  resetForm();
});

// 监听弹窗开关，重置状态
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    resetForm();
  }
});

/**
 * 重置表单
 */
const resetForm = () => {
  formData.value = {
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  };
  errorMessage.value = '';
  successMessage.value = '';
  showPassword.value = false;
};

/**
 * 切换登录/注册模式
 */
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
};

/**
 * 关闭模态框
 */
const closeModal = () => {
  if (!isLoading.value) {
    emit('close');
  }
};

/**
 * 处理表单提交
 */
const handleSubmit = async () => {
  if (!isFormValid.value || isLoading.value) return;

  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    if (isLoginMode.value) {
      // 登录
      const result = await userStore.signIn(formData.value.email, formData.value.password);
      
      if (result.success) {
        successMessage.value = result.message || '登录成功！';
        setTimeout(() => {
          emit('success', { type: 'login', user: result.data });
          closeModal();
        }, 1000);
      } else {
        errorMessage.value = result.message || '登录失败';
      }
    } else {
      // 注册
      const result = await userStore.signUp(
        formData.value.email,
        formData.value.password,
        formData.value.confirmPassword,
        formData.value.username
      );
      
      if (result.success) {
        successMessage.value = result.message || '注册成功！';
        setTimeout(() => {
          emit('success', { type: 'register', user: result.data });
          closeModal();
        }, 1500);
      } else {
        errorMessage.value = result.message || '注册失败';
      }
    }
  } catch (error: any) {
    console.error('❌ 表单提交异常:', error);
    errorMessage.value = '操作失败，请稍后重试';
  } finally {
    isLoading.value = false;
  }
};

/**
 * 处理第三方登录
 */
const handleThirdPartyLogin = (provider: 'wechat' | 'alipay' | 'douyin') => {
  errorMessage.value = '';
  
  const providerNames = {
    wechat: '微信',
    alipay: '支付宝',
    douyin: '抖音'
  };
  
  // 显示开发中提示
  errorMessage.value = `${providerNames[provider]}登录功能正在开发中，敬请期待！`;
  
  console.log(`尝试使用 ${providerNames[provider]} 登录`);
  
  // TODO: 实现第三方登录逻辑
  // 这里需要与对应平台的OAuth API集成
};

/**
 * 处理邮件登录
 */
const handleEmailLogin = () => {
  // 显示邮箱登录表单（当前已经显示）
  console.log('切换到邮箱登录模式');
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* 自定义滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.7);
}
</style>
