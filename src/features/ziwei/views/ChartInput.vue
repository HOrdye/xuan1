<template>
  <div class="chart-input min-h-screen relative overflow-hidden">
    <!-- 动态星空背景 -->
    <div class="cosmic-background">
      <div class="stars-layer"></div>
      <div class="nebula-layer"></div>
      <div class="energy-particles"></div>
    </div>

    <div class="relative z-10 p-4 pb-20">
      <!-- 页面标题 -->
      <div class="hero-section mb-8">
        <h1 class="page-title">
          <span v-if="isMyChartMode">🌟 我的命盘</span>
          <span v-else>👥 生成他人命盘</span>
        </h1>
        <p class="page-subtitle">
          <span v-if="isMyChartMode">基于你的个人信息，只需补充出生时辰即可生成命盘</span>
          <span v-else>填写完整的出生信息，为他人生成紫微命盘</span>
        </p>
        <div v-if="isMyChartMode && hasAutoFilled" class="auto-fill-hint">
          <span class="hint-icon">ℹ️</span>
          <span>已自动填充你的出生年月日，请补充出生时辰</span>
        </div>
      </div>

      <!-- 排盘动画和表单区域 -->
      <Transition name="fade" mode="out-in">
        <div v-if="showRitualAnimation" key="animation" class="ritual-animation-container">
          <ChartRitualAnimation
            :duration="3000"
            @complete="onRitualComplete"
          />
        </div>
        <div v-else key="form" class="form-container">
    
    <n-form :model="birthInfo" :rules="rules" ref="formRef">
      <n-form-item label="出生年份" path="year">
        <n-input-number
          v-model:value="birthInfo.year"
          :min="1900"
          :max="2100"
          :disabled="isMyChartMode && hasAutoFilled"
          placeholder="请输入出生年份"
        />
      </n-form-item>

      <n-form-item label="出生月份" path="month">
        <n-input-number
          v-model:value="birthInfo.month"
          :min="1"
          :max="12"
          :disabled="isMyChartMode && hasAutoFilled"
          placeholder="请输入出生月份"
        />
      </n-form-item>

      <n-form-item label="出生日期" path="day">
        <n-input-number
          v-model:value="birthInfo.day"
          :min="1"
          :max="31"
          :disabled="isMyChartMode && hasAutoFilled"
          placeholder="请输入出生日期"
        />
      </n-form-item>

      <n-form-item label="出生时辰" path="hour">
        <n-select 
          v-model:value="birthInfo.hour"
          :options="hourOptions"
          placeholder="请选择出生时辰"
        />
      </n-form-item>

      <n-form-item label="性别" path="gender">
        <n-radio-group v-model:value="birthInfo.gender">
          <n-radio value="male">男</n-radio>
          <n-radio value="female">女</n-radio>
        </n-radio-group>
      </n-form-item>

      <n-form-item>
        <div class="button-group">
          <n-button
            type="primary"
            size="large"
            @click="generateChart"
            :loading="isLoading"
            block
          >
            {{ isMyChartMode ? '生成我的命盘' : '生成命盘' }}
          </n-button>
          <n-button
            v-if="hasExistingChart"
            type="default"
            size="large"
            @click="regenerateChart"
            :loading="isRegenerating"
            block
            class="regenerate-button"
          >
            🔄 重新生成
          </n-button>
        </div>
      </n-form-item>
      </n-form>
        </div>
      </Transition>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useZiweiStore } from '../store/ziweiStore';
import { useUserStore } from '../../../store/userStore';
import type { BirthInfo } from '../types';
import { NForm, NFormItem, NInputNumber, NSelect, NRadioGroup, NRadio, NButton } from 'naive-ui';
import ChartRitualAnimation from '../components/ChartRitualAnimation.vue';
import { trackCognitiveLadder } from '../utils/cognitiveLadderTracking';                                                               

const router = useRouter();
const route = useRoute();
const ziweiStore = useZiweiStore();
const userStore = useUserStore();
const formRef = ref();

/**
 * 判断是否为"我的命盘"模式
 * 通过路由query参数mode来判断
 */
const isMyChartMode = computed(() => {
  return route.query.mode === 'my';
});

/**
 * 检查是否已自动填充用户信息
 */
const hasAutoFilled = ref(false);

/**
 * 获取用户的出生日期（年月日）
 * 从多个可能的位置读取，优先从用户编辑保存的位置读取
 */
