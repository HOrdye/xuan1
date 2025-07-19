<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- 顶部导航 -->
    <div class="max-w-md mx-auto mb-6">
      <div class="flex items-center justify-between">
        <button 
          @click="goBack"
          class="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-100 rounded-lg transition-colors shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span class="text-sm">返回</span>
        </button>
        
        <div class="text-center">
          <h1 class="text-xl font-bold text-gray-900">通知设置</h1>
          <p class="text-sm text-gray-500 mt-1">管理提醒和通知</p>
        </div>
        
        <div class="w-20"></div>
      </div>
    </div>

    <div class="max-w-md mx-auto space-y-4">
      <!-- 推送通知设置 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-4 py-3 border-b border-gray-100">
          <h2 class="font-semibold text-gray-900">推送通知</h2>
        </div>
        
        <div class="p-4 space-y-4">
          <!-- 每日运势提醒 -->
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900">每日运势提醒</div>
              <div class="text-sm text-gray-500">每天早上提醒您查看当日运势</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="settings.dailyFortune" 
                @change="saveSettings"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <!-- 占卜结果通知 -->
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900">占卜结果通知</div>
              <div class="text-sm text-gray-500">占卜完成时接收通知</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="settings.divinationResults" 
                @change="saveSettings"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <!-- 收藏提醒 -->
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900">收藏提醒</div>
              <div class="text-sm text-gray-500">定期提醒您回顾收藏的内容</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="settings.favoriteReminders" 
                @change="saveSettings"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- 提醒时间设置 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-4 py-3 border-b border-gray-100">
          <h2 class="font-semibold text-gray-900">提醒时间</h2>
        </div>
        
        <div class="p-4 space-y-4">
          <!-- 每日运势提醒时间 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              每日运势提醒时间
            </label>
            <input 
              type="time" 
              v-model="settings.dailyFortuneTime"
              @change="saveSettings"
              :disabled="!settings.dailyFortune"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <!-- 提醒频率 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              收藏提醒频率
            </label>
            <select 
              v-model="settings.reminderFrequency"
              @change="saveSettings"
              :disabled="!settings.favoriteReminders"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="daily">每天</option>
              <option value="weekly">每周</option>
              <option value="monthly">每月</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 声音设置 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-4 py-3 border-b border-gray-100">
          <h2 class="font-semibold text-gray-900">声音设置</h2>
        </div>
        
        <div class="p-4 space-y-4">
          <!-- 通知声音 -->
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900">通知声音</div>
              <div class="text-sm text-gray-500">接收通知时播放声音</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="settings.soundEnabled" 
                @change="saveSettings"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <!-- 振动 -->
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900">振动</div>
              <div class="text-sm text-gray-500">接收通知时设备振动</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="settings.vibrationEnabled" 
                @change="saveSettings"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- 隐私设置 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-4 py-3 border-b border-gray-100">
          <h2 class="font-semibold text-gray-900">隐私设置</h2>
        </div>
        
        <div class="p-4 space-y-4">
          <!-- 数据收集 -->
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900">使用数据收集</div>
              <div class="text-sm text-gray-500">帮助改进应用体验</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="settings.dataCollection" 
                @change="saveSettings"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <!-- 个性化推荐 -->
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900">个性化推荐</div>
              <div class="text-sm text-gray-500">基于使用习惯推荐内容</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="settings.personalizedRecommendations" 
                @change="saveSettings"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex space-x-4 pt-4">
        <button 
          @click="resetSettings"
          class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          恢复默认
        </button>
        <button 
          @click="testNotification"
          class="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          测试通知
        </button>
      </div>
    </div>

    <!-- 成功提示 -->
    <div v-if="showSuccess" class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      设置已保存
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 响应式数据
const showSuccess = ref(false);
const settings = ref({
  dailyFortune: true,
  divinationResults: true,
  favoriteReminders: false,
  dailyFortuneTime: '09:00',
  reminderFrequency: 'weekly',
  soundEnabled: true,
  vibrationEnabled: true,
  dataCollection: true,
  personalizedRecommendations: true
});

// 加载设置
const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('tianxuan_notification_settings');
    if (savedSettings) {
      settings.value = { ...settings.value, ...JSON.parse(savedSettings) };
    }
  } catch (error) {
    console.error('加载通知设置失败:', error);
  }
};

// 保存设置
const saveSettings = () => {
  try {
    localStorage.setItem('tianxuan_notification_settings', JSON.stringify(settings.value));
    showSuccess.value = true;
    setTimeout(() => {
      showSuccess.value = false;
    }, 2000);
  } catch (error) {
    console.error('保存通知设置失败:', error);
    alert('保存设置失败，请稍后重试');
  }
};

// 重置设置
const resetSettings = () => {
  if (confirm('确定要恢复默认设置吗？')) {
    settings.value = {
      dailyFortune: true,
      divinationResults: true,
      favoriteReminders: false,
      dailyFortuneTime: '09:00',
      reminderFrequency: 'weekly',
      soundEnabled: true,
      vibrationEnabled: true,
      dataCollection: true,
      personalizedRecommendations: true
    };
    saveSettings();
  }
};

// 测试通知
const testNotification = () => {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification('天玄Web', {
        body: '这是一条测试通知，您的通知设置工作正常！',
        icon: '/src/assets/logo.svg'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('天玄Web', {
            body: '通知权限已启用，这是一条测试通知！',
            icon: '/src/assets/logo.svg'
          });
        }
      });
    } else {
      alert('通知已被禁用，请在浏览器设置中启用通知权限');
    }
  } else {
    alert('您的浏览器不支持通知功能');
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

onMounted(() => {
  loadSettings();
});
</script> 