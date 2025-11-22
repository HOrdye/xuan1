<template>
  <div class="ziwei-home min-h-screen relative overflow-hidden">
    <!-- 动态星空背景 -->
    <div class="cosmic-background">
      <div class="stars-layer"></div>
      <div class="nebula-layer"></div>
      <div class="energy-particles"></div>
    </div>

    <!-- 页面内容 -->
    <div class="relative z-10 p-4 pb-20">
      <!-- 新手引导页（首次访问或点击"了解紫微斗数"时显示） -->
      <GuideSection
        v-if="showGuide"
        @start="handleGuideStart"
        @show-term="handleShowTerm"
      />

      <!-- 主页面内容（默认显示） -->
      <div v-else>
        <!-- 返回引导按钮 -->
        <div class="back-to-guide" v-if="!showGuide">
          <n-button
            text
            type="primary"
            @click="showGuide = true"
            class="back-button"
          >
            ← 了解紫微斗数
          </n-button>
        </div>

        <!-- 英雄区域 -->
        <div class="hero-section mb-8">
        <div class="title-container">
          <h1 class="main-title">
            <img 
              :src="iconUrl" 
              alt="紫微斗数" 
              class="title-icon"
              @error="handleIconError"
            />
            <span class="title-text">紫微斗数</span>
          </h1>
          <p class="subtitle">观星盘，知天命，做自己命运的设计师</p>
          <div class="title-decoration">
            <div class="decoration-line"></div>
            <div class="decoration-symbol">✨</div>
            <div class="decoration-line"></div>
          </div>
        </div>
      </div>

      <!-- 功能说明卡片 -->
      <div class="intro-section mb-8">
        <div class="intro-card clickable" @click="showGuide = true">
          <div class="intro-icon">📚</div>
          <div class="intro-content">
            <h3 class="intro-title">什么是紫微斗数？</h3>
            <p class="intro-text">紫微斗数是中国传统命理学的重要分支，通过排盘分析十二宫位，揭示人生各个方面的运势和性格特征。</p>
            <div class="intro-link">
              <span class="link-text">点击了解详细概念 →</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮区域 -->
      <div class="action-section mb-8">
        <div class="action-grid">
          <!-- 我的命盘：如果用户已登录且有出生信息，显示此按钮 -->
          <div 
            v-if="hasUserBirthInfo" 
            class="action-card primary" 
            @click="viewMyChart"
          >
            <div class="action-icon">🌟</div>
            <h3 class="action-title">我的命盘</h3>
            <p class="action-description">基于你的个人信息生成专属命盘，只需补充出生时辰</p>
            <div class="action-hint">查看我的命盘 →</div>
          </div>

          <!-- 生成他人命盘：用于家人、朋友、名人明星等 -->
          <div 
            class="action-card" 
            :class="{ 'primary': !hasUserBirthInfo }"
            @click="createOtherChart"
          >
            <div class="action-icon">👥</div>
            <h3 class="action-title">生成他人命盘</h3>
            <p class="action-description">为家人、朋友或名人明星生成命盘分析</p>
            <div class="action-hint">开始创建 →</div>
          </div>

          <!-- 人格探索：自我认知探索工具（独立功能，不需要先有命盘） -->
          <div 
            class="action-card secondary" 
            @click="startPersonalityTest"
          >
            <div class="action-icon">🔍</div>
            <h3 class="action-title">探索你的潜在人格特质</h3>
            <p class="action-description">
              通过简单问题，发现你可能没有意识到的自己，看看与古代智慧如何共鸣
            </p>
            <div class="action-hint">开始探索 →</div>
          </div>
        </div>
      </div>

      <!-- 调试信息面板（开发模式） -->
      <div v-if="isDev" class="debug-panel">
        <details>
          <summary style="cursor: pointer; color: #9333EA; font-weight: bold; margin-bottom: 0.5rem;">
            🔍 调试信息（点击展开）
          </summary>
          <div style="background: rgba(0,0,0,0.05); padding: 1rem; border-radius: 8px; font-size: 0.85rem; font-family: monospace;">
            <div><strong>已登录:</strong> {{ userStore.isAuthenticated }}</div>
            <div><strong>有出生信息:</strong> {{ hasUserBirthInfo }}</div>
            <div><strong>currentUser.user_metadata:</strong></div>
            <pre style="background: rgba(0,0,0,0.05); padding: 0.5rem; border-radius: 4px; overflow-x: auto; max-height: 200px;">
{{ JSON.stringify(userStore.currentUser?.user_metadata || {}, null, 2) }}
            </pre>
            <div><strong>userMetadata:</strong></div>
            <pre style="background: rgba(0,0,0,0.05); padding: 0.5rem; border-radius: 4px; overflow-x: auto; max-height: 200px;">
{{ JSON.stringify(userStore.userMetadata || {}, null, 2) }}
            </pre>
            <div><strong>localStorage 中的用户数据:</strong></div>
            <pre style="background: rgba(0,0,0,0.05); padding: 0.5rem; border-radius: 4px; overflow-x: auto; max-height: 200px;">
{{ getLocalStorageUser() }}
            </pre>
          </div>
        </details>
      </div>

      <!-- 命盘预览：仅在有当前命盘时显示 -->
      <div v-if="currentChart" class="chart-preview">
        <div class="preview-header">
          <h3 class="preview-title">✨ 当前命盘</h3>
          <p class="preview-subtitle">
            命宫主星：<span class="highlight">{{ mainStarName }}</span>
            <span v-if="currentChart.birthInfo.gender === 'male'"> · 男</span>
            <span v-else> · 女</span>
            <span> · {{ currentChart.birthInfo.year }}年{{ currentChart.birthInfo.month }}月{{ currentChart.birthInfo.day }}日</span>
          </p>                                                           
        </div>
        <div class="preview-actions">
          <n-button
            type="primary"
            size="large"
            @click="viewFullChart"
            class="preview-button"
          >
            查看完整命盘
          </n-button>
          <n-button
            type="default"
            size="large"
            @click="createOtherChart"
            class="preview-button"
          >
            生成新命盘
          </n-button>
        </div>
      </div>
      </div>
    </div>

    <!-- 术语词典弹窗 -->
    <TermDictionary
      v-model:show="showTermModal"
      :term="currentTerm"
      @show-term="handleShowTerm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onActivated, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useZiweiStore } from '../store/ziweiStore';