const getUserBirthDate = (): { year: number; month: number; day: number } | null => {
  console.log('🔍 [ChartInput] 开始读取用户生日信息...');
  
  // 优先从 currentUser.user_metadata 读取（这是用户编辑保存的位置）
  const currentUser = userStore.currentUser;
  if (currentUser?.user_metadata) {
    const userMeta = currentUser.user_metadata as any;
    console.log('📋 [ChartInput] currentUser.user_metadata:', userMeta);
    
    // 优先检查 birthday（ProfileEdit.vue 中使用的字段名，用户编辑保存的位置）
    if (userMeta.birthday) {
      try {
        const birthdayStr = String(userMeta.birthday);
        console.log('✅ [ChartInput] 找到 birthday 字段:', birthdayStr);
        
        // 处理日期格式：可能是 YYYY-MM-DD 或 YYYY/MM/DD
        const dateParts = birthdayStr.split(/[-/]/);
        if (dateParts.length === 3) {
          const year = Number(dateParts[0]);
          const month = Number(dateParts[1]);
          const day = Number(dateParts[2]);
          
          if (year && month && day && year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            console.log('✅ [ChartInput] 成功解析生日:', { year, month, day });
            return { year, month, day };
          }
        }
      } catch (error) {
        console.warn('⚠️ [ChartInput] 解析 birthday 失败:', error);
      }
    }
    
    // 检查 birth_date（备用字段名）
    if (userMeta.birth_date) {
      try {
        const birthDateStr = String(userMeta.birth_date);
        console.log('✅ [ChartInput] 找到 birth_date 字段:', birthDateStr);
        
        const dateParts = birthDateStr.split(/[-/]/);
        if (dateParts.length === 3) {
          const year = Number(dateParts[0]);
          const month = Number(dateParts[1]);
          const day = Number(dateParts[2]);
          
          if (year && month && day && year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            console.log('✅ [ChartInput] 成功解析 birth_date:', { year, month, day });
            return { year, month, day };
          }
        }
      } catch (error) {
        console.warn('⚠️ [ChartInput] 解析 birth_date 失败:', error);
      }
    }
    
    // 检查分开存储的年月日
    if (userMeta.birth_year && userMeta.birth_month && userMeta.birth_day) {
      const year = Number(userMeta.birth_year);
      const month = Number(userMeta.birth_month);
      const day = Number(userMeta.birth_day);
      
      if (year && month && day) {
        console.log('✅ [ChartInput] 找到分开存储的年月日:', { year, month, day });
        return { year, month, day };
      }
    }
  }
  
  // 从 userMetadata（profiles表）读取（备用）
  const metadata = userStore.userMetadata;
  if (metadata) {
    console.log('📋 [ChartInput] userMetadata:', metadata);
    
    if (metadata.birth_date) {
      try {
        const dateParts = String(metadata.birth_date).split(/[-/]/);
        if (dateParts.length === 3) {
          const year = Number(dateParts[0]);
          const month = Number(dateParts[1]);
          const day = Number(dateParts[2]);
          
          if (year && month && day) {
            console.log('✅ [ChartInput] 从 userMetadata 读取到生日:', { year, month, day });
            return { year, month, day };
          }
        }
      } catch (error) {
        console.warn('⚠️ [ChartInput] 解析 userMetadata.birth_date 失败:', error);
      }
    }
  }
  
  // 从 userProfile（profiles表）读取（备用）
  const userProfile = userStore.userProfile;
  if (userProfile) {
    console.log('📋 [ChartInput] userProfile:', userProfile);
    
    // 检查 profiles 表中的 birthday 字段
    if ((userProfile as any).birthday) {
      try {
        const birthdayStr = String((userProfile as any).birthday);
        const dateParts = birthdayStr.split(/[-/]/);
        if (dateParts.length === 3) {
          const year = Number(dateParts[0]);
          const month = Number(dateParts[1]);
          const day = Number(dateParts[2]);
          
          if (year && month && day) {
            console.log('✅ [ChartInput] 从 userProfile 读取到生日:', { year, month, day });
            return { year, month, day };
          }
        }
      } catch (error) {
        console.warn('⚠️ [ChartInput] 解析 userProfile.birthday 失败:', error);
      }
    }
  }
  
  console.warn('⚠️ [ChartInput] 未找到用户生日信息');
  return null;
};

/**
 * 初始化出生信息
 * 如果是"我的命盘"模式，尝试从用户信息中自动填充
 */
