<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <button @click="goBack" class="text-gray-600 hover:text-gray-800">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="text-lg font-semibold text-gray-900">个人信息</h1>
        <button @click="saveProfile" :disabled="isSaving" class="text-blue-600 hover:text-blue-700 font-medium">
          {{ isSaving ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>

    <!-- 个人资料内容 -->
    <div class="max-w-md mx-auto">
      <!-- 头像部分 -->
      <div class="bg-white mt-2">
        <div class="px-4 py-6 flex items-center justify-between">
          <span class="text-gray-700 font-medium">头像</span>
          <div class="flex items-center space-x-3">
            <div class="relative">
              <img 
                :src="profileData.avatar_url || defaultAvatar" 
                :alt="profileData.username"
                class="w-16 h-16 rounded-lg object-cover"
              />
              <button 
                @click="showAvatarOptions"
                class="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs"
              >
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                </svg>
              </button>
            </div>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- 基本信息 -->
      <div class="bg-white mt-2">
        <!-- 用户名 -->
        <div class="px-4 py-4 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <span class="text-gray-700 font-medium">用户名</span>
            <div class="flex items-center space-x-3">
              <input 
                v-model="profileData.username"
                class="text-right text-gray-900 bg-transparent border-none outline-none"
                placeholder="设置用户名"
                maxlength="20"
              />
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- 个性签名 -->
        <div class="px-4 py-4 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <span class="text-gray-700 font-medium">个性签名</span>
            <div class="flex items-center space-x-3">
              <input 
                v-model="profileData.bio"
                class="text-right text-gray-900 bg-transparent border-none outline-none"
                placeholder="设置个性签名"
                maxlength="50"
              />
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- 性别 -->
        <div class="px-4 py-4 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <span class="text-gray-700 font-medium">性别</span>
            <div class="flex items-center space-x-3">
              <select 
                v-model="profileData.gender"
                class="text-right text-gray-900 bg-transparent border-none outline-none"
              >
                <option value="">未设置</option>
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </select>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- 地区 -->
        <div class="px-4 py-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-700 font-medium">地区</span>
            <div class="flex items-center space-x-3">
              <input 
                v-model="profileData.location"
                class="text-right text-gray-900 bg-transparent border-none outline-none"
                placeholder="设置地区"
                maxlength="30"
              />
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 账户信息 -->
      <div class="bg-white mt-2">
        <!-- 用户ID -->
        <div class="px-4 py-4 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <span class="text-gray-700 font-medium">用户ID</span>
            <div class="flex items-center space-x-3">
              <span class="text-gray-500 text-sm font-mono">{{ userStore.currentUser?.id }}</span>
              <button @click="copyUserId" class="text-blue-600 text-sm">复制</button>
            </div>
          </div>
        </div>

        <!-- 邮箱 -->
        <div class="px-4 py-4 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <span class="text-gray-700 font-medium">邮箱</span>
            <span class="text-gray-500 text-sm">{{ userStore.currentUser?.email }}</span>
          </div>
        </div>

        <!-- 注册时间 -->
        <div class="px-4 py-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-700 font-medium">注册时间</span>
            <span class="text-gray-500 text-sm">{{ formattedJoinDate }}</span>
          </div>
        </div>
      </div>

      <!-- 其他设置 -->
      <div class="bg-white mt-2">
        <!-- 个人网站 -->
        <div class="px-4 py-4 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <span class="text-gray-700 font-medium">个人网站</span>
            <div class="flex items-center space-x-3">
              <input 
                v-model="profileData.website"
                class="text-right text-gray-900 bg-transparent border-none outline-none"
                placeholder="设置个人网站"
                type="url"
              />
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- 生日 -->
        <div class="px-4 py-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-700 font-medium">生日</span>
            <div class="flex items-center space-x-3">
              <input 
                v-model="profileData.birthday"
                class="text-right text-gray-900 bg-transparent border-none outline-none"
                type="date"
              />
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 头像选择弹窗 -->
    <AvatarSelector 
      v-if="showAvatarSelector"
      :current-avatar="profileData.avatar_url"
      @close="showAvatarSelector = false"
      @select="updateAvatar"
    />

    <!-- 成功提示 -->
    <div v-if="showSuccess" class="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      个人信息保存成功！
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/userStore';
import AvatarSelector from '../components/profile/AvatarSelector.vue';

const router = useRouter();
const userStore = useUserStore();

// 组件状态
const isSaving = ref(false);
const showAvatarSelector = ref(false);
const showSuccess = ref(false);

// 个人资料数据
const profileData = ref({
  username: '',
  bio: '',
  gender: '',
  location: '',
  website: '',
  birthday: '',
  avatar_url: ''
});

// 默认头像
const defaultAvatar = computed(() => {
  const firstLetter = profileData.value.username.charAt(0).toUpperCase() || 'U';
  // 使用SVG生成默认头像
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#8B5CF6"/>
      <text x="32" y="40" font-family="Arial" font-size="28" fill="white" text-anchor="middle">${firstLetter}</text>
    </svg>
  `)}`;
});

// 格式化注册时间
const formattedJoinDate = computed(() => {
  if (!userStore.currentUser?.created_at) return '';
  const date = new Date(userStore.currentUser.created_at);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// 初始化数据
onMounted(() => {
  const user = userStore.currentUser;
  if (user) {
    const metadata = user.user_metadata as any || {};
    profileData.value = {
      username: metadata.username || (user as any).username || '',
      bio: metadata.bio || '',
      gender: metadata.gender || '',
      location: metadata.location || '',
      website: metadata.website || '',
      birthday: metadata.birthday || '',
      avatar_url: metadata.avatar_url || ''
    };
  }
});

// 返回上一页
const goBack = () => {
  router.back();
};

// 保存个人资料
const saveProfile = async () => {
  isSaving.value = true;
  
  try {
    // 获取当前用户
    const currentUser = userStore.currentUser;
    if (!currentUser) {
      throw new Error('用户信息不存在');
    }

    // 更新用户元数据
    const updatedUser = {
      ...currentUser,
      username: profileData.value.username,
      user_metadata: {
        ...currentUser.user_metadata,
        ...profileData.value
      },
      updated_at: new Date().toISOString()
    };

    // 更新本地存储
    const users = JSON.parse(localStorage.getItem('tianxuan_local_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('tianxuan_local_users', JSON.stringify(users));
      localStorage.setItem('tianxuan_current_user', JSON.stringify(updatedUser));
    }

    // 更新store中的用户数据
    userStore.currentUser = updatedUser;

    // 显示成功提示
    showSuccess.value = true;
    setTimeout(() => {
      showSuccess.value = false;
    }, 2000);

  } catch (error) {
    console.error('保存个人资料失败:', error);
    alert('保存失败，请稍后重试');
  } finally {
    isSaving.value = false;
  }
};

// 显示头像选择器
const showAvatarOptions = () => {
  showAvatarSelector.value = true;
};

// 更新头像
const updateAvatar = (avatarUrl: string) => {
  profileData.value.avatar_url = avatarUrl;
  showAvatarSelector.value = false;
};

// 复制用户ID
const copyUserId = async () => {
  const userId = userStore.currentUser?.id;
  if (userId) {
    try {
      await navigator.clipboard.writeText(userId);
      alert('用户ID已复制到剪贴板');
    } catch (err) {
      // 兜底方案
      const textArea = document.createElement('textarea');
      textArea.value = userId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('用户ID已复制到剪贴板');
    }
  }
};
</script>

<style scoped>
/* 隐藏输入框的默认样式 */
input:focus {
  outline: none;
}

select:focus {
  outline: none;
}

/* 移除select的默认样式 */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
