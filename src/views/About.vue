<template>
  <div class="about-page container mx-auto px-4 py-8">
    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">关于天玄Web</h1>
      
      <div class="space-y-6">
        <section>
          <h2 class="text-xl font-semibold text-primary mb-3">项目简介</h2>
          <p class="text-gray-700">
            天玄Web是一款专为90后、00后年轻人打造的玄学决策助手。我们相信，玄学不是宿命的枷锁，
            而是启迪思路、辅助决策的有趣工具。通过现代化的网页技术，为用户提供浏览器中即可轻松
            访问的、充满互动乐趣的玄学体验平台。
          </p>
          <p class="text-gray-700 mt-2">
            <strong>核心理念：</strong>告别刻板，拥抱"玄"妙乐趣，让每一次选择都有迹可循！
          </p>
        </section>
        
        <section>
          <h2 class="text-xl font-semibold text-primary mb-3">功能亮点</h2>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-2">六十四卦占卜系统</h3>
            <p class="text-gray-700">
              提供三种传统占卜方法：易经铜钱占卜法、梅花易数法和随机起卦法，
              让用户在面临抉择时获得灵感和启发。
            </p>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg mt-3">
            <h3 class="font-medium text-gray-800 mb-2">玄选两难系统</h3>
            <p class="text-gray-700">
              面临选择时，输入两个困惑选项，获取结合趣味玄学指引的分析结果，
              帮助用户在困扰中找到前进的方向。
            </p>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg mt-3">
            <h3 class="font-medium text-gray-800 mb-2">六十四卦探索器</h3>
            <p class="text-gray-700">
              浏览和探索所有六十四卦的详细信息，获取对易经智慧的深入解读，
              了解中国传统文化的精髓。
            </p>
          </div>
        </section>
        
        <section>
          <h2 class="text-xl font-semibold text-primary mb-3">项目愿景</h2>
          <p class="text-gray-700">
            天玄Web致力于将传统玄学文化以现代化、年轻化的方式呈现，让这些蕴含千年智慧的内容
            能够在当代社会继续发挥价值。我们希望通过有趣的交互方式和贴近年轻人的表达，让传统
            文化焕发新的生命力。
          </p>
          <p class="text-gray-700 mt-2">
            未来，我们将不断完善现有功能，并逐步推出更多玄学决策工具，为用户提供全方位的决策
            参考和灵感来源。
          </p>
        </section>
        
        <section>
          <h2 class="text-xl font-semibold text-primary mb-3">联系我们</h2>
          <p class="text-gray-700">
            如果您有任何建议或反馈，欢迎通过以下方式联系我们：
          </p>
          <div class="flex items-center mt-2">
            <span class="w-20 text-gray-600">邮箱：</span>
            <a href="mailto:contact@tianxuan.web" class="text-primary hover:underline">contact@tianxuan.web</a>
          </div>
          <div class="flex items-center mt-1">
            <span class="w-20 text-gray-600">微信：</span>
            <span>TianXuanWeb</span>
          </div>
        </section>
        
        <section>
          <h2 class="text-xl font-semibold text-primary mb-3">版本信息</h2>
          <div class="flex items-center">
            <span class="w-24 text-gray-600">当前版本：</span>
            <span>0.1.0 (开发中)</span>
          </div>
          <div class="flex items-center mt-1">
            <span class="w-24 text-gray-600">最后更新：</span>
            <span>2023年7月</span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style scoped>
.about-page {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style> 