import { useUserStore } from '../../../store/userStore';
import { NButton } from 'naive-ui';
import { GuideSection, TermDictionary } from '../components';

const router = useRouter();
const ziweiStore = useZiweiStore();
const userStore = useUserStore();

// 开发模式标志
const isDev = import.meta.env.DEV;

// 新手引导页显示状态
// 检查是否首次访问（未看过引导页）
const hasSeenGuide = localStorage.getItem('ziwei_has_seen_guide') === 'true';
const showGuide = ref(!hasSeenGuide);

// 术语词典弹窗状态
const showTermModal = ref(false);
const currentTerm = ref('');

// 处理引导页开始按钮
const handleGuideStart = () => {
  showGuide.value = false;
  // 标记用户已看过引导页
  localStorage.setItem('ziwei_has_seen_guide', 'true');
};

// 处理显示术语
const handleShowTerm = (term: string) => {
  currentTerm.value = term;
  showTermModal.value = true;
};

// 图标URL（public文件夹中的文件直接使用路径）
const iconUrl = '/ziwei-icon.svg';

// 处理图标加载错误（如果 .pix 格式不支持，使用备用图标）
const handleIconError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  // 如果图片加载失败，使用 emoji 作为备用
  if (img) {
    img.style.display = 'none';
    const emojiSpan = document.createElement('span');
    emojiSpan.className = 'title-icon-emoji';
    emojiSpan.textContent = '🌟';
    emojiSpan.style.fontSize = '6rem';
    img.parentNode?.insertBefore(emojiSpan, img);
  }
};

const currentChart = computed(() => ziweiStore.currentChart);
const isLoading = computed(() => ziweiStore.isLoading);
const mainStarName = computed(() => ziweiStore.mainStar?.name || '未知');

/**
 * 检查用户是否有出生信息（年月日）
 * 如果有，可以自动关联，只需补充时辰
 * 
 * 检查两个位置：
 * 1. userMetadata.birth_date（从user_metadata表加载）
 * 2. currentUser.user_metadata.birth_date（保存在用户认证信息中）
 */
