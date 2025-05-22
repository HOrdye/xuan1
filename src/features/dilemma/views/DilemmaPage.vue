<template>
  <div class="p-4 pb-20">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">玄选两难</h1>
      <p class="text-sm text-gray-600 mt-2">输入你面临的两个选择，让易经六十四卦为你指点迷津</p>
    </div>

    <!-- 功能入口导航 -->
    <div class="mb-6 bg-white rounded-xl p-4 shadow-sm">
      <div class="flex flex-col md:flex-row md:justify-between gap-4">
        <div class="flex items-center">
          <div class="relative inline-block"
               @mouseenter="showDropdown = true"
               @mouseleave="showDropdown = false">
            <div class="flex items-center text-primary font-medium cursor-pointer">
              <span class="mr-2">⚯</span>
              <span>易经占卜</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
            <div v-if="showDropdown" class="absolute left-0 w-40 bg-white rounded-md shadow-lg py-1 z-10"
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
        </div>

        <router-link to="/dilemma/test" class="flex items-center text-gray-600 hover:text-primary transition">
          <span>测试模式</span>
        </router-link>
      </div>
    </div>

    <!-- 选项输入区 -->
    <div class="bg-white rounded-xl p-4 mb-6 shadow-sm">
      <h3 class="text-gray-800 font-medium mb-4">输入你的两个选择</h3>
      
      <!-- 选项A输入 -->
      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-2">选项A</label>
        <input 
          v-model="optionA" 
          type="text" 
          placeholder="例如：接受现在的工作" 
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
          :class="{'border-red-300': showError && !optionA}"
        >
        <p v-if="showError && !optionA" class="text-red-500 text-xs mt-1">请输入选项A</p>
      </div>
      
      <!-- 选项B输入 -->
      <div class="mb-6">
        <label class="block text-sm text-gray-600 mb-2">选项B</label>
        <input 
          v-model="optionB" 
          type="text" 
          placeholder="例如：跳槽到新公司" 
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
          :class="{'border-red-300': showError && !optionB}"
        >
        <p v-if="showError && !optionB" class="text-red-500 text-xs mt-1">请输入选项B</p>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <label class="inline-flex items-center cursor-pointer">
            <input v-model="useMultipleAlgorithms" type="checkbox" class="sr-only peer">
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            <span class="ml-2 text-sm text-gray-600">多算法综合分析</span>
          </label>
        </div>
        <button 
          @click="startAnalysis" 
          class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition"
        >
          开始分析
        </button>
      </div>
    </div>

    <!-- 分析结果 -->
    <div v-if="analysisResult" class="bg-white rounded-xl overflow-hidden shadow-md mb-6 transition-all duration-500" :class="{'opacity-100': showResult, 'opacity-0': !showResult}">
      <div class="bg-gradient-to-r from-primary to-mystic p-4 text-white">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">{{ analysisResult.question }}</h3>
          <div class="flex space-x-1">
            <span class="text-xs px-2 py-0.5 bg-white bg-opacity-20 rounded-full">{{ analysisResult.method }}</span>
          </div>
        </div>
      </div>
      
      <div class="p-5">
        <!-- 六爻图显示 (如果有) -->
        <div v-if="analysisResult.hexagram" class="bg-gray-50 p-4 rounded-lg mb-4 text-center">
          <div class="mb-2 font-bold text-gray-700">{{ analysisResult.hexagram.chineseName }} - {{ analysisResult.hexagram.name }}</div>
          <div class="text-3xl my-2">{{ analysisResult.hexagram.symbol }}</div>
          <div class="flex flex-col items-center">
            <div v-for="(line, index) in analysisResult.hexagram.lines.slice().reverse()" :key="index" class="my-1">
              <div v-if="line === 1" class="w-16 h-2 bg-primary rounded-full"></div>
              <div v-else-if="line === 0" class="flex space-x-1">
                <div class="w-7 h-2 bg-primary rounded-full"></div>
                <div class="w-7 h-2 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
          <div class="mt-2 text-sm text-gray-500">{{ analysisResult.hexagram.meaning }}</div>
          
          <!-- 变爻显示 -->
          <div v-if="analysisResult.changingLines && analysisResult.changingLines.length > 0" class="mt-3 pt-3 border-t border-gray-200">
            <div class="text-xs text-gray-500 mb-2">变爻：
              <span v-for="(line, index) in analysisResult.changingLines" :key="index">
                第{{ line + 1 }}爻{{ index < analysisResult.changingLines.length - 1 ? '、' : '' }}
              </span>
            </div>
            <div v-if="analysisResult.relatedHexagram" class="text-xs text-gray-700 mt-1">
              变卦：{{ analysisResult.relatedHexagram.name }}（{{ analysisResult.relatedHexagram.symbol }}）—— {{ analysisResult.relatedHexagram.meaning }}
            </div>
          </div>
        </div>
        
        <!-- 结果分析 -->
        <div class="flex items-start mb-5">
          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-lightbulb text-primary"></i>
          </div>
          <div class="ml-3">
            <p class="text-gray-700">建议选择：
              <span v-if="analysisResult.recommendation === 'A'" class="text-primary font-medium">{{ optionA }}</span>
              <span v-else-if="analysisResult.recommendation === 'B'" class="text-primary font-medium">{{ optionB }}</span>
              <span v-else class="text-yellow-600 font-medium">{{ analysisResult.recommendation }}</span>
            </p>
            <p class="text-sm text-gray-500 mt-2">{{ analysisResult.analysis }}</p>
          </div>
        </div>
        
        <!-- 新增: 详细分析部分 -->
        <div class="mb-5 bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-700 mb-3 flex items-center">
            <span class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2">易</span>
            卦象详解
          </h4>
          
          <!-- 卦象详细解读 -->
          <div class="mb-4">
            <div class="text-sm text-gray-600">
              <p class="mb-2"><span class="font-medium">卦象解读：</span> 
                {{ analysisResult.hexagram?.judgment || analysisResult.hexagram?.modernInterpretation || '' }}
              </p>
              
              <!-- 卦象基本属性 -->
              <div class="grid grid-cols-2 gap-4 my-3">
                <div class="text-xs bg-white p-2 rounded border border-gray-100">
                  <span class="font-medium text-gray-500">特性：</span>
                  <span>{{ getHexagramAttribute(analysisResult.hexagram) }}</span>
                </div>
                <div class="text-xs bg-white p-2 rounded border border-gray-100">
                  <span class="font-medium text-gray-500">代表：</span>
                  <span>{{ getHexagramNature(analysisResult.hexagram) }}</span>
                </div>
              </div>
              
              <!-- 卦辞 -->
              <p class="text-xs bg-white p-2 rounded border border-gray-100 mb-2">
                <span class="font-medium text-gray-500">卦辞：</span>
                {{ analysisResult.hexagram?.judgment || '无' }}
              </p>
            </div>
          </div>
          
          <!-- 变爻分析 -->
          <div v-if="analysisResult.changingLines && analysisResult.changingLines.length > 0" class="mb-4">
            <h5 class="font-medium text-sm text-gray-600 mb-1">变爻分析</h5>
            <div class="text-xs text-gray-600 bg-white p-3 rounded border border-gray-100">
              <p class="mb-2">本次卦象有 {{ analysisResult.changingLines.length }} 个变爻，
                表示处于<span class="text-primary">转变期</span>，从
                <span class="font-medium">{{ analysisResult.hexagram?.chineseName }}</span>卦
                变为<span class="font-medium">{{ analysisResult.relatedHexagram?.chineseName }}</span>卦。
              </p>
              
              <div v-for="(line, idx) in analysisResult.changingLines" :key="idx" class="mb-2 pb-2 border-b border-dashed border-gray-100 last:border-0">
                <p class="font-medium">第{{ line + 1 }}爻变化：</p>
                <p class="text-gray-500">{{ getChangingLineInterpretation(line, analysisResult.hexagram?.chineseName) }}</p>
              </div>
            </div>
          </div>
          
          <!-- 选项深入分析 -->
          <div class="mb-4">
            <h5 class="font-medium text-sm text-gray-600 mb-1">选项分析</h5>
            
            <div class="bg-white rounded border border-gray-100 overflow-hidden mb-2">
              <div class="p-2 border-b border-gray-100">
                <div class="flex justify-between items-center">
                  <span class="font-medium text-sm">选项A: {{ optionA }}</span>
                  <span class="text-xs py-1 px-2 bg-gray-100 rounded-full">
                    匹配度: {{ analysisResult.optionA_score }}%
                  </span>
                </div>
              </div>
              <div class="p-2 text-xs text-gray-600">
                <p>{{ analysisResult.optionA_analysis }}</p>
                <p class="mt-2 text-gray-500">
                  <span class="font-medium">优点：</span>
                  {{ getOptionStrengths(analysisResult, 'A') }}
                </p>
                <p class="mt-1 text-gray-500">
                  <span class="font-medium">注意点：</span>
                  {{ getOptionCautions(analysisResult, 'A') }}
                </p>
              </div>
              <div class="h-1 bg-gray-100">
                <div class="bg-primary h-1" :style="`width: ${analysisResult.optionA_score}%`"></div>
              </div>
            </div>
            
            <div class="bg-white rounded border border-gray-100 overflow-hidden">
              <div class="p-2 border-b border-gray-100">
                <div class="flex justify-between items-center">
                  <span class="font-medium text-sm">选项B: {{ optionB }}</span>
                  <span class="text-xs py-1 px-2 bg-gray-100 rounded-full">
                    匹配度: {{ analysisResult.optionB_score }}%
                  </span>
                </div>
              </div>
              <div class="p-2 text-xs text-gray-600">
                <p>{{ analysisResult.optionB_analysis }}</p>
                <p class="mt-2 text-gray-500">
                  <span class="font-medium">优点：</span>
                  {{ getOptionStrengths(analysisResult, 'B') }}
                </p>
                <p class="mt-1 text-gray-500">
                  <span class="font-medium">注意点：</span>
                  {{ getOptionCautions(analysisResult, 'B') }}
                </p>
              </div>
              <div class="h-1 bg-gray-100">
                <div class="bg-primary h-1" :style="`width: ${analysisResult.optionB_score}%`"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 综合建议 -->
        <div class="mb-5 p-4 bg-white rounded-lg border border-primary/10">
          <h4 class="font-medium text-gray-700 mb-3 flex items-center">
            <i class="fas fa-lightbulb text-primary mr-2"></i>
            综合建议
          </h4>
          <div class="text-sm text-gray-600">
            <p class="mb-2">基于本次卦象解析，对于"{{ optionA }} vs {{ optionB }}"的抉择，给您的综合建议是：</p>
            <ul class="list-disc pl-5 space-y-1 text-xs">
              <li v-if="analysisResult.hexagram">{{ getLLMAdvice(1, analysisResult) }}</li>
              <li v-if="analysisResult.hexagram">{{ getLLMAdvice(2, analysisResult) }}</li>
              <li v-if="analysisResult.hexagram">{{ getLLMAdvice(3, analysisResult) }}</li>
            </ul>
            
            <div class="mt-3 p-2 bg-primary/5 rounded text-sm">
              <p class="font-medium text-primary">易经智慧总结：</p>
              <p class="text-xs text-gray-600 mt-1">{{ getFinalWisdom(analysisResult) }}</p>
            </div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex justify-between items-center text-sm">
          <div>
            <button class="text-gray-500 flex items-center">
              <i class="far fa-bookmark mr-1"></i> 收藏
            </button>
          </div>
          <div class="flex">
            <button class="text-gray-500 mr-4 flex items-center">
              <i class="fas fa-share-alt mr-1"></i> 分享
            </button>
            <button @click="resetForm" class="text-primary font-medium flex items-center">
              重新选择 <i class="fas fa-redo-alt ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史记录 -->
    <div v-if="!analysisResult">
      <h3 class="text-lg font-bold text-gray-800 mb-3">历史决策</h3>
      <div v-for="(item, index) in historyItems" :key="index" class="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
        <div class="bg-gradient-to-r from-primary to-mystic p-3 text-white">
          <div class="flex justify-between items-center">
            <h4 class="font-medium">{{ item.question }}</h4>
            <div class="text-xs opacity-70">{{ item.date }}</div>
          </div>
        </div>
        <div class="p-3">
          <div class="flex items-center mb-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" :class="item.iconBg">
              <i :class="`${item.icon} ${item.iconColor}`"></i>
            </div>
            <div class="ml-3">
              <p class="text-gray-700">建议选择：<span :class="item.resultColor" class="font-medium">{{ item.result }}</span></p>
              <p class="text-xs text-gray-500 mt-1">{{ item.summary }}</p>
            </div>
          </div>
          <div class="flex justify-end">
            <button class="text-primary text-sm font-medium">查看详情</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { generateHexagram, AnalysisResult } from '../utils/hexagramGenerator';
