<template>
  <div class="fixed bottom-0 left-0 w-full bg-white border-t py-2 px-4">
    <div class="flex justify-around items-center">
      <router-link to="/" class="flex flex-col items-center text-primary">
        <i class="fas fa-home text-xl"></i>
        <span class="text-xs mt-1">首页</span>
      </router-link>
      
      <router-link to="/dilemma" class="flex flex-col items-center text-gray-500 hover:text-primary">
        <i class="fas fa-lightbulb text-xl"></i>
        <span class="text-xs mt-1">玄选两难</span>
      </router-link>
      
      <router-link to="/fortune" class="flex flex-col items-center text-gray-500 hover:text-primary">
        <i class="fas fa-calendar-alt text-xl"></i>
        <span class="text-xs mt-1">今日运势</span>
      </router-link>
      
      <router-link to="/profile" class="flex flex-col items-center text-gray-500 hover:text-primary">
        <i class="fas fa-user text-xl"></i>
        <span class="text-xs mt-1">我的</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入需要的依赖
</script>

<style scoped>
/* @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'); */ /* 移除了 FontAwesome */

/* 为选中的路由项目设置活跃状态 */
.router-link-active {
  color: var(--primary-color, #7E57C2);
}
</style> 