const hasUserBirthInfo = computed(() => {
  // 使用 refreshTrigger 确保响应式更新
  refreshTrigger.value; // 读取以建立依赖关系
  
  if (!userStore.isAuthenticated) {
    if (isDev) {
      console.log('🔍 [hasUserBirthInfo] 用户未登录');
    }
    return false;
  }
  
  // 优先检查 userMetadata（从数据库表加载）
  const metadata = userStore.userMetadata;
  if (metadata?.birth_date) {
    try {
      const dateParts = metadata.birth_date.split('-');
      if (dateParts.length === 3 && dateParts[0] && dateParts[1] && dateParts[2]) {
        if (isDev) {
          console.log('✅ [hasUserBirthInfo] 从 userMetadata 找到出生日期:', metadata.birth_date);
        }
        return true;
      }
    } catch {
      // 解析失败，继续检查其他地方
    }
  }
  
  // 检查 currentUser.user_metadata（保存在认证信息中）
  const currentUser = userStore.currentUser;
  if (currentUser?.user_metadata) {
    const userMeta = currentUser.user_metadata;
    
    if (isDev) {
      console.log('🔍 [hasUserBirthInfo] 检查 currentUser.user_metadata:', userMeta);
    }
    
    // 检查 birth_date（标准字段名）
    if (userMeta.birth_date) {
      try {
        const dateParts = String(userMeta.birth_date).split('-');
        if (dateParts.length === 3 && dateParts[0] && dateParts[1] && dateParts[2]) {
          if (isDev) {
            console.log('✅ [hasUserBirthInfo] 从 currentUser.user_metadata.birth_date 找到:', userMeta.birth_date);
          }
          return true;
        }
      } catch {
        // 解析失败
      }
    }
    
    // 检查 birthday（ProfileEdit.vue 中使用的字段名）
    if (userMeta.birthday) {
      try {
        const dateParts = String(userMeta.birthday).split('-');
        if (dateParts.length === 3 && dateParts[0] && dateParts[1] && dateParts[2]) {
          if (isDev) {
            console.log('✅ [hasUserBirthInfo] 从 currentUser.user_metadata.birthday 找到:', userMeta.birthday);
          }
          return true;
        }
      } catch {
        // 解析失败
      }
    }
    
    // 也检查是否有年月日分开存储的情况
    if (userMeta.birth_year && userMeta.birth_month && userMeta.birth_day) {
      if (isDev) {
        console.log('✅ [hasUserBirthInfo] 从分开存储的年月日找到:', {
          year: userMeta.birth_year,
          month: userMeta.birth_month,
          day: userMeta.birth_day
        });
      }
      return true;
    }
  }
  
  if (isDev) {
    console.log('❌ [hasUserBirthInfo] 未找到出生信息');
  }
  
  return false;
});

/**
 * 获取用户的出生日期（年月日）
 * 从多个可能的位置读取
 */
const getUserBirthDate = (): { year: number; month: number; day: number } | null => {
  // 优先从 userMetadata 读取
  const metadata = userStore.userMetadata;
  if (metadata?.birth_date) {
    try {
      const [year, month, day] = metadata.birth_date.split('-').map(Number);
      if (year && month && day) {
        return { year, month, day };
      }
    } catch {
      // 解析失败
    }
  }
  
  // 从 currentUser.user_metadata 读取
  const currentUser = userStore.currentUser;
  if (currentUser?.user_metadata) {
    const userMeta = currentUser.user_metadata;
    
    // 检查 birth_date（标准字段名）
    if (userMeta.birth_date) {
      try {
        const [year, month, day] = String(userMeta.birth_date).split('-').map(Number);
        if (year && month && day) {
          return { year, month, day };
        }
      } catch {
        // 解析失败
      }
    }
    
    // 检查 birthday（ProfileEdit.vue 中使用的字段名）
    if (userMeta.birthday) {
      try {
        const [year, month, day] = String(userMeta.birthday).split('-').map(Number);
        if (year && month && day) {
          return { year, month, day };
        }
      } catch {
        // 解析失败
      }
    }
    
    // 检查分开存储的年月日
    if (userMeta.birth_year && userMeta.birth_month && userMeta.birth_day) {
      return {
        year: Number(userMeta.birth_year),
        month: Number(userMeta.birth_month),
        day: Number(userMeta.birth_day)
      };
    }
  }
  
  return null;
};

/**
 * 查看我的命盘
 * 如果已有命盘且匹配用户信息，直接查看
 * 否则跳转到输入页面，自动填充用户信息
 */
