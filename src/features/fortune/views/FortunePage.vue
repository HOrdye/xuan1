<template>
  <div class="fortune-page min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full filter blur-3xl"></div>
      <div class="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full filter blur-3xl"></div>
      <div class="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full filter blur-3xl"></div>
    </div>
    
    <!-- 星空背景效果 -->
    <div class="absolute inset-0 opacity-60">
      <div class="stars-animation"></div>
    </div>
    
    <!-- 页面头部 -->
    <div class="relative z-10 pt-12 pb-8">
      <div class="container mx-auto px-4">
        <div class="text-center text-white">
          <!-- 标题区域 -->
          <div class="mb-6">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4 shadow-2xl">
              <span class="text-4xl">🔮</span>
            </div>
            <h1 class="text-5xl md:text-6xl font-bold mb-4 tracking-wide bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              今日运势
            </h1>
            <p class="text-purple-100 text-xl md:text-2xl font-light">基于AI智能分析的个性化运势预测</p>
          </div>
          
          <!-- 日期信息 -->
          <div class="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <span class="text-lg mr-2">📅</span>
            <span class="text-lg font-medium">{{ currentDate }} • {{ weekDay }}</span>
          </div>
          
          <!-- 装饰线 -->
          <div class="mt-8 flex items-center justify-center">
            <div class="w-12 h-0.5 bg-gradient-to-r from-transparent to-white/50"></div>
            <div class="mx-4 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"></div>
            <div class="w-12 h-0.5 bg-gradient-to-l from-transparent to-white/50"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative z-10 container mx-auto px-4 pb-8">
      <!-- 表单卡片 -->
      <div class="max-w-2xl mx-auto mb-8">
        <div class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
          <!-- 卡片头部 -->
          <div class="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 p-8 text-white relative overflow-hidden">
            <!-- 背景装饰 -->
            <div class="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-pink-600/20"></div>
            <div class="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div class="absolute -top-4 -right-4 w-16 h-16 bg-white/5 rounded-full"></div>
            
            <div class="relative z-10 flex items-center">
              <div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                <span class="text-3xl">✨</span>
              </div>
    <div>
                <h2 class="text-2xl font-bold mb-1">个人信息填写</h2>
                <p class="text-purple-100 text-base">请填写您的基本信息，AI将为您生成专属运势分析</p>
              </div>
            </div>
          </div>
          
          <!-- 表单内容 -->
          <div class="p-8 space-y-8">
            <!-- 生日 -->
            <div class="group">
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2 text-purple-600 text-xs">🎂</span>
                生日
              </label>
              <input
                type="date"
                v-model="formData.birthDate"
                @change="watchBirthDate"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                :class="{'border-red-300 ring-red-200': showError && !formData.birthDate}"
              />
              <p v-if="showError && !formData.birthDate" class="text-red-500 text-xs mt-1 ml-8">请选择您的生日</p>
            </div>

            <!-- 性别 -->
            <div class="group">
              <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <span class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2 text-purple-600 text-xs">⚧</span>
                性别
              </label>
              <div class="flex space-x-4">
                <label class="flex items-center cursor-pointer group">
                  <div class="relative">
                    <input type="radio" v-model="formData.gender" value="male" class="sr-only" />
                    <div class="w-6 h-6 border-2 border-gray-300 rounded-full group-hover:border-blue-400 transition-colors"
                         :class="{'border-blue-500 bg-blue-500': formData.gender === 'male'}">
                      <div v-if="formData.gender === 'male'" class="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                    </div>
                  </div>
                  <span class="ml-3 text-gray-700 font-medium">👨 男性</span>
                </label>
                <label class="flex items-center cursor-pointer group">
                  <div class="relative">
                    <input type="radio" v-model="formData.gender" value="female" class="sr-only" />
                    <div class="w-6 h-6 border-2 border-gray-300 rounded-full group-hover:border-pink-400 transition-colors"
                         :class="{'border-pink-500 bg-pink-500': formData.gender === 'female'}">
                      <div v-if="formData.gender === 'female'" class="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                    </div>
                  </div>
                  <span class="ml-3 text-gray-700 font-medium">👩 女性</span>
                </label>
              </div>
            </div>

            <!-- 生肖和星座 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="group">
                <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2 text-red-600 text-xs">🐲</span>
                  生肖
                </label>
      <select 
        v-model="formData.zodiacSign"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                  :class="{'border-red-300 ring-red-200': showError && !formData.zodiacSign}"
      >
                  <option value="">请选择生肖</option>
        <option v-for="sign in zodiacSigns" :key="sign" :value="sign">{{ sign }}</option>
      </select>
                <p v-if="showError && !formData.zodiacSign" class="text-red-500 text-xs mt-1 ml-8">请选择您的生肖</p>
    </div>
              
              <div class="group">
                <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2 text-yellow-600 text-xs">⭐</span>
                  星座
                </label>
      <select 
        v-model="formData.constellation"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                  :class="{'border-red-300 ring-red-200': showError && !formData.constellation}"
      >
                  <option value="">请选择星座</option>
        <option v-for="sign in constellations" :key="sign" :value="sign">{{ sign }}</option>
      </select>
                <p v-if="showError && !formData.constellation" class="text-red-500 text-xs mt-1 ml-8">请选择您的星座</p>
              </div>
            </div>

            <!-- 特殊问题 -->
            <div class="group">
              <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 text-green-600 text-xs">💭</span>
                想要咨询的问题
                <span class="text-gray-400 text-xs ml-2">(可选)</span>
              </label>
              <textarea
                v-model="formData.question"
                placeholder="您可以输入想要了解的具体问题，比如工作发展、感情状况、健康管理、财运规划等..."
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 resize-none"
                rows="3"
              ></textarea>
            </div>

            <!-- 提交按钮 -->
            <div class="pt-4">
              <button
                @click="generateFortune"
                :disabled="loading || !isFormValid"
                class="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                <span v-if="!loading" class="flex items-center">
                  <span class="mr-2">🔮</span>
                  生成专属运势分析
                </span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ loadingText }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 运势结果卡片 -->
      <div v-if="fortuneResult" class="max-w-4xl mx-auto">
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden transition-all duration-500 transform"
             :class="{'opacity-100 translate-y-0': showResult, 'opacity-0 translate-y-4': !showResult}">
          <!-- 结果头部 -->
          <div class="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <span class="text-2xl">✨</span>
                </div>
                <div>
                  <h3 class="text-xl font-semibold">您的专属运势分析</h3>
                  <p class="text-emerald-100 text-sm">{{ formData.constellation }}座 • {{ formData.zodiacSign }}年 • {{ formData.gender === 'male' ? '男性' : '女性' }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm text-emerald-100">{{ currentDate }}</div>
                <div class="text-xs text-emerald-200">AI智能分析</div>
              </div>
            </div>
          </div>
          
          <!-- 结果内容 -->
          <div class="p-6">
            <div class="prose prose-lg max-w-none">
              <div v-html="formatFortuneResult(fortuneResult)" class="fortune-content"></div>
            </div>
            
            <!-- 分享和操作 -->
            <div class="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <button @click="shareResult" class="flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                  <span class="mr-2">📤</span>
                  分享运势
                </button>
                <button @click="saveResult" class="flex items-center px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                  <span class="mr-2">💾</span>
                  保存结果
                </button>
              </div>
              <button @click="generateAgain" class="flex items-center px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
                <span class="mr-2">🔄</span>
                重新分析
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="max-w-2xl mx-auto mt-6">
        <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <span class="text-red-400 text-xl">⚠️</span>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">运势分析失败</h3>
              <p class="text-sm text-red-600 mt-1">{{ error }}</p>
              <button @click="error = ''" class="mt-2 text-xs text-red-500 hover:text-red-700 underline">
                关闭提示
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue';
import { LLMService } from '../../../services/LLMService';

interface FortuneRequest {
  birthDate: string;
  gender: 'male' | 'female';
  zodiacSign: string;
  constellation: string;
  question: string;
}

  const zodiacSigns = [
    '鼠', '牛', '虎', '兔', '龙', '蛇', 
    '马', '羊', '猴', '鸡', '狗', '猪'
  ];
  
  const constellations = [
    '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座',
    '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'
  ];
  
  const formData = reactive<FortuneRequest>({
    birthDate: '',
    gender: 'male',
    zodiacSign: '',
    constellation: '',
    question: ''
  });

const loading = ref(false);
const fortuneResult = ref('');
const error = ref('');
const showError = ref(false);
const showResult = ref(false);
const loadingText = ref('正在分析中...');

// 获取当前日期和星期
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const weekDay = computed(() => {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return days[new Date().getDay()];
});

// 表单验证
const isFormValid = computed(() => {
  return formData.birthDate && formData.zodiacSign && formData.constellation;
});

// LLM加载状态订阅
let unsubscribeLoadingState: (() => void) | null = null;

onMounted(() => {
  unsubscribeLoadingState = LLMService.onLoadingStateChange((state) => {
    if (state.isLoading) {
      loadingText.value = state.progress;
    }
  });
});

onUnmounted(() => {
  if (unsubscribeLoadingState) {
    unsubscribeLoadingState();
  }
});
  
  // 根据生日自动填充生肖和星座
  const watchBirthDate = () => {
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      formData.zodiacSign = getZodiacSign(birthDate);
      formData.constellation = getConstellation(birthDate);
    }
  };
  
  // 根据出生日期获取生肖
  const getZodiacSign = (date: Date): string => {
    const year = date.getFullYear();
    const zodiacIndex = (year - 1900) % 12;
    return zodiacSigns[zodiacIndex];
  };
  
  // 根据出生日期获取星座
  const getConstellation = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '白羊座';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '金牛座';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '双子座';
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '巨蟹座';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '狮子座';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '处女座';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return '天秤座';
    if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return '天蝎座';
    if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return '射手座';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '摩羯座';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座';
  return '双鱼座';
};

