<template>
  <div class="p-4 pb-20">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">六十四卦占卜</h1>
      <p class="text-sm text-gray-600 mt-2">选择一种传统占卜方法来获取卦象指引</p>
    </div>


    <!-- 占卜方法选择 -->
    <div v-if="!divinationStarted" class="bg-white rounded-xl p-4 mb-6 shadow-sm">
      <h3 class="text-gray-800 font-medium mb-4">选择占卜方法</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 铜钱占卜法 -->
        <div 
          @click="selectMethod('coin')" 
          class="border rounded-lg p-4 transition cursor-pointer hover:shadow-md"
          :class="{'border-primary bg-primary/5': selectedMethod === 'coin', 'border-gray-200': selectedMethod !== 'coin'}"
        >
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-2">
              <span class="text-primary text-lg">钱</span>
            </div>
            <h4 class="font-medium">易经铜钱占卜法</h4>
          </div>
          <p class="text-sm text-gray-600">使用三枚铜钱模拟传统蓍草起卦法，最传统的占卜方式</p>
        </div>
        
        <!-- 梅花易数法 -->
        <div 
          @click="selectMethod('plumBlossom')" 
          class="border rounded-lg p-4 transition cursor-pointer hover:shadow-md"
          :class="{'border-primary bg-primary/5': selectedMethod === 'plumBlossom', 'border-gray-200': selectedMethod !== 'plumBlossom'}"
        >
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-2">
              <span class="text-primary text-lg">梅</span>
            </div>
            <h4 class="font-medium">梅花易数法</h4>
          </div>
          <p class="text-sm text-gray-600">基于时间或数字起卦，是传统数术与易学结合的精妙方法</p>
        </div>
        
        <!-- 随机起卦法 -->
        <div 
          @click="selectMethod('random')" 
          class="border rounded-lg p-4 transition cursor-pointer hover:shadow-md"
          :class="{'border-primary bg-primary/5': selectedMethod === 'random', 'border-gray-200': selectedMethod !== 'random'}"
        >
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-2">
              <span class="text-primary text-lg">简</span>
            </div>
            <h4 class="font-medium">随机起卦法</h4>
          </div>
          <p class="text-sm text-gray-600">简化的现代方法，随机生成卦象，快速获得指引</p>
        </div>
      </div>
    </div>
    
    <!-- 占卜问题输入 -->
    <div v-if="selectedMethod && !divinationStarted" class="bg-white rounded-xl p-4 mb-6 shadow-sm">
      <h3 class="text-gray-800 font-medium mb-4">明确你的问题</h3>
      
      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-2">请输入你的问题</label>
        <input 
          v-model="question" 
          type="text" 
          placeholder="例如：我是否应该换工作？" 
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
        >
      </div>
      
      <!-- 梅花易数特有的输入 -->
      <div v-if="selectedMethod === 'plumBlossom'" class="mb-4">
        <div class="mb-3">
          <label class="block text-sm text-gray-600 mb-2">起卦方式</label>
          <div class="flex">
            <label class="mr-4">
              <input type="radio" v-model="plumBlossomParams.method" value="time" class="mr-1">
              时间起卦
            </label>
            <label>
              <input type="radio" v-model="plumBlossomParams.method" value="number" class="mr-1">
              数字起卦
            </label>
          </div>
        </div>
        
        <!-- 数字起卦输入 -->
        <div v-if="plumBlossomParams.method === 'number'" class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-600 mb-2">第一个数字</label>
            <input 
              v-model.number="plumBlossomParams.numbers[0]" 
              type="number" 
              placeholder="输入数字" 
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
            >
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-2">第二个数字</label>
            <input 
              v-model.number="plumBlossomParams.numbers[1]" 
              type="number" 
              placeholder="输入数字" 
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
            >
          </div>
        </div>
      </div>
      
      <button 
        @click="startDivination" 
        class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition"
        :disabled="!canStartDivination || isLoading"
      >
        <span v-if="isLoading">
          <span class="inline-block animate-spin mr-2">⟳</span>占卜中...
        </span>
        <span v-else>开始占卜</span>
      </button>
    </div>
    
    <!-- 铜钱占卜动画 -->
    <div v-if="divinationStarted && selectedMethod === 'coin' && coinResults && !showFinalResult">
      <CoinDivinationAnimation 
        :results="coinResults.coins" 
        :complete="coinAnimationComplete"
        @next-step="handleNextCoinStep"
        @complete="handleCoinAnimationComplete"
      />
    </div>
    
    <!-- 占卜结果容器 -->
    <div v-if="showFinalResult && divinationResult">
      <DivinationResult 
        :result="divinationResult" 
        :method="selectedMethod!"
        :question="question"
        @restart="restartDivination"
      />
    </div>

    <!-- LLM加载指示器 -->
    <LLMLoadingIndicator
      :isLoading="isGenerating"
      :progress="loadingProgress" 
      :stage="loadingStage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { DivinationMethod, PlumBlossomParams, AnalysisResult, SixCoinsResult, PlumBlossomResult, Hexagram } from '../types';
