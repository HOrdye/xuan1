<template>
  <div class="guide-section">
    <!-- 标题 -->
    <div class="guide-header">
      <h2 class="guide-title">
        <span class="title-icon">📖</span>
        <span>认识你的紫微命盘</span>
      </h2>
      <p class="guide-subtitle">3分钟了解紫微斗数的核心概念</p>
    </div>

    <!-- 引导卡片列表 -->
    <div class="guide-cards">
      <!-- 卡片1：什么是本命盘 -->
      <div class="guide-card">
        <div class="card-number">01</div>
        <div class="card-content">
          <div class="card-icon">🎯</div>
          <h3 class="card-title">什么是本命盘？</h3>
          <p class="card-text">
            本命盘是根据你的<term-link term="本命盘" @show-term="$emit('show-term', $event)">出生时间</term-link>排出的命盘，包括
            <term-link term="宫位" @show-term="$emit('show-term', $event)">十二宫位</term-link>、
            <term-link term="主星" @show-term="$emit('show-term', $event)">主星</term-link>分布、
            <term-link term="辅星" @show-term="$emit('show-term', $event)">辅星</term-link>、
            <term-link term="煞星" @show-term="$emit('show-term', $event)">煞星</term-link>、
            <term-link term="四化" @show-term="$emit('show-term', $event)">生年四化</term-link>等。
          </p>
          <div class="card-highlight">
            <div class="highlight-icon">💡</div>
            <div class="highlight-text">
              <strong>这就像你的基因密码，终生不变。</strong>
              <br>
              它代表你的天赋、性格、命运框架（硬件），但具体的际遇、机会、挑战（运行环境）会随着时间变化。
            </div>
          </div>
        </div>
      </div>

      <!-- 卡片2：为什么每年都要看 -->
      <div class="guide-card">
        <div class="card-number">02</div>
        <div class="card-content">
          <div class="card-icon">📅</div>
          <h3 class="card-title">为什么每年都要看？</h3>
          <p class="card-text">
            紫微斗数的精髓在于<strong>时间推移带来的变化</strong>：
          </p>
          <div class="card-list">
            <div class="list-item">
              <span class="list-icon">🌊</span>
              <div class="list-content">
                <strong><term-link term="流年" @show-term="handleShowTerm">流年</term-link>（每年变化）</strong>
                <p>每一年都有对应的天干地支，每年会产生新的<term-link term="四化" @show-term="handleShowTerm">四化</term-link>，这些四化会飞入本命盘的不同<term-link term="宫位" @show-term="handleShowTerm">宫位</term-link>，影响当年运势。</p>
              </div>
            </div>
            <div class="list-item">
              <span class="list-icon">🌙</span>
              <div class="list-content">
                <strong><term-link term="流月" @show-term="handleShowTerm">流月</term-link>（每月变化）</strong>
                <p>每个月的运势起伏，更细致的时间分析。</p>
              </div>
            </div>
            <div class="list-item">
              <span class="list-icon">☀️</span>
              <div class="list-content">
                <strong><term-link term="流日" @show-term="handleShowTerm">流日</term-link>（每日变化）</strong>
                <p>每天的吉凶，适合做什么、不适合做什么。</p>
              </div>
            </div>
            <div class="list-item">
              <span class="list-icon">⏳</span>
              <div class="list-content">
                <strong><term-link term="大运" @show-term="handleShowTerm">大运</term-link>（每10年变化）</strong>
                <p>人生每10年为一个大运，大运会改变<term-link term="命宫" @show-term="handleShowTerm">命宫</term-link>的位置，每个大运关注的宫位和星曜不同。</p>
              </div>
            </div>
          </div>
          <div class="card-highlight">
            <div class="highlight-icon">🚢</div>
            <div class="highlight-text">
              <strong>类比理解：</strong>
              <br>
              本命盘 = 你的性格、天赋、命运框架（硬件）<br>
              流年/大运 = 不同时期的际遇、机会、挑战（运行环境）<br>
              <br>
              就像"同样的船，每年遇到不同的风浪"。
            </div>
          </div>
        </div>
      </div>

      <!-- 卡片3：空宫是什么 -->
      <div class="guide-card">
        <div class="card-number">03</div>
        <div class="card-content">
          <div class="card-icon">🌌</div>
          <h3 class="card-title">空宫是什么？</h3>
          <p class="card-text">
            <term-link term="空宫" @show-term="handleShowTerm">空宫</term-link>是指命盘中某个<term-link term="宫位" @show-term="handleShowTerm">宫位</term-link>没有<term-link term="主星" @show-term="handleShowTerm">主星</term-link>的情况。
          </p>
          <div class="card-warning">
            <div class="warning-icon">⚠️</div>
            <div class="warning-text">
              <strong>重要：空宫不是"空白"或"缺陷"！</strong>
              <br>
              空宫要看对面宫位（<term-link term="对宫" @show-term="handleShowTerm">对宫</term-link>）的星曜来论命。
            </div>
          </div>
          <div class="card-features">
            <h4 class="features-title">空宫的特点：</h4>
            <div class="features-list">
              <div class="feature-item">
                <span class="feature-icon">✨</span>
                <span><strong>可塑性强</strong>：不受主星固定特质束缚，更灵活</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🌊</span>
                <span><strong>受环境影响大</strong>：容易受外界、他人影响</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎯</span>
                <span><strong>需要主动性</strong>：不像有主星那样有明确特质，需要自己探索</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">⭐</span>
                <span><strong>看辅星煞星</strong>：空宫的吉凶要看里面的<term-link term="辅星" @show-term="handleShowTerm">辅星</term-link>、<term-link term="煞星" @show-term="handleShowTerm">煞星</term-link>组合</span>
              </div>
            </div>
          </div>
          <div class="card-highlight">
            <div class="highlight-icon">💪</div>
            <div class="highlight-text">
              <strong>记住：</strong>
              <br>
              有主星 = 特质明显，但也受限<br>
              空宫 = 可能性多，但需努力<br>
              <br>
              <strong>空宫不是坏事，是特色！</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作提示 -->
    <div class="guide-footer">
      <div class="footer-tip">
        <span class="tip-icon">💡</span>
        <span class="tip-text">点击蓝色术语可以查看详细解释</span>
      </div>
      <n-button
        type="primary"
        size="large"
        @click="emit('start')"
        class="start-button"
      >
        开始探索我的命盘 →
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui';
import TermLink from './TermLink.vue';

