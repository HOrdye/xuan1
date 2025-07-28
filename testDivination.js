import { ensureDivinationDataLoaded } from './src/features/dilemma/utils/divinationMethods.js';

async function testDivination() {
  console.log('开始测试卦象数据加载...');
  
  try {
    const result = await ensureDivinationDataLoaded();
    console.log('卦象数据加载结果:', result);
    console.log('✅ 测试成功 - 卦象数据已正确加载');
  } catch (error) {
    console.error('❌ 测试失败 - 卦象数据加载出错:', error);
  }
}

testDivination();
