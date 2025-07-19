<template>
  <div class="fortune-envelope-container">
    <!-- 信封状态 -->
    <div v-if="!isOpened" class="envelope-closed" @click="openEnvelope">
      <div class="envelope-wrapper">
        <!-- 信封主体 -->
        <div class="envelope-body" :class="envelopeStyle">
          <!-- 信封正面 -->
          <div class="envelope-front">
            <div class="envelope-seal">
              <div class="wax-seal">
                <span class="seal-symbol">{{ sealSymbol }}</span>
              </div>
            </div>
            <div class="envelope-content">
              <div class="recipient-info">
                <div class="recipient-name">{{ recipientName }}</div>
                <div class="recipient-date">{{ currentDate }}</div>
              </div>
              <div class="envelope-pattern" :class="patternClass"></div>
            </div>
          </div>
          
          <!-- 信封背面 -->
          <div class="envelope-back"></div>
          
          <!-- 信封侧面 -->
          <div class="envelope-side-left"></div>
          <div class="envelope-side-right"></div>
          <div class="envelope-side-top"></div>
          <div class="envelope-side-bottom"></div>
        </div>
        
        <!-- 点击提示 -->
        <div class="click-hint">
          <div class="hint-text">点击拆封今日运势</div>
          <div class="hint-arrow">↓</div>
        </div>
      </div>
    </div>

    <!-- 信笺内容 -->
    <div v-else class="envelope-opened">
      <div class="letter-container">
        <!-- 信纸 -->
        <div class="letter-paper" :class="letterStyle">
          <div class="letter-header">
            <div class="letter-date">{{ currentDate }}</div>
            <div class="letter-greeting">亲爱的 {{ recipientName }}：</div>
          </div>
          
          <div class="letter-content">
            <slot name="content">
              <!-- 默认内容 -->
              <div class="default-content">
                <p>今日运势正在生成中...</p>
              </div>
            </slot>
          </div>
          
          <div class="letter-footer">
            <div class="letter-signature">天玄运势师</div>
            <div class="letter-stamp">{{ stampText }}</div>
          </div>
        </div>
        
        <!-- 重新封装按钮 -->
        <div class="reset-button" @click="resetEnvelope">
          <span>重新封装</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  recipientName?: string
  envelopeColor?: 'purple' | 'blue' | 'pink' | 'green' | 'gold'
  sealSymbol?: string
  stampText?: string
  pattern?: 'stars' | 'flowers' | 'geometric' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  recipientName: '亲爱的朋友',
  envelopeColor: 'purple',
  sealSymbol: '✨',
  stampText: '天玄运势',
  pattern: 'stars'
})

const emit = defineEmits<{
  opened: []
  reset: []
}>()

const isOpened = ref(false)
const currentDate = ref('')

// 计算属性
const envelopeStyle = computed(() => `envelope-${props.envelopeColor}`)
const letterStyle = computed(() => `letter-${props.envelopeColor}`)
const patternClass = computed(() => `pattern-${props.pattern}`)

// 方法
const openEnvelope = () => {
  isOpened.value = true
  emit('opened')
}

const resetEnvelope = () => {
  isOpened.value = false
  emit('reset')
}

// 初始化
onMounted(() => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})
</script>

<style scoped>
.fortune-envelope-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  perspective: 1000px;
}

/* 信封关闭状态 */
.envelope-closed {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.envelope-closed:hover {
  transform: scale(1.05);
}

.envelope-wrapper {
  position: relative;
  width: 300px;
  height: 200px;
}

/* 信封主体 */
.envelope-body {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}

.envelope-front {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* 信封颜色变体 */
.envelope-purple .envelope-front {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.envelope-blue .envelope-front {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.envelope-pink .envelope-front {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.envelope-green .envelope-front {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.envelope-gold .envelope-front {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

/* 蜡封 */
.envelope-seal {
  position: absolute;
  top: 20px;
  right: 20px;
}

.wax-seal {
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #d63031, #e17055);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 2px solid #fff;
}

.seal-symbol {
  font-size: 18px;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 收件人信息 */
.recipient-info {
  text-align: center;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.recipient-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.recipient-date {
  font-size: 14px;
  opacity: 0.9;
}

/* 信封图案 */
.envelope-pattern {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 60px;
  height: 60px;
  opacity: 0.3;
}

.pattern-stars {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E");
  background-size: 20px 20px;
  background-repeat: repeat;
}

.pattern-flowers {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9ZM19 9H14V4H5V21H19V9Z'/%3E%3C/svg%3E");
  background-size: 20px 20px;
  background-repeat: repeat;
}

.pattern-geometric {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2L2 7L12 12L22 7L12 2Z'/%3E%3C/svg%3E");
  background-size: 20px 20px;
  background-repeat: repeat;
}

/* 点击提示 */
.click-hint {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: #fff;
  animation: bounce 2s infinite;
}

.hint-text {
  font-size: 14px;
  margin-bottom: 8px;
  opacity: 0.8;
}

.hint-arrow {
  font-size: 20px;
  opacity: 0.6;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* 信封打开状态 */
.envelope-opened {
  width: 100%;
  max-width: 600px;
}

.letter-container {
  position: relative;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: letterAppear 0.8s ease-out;
}

@keyframes letterAppear {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(50px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 信纸 */
.letter-paper {
  padding: 40px;
  min-height: 400px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
}

.letter-paper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(90deg, transparent 79px, #abced4 79px, #abced4 81px, transparent 81px),
    linear-gradient(#eee .1em, transparent .1em);
  background-size: 100% 1.2em;
  opacity: 0.3;
}

/* 信纸颜色变体 */
.letter-purple {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.letter-blue {
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
}

.letter-pink {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.letter-green {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.letter-gold {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

/* 信纸内容 */
.letter-header {
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.letter-date {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.letter-greeting {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.letter-content {
  position: relative;
  z-index: 1;
  line-height: 1.8;
  color: #333;
  margin-bottom: 30px;
}

.letter-footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 40px;
}

.letter-signature {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.letter-stamp {
  font-size: 12px;
  color: #666;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
}

/* 重新封装按钮 */
.reset-button {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-button:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .envelope-wrapper {
    width: 250px;
    height: 160px;
  }
  
  .letter-paper {
    padding: 20px;
    min-height: 300px;
  }
  
  .letter-content {
    font-size: 14px;
  }
}
</style> 