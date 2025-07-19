<template>
  <div class="fortune-letter-content">
    <!-- 运势主题 -->
    <div class="fortune-theme">
      <div class="theme-icon">{{ themeIcon }}</div>
      <div class="theme-text">
        <h3 class="theme-title">{{ fortune.overall.description }}</h3>
        <p class="theme-description">{{ fortune.story }}</p>
      </div>
    </div>

    <!-- 今日挑战 -->
    <div v-if="fortune.dailyChallenge" class="fortune-section challenge-section">
      <div class="section-header">
        <span class="section-icon">🎯</span>
        <h4 class="section-title">今日挑战</h4>
      </div>
      <div class="section-content">
        <div class="challenge-card">
          <div class="challenge-title">今日挑战</div>
          <div class="challenge-description">{{ fortune.dailyChallenge.content }}</div>
          <div class="challenge-reward">
            <span class="reward-label">挑战提示：</span>
            <span class="reward-text">{{ fortune.dailyChallenge.tips }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 今日机遇 -->
    <div v-if="fortune.dailyOpportunity" class="fortune-section opportunity-section">
      <div class="section-header">
        <span class="section-icon">🌟</span>
        <h4 class="section-title">今日机遇</h4>
      </div>
      <div class="section-content">
        <div class="opportunity-card">
          <div class="opportunity-title">今日机遇</div>
          <div class="opportunity-description">{{ fortune.dailyOpportunity.content }}</div>
          <div class="opportunity-tip">
            <span class="tip-label">把握要点：</span>
            <span class="tip-text">{{ fortune.dailyOpportunity.tips }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 运势分析 -->
    <div class="fortune-section analysis-section">
      <div class="section-header">
        <span class="section-icon">📊</span>
        <h4 class="section-title">运势分析</h4>
      </div>
      <div class="section-content">
        <div class="analysis-grid">
          <div v-for="(aspect, key) in fortune.aspects" :key="key" class="aspect-card">
            <div class="aspect-header">
              <span class="aspect-icon">{{ getAspectIcon(key) }}</span>
              <span class="aspect-name">{{ getAspectName(key) }}</span>
              <div class="aspect-score">
                <div class="score-bar">
                  <div class="score-fill" :style="{ width: aspect.score + '%' }"></div>
                </div>
                <span class="score-text">{{ aspect.score }}%</span>
              </div>
            </div>
            <div class="aspect-description">{{ aspect.description }}</div>
            <div class="aspect-suggestion">{{ aspect.suggestion }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 幸运元素 -->
    <div class="fortune-section lucky-section">
      <div class="section-header">
        <span class="section-icon">🍀</span>
        <h4 class="section-title">幸运元素</h4>
      </div>
      <div class="section-content">
        <div class="lucky-elements">
          <div class="lucky-item">
            <span class="lucky-label">幸运色：</span>
            <span class="lucky-value">{{ fortune.luckyElements.color }}</span>
          </div>
          <div class="lucky-item">
            <span class="lucky-label">幸运数字：</span>
            <span class="lucky-value">{{ fortune.luckyElements.number }}</span>
          </div>
          <div class="lucky-item">
            <span class="lucky-label">幸运方位：</span>
            <span class="lucky-value">{{ fortune.luckyElements.direction }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 今日建议 -->
    <div class="fortune-section advice-section">
      <div class="section-header">
        <span class="section-icon">💡</span>
        <h4 class="section-title">今日建议</h4>
      </div>
      <div class="section-content">
        <div class="advice-list">
          <div v-for="(advice, index) in fortune.advice" :key="index" class="advice-item">
            <span class="advice-bullet">•</span>
            <span class="advice-text">{{ advice }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 今日箴言 -->
    <div class="fortune-section wisdom-section">
      <div class="section-content">
        <div class="wisdom-card">
          <div class="wisdom-quote">"{{ fortune.advice[0] || '保持希望，奇迹自然发生' }}"</div>
          <div class="wisdom-author">— 天玄运势师</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FortuneResult } from '../types/fortune'

interface Props {
  fortune: FortuneResult
}

const props = defineProps<Props>()

// 计算属性
const themeIcon = computed(() => {
  const level = props.fortune.overall.level
  switch (level) {
    case 'excellent': return '⭐'
    case 'good': return '✨'
    case 'normal': return '🌙'
    case 'bad': return '🌧️'
    case 'terrible': return '⚡'
    default: return '🔮'
  }
})

// 方法
const getAspectIcon = (key: string) => {
  const icons: Record<string, string> = {
    career: '💼',
    wealth: '💰',
    love: '💕',
    health: '🏃'
  }
  return icons[key] || '📈'
}

const getAspectName = (key: string) => {
  const names: Record<string, string> = {
    career: '事业运',
    wealth: '财运',
    love: '感情运',
    health: '健康运'
  }
  return names[key] || key
}
</script>

<style scoped>
.fortune-letter-content {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 运势主题 */
.fortune-theme {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.theme-icon {
  font-size: 48px;
  margin-right: 20px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.theme-title {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 8px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.theme-description {
  font-size: 16px;
  color: #5a6c7d;
  line-height: 1.6;
}

/* 通用区块样式 */
.fortune-section {
  margin-bottom: 25px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.section-icon {
  font-size: 20px;
  margin-right: 10px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.section-content {
  padding-left: 30px;
}

/* 挑战区块 */
.challenge-card {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.challenge-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.challenge-description {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
  opacity: 0.9;
}

.challenge-reward {
  font-size: 12px;
  opacity: 0.8;
}

.reward-label {
  font-weight: bold;
}

/* 机遇区块 */
.opportunity-card {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
}

.opportunity-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.opportunity-description {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
  opacity: 0.9;
}

.opportunity-tip {
  font-size: 12px;
  opacity: 0.8;
}

.tip-label {
  font-weight: bold;
}

/* 分析区块 */
.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.aspect-card {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.2s ease;
}

.aspect-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.aspect-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.aspect-icon {
  font-size: 16px;
  margin-right: 8px;
}

.aspect-name {
  font-size: 14px;
  font-weight: bold;
  color: #2c3e50;
  flex: 1;
}

.aspect-score {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-bar {
  width: 60px;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ecdc4, #44a08d);
  transition: width 0.3s ease;
}

.score-text {
  font-size: 12px;
  color: #666;
  font-weight: bold;
}

.aspect-description {
  font-size: 13px;
  color: #5a6c7d;
  line-height: 1.5;
  margin-bottom: 8px;
}

.aspect-suggestion {
  font-size: 12px;
  color: #7f8c8d;
  font-style: italic;
}

/* 幸运元素 */
.lucky-elements {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.lucky-item {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
}

.lucky-label {
  font-size: 13px;
  color: #666;
  margin-right: 8px;
  white-space: nowrap;
}

.lucky-value {
  font-size: 13px;
  color: #2c3e50;
  font-weight: 500;
}

/* 建议区块 */
.advice-list {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 15px;
}

.advice-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  line-height: 1.6;
}

.advice-item:last-child {
  margin-bottom: 0;
}

.advice-bullet {
  color: #4ecdc4;
  font-weight: bold;
  margin-right: 8px;
  margin-top: 2px;
}

.advice-text {
  font-size: 14px;
  color: #2c3e50;
  flex: 1;
}

/* 箴言区块 */
.wisdom-card {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6));
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.wisdom-quote {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  font-style: italic;
  margin-bottom: 10px;
  line-height: 1.6;
}

.wisdom-author {
  font-size: 14px;
  color: #7f8c8d;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .fortune-theme {
    flex-direction: column;
    text-align: center;
  }
  
  .theme-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .lucky-elements {
    grid-template-columns: 1fr;
  }
  
  .section-content {
    padding-left: 15px;
  }
}
</style> 