import { generateFortuneSeed } from '../utils/fortuneSeed';

// 表单数据
const optionA = ref('');
const optionB = ref('');
const useMultipleAlgorithms = ref(false);
const showError = ref(false);
const showResult = ref(false);
const analysisResult = ref<AnalysisResult | null>(null);
const showDropdown = ref(false);

// 历史记录数据
const historyItems = [
  {
    question: '接受现在的工作 vs 跳槽到新公司',
    date: '2023-06-25',
    result: '跳槽到新公司',
    summary: '根据你的八字和当前星象，新的开始将为你带来更大的发展空间',
    icon: 'fas fa-briefcase',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-500',
    resultColor: 'text-blue-600'
  },
  {
    question: '今天去健身 vs 在家休息',
    date: '2023-06-23',
    result: '在家休息',
    summary: '今日健康运势偏低，不适合剧烈运动，建议在家休息调整',
    icon: 'fas fa-home',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-500',
    resultColor: 'text-green-600'
  }
];

// 记录用户点击"开始分析"时的时间戳
const clickTimestamp = ref<number | null>(null);

// 开始分析
const startAnalysis = async () => {
  // 表单验证
  if (!optionA.value || !optionB.value) {
    showError.value = true;
    return;
  }
  showError.value = false;

  // 记录点击时间戳
  clickTimestamp.value = Date.now();

  // 构建种子输入
  const seedInput = {
    question: `${optionA.value} vs ${optionB.value}`,
    optionA: optionA.value,
    optionB: optionB.value,
    clickTimestamp: clickTimestamp.value || undefined
  };
  const seed = generateFortuneSeed(seedInput);

  setTimeout(async () => {
    try {
      // 生成卦象并分析，传入种子
      const result = await generateHexagram(
        optionA.value,
        optionB.value,
        seed,
        useMultipleAlgorithms.value
      );
      
      // 转换结果格式以适配现有界面
      analysisResult.value = {
        ...result,
        question: `${optionA.value} vs ${optionB.value}`,
        method: useMultipleAlgorithms.value ? '综合分析' : '易经六十四卦',
        recommendation: result.recommendation || 'A',
        optionA_analysis: result.optionA_analysis || '',
        optionB_analysis: result.optionB_analysis || '',
        optionA_score: result.optionA_score || 50,
        optionB_score: result.optionB_score || 50
      };
      
      // 显示结果(带动画)
      setTimeout(() => {
        showResult.value = true;
      }, 100);

      console.log('传给DivinationResult的analysisResult:', analysisResult.value);
      if (analysisResult.value && analysisResult.value.hexagram) {
        console.log('analysisResult.hexagram:', analysisResult.value.hexagram);
      }
    } catch (error) {
      console.error('卦象生成错误:', error);
      fallbackToMockResult();
    }
  }, 1500);
};

