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

            <!-- 分析模式选择 -->
            <div class="group">
              <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <span class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-blue-600 text-xs">🤖</span>
                分析模式
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="flex items-center cursor-pointer group">
                  <div class="relative">
                    <input type="radio" v-model="analysisMode" value="ai" class="sr-only" />
                    <div class="w-6 h-6 border-2 border-gray-300 rounded-full group-hover:border-blue-400 transition-colors"
                         :class="{'border-blue-500 bg-blue-500': analysisMode === 'ai'}">
                      <div v-if="analysisMode === 'ai'" class="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                    </div>
                  </div>
                  <div class="ml-3">
                    <span class="text-gray-700 font-medium">🤖 AI智能分析</span>
                    <p class="text-xs text-gray-500">深度个性化分析，内容更丰富</p>
                  </div>
                </label>
                <label class="flex items-center cursor-pointer group">
                  <div class="relative">
                    <input type="radio" v-model="analysisMode" value="quick" class="sr-only" />
                    <div class="w-6 h-6 border-2 border-gray-300 rounded-full group-hover:border-green-400 transition-colors"
                         :class="{'border-green-500 bg-green-500': analysisMode === 'quick'}">
                      <div v-if="analysisMode === 'quick'" class="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                    </div>
                  </div>
                  <div class="ml-3">
                    <span class="text-gray-700 font-medium">⚡ 快速分析</span>
                    <p class="text-xs text-gray-500">基础运势分析，速度更快</p>
                  </div>
                </label>
              </div>
              
              <!-- API配置提示 -->
              <div v-if="analysisMode === 'ai'" class="mt-4 p-4 rounded-lg border"
                   :class="apiConfigStatus.isConfigured ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'">
                <div class="flex items-start">
                  <span class="mr-2" :class="apiConfigStatus.isConfigured ? 'text-green-500' : 'text-blue-500'">
                    {{ apiConfigStatus.isConfigured ? '✅' : 'ℹ️' }}
                  </span>
                  <div>
                    <p class="text-sm font-medium" 
                       :class="apiConfigStatus.isConfigured ? 'text-green-700' : 'text-blue-700'">
                      {{ apiConfigStatus.isConfigured ? 'AI智能分析已就绪' : 'AI智能分析说明' }}
                    </p>
                    <p v-if="apiConfigStatus.isConfigured" class="text-xs text-green-600 mt-1">
                      当前使用：{{ apiConfigStatus.provider.toUpperCase() }} 服务，将为您提供深度个性化分析。
                    </p>
                    <p v-else class="text-xs text-blue-600 mt-1">
                      首次使用AI分析功能，需要在全局设置中配置LLM API密钥。如未配置，系统将自动使用传统命理学分析。
                    </p>
                    <p v-if="!apiConfigStatus.isConfigured" class="text-xs text-blue-500 mt-2">
                      <strong>配置方法：</strong>点击页面右下角的AI配置按钮进行设置。
                    </p>
                  </div>
                </div>
              </div>
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

      <!-- 运势结果区域 -->
      <div v-if="fortune && !loading" class="max-w-6xl mx-auto">
        <!-- 挑战和机遇卡片 -->
        <div v-if="fortune.dailyChallenge || fortune.dailyOpportunity" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FortuneChallenge
            v-if="fortune.dailyChallenge"
            :type="fortune.dailyChallenge.type"
            :content="fortune.dailyChallenge.content"
            :tips="fortune.dailyChallenge.tips"
            :difficulty="fortune.dailyChallenge.difficulty || 'easy'"
            :is-unlocked="fortune.dailyChallenge.isUnlocked || false"
            @unlock="handleUnlock('challenge')"
          />
          <FortuneChallenge
            v-if="fortune.dailyOpportunity"
            :type="fortune.dailyOpportunity.type"
            :content="fortune.dailyOpportunity.content"
            :tips="fortune.dailyOpportunity.tips"
            :difficulty="fortune.dailyOpportunity.difficulty || 'easy'"
            :is-unlocked="fortune.dailyOpportunity.isUnlocked || false"
            @unlock="handleUnlock('opportunity')"
          />
        </div>

        <!-- 运势信笺展示 -->
        <div ref="fortuneCardRef" class="mb-8">
          <FortuneEnvelope 
            :recipient-name="recipientName"
            :envelope-color="envelopeColor"
            :seal-symbol="sealSymbol"
            :stamp-text="stampText"
            :pattern="envelopePattern"
            @opened="onEnvelopeOpened"
            @reset="onEnvelopeReset"
          >
            <template #content>
              <FortuneLetterContent :fortune="fortune" />
            </template>
          </FortuneEnvelope>
        </div>
        
        <!-- Action Buttons -->
        <div class="mt-6 flex justify-center items-center space-x-4">
          <SaveButton
            :item="{ type: 'fortune', question: formData.question, result: fortune }"
            :title="`今日运势 - ${fortune.date}`"
          />
          <button
            @click="isSharePanelOpen = true"
            class="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
            aria-label="分享运势结果"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
          <button
            @click="resetForm"
            class="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
          >
            重新占卜
          </button>
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
    <SharePanel
      :is-open="isSharePanelOpen"
      :target-ref="fortuneCardRef"
      :share-data="{
        title: `今日运势 - ${fortune?.date || ''}`,
        text: `我在天玄Web获得了今日运势解读！`,
        hashtags: ['今日运势', '天玄Web', '玄学助手']
      }"
      @close="isSharePanelOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { useFortune } from '../composables/useFortune';
