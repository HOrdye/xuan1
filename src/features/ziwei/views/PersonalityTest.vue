<template>
  <div class="personality-test min-h-screen relative overflow-hidden">
    <!-- 动态星空背景 -->
    <div class="cosmic-background">
      <div class="stars-layer"></div>
      <div class="nebula-layer"></div>
    </div>

    <div class="relative z-10 p-4 pb-20">
      <!-- 进度条 -->
      <div class="progress-section mb-8">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <div class="progress-text">
          第 {{ currentQuestionIndex + 1 }} / {{ totalQuestions }} 题
        </div>
      </div>

      <!-- 题目卡片 -->
      <div v-if="currentQuestion" class="question-card">
        <div class="question-header">
          <div class="question-category">{{ currentQuestion.category }}</div>
          <h2 class="question-title">{{ currentQuestion.title }}</h2>
        </div>

        <div class="options-list">
          <div
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="option-item"
            :class="{ 'selected': selectedAnswer === index }"
            @click="selectAnswer(index)"
          >
            <div class="option-content">
              <div class="option-icon">{{ option.icon }}</div>
              <div class="option-text">
                <div class="option-label">{{ option.label }}</div>
                <div class="option-description">{{ option.description }}</div>
              </div>
            </div>
            <div v-if="selectedAnswer === index" class="selected-indicator">✓</div>
          </div>
        </div>

        <!-- 下一步按钮 -->
        <div class="action-section">
          <n-button
            type="primary"
            size="large"
            :disabled="selectedAnswer === null"
            @click="nextQuestion"
            class="next-button"
          >
            {{ isLastQuestion ? '查看结果' : '下一题' }}
          </n-button>
        </div>
      </div>

      <!-- 结果页面（探索式展示） -->
      <div v-if="showResult" class="result-card">
        <div class="result-header">
          <div class="result-icon">🌟</div>
          <h2 class="result-title">探索完成！</h2>
          <!-- 探索式展示：强调自我认知而非验证 -->
          <p class="result-subtitle">通过你的回答，我们发现了以下潜在特质：</p>
        </div>

        <!-- 自我探索结果展示 -->
        <div v-if="personalityTrait" class="predicted-star">
          <div class="trait-icon">{{ personalityTrait.emoji }}</div>
          <h3 class="trait-name">{{ personalityTrait.name }}</h3>
          <p class="trait-description">{{ personalityTrait.description }}</p>
          <!-- 强调共鸣而非确定 -->
          <div class="resonance-stars">
            <p class="resonance-text">这些特质与 <span class="star-names">{{ personalityTrait.resonanceStars.join('、') }}</span> 等星曜产生共鸣</p>
          </div>
        </div>

        <!-- 反思性问题 -->
        <div class="reflection-questions">
          <h4 class="questions-title">💭 思考一下</h4>
          <ul class="questions-list">
            <li>这个描述在哪些方面让你产生共鸣？</li>
            <li>有哪些特质是你之前没有意识到的？</li>
            <li>你希望自己的星盘在哪些方面与之呼应？</li>
          </ul>
        </div>

        <!-- 价值解释环节 -->
        <div class="value-explanation">
          <div class="explanation-header" @click="toggleExplanation">
            <span class="explanation-icon">💡</span>
            <span class="explanation-title">为什么需要两个步骤？</span>
            <span class="explanation-toggle">{{ showExplanation ? '−' : '+' }}</span>
          </div>
          <div v-if="showExplanation" class="explanation-content">
            <div class="explanation-item">
              <div class="item-title">🧠 心理测试</div>
              <div class="item-desc">反映你后天的性格发展和自我认知</div>
            </div>
            <div class="explanation-item">
              <div class="item-title">🌟 紫微命盘</div>
              <div class="item-desc">揭示你先天的天赋特质和人生蓝图</div>
            </div>
            <div class="explanation-summary">
              <strong>🌈 两者结合，帮你更全面理解自己：</strong>
              <ul>
                <li>先天优势如何发挥？</li>
                <li>后天发展如何优化？</li>
                <li>自我认知与天赋是否一致？</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 引导文案优化：从"验证猜测"变为"探索发现" -->
        <div class="result-guide">
          <p class="guide-text">✨ 解锁你的先天星盘，发现更完整的自己</p>
          <p class="guide-subtext">输入你的生辰信息，探索星盘揭示的先天特质</p>
        </div>

        <div class="result-actions">
          <n-button
            type="primary"
            size="large"
            @click="goToChartInput"
            class="action-button"
          >
            解锁完整星盘 →
          </n-button>
          <n-button
            type="default"
            size="large"
            @click="restartTest"
            class="action-button"
          >
            重新测试
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NButton } from 'naive-ui';

