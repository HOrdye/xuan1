<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- 顶部导航 -->
    <div class="max-w-md mx-auto mb-6">
      <div class="flex items-center justify-between">
        <button 
          @click="goBack"
          class="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-100 rounded-lg transition-colors shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span class="text-sm">返回</span>
        </button>
        
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">我的收藏</h1>
          <p class="text-sm text-gray-500 mt-1">{{ favorites.length }} 个收藏</p>
        </div>
        
        <div class="w-20"></div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="max-w-md mx-auto text-center py-20">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      <p class="mt-4 text-gray-600">正在加载收藏...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="favorites.length === 0" class="max-w-md mx-auto text-center py-20">
      <div class="text-6xl mb-4">📚</div>
      <h2 class="text-xl font-semibold text-gray-700 mb-2">还没有收藏</h2>
      <p class="text-gray-500 mb-6">在占卜结果页面点击收藏按钮，将喜欢的内容保存到这里</p>
      <button 
        @click="goToHome"
        class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        开始占卜
      </button>
    </div>

    <!-- 收藏列表 -->
    <div v-else class="max-w-md mx-auto space-y-4">
      <div 
        v-for="favorite in favorites" 
        :key="favorite.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
      >
        <!-- 收藏项头部 -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="text-2xl">{{ getTypeIcon(favorite.item.type) }}</div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ favorite.item.title }}</h3>
              <p class="text-sm text-gray-500">{{ formatDate(favorite.created_at) }}</p>
            </div>
          </div>
          <button 
            @click="removeFavorite(favorite.id)"
            class="text-red-500 hover:text-red-700 p-1"
            title="取消收藏"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
            </svg>
          </button>
        </div>

        <!-- 收藏内容预览 -->
        <div class="mb-3">
          <p v-if="favorite.item.question" class="text-sm text-gray-600 italic mb-2">
            "{{ favorite.item.question }}"
          </p>
          <p class="text-sm text-gray-700 line-clamp-3">
            {{ getPreviewText(favorite.item) }}
          </p>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-100">
          <span class="text-xs text-gray-500">
            {{ getTypeLabel(favorite.item.type) }}
          </span>
          <div class="flex space-x-2">
            <button 
              @click="viewFavorite(favorite)"
              class="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition-colors"
            >
              查看详情
            </button>
            <button 
              @click="shareFavorite(favorite)"
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              分享
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { UserStatsService } from '../services/userStatsService';

const router = useRouter();

// 响应式数据
const loading = ref(true);
const favorites = ref<any[]>([]);

// 加载收藏列表
const loadFavorites = async () => {
  loading.value = true;
  try {
    const allFavorites = JSON.parse(localStorage.getItem('tianxuan_favorites') || '[]');
    // 这里应该根据当前用户过滤，但目前简化处理
    favorites.value = allFavorites;
  } catch (error) {
    console.error('加载收藏失败:', error);
  } finally {
    loading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 返回首页
const goToHome = () => {
  router.push('/');
};

// 移除收藏
const removeFavorite = async (favoriteId: string) => {
  if (confirm('确定要取消收藏吗？')) {
    const success = await UserStatsService.removeFromFavorites(favoriteId);
    if (success) {
      // 重新加载收藏列表
      await loadFavorites();
    }
  }
};

// 查看收藏详情
const viewFavorite = (favorite: any) => {
  // 根据类型跳转到对应的详情页面
  if (favorite.item.id) {
    router.push({
      path: '/history/detail',
      query: { id: favorite.item.id }
    });
  }
};

// 分享收藏
const shareFavorite = (favorite: any) => {
  const shareText = `🔮 ${favorite.item.title}\n\n来自天玄Web的占卜收藏`;
  
  if (navigator.share) {
    navigator.share({
      title: favorite.item.title,
      text: shareText
    });
  } else {
    // 兜底方案
    navigator.clipboard.writeText(shareText).then(() => {
      alert('内容已复制到剪贴板');
    }).catch(() => {
      alert('分享功能暂不可用');
    });
  }
};

// 获取类型图标
const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    tarot: '🎴',
    divination: '☯️',
    fortune: '🌟',
    jiaoBei: '🪙'
  };
  return icons[type] || '🔮';
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

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 获取预览文本
const getPreviewText = (item: any) => {
  if (typeof item.result === 'string') {
    return item.result.substring(0, 100) + (item.result.length > 100 ? '...' : '');
  }
  if (item.result && item.result.content) {
    return item.result.content.substring(0, 100) + (item.result.content.length > 100 ? '...' : '');
  }
  return '暂无预览内容';
};

onMounted(() => {
  loadFavorites();
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 