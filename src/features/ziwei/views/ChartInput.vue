<template>
  <div class="chart-input">
    <h2>输入生辰信息</h2>
    
    <n-form :model="birthInfo" :rules="rules" ref="formRef">
      <n-form-item label="出生年份" path="year">
        <n-input-number 
          v-model:value="birthInfo.year" 
          :min="1900" 
          :max="2100"
          placeholder="请输入出生年份"
        />
      </n-form-item>

      <n-form-item label="出生月份" path="month">
        <n-input-number 
          v-model:value="birthInfo.month" 
          :min="1" 
          :max="12"
          placeholder="请输入出生月份"
        />
      </n-form-item>

      <n-form-item label="出生日期" path="day">
        <n-input-number 
          v-model:value="birthInfo.day" 
          :min="1" 
          :max="31"
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
        <n-button 
          type="primary" 
          size="large"
          @click="generateChart"
          :loading="isLoading"
          block
        >
          生成命盘
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useZiweiStore } from '../store/ziweiStore';
import type { BirthInfo } from '../types';
import { NForm, NFormItem, NInputNumber, NSelect, NRadioGroup, NRadio, NButton } from 'naive-ui';

const router = useRouter();
const ziweiStore = useZiweiStore();
const formRef = ref();

const birthInfo = reactive<BirthInfo>({
  year: new Date().getFullYear() - 25,
  month: 1,
  day: 1,
  hour: 0,
  gender: 'male'
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
    
    // 生成命盘
    const chart = await ziweiStore.generateChart({ ...birthInfo });
    console.log('✅ 命盘生成成功！', chart);
    
    // 跳转到命盘展示页面
    router.push('/ziwei/chart');
  } catch (error: any) {
    console.error('❌ 命盘生成失败:', error);
    
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
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>