// 生成运势
const generateFortune = async () => {
  if (!isFormValid.value) {
    showError.value = true;
    error.value = '请完整填写生日、生肖和星座信息';
    return;
  }

  loading.value = true;
  error.value = '';
  showError.value = false;
  showResult.value = false;
  fortuneResult.value = '';
  
  try {
    console.log('🔮 开始调用LLM运势分析服务...');
    
    // 调用LLM服务进行运势分析
    const result = await LLMService.getFortuneAnalysis(
      formData.birthDate,
      formData.gender,
      formData.zodiacSign,
      formData.constellation,
      formData.question
    );
    
    fortuneResult.value = result;
    
    // 延迟显示结果，增加动画效果
    setTimeout(() => {
      showResult.value = true;
    }, 300);
    
    console.log('✅ 运势分析完成');
  } catch (err) {
    console.error('❌ 运势分析失败:', err);
    error.value = '运势分析失败，请检查网络连接后重试';
  } finally {
    loading.value = false;
  }
};

// 格式化运势结果
const formatFortuneResult = (result: string): string => {
  if (!result) return '';
  
  // 将换行符转换为HTML
  let formatted = result.replace(/\n/g, '<br>');
  
  // 格式化特殊标记
  formatted = formatted.replace(/【([^】]+)】/g, '<h4 class="font-bold text-lg text-gray-800 mt-4 mb-2 flex items-center"><span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>$1</h4>');
  
  // 格式化星级评分
  formatted = formatted.replace(/★/g, '<span class="text-yellow-400">★</span>');
  formatted = formatted.replace(/☆/g, '<span class="text-gray-300">☆</span>');
  
  // 格式化emoji和特殊符号
  formatted = formatted.replace(/🌟|💫|📊|💼|💕|💰|🏃‍♀️|🎨|🔢|✨|🤔|📝/g, '<span class="text-xl mr-2">$&</span>');
  
  return formatted;
};

