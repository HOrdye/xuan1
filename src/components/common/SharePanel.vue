<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
      @click.self="close"
    >
      <div
        class="relative w-full max-w-3xl mx-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/10 max-h-[90vh] overflow-hidden"
      >
        <!-- Close Button -->
        <button @click="close" class="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-lg z-10">
          ✕
        </button>

        <!-- Header -->
        <div class="p-6 border-b border-white/10">
          <h3 class="text-xl font-bold text-center text-white">生成分享图</h3>
        </div>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          <div v-if="isLoading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mb-4"></div>
            <p class="text-purple-200">正在生成专属图片...</p>
          </div>
          
          <div v-else-if="imageDataUrl" class="space-y-6">
            <!-- 图片预览 -->
            <div class="space-y-4">
              <p class="text-center text-gray-300 text-sm">长按或右键点击下方图片即可保存</p>
              <div class="rounded-lg overflow-hidden border-2 border-purple-400 shadow-lg shadow-purple-500/20">
                <img :src="imageDataUrl" alt="分享图预览" class="w-full h-auto" />
              </div>
            </div>

            <!-- 社交媒体分享按钮 -->
            <div class="space-y-3">
              <h4 class="text-white font-medium text-center">选择分享平台</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  v-for="platform in socialPlatforms"
                  :key="platform.name"
                  @click="shareToSocial(platform)"
                  :disabled="!imageDataUrl"
                  class="flex flex-col items-center justify-center p-4 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div class="w-8 h-8 mb-2 flex items-center justify-center" :style="{ color: platform.color }">
                    <div v-html="platform.icon.template" class="w-6 h-6"></div>
                  </div>
                  <span class="text-xs text-gray-300 group-hover:text-white transition-colors">{{ platform.name }}</span>
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-12">
            <p class="text-red-400">图片生成失败，请重试。</p>
          </div>
        </div>

        <!-- Fixed Actions at Bottom -->
        <div class="p-6 border-t border-white/10 flex items-center justify-center space-x-4 bg-gray-800/50">
          <button
            @click="generateImage"
            :disabled="isLoading"
            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
          >
            {{ imageDataUrl ? '重新生成' : '生成图片' }}
          </button>
          <button
            v-if="canShare"
            @click="shareImage"
            :disabled="!imageDataUrl || isLoading"
            class="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
          >
            系统分享
          </button>
          <a
            v-if="imageDataUrl"
            :href="imageDataUrl"
            download="tianxuan-insight.png"
            class="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-700 transition-colors"
          >
            下载图片
          </a>
          <button
            @click="close"
            class="px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-600 transition-colors"
          >
            继续
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- 隐藏的分享卡片模板 -->
  <div v-if="shareCardData" ref="shareCardRef" class="fixed -top-[9999px] left-0 w-[900px] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-10 font-sans">
    <!-- 运势分享模板 -->
    <div v-if="isFortuneShare" class="bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl">
      <!-- 头部 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-3">🔮 天玄运势分析</h1>
        <div class="text-purple-200 text-lg">今日运势专业解读</div>
        <div class="text-purple-300 text-sm mt-2">{{ new Date().toLocaleDateString('zh-CN') }} · 个性化分析</div>
      </div>

      <!-- 问题 -->
      <div v-if="shareCardData.question" class="mb-8">
        <div class="bg-gradient-to-r from-white/15 to-white/10 rounded-xl p-6 border border-white/25">
          <div class="text-purple-300 text-base mb-2 flex items-center">
            <span class="mr-2">💭</span>
            <span class="font-medium">咨询内容</span>
          </div>
          <div class="text-white text-xl font-medium">{{ shareCardData.question }}</div>
        </div>
      </div>

      <!-- 运势分析 -->
      <div class="mb-8">
        <div class="text-purple-300 text-base mb-6 flex items-center">
          <span class="mr-2">✨</span>
          <span class="font-medium">运势分析</span>
        </div>
        
        <div class="grid grid-cols-2 gap-6">
          <div class="bg-gradient-to-r from-blue-500/25 to-cyan-500/25 rounded-xl p-6 border border-blue-400/40">
            <div class="text-white text-base leading-relaxed">{{ shareCardData.tianxuanAnalysis }}</div>
          </div>
          <div class="bg-gradient-to-r from-green-500/25 to-emerald-500/25 rounded-xl p-6 border border-green-400/40">
            <div class="text-white text-base leading-relaxed">{{ shareCardData.energyAnalysis }}</div>
          </div>
        </div>
      </div>

      <!-- 核心洞察 -->
      <div v-if="shareCardData.insights.length > 0" class="mb-8">
        <div class="text-purple-300 text-base mb-4 flex items-center">
          <span class="mr-2">💎</span>
          <span class="font-medium">核心洞察</span>
        </div>
        <div class="space-y-4">
          <div v-for="(insight, index) in shareCardData.insights" :key="insight" class="bg-white/15 rounded-xl p-5 border border-white/25 relative">
            <div class="absolute -left-3 -top-3 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-sm text-white font-bold">
              {{ index + 1 }}
            </div>
            <div class="text-white text-base leading-relaxed">{{ insight }}</div>
          </div>
        </div>
      </div>

      <!-- 指导建议 -->
      <div v-if="shareCardData.advice" class="mb-8">
        <div class="text-purple-300 text-base mb-4 flex items-center">
          <span class="mr-2">💡</span>
          <span class="font-medium">天玄指引</span>
        </div>
        <div class="bg-gradient-to-r from-yellow-400/25 to-orange-400/25 rounded-xl p-6 border border-yellow-400/40">
          <div class="text-white text-base leading-relaxed">{{ shareCardData.advice }}</div>
        </div>
      </div>

      <!-- 底部 -->
      <div class="text-center pt-6 border-t border-white/25">
        <div class="text-purple-300 text-base font-medium">通过天玄Web获得专业运势指导</div>
        <div class="text-white text-sm mt-2">感谢宇宙的智慧 ✨ 愿指引照亮前路</div>
      </div>
    </div>

    <!-- 塔罗牌分享模板 -->
    <div v-else class="bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl">
      <!-- 头部 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-3">🔮 天玄塔罗占卜</h1>
        <div class="text-purple-200 text-lg">{{ shareCardData.spread }}</div>
        <div class="text-purple-300 text-sm mt-2">{{ new Date().toLocaleDateString('zh-CN') }} · 专业解读</div>
      </div>

      <!-- 问题 -->
      <div v-if="shareCardData.question" class="mb-8">
        <div class="bg-gradient-to-r from-white/15 to-white/10 rounded-xl p-6 border border-white/25">
          <div class="text-purple-300 text-base mb-2 flex items-center">
            <span class="mr-2">💭</span>
            <span class="font-medium">咨询问题</span>
          </div>
          <div class="text-white text-xl font-medium">{{ shareCardData.question }}</div>
        </div>
      </div>

      <!-- 卡牌展示 -->
      <div class="mb-8">
        <div class="text-purple-300 text-base mb-6 flex items-center">
          <span class="mr-2">✨</span>
          <span class="font-medium">神秘卡牌</span>
        </div>
        
        <!-- 根据卡牌数量调整布局 -->
        <div v-if="shareCardData.cards.length <= 3" class="flex justify-center space-x-8">
          <div v-for="card in shareCardData.cards" :key="card.id" class="text-center">
            <div class="relative w-28 h-42 mb-4 group">
              <img 
                :src="card.imageUrl" 
                :alt="card.name"
                class="w-full h-full object-cover rounded-2xl border-3 border-yellow-400/70 shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                :class="card.orientation === 'reversed' ? 'transform rotate-180' : ''"
              />
              <div class="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-sm text-black font-bold shadow-xl">
                {{ card.orientation === 'reversed' ? '逆' : '正' }}
              </div>
              <!-- 卡牌光效 -->
              <div class="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/15 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="text-white text-base font-medium mb-2">{{ card.name }}</div>
            <div class="text-purple-300 text-sm bg-white/15 px-3 py-1 rounded-full">{{ card.position }}</div>
          </div>
        </div>
        
        <!-- 多卡牌网格布局 -->
        <div v-else class="grid grid-cols-3 gap-6 justify-items-center">
          <div v-for="card in shareCardData.cards" :key="card.id" class="text-center">
            <div class="relative w-24 h-36 mb-3 group">
              <img 
                :src="card.imageUrl" 
                :alt="card.name"
                class="w-full h-full object-cover rounded-xl border-2 border-yellow-400/70 shadow-xl transform group-hover:scale-105 transition-transform duration-300"
                :class="card.orientation === 'reversed' ? 'transform rotate-180' : ''"
              />
              <div class="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs text-black font-bold shadow-lg">
                {{ card.orientation === 'reversed' ? '逆' : '正' }}
              </div>
            </div>
            <div class="text-white text-sm font-medium mb-1">{{ card.name }}</div>
            <div class="text-purple-300 text-xs bg-white/15 px-2 py-1 rounded">{{ card.position }}</div>
          </div>
        </div>
      </div>

      <!-- 天玄专业分析 -->
      <div v-if="shareCardData.tianxuanAnalysis" class="mb-8">
        <div class="text-purple-300 text-base mb-4 flex items-center">
          <span class="mr-2">🌟</span>
          <span class="font-medium">天玄专业解读</span>
        </div>
        <div class="bg-gradient-to-r from-indigo-500/25 to-purple-500/25 rounded-xl p-6 border border-indigo-400/40">
          <div class="text-white text-base leading-relaxed">{{ shareCardData.tianxuanAnalysis }}</div>
        </div>
      </div>

      <!-- 时空能量分析 -->
      <div v-if="shareCardData.energyAnalysis" class="mb-8">
        <div class="text-purple-300 text-base mb-4 flex items-center">
          <span class="mr-2">⚡</span>
          <span class="font-medium">时空能量解析</span>
        </div>
        <div class="bg-gradient-to-r from-blue-500/25 to-cyan-500/25 rounded-xl p-6 border border-blue-400/40">
          <div class="text-white text-base leading-relaxed">{{ shareCardData.energyAnalysis }}</div>
        </div>
      </div>

      <!-- 核心洞察 -->
      <div v-if="shareCardData.insights.length > 0" class="mb-8">
        <div class="text-purple-300 text-base mb-4 flex items-center">
          <span class="mr-2">💎</span>
          <span class="font-medium">核心洞察</span>
        </div>
        <div class="space-y-4">
          <div v-for="(insight, index) in shareCardData.insights" :key="insight" class="bg-white/15 rounded-xl p-5 border border-white/25 relative">
            <div class="absolute -left-3 -top-3 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-sm text-white font-bold">
              {{ index + 1 }}
            </div>
            <div class="text-white text-base leading-relaxed">{{ insight }}</div>
          </div>
        </div>
      </div>

      <!-- 指导建议 -->
      <div v-if="shareCardData.advice" class="mb-8">
        <div class="text-purple-300 text-base mb-4 flex items-center">
          <span class="mr-2">💡</span>
          <span class="font-medium">天玄指引</span>
        </div>
        <div class="bg-gradient-to-r from-yellow-400/25 to-orange-400/25 rounded-xl p-6 border border-yellow-400/40">
          <div class="text-white text-base leading-relaxed">{{ shareCardData.advice }}</div>
        </div>
      </div>

      <!-- 底部 -->
      <div class="text-center pt-6 border-t border-white/25">
        <div class="text-purple-300 text-base font-medium">通过天玄Web获得专业塔罗指引</div>
        <div class="text-white text-sm mt-2">感谢宇宙的智慧 ✨ 愿指引照亮前路</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import html2canvas from 'html2canvas';