// 如果算法出错，使用模拟数据作为后备
const fallbackToMockResult = () => {
  analysisResult.value = {
    hexagram: {
      number: 4,
      name: 'Meng (Youthful Folly)',
      chineseName: '蒙',
      symbol: '䷃',
      lines: [0, 1, 0, 1, 0, 0],
      meaning: '山下出泉，蒙昧待启',
      judgment: '亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。',
      yao_texts: [],
      trigrams: { upper: '艮', lower: '坎' },
      sequence: 4,
      modernInterpretation: '蒙卦代表蒙昧待启，需要寻求指引和学习。',
      overall: '在事业上需要保持谦虚学习的态度，在感情中需要更多的沟通和理解，注意休息，保持规律的作息。'
    },
    changingLines: [],
    relatedHexagram: null,
    analysis: '根据易经卦象分析，选项A更符合当前的能量场，但选项B也有其优势。在这种情况下，建议你优先考虑自己内心的直觉和感受。',
    question: `${optionA.value} vs ${optionB.value}`,
    method: useMultipleAlgorithms.value ? '综合分析' : '易经六十四卦',
    recommendation: Math.random() > 0.5 ? 'A' : 'B',
    optionA_analysis: '这个选择代表着稳定和熟悉的环境，有助于巩固已有成果。',
    optionB_analysis: '这个选择意味着冒险和新的可能性，有机会获得更大的发展。',
    optionA_score: Math.floor(Math.random() * 40 + 50),
    optionB_score: Math.floor(Math.random() * 40 + 50)
  };
  
  // 显示结果(带动画)
  setTimeout(() => {
    showResult.value = true;
  }, 100);
};

