<template>
  <div class="min-h-screen bg-gray-900 text-white p-4">
    <!-- 顶部导航 -->
    <div class="max-w-4xl mx-auto mb-6">
      <div class="flex items-center justify-between">
        <button 
          @click="goBack"
          class="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all duration-200 border border-white/10 hover:border-purple-400/30"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span class="text-sm">返回历史记录</span>
        </button>
        
        <div class="text-center">
          <h1 class="text-2xl font-bold text-purple-300">完整解读</h1>
                     <p class="text-gray-400 text-sm mt-1">{{ historyItem ? getTypeLabel(historyItem.type) : '' }}</p>
        </div>
        
        <div class="w-32"></div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="max-w-4xl mx-auto text-center py-20">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      <p class="mt-4 text-purple-200">正在加载解读内容...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="max-w-4xl mx-auto text-center py-20">
      <p class="text-red-400 text-lg mb-4">{{ error }}</p>
      <button 
        @click="goBack"
        class="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
      >
        返回历史记录
      </button>
    </div>

    <!-- 详情内容 -->
    <div v-else-if="historyItem" class="max-w-4xl mx-auto">
      <!-- 标题和基本信息 -->
      <div class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 mb-6 border border-white/10">
        <div class="flex items-start space-x-4">
          <div class="text-4xl">{{ getTypeEmoji(historyItem.type) }}</div>
          <div class="flex-grow">
            <h2 class="text-2xl font-bold text-purple-300 mb-2">{{ historyItem.title }}</h2>
            <div class="flex items-center space-x-4 text-sm text-gray-400 mb-3">
              <span class="bg-gray-700/50 px-3 py-1 rounded-full">{{ formatDate(historyItem.date) }}</span>
              <span class="bg-purple-600/20 px-3 py-1 rounded-full text-purple-300">{{ getTypeLabel(historyItem.type) }}</span>
            </div>
            <p v-if="historyItem.question" class="text-gray-300 italic bg-indigo-900/30 p-3 rounded-lg border-l-4 border-indigo-400">
              <span class="text-indigo-300 font-medium">咨询问题：</span>{{ historyItem.question }}
            </p>
          </div>
        </div>
      </div>

      <!-- 塔罗牌占卜详情 -->
      <div v-if="historyItem.type === 'tarot'" class="space-y-6">
        <!-- 卡牌展示 -->
        <div v-if="getTarotCards(historyItem).length > 0" class="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-400/20">
          <h3 class="text-xl font-semibold text-purple-300 mb-4 flex items-center">
            <span class="mr-2">🎴</span>
            抽取的卡牌
            <span class="text-sm text-gray-400 ml-2">({{ getTarotSpread(historyItem) }})</span>
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="(card, index) in getTarotCards(historyItem)" 
              :key="index"
              class="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30"
            >
              <div class="text-center mb-3">
                <img 
                  :src="card.imageUrl" 
                  :alt="card.name"
                  class="w-24 h-38 object-cover rounded-lg mx-auto border-2 border-yellow-400/40 shadow-lg"
                  :class="{ 'transform rotate-180': card.orientation === 'reversed' }"
                  @error="handleImageError"
                />
              </div>
              <div class="text-center">
                <h4 class="font-semibold text-white mb-1">{{ card.name }}</h4>
                <div class="flex items-center justify-center space-x-2 mb-2">
                  <span class="text-xs px-2 py-1 rounded-full text-white"
                        :class="card.orientation === 'reversed' ? 'bg-red-500/80' : 'bg-green-500/80'">
                    {{ card.orientation === 'reversed' ? '逆位' : '正位' }}
                  </span>
                  <span v-if="card.position" class="text-xs text-purple-300 bg-purple-600/20 px-2 py-1 rounded-full">
                    {{ card.position }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 详细解读 -->
        <div v-if="historyItem.result && historyItem.result.interpretation" class="space-y-4">
          <h3 class="text-xl font-semibold text-purple-300 mb-4 flex items-center">
            <span class="mr-2">✨</span>
            详细解读
          </h3>
          
          <div 
            v-for="(section, index) in historyItem.result.interpretation" 
            :key="index"
            class="bg-gray-800/50 rounded-lg p-5 border border-gray-600/30"
          >
            <h4 v-if="section.position" class="font-semibold text-lg text-yellow-300 mb-3">
              {{ section.position }}
            </h4>
            
            <div v-if="section.keyMessage" class="bg-blue-900/30 border-l-4 border-blue-400 p-3 mb-3 rounded-r-lg">
              <p class="text-blue-200 font-medium">💡 核心信息</p>
              <p class="text-gray-200 mt-1">{{ section.keyMessage }}</p>
            </div>
            
            <div v-if="section.summary" class="mb-3">
              <p class="text-gray-300 font-medium mb-2">📝 概要</p>
              <p class="text-gray-200">{{ section.summary }}</p>
            </div>
            
            <div v-if="section.content">
              <p class="text-gray-300 font-medium mb-2">📖 详细解释</p>
              <div class="text-gray-200 leading-relaxed" v-html="formatContent(section.content)"></div>
            </div>
          </div>
        </div>

        <!-- 总体解读 -->
        <div v-if="historyItem.result && historyItem.result.overallReading" class="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-xl p-6 border border-yellow-400/20">
          <h3 class="text-xl font-semibold text-yellow-300 mb-4 flex items-center">
            <span class="mr-2">🌟</span>
            总体指引
          </h3>
          <div class="text-gray-200 leading-relaxed" v-html="formatContent(historyItem.result.overallReading)"></div>
        </div>
      </div>

      <!-- 其他类型占卜的详情 -->
      <div v-else class="bg-gray-800/50 rounded-lg p-6 border border-gray-600/30">
        <h3 class="text-xl font-semibold text-purple-300 mb-4 flex items-center">
          <span class="mr-2">✨</span>
          占卜解读
        </h3>
        
        <div v-if="typeof historyItem.result === 'string'" class="text-gray-200 leading-relaxed" v-html="formatContent(historyItem.result)"></div>
        <div v-else-if="historyItem.result && historyItem.result.content" class="text-gray-200 leading-relaxed" v-html="formatContent(historyItem.result.content)"></div>
        <div v-else class="text-gray-400 italic">暂无详细解读内容</div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center justify-center space-x-4 mt-8 pb-6">
        <button
          @click="shareReading"
          class="flex items-center space-x-2 px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>分享解读</span>
        </button>
        
        <button
          @click="goBack"
          class="flex items-center space-x-2 px-6 py-3 bg-gray-600/20 hover:bg-gray-600/30 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          <span>返回历史</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UserStatsService } from '../services/userStatsService';
import type { HistoryItem } from '../services/historyService';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const error = ref('');
const historyItem = ref<HistoryItem | null>(null);

// 获取历史记录详情
const loadHistoryItem = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const historyId = route.query.id as string;
    if (!historyId) {
      error.value = '缺少历史记录ID';
      return;
    }

    console.log('🔍 正在查找历史记录ID:', historyId);

    // 从本地存储获取所有历史记录
    const history = await UserStatsService.getUserHistory();
    console.log('📚 获取到历史记录数量:', history.length);
    
    const item = history.find(h => h.id === historyId);
    
    if (!item) {
      console.error('❌ 未找到历史记录:', historyId, '可用记录:', history.map(h => h.id));
      error.value = `未找到ID为 ${historyId} 的历史记录`;
      return;
    }
    
    console.log('✅ 找到历史记录:', item);
    historyItem.value = item;
  } catch (err) {
    console.error('❌ 加载历史记录失败:', err);
    error.value = '加载历史记录失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 分享解读
const shareReading = () => {
  if (!historyItem.value) return;
  
  const shareText = `🔮 ${historyItem.value.title}\n\n${historyItem.value.question ? `💭 问题：${historyItem.value.question}\n\n` : ''}来自天玄Web的占卜指引，获得了深刻的洞察！`;
  
  if (navigator.share) {
    navigator.share({
      title: historyItem.value.title,
      text: shareText,
      url: window.location.href
    });
  } else {
    // 兜底方案：复制到剪贴板
    navigator.clipboard.writeText(shareText).then(() => {
      alert('解读内容已复制到剪贴板');
    }).catch(() => {
      alert('分享功能暂不可用');
    });
  }
};

// 获取类型标签
const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    tarot: '塔罗占卜',
    divination: '六爻占卜',
    fortune: '运势分析',
    jiaoBei: '筊杯占卜'
  };
  return labels[type] || type;
};

// 获取类型图标
const getTypeEmoji = (type: string) => {
  const emojis: Record<string, string> = {
    tarot: '🎴',
    divination: '☯️', 
    fortune: '🌟',
    jiaoBei: '🪙'
  };
  return emojis[type] || '🔮';
};

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 获取塔罗卡牌
const getTarotCards = (item: HistoryItem) => {
  if (item.type === 'tarot' && item.result && Array.isArray(item.result.cards)) {
    return item.result.cards;
  }
  return [];
};

// 获取塔罗牌阵
const getTarotSpread = (item: HistoryItem) => {
  if (item.type === 'tarot' && item.result) {
    return item.result.spread || '未知牌阵';
  }
  return '';
};

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/src/assets/new-card-back.png';
};

// 格式化内容（将换行符转换为HTML）
const formatContent = (content: string) => {
  return content.replace(/\n/g, '<br>');
};

onMounted(() => {
  loadHistoryItem();
});
</script>

<style scoped>
/* 添加一些自定义样式 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 