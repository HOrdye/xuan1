<template>
  <div class="hexagram-explorer container mx-auto px-4 py-8">
    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">六十四卦探索</h1>
      <p class="text-gray-600 mb-6">浏览和探索所有六十四卦的详细信息，获取对易经智慧的深入解读。</p>
      
      <!-- 顶部操作区 -->
      <div class="flex justify-between items-center mb-6">
        <div class="relative inline-block"
             @mouseenter="showDropdown = true"
             @mouseleave="showDropdown = false">
          <button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition flex items-center">
            <span class="mr-2">⚯</span>
            <span>进入六十四卦占卜</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <div v-if="showDropdown"
               class="absolute left-0 w-48 bg-white rounded-md shadow-lg py-1 z-10"
               @mouseenter="showDropdown = true"
               @mouseleave="showDropdown = false">
            <router-link 
              to="/dilemma/divination" 
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              铜钱占卜法
            </router-link>
            <router-link 
              to="/dilemma/divination?method=plumBlossom" 
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              梅花易数法
            </router-link>
            <router-link 
              to="/dilemma/divination?method=random" 
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              随机起卦法
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- 搜索和筛选工具栏 -->
      <div class="flex flex-wrap gap-4 mb-6">
        <!-- 搜索框 -->
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">搜索卦名</label>
          <input 
            v-model="searchTerm" 
            type="text" 
            placeholder="输入卦名搜索..." 
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
        </div>
        
        <!-- 过滤属性 -->
        <div class="w-full sm:w-auto">
          <label class="block text-sm font-medium text-gray-700 mb-1">五行属性</label>
          <select 
            v-model="elementFilter" 
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          >
            <option value="">全部</option>
            <option value="金">金</option>
            <option value="木">木</option>
            <option value="水">水</option>
            <option value="火">火</option>
            <option value="土">土</option>
          </select>
        </div>
        
        <!-- 随机选择 -->
        <div class="w-full sm:w-auto flex items-end">
          <button 
            @click="selectRandom" 
            class="p-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
          >
            随机卦象
          </button>
        </div>
        
        <!-- 调试开关 -->
        <div v-if="showDebugControls" class="w-full sm:w-auto flex items-end">
          <div class="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
            <label class="text-sm font-medium text-gray-700">调试模式</label>
            <input 
              type="checkbox" 
              v-model="debugMode" 
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
        <div class="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600">加载卦象数据中...</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="loadError" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <h2 class="text-red-800 font-medium">加载失败</h2>
        <p class="text-red-700">{{ loadError.message }}</p>
        <button 
          @click="loadHexagramData" 
          class="mt-2 px-4 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition"
        >
          重试
        </button>
      </div>
      
      <!-- 选中的卦象详情 -->
      <div v-if="currentHexagram" class="mb-8">
        <hexagram-display 
          :hexagram="currentHexagram" 
          :theme-color="'var(--primary)'"
          :debug="debugMode"
        />
      </div>
      
      <!-- 调试控制面板 -->
      <div v-if="debugMode" class="bg-gray-100 p-4 rounded-md mb-6">
        <h3 class="text-sm font-semibold mb-2">调试控制面板</h3>
        <div class="flex flex-wrap gap-4">
          <button 
            @click="forceRerenderComponent" 
            class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            强制重新渲染
          </button>
          <button 
            @click="refreshCurrentHexagram" 
            class="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
          >
            刷新当前卦象
          </button>
          <div class="flex items-center gap-2">
            <span class="text-xs">渲染计数:</span>
            <span class="bg-white px-2 py-1 rounded text-xs">{{ renderCount }}</span>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="isLoaded && !isLoading && !filteredHexagrams.length" class="text-center py-12">
        <div class="text-4xl mb-4">🔍</div>
        <h2 class="text-xl font-medium text-gray-700 mb-2">无匹配结果</h2>
        <p class="text-gray-500">尝试调整搜索条件或清除筛选器</p>
        <button 
          @click="clearFilters" 
          class="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
        >
          清除筛选
        </button>
      </div>
    </div>
    
    <!-- 卦象网格 -->
    <div v-if="isLoaded && !isLoading && filteredHexagrams.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
      <div 
        v-for="hexagram in filteredHexagrams" 
        :key="hexagram.sequence" 
        class="hexagram-card bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer p-3"
        :class="{ 'ring-2 ring-primary': currentHexagramCode === hexagram.lines.join('') }"
        @click="selectHexagram(hexagram.lines.join(''))"
      >
        <div class="flex items-center justify-center mb-2">
          <img :src="generateHexagramImage(hexagram.lines)" alt="卦象" class="h-12" />
        </div>
        <div class="text-center">
          <h3 class="font-medium text-gray-800">{{ hexagram.name.split('(')[0].trim() }}</h3>
          <p class="text-xs text-gray-500">{{ hexagram.nature }}</p>
        </div>
      </div>
    </div>
    
    <!-- 调试信息 -->
    <div v-if="debugMode" class="bg-gray-100 p-4 rounded-md mb-6 text-xs">
      <h3 class="font-semibold mb-2">调试信息</h3>
      <pre class="bg-white p-2 rounded overflow-auto max-h-40">{{ JSON.stringify({
        currentHexagram: currentHexagram ? { name: currentHexagram.name, sequence: currentHexagram.sequence } : null,
        renderCount,
        lastRenderTime: new Date().toISOString()
      }, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useHexagram } from '../composables/useHexagram';
import HexagramDisplay from '../components/hexagram/HexagramDisplay.vue';

// 使用六十四卦组合式API
const {
  isLoading,
  isLoaded,
  loadError,
  currentHexagram,
  currentHexagramCode,
  hexagramList,
  loadHexagramData,
  selectHexagramByCode,
  generateHexagramImage,
  generateRandomHexagram,
} = useHexagram();

// 搜索和筛选状态
const searchTerm = ref('');
const elementFilter = ref('');

// 调试相关状态
const debugMode = ref(false);
const renderCount = ref(0);
const showDebugControls = ref(false);
const showDropdown = ref(false);

// 过滤后的卦象列表
const filteredHexagrams = computed(() => {
  let result = [...hexagramList.value];
  
  // 应用搜索筛选
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase().trim();
    result = result.filter(hexagram => 
      hexagram.name.toLowerCase().includes(term) || 
      hexagram.nature.toLowerCase().includes(term)
    );
  }
  
  // 应用五行属性筛选（如果有这个属性的话）
  if (elementFilter.value) {
    result = result.filter(hexagram => (hexagram as any).element === elementFilter.value);
  }
  
  return result;
});

// 选择卦象
const selectHexagram = async (code: string) => {
  await selectHexagramByCode(code);
  renderCount.value++;
  
  // 滚动到卦象详情
  setTimeout(() => {
    document.querySelector('.hexagram-explorer')?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
};

// 随机选择卦象
const selectRandom = async () => {
  await generateRandomHexagram();
  renderCount.value++;
};

// 清除筛选条件
const clearFilters = () => {
  searchTerm.value = '';
  elementFilter.value = '';
};

// 强制组件重新渲染
const forceRerenderComponent = async () => {
  if (currentHexagram.value) {
    const currentCode = currentHexagram.value.lines.join('');
    // 临时清空当前卦象
    await selectHexagramByCode('');
    await nextTick();
    // 然后重新设置
    await selectHexagramByCode(currentCode);
    renderCount.value++;
  }
};

// 刷新当前卦象数据
const refreshCurrentHexagram = async () => {
  if (currentHexagram.value) {
    const currentCode = currentHexagram.value.lines.join('');
    await selectHexagramByCode(currentCode);
    renderCount.value++;
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  await loadHexagramData();
  
  // 检测是否为开发环境或包含调试参数
  const isDev = process.env.NODE_ENV === 'development';
  const hasDebugParam = window.location.search.includes('debug=true');
  
  showDebugControls.value = isDev || hasDebugParam;
  
  // 如果URL中包含debug参数，自动开启调试模式
  if (hasDebugParam) {
    debugMode.value = true;
  }
});

// 监听数据加载完成，选择第一个卦象
watch(isLoaded, async (newValue) => {
  if (newValue && hexagramList.value.length > 0 && !currentHexagram.value) {
    await selectHexagram(hexagramList.value[0].lines.join(''));
  }
});
</script>

<style scoped>
.hexagram-card {
  display: flex;
  flex-direction: column;
  height: 100px;
  transition: all 0.2s ease;
}

.hexagram-card:hover {
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.hexagram-explorer {
  animation: fadeIn 0.5s ease;
}
</style> 