import { useUserStore } from '../../../store/userStore';
import FortuneCard from '../components/FortuneCard.vue';
import FortuneChallenge from '../components/FortuneChallenge.vue';
import FortuneEnvelope from '../components/FortuneEnvelope.vue';
import FortuneLetterContent from '../components/FortuneLetterContent.vue';
import SaveButton from '../../../components/common/SaveButton.vue';
import SharePanel from '../../../components/common/SharePanel.vue';
import type { PersonalizedFortuneData } from '../types/fortune';
import { LLMService } from '../../../services/LLMService';
import { UserInfoSharingService } from '../../../services/UserInfoSharingService';

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

const { fortune, loading, error, generate, reset } = useFortune();
const userStore = useUserStore();

const fortuneCardRef = ref<HTMLElement | null>(null);
const isSharePanelOpen = ref(false);
const showError = ref(false);
const loadingText = ref('正在分析中...');
const analysisMode = ref<'ai' | 'quick'>('ai');

// 信笺相关状态
const isEnvelopeOpened = ref(false);

// 信笺个性化配置
const recipientName = computed(() => {
  if (userStore.isAuthenticated && userStore.currentUser) {
    return userStore.currentUser.user_metadata?.username || '亲爱的朋友';
  }
  return '亲爱的朋友';
});

const envelopeColor = computed(() => {
  const colors = ['purple', 'blue', 'pink', 'green', 'gold'];
  const index = new Date().getDate() % colors.length;
  return colors[index] as 'purple' | 'blue' | 'pink' | 'green' | 'gold';
});

const sealSymbol = computed(() => {
  const symbols = ['✨', '🌟', '💫', '⭐', '🔮'];
  const index = new Date().getHours() % symbols.length;
  return symbols[index];
});

const stampText = computed(() => {
  return `天玄运势 ${new Date().getFullYear()}`;
});

const envelopePattern = computed(() => {
  const patterns = ['stars', 'flowers', 'geometric', 'none'];
  const index = new Date().getDay() % patterns.length;
  return patterns[index] as 'stars' | 'flowers' | 'geometric' | 'none';
});

// 信笺事件处理
const onEnvelopeOpened = () => {
  isEnvelopeOpened.value = true;
  console.log('🎉 信笺已拆封');
};

const onEnvelopeReset = () => {
  isEnvelopeOpened.value = false;
  console.log('🔄 信笺已重新封装');
};

// 检查API配置状态
const apiConfigStatus = computed(() => {
  const currentConfig = LLMService.getConfig();
  const hasApiKey = currentConfig && currentConfig.apiKey && currentConfig.apiKey.trim() !== '';
  
  return {
    hasApiKey,
    provider: currentConfig?.provider || 'unknown',
    isConfigured: hasApiKey
  };
});

// 从用户资料填充信息
const fillFromUserProfile = () => {
  if (userStore.isAuthenticated && userStore.currentUser) {
    const metadata = userStore.currentUser.user_metadata as any || {};
    
    // 填充生日
    if (metadata.birthday && !formData.birthDate) {
      formData.birthDate = metadata.birthday;
      watchBirthDate(); // 自动填充生肖和星座
    }
    
    // 填充性别
    if (metadata.gender && !formData.gender) {
      formData.gender = metadata.gender;
    }
    
    console.log('✅ 已从用户资料填充信息:', {
      birthday: metadata.birthday,
      gender: metadata.gender
    });
  }
};

