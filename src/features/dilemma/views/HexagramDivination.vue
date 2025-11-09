<template>
  <div class="divination-page min-h-screen relative overflow-hidden">
    <!-- 动态星空背景 -->
    <div class="cosmic-background">
      <div class="stars-layer"></div>
      <div class="nebula-layer"></div>
      <div class="energy-particles"></div>
    </div>
    
    <!-- 页面内容 -->
    <div class="relative z-10 p-4 pb-20">
      <!-- 页面标题区域 -->
      <div class="hero-section mb-8">
        <div class="title-container">
          <h1 class="main-title">
            <span class="title-icon">🔮</span>
            <span class="title-text">待我掐指一算</span>
          </h1>
          <p class="subtitle">两种传统占卜方式，仪式感满满<br>让古老的智慧为你的困惑指点迷津</p>
          <div class="title-decoration">
            <div class="decoration-line"></div>
            <div class="decoration-symbol">☯</div>
            <div class="decoration-line"></div>
          </div>
        </div>
      </div>

      <!-- 占卜方法选择 -->
      <div v-if="!divinationStarted" class="method-selection-container">
        <div class="section-header">
          <h3 class="section-title">Pick Your Magic</h3>
          <p class="section-description">选择你喜欢的占卜方式，每种都有独特的玄学能量</p>
        </div>
        
        <div class="methods-grid">
          <!-- 铜钱占卜法 -->
          <div 
            @click="selectMethod('coin')" 
            class="method-card"
            :class="{'method-card-active': selectedMethod === 'coin'}"
          >
            <div class="method-icon">
              <div class="icon-container">
                <span class="icon-symbol">钱</span>
                <div class="icon-glow"></div>
              </div>
            </div>
            <div class="method-content">
              <h4 class="method-title">铜钱占卜法</h4>
              <p class="method-description">三枚铜钱，六次投掷，最传统的起卦方式<br>适合重要决策，仪式感拉满</p>
              <div class="method-features">
                <span class="feature-tag">传统</span>
                <span class="feature-tag">仪式感</span>
                <span class="feature-tag">精准</span>
              </div>
            </div>
            <div class="method-indicator">
              <div class="indicator-dot"></div>
            </div>
          </div>
          
          <!-- 梅花易数法 -->
          <div 
            @click="selectMethod('plumBlossom')" 
            class="method-card"
            :class="{'method-card-active': selectedMethod === 'plumBlossom'}"
          >
            <div class="method-icon">
              <div class="icon-container">
                <span class="icon-symbol">梅</span>
                <div class="icon-glow"></div>
              </div>
            </div>
            <div class="method-content">
              <h4 class="method-title">梅花易数法</h4>
              <p class="method-description">时间+数字的玄学组合<br>数术与易学的完美融合，精妙绝伦</p>
              <div class="method-features">
                <span class="feature-tag">数术</span>
                <span class="feature-tag">时间</span>
                <span class="feature-tag">精妙</span>
              </div>
            </div>
            <div class="method-indicator">
              <div class="indicator-dot"></div>
            </div>
          </div>
          
        </div>
      </div>
      
      <!-- 占卜问题输入 -->
      <div v-if="selectedMethod && !divinationStarted" class="question-input-container">
        <div class="section-header">
          <h3 class="section-title">说出你的困惑</h3>
          <p class="section-description">把问题说清楚，玄学才能给你精准答案</p>
        </div>
        
        <div class="input-section">
          <div class="input-group">
            <label class="input-label">你的困惑是什么？</label>
            <div class="input-wrapper">
              <input 
                v-model="question" 
                type="text" 
                placeholder="比如：我该不该跳槽？今晚吃什么？要不要表白？" 
                class="question-input"
              >
              <div class="input-decoration">
                <div class="decoration-element"></div>
              </div>
            </div>
          </div>
          
          <!-- 梅花易数特有的输入 -->
          <div v-if="selectedMethod === 'plumBlossom'" class="plum-blossom-section">
            <div class="input-group">
              <label class="input-label">选择起卦方式</label>
              <div class="method-options">
                <div 
                  @click="plumBlossomParams.method = 'time'"
                  class="method-option"
                  :class="{'method-option-active': plumBlossomParams.method === 'time'}"
                >
                  <div class="option-icon">⏰</div>
                  <div class="option-content">
                    <h4 class="option-title">时间起卦</h4>
                    <p class="option-description">以当前时间为基础，玄学与时间的完美结合</p>
                  </div>
                  <div class="option-indicator">
                    <div class="indicator-dot"></div>
                  </div>
                </div>
                
                <div 
                  @click="plumBlossomParams.method = 'number'"
                  class="method-option"
                  :class="{'method-option-active': plumBlossomParams.method === 'number'}"
                >
                  <div class="option-icon">🔢</div>
                  <div class="option-content">
                    <h4 class="option-title">数字起卦</h4>
                    <p class="option-description">输入你喜欢的数字，让数字能量指引方向</p>
                  </div>
                  <div class="option-indicator">
                    <div class="indicator-dot"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 数字起卦输入 -->
            <div v-if="plumBlossomParams.method === 'number'" class="number-inputs">
              <div class="input-row">
                <div class="input-group">
                  <label class="input-label">第一个数字</label>
                  <input 
                    v-model.number="plumBlossomParams.numbers[0]" 
                    type="number" 
                    placeholder="输入数字" 
                    class="number-input"
                  >
                </div>
                <div class="input-group">
                  <label class="input-label">第二个数字</label>
                  <input 
                    v-model.number="plumBlossomParams.numbers[1]" 
                    type="number" 
                    placeholder="输入数字" 
                    class="number-input"
                  >
                </div>
              </div>
            </div>
          </div>
          
          <div class="action-section">
            <button 
              @click="startDivination" 
              class="start-button"
              :class="{'start-button-loading': isLoading}"
              :disabled="!canStartDivination || isLoading"
            >
              <span v-if="isLoading" class="loading-content">
                <span class="loading-spinner"></span>
                <span class="loading-text">占卜中...</span>
              </span>
              <span v-else class="button-content">
                <span class="button-icon">⚡</span>
                <span class="button-text">掐指一算</span>
              </span>
            </button>
          </div>
        </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { DivinationMethod, PlumBlossomParams, AnalysisResult, SixCoinsResult, PlumBlossomResult, Hexagram } from '../types';
  import { coinDivination, plumBlossomDivination } from '../utils/divinationMethods';
  import { generateTraditionalAnalysisCoin, generateTraditionalAnalysisPlumBlossom } from '../utils/traditionalAnalysis';
