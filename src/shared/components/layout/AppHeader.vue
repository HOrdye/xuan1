<template>
  <header class="bg-white shadow-sm">
    <nav class="container mx-auto px-4 py-3 flex items-center justify-between">
      <!-- Logo 区域 -->
      <div class="flex items-center">
        <router-link to="/" class="flex items-center text-xl font-bold text-primary">
          <span class="text-2xl mr-2">✨</span>
          天玄 Web
        </router-link>
      </div>
      
      <!-- 主导航 -->
      <div class="hidden md:flex space-x-6">
        <router-link 
          to="/"
          class="text-gray-600 hover:text-primary transition"
          active-class="text-primary font-medium"
          exact
        > 
          首页
        </router-link>
        
        <router-link 
          to="/dilemma" 
          class="text-gray-600 hover:text-primary transition"
          active-class="text-primary font-medium"
        >
          玄选两难
        </router-link>
        
        <div class="relative group"
             @mouseenter="showDropdown = true"
             @mouseleave="showDropdown = false">
          <div class="text-gray-600 hover:text-primary transition cursor-pointer flex items-center">
            <span>易经占卜</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
          <div v-if="showDropdown"
               class="absolute left-0 top-full w-48 bg-white rounded-md shadow-lg py-1 z-10"
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
        
        <router-link 
          to="/fortune" 
          class="text-gray-600 hover:text-primary transition"
          active-class="text-primary font-medium"
        >
          今日运势
        </router-link>
        
        <router-link 
          to="/hexagrams" 
          class="text-gray-600 hover:text-primary transition"
          active-class="text-primary font-medium"
        >
          六十四卦
        </router-link>
        
        <router-link 
          to="/tarot" 
          class="text-gray-600 hover:text-primary transition"
          active-class="text-primary font-medium"
        >
          塔罗牌
        </router-link>
      </div>
      
      <!-- 移动端菜单按钮 -->
      <div class="md:hidden">
        <button 
          @click="toggleMobileMenu" 
          class="text-gray-600 hover:text-primary transition"
        >
          <span v-if="!mobileMenuOpen" class="fas fa-bars text-xl"></span>
          <span v-else class="fas fa-times text-xl"></span>
        </button>
      </div>
    </nav>
    
    <!-- 移动端菜单 -->
    <div 
      v-if="mobileMenuOpen" 
      class="md:hidden bg-white py-2 px-4 shadow-inner"
    >
      <div class="flex flex-col space-y-3">
        <router-link 
          to="/" 
          class="py-2 text-gray-600 hover:text-primary transition"
          active-class="text-primary font-medium"
          exact
          @click="closeMobileMenu"
        >
          首页
        </router-link>
        
        <router-link 
          to="/dilemma" 
          class="py-2 text-gray-600 hover:text-primary transition"
          active-class="text-primary font-medium"
          @click="closeMobileMenu"
        >
          玄选两难
        </router-link>
        
        <div class="py-2">
          <div 
            @click="toggleSubMenu" 
            class="flex justify-between items-center text-gray-600 hover:text-primary transition cursor-pointer"
          >
            <span>易经占卜</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{'transform rotate-180': subMenuOpen}" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
          <div v-if="subMenuOpen" class="pl-4 mt-2 space-y-2">
            <router-link 
              to="/dilemma/divination" 
              class="block py-1 text-sm text-gray-600 hover:text-primary transition"
              @click="closeMobileMenu"
            >
              铜钱占卜法
            </router-link>
            <router-link 
              to="/dilemma/divination?method=plumBlossom" 
              class="block py-1 text-sm text-gray-600 hover:text-primary transition"
              @click="closeMobileMenu"
            >
              梅花易数法
            </router-link>
            <router-link 
              to="/dilemma/divination?method=random" 
              class="block py-1 text-sm text-gray-600 hover:text-primary transition"
              @click="closeMobileMenu"
            >
              随机起卦法
            </router-link>
          </div>
        </div>
        
        <router-link 
          to="/fortune" 
          class="py-2 text-gray-600 hover:text-primary transition"
          active-class="text-primary font-medium"
          @click="closeMobileMenu"
        >
          今日运势
        </router-link>
        
        <router-link 
          to="/hexagrams" 
          class="py-2 text-gray-600 hover:text-primary transition"
          active-class="text-primary font-medium"
          @click="closeMobileMenu"
        >
          六十四卦
        </router-link>
        
        <router-link 
          to="/tarot" 
          class="py-2 text-gray-600 hover:text-primary transition"
          active-class="text-primary font-medium"
          @click="closeMobileMenu"
        >
          塔罗牌
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 移动端菜单状态
const mobileMenuOpen = ref(false);
// 子菜单状态
const subMenuOpen = ref(false);
// 新增的 showDropdown 状态
const showDropdown = ref(false);

// 切换移动端菜单
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (!mobileMenuOpen.value) {
    subMenuOpen.value = false;
  }
};

// 切换子菜单
const toggleSubMenu = () => {
  subMenuOpen.value = !subMenuOpen.value;
};

// 关闭移动端菜单
const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  subMenuOpen.value = false;
};
</script>

<style scoped>
/* 确保FontAwesome图标正确显示 */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

/* 添加下拉菜单样式 */
.group:hover .absolute {
  display: block;
}
</style> 