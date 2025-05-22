<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary mb-4">404</h1>
      <h2 class="text-3xl font-semibold text-gray-800 mb-6">页面不见了</h2>
      
      <p class="text-lg text-gray-600 mb-8">
        哎呀，你寻找的玄妙之境暂时无法抵达...
      </p>
      
      <div class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <router-link 
          to="/" 
          class="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition shadow-md"
        >
          返回首页
        </router-link>
        
        <router-link 
          :to="{ name: 'VisualAnalysisNetwork' }" 
          class="px-6 py-3 bg-white text-primary font-medium rounded-lg border border-primary hover:bg-primary/5 transition"
        >
          进入视觉分析
        </router-link>
      </div>
    </div>
    
    <!-- 装饰图形 -->
    <div class="mt-12 relative w-64 h-64">
      <div class="absolute inset-0 bg-gradient-to-r from-primary/10 to-mystic/10 rounded-full animate-pulse-slow"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl">
        ✨
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404页面 - 无需额外逻辑
</script>

<style scoped>
/* 额外的样式可以在这里添加 */
</style> 