import CoinDivinationAnimation from '../components/CoinDivinationAnimation.vue';
import DivinationResult from '../components/DivinationResult.vue';
import LLMConfigPanel from '../components/LLMConfigPanel.vue';
import MysticalBackground from '../../../components/common/MysticalBackground.vue';
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
        
          // 生成传统逻辑分析
          const traditionalAnalysis = generateTraditionalAnalysisCoin(
            coinResult.hexagram,
            changingLinesCoin,
            relatedHexagram
          );
          console.log('✅ 传统逻辑分析已生成（铜钱法）:', traditionalAnalysis);

          try {
            // 使用LLM服务获取解读内容，传入传统逻辑分析结果
            const analysis = await LLMService.getHexagramInterpretation(
              coinResult.hexagram,
              changingLinesCoin,
              relatedHexagram,
              question.value,
              traditionalAnalysis
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
              results: coinResult.results,
              traditionalAnalysis
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
              results: coinResult.results,
              traditionalAnalysis
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
        
        // 生成传统逻辑分析
        const traditionalAnalysisPlum = generateTraditionalAnalysisPlumBlossom(
          plumResult.hexagram,
          [], // 梅花易数没有变爻
          null
        );
        console.log('✅ 传统逻辑分析已生成（梅花易数）:', traditionalAnalysisPlum);

        try {
          // 使用LLM服务获取解读内容，传入传统逻辑分析结果
          const plumAnalysis = await LLMService.getHexagramInterpretation(
            plumResult.hexagram,
            [], // 梅花易数没有变爻
            null,
            question.value,
            traditionalAnalysisPlum
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
            method: 'plumBlossom',
            traditionalAnalysis: traditionalAnalysisPlum
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
            method: 'plumBlossom',
            traditionalAnalysis: traditionalAnalysisPlum
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
/* 动态星空背景 */
.cosmic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e0 100%);
}

.stars-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
  animation: starField 20s linear infinite;
}

.nebula-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  animation: nebulaDrift 30s ease-in-out infinite;
}

.energy-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px, 30px 30px;
  animation: particleFloat 15s linear infinite;
}

@keyframes starField {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-100px); }
}

@keyframes nebulaDrift {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

@keyframes particleFloat {
  0% { transform: translateY(0px) rotate(0deg); }
  100% { transform: translateY(-50px) rotate(360deg); }
}

/* 英雄区域 */
.hero-section {
  text-align: center;
  padding: 2rem 0;
}

.title-container {
  max-width: 600px;
  margin: 0 auto;
}

.main-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 1rem;
  color: #1a1a2e;
  text-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
}

.title-icon {
  font-size: 1.2em;
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
}

.title-text {
  position: relative;
}

.title-text::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.subtitle {
  font-size: 1.2rem;
  color: #4a5568;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-weight: 500;
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.decoration-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
}

.decoration-symbol {
  font-size: 1.5rem;
  color: #f59e0b;
  animation: symbolPulse 2s ease-in-out infinite;
}

@keyframes symbolPulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 1; }
}