const initializeBirthInfo = () => {
  if (isMyChartMode.value && userStore.isAuthenticated) {
    console.log('🔍 [ChartInput] 初始化出生信息，模式：我的命盘');
    console.log('📋 [ChartInput] 用户认证状态:', {
      isAuthenticated: userStore.isAuthenticated,
      currentUser: userStore.currentUser,
      userMetadata: userStore.userMetadata,
      userProfile: userStore.userProfile
    });
    
    const birthDate = getUserBirthDate();
    if (birthDate) {
      console.log('✅ [ChartInput] 成功获取用户生日，自动填充:', birthDate);
      birthInfo.year = birthDate.year;
      birthInfo.month = birthDate.month;
      birthInfo.day = birthDate.day;
      hasAutoFilled.value = true;
      
      // 如果用户信息中有性别，也可以自动填充
      const currentUser = userStore.currentUser;
      if (currentUser?.user_metadata) {
        const userMeta = currentUser.user_metadata as any;
        if (userMeta.gender) {
          birthInfo.gender = userMeta.gender === 'male' || userMeta.gender === '男' ? 'male' : 'female';
          console.log('✅ [ChartInput] 自动填充性别:', birthInfo.gender);
        }
      }
    } else {
      console.warn('⚠️ [ChartInput] 未找到用户生日信息，使用默认值');
    }
  }
  
  // 如果没有自动填充，使用默认值
  if (!hasAutoFilled.value) {
    birthInfo.year = new Date().getFullYear() - 25;
    birthInfo.month = 1;
    birthInfo.day = 1;
    console.log('📝 [ChartInput] 使用默认值:', { year: birthInfo.year, month: birthInfo.month, day: birthInfo.day });
  }
};

const birthInfo = reactive<BirthInfo>({
  year: new Date().getFullYear() - 25,
  month: 1,
  day: 1,
  hour: undefined as any,
  gender: 'male'
});

/**
 * 从localStorage直接读取用户数据（确保获取最新数据）
 */
const loadUserFromLocalStorage = (): any => {
  try {
    const userStr = localStorage.getItem('tianxuan_current_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      console.log('📋 [ChartInput] 从localStorage读取用户数据:', {
        id: user?.id,
        birthday: user?.user_metadata?.birthday,
        fullMetadata: user?.user_metadata
      });
      return user;
    }
  } catch (error) {
    console.warn('⚠️ [ChartInput] 从localStorage读取用户数据失败:', error);
  }
  return null;
};

/**
 * 解析生日字符串为年月日
 */
const parseBirthday = (birthdayStr: string): { year: number; month: number; day: number } | null => {
  if (!birthdayStr) return null;
  
  try {
    const str = String(birthdayStr).trim();
    console.log('🔍 [ChartInput] 解析生日字符串:', str);
    
    // 处理日期格式：YYYY-MM-DD 或 YYYY/MM/DD 或 YYYY-MM-DDTHH:mm:ss.sssZ (ISO格式)
    let dateParts: string[] = [];
    
    // 如果是ISO格式，先提取日期部分
    if (str.includes('T')) {
      dateParts = str.split('T')[0].split(/[-/]/);
    } else {
      dateParts = str.split(/[-/]/);
    }
    
    if (dateParts.length >= 3) {
      const year = Number(dateParts[0]);
      const month = Number(dateParts[1]);
      const day = Number(dateParts[2]);
      
      console.log('📊 [ChartInput] 解析结果:', { year, month, day, parts: dateParts });
      
      // 验证数据有效性
      if (year && month && day && 
          year >= 1900 && year <= 2100 && 
          month >= 1 && month <= 12 && 
          day >= 1 && day <= 31) {
        return { year, month, day };
      } else {
        console.warn('⚠️ [ChartInput] 日期数据无效:', { year, month, day });
      }
    } else {
      console.warn('⚠️ [ChartInput] 日期格式不正确，无法解析:', str);
    }
  } catch (error) {
    console.warn('⚠️ [ChartInput] 解析生日失败:', error, birthdayStr);
  }
  
  return null;
};

/**
 * 重新加载用户生日信息
 */