// 认知阶梯埋点：追踪用户行为
const trackCognitiveLadder = (event: string, data?: any) => {
  try {
    const eventData = {
      event,
      timestamp: new Date().toISOString(),
      ...data
    };
    
    // 保存到localStorage（后续可以发送到分析服务）
    const events = JSON.parse(localStorage.getItem('ziwei_cognitive_ladder_events') || '[]');
    events.push(eventData);
    
    // 限制事件数量（最多保存1000条）
    if (events.length > 1000) {
      events.splice(0, events.length - 1000);
    }
    
    localStorage.setItem('ziwei_cognitive_ladder_events', JSON.stringify(events));
    
    console.log('📊 认知阶梯埋点:', event, data);
  } catch (error) {
    console.warn('⚠️ 埋点记录失败:', error);
  }
};

const router = useRouter();

// 题目数据
interface Question {
  category: string;
  title: string;
  options: {
    icon: string;
    label: string;
    description: string;
    scores: {
      personality?: number; // 外向+1, 内向-1
      decision?: number;     // 果断+1, 谨慎-1
      values?: number;       // 名利+1, 情感-1
    };
  }[];
}

// Week 1 MVP: 简化为3道题（性格倾向1题 + 决策风格1题 + 价值观1题）
const questions: Question[] = [
  // 第1题：性格倾向（外向/内向）
  {
    category: '性格倾向',
    title: '在社交场合，你更倾向于？',
    options: [
      {
        icon: '🎉',
        label: '主动交流',
        description: '喜欢主动认识新朋友，享受热闹的氛围',
        scores: { personality: 1 }
      },
      {
        icon: '🤔',
        label: '观察思考',
        description: '更喜欢观察和思考，在熟悉的小圈子里更自在',
        scores: { personality: -1 }
      }
    ]
  },
  // 第2题：决策风格（果断/谨慎）
  {
    category: '决策风格',
    title: '面对重要选择时，你更倾向于？',
    options: [
      {
        icon: '⚡',
        label: '快速决定',
        description: '相信第一感觉，快速做出决定',
        scores: { decision: 1 }
      },
      {
        icon: '🔍',
        label: '仔细考虑',
        description: '需要充分了解信息，反复权衡',
        scores: { decision: -1 }
      }
    ]
  },
  // 第3题：价值观（事业/情感）
  {
    category: '价值观',
    title: '对你来说，什么更重要？',
    options: [
      {
        icon: '💎',
        label: '事业成就',
        description: '追求事业成功和社会地位',
        scores: { values: 1 }
      },
      {
        icon: '❤️',
        label: '情感关系',
        description: '更重视家人朋友和情感连接',
        scores: { values: -1 }
      }
    ]
  }
];

// 状态管理
const currentQuestionIndex = ref(0);
const selectedAnswer = ref<number | null>(null);
const answers = ref<number[]>([]);
const showResult = ref(false);
const showExplanation = ref(false); // 价值解释展开/收起状态

// 计算属性
const totalQuestions = questions.length;
const currentQuestion = computed(() => questions[currentQuestionIndex.value]);
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions - 1);
const progress = computed(() => ((currentQuestionIndex.value + 1) / totalQuestions) * 100);

// 得分统计
const scores = computed(() => {
  let personalityScore = 0;
  let decisionScore = 0;
  let valuesScore = 0;

  answers.value.forEach((answerIndex, questionIndex) => {
    const question = questions[questionIndex];
    const option = question.options[answerIndex];
    
    if (option.scores.personality !== undefined) {
      personalityScore += option.scores.personality;
    }
    if (option.scores.decision !== undefined) {
      decisionScore += option.scores.decision;
    }
    if (option.scores.values !== undefined) {
      valuesScore += option.scores.values;
    }
  });

  return {
    personality: personalityScore > 0 ? '外向理性' : personalityScore < 0 ? '内向感性' : '平衡型',
    decision: decisionScore > 0 ? '果断创新' : decisionScore < 0 ? '谨慎保守' : '平衡型',
    values: valuesScore > 0 ? '名利自由' : valuesScore < 0 ? '情感稳定' : '平衡型'
  };
});