import { coinDivination, plumBlossomDivination, randomDivination } from '../utils/divinationMethods';
import CoinDivinationAnimation from '../components/CoinDivinationAnimation.vue';
import DivinationResult from '../components/DivinationResult.vue';
import LLMConfigPanel from '../components/LLMConfigPanel.vue';
import { generateHexagramFromLines } from '../utils/hexagramGenerator';
import { LLMService } from '../../../services/LLMService';
import LLMLoadingIndicator from '../../../components/LLMLoadingIndicator.vue';

// 选择的占卜方法
const selectedMethod = ref<DivinationMethod | null>(null);

// 获取路由信息
const route = useRoute();

// 根据URL参数自动选择占卜方法
onMounted(() => {
  const methodParam = route.query.method as string | undefined;
  if (methodParam === 'plumBlossom') {
    selectMethod('plumBlossom');
  } else if (methodParam === 'random') {
    selectMethod('random');
  } else if (methodParam === 'coin') {
    selectMethod('coin');
  }
  
  // 订阅LLMService的加载状态变化
  const unsubscribeFn = LLMService.onLoadingStateChange((state) => {
    console.log('🔄 收到LLM状态变化:', state);
    isGenerating.value = state.isLoading;
    loadingProgress.value = state.progress;
    loadingStage.value = state.stage;
    
    // 添加完成状态处理
    if (state.stage === 'completed') {
      isGenerating.value = false;
      loadingProgress.value = '';
    }
  });
  unsubscribeFromLLM = unsubscribeFn as unknown as UnsubscribeFn;
});

onUnmounted(() => {
  if (unsubscribeFromLLM) {
    unsubscribeFromLLM();
  }
});

// 问题输入
const question = ref('');

// 梅花易数参数
const plumBlossomParams = reactive<PlumBlossomParams>({
  method: 'time',
  numbers: [1, 1]
});

// 占卜状态
const isLoading = ref(false);
const divinationStarted = ref(false);
const showFinalResult = ref(false);

// LLM加载状态
const isGenerating = ref(false);
const loadingProgress = ref('');
const loadingStage = ref<'preparing' | 'calling' | 'processing' | 'completed' | 'error'>('preparing');

// 订阅LLM服务的加载状态
let unsubscribeFromLLM: (() => void) | null = null;

// 显式声明取消订阅函数类型
type UnsubscribeFn = () => void;

// 占卜结果
const divinationResult = ref<AnalysisResult | null>(null);

// 铜钱占卜相关状态
const coinResults = ref<SixCoinsResult | null>(null);
const coinAnimationComplete = ref(false);

// 梅花易数结果
const plumBlossomResult = ref<PlumBlossomResult | null>(null);

// 选择占卜方法
function selectMethod(method: DivinationMethod) {
  selectedMethod.value = method;
}

// 检查是否可以开始占卜
const canStartDivination = computed(() => {
  if (!question.value.trim()) return false;
  if (selectedMethod.value === 'plumBlossom' && plumBlossomParams.method === 'number') {
    // 确保numbers数组存在并且两个元素都大于0
    return plumBlossomParams.numbers && 
           plumBlossomParams.numbers[0] > 0 && 
           plumBlossomParams.numbers[1] > 0;
  }
  return true;
});