// Emits
const emit = defineEmits<{
  start: [];
  'show-term': [term: string];
}>();

// 处理术语点击
const handleShowTerm = (term: string) => {
  emit('show-term', term);
};
</script>

<style scoped>
.guide-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.guide-header {
  text-align: center;
  margin-bottom: 3rem;
}

.guide-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #9333EA 0%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-icon {
  font-size: 2.5rem;
}

.guide-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
}

.guide-cards {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.guide-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 2rem;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.card-number {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: rgba(147, 51, 234, 0.3);
}

.card-content {
  position: relative;
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.card-text {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.card-highlight {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(147, 51, 234, 0.05);
  border-left: 4px solid #9333EA;
  border-radius: 12px;
  margin-top: 1.5rem;
}

.highlight-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.highlight-text {
  flex: 1;
  color: #666;
  line-height: 1.8;
}

.card-warning {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(245, 158, 11, 0.1);
  border-left: 4px solid #f59e0b;
  border-radius: 12px;
  margin: 1.5rem 0;
}

.warning-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.warning-text {
  flex: 1;
  color: #666;
  line-height: 1.8;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.list-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
}

.list-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.list-content {
  flex: 1;
}

.list-content strong {
  display: block;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.list-content p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.card-features {
  margin: 1.5rem 0;
}

.features-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  color: #666;
}

.feature-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.guide-footer {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.footer-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: #666;
  font-size: 1rem;
}

.tip-icon {
  font-size: 1.2rem;
}

.start-button {
  min-width: 200px;
  height: 50px;
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .guide-title {
    font-size: 2rem;
    flex-direction: column;
  }

  .card-icon {
    font-size: 3rem;
  }

  .card-title {
    font-size: 1.5rem;
  }

  .card-text {
    font-size: 1rem;
  }
}
</style>

