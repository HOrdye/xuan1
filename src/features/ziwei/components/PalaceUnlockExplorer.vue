<template>
  <div class="palace-unlock-explorer">
    <div class="explorer-header">
      <h2 class="explorer-title">探索你的十二宫</h2>
      <div class="inspiration-points">
        <span class="points-icon">✨</span>
        <span class="points-label">灵感点数：</span>
        <span class="points-value">{{ inspirationPoints }}</span>
      </div>
    </div>

    <!-- 宫位网格 -->
    <div class="palaces-grid">
      <div
        v-for="(palace, index) in palaces"
        :key="index"
        class="palace-cell"
        :class="{
          'unlocked': palace.unlocked,
          'locked': !palace.unlocked,
          'can-unlock': palace.canUnlock,
          'ming-gong': index === 0
        }"
        @click="unlockPalace(index)"
      >
        <!-- 锁定状态 -->
        <div v-if="!palace.unlocked" class="locked-state">
          <div class="lock-icon">🔒</div>
          <div class="lock-text">未解锁</div>
          <div v-if="palace.canUnlock" class="unlock-hint">点击解锁</div>
        </div>

        <!-- 解锁状态 -->
        <div v-else class="unlocked-state">
          <div class="palace-name">{{ palace.name }}</div>
          <div class="palace-stars">
            <span
              v-for="(star, starIndex) in palace.stars"
              :key="starIndex"
              class="star-badge"
              :style="{ color: star.color }"
            >
              {{ star.emoji }}
            </span>
            <span v-if="palace.stars.length === 0" class="empty-badge">空宫</span>
          </div>
          <div v-if="palace.isMingGong" class="ming-gong-badge">命宫</div>
        </div>
      </div>
    </div>

    <!-- 解锁提示 -->
    <Transition name="fade">
      <div v-if="showUnlockHint" class="unlock-hint-card">
        <div class="hint-icon">🎉</div>
        <div class="hint-text">
          <div class="hint-title">解锁成功！</div>
          <div class="hint-description">
            你解锁了 <strong>{{ lastUnlockedPalace }}</strong>，获得 +10 灵感点数
          </div>
        </div>
      </div>
    </Transition>

    <!-- 完成提示 -->
    <Transition name="fade">
      <div v-if="allUnlocked" class="completion-card">
        <div class="completion-icon">🌟</div>
        <div class="completion-text">
          <div class="completion-title">恭喜！</div>
          <div class="completion-description">你已经解锁了所有宫位！</div>
        </div>
        <n-button
          type="primary"
          size="large"
          @click="$emit('complete')"
          class="completion-button"
        >
          查看完整命盘
        </n-button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { NButton } from 'naive-ui';
import type { Palace, Star } from '../types';
import { PALACE_NAMES } from '../data/palaces';

// Props
interface Props {
  chart: {
    palaces: Palace[];
  };
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  complete: [];
}>();

// 宫位解锁状态
interface PalaceUnlockState {
  name: string;
  unlocked: boolean;
  canUnlock: boolean;
  stars: Star[];
  isMingGong: boolean;
}

const palaces = ref<PalaceUnlockState[]>([]);
const inspirationPoints = ref(0);
const showUnlockHint = ref(false);
const lastUnlockedPalace = ref('');
const allUnlocked = computed(() => palaces.value.every(p => p.unlocked));

// 初始化宫位状态
const initializePalaces = () => {
  palaces.value = props.chart.palaces.map((palace, index) => ({
    name: palace.name,
    unlocked: index === 0, // 只有命宫初始解锁
    canUnlock: index === 0 || index === 1 || index === 11, // 命宫、兄弟宫、父母宫可以解锁
    stars: palace.stars,
    isMingGong: index === 0
  }));
};