// 模糊化特质展示（Week 1 MVP优化）
interface PersonalityTrait {
  name: string;
  emoji: string;
  description: string;
  resonanceStars: string[]; // 共鸣的星曜列表（模糊化，不直接说"你是XX型"）
}

const personalityTrait = computed<PersonalityTrait | null>(() => {
  if (answers.value.length !== 3) return null;

  const personalityScore = answers.value.reduce((sum, answerIndex, questionIndex) => {
    const question = questions[questionIndex];
    const option = question.options[answerIndex];
    return sum + (option.scores.personality || 0);
  }, 0);

  const decisionScore = answers.value.reduce((sum, answerIndex, questionIndex) => {
    const question = questions[questionIndex];
    const option = question.options[answerIndex];
    return sum + (option.scores.decision || 0);
  }, 0);

  const valuesScore = answers.value.reduce((sum, answerIndex, questionIndex) => {
    const question = questions[questionIndex];
    const option = question.options[answerIndex];
    return sum + (option.scores.values || 0);
  }, 0);

  // 根据得分推测特质类型（模糊化设计）
  // 外向+果断+事业 = 开拓者（七杀、破军、贪狼）
  // 内向+谨慎+情感 = 守护者（太阴、天同、天梁）
  // 外向+果断+情感 = 领导者（紫微、武曲）
  // 内向+谨慎+事业 = 规划者（天府、天相）
  // 其他组合 = 探索者（天机、太阳等）
  
  if (personalityScore > 0 && decisionScore > 0 && valuesScore > 0) {
    return {
      name: '开拓者',
      emoji: '🚀',
      description: '你具有开拓进取的特质，喜欢主动出击，追求事业成功',
      resonanceStars: ['七杀', '破军', '贪狼']
    };
  } else if (personalityScore < 0 && decisionScore < 0 && valuesScore < 0) {
    return {
      name: '守护者',
      emoji: '🛡️',
      description: '你具有守护关怀的特质，重视情感关系，行事谨慎稳重',
      resonanceStars: ['太阴', '天同', '天梁']
    };
  } else if (personalityScore > 0 && decisionScore > 0) {
    return {
      name: '领导者',
      emoji: '👑',
      description: '你具有领导决策的特质，善于快速做出决定，影响他人',
      resonanceStars: ['紫微', '武曲']
    };
  } else if (personalityScore < 0 && decisionScore < 0) {
    return {
      name: '规划者',
      emoji: '📋',
      description: '你具有规划组织的特质，喜欢详细规划，追求稳定',
      resonanceStars: ['天府', '天相']
    };
  } else {
    return {
      name: '探索者',
      emoji: '🔍',
      description: '你具有探索思考的特质，喜欢学习和发现新事物',
      resonanceStars: ['天机', '太阳', '巨门']
    };
  }
});

// 选择答案
const selectAnswer = (index: number) => {
  selectedAnswer.value = index;
};

// 下一题
const nextQuestion = () => {
  if (selectedAnswer.value === null) return;

  answers.value.push(selectedAnswer.value);

  if (isLastQuestion.value) {
    // 显示结果
    showResult.value = true;
    // 认知阶梯埋点：测试完成
    trackCognitiveLadder('personality_test_completed', {
      questionCount: answers.value.length,
      answers: answers.value
    });
  } else {
    // 下一题
    currentQuestionIndex.value++;
    selectedAnswer.value = null;
  }
};

// 重新测试
const restartTest = () => {
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  answers.value = [];
  showResult.value = false;
  // 认知阶梯埋点：重新测试
  trackCognitiveLadder('personality_test_restarted');
};

// 切换价值解释展开/收起
const toggleExplanation = () => {
  showExplanation.value = !showExplanation.value;
};

// 跳转到命盘输入
const goToChartInput = () => {
  // 认知阶梯埋点：从测试结果跳转到排盘输入
  trackCognitiveLadder('test_to_chart_input', {
    trait: personalityTrait.value?.name
  });
  
  // 保存测试结果到localStorage（用于后续对比，但不影响排盘算法）
  if (personalityTrait.value) {
    localStorage.setItem('ziwei_personality_test_result', JSON.stringify({
      trait: personalityTrait.value,
      timestamp: new Date().toISOString(),
      note: '此测试结果仅用于用户体验优化，不影响命盘计算'
    }));
  }
  
  router.push('/ziwei/input');
};