// 加载全局LLM配置
onMounted(() => {
  console.log('🔧 运势模块初始化，加载全局LLM配置...');
  
  // 从localStorage加载全局配置
  const savedConfig = localStorage.getItem('llm-config');
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig);
      console.log('📄 找到全局LLM配置:', config);
      
      // 更新LLMService配置
      LLMService.setConfig({
        provider: config.provider,
        apiKey: config.apiKey,
        baseURL: config.baseURL,
        model: config.model
      });
      
      console.log('✅ 全局LLM配置已加载到运势模块');
    } catch (error) {
      console.warn('⚠️ 解析全局LLM配置失败:', error);
    }
  } else {
    console.log('📭 未找到全局LLM配置');
  }
  
  // 从用户资料填充信息
  fillFromUserProfile();
});

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

  // 如果选择AI模式，提示用户API配置状态
  if (analysisMode.value === 'ai') {
    console.log('🤖 选择了AI智能分析模式');
    
    // 检查LLMService的当前配置
    const currentConfig = LLMService.getConfig();
    const hasApiKey = currentConfig && currentConfig.apiKey && currentConfig.apiKey.trim() !== '';
    
    console.log('🔍 检查API配置:', { 
      provider: currentConfig?.provider, 
      hasApiKey: !!hasApiKey,
      apiKeyLength: hasApiKey ? currentConfig.apiKey?.length : 0
    });
    
    if (!hasApiKey) {
      console.warn('⚠️ 未配置LLM API密钥，将使用本地分析');
      loadingText.value = '未配置AI密钥，使用传统命理学分析...';
    } else {
      console.log('✅ 检测到API密钥，将使用AI分析');
      loadingText.value = `正在调用${currentConfig?.provider || 'AI'}进行深度分析...`;
    }
  } else {
    loadingText.value = '正在进行快速运势分析...';
  }

  showError.value = false;
  
  try {
    console.log('🔮 开始生成运势...');
    console.log('📋 表单数据:', formData);
    console.log('🎯 分析模式:', analysisMode.value);
    
    // 构建个性化数据，包含完整的zodiac和constellation信息
    const personalData: PersonalizedFortuneData = {
      birthDate: new Date(formData.birthDate),
      gender: formData.gender,
      question: formData.question || undefined,
      zodiac: {
        sign: formData.zodiacSign,
        element: '未知',
        luckyColor: '未知'
      },
      constellation: {
        name: formData.constellation,
        element: '未知',
        luckyColor: '未知',
        traits: [],
        characteristics: '',
        advice: ''
      }
    };
    
    console.log('📝 个性化数据:', personalData);
    console.log('🎯 开始调用 useFortune.generate...');
    
    // 收集用户信息到共享服务
    UserInfoSharingService.collectFromFortune(personalData);
    console.log('📊 用户信息已收集到共享服务');
    
    await generate(personalData, analysisMode.value === 'ai');
    
    console.log('✅ 运势生成完成，fortune:', fortune.value);
  } catch (err: any) {
    console.error('❌ 运势分析失败:', err);
    if (analysisMode.value === 'ai' && err.message && err.message.includes('API')) {
      error.value = `AI分析失败: ${err.message}。建议尝试快速分析模式或配置API密钥。`;
    } else {
      error.value = `运势分析失败: ${err.message || '未知错误'}`;
    }
  }
};

// 处理解锁事件
const handleUnlock = (type: 'challenge' | 'opportunity') => {
  if (!fortune.value) return;
  
  // 添加解锁成功的反馈
  const unlockMessage = type === 'challenge' ? '挑战解锁成功！' : '机遇解锁成功！';
  console.log('🎉', unlockMessage);
  
  // 更新解锁状态
  if (type === 'challenge' && fortune.value.dailyChallenge) {
    fortune.value.dailyChallenge.isUnlocked = true;
  } else if (type === 'opportunity' && fortune.value.dailyOpportunity) {
    fortune.value.dailyOpportunity.isUnlocked = true;
  }
  
  // 可以在这里添加更多解锁后的逻辑，比如保存到本地存储
  const unlockData = {
    type,
    timestamp: new Date().toISOString(),
    date: fortune.value.date
  };
  
  // 保存解锁记录到本地存储
  const existingUnlocks = JSON.parse(localStorage.getItem('fortune-unlocks') || '[]');
  existingUnlocks.push(unlockData);
  localStorage.setItem('fortune-unlocks', JSON.stringify(existingUnlocks));
};

// 重置表单
const resetForm = () => {
  formData.birthDate = '';
  formData.gender = 'male';
  formData.zodiacSign = '';
  formData.constellation = '';
  formData.question = '';
  showError.value = false;
  error.value = '';
  loadingText.value = '正在分析中...';
  analysisMode.value = 'ai';
  reset(); // 调用useFortune的reset
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