// 重置表单
const resetForm = () => {
  optionA.value = '';
  optionB.value = '';
  useMultipleAlgorithms.value = false;
  showResult.value = false;
  
  setTimeout(() => {
    analysisResult.value = null;
  }, 300);
};

// 新增的辅助函数
// 获取卦象属性
const getHexagramAttribute = (hexagram: any): string => {
  if (!hexagram) return '未知';
  return hexagram.nature || hexagram.attribute || (hexagram.trigrams ? 
    `${hexagram.trigrams.lower}下${hexagram.trigrams.upper}上` : '');
};

// 获取卦象性质
const getHexagramNature = (hexagram: any): string => {
  if (!hexagram) return '未知';
  if (hexagram.modernInterpretation) {
    return hexagram.modernInterpretation.split('，')[0];
  }
  const meanings = {
    '乾': '刚健、领导、创造',
    '坤': '柔顺、包容、承载',
    '震': '行动、震动、新生',
    '艮': '稳定、停止、限制',
    '坎': '险难、智慧、深邃',
    '离': '光明、明辨、附着',
    '兑': '喜悦、沟通、满足',
    '巽': '谦逊、渗透、柔顺'
  };
  
  const chineseName = hexagram.chineseName || '';
  for (const key in meanings) {
    if (chineseName.includes(key)) {
      return meanings[key];
    }
  }
  
  return hexagram.element || '变化与平衡';
};

