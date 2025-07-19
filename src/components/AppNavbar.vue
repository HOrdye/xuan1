<template>
  <nav class="bg-white shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex justify-between h-16">
        <!-- 左侧Logo -->
        <div class="flex">
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <img class="h-8 w-8" src="../assets/logo.svg" alt="天玄Web" />
            <span class="ml-2 text-xl font-semibold text-gray-800">天玄Web</span>
          </router-link>
        </div>

        <!-- 主导航 -->
        <div class="hidden md:flex md:items-center md:space-x-4">
          <router-link to="/" class="nav-link" :class="{ 'active': isActive('/') }">首页</router-link>
          <router-link to="/dilemma/divination" class="nav-link" :class="{ 'active': isActive('/dilemma/divination') }">六爻占卜</router-link>
          <router-link to="/dilemma/test" class="nav-link" :class="{ 'active': isActive('/dilemma/test') }">两难抉择</router-link>
          <router-link to="/tarot" class="nav-link" :class="{ 'active': isActive('/tarot') }">塔罗牌</router-link>
          <router-link to="/fortune" class="nav-link" :class="{ 'active': isActive('/fortune') }">今日运势</router-link>
        </div>

        <!-- 右侧用户菜单 -->
        <div class="flex items-center space-x-3">
          <!-- 历史记录按钮 -->
          <router-link 
            to="/history" 
            class="p-2 rounded-full text-gray-500 hover:text-purple-600 focus:outline-none transition-colors"
            title="历史记录"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </router-link>

          <!-- 用户菜单 -->
          <div class="relative" ref="userMenuRef">
            <!-- 未登录状态 -->
            <button 
              v-if="!userStore.isAuthenticated"
              @click="openLoginModal"
              class="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-sm font-medium">登录</span>
            </button>

            <!-- 已登录状态 -->
            <div v-else class="flex items-center space-x-3">
              <!-- 用户头像/名称 -->
              <button 
                @click="toggleUserMenu"
                class="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {{ userStore.username.charAt(0).toUpperCase() }}
                </div>
                <span class="text-sm font-medium text-gray-700 max-w-20 truncate">
                  {{ userStore.username }}
                </span>
                <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- 下拉菜单 -->
              <transition name="dropdown">
                <div 
                  v-if="showUserMenu"
                  class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <router-link 
                    to="/profile" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    @click="closeUserMenu"
                  >
                    <div class="flex items-center space-x-2">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>个人资料</span>
                    </div>
                  </router-link>
                  
                  <router-link 
                    to="/history" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    @click="closeUserMenu"
                  >
                    <div class="flex items-center space-x-2">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>历史记录</span>
                    </div>
                  </router-link>

                  <div class="border-t border-gray-200 my-1"></div>
                  
                  <button 
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div class="flex items-center space-x-2">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>退出登录</span>
                    </div>
          </button>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 现代化登录模态框 -->
    <ModernAuthModal 
      :is-open="showLoginModal"
      @close="closeLoginModal"
      @success="handleLoginSuccess"
    />
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../store/userStore';
import ModernAuthModal from './auth/ModernAuthModal.vue';

const route = useRoute();
const userStore = useUserStore();

// 组件状态
const showUserMenu = ref(false);
const userMenuRef = ref<HTMLElement>();
const showLoginModal = ref(false);

// 检查当前路由是否激活
const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`);
};

// 打开登录模态框
const openLoginModal = () => {
  showLoginModal.value = true;
};

// 关闭登录模态框
const closeLoginModal = () => {
  showLoginModal.value = false;
};

// 切换用户菜单
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

// 关闭用户菜单
const closeUserMenu = () => {
  showUserMenu.value = false;
};

// 处理登出
const handleLogout = async () => {
  try {
    await userStore.signOut();
    closeUserMenu();
  } catch (error) {
    console.error('登出失败:', error);
  }
};

// 处理登录成功
const handleLoginSuccess = (data: any) => {
  console.log('登录成功:', data);
  closeLoginModal();
};

// 点击外部关闭用户菜单
const handleClickOutside = (event: Event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    closeUserMenu();
  }
};

// 初始化用户状态
onMounted(async () => {
  await userStore.initialize();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition;
}

.nav-link.active {
  @apply text-primary font-semibold;
}

/* 下拉菜单动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 