/* 方法选择容器 */
.method-selection-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.1);
  position: relative;
  z-index: 5;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #4a5568;
  font-size: 1rem;
  font-weight: 500;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.method-card {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(139, 92, 246, 0.2);
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  z-index: 10;
  pointer-events: auto;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);
}

.method-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent);
  transition: left 0.6s ease;
  z-index: 1;
  pointer-events: none;
}

.method-card:hover::before {
  left: 100%;
}

/* 基础悬停效果 - 将被媒体查询覆盖 */
.method-card:hover {
  transform: translateY(-8px);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
  z-index: 20;
  background: rgba(255, 255, 255, 1);
}

.method-card-active {
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.05);
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.3);
  z-index: 15;
}

.method-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
}

.icon-container {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
}

.icon-symbol {
  font-size: 2rem;
  color: white;
  font-weight: bold;
  z-index: 2;
}

.icon-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  opacity: 0.3;
  animation: iconGlow 3s ease-in-out infinite;
}

@keyframes iconGlow {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.5; }
}

.method-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

.method-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 0.8rem;
}

.method-description {
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  font-weight: 500;
}

.method-features {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.feature-tag {
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.method-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 3;
}

.method-card-active .method-indicator {
  opacity: 1;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #8b5cf6;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
  animation: indicatorPulse 2s ease-in-out infinite;
}

@keyframes indicatorPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* 问题输入容器 */
.question-input-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.1);
}

.input-section {
  max-width: 600px;
  margin: 0 auto;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  color: #1a1a2e;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.input-wrapper {
  position: relative;
}

.question-input {
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  color: #1a1a2e;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.question-input::placeholder {
  color: #718096;
}

.question-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  background: rgba(255, 255, 255, 1);
}

.input-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  border-radius: 16px;
  overflow: hidden;
}

.decoration-element {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #8b5cf6, #ec4899, #f59e0b);
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.question-input:focus + .input-decoration .decoration-element {
  opacity: 0.3;
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.radio-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.radio-option:hover {
  background: rgba(139, 92, 246, 0.1);
}

.radio-input {
  display: none;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  margin-right: 0.5rem;
  position: relative;
  transition: all 0.3s ease;
}

.radio-input:checked + .radio-custom {
  border-color: #8b5cf6;
  background: #8b5cf6;
}

.radio-input:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.radio-label {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

/* 数字输入 */
.number-inputs {
  margin-top: 1rem;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.number-input {
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.number-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
}

/* 操作区域 */
.action-section {
  text-align: center;
  margin-top: 2rem;
}

.start-button {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border: none;
  border-radius: 16px;
  padding: 1rem 3rem;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-width: 200px;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
}

.start-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.start-button:hover::before {
  left: 100%;
}

.start-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(139, 92, 246, 0.4);
}

.start-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-icon {
  font-size: 1.2rem;
}

.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .methods-grid {
    grid-template-columns: 1fr;
  }
  
  .input-row {
    grid-template-columns: 1fr;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 1rem;
  }
  
  .main-title {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .title-decoration {
    gap: 0.5rem;
  }
  
  .decoration-line {
    width: 40px;
  }
  
  /* 移动端悬停修复 */
  .method-card {
    -webkit-tap-highlight-color: transparent;
  }
  
  .method-card:active {
    transform: translateY(-4px);
    border-color: rgba(139, 92, 246, 0.3);
    box-shadow: 0 10px 20px rgba(139, 92, 246, 0.2);
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 确保悬停效果在所有设备上正常工作 */
@media (hover: hover) {
  .method-card:hover {
    transform: translateY(-8px);
    border-color: rgba(139, 92, 246, 0.3);
    box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
    z-index: 20;
  }
}

/* 触摸设备优化 */
@media (hover: none) {
  .method-card {
    -webkit-tap-highlight-color: transparent;
  }
  
  .method-card:active {
    transform: translateY(-4px);
    border-color: rgba(139, 92, 246, 0.3);
    box-shadow: 0 10px 20px rgba(139, 92, 246, 0.2);
  }
}

/* 梅花易数法选项样式 */
.method-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.method-option {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.method-option:hover {
  transform: translateY(-2px);
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
  background: rgba(255, 255, 255, 0.95);
}

.method-option-active {
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.05);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
}

.option-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.option-content {
  flex: 1;
}

.option-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 0.3rem;
}

.option-description {
  font-size: 0.9rem;
  color: #4a5568;
  line-height: 1.4;
  font-weight: 500;
}

.option-indicator {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.method-option-active .option-indicator {
  border-color: #8b5cf6;
  background: #8b5cf6;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.method-option-active .indicator-dot {
  opacity: 1;
}

/* 数字输入样式优化 */
.number-inputs {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.number-input {
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  color: #1a1a2e;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.number-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
  background: rgba(255, 255, 255, 1);
}

.number-input::placeholder {
  color: #718096;
}
</style>