// 开始占卜
async function startDivination() {
  if (!canStartDivination.value || isLoading.value || !selectedMethod.value) return;
  
  try {
    isLoading.value = true;
    divinationStarted.value = true;
    
    // 根据选择的方法进行占卜
    switch (selectedMethod.value) {
      case 'coin':
        const coinResult = await coinDivination();
        console.log('Coin Divination - coinResult:', JSON.parse(JSON.stringify(coinResult)));
        
        if (!coinResult || !coinResult.hexagram) {
          throw new Error('铜钱占卜结果无效');
        }

        const changingLinesCoin = coinResult.results.map((val, idx) => (val === 6 || val === 9) ? idx : -1).filter(idx => idx !== -1);
        
        // 计算变卦
        let relatedHexagram: Hexagram | null = null;
        if (changingLinesCoin.length > 0) {
          try {
          const newLines = [...coinResult.hexagram.lines];
          changingLinesCoin.forEach(line => {
            newLines[line] = newLines[line] === 1 ? 0 : 1;
          });
            const temp = await generateHexagramFromLines(newLines);
          if (temp) relatedHexagram = temp;
          } catch (err) {
            console.error('计算变卦失败:', err);
            // 继续执行，不影响主要流程
          }
        }
        
        try {
          // 使用LLM服务获取解读内容 (修复参数格式)
          const analysis = await LLMService.getHexagramInterpretation(
            coinResult.hexagram,
            changingLinesCoin,
            relatedHexagram,
            question.value
          );
          
          // 确保LLM返回有效结果
          if (!analysis) {
            throw new Error('AI解读返回空结果');
          }
          
          divinationResult.value = {
            hexagram: coinResult.hexagram,
            changingLines: changingLinesCoin,
            relatedHexagram,
            analysis: analysis,
            question: question.value,
            method: 'coin',
            results: coinResult.results
          };
        } catch (llmError) {
          console.error('LLM解读失败:', llmError);
          // 创建明确的错误状态结果
          divinationResult.value = {
            hexagram: coinResult.hexagram,
            changingLines: changingLinesCoin,
            relatedHexagram,
            analysis: {
              title: '解读失败',
              summary: 'AI服务暂时无法提供解读，请稍后再试',
              detailed: `错误信息: ${llmError instanceof Error ? llmError.message : String(llmError)}`,
              advice: '您可以尝试重新占卜或检查网络连接',
              changingLinesAnalysis: []
            },
            question: question.value,
            method: 'coin',
            results: coinResult.results
          };
          // 确保重置加载状态
          isGenerating.value = false;
          loadingProgress.value = '';
          loadingStage.value = 'preparing';
        }
        
        coinResults.value = coinResult;
        showFinalResult.value = true;
        break;
        
      case 'plumBlossom':
        const plumResult = await plumBlossomDivination(plumBlossomParams);
        
        if (!plumResult || !plumResult.hexagram) {
          throw new Error('梅花易数结果无效');
        }
        
        try {
          // 使用LLM服务获取解读内容 (修复参数格式)
          const plumAnalysis = await LLMService.getHexagramInterpretation(
            plumResult.hexagram,
            [], // 梅花易数没有变爻
            null,
            question.value
          );
          
          // 确保LLM返回有效结果
          if (!plumAnalysis) {
            throw new Error('AI解读返回空结果');
          }
          
          divinationResult.value = {
            hexagram: plumResult.hexagram,
            changingLines: [],
            relatedHexagram: null,
            analysis: plumAnalysis,
            question: question.value,
            method: 'plumBlossom'
          };
        } catch (llmError) {
          console.error('LLM解读失败:', llmError);
          // 创建明确的错误状态结果
          divinationResult.value = {
            hexagram: plumResult.hexagram,
            changingLines: [],
            relatedHexagram: null,
            analysis: {
              title: '解读失败',
              summary: 'AI服务暂时无法提供解读，请稍后再试',
              detailed: `错误信息: ${llmError instanceof Error ? llmError.message : String(llmError)}`,
              advice: '您可以尝试重新占卜或检查网络连接',
              changingLinesAnalysis: []
            },
            question: question.value,
            method: 'plumBlossom'
          };
          // 确保重置加载状态
          isGenerating.value = false;
          loadingProgress.value = '';
          loadingStage.value = 'preparing';
        }
        
        plumBlossomResult.value = plumResult;
        // 直接显示结果
        showFinalResult.value = true;
        break;
        
      case 'random':
        const randomResult = await randomDivination(question.value);
        
        if (!randomResult || !randomResult.hexagram) {
          throw new Error('随机起卦结果无效');
        }
        
        divinationResult.value = randomResult;
        // 直接显示结果
        showFinalResult.value = true;
        break;
    }
    
  } catch (error) {
    console.error('占卜错误:', error);
    alert(`占卜失败: ${error instanceof Error ? error.message : String(error)}`);
    restartDivination();
  } finally {
    isLoading.value = false;
    // 确保重置所有加载状态
    isGenerating.value = false;
    loadingProgress.value = '';
    loadingStage.value = 'preparing';
  }
}

// 处理铜钱动画的下一步
function handleNextCoinStep() {
  // 铜钱动画的下一步逻辑
  console.log('铜钱动画下一步');
}

// 处理铜钱动画完成
function handleCoinAnimationComplete() {
  coinAnimationComplete.value = true;
  // 显示最终结果
  showFinalResult.value = true;
}

// 重新开始占卜
function restartDivination() {
  // 重置所有状态
  divinationStarted.value = false;
  showFinalResult.value = false;
  coinAnimationComplete.value = false;
  divinationResult.value = null;
  coinResults.value = null;
  plumBlossomResult.value = null;
  question.value = '';
  selectedMethod.value = null;
}
</script>

<style scoped>
/* 可以添加一些与古籍主题相关的样式 */
.dev-controls {
  @apply mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600;
}

.test-animation-btn {
  @apply px-4 py-2 bg-purple-600 text-white rounded-lg font-medium 
         hover:bg-purple-700 transition-colors duration-200
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.test-animation-btn:disabled {
  @apply bg-gray-500;
}
</style>