const reloadBirthInfo = () => {
  console.log('🔄 [ChartInput] 重新加载用户生日信息...');
  console.log('📋 [ChartInput] 当前状态:', {
    isMyChartMode: isMyChartMode.value,
    isAuthenticated: userStore.isAuthenticated,
    currentUser: userStore.currentUser?.id,
    hasBirthday: !!userStore.currentUser?.user_metadata?.birthday
  });
  
  if (!isMyChartMode.value || !userStore.isAuthenticated) {
    console.log('⏭️ [ChartInput] 不是"我的命盘"模式或用户未登录，跳过');
    return false;
  }
  
  // 先从localStorage读取最新数据（确保获取最新保存的数据）
  const localUser = loadUserFromLocalStorage();
  if (localUser?.user_metadata?.birthday) {
    const parsed = parseBirthday(localUser.user_metadata.birthday);
    if (parsed) {
      console.log('✅ [ChartInput] 从localStorage成功读取并解析生日:', parsed);
      birthInfo.year = parsed.year;
      birthInfo.month = parsed.month;
      birthInfo.day = parsed.day;
      hasAutoFilled.value = true;
      
      // 同步更新userStore中的currentUser（确保数据一致）
      if (!userStore.currentUser || 
          !userStore.currentUser.user_metadata?.birthday ||
          userStore.currentUser.user_metadata.birthday !== localUser.user_metadata.birthday) {
        console.log('🔄 [ChartInput] 同步更新userStore.currentUser');
        userStore.currentUser = localUser;
      }
      return true;
    }
  }
  
  // 如果localStorage没有，尝试从userStore读取
  const birthDate = getUserBirthDate();
  if (birthDate) {
    console.log('✅ [ChartInput] 从userStore读取到生日:', birthDate);
    birthInfo.year = birthDate.year;
    birthInfo.month = birthDate.month;
    birthInfo.day = birthDate.day;
    hasAutoFilled.value = true;
    return true;
  }
  
  console.warn('⚠️ [ChartInput] 未找到用户生日信息');
  return false;
};

// 初始化时填充用户信息和命盘数据
onMounted(async () => {
  console.log('🚀 [ChartInput] 组件挂载，开始初始化...');
  
  // 确保用户状态已初始化
  if (!userStore.isInitialized) {
    console.log('⏳ [ChartInput] 用户状态未初始化，正在初始化...');
    await userStore.initialize();
  }
  
  // 等待一小段时间，确保用户数据已加载
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // 如果用户已登录且没有命盘数据，尝试从用户信息加载
  if (userStore.isAuthenticated && !ziweiStore.currentChart) {
    try {
      console.log('🔍 [ChartInput] 尝试从用户信息加载命盘...');
      const chart = await ziweiStore.loadChartFromUser();
      if (chart) {
        // 如果加载成功，填充表单
        console.log('✅ [ChartInput] 从用户信息加载命盘成功:', chart.birthInfo);
        birthInfo.year = chart.birthInfo.year;
        birthInfo.month = chart.birthInfo.month;
        birthInfo.day = chart.birthInfo.day;
        birthInfo.hour = chart.birthInfo.hour;
        birthInfo.gender = chart.birthInfo.gender;
        hasAutoFilled.value = true;
        console.log('✅ [ChartInput] 初始化完成（从命盘数据），当前表单值:', { ...birthInfo });
        return; // 已填充，不需要继续
      }
    } catch (error) {
      console.warn('⚠️ [ChartInput] 加载命盘数据失败:', error);
    }
  }
  
  // 如果已有命盘，填充表单
  if (ziweiStore.currentChart) {
    console.log('✅ [ChartInput] 已有命盘数据，填充表单:', ziweiStore.currentChart.birthInfo);
    const chart = ziweiStore.currentChart;
    birthInfo.year = chart.birthInfo.year;
    birthInfo.month = chart.birthInfo.month;
    birthInfo.day = chart.birthInfo.day;
    birthInfo.hour = chart.birthInfo.hour;
    birthInfo.gender = chart.birthInfo.gender;
    hasAutoFilled.value = true;
    console.log('✅ [ChartInput] 初始化完成（从已有命盘），当前表单值:', { ...birthInfo });
  } else {
    // 没有命盘数据，尝试从用户信息初始化
    console.log('📝 [ChartInput] 没有命盘数据，尝试从用户信息初始化...');
    
    // 优先从localStorage读取（确保获取最新数据）
    const loaded = reloadBirthInfo();
    if (!loaded) {
      // 如果localStorage没有，使用默认的初始化逻辑
      initializeBirthInfo();
    }
  }
  
  console.log('✅ [ChartInput] 初始化完成，当前表单值:', { ...birthInfo, hasAutoFilled: hasAutoFilled.value });
  
  // 监听用户资料更新事件
  const handleProfileUpdate = () => {
    console.log('🔄 [ChartInput] 检测到用户资料更新事件，重新加载生日信息...');
    setTimeout(() => {
      reloadBirthInfo();
    }, 100);
  };
  
  window.addEventListener('user-profile-updated', handleProfileUpdate);
  
  // 监听userStore.currentUser的变化（响应式更新）
  watch(
    () => userStore.currentUser?.user_metadata?.birthday,
    (newBirthday, oldBirthday) => {
      if (newBirthday && newBirthday !== oldBirthday && isMyChartMode.value) {
        console.log('🔄 [ChartInput] 检测到currentUser.birthday变化:', { old: oldBirthday, new: newBirthday });
        setTimeout(() => {
          reloadBirthInfo();
        }, 50);
      }
    },
    { deep: true }
  );
  
  // 组件卸载时移除监听器
  onUnmounted(() => {
    window.removeEventListener('user-profile-updated', handleProfileUpdate);
  });
});