// 获取变爻解读
const getChangingLineInterpretation = (lineIndex: number, hexagramName?: string): string => {
  const defaultInterpretations = [
    '基础正在变化，需要调整起点或重新审视根本问题。',
    '内在态度需要转变，应重新思考自己的立场。',
    '行动方式需要改变，寻找更有效的方法。',
    '环境或他人的态度正在变化，需要适应新局面。',
    '目标或方向需要调整，重新思考核心策略。',
    '事情接近尾声或新的开始，为下一阶段做好准备。'
  ];
  
  // 根据具体的卦名提供更有针对性的解读
  const specificInterpretations: Record<string, string[]> = {
    '乾': [
      '创始之初，蓄积能量，稳扎稳打。',
      '稳步前行，保持谦逊，不要锋芒太露。',
      '保持警惕，认清潜在风险，避免冒进。',
      '审时度势，不宜过度用力，适当休整。',
      '居高位而不骄，leadership需要智慧。',
      '过犹不及，避免刚愎自用，适时收手。'
    ],
    '坤': [
      '厚积薄发，打好基础，静待时机。',
      '柔顺中保持原则，不盲从他人意见。',
      '耐心等待，不要急于求成，守正不阿。',
      '谨守本分，不要超越能力范围行事。',
      '谦虚服务，以柔克刚，以退为进。',
      '不要过度顺从，需保持自己的边界。'
    ]
  };
  
  if (hexagramName && specificInterpretations[hexagramName]) {
    return specificInterpretations[hexagramName][lineIndex] || defaultInterpretations[lineIndex];
  }
  
  return defaultInterpretations[lineIndex] || '此爻的变化提示您需要适应新的情况，并做出相应的调整。';
};

// 获取选项优点
const getOptionStrengths = (result: any, option: 'A' | 'B'): string => {
  const defaultStrengths = {
    'A': '符合当前能量场，能够发挥主动性和创造力。',
    'B': '更具适应性，能够顺应环境变化，灵活应对。'
  };
  
  if (!result || !result.hexagram) return defaultStrengths[option];
  
  const hexagram = result.hexagram;
  const isOptionARecommended = result.recommendation === 'A';
  const isOptionBRecommended = result.recommendation === 'B';
  
  // 根据卦象特性生成更有针对性的优点描述
  if (option === 'A') {
    if (isOptionARecommended) {
      return `符合${hexagram.chineseName}卦的${getHexagramNature(hexagram)}特性，能带来积极成效。`;
    } else {
      return `具有一定的主动性，但需要权衡当前形势是否适合行动。`;
    }
  } else {
    if (isOptionBRecommended) {
      return `符合${hexagram.chineseName}卦的${getHexagramNature(hexagram)}特性，更适合当前局势。`;
    } else {
      return `提供了另一种可能性，但需要评估是否符合长期发展需要。`;
    }
  }
};