// 分享结果
const shareResult = () => {
  if (navigator.share) {
    navigator.share({
      title: '我的今日运势',
      text: '快来看看我的专属运势分析！',
      url: window.location.href
    });
  } else {
    // 复制到剪贴板
    navigator.clipboard.writeText(fortuneResult.value.replace(/<[^>]*>/g, ''));
    alert('运势内容已复制到剪贴板！');
  }
};

// 保存结果
const saveResult = () => {
  const blob = new Blob([fortuneResult.value.replace(/<[^>]*>/g, '')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `运势分析_${currentDate.value}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// 重新分析
const generateAgain = () => {
  fortuneResult.value = '';
  showResult.value = false;
  error.value = '';
  showError.value = false;
};
</script>

<style scoped>
.fortune-page {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* 星空动画效果 */
.stars-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, #fff, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, #fff, transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 160px 30px, #fff, transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: sparkle 20s linear infinite;
}

@keyframes sparkle {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-200px);
  }
}

/* 背景渐变色彩变化 */
.fortune-page {
  animation: colorShift 30s ease-in-out infinite;
}

@keyframes colorShift {
  0%, 100% {
    background: linear-gradient(135deg, rgb(88, 28, 135) 0%, rgb(30, 58, 138) 50%, rgb(67, 56, 202) 100%);
  }
  33% {
    background: linear-gradient(135deg, rgb(67, 56, 202) 0%, rgb(88, 28, 135) 50%, rgb(147, 51, 234) 100%);
  }
  66% {
    background: linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(126, 34, 206) 50%, rgb(88, 28, 135) 100%);
  }
}

.fortune-content :deep(h4) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #374151;
}

.fortune-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.7;
  color: #6b7280;
}

.fortune-content :deep(br) {
  margin-bottom: 0.5rem;
}

/* 动画效果 */
.group:hover label {
  transform: translateX(2px);
  transition: transform 0.2s ease;
}

/* 滚动条样式 */
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