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
        <div class="flex items-center">
          <button class="p-2 rounded-full text-gray-500 hover:text-primary focus:outline-none transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

// 检查当前路由是否激活
const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`);
};
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition;
}

.nav-link.active {
  @apply text-primary font-semibold;
}
</style> 