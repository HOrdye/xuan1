<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg max-w-sm w-full max-h-96 overflow-y-auto">
      <!-- 头部 -->
      <div class="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">选择头像</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- 选项列表 -->
      <div class="p-4 space-y-3">
        <!-- 拍照选项 -->
        <button 
          @click="openCamera"
          class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <span class="text-gray-700">拍照</span>
        </button>

        <!-- 从相册选择 -->
        <button 
          @click="openGallery"
          class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <span class="text-gray-700">从相册选择</span>
        </button>

        <!-- 默认头像选择 -->
        <div class="border-t border-gray-200 pt-3">
          <p class="text-sm text-gray-500 mb-3">选择默认头像</p>
          <div class="grid grid-cols-4 gap-3">
            <button
              v-for="(avatar, index) in defaultAvatars"
              :key="index"
              @click="selectDefaultAvatar(avatar)"
              class="aspect-square rounded-lg overflow-hidden border-2 hover:border-blue-500 transition-colors"
              :class="currentAvatar === avatar ? 'border-blue-500' : 'border-gray-200'"
            >
              <img :src="avatar" :alt="`默认头像${index + 1}`" class="w-full h-full object-cover"/>
            </button>
          </div>
        </div>
      </div>

      <!-- 隐藏的文件输入 -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        capture="environment"
        class="hidden"
        @change="handleFileSelect"
      />
      
      <input
        ref="galleryInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  currentAvatar: string;
}>();

const emit = defineEmits(['close', 'select']);

const fileInput = ref<HTMLInputElement>();
const galleryInput = ref<HTMLInputElement>();

// 默认头像列表
const defaultAvatars = computed(() => {
  const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#84CC16'];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  
  return colors.map((color, index) => {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" fill="${color}"/>
        <text x="32" y="40" font-family="Arial" font-size="28" fill="white" text-anchor="middle">${letters[index]}</text>
      </svg>
    `)}`;
  });
});

// 打开相机
const openCamera = () => {
  fileInput.value?.click();
};

// 打开相册
const openGallery = () => {
  galleryInput.value?.click();
};

// 选择默认头像
const selectDefaultAvatar = (avatar: string) => {
  emit('select', avatar);
};

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // 检查文件大小（限制为5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB');
      return;
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 读取文件并转换为base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // 这里可以添加图片压缩和裁剪逻辑
        emit('select', result);
      }
    };
    reader.readAsDataURL(file);
  }
};
</script> 