// 页面加载时埋点：测试开始
onMounted(() => {
  trackCognitiveLadder('personality_test_started');
});
</script>

<style scoped>
.personality-test {
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
    radial-gradient(1px 1px at 50% 50%, #fff, transparent);
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
}

/* 进度条 */
.progress-section {
  max-width: 800px;
  margin: 0 auto;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #9333EA 0%, #3B82F6 100%);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.progress-text {
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

/* 题目卡片 */
.question-card {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.question-header {
  text-align: center;
  margin-bottom: 2rem;
}

.question-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(147, 51, 234, 0.1);
  color: #9333EA;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.question-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

/* 选项列表 */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.02);
  border: 2px solid transparent;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-item:hover {
  background: rgba(147, 51, 234, 0.05);
  border-color: rgba(147, 51, 234, 0.2);
  transform: translateY(-2px);
}

.option-item.selected {
  background: rgba(147, 51, 234, 0.1);
  border-color: #9333EA;
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.2);
}

.option-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.option-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.option-text {
  flex: 1;
}

.option-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.option-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.selected-indicator {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #9333EA;
  color: white;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: bold;
  flex-shrink: 0;
}

/* 操作区域 */
.action-section {
  text-align: center;
}

.next-button {
  min-width: 200px;
  height: 50px;
  font-size: 1.1rem;
}

/* 结果页面 */
.result-card {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 3rem 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.result-header {
  margin-bottom: 2rem;
}

.result-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.result-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.result-subtitle {
  font-size: 1.1rem;
  color: #666;
}

.predicted-star {
  margin: 2rem 0;
  padding: 2rem;
  background: rgba(147, 51, 234, 0.05);
  border-radius: 16px;
}

.trait-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.trait-name {
  font-size: 2rem;
  font-weight: bold;
  color: #9333EA;
  margin-bottom: 0.5rem;
}

.trait-description {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.resonance-stars {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(147, 51, 234, 0.1);
}

.resonance-text {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
}

.star-names {
  color: #9333EA;
  font-weight: 600;
}

.result-guide {
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 12px;
  text-align: center;
}

.guide-text {
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.guide-subtext {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

/* 反思性问题 */
.reflection-questions {
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 12px;
  border-left: 3px solid rgba(59, 130, 246, 0.3);
}

.questions-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.questions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.questions-list li {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  color: #555;
  font-size: 0.95rem;
  line-height: 1.6;
  transition: all 0.2s ease;
}

.questions-list li:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateX(4px);
}

/* 价值解释环节 */
.value-explanation {
  margin: 2rem 0;
  background: rgba(147, 51, 234, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(147, 51, 234, 0.2);
  overflow: hidden;
}

.explanation-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
  user-select: none;
}

.explanation-header:hover {
  background: rgba(147, 51, 234, 0.08);
}

.explanation-icon {
  font-size: 1.2rem;
}

.explanation-title {
  flex: 1;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.explanation-toggle {
  font-size: 1.5rem;
  font-weight: bold;
  color: #9333EA;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(147, 51, 234, 0.1);
}

.explanation-content {
  padding: 0 1.5rem 1.5rem 1.5rem;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.explanation-item {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
}

.item-title {
  font-weight: 600;
  color: #9333EA;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}

.item-desc {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.explanation-summary {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border-left: 3px solid rgba(147, 51, 234, 0.5);
}

.explanation-summary strong {
  display: block;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.explanation-summary ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
}

.explanation-summary li {
  padding: 0.5rem 0;
  color: #555;
  font-size: 0.9rem;
  line-height: 1.6;
  padding-left: 1.5rem;
  position: relative;
}

.explanation-summary li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #9333EA;
  font-weight: bold;
}

.result-scores {
  margin: 2rem 0;
  text-align: left;
}

.scores-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.scores-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.score-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.score-label {
  color: #666;
}

.score-value {
  color: #9333EA;
  font-weight: 600;
}

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.action-button {
  min-width: 160px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .question-card,
  .result-card {
    padding: 1.5rem;
  }

  .question-title {
    font-size: 1.2rem;
  }

  .option-item {
    padding: 1rem;
  }

  .result-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }
}
</style>