import { SOCIAL_PLATFORMS } from '../../utils/shareUtils';
import type { ShareData, SocialPlatform } from '../../types/share';

const props = defineProps<{
  isOpen: boolean;
  targetRef: HTMLElement | null;
  shareData?: ShareData;
  revealedCards?: any[]; // 新增：传入已解读的卡牌数据
}>();

const emit = defineEmits(['close']);

const isLoading = ref(false);
const imageDataUrl = ref<string | null>(null);
const canShare = ref(false);
const shareCardRef = ref<HTMLElement | null>(null);

// 社交平台配置
const socialPlatforms = SOCIAL_PLATFORMS;

// 检查是否为运势分享
const isFortuneShare = computed(() => {
  return props.shareData?.hashtags?.includes('今日运势') || false;
});

// 创建运势分享数据
const createFortuneShareData = (shareData: ShareData) => {
  return {
    question: shareData.text || '今日运势咨询',
    spread: '今日运势分析',
    cards: [],
    insights: [
      '今日运势良好，各方面都有不错的发展',
      '建议保持积极心态，把握机会',
      '注意身体健康，适度运动'
    ],
    advice: '保持乐观心态，相信美好的事情即将发生',
    spreadAnalysis: '基于传统命理学和现代心理学，为您提供专业的运势指导。',
    elementAnalysis: '今日能量场稳定，适合推进重要事务。',
    tianxuanAnalysis: '天玄运势分析显示，您正处于一个积极向上的能量周期中。',
    energyAnalysis: '时空能量配置良好，有利于个人成长和发展。'
  };
};

