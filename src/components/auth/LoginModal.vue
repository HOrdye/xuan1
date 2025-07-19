<template>
  <transition name="modal-fade">
    <div 
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="relative w-full max-w-md mx-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <!-- Close Button -->
        <button 
          @click="closeModal" 
          class="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-10"
        >
          ✕
        </button>

        <!-- Header -->
        <div class="p-6 border-b border-white/10">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-white mb-2">
              {{ isLoginMode ? '欢迎回来' : '创建账户' }}
            </h2>
            <p class="text-gray-400 text-sm">
              {{ isLoginMode ? '登录您的天玄账户，继续探索命运' : '加入天玄，开启玄学之旅' }}
            </p>
          </div>
        </div>

        <!-- Form Content -->
        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Email Input -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                邮箱地址
              </label>
              <input
                v-model="formData.email"
                type="email"
                required
                class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-gray-700/70 transition-all"
                placeholder="请输入您的邮箱"
                :disabled="isLoading"
              />
            </div>

            <!-- Username Input (Register only) -->
            <div v-if="!isLoginMode">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                用户名 (可选)
              </label>
              <input
                v-model="formData.username"
                type="text"
                class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-gray-700/70 transition-all"
                placeholder="请输入用户名"
                :disabled="isLoading"
              />
            </div>

            <!-- Password Input -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                密码
              </label>
              <div class="relative">
                <input
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-gray-700/70 transition-all"
                  placeholder="请输入密码"
                  :disabled="isLoading"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  tabindex="-1"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <!-- Confirm Password Input (Register only) -->
            <div v-if="!isLoginMode">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                确认密码
              </label>
              <input
                v-model="formData.confirmPassword"
                type="password"
                required
                class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-gray-700/70 transition-all"
                placeholder="请再次输入密码"
                :disabled="isLoading"
              />
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-500/20 border border-red-500/40 rounded-lg p-3">
              <p class="text-red-300 text-sm">{{ errorMessage }}</p>
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="bg-green-500/20 border border-green-500/40 rounded-lg p-3">
              <p class="text-green-300 text-sm">{{ successMessage }}</p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

          <!-- Mode Switch -->
          <div class="mt-6 text-center">
            <p class="text-gray-400 text-sm">
              {{ isLoginMode ? '还没有账户？' : '已有账户？' }}
              <button
                @click="toggleMode"
                class="text-purple-400 hover:text-purple-300 font-medium transition-colors ml-1"
                :disabled="isLoading"
              >
                {{ isLoginMode ? '立即注册' : '登录' }}
              </button>
            </p>
          </div>

          <!-- Forgot Password (Login only) -->
          <div v-if="isLoginMode" class="mt-4 text-center">
            <button
              @click="handleForgotPassword"
              class="text-gray-400 hover:text-purple-300 text-sm transition-colors"
              :disabled="isLoading"
            >
              忘记密码？
            </button>
          </div>
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
 * 处理忘记密码
 */
const handleForgotPassword = async () => {
  if (!formData.value.email) {
    errorMessage.value = '请先输入邮箱地址';
    return;
  }

  if (!AuthService.validateEmail(formData.value.email)) {
    errorMessage.value = '请输入有效的邮箱地址';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const result = await AuthService.resetPassword(formData.value.email);
    
    if (result.success) {
      successMessage.value = result.message || '重置邮件已发送';
    } else {
      errorMessage.value = result.message || '发送失败';
    }
  } catch (error: any) {
    console.error('❌ 密码重置异常:', error);
    errorMessage.value = '发送重置邮件失败';
  } finally {
    isLoading.value = false;
  }
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