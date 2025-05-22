<template>
  <div class="p-4 pb-20">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">六十四卦算法测试</h1>
      <p class="text-sm text-gray-600 mt-2">用于测试和展示六十四卦算法的功能</p>
    </div>

    <!-- 测试选项 -->
    <div class="bg-white rounded-xl p-4 mb-6 shadow-sm">
      <h3 class="text-gray-800 font-medium mb-4">测试参数设置</h3>
      
      <!-- 选项A输入 -->
      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-2">选项A</label>
        <input 
          v-model="testOptionA" 
          type="text" 
          placeholder="例如：接受现在的工作" 
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
        >
      </div>
      
      <!-- 选项B输入 -->
      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-2">选项B</label>
        <input 
          v-model="testOptionB" 
          type="text" 
          placeholder="例如：跳槽到新公司" 
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
        >
      </div>
      
      <!-- 生成方法选择 -->
      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-2">生成方法</label>
        <div class="flex">
          <label class="mr-4">
            <input type="radio" v-model="generationMethod" value="time" class="mr-1">
            时间法
          </label>
          <label>
            <input type="radio" v-model="generationMethod" value="random" class="mr-1">
            随机法
          </label>
        </div>
      </div>
      
      <!-- 多算法选择 -->
      <div class="mb-6">
        <label class="inline-flex items-center cursor-pointer">
          <input v-model="useMultipleAlgorithms" type="checkbox" class="sr-only peer">
          <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          <span class="ml-2 text-sm text-gray-600">多算法综合分析</span>
        </label>
      </div>
      
      <!-- 测试按钮 -->
      <div class="flex justify-between">
        <button 
          @click="testHexagram" 
          class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition"
          :disabled="!dataLoaded"
        >
          <span v-if="dataLoaded">生成测试结果</span>
          <span v-else>数据加载中...</span>
        </button>
        <button 
          @click="generateBatch" 
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
          :disabled="!dataLoaded"
        >
          <span v-if="dataLoaded">批量测试(10次)</span>
          <span v-else>数据加载中...</span>
        </button>
      </div>
      
      <!-- 数据加载提示 -->
      <div v-if="!dataLoaded" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-center space-x-2 text-primary">
          <div class="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
          <span class="font-medium">卦象数据加载中，请稍候...</span>
        </div>
        <div v-if="dataLoadingError" class="mt-2 text-red-500 text-sm">
          {{ dataLoadingError }}
        </div>
      </div>
    </div>
    
    <!-- 测试结果 -->
    <div v-if="testResult" class="bg-white rounded-xl overflow-hidden shadow-md mb-6">
      <div class="bg-gradient-to-r from-primary to-mystic p-4 text-white">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold">测试结果</h3>
          <span class="text-sm">方法: {{ generationMethod === 'time' ? '时间法' : '随机法' }}</span>
        </div>
      </div>
      
      <div class="p-4">
        <!-- 卦象信息 -->
        <div class="bg-gray-50 p-4 rounded-lg mb-4">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-bold text-gray-800">{{ testResult.hexagram.name }} ({{ testResult.hexagram.name }})</h4>
              <p class="text-sm text-gray-600 mt-1">{{ testResult.hexagram.meaning }}</p>
            </div>
            <div class="text-4xl">{{ testResult.hexagram.symbol }}</div>
          </div>
          
          <!-- 卦爻图 -->
          <div class="flex justify-center my-4">
            <div class="flex flex-col" ref="hexagramLinesRef">
              <div v-for="(line, index) in testResult.hexagram.lines.slice().reverse()" :key="index" class="my-1 flex items-center">
                <span class="text-xs text-gray-500 mr-2 w-4 text-right">{{ 6-index }}</span>
                <div v-if="line === 1" 
                     class="w-16 h-2 bg-primary rounded-full yang-line" 
                     :class="{ 'changing': testResult.changingLines.includes(5-index), 'hover-effect': hoverLineIndex === 5-index }"
                     :data-index="5-index"
                     @mouseover="hoverLineIndex = 5-index"
                     @mouseleave="hoverLineIndex = -1">
                </div>
                <div v-else 
                     class="flex space-x-1 yin-line" 
                     :class="{ 'changing': testResult.changingLines.includes(5-index), 'hover-effect': hoverLineIndex === 5-index }"
                     :data-index="5-index"
                     @mouseover="hoverLineIndex = 5-index"
                     @mouseleave="hoverLineIndex = -1">
                  <div class="w-7 h-2 bg-primary rounded-full"></div>
                  <div class="w-7 h-2 bg-primary rounded-full"></div>
                </div>
                <span v-if="testResult.changingLines.includes(5-index)" class="ml-2 text-xs bg-red-100 text-red-600 px-1 rounded">变</span>
                <span v-if="hoverLineIndex === 5-index" class="ml-2 text-xs text-gray-600">{{ getLinePosition(5-index * 1) }}</span>
              </div>
            </div>
          </div>
          
          <!-- 变卦信息 -->
          <div v-if="testResult.relatedHexagram" class="mt-3 pt-3 border-t border-gray-200">
            <h5 class="font-medium text-gray-700">变卦: {{ testResult.relatedHexagram.name }}（{{ testResult.relatedHexagram.symbol }}）—— {{ testResult.relatedHexagram.meaning }}</h5>
          </div>
        </div>
        
        <!-- 分析结果 -->
        <div class="mb-4">
          <h4 class="font-bold text-gray-800 mb-2">分析结果</h4>
          <p class="text-gray-700">{{ testResult.analysis }}</p>
        </div>
        
        <!-- 选项评分 -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="font-medium text-gray-700 mb-1">选项A: {{ testOptionA }}</div>
            <div class="text-sm text-gray-600 mb-2">{{ testResult.optionA_analysis }}</div>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div class="bg-primary h-2 rounded-full" :style="`width: ${testResult.optionA_score}%`"></div>
            </div>
            <div class="text-right text-xs text-gray-500">得分: {{ testResult.optionA_score }}%</div>
          </div>
          
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="font-medium text-gray-700 mb-1">选项B: {{ testOptionB }}</div>
            <div class="text-sm text-gray-600 mb-2">{{ testResult.optionB_analysis }}</div>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div class="bg-primary h-2 rounded-full" :style="`width: ${testResult.optionB_score}%`"></div>
            </div>
            <div class="text-right text-xs text-gray-500">得分: {{ testResult.optionB_score }}%</div>
          </div>
        </div>
        
        <!-- 推荐结果 -->
        <div class="bg-primary/10 p-3 rounded-lg">
          <div class="font-bold text-gray-800">推荐选择:</div>
          <div class="text-lg font-medium text-primary mt-1">
            <span v-if="testResult.recommendation === 'A'">{{ testOptionA }}</span>
            <span v-else-if="testResult.recommendation === 'B'">{{ testOptionB }}</span>
            <span v-else>{{ testResult.recommendation }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 批量测试结果 -->
    <div v-if="batchResults.length > 0" class="bg-white rounded-xl overflow-hidden shadow-md mb-6">
      <div class="bg-gradient-to-r from-primary to-mystic p-4 text-white">
        <h3 class="text-lg font-bold">批量测试统计</h3>
      </div>
      
      <div class="p-4">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 class="font-medium text-gray-800 mb-2">推荐分布</h4>
            <div class="bg-gray-50 p-3 rounded-lg">
              <div class="flex justify-between mb-1">
                <span>选项A</span>
                <span>{{ recommendationStats.A }}次</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div class="bg-blue-500 h-2 rounded-full" :style="`width: ${recommendationStats.A * 10}%`"></div>
              </div>
              
              <div class="flex justify-between mb-1">
                <span>选项B</span>
                <span>{{ recommendationStats.B }}次</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div class="bg-green-500 h-2 rounded-full" :style="`width: ${recommendationStats.B * 10}%`"></div>
              </div>
              
              <div class="flex justify-between mb-1">
                <span>两者都可</span>
                <span>{{ recommendationStats.both }}次</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-yellow-500 h-2 rounded-full" :style="`width: ${recommendationStats.both * 10}%`"></div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="font-medium text-gray-800 mb-2">卦象分布</h4>
            <div class="bg-gray-50 p-3 rounded-lg h-[124px] overflow-y-auto">
              <div v-for="(count, hexagram) in hexagramStats" :key="hexagram" class="text-sm flex justify-between mb-1">
                <span>{{ hexagram }}</span>
                <span>{{ count }}次</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 class="font-medium text-gray-800 mb-2">得分统计</h4>
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-700 mb-1">选项A平均得分: {{ scoreStats.avgA.toFixed(1) }}%</div>
                <div class="text-sm text-gray-700">选项A得分范围: {{ scoreStats.minA }}% - {{ scoreStats.maxA }}%</div>
              </div>
              <div>
                <div class="text-sm text-gray-700 mb-1">选项B平均得分: {{ scoreStats.avgB.toFixed(1) }}%</div>
                <div class="text-sm text-gray-700">选项B得分范围: {{ scoreStats.minB }}% - {{ scoreStats.maxB }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue';
import { generateHexagram, AnalysisResult, ensureDataLoaded } from '../utils/hexagramGenerator';
import { generateFortuneSeed } from '../utils/fortuneSeed';

// 测试参数
const testOptionA = ref('申请名校MBA');
const testOptionB = ref('继续在公司发展');
const generationMethod = ref<'time' | 'random'>('time');
const useMultipleAlgorithms = ref(false);

// 测试结果
const testResult = ref<AnalysisResult | null>(null);
const batchResults = ref<AnalysisResult[]>([]);

// 生成单次测试结果
const testHexagram = () => {
  try {
    const seed = generateFortuneSeed({
      question: `${testOptionA.value} vs ${testOptionB.value}`,
      optionA: testOptionA.value,
      optionB: testOptionB.value,
      clickTimestamp: Date.now()
    });
    testResult.value = generateHexagram(
      testOptionA.value,
      testOptionB.value,
      seed,
      useMultipleAlgorithms.value
    );
    console.log('成功生成卦象:', testResult.value);
  } catch (error) {
    console.error('生成卦象错误:', error);
    if (error.message.includes('卦象数据尚未加载完成')) {
      alert('数据正在加载中，请稍后再试。页面首次加载需要几秒钟准备数据。');
    } else {
      alert(`生成卦象时发生错误: ${error.message}`);
    }
  }
};

// 生成批量测试结果
const generateBatch = () => {
  try {
    batchResults.value = [];
    for (let i = 0; i < 10; i++) {
      try {
        const seed = generateFortuneSeed({
          question: `${testOptionA.value} vs ${testOptionB.value}`,
          optionA: testOptionA.value,
          optionB: testOptionB.value,
          clickTimestamp: Date.now() + i
        });
        const result = generateHexagram(
          testOptionA.value,
          testOptionB.value,
          seed,
          useMultipleAlgorithms.value
        );
        batchResults.value.push(result);
      } catch (error) {
        console.error(`批量测试第${i+1}次出错:`, error);
      }
    }
    // 计算统计数据
    calculateStats();
  } catch (error) {
    console.error('批量测试初始化失败:', error);
    if (error.message.includes('卦象数据尚未加载完成')) {
      alert('数据正在加载中，请稍后再试。页面首次加载需要几秒钟准备数据。');
    } else {
      alert(`批量测试失败: ${error.message}`);
    }
  }
};

// 统计数据
const recommendationStats = reactive({
  A: 0,
  B: 0,
  both: 0
});

const hexagramStats = reactive<Record<string, number>>({});

const scoreStats = reactive({
  avgA: 0,
  avgB: 0,
  minA: 100,
  maxA: 0,
  minB: 100,
  maxB: 0
});

// 计算统计数据
const calculateStats = () => {
  // 重置统计
  recommendationStats.A = 0;
  recommendationStats.B = 0;
  recommendationStats.both = 0;
  Object.keys(hexagramStats).forEach(key => delete hexagramStats[key]);
  
  // 分数统计初始化
  let sumA = 0;
  let sumB = 0;
  scoreStats.minA = 100;
  scoreStats.maxA = 0;
  scoreStats.minB = 100;
  scoreStats.maxB = 0;
  
  // 统计推荐结果和卦象分布
  batchResults.value.forEach(result => {
    // 推荐统计
    if (result.recommendation === 'A') {
      recommendationStats.A++;
    } else if (result.recommendation === 'B') {
      recommendationStats.B++;
    } else {
      recommendationStats.both++;
    }
    
    // 卦象统计
    const hexagramName = result.hexagram.name;
    hexagramStats[hexagramName] = (hexagramStats[hexagramName] || 0) + 1;
    
    // 分数统计
    sumA += result.optionA_score ?? 0;
    sumB += result.optionB_score ?? 0;
    scoreStats.minA = Math.min(scoreStats.minA, result.optionA_score ?? 0);
    scoreStats.maxA = Math.max(scoreStats.maxA, result.optionA_score ?? 0);
    scoreStats.minB = Math.min(scoreStats.minB, result.optionB_score ?? 0);
    scoreStats.maxB = Math.max(scoreStats.maxB, result.optionB_score ?? 0);
  });
  
  // 计算平均分
  const count = batchResults.value.length;
  if (count > 0) {
    scoreStats.avgA = sumA / count;
    scoreStats.avgB = sumB / count;
  }
};

const hexagramLinesRef = ref<HTMLElement | null>(null);

// hover状态跟踪
const hoverLineIndex = ref(-1);

// 获取爻位描述
const getLinePosition = (position: number): string => {
  const positions = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
  return positions[position];
};

// 数据加载状态
const dataLoaded = ref(false);
const dataLoadingError = ref('');

// 检查卦象数据是否已加载
const checkDataLoaded = async () => {
  try {
    console.log('检查卦象数据加载状态...');
    const loaded = await ensureDataLoaded();
    if (loaded) {
      console.log('卦象数据加载成功!');
      dataLoaded.value = true;
      dataLoadingError.value = '';
    } else {
      console.warn('卦象数据未加载完成');
      dataLoaded.value = false;
      dataLoadingError.value = '数据加载失败，请刷新页面重试';
      // 3秒后重试
      setTimeout(checkDataLoaded, 3000);
    }
  } catch (error) {
    console.error('检查数据加载状态时出错:', error);
    dataLoaded.value = false;
    dataLoadingError.value = error.message || '数据加载出错';
    // 3秒后重试
    setTimeout(checkDataLoaded, 3000);
  }
};

// 页面加载时检查数据状态
onMounted(() => {
  console.log('组件已挂载，开始检查数据状态');
  checkDataLoaded();
});
</script>

<style scoped>
/* 阳爻样式 */
.yang-line {
  box-shadow: 0 0 2px rgba(79, 70, 229, 0.2);
}

/* 阴爻样式 */
.yin-line {
  box-shadow: 0 0 2px rgba(79, 70, 229, 0.2);
}

/* 变爻样式 */
.hexagram-line.changing {
  position: relative;
}

/* 光标悬停效果 */
.hexagram-line.hover-effect {
  filter: brightness(1.2);
  transition: all 0.2s ease;
}
</style> 