// 分享卡片数据
const shareCardData = computed(() => {
  if (!props.shareData) {
    return null;
  }

  // 检查是否为塔罗牌分享
  const isTarotShare = props.shareData.hashtags?.includes('塔罗占卜');
  
  // 检查是否为运势分享
  const isFortuneShare = props.shareData.hashtags?.includes('今日运势');
  
  if (!isTarotShare && !isFortuneShare) {
    return null;
  }

  // 如果是运势分享，返回运势专用数据结构
  if (isFortuneShare) {
    return createFortuneShareData(props.shareData);
  }

  // 从分享数据中解析塔罗信息
  const text = props.shareData.text || '';
  
  let question = '';
  let spread = '';
  let cards: any[] = [];
  let insights: string[] = [];
  let advice = '';
  let spreadAnalysis = '';
  let elementAnalysis = '';
  let tianxuanAnalysis = ''; // 新增：天玄专业分析
  let energyAnalysis = ''; // 新增：时空能量分析

  // 解析问题
  const questionMatch = text.match(/💭 咨询问题：(.+?)(?:\n|$)/);
  if (questionMatch) {
    question = questionMatch[1].replace(/？$/, '');
  }

  // 解析牌阵
  const spreadMatch = text.match(/🎴 (.+?)(?:\n|$)/);
  if (spreadMatch) {
    spread = spreadMatch[1];
  }

  // 解析卡牌 - 优先使用传入的revealedCards数据
  if (props.revealedCards && props.revealedCards.length > 0) {
    cards = props.revealedCards.map((card, index) => ({
      id: card.id || index,
      name: card.chineseName || card.name,
      orientation: card.orientation || 'upright',
      position: card.position || `位置 ${index + 1}`,
      imageUrl: card.imageUrl || '/src/assets/new-card-back.png'
    }));
  } else {
    // 备选：从文本中解析卡牌信息
    const cardsMatch = text.match(/✨ 抽到的卡牌：(.+?)(?:\n|$)/);
    if (cardsMatch) {
      const cardNames = cardsMatch[1].split('、');
      cards = cardNames.map((cardName, index) => {
        const orientationMatch = cardName.match(/(.+?)\((.+?)\)/);
        if (orientationMatch) {
          return {
            id: index,
            name: orientationMatch[1],
            orientation: orientationMatch[2] === '逆位' ? 'reversed' : 'upright',
            position: `位置 ${index + 1}`,
            imageUrl: '/src/assets/new-card-back.png'
          };
        }
        return {
          id: index,
          name: cardName,
          orientation: 'upright',
          position: `位置 ${index + 1}`,
          imageUrl: '/src/assets/new-card-back.png'
        };
      });
    }
  }

  // 解析洞察
  const insightSection = text.match(/🌟 核心洞察：\n((?:• .+\n?)+)/);
  if (insightSection) {
    insights = insightSection[1].split('\n')
      .filter(line => line.startsWith('• '))
      .map(line => line.substring(2).trim())
      .filter(line => line);
  }

  // 解析建议
  const adviceMatch = text.match(/💡 指导建议：(.+?)(?:\n|$)/);
  if (adviceMatch) {
    advice = adviceMatch[1];
  }

  // 生成牌阵分析（如果文本中没有，则智能生成）
  if (!spreadAnalysis && spread && cards.length > 0) {
    const spreadAnalysisMap: Record<string, string> = {
      'Three Card Spread': '三牌阵展现了过去、现在、未来的时间线，帮助您理解事件的发展脉络和趋势。',
      'Love Pyramid Spread': '爱情金字塔牌阵深入探索感情的多个层面，从内心感受到外在表现，提供全面的情感指导。',
      'Decision Making Spread': '决策牌阵通过多角度分析，帮助您权衡利弊，做出明智的人生选择。',
      'Six Star Spread': '六星牌阵如星辰般照亮人生的六个重要方面，为您提供全方位的生活指引。'
    };
    spreadAnalysis = spreadAnalysisMap[spread] || `${spread}为您提供深入的洞察和指引，每个位置都有其独特的意义。`;
  }

  // 生成元素分析（基于卡牌的元素属性）
  if (!elementAnalysis && cards.length > 0) {
    const elements = cards.map(card => {
      // 优先使用传入的revealedCards中的元素信息
      if (props.revealedCards && props.revealedCards.length > 0) {
        const revealedCard = props.revealedCards.find(rc => rc.name === card.name || rc.chineseName === card.name);
        if (revealedCard && revealedCard.element) {
          return revealedCard.element;
        }
      }
      
      // 备选：根据卡牌名称推测元素
      if (card.name.includes('权杖') || card.name.includes('火') || card.name.includes('Wands')) return 'fire';
      if (card.name.includes('圣杯') || card.name.includes('水') || card.name.includes('Cups')) return 'water';
      if (card.name.includes('宝剑') || card.name.includes('风') || card.name.includes('Swords')) return 'air';
      if (card.name.includes('星币') || card.name.includes('土') || card.name.includes('Pentacles')) return 'earth';
      
      // 大阿尔卡纳卡牌的元素推测
      const majorArcanaElements: Record<string, string> = {
        '愚者': 'air', '魔术师': 'air', '女祭司': 'water', '皇后': 'earth', '皇帝': 'fire',
        '教皇': 'earth', '恋人': 'air', '战车': 'water', '力量': 'fire', '隐者': 'earth',
        '命运之轮': 'fire', '正义': 'air', '倒吊人': 'water', '死神': 'water', '节制': 'fire',
        '恶魔': 'earth', '塔': 'fire', '星星': 'air', '月亮': 'water', '太阳': 'fire',
        '审判': 'fire', '世界': 'earth'
      };
      
      return majorArcanaElements[card.name] || 'mixed';
    });
    
    const elementCount = elements.reduce((acc, element) => {
      acc[element] = (acc[element] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominantElement = Object.entries(elementCount).sort(([,a], [,b]) => (b as number) - (a as number))[0];
    
    const elementMessages: Record<string, string> = {
      fire: '火元素占主导，象征着激情、创造力和行动力。这是一个充满活力和变化的时期，适合主动出击。',
      water: '水元素较为突出，代表情感、直觉和精神层面的成长。关注内心的声音，相信直觉的指引。',
      air: '风元素的影响明显，象征思考、沟通和新的想法。理性分析和良好的沟通将帮助您前进。',
      earth: '土元素的能量强烈，代表稳定、实用和物质层面的考量。脚踏实地，稳步前进是关键。',
      mixed: '多元素的平衡组合，显示生活的多样性和复杂性。需要综合考虑各个方面，保持平衡。'
    };
    
    elementAnalysis = elementMessages[dominantElement?.[0] || 'mixed'];
  }

  // 生成天玄专业分析（如果文本中没有，则智能生成）
  if (!tianxuanAnalysis && spread && cards.length > 0) {
    const currentTime = new Date();
    const timeElement = currentTime.getHours() >= 6 && currentTime.getHours() < 18 ? '阳' : '阴';
    const seasonElement = Math.floor((currentTime.getMonth() + 1) / 3) % 4;
    const seasonNames = ['春', '夏', '秋', '冬'];
    
    const tianxuanAnalysisMap: Record<string, string> = {
      'Three Card Spread': `在${timeElement}时能量场中，三牌阵为您揭示了时间的三重奏。过去的业力种子、现在的显化状态、未来的可能性轨迹，形成了一个完整的时空能量链。当前${seasonNames[seasonElement]}季的能量特质与您的卡牌产生共振，暗示着转化的时机已经成熟。`,
      'Love Pyramid Spread': `金字塔的神秘几何结构承载着古老的爱情智慧。在天玄的解读体系中，这个牌阵不仅揭示表面的情感状态，更深层地探索灵魂层面的连接。您的感情能量正在经历一次深度的炼金术转化，从铅华到黄金的蜕变过程。`,
      'Decision Making Spread': `决策的背后是宇宙意志的显现。天玄决策牌阵运用了量子占卜学的原理，每个选择都对应着不同的时空线。您当前面临的选择点，实际上是灵魂成长路径上的重要节点，需要整合理性与直觉的双重智慧。`,
      'Six Star Spread': `六芒星是天地交融的神圣几何，代表着"如其在上，如其在下"的赫尔墨斯法则。在天玄的星象占卜体系中，六个位置对应着您生命中的六个维度，形成了一个完整的生命全息图。当前的星象配置暗示着一个新的生命周期即将开启。`
    };
    
    tianxuanAnalysis = tianxuanAnalysisMap[spread] || `${spread}承载着古老的占卜智慧，在天玄的解读体系中，每个位置都蕴含着深层的象征意义。您的卡牌组合显示出独特的能量模式，需要结合当前的时空背景进行深度解析。`;
  }

  // 生成时空能量分析（如果文本中没有，则智能生成）
  if (!energyAnalysis && cards.length > 0) {
    const majorArcanaCount = cards.filter(card => 
      ['愚者', '魔术师', '女祭司', '皇后', '皇帝', '教皇', '恋人', '战车', '力量', '隐者', 
       '命运之轮', '正义', '倒吊人', '死神', '节制', '恶魔', '塔', '星星', '月亮', '太阳', '审判', '世界'].includes(card.name)
    ).length;
    
    const reversedCount = cards.filter(card => card.orientation === 'reversed').length;
    
    let energyDescription = '';
    
    if (majorArcanaCount > cards.length / 2) {
      energyDescription = '大阿尔卡纳的强势出现表明您正处于人生的重要转折点，宇宙的高级能量正在直接影响您的命运轨迹。';
    } else {
      energyDescription = '小阿尔卡纳的主导显示您当前关注的是日常生活层面的议题，需要通过实际行动来推动变化。';
    }
    
    if (reversedCount > 0) {
      energyDescription += `逆位卡牌的出现(${reversedCount}张)提醒您需要向内探索，某些阻碍可能来自于内在的阴影或过去的业力模式。`;
    }
    
    energyDescription += `在天玄的能量解读中，您的卡牌组合展现出${cards.length === 1 ? '单一而专注' : cards.length <= 3 ? '简洁而深刻' : '复杂而全面'}的能量特质，需要您以${cards.length <= 3 ? '直觉' : '理性分析'}为主导来整合这些信息。`;
    
    energyAnalysis = energyDescription;
  }

  return {
    question,
    spread,
    cards,
    insights,
    advice,
    spreadAnalysis,
    elementAnalysis,
    tianxuanAnalysis, // 返回新增的分析
    energyAnalysis // 返回新增的分析
  };
});

// 分享到社交平台
const shareToSocial = (platform: SocialPlatform) => {
  const shareData = {
    title: props.shareData?.title || '来自天玄的启示',
    text: props.shareData?.text || '',
    url: props.shareData?.url || window.location.href,
    hashtags: props.shareData?.hashtags || ['天玄Web', '玄学', '运势']
  };

  if (platform.name === '微信') {
    alert('请长按图片保存，然后在微信中发送');
    return;
  }

  if (platform.name === '小红书') {
    alert('请保存图片后在小红书APP中发布');
    return;
  }

  const shareUrl = platform.shareUrl(shareData);
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
};

const close = () => {
  emit('close');
};

const generateImage = async () => {
  if (!shareCardRef.value) return;

  isLoading.value = true;
  imageDataUrl.value = null;

  try {
    // 动态计算实际内容高度
    const element = shareCardRef.value;
    const computedStyle = window.getComputedStyle(element);
    const padding = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
    
    // 获取所有子元素的实际高度
    let actualContentHeight = 0;
    const children = Array.from(element.children) as HTMLElement[];
    children.forEach(child => {
      const childRect = child.getBoundingClientRect();
      const childStyle = window.getComputedStyle(child);
      const childMargin = parseFloat(childStyle.marginTop) + parseFloat(childStyle.marginBottom);
      actualContentHeight += childRect.height + childMargin;
    });
    
    // 添加内边距和一些缓冲空间
    const finalHeight = actualContentHeight + padding + 40; // 40px缓冲
    
    // 提高图片质量和分辨率，使用动态计算的高度
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      background: 'transparent',
      width: 900,
      height: Math.max(finalHeight, 600) // 确保最小高度，使用计算的实际高度
    });
    
    // 创建高质量的图片
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }
    
    imageDataUrl.value = canvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Error generating image:', error);
  } finally {
    isLoading.value = false;
  }
};

const shareImage = async () => {
  if (!imageDataUrl.value) return;

  try {
    const response = await fetch(imageDataUrl.value);
    const blob = await response.blob();
    const file = new File([blob], 'tianxuan-tarot-insight.png', { type: 'image/png' });

    if (navigator.share) {
      await navigator.share({
        title: props.shareData?.title || '来自天玄的塔罗启示',
        text: props.shareData?.text || '',
        files: [file],
      });
    }
  } catch (error) {
    console.error('Error sharing image:', error);
  }
};

onMounted(() => {
  canShare.value = !!navigator.share;
});

watch(() => props.isOpen, (newVal) => {
  if (newVal && shareCardData.value) {
    // 延迟生成图片，确保DOM完全渲染
    setTimeout(() => {
      generateImage();
    }, 100);
  } else {
    // Reset state when closed
    imageDataUrl.value = null;
    isLoading.value = false;
  }
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style> 