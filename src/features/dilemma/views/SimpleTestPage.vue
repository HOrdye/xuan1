 <template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">六十四卦简单测试页面</h1>
    
    <div class="mb-4">
      <button 
        @click="runTest" 
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        :disabled="isLoading"
      >
        运行简单测试
      </button>
    </div>
    
    <div v-if="isLoading" class="mb-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      <span class="ml-2">测试运行中...</span>
    </div>
    
    <div v-if="testResults.length > 0" class="bg-white p-4 rounded shadow">
      <h2 class="text-xl font-bold mb-2">测试结果</h2>
      <div class="whitespace-pre-wrap font-mono text-sm bg-gray-100 p-4 rounded max-h-[60vh] overflow-auto">
        <div v-for="(line, index) in testResults" :key="index"
             :class="{
               'text-green-600': line.includes('✅'),
               'text-red-600': line.includes('❌'),
               'font-bold': line.includes('开始测试')
             }">
          {{ line }}
        </div>
      </div>
    </div>
    
    <div v-if="hexagrams.length > 0" class="mt-4">
      <h2 class="text-xl font-bold mb-2">加载的卦象 (前5个)</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="hexagram in hexagrams.slice(0, 5)" :key="hexagram.number" 
             class="bg-white p-4 rounded shadow">
          <div class="flex justify-between">
            <div>
              <span class="font-bold">{{ hexagram.name }}</span>
              <span class="text-gray-500 ml-2">({{ hexagram.name }})</span>
            </div>
            <div class="text-3xl">{{ hexagram.symbol }}</div>
          </div>
          <div class="mt-2 text-sm">
            <div><span class="font-semibold">卦序:</span> {{ hexagram.number }}</div>
            <div><span class="font-semibold">上卦:</span> {{ hexagram.upperTrigram }}</div>
            <div><span class="font-semibold">下卦:</span> {{ hexagram.lowerTrigram }}</div>
            <div><span class="font-semibold">含义:</span> {{ hexagram.meaning }}</div>
          </div>
          <div class="mt-2 text-sm bg-gray-100 p-2 rounded">
            <span class="font-semibold">现代解读:</span> {{ hexagram.modernInterpretation }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { loadAllHexagrams } from '../utils/loadHexagrams';
import { Hexagram } from '../types';

const isLoading = ref(false);
const testResults = ref<string[]>([]);
const hexagrams = ref<Hexagram[]>([]);

// 捕获控制台输出
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

function captureConsole() {
  testResults.value = [];
  
  console.log = (...args) => {
    testResults.value.push(args.join(' '));
    originalConsoleLog(...args);
  };
  
  console.error = (...args) => {
    testResults.value.push(args.join(' '));
    originalConsoleError(...args);
  };
}

function restoreConsole() {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
}

async function runTest() {
  isLoading.value = true;
  captureConsole();
  
  try {
    console.log('开始简单测试六十四卦数据加载...');
    
    const result = await loadAllHexagrams();
    hexagrams.value = result;
    
    console.log(`成功加载了 ${result.length} 个卦象数据`);
    
    if (result.length > 0) {
      const sample = result[0];
      console.log('示例卦象:', sample.name, sample.symbol);
      console.log('现代解读:', sample.modernInterpretation);
    }
    
    if (result.length === 64) {
      console.log('✅ 卦象数量正确: 共64卦');
    } else {
      console.error(`❌ 卦象数量不正确: 期望64卦，实际加载了${result.length}卦`);
    }
    
    // 检查现代解读是否存在
    const withInterpretation = result.filter(h => 
      h.modernInterpretation && h.modernInterpretation.trim().length > 0
    );
    
    console.log(`包含现代解读的卦象数量: ${withInterpretation.length} / ${result.length}`);
    
    if (withInterpretation.length === result.length) {
      console.log('✅ 所有卦象都有现代解读');
    } else {
      console.error('❌ 部分卦象缺少现代解读');
    }
    
    // 计算现代解读的平均长度
    const totalLength = result.reduce((sum, h) => sum + (h.modernInterpretation?.length || 0), 0);
    const avgLength = totalLength / result.length;
    console.log(`现代解读平均长度: ${avgLength.toFixed(1)} 字符`);
    
    console.log('测试完成!');
  } catch (error) {
    console.error('测试失败:', error);
  } finally {
    restoreConsole();
    isLoading.value = false;
  }
}
</script>