// 解锁宫位
const unlockPalace = (index: number) => {
  const palace = palaces.value[index];
  
  if (palace.unlocked) {
    return; // 已经解锁
  }

  if (!palace.canUnlock) {
    // 提示需要先解锁相邻宫位
    return;
  }

  // 解锁宫位
  palace.unlocked = true;
  lastUnlockedPalace.value = palace.name;
  
  // 获得灵感点数
  inspirationPoints.value += 10;
  
  // 显示提示
  showUnlockHint.value = true;
  setTimeout(() => {
    showUnlockHint.value = false;
  }, 2000);

  // 更新可解锁状态（解锁相邻宫位）
  updateUnlockablePalaces(index);

  // 检查是否全部解锁
  if (allUnlocked.value) {
    setTimeout(() => {
      // 可以触发完成事件或显示完成提示
    }, 500);
  }
};

// 更新可解锁的宫位
const updateUnlockablePalaces = (unlockedIndex: number) => {
  // 相邻宫位可以解锁（前一个和后一个）
  const prevIndex = (unlockedIndex - 1 + 12) % 12;
  const nextIndex = (unlockedIndex + 1) % 12;

  if (!palaces.value[prevIndex].unlocked) {
    palaces.value[prevIndex].canUnlock = true;
  }
  if (!palaces.value[nextIndex].unlocked) {
    palaces.value[nextIndex].canUnlock = true;
  }
};

onMounted(() => {
  initializePalaces();
});
</script>

<style scoped>
.palace-unlock-explorer {
  width: 100%;
  padding: 2rem;
}

.explorer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.explorer-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.inspiration-points {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(147, 51, 234, 0.1);
  border-radius: 20px;
}

.points-icon {
  font-size: 1.2rem;
}

.points-label {
  color: #666;
  font-size: 0.9rem;
}

.points-value {
  color: #9333EA;
  font-weight: bold;
  font-size: 1.1rem;
}

/* 宫位网格 */
.palaces-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.palace-cell {
  aspect-ratio: 1;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* 锁定状态 */
.palace-cell.locked {
  background: rgba(0, 0, 0, 0.05);
  border: 2px dashed rgba(0, 0, 0, 0.2);
}

.palace-cell.can-unlock {
  background: rgba(147, 51, 234, 0.05);
  border: 2px dashed rgba(147, 51, 234, 0.3);
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% {
    border-color: rgba(147, 51, 234, 0.3);
  }
  50% {
    border-color: rgba(147, 51, 234, 0.6);
  }
}

.palace-cell.can-unlock:hover {
  background: rgba(147, 51, 234, 0.1);
  transform: scale(1.05);
}

/* 解锁状态 */
.palace-cell.unlocked {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(147, 51, 234, 0.3);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.1);
}

.palace-cell.ming-gong {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  border: 2px solid rgba(147, 51, 234, 0.5);
}

.locked-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.lock-icon {
  font-size: 2rem;
  opacity: 0.5;
}

.lock-text {
  font-size: 0.9rem;
  color: #999;
}

.unlock-hint {
  font-size: 0.8rem;
  color: #9333EA;
  font-weight: 600;
}

.unlocked-state {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.palace-name {
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.palace-stars {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: center;
  align-items: center;
}

.star-badge {
  font-size: 1.2rem;
  display: inline-block;
}

.empty-badge {
  font-size: 0.75rem;
  color: #999;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.ming-gong-badge {
  font-size: 0.7rem;
  color: #9333EA;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  background: rgba(147, 51, 234, 0.1);
  border-radius: 12px;
  margin-top: 0.25rem;
}

/* 解锁提示 */
.unlock-hint-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(147, 51, 234, 0.3);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 300px;
}

.hint-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.hint-text {
  flex: 1;
}

.hint-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.hint-description {
  font-size: 1rem;
  color: #666;
}

/* 完成提示 */
.completion-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(147, 51, 234, 0.3);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  text-align: center;
  min-width: 400px;
}

.completion-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.completion-text {
  margin-bottom: 2rem;
}

.completion-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.completion-description {
  font-size: 1.1rem;
  color: #666;
}

.completion-button {
  min-width: 200px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .palaces-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }

  .explorer-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .unlock-hint-card,
  .completion-card {
    min-width: 90%;
    padding: 1.5rem;
  }
}
</style>