const hourOptions = [
  { label: '子时 (23:00-01:00)', value: 0 },
  { label: '丑时 (01:00-03:00)', value: 1 },
  { label: '寅时 (03:00-05:00)', value: 2 },
  { label: '卯时 (05:00-07:00)', value: 3 },
  { label: '辰时 (07:00-09:00)', value: 4 },
  { label: '巳时 (09:00-11:00)', value: 5 },
  { label: '午时 (11:00-13:00)', value: 6 },
  { label: '未时 (13:00-15:00)', value: 7 },
  { label: '申时 (15:00-17:00)', value: 8 },
  { label: '酉时 (17:00-19:00)', value: 9 },
  { label: '戌时 (19:00-21:00)', value: 10 },
  { label: '亥时 (21:00-23:00)', value: 11 }
];

const rules = {
  year: [
    {
      required: true,
      validator: (rule: any, value: number) => {
        if (value === null || value === undefined || value === 0) {
          return new Error('请输入出生年份');
        }
        if (value < 1900 || value > 2100) {
          return new Error('年份必须在1900-2100之间');
        }
        return true;
      },
      trigger: ['blur', 'input']
    }
  ],
  month: [
    {
      required: true,
      validator: (rule: any, value: number) => {
        if (value === null || value === undefined || value === 0) {
          return new Error('请输入出生月份');
        }
        if (value < 1 || value > 12) {
          return new Error('月份必须在1-12之间');
        }
        return true;
      },
      trigger: ['blur', 'input']
    }
  ],
  day: [
    {
      required: true,
      validator: (rule: any, value: number) => {
        if (value === null || value === undefined || value === 0) {
          return new Error('请输入出生日期');
        }
        if (value < 1 || value > 31) {
          return new Error('日期必须在1-31之间');
        }
        return true;
      },
      trigger: ['blur', 'input']
    }
  ],
  hour: [
    {
      required: true,
      validator: (rule: any, value: number) => {
        if (value === null || value === undefined) {
          return new Error('请选择出生时辰');
        }
        if (value < 0 || value > 11) {
          return new Error('请选择有效的时辰');
        }
        return true;
      },
      trigger: ['change', 'blur']
    }
  ],
  gender: [
    {
      required: true,
      validator: (rule: any, value: string) => {
        if (!value) {
          return new Error('请选择性别');
        }
        return true;
      },
      trigger: ['change']
    }
  ]
};

const isLoading = computed(() => ziweiStore.isLoading);
const isRegenerating = ref(false);
const showRitualAnimation = ref(false);
const pendingBirthInfo = ref<BirthInfo | null>(null);

// 检查是否有已存在的命盘
const hasExistingChart = computed(() => {
  return !!ziweiStore.currentChart;
});

// 动画完成回调
const onRitualComplete = async () => {
  if (!pendingBirthInfo.value) {
    showRitualAnimation.value = false;
    return;
  }

  try {
    // 生成命盘
    const chart = await ziweiStore.generateChart(pendingBirthInfo.value);
    console.log('✅ 命盘生成成功！', chart);

    // 跳转到命盘展示页面
    router.push('/ziwei/chart');
  } catch (error: any) {
    console.error('❌ 命盘生成失败:', error);
    // 隐藏动画，显示表单
    showRitualAnimation.value = false;
    pendingBirthInfo.value = null;
    
    let errorMsg = '命盘生成失败，请检查输入数据';
    if (error instanceof Error) {
      errorMsg = error.message || errorMsg;
    } else if (typeof error === 'string') {
      errorMsg = error;
    }
    alert(errorMsg);
  }
};

