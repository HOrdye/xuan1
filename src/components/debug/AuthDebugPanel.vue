<template>
  <div class="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm">
    <h3 class="text-lg font-bold mb-2">🔧 认证调试面板</h3>
    
    <div class="space-y-2 text-sm">
      <div>
        <strong>本地用户数量:</strong> {{ localUsersCount }}
      </div>
      <div>
        <strong>当前用户:</strong> {{ currentUser ? currentUser.email : '未登录' }}
      </div>
    </div>

    <div class="mt-4 space-y-2">
      <button
        @click="testLocalRegister"
        class="w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
      >
        测试本地注册
      </button>
      
      <button
        @click="clearLocalData"
        class="w-full px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
      >
        清除本地数据
      </button>
      
      <button
        @click="showLocalUsers"
        class="w-full px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
      >
        显示本地用户
      </button>
    </div>

    <div v-if="debugMessage" class="mt-2 p-2 bg-gray-700 rounded text-xs">
      {{ debugMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../store/userStore';

const userStore = useUserStore();
const localUsersCount = ref(0);
const currentUser = ref<any>(null);
const debugMessage = ref('');

const updateStatus = () => {
  const users = JSON.parse(localStorage.getItem('tianxuan_local_users') || '[]');
  localUsersCount.value = users.length;
  
  const current = localStorage.getItem('tianxuan_current_user');
  currentUser.value = current ? JSON.parse(current) : null;
};

const testLocalRegister = async () => {
  console.log('🔧 开始测试本地注册...');
  debugMessage.value = '开始测试注册...';
  
  try {
    const result = await userStore.signUp(
      'debug@test.com',
      '123456',
      '123456',
      'debuguser'
    );
    
    console.log('📊 注册结果:', result);
    debugMessage.value = result.success ? '注册成功！' : `注册失败: ${result.message}`;
    updateStatus();
  } catch (error: any) {
    console.error('❌ 测试注册失败:', error);
    debugMessage.value = `测试失败: ${error.message}`;
  }
};

const clearLocalData = () => {
  localStorage.removeItem('tianxuan_local_users');
  localStorage.removeItem('tianxuan_current_user');
  debugMessage.value = '本地数据已清除';
  updateStatus();
};

const showLocalUsers = () => {
  const users = JSON.parse(localStorage.getItem('tianxuan_local_users') || '[]');
  console.log('👥 本地用户列表:', users);
  debugMessage.value = `显示了 ${users.length} 个用户（查看控制台）`;
};

onMounted(() => {
  updateStatus();
  // 每秒更新状态
  setInterval(updateStatus, 1000);
});
</script> 