// 获取选项注意点
const getOptionCautions = (result: any, option: 'A' | 'B'): string => {
  const defaultCautions = {
    'A': '可能过于刚强，需要注意灵活度和适应性。',
    'B': '可能过于被动，需要注意是否会错失主动权。'
  };
  
  if (!result || !result.hexagram) return defaultCautions[option];
  
  const hexagram = result.hexagram;
  const isOptionARecommended = result.recommendation === 'A';
  const isOptionBRecommended = result.recommendation === 'B';
  
  // 根据卦象特性生成更有针对性的注意点
  if (option === 'A') {
    if (isOptionARecommended) {
      return `即使选择这条路，也需注意${hexagram.chineseName}卦中提示的潜在挑战。`;
    } else {
      return `与${hexagram.chineseName}卦的能量不太相符，可能会遇到阻力。`;
    }
  } else {
    if (isOptionBRecommended) {
      return `虽然符合当前形势，仍需注意${hexagram.chineseName}卦中的警示。`;
    } else {
      return `与${hexagram.chineseName}卦的指引有所偏离，需谨慎考量。`;
    }
  }
};

// 获取新的 LLM 建议
const getLLMAdvice = (index: number, result: any): string => {
  if (!result || !result.hexagram) {
    return '请综合考虑自身情况和外部环境，做出平衡决策。';
  }
  
  const hexagram = result.hexagram;
  const changingLines = result.changingLines || [];
  const hasChangingLines = changingLines.length > 0;
  
  // 每个索引提供不同类型的建议
  switch (index) {
    case 1: // 当前形势
      if (hasChangingLines) {
        return `当前所处形势：${hexagram.chineseName}卦暗示您${
          hexagram.modernInterpretation?.split('，')[0] || '处于变化之中'
        }，正在向${result.relatedHexagram?.chineseName || ''}卦转变，建议顺应这个变化趋势。`;
      } else {
        return `当前所处形势：${hexagram.chineseName}卦代表${
          hexagram.modernInterpretation?.split('，')[0] || getHexagramNature(hexagram)
        }，建议在此基础上${getHexagramNature(hexagram).includes('稳定') ? '稳健前行' : '积极进取'}。`;
      }
    case 2: // 行动建议
      // 根据卦象特性给出行动建议
      const action = getActionByHexagram(hexagram.chineseName || '');
      if (result.recommendation === 'A' || result.recommendation === 'B') {
        const selectedOption = result.recommendation === 'A' ? optionA.value : optionB.value;
        return `行动建议：选择"${selectedOption}"更符合当前卦象能量，${action}`;
      } else {
        return `行动建议：${action}`;
      }
    case 3: // 需要注意的事项
      return `注意事项：${getCautionByHexagram(hexagram.chineseName || '')}`;
    default:
      return '按照易经智慧，顺势而为，不勉强，不逆行。';
  }
};

// 根据卦象提供行动建议
const getActionByHexagram = (hexagramName: string): string => {
  const actionMap: Record<string, string> = {
    '乾': '积极行动，但不要过于刚强，注意保持谦虚和开放的心态。',
    '坤': '保持耐心和包容，积累能量，等待合适的时机再行动。',
    '震': '勇敢面对变化和挑战，抓住新的机会，但不要操之过急。',
    '艮': '适当停下脚步，反思当前状况，调整方向后再继续前进。',
    '坎': '面对困难保持冷静，寻找智慧的解决方案，坚守内心真实。',
    '离': '保持明智的判断，不被表象迷惑，找出事物的本质再行动。',
    '兑': '加强沟通与交流，以开放的态度寻求合作与共识。',
    '巽': '以柔克刚，灵活应对各种情况，顺势而为不强求。',
    '蒙': '保持虚心学习的态度，寻求指导和启发，不要急于求成。',
    '颐': '注重自我修养和滋养，调整身心状态，为长期发展做准备。',
    '讼': '避免冲突和争执，寻求和平解决方案，不要卷入纷争。',
    '师': '有组织有纪律地行动，集中力量办大事，需做好充分准备。',
    '比': '寻求志同道合的伙伴，加强合作关系，共同进退。',
    '小畜': '循序渐进，积少成多，不要期望一蹴而就。',
    '履': '谨慎前行，一步一个脚印，注意细节和分寸。',
    '泰': '把握当前的大好时机，积极行动，开展新的计划。',
    '否': '保持耐心，暂时收敛锋芒，韬光养晦等待时机。'
  };
  
  // 寻找匹配的卦名
  for (const key in actionMap) {
    if (hexagramName.includes(key)) {
      return actionMap[key];
    }
  }
  
  return '根据卦象指引，合理规划行动方案，既不急躁冒进，也不过于犹豫。';
};

