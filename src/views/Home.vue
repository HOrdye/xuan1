<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 欢迎横幅 -->
    <div class="bg-gradient-to-r from-primary to-mystic text-white rounded-xl overflow-hidden shadow-lg mb-10">
      <div class="md:flex items-center">
        <div class="md:w-1/2 py-10 px-8">
          <h1 class="text-3xl md:text-4xl font-bold mb-4">欢迎来到天玄 Web</h1>
          <p class="text-lg mb-6">告别刻板，拥抱"玄"妙乐趣，让每一次选择都有迹可循！</p>
          <div class="flex gap-4 flex-wrap">
            <router-link 
              to="/dilemma" 
              class="inline-block bg-white text-primary font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
            >
              开始体验
            </router-link>
            <button 
              @click="showConfigModal = true"
              class="inline-block bg-white bg-opacity-20 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 border border-white border-opacity-30"
            >
              🤖 配置AI
            </button>
          </div>
        </div>
        <div class="md:w-1/2 p-6 md:p-0 flex justify-center items-center">
          <div class="w-48 h-48 relative">
            <!-- 六爻图示 -->
            <div class="absolute inset-0 flex flex-col justify-between items-center">
              <div v-for="i in 6" :key="i" class="w-full flex justify-center">
                <div class="w-32 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 功能卡片区域 -->
    <h2 class="text-2xl font-bold text-gray-800 mb-6">探索功能</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <!-- 玄选两难卡片 -->
      <div class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
        <div class="h-32 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
          <span class="text-4xl">⚖️</span>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">玄选两难</h3>
          <p class="text-gray-600 mb-4">面临选择困难？输入你的两个选项，获取玄学指引和选择分析。</p>
          <router-link 
            to="/dilemma" 
            class="inline-block bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition"
          >
            立即尝试
          </router-link>
        </div>
      </div>
      
      <!-- 六十四卦探索卡片 -->
      <div class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
        <div class="h-32 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
          <span class="text-4xl">⚯</span>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">六十四卦探索</h3>
          <p class="text-gray-600 mb-4">浏览所有卦象，了解古老智慧，或选择三种占卜方法获取指引。</p>
          <div class="flex flex-wrap gap-2">
            <router-link 
              to="/hexagrams" 
              class="inline-block bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition"
            >
              探索卦象
            </router-link>
            <div class="relative group inline-block"
                 @mouseenter="showDropdown = true"
                 @mouseleave="showDropdown = false">
              <button class="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition flex items-center">
                占卜方法
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <div v-if="showDropdown" class="absolute left-0 w-40 bg-white rounded-md shadow-lg py-1 z-10"
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
        </div>
      </div>
      
      <!-- 今日运势卡片 -->
      <div class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
        <div class="h-32 bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-white">
          <span class="text-4xl">🔮</span>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">今日运势</h3>
          <p class="text-gray-600 mb-4">查看你的每日运势解读，获得行动指南和开运小提示。</p>
          <router-link 
            to="/fortune" 
            class="inline-block bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition"
          >
            查看运势
          </router-link>
        </div>
      </div>
      
      <!-- 塔罗牌卡片 -->
      <div class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
        <div class="h-32 bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white">
          <span class="text-4xl">🃏</span>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">塔罗牌</h3>
          <p class="text-gray-600 mb-4">抽取你的塔罗牌，探索命运的信息和未知的可能性。</p>
          <router-link 
            to="/tarot" 
            class="inline-block bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition"
          >
            抽取塔罗
          </router-link>
        </div>
      </div>
    </div>
        
    <!-- 用户评价区域 -->
    <h2 class="text-2xl font-bold text-gray-800 mb-6">用户评价</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <div v-for="(review, index) in userReviews" :key="index" class="bg-white p-6 rounded-xl shadow-md">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-mystic flex items-center justify-center text-white font-bold">
            {{ review.name.charAt(0) }}
          </div>
          <div class="ml-3">
            <div class="font-medium text-gray-800">{{ review.name }}</div>
            <div class="text-gray-500 text-sm">{{ review.date }}</div>
          </div>
        </div>
        <div class="flex text-amber-400 mb-2">
          <span v-for="i in 5" :key="i" class="mr-0.5">★</span>
        </div>
        <p class="text-gray-600">{{ review.comment }}</p>
      </div>
    </div>
  </div>
  
  <!-- LLM配置模态框 -->
  <LLMConfigModal 
    :show="showConfigModal" 
    @close="showConfigModal = false"
    @saved="onLLMConfigSaved"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LLMConfigModal from '../components/LLMConfigModal.vue';

// 用户评价数据
const userReviews = ref([
  {
    name: '小明',
    date: '2023-11-18',
    comment: '玄选两难功能非常有趣，动画效果很赞！每次做决定都要来这里看看，已经推荐给朋友了。'
  },
  {
    name: '阿琳',
    date: '2023-11-15',
    comment: '界面设计很漂亮，使用起来非常直观。我特别喜欢今日运势的内容，每天都会来看一看。'
  },
  {
    name: '老王',
    date: '2023-11-10',
    comment: '一开始抱着玩一玩的心态，结果发现分析还挺有道理的。卦象分析很准确！'
  }
]);

const showDropdown = ref(false);
const showConfigModal = ref(false);

function onLLMConfigSaved() {
  console.log('✅ LLM配置已保存');
  // 可以在这里添加一些成功提示或重新加载数据的逻辑
}
</script>

<style scoped>
/* 添加样式，比如卡片过渡动画等 */
.rounded-xl {
  border-radius: 1rem;
}

/* 卡片悬浮效果 */
.shadow-md {
  transition: all 0.3s ease;
}

.shadow-md:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style> 