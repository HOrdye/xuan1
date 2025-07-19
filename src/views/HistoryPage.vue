<template>
  <div class="history-page min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header with Back Button -->
      <div class="flex items-center justify-between mb-8">
        <button 
          @click="goBack"
          class="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all duration-200 border border-white/10 hover:border-purple-400/30"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span class="text-sm">返回</span>
        </button>
        
        <div class="text-center flex-1">
        <h1 class="text-4xl font-bold text-purple-300">历史记录</h1>
        <p class="text-gray-400 mt-2">您过往的每一次探索与启示</p>
        <p class="text-gray-500 text-sm mt-1">💡 保存重要的占卜结果，随时回顾人生指引</p>
        </div>
        
        <!-- Placeholder for symmetry -->
        <div class="w-20"></div>
      </div>

      <!-- Search Bar -->
      <div v-if="historyStore.historyList.length > 0" class="mb-6">
        <div class="relative max-w-md mx-auto">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索历史记录..."
            class="w-full px-4 py-3 pl-10 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-gray-800/70 transition-all"
          />
          <svg
            class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="historyStore.isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
        <p class="mt-4 text-purple-200">正在加载记录...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="historyStore.error" class="text-center py-20 bg-red-900/20 rounded-lg p-8">
        <p class="text-2xl text-red-400 mb-4">唉呀！出错了</p>
        <p class="text-red-300">{{ historyStore.error }}</p>
        <button @click="historyStore.fetchHistory" class="mt-6 px-6 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
          重试
        </button>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="historyStore.historyList.length === 0" class="text-center py-20 bg-gray-800/50 rounded-lg">
        <p class="text-5xl mb-4">🗂️</p>
        <h2 class="text-2xl font-semibold text-gray-300">暂无历史记录</h2>
        <p class="text-gray-500 mt-2">您进行的每一次占卜和运势分析都会被保存在这里。</p>
        <div class="mt-6 space-y-2">
          <p class="text-sm text-gray-400">💡 保存功能的价值：</p>
          <ul class="text-sm text-gray-500 space-y-1">
            <li>• 记录重要的人生指引，随时回顾</li>
            <li>• 追踪占卜结果的准确性</li>
            <li>• 发现人生模式和趋势</li>
            <li>• 在需要时重新获得启发</li>
          </ul>
        </div>
        <div class="mt-8">
          <router-link
            to="/"
            class="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <span class="mr-2">🔮</span>
            开始您的第一次占卜
          </router-link>
        </div>
      </div>

      <!-- No Search Results -->
      <div v-else-if="filteredHistory.length === 0 && searchQuery" class="text-center py-12 bg-gray-800/30 rounded-lg">
        <p class="text-2xl mb-2">🔍</p>
        <h3 class="text-lg font-medium text-gray-300">未找到相关记录</h3>
        <p class="text-gray-500 mt-1">尝试使用不同的关键词搜索</p>
        <button
          @click="searchQuery = ''"
          class="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
        >
          清除搜索
        </button>
      </div>

      <!-- History List -->
      <div v-else class="space-y-4">
        <!-- Results Summary -->
        <div v-if="searchQuery" class="text-center text-sm text-gray-400 mb-4">
          找到 {{ filteredHistory.length }} 条相关记录
        </div>
        
        <transition-group name="list" tag="div">
          <div
            v-for="item in filteredHistory"
            :key="item.id"
            class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 group shadow-lg"
          >
            <!-- Enhanced Tarot Cards Display -->
            <div v-if="item.type === 'tarot' && getTarotCards(item).length > 0" class="mb-6">
              <div class="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-4 border border-purple-400/20">
                <div class="text-center mb-3">
                  <span class="text-purple-300 text-sm font-medium">🎴 塔罗卡牌</span>
                </div>
                <div class="flex items-start justify-center space-x-4 mb-3 flex-wrap gap-3">
                  <div 
                    v-for="(card, index) in getTarotCards(item).slice(0, 4)" 
                    :key="index"
                    class="relative group/card flex-shrink-0"
                  >
                    <div class="text-center">
                      <img 
                        :src="card.imageUrl" 
                        :alt="card.name"
                        class="w-20 h-32 object-cover rounded-lg border-2 border-yellow-400/40 shadow-lg transition-all duration-300 group-hover/card:scale-105 group-hover/card:border-yellow-400/80 mx-auto"
                        :class="{ 'transform rotate-180': card.orientation === 'reversed' }"
                        @error="handleImageError"
                      />
                      <div class="mt-2 text-xs text-center max-w-20">
                        <div class="text-white font-medium truncate">{{ card.name }}</div>
                        <div class="text-xs mt-1 px-2 py-1 rounded-full text-white"
                             :class="card.orientation === 'reversed' ? 'bg-red-500/80' : 'bg-green-500/80'">
                          {{ card.orientation === 'reversed' ? '逆位' : '正位' }}
                        </div>
                        <div v-if="card.position" class="text-purple-300 text-xs mt-1">
                          {{ card.position }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="getTarotCards(item).length > 4" class="flex items-center text-gray-400 text-sm">
                    <div class="text-center">
                      <div class="w-20 h-32 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center">
                        <span class="text-2xl">+{{ getTarotCards(item).length - 4 }}</span>
                      </div>
                      <div class="text-xs mt-2">更多卡牌</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 text-3xl">{{ getTypeEmoji(item.type) }}</div>
              <div class="flex-grow">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-bold text-xl text-purple-300 mb-1">{{ item.title }}</h3>
                    <div class="flex items-center space-x-3 text-xs">
                      <span class="text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">{{ getTimeAgo(item.date) }}</span>
                      <span class="text-purple-400 bg-purple-600/20 px-2 py-1 rounded-full">{{ getTypeLabel(item.type) }}</span>
                    </div>
                  </div>
                  <button
                    @click="removeItem(item.id)"
                    class="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-500/20"
                    aria-label="删除此条记录"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <p v-if="item.question" class="text-sm text-gray-300 mt-3 p-3 bg-indigo-900/30 rounded-lg border-l-4 border-indigo-400 italic">
                  <span class="text-indigo-300 font-medium">问题：</span>{{ item.question }}
                </p>
                
                <!-- Enhanced Preview with Key Insights -->
                <div class="mt-4 space-y-3">
                  <div class="p-4 bg-gradient-to-r from-gray-900/60 to-purple-900/20 rounded-lg border border-purple-500/20">
                    <div class="flex items-center mb-2">
                      <span class="text-yellow-400 mr-2">✨</span>
                      <span class="text-sm font-medium text-purple-300">核心洞察</span>
                    </div>
                    <p class="text-sm text-gray-200 leading-relaxed">
                      {{ getKeyInsight(item) }}
                    </p>
                  </div>
                  
                  <!-- Show spread info for tarot -->
                  <div v-if="item.type === 'tarot' && getTarotSpread(item)" class="text-xs text-gray-400 flex items-center">
                    <span class="mr-2">🎴</span>
                    <span>{{ getTarotSpread(item) }} • {{ getTarotCards(item).length }} 张卡牌</span>
                  </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex items-center justify-between mt-4">
                  <div class="flex items-center space-x-2">
                    <!-- 查看完整解读按钮 -->
                    <button
                      @click="viewFullReading(item)"
                      class="flex items-center space-x-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors text-sm font-medium"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>查看完整解读</span>
                    </button>
                    <button
                      @click="shareItem(item)"
                      class="flex items-center space-x-1 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-colors text-sm"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span>分享</span>
                    </button>
                    <button
                      @click="copyToClipboard(item, $event)"
                      class="flex items-center space-x-1 px-3 py-1.5 bg-gray-600/20 hover:bg-gray-600/30 rounded-lg transition-colors text-sm"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>复制</span>
                    </button>
                  </div>
                  <span class="text-xs text-gray-600">
                    {{ getTimeAgo(item.date) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
    
    <!-- SharePanel组件 -->
    <SharePanel
      :is-open="sharePanel.isOpen"
      :target-ref="null"
      :share-data="sharePanel.shareData"
      :revealed-cards="sharePanel.revealedCards"
      @close="closeSharePanel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useHistoryStore } from '../store/historyStore';
import SharePanel from '../components/common/SharePanel.vue';
import type { HistoryItem } from '../services/historyService';
import type { ShareData } from '../types/share';

const router = useRouter();
const historyStore = useHistoryStore();
const searchQuery = ref('');

// SharePanel状态管理
const sharePanel = reactive({
  isOpen: false,
  shareData: undefined as ShareData | undefined,
  revealedCards: [] as any[]
});

const filteredHistory = computed(() => {
  if (!searchQuery.value) return historyStore.historyList;
  
  const query = searchQuery.value.toLowerCase();
  return historyStore.historyList.filter(item => 
    item.title.toLowerCase().includes(query) ||
    (item.question && item.question.toLowerCase().includes(query)) ||
    JSON.stringify(item.result).toLowerCase().includes(query)
  );
});

const getTypeEmoji = (type: HistoryItem['type']): string => {
  const map: Record<HistoryItem['type'], string> = {
    fortune: '🔮',
    jiaoBei: '🥤',
    divination: '易',
    tarot: '🃏',
  };
  return map[type] || '📜';
};

const getTypeLabel = (type: HistoryItem['type']): string => {
  const map: Record<HistoryItem['type'], string> = {
    fortune: '运势占卜',
    jiaoBei: '掷杯问卦',
    divination: '易经占卜',
    tarot: '塔罗牌占卜',
  };
  return map[type] || '占卜';
};

const getResultPreview = (item: HistoryItem): string => {
  if (typeof item.result === 'string') {
    return item.result.length > 100 ? item.result.substring(0, 100) + '...' : item.result;
  }
  
  // Handle different result types
  if (item.result && typeof item.result === 'object') {
    if ('interpretation' in item.result) {
      const interpretation = item.result.interpretation as string;
      return interpretation.length > 100 ? interpretation.substring(0, 100) + '...' : interpretation;
    }
    if ('analysis' in item.result) {
      const analysis = item.result.analysis as string;
      return analysis.length > 100 ? analysis.substring(0, 100) + '...' : analysis;
    }
  }
  
  return '点击查看完整结果...';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return '刚刚';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`;
  return `${Math.floor(diffInSeconds / 2592000)}月前`;
};

const removeItem = (id: string) => {
  if (confirm('您确定要删除这条记录吗？此操作不可撤销。')) {
    historyStore.removeHistory(id);
  }
};

// 获取塔罗卡牌数据
const getTarotCards = (item: HistoryItem): any[] => {
  if (item.type !== 'tarot' || !item.result || typeof item.result !== 'object') {
    return [];
  }
  return item.result.cards || [];
};

// 获取塔罗牌阵名称
const getTarotSpread = (item: HistoryItem): string => {
  if (item.type !== 'tarot' || !item.result || typeof item.result !== 'object') {
    return '';
  }
  return item.result.spread || '';
};

// 获取核心洞察
const getKeyInsight = (item: HistoryItem): string => {
  if (item.type === 'tarot' && item.result && typeof item.result === 'object') {
    const interpretation = item.result.interpretation;
    if (Array.isArray(interpretation) && interpretation.length > 0) {
      // 尝试获取最重要的卡牌解读
      const mainCard = interpretation.find((section: any) => 
        section.position && (section.position.includes('核心') || section.position.includes('现状') || section.position.includes('主要'))
      ) || interpretation[0];
      
      if (mainCard && mainCard.keyMessage) {
        return mainCard.keyMessage.length > 150 ? mainCard.keyMessage.substring(0, 150) + '...' : mainCard.keyMessage;
      }
      if (mainCard && mainCard.summary) {
        return mainCard.summary.length > 150 ? mainCard.summary.substring(0, 150) + '...' : mainCard.summary;
      }
      if (mainCard && mainCard.content) {
        // 提取第一句话作为核心洞察
        const firstSentence = mainCard.content.split(/[。！？.!?]/)[0];
        return firstSentence.length > 150 ? firstSentence.substring(0, 150) + '...' : firstSentence + '。';
      }
    }
    
    // 如果有总体解读
    if (item.result.overallReading) {
      const firstSentence = item.result.overallReading.split(/[。！？.!?]/)[0];
      return firstSentence.length > 150 ? firstSentence.substring(0, 150) + '...' : firstSentence + '。';
    }
  }
  
  // 处理其他类型的占卜
  if (item.result && typeof item.result === 'string') {
    const firstSentence = item.result.split(/[。！？.!?]/)[0];
    return firstSentence.length > 150 ? firstSentence.substring(0, 150) + '...' : firstSentence + '。';
  }
  
  if (item.result && typeof item.result === 'object' && item.result.content) {
    const firstSentence = item.result.content.split(/[。！？.!?]/)[0];
    return firstSentence.length > 150 ? firstSentence.substring(0, 150) + '...' : firstSentence + '。';
  }
  
  return getResultPreview(item);
};

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/src/assets/new-card-back.png'; // 使用卡背作为备用图片
};

const shareItem = (item: HistoryItem) => {
  if (item.type === 'tarot') {
    // 为塔罗卡牌创建分享数据
    const shareData: ShareData = {
      title: item.title,
      text: `🔮 ${item.title}\n\n${item.question ? `💭 咨询问题：${item.question}\n\n` : ''}🎴 ${getTarotSpread(item)}\n\n✨ 核心洞察：${getKeyInsight(item)}\n\n通过天玄Web获得的塔罗指引`,
      hashtags: ['塔罗占卜', '天玄Web', '玄学指引'],
      url: window.location.origin
    };
    
    // 获取塔罗卡牌数据用于图片生成
    const revealedCards = getTarotCards(item);
    
    // 使用SharePanel组件进行高级分享
    openSharePanel(shareData, revealedCards);
  } else {
    // 其他类型的占卜结果使用传统分享方式
    const shareData: ShareData = {
      title: item.title,
      text: `🔮 ${item.title}\n\n${item.question ? `💭 问题：${item.question}\n\n` : ''}✨ 核心洞察：${getKeyInsight(item)}\n\n通过天玄Web获得的${getTypeLabel(item.type)}指引`,
      hashtags: [getTypeLabel(item.type), '天玄Web', '玄学指引'],
      url: window.location.origin
    };
    
    // 检查是否支持原生分享
    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        // 原生分享失败，fallback到复制
        copyToClipboard(item);
      });
    } else {
      // 不支持原生分享，使用复制到剪贴板
      copyToClipboard(item);
    }
  }
};

const copyToClipboard = async (item: HistoryItem, event?: Event) => {
  try {
    let textToCopy = `${item.title}\n\n`;
    if (item.question) {
      textToCopy += `问题：${item.question}\n\n`;
    }
    textToCopy += `结果：${getResultPreview(item)}\n\n`;
    textToCopy += `时间：${formatDate(item.date)}\n`;
    textToCopy += `来源：天玄Web占卜平台`;
    
    await navigator.clipboard.writeText(textToCopy);
    
    // Show success feedback
    if (event) {
      const button = event.target as HTMLElement;
      const originalText = button.textContent;
      button.textContent = '已复制！';
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    }
  } catch (err) {
    console.error('复制失败:', err);
    alert('复制失败，请手动选择文本复制');
  }
};

const goBack = () => {
  router.back();
};

const openSharePanel = (shareData: ShareData, revealedCards: any[]) => {
  sharePanel.shareData = shareData;
  sharePanel.revealedCards = revealedCards;
  sharePanel.isOpen = true;
};

const closeSharePanel = () => {
  sharePanel.isOpen = false;
  sharePanel.shareData = undefined;
  sharePanel.revealedCards = [];
};

// 查看完整解读
const viewFullReading = (item: HistoryItem) => {
  // 根据不同类型的占卜跳转到相应的结果页面
  if (item.type === 'tarot') {
    // 跳转到塔罗牌结果页面，携带历史数据
    router.push({
      path: '/tarot/result',
      query: {
        fromHistory: 'true',
        historyId: item.id
      }
    });
  } else if (item.type === 'divination') {
    // 跳转到六爻占卜结果页面
    router.push({
      path: '/dilemma/result',
      query: {
        fromHistory: 'true',
        historyId: item.id
      }
    });
  } else if (item.type === 'fortune') {
    // 跳转到运势结果页面
    router.push({
      path: '/fortune/result',
      query: {
        fromHistory: 'true',
        historyId: item.id
      }
    });
  } else if (item.type === 'jiaoBei') {
    // 跳转到交杯结果页面
    router.push({
      path: '/jiao-bei/result',
      query: {
        fromHistory: 'true',
        historyId: item.id
      }
    });
  } else {
    console.warn('未知的占卜类型:', item.type);
    // 使用通用的历史详情页面
    router.push({
      path: '/history/detail',
      query: {
        id: item.id
      }
    });
  }
};

onMounted(() => {
  historyStore.fetchHistory();
});
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 