// 根据卦象提供注意事项
const getCautionByHexagram = (hexagramName: string): string => {
  const cautionMap: Record<string, string> = {
    '乾': '不要过于强硬，避免刚愎自用，注意倾听他人意见。',
    '坤': '不要过度顺从，保持自我边界，避免委屈求全。',
    '震': '不要盲目冲动，需谨慎评估风险，避免鲁莽行事。',
    '艮': '不要过于保守，适当突破自我限制，避免错失机会。',
    '坎': '不要畏惧困难，保持内心坚定，避免陷入消极情绪。',
    '离': '不要被表面现象迷惑，保持理性判断，避免过于感性。',
    '兑': '不要一味追求愉悦，保持适度克制，避免过度放纵。',
    '巽': '不要过于谦让，适当表达自我需求，避免委曲求全。',
    '蒙': '不要盲目听信他人，保持独立思考，避免受人蒙蔽。',
    '颐': '不要过度追求物质享受，注重心灵成长，避免奢靡浪费。',
    '讼': '不要卷入无谓争端，理性处理分歧，避免加剧冲突。',
    '师': '不要独断专行，尊重团队意见，避免刚愎自用。',
    '比': '不要盲目依赖他人，保持自主能力，避免失去独立性。',
    '小畜': '不要因小失大，着眼长远利益，避免短视行为。',
    '履': '不要忽视细节，注重过程管理，避免粗心大意。',
    '泰': '不要盲目乐观，适度防范风险，避免掉以轻心。',
    '否': '不要消极悲观，保持积极心态，避免错失转机。'
  };
  
  // 寻找匹配的卦名
  for (const key in cautionMap) {
    if (hexagramName.includes(key)) {
      return cautionMap[key];
    }
  }
  
  return '任何决策都有风险，需保持警觉，既不过度担忧，也不掉以轻心，保持适度的风险意识。';
};

// 获取最终智慧总结
const getFinalWisdom = (result: any): string => {
  if (!result || !result.hexagram) {
    return '万事万物皆有其节奏和规律，顺应自然，方能无往不利。';
  }
  
  const hexagram = result.hexagram;
  const hexagramName = hexagram.chineseName || '';
  
  // 根据不同卦象提供智慧总结
  const wisdomMap: Record<string, string> = {
    '乾': '乾卦代表天行健，君子以自强不息。当下需要积极进取，同时保持谦逊和自省。',
    '坤': '坤卦代表地势坤，君子以厚德载物。当下需要包容和耐心，积累能量，等待合适时机。',
    '震': '震卦代表雷霆行动，惊蛰启发。当下需要振奋精神，开创新局面，但应保持敬畏之心。',
    '艮': '艮卦代表山岳巍峨，止而不止。当下需要适当停顿和反思，但不意味着完全放弃前进。',
    '坎': '坎卦代表行险不失其信。当下可能面临挑战，需要坚守内心真实，智慧应对困境。',
    '离': '离卦代表光明显象。当下需要明辨是非，保持清晰判断，避免被表象迷惑。',
    '兑': '兑卦代表喜悦和沟通。当下需要保持愉悦心态，加强交流和表达，但不可过度放纵。',
    '巽': '巽卦代表谦逊和渗透。当下需要保持谦虚态度，温和而坚定地推进事情，避免强势。'
  };
  
  // 寻找匹配的卦名
  for (const key in wisdomMap) {
    if (hexagramName.includes(key)) {
      return wisdomMap[key];
    }
  }
  
  // 没有找到特定卦象的智慧，提供通用智慧
  return `${hexagramName}卦提示我们：${hexagram.modernInterpretation || hexagram.judgment || '万事万物皆有其时，顺应天时地利人和，方能获得成功'}。`;
};
</script>

<style scoped>
/* 添加任何需要的样式 */
</style> 