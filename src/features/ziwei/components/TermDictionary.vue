<template>
  <n-modal
    v-model:show="showModal"
    preset="card"
    :title="termData?.title || '术语解释'"
    style="width: 90%; max-width: 600px;"
    :bordered="false"
    :segmented="true"
  >
    <div v-if="termData" class="term-content">
      <!-- 图标和标题 -->
      <div class="term-header">
        <div class="term-icon">{{ termData.icon }}</div>
        <h3 class="term-title">{{ termData.title }}</h3>
      </div>

      <!-- 解释内容 -->
      <div class="term-explanation">
        <p class="term-text">{{ termData.explanation }}</p>
        
        <!-- 如果有示例，显示示例 -->
        <div v-if="termData.example" class="term-example">
          <div class="example-label">💡 举个例子：</div>
          <div class="example-text">{{ termData.example }}</div>
        </div>

        <!-- 如果有相关概念，显示相关概念 -->
        <div v-if="termData.related && termData.related.length > 0" class="term-related">
          <div class="related-label">🔗 相关概念：</div>
          <div class="related-tags">
            <span
              v-for="relatedTerm in termData.related"
              :key="relatedTerm"
              class="related-tag"
              @click="showRelatedTerm(relatedTerm)"
            >
              {{ relatedTerm }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div style="text-align: right;">
        <n-button @click="showModal = false">知道了</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { NModal, NButton } from 'naive-ui';

// 术语数据定义
interface TermData {
  title: string;
  icon: string;
  explanation: string;
  example?: string;
  related?: string[];
}

// 所有术语的数据
const termsDatabase: Record<string, TermData> = {
  空宫: {
    title: '空宫',
    icon: '🌌',
    explanation: '空宫是指命盘中某个宫位没有主星（14颗主星）的情况。空宫不是"空白"或"缺陷"，而是要看对面宫位（对宫）的星曜来论命。空宫的特点是：可塑性强、受环境影响大、需要主动性。',
    example: '如果你的命宫是空宫，那么你的性格特质要看对面"迁移宫"的星曜。这让你的可塑性强，但也要注意不要过度迎合他人而失去自我。',
    related: ['对宫', '主星', '宫位']
  },
  对宫: {
    title: '对宫',
    icon: '🔄',
    explanation: '对宫是指命盘中与某个宫位相对（相差6个宫位）的宫位。例如：命宫的对宫是迁移宫，夫妻宫的对宫是官禄宫。当某个宫位是空宫时，需要借对宫的星曜来解读。',
    example: '命宫空宫时，要看迁移宫（对宫）的星曜来了解性格特质。',
    related: ['空宫', '宫位']
  },
  四化: {
    title: '四化',
    icon: '✨',
    explanation: '四化是指化禄、化权、化科、化忌四种变化。每年、每月、每日都会产生新的四化，这些四化会飞入本命盘的不同宫位，影响当年的运势。四化是紫微斗数中"变化"的核心。',
    example: '2024年（甲辰年）的四化与2025年（乙巳年）的四化完全不同，所以每年的运势都会变化。',
    related: ['流年', '化禄', '化权', '化科', '化忌']
  },
  流年: {
    title: '流年',
    icon: '📅',
    explanation: '流年是指每一年对应的天干地支和运势变化。每年都会产生新的四化，这些四化会飞入本命盘的不同宫位，影响当年的运势。流年是紫微斗数中"时间变化"的重要概念。',
    example: '同样的命盘，2024年和2025年的运势完全不同，因为每年的流年四化不同。',
    related: ['四化', '流月', '流日', '大运']
  },
  流月: {
    title: '流月',
    icon: '🌙',
    explanation: '流月是指每个月的运势变化。比流年更细致，可以分析每个月的运势起伏和适合做的事情。',
    example: '即使同一年，不同月份的运势也会有所不同。',
    related: ['流年', '流日']
  },
  流日: {
    title: '流日',
    icon: '☀️',
    explanation: '流日是指每天的吉凶和运势。最细致的时间分析，可以告诉你每天适合做什么、不适合做什么。',
    example: '今天适合做重要决定吗？查看流日运势就知道了。',
    related: ['流年', '流月']
  },
  大运: {
    title: '大运',
    icon: '⏳',
    explanation: '大运是指人生每10年为一个阶段的运势变化。每个大运都会改变命宫的位置，关注的宫位和星曜也不同。例如：0-9岁走第一个大运，10-19岁走第二个大运。',
    example: '你现在30岁，正在走第三个大运（20-29岁）或第四个大运（30-39岁）。',
    related: ['流年', '命宫']
  },
  主星: {
    title: '主星',
    icon: '⭐',
    explanation: '主星是紫微斗数中的14颗主要星曜：紫微、天机、太阳、武曲、天同、廉贞、天府、太阴、贪狼、巨门、天相、天梁、七杀、破军。主星决定了一个宫位的基本特质和能量。',
    example: '如果你的命宫有紫微星，说明你具有领导力和权威性。',
    related: ['辅星', '煞星', '空宫']
  },
  辅星: {
    title: '辅星',
    icon: '🌟',
    explanation: '辅星是辅助主星的星曜，如左辅、右弼、文昌、文曲、天魁、天钺等。辅星可以增强或改变主星的特质，提供额外的能量和影响。',
    example: '命宫有紫微星，再加上左辅、右弼，说明你不仅有领导力，还有得力助手。',
    related: ['主星', '煞星']
  },
  煞星: {
    title: '煞星',
    icon: '⚡',
    explanation: '煞星是指具有挑战性和压力的星曜，如擎羊、陀罗、火星、铃星等。煞星不是"坏星"，而是代表需要克服的挑战和成长的机会。',
    example: '命宫有煞星，说明你的人生会有一些挑战，但这也是成长的机会。',
    related: ['主星', '辅星']
  },
  宫位: {
    title: '宫位',
    icon: '🏛️',
    explanation: '宫位是命盘中的12个位置，分别代表人生的不同方面：命宫（性格）、兄弟宫、夫妻宫、子女宫、财帛宫、疾厄宫、迁移宫、奴仆宫、官禄宫、田宅宫、福德宫、父母宫。',
    example: '命宫代表你的性格和天赋，财帛宫代表你的财运和赚钱方式。',
    related: ['空宫', '对宫']
  },
  化禄: {
    title: '化禄',
    icon: '💰',
    explanation: '化禄是四化之一，代表财富、机会、收获。化禄飞入某个宫位，说明这个方面会有好的发展和收获。',
    example: '流年化禄飞入财帛宫，说明今年财运不错，会有好的赚钱机会。',
    related: ['四化', '化权', '化科', '化忌']
  },
  化权: {
    title: '化权',
    icon: '👑',
    explanation: '化权是四化之一，代表权力、地位、影响力。化权飞入某个宫位，说明这个方面会有提升和突破。',
    example: '流年化权飞入官禄宫，说明今年事业会有提升，可能升职或获得更多权力。',
    related: ['四化', '化禄', '化科', '化忌']
  },
  化科: {
    title: '化科',
    icon: '📚',
    explanation: '化科是四化之一，代表名声、学问、贵人。化科飞入某个宫位，说明这个方面会有好的名声和贵人相助。',
    example: '流年化科飞入官禄宫，说明今年事业会有好的名声，可能有贵人相助。',
    related: ['四化', '化禄', '化权', '化忌']
  },
  化忌: {
    title: '化忌',
    icon: '⚠️',
    explanation: '化忌是四化之一，代表挑战、压力、需要注意的地方。化忌不是"凶"，而是提醒你在这个方面需要谨慎和努力。',
    example: '流年化忌飞入命宫，说明今年要特别注意情绪管理和人际关系，可能会有一些挑战，但这也是成长的机会。',
    related: ['四化', '化禄', '化权', '化科']
  },
  本命盘: {
    title: '本命盘',
    icon: '🎯',
    explanation: '本命盘是根据出生时间排出的命盘，包括十二宫位、主星分布、辅星、煞星、生年四化等。本命盘是固定不变的，就像你的基因密码，终生不变。',
    example: '你的本命盘代表你的性格、天赋、命运框架，这是固定不变的。',
    related: ['流年', '大运', '宫位']
  },
  出生时间: {
    title: '出生时间',
    icon: '🕐',
    explanation: '出生时间包括年、月、日、时（时辰），是排盘的基础数据。不同的出生时间会产生完全不同的命盘。',
    example: '1990年3月15日14:30出生，对应的农历和时辰会影响命盘的排布。',
    related: ['本命盘', '宫位']
  },
  十二宫位: {
    title: '十二宫位',
    icon: '🏛️',
    explanation: '十二宫位是命盘中的12个位置，分别代表人生的不同方面：命宫（性格）、兄弟宫、夫妻宫、子女宫、财帛宫、疾厄宫、迁移宫、奴仆宫、官禄宫、田宅宫、福德宫、父母宫。',
    example: '命宫代表你的性格和天赋，财帛宫代表你的财运和赚钱方式。',
    related: ['宫位', '空宫', '对宫']
  },
  生年四化: {
    title: '生年四化',
    icon: '✨',
    explanation: '生年四化是根据出生年份的天干计算出的四化，是本命盘的一部分，固定不变。与流年四化不同，生年四化是伴随你一生的。',
    example: '如果你出生在甲年，那么你的生年四化就是甲年的四化，这是固定不变的。',
    related: ['四化', '流年', '本命盘']
  },
  命宫: {
    title: '命宫',
    icon: '🌟',
    explanation: '命宫是十二宫位中最重要的宫位，代表你的性格、天赋、人生方向。命宫的主星和星曜组合决定了你的基本特质。',
    example: '如果你的命宫有紫微星，说明你具有领导力和权威性。',
    related: ['宫位', '主星', '大运']
  }
};

// Props
interface Props {
  term?: string;
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  term: '',
  show: false
});

// Emits
const emit = defineEmits<{
  'update:show': [value: boolean];
  'show-term': [term: string];
}>();

// 显示状态
const showModal = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
});

// 当前术语数据
const termData = computed<TermData | null>(() => {
  if (!props.term) return null;
  return termsDatabase[props.term] || null;
});

// 显示相关术语
const showRelatedTerm = (relatedTerm: string) => {
  // 先关闭当前弹窗
  showModal.value = false;
  // 触发父组件显示相关术语
  emit('show-term', relatedTerm);
};
</script>

<style scoped>
.term-content {
  padding: 1rem 0;
}

.term-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.term-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.term-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.term-explanation {
  line-height: 1.8;
}

.term-text {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

.term-example {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(147, 51, 234, 0.05);
  border-left: 3px solid #9333EA;
  border-radius: 8px;
}

.example-label {
  font-weight: bold;
  color: #9333EA;
  margin-bottom: 0.5rem;
}

.example-text {
  color: #666;
  font-size: 0.95rem;
}

.term-related {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.related-label {
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.related-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.related-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(147, 51, 234, 0.1);
  color: #9333EA;
  border-radius: 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.related-tag:hover {
  background: rgba(147, 51, 234, 0.2);
  transform: translateY(-2px);
}
</style>