const viewMyChart = () => {
  // 检查当前命盘是否匹配用户信息
  if (currentChart.value && hasUserBirthInfo.value) {
    const birthDate = getUserBirthDate();
    if (birthDate) {
      const chart = currentChart.value;
      
      // 如果年月日匹配，直接查看
      if (chart.birthInfo.year === birthDate.year && 
          chart.birthInfo.month === birthDate.month && 
          chart.birthInfo.day === birthDate.day) {
        router.push('/ziwei/chart');
        return;
      }
    }
  }
  
  // 跳转到输入页面，传递模式标识
  router.push({
    path: '/ziwei/input',
    query: { mode: 'my' }
  });
};

/**
 * 生成他人命盘
 * 跳转到输入页面，完全手动输入
 */
const createOtherChart = () => {
  router.push({
    path: '/ziwei/input',
    query: { mode: 'other' }
  });
};

/**
 * 开始人格探索测试
 * 人格测试是独立的探索工具，不需要先有命盘
 * 测试完成后会引导用户生成命盘进行对比
 */
const startPersonalityTest = () => {
  // 直接跳转到人格测试页面
  // 测试与命盘完全独立，测试结果不影响命盘计算
  router.push('/ziwei/personality-test');
};

/**
 * 查看完整命盘
 */
const viewFullChart = () => {
  router.push('/ziwei/chart');
};

/**
 * 获取 localStorage 中的用户数据（用于调试）
 */
const getLocalStorageUser = () => {
  try {
    const userStr = localStorage.getItem('tianxuan_current_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return JSON.stringify({
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      }, null, 2);
    }
    return '未找到用户数据';
  } catch (error) {
    return `解析错误: ${error}`;
  }
};

// 强制刷新标志，用于触发计算属性重新计算
const refreshTrigger = ref(0);

// 监听 currentUser 的变化，确保在用户信息更新后重新检查
watch(
  () => userStore.currentUser,
  (newUser, oldUser) => {
    if (isDev) {
      console.log('🔄 [ZiweiHome] currentUser 发生变化:', {
        old: oldUser?.user_metadata,
        new: newUser?.user_metadata
      });
    }
    // 触发刷新
    refreshTrigger.value++;
  },
  { deep: true }
);

// 监听 userMetadata 的变化
watch(
  () => userStore.userMetadata,
  (newMetadata) => {
    if (isDev) {
      console.log('🔄 [ZiweiHome] userMetadata 发生变化:', newMetadata);
    }
    refreshTrigger.value++;
  },
  { deep: true }
);

// 从 localStorage 重新读取用户数据的辅助函数
const reloadUserFromLocalStorage = () => {
  try {
    const userStr = localStorage.getItem('tianxuan_current_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (userStore.currentUser?.id === user.id) {
        // 更新 currentUser，触发响应式更新
        userStore.currentUser = { ...userStore.currentUser, ...user };
        refreshTrigger.value++;
        return true;
      }
    }
  } catch (error) {
    if (isDev) {
      console.warn('⚠️ 从 localStorage 读取用户数据失败:', error);
    }
  }
  return false;
};

// 初始化时确保用户状态已加载
onMounted(async () => {
  if (!userStore.isInitialized) {
    await userStore.initialize();
  }
  
  // 如果用户已登录，尝试重新加载用户数据（确保获取最新的用户信息）
  if (userStore.isAuthenticated && userStore.currentUser) {
    try {
      await userStore.loadUserData(userStore.currentUser.id);
    } catch (error) {
      // 静默处理错误，不影响页面显示
      if (isDev) {
        console.log('⚠️ 重新加载用户数据失败（可能是本地模式）:', error);
      }
    }
  }
  
  // 延迟检查，确保数据已加载
  setTimeout(() => {
    if (isDev) {
      console.log('🔍 [ZiweiHome] 页面加载完成，检查用户信息:', {
        isAuthenticated: userStore.isAuthenticated,
        currentUser: userStore.currentUser,
        userMetadata: userStore.userMetadata,
        hasUserBirthInfo: hasUserBirthInfo.value
      });
    }
    refreshTrigger.value++;
  }, 500);

  // 监听用户信息更新事件
  const handleUserProfileUpdate = () => {
    if (isDev) {
      console.log('🔄 [ZiweiHome] 收到用户信息更新事件，重新检查');
    }
    reloadUserFromLocalStorage();
  };
  
  window.addEventListener('user-profile-updated', handleUserProfileUpdate);
  
  // 清理事件监听器
  return () => {
    window.removeEventListener('user-profile-updated', handleUserProfileUpdate);
  };
});