// 重新生成命盘（清除旧命盘后生成新命盘）
const regenerateChart = async () => {
  isRegenerating.value = true;
  try {
    // 清除旧命盘
    await ziweiStore.clearChart();
    
    // 重置自动填充状态
    hasAutoFilled.value = false;
    
    // 调用生成命盘
    await generateChart();
  } catch (error: any) {
    console.error('❌ 重新生成命盘失败:', error);
    alert('重新生成命盘失败，请重试');
  } finally {
    isRegenerating.value = false;
  }
};

const generateChart = async () => {
  if (!formRef.value) {
    console.error('表单引用不存在');
    return;
  }

  // 验证表单
  try {
    await formRef.value.validate((errors) => {
      if (errors) {
        console.warn('⚠️ 表单验证失败:', errors);
        const firstError = errors[0];
        if (firstError && firstError.length > 0) {
          alert(`请检查输入：${firstError[0].message || '表单验证失败'}`);
        }
        return;
      }
    });
  } catch (validationError: any) {
    console.warn('⚠️ 表单验证异常:', validationError);
    return;
  }

  // 手动验证数据完整性
  if (!birthInfo.year || birthInfo.year < 1900 || birthInfo.year > 2100) {
    alert('请输入有效的出生年份（1900-2100）');
    return;
  }
  if (!birthInfo.month || birthInfo.month < 1 || birthInfo.month > 12) {
    alert('请输入有效的出生月份（1-12）');
    return;
  }
  if (!birthInfo.day || birthInfo.day < 1 || birthInfo.day > 31) {
    alert('请输入有效的出生日期（1-31）');
    return;
  }
  if (birthInfo.hour === null || birthInfo.hour === undefined || birthInfo.hour < 0 || birthInfo.hour > 11) {
    alert('请选择有效的出生时辰');
    return;
  }
  if (!birthInfo.gender) {
    alert('请选择性别');
    return;
  }

    try {
      console.log('📝 输入的生辰信息:', { ...birthInfo });

      // 认知阶梯埋点：输入生日
      trackCognitiveLadder('birthday_input', {
        year: birthInfo.year,
        month: birthInfo.month,
        day: birthInfo.day,
        hour: birthInfo.hour,
        gender: birthInfo.gender
      });

      // 保存待生成的命盘信息
      pendingBirthInfo.value = { ...birthInfo };
      
      // 显示排盘动画
      showRitualAnimation.value = true;
  } catch (error: any) {
      console.error('❌ 命盘生成失败:', error);
      // 隐藏动画，显示表单
      showRitualAnimation.value = false;
    
    // 处理不同类型的错误
    let errorMsg = '命盘生成失败，请检查输入数据';
    
    if (error instanceof Error) {
      errorMsg = error.message || errorMsg;
      console.error('错误堆栈:', error.stack);
    } else if (typeof error === 'string') {
      errorMsg = error;
    } else if (error && typeof error === 'object') {
      errorMsg = error.message || error.msg || JSON.stringify(error);
      console.error('错误对象:', error);
    }
    
    // 显示用户友好的错误信息
    alert(`❌ ${errorMsg}\n\n请查看控制台获取详细信息`);
  }
};
</script>


<style scoped>
.chart-input {
  min-height: 100vh;
  position: relative;
}

/* 动态星空背景 */
.cosmic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.stars-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(2px 2px at 20% 30%, #fff, transparent),
    radial-gradient(2px 2px at 60% 70%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 50% 50%, #fff, transparent),
    radial-gradient(1px 1px at 80% 10%, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 90% 60%, #fff, transparent),
    radial-gradient(1px 1px at 33% 80%, rgba(255,255,255,0.4), transparent);
  background-size: 200% 200%;
  animation: starsMove 20s linear infinite;
  opacity: 0.6;
}

@keyframes starsMove {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
}

.nebula-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%);
  animation: nebulaFloat 15s ease-in-out infinite;
}

@keyframes nebulaFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -20px) scale(1.1); }
}

.energy-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 30% 40%, rgba(147, 51, 234, 0.1) 0%, transparent 30%),
    radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 30%);
  animation: particlesPulse 8s ease-in-out infinite;
}

@keyframes particlesPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 英雄区域 */
.hero-section {
  text-align: center;
  margin-bottom: 2rem;
  padding-top: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #9333EA 0%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 0.5rem;
}

.auto-fill-hint {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem 1.25rem;
  background: rgba(147, 51, 234, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(147, 51, 234, 0.3);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.95rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.hint-icon {
  font-size: 1.2rem;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.regenerate-button {
  margin-top: 0.5rem;
}

/* 排盘动画容器 */
.ritual-animation-container {
  width: 100%;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* 表单容器 */
.form-container {
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

