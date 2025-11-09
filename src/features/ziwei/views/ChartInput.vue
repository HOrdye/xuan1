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
  year: {
    required: true,
    message: '请输入出生年份',
    trigger: 'blur'
  },
  month: {
    required: true,
    message: '请输入出生月份',
    trigger: 'blur'
  },
  day: {
    required: true,
    message: '请输入出生日期',
    trigger: 'blur'
  },
  hour: {
    required: true,
    message: '请选择出生时辰',
    trigger: 'change'
  }
};

const isLoading = computed(() => ziweiStore.isLoading);

const generateChart = async () => {
  try {
    await formRef.value?.validate();
    const chart = await ziweiStore.generateChart({ ...birthInfo });
    console.log('✅ 命盘生成成功！', chart);
    router.push('/ziwei/chart');
  } catch (error: any) {
    console.error('❌ 命盘生成失败:', error);
    alert(error.message || '命盘生成失败，请检查输入数据');
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