// 页面激活时（从其他页面返回时）重新检查
onActivated(() => {
  if (isDev) {
    console.log('🔄 [ZiweiHome] 页面激活，重新检查用户信息');
  }
  reloadUserFromLocalStorage();
  refreshTrigger.value++;
});
</script>

<style scoped>
.ziwei-home {
  min-height: 100vh;
  position: relative;
}

/* 动态星空背景 */
.cosmic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.stars-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(2px 2px at 20% 30%, #fff, transparent),
    radial-gradient(2px 2px at 60% 70%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 50% 50%, #fff, transparent),
    radial-gradient(1px 1px at 80% 10%, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 90% 60%, #fff, transparent),
    radial-gradient(1px 1px at 33% 80%, rgba(255,255,255,0.4), transparent);
  background-size: 200% 200%;
  animation: starsMove 20s linear infinite;
  opacity: 0.6;
}

@keyframes starsMove {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
}

.nebula-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%);
  animation: nebulaFloat 15s ease-in-out infinite;
}

@keyframes nebulaFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -20px) scale(1.1); }
}

.energy-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 30% 40%, rgba(147, 51, 234, 0.1) 0%, transparent 30%),
    radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 30%);
  animation: particlesPulse 8s ease-in-out infinite;
}

@keyframes particlesPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 英雄区域 */
.hero-section {
  text-align: center;
  margin-bottom: 3rem;
  padding-top: 2rem;
}

.title-container {
  max-width: 800px;
  margin: 0 auto;
}

.main-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #9333EA 0%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-icon {
  width: 6rem;
  height: 6rem;
  object-fit: contain;
  display: block;
}

.title-icon-emoji {
  font-size: 6rem;
  display: inline-block;
}

.title-text {
  font-size: 3.5rem;
}

.subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.decoration-line {
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
  animation: lineGlow 3s ease-in-out infinite;
}

@keyframes lineGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
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

/* 功能介绍卡片 */
.intro-section {
  max-width: 900px;
  margin: 0 auto 3rem;
}

.intro-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.intro-card.clickable {
  cursor: pointer;
}

.intro-card.clickable:hover {
  transform: translateY(-4px);
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 25px 50px rgba(139, 92, 246, 0.2);
}

.intro-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.intro-content {
  flex: 1;
}

.intro-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.intro-text {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.intro-link {
  margin-top: 0.5rem;
}

.link-text {
  color: #9333EA;
  font-weight: 600;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
}

.intro-card.clickable:hover .link-text {
  color: #7c3aed;
  transform: translateX(4px);
}

/* 操作按钮区域 */
.action-section {
  max-width: 900px;
  margin: 0 auto 3rem;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(139, 92, 246, 0.2);
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-card:hover::before {
  opacity: 1;
}

.action-card:hover {
  transform: translateY(-8px);
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
}

.action-card.primary {
  border-color: rgba(147, 51, 234, 0.3);
}

.action-card.secondary {
  opacity: 0.8;
}

.action-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.action-card.disabled:hover {
  transform: none;
  border-color: rgba(139, 92, 246, 0.2);
  box-shadow: none;
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.action-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.action-description {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.action-hint {
  font-size: 0.9rem;
  color: #9333EA;
  font-weight: 600;
  margin-top: auto;
}

/* 命盘预览 */
.chart-preview {
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.preview-header {
  margin-bottom: 1.5rem;
}

.preview-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.preview-subtitle {
  font-size: 1.1rem;
  color: #666;
}

.highlight {
  color: #9333EA;
  font-weight: bold;
}

.preview-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.preview-button {
  flex: 1;
  min-width: 140px;
  max-width: 300px;
}

/* 调试面板 */
.debug-panel {
  max-width: 900px;
  margin: 0 auto 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 1rem;
  font-size: 0.9rem;
}

.debug-panel details {
  width: 100%;
}

.debug-panel summary {
  padding: 0.5rem;
  border-radius: 6px;
  background: rgba(147, 51, 234, 0.1);
}

.debug-panel pre {
  margin-top: 0.5rem;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 返回引导按钮 */
.back-to-guide {
  text-align: left;
  margin-bottom: 1rem;
  padding: 0 1rem;
}

.back-button {
  font-size: 1rem;
  padding: 0.5rem 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .title-icon {
    width: 4rem;
    height: 4rem;
  }

  .action-grid {
    grid-template-columns: 1fr;
  }

  .intro-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>

