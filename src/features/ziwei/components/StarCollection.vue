<template>
  <div class="star-collection">
    <div class="collection-header">
      <h2 class="collection-title">十四主星图鉴</h2>
      <p class="collection-subtitle">了解每颗主星的特质和现代职业对应</p>
    </div>

    <!-- 主星卡片网格 -->
    <div class="stars-grid">
      <div
        v-for="star in mainStars"
        :key="star.id"
        class="star-card"
        :class="{ 'collected': isStarCollected(star.id) }"
        @click="showStarDetail(star)"
      >
        <!-- 卡片头部 -->
        <div class="card-header">
          <div class="star-avatar" :style="{ background: star.color + '20' }">
            <span class="star-emoji-large">{{ star.emoji }}</span>
          </div>
          <div v-if="isStarCollected(star.id)" class="collected-badge">✓</div>
        </div>

        <!-- 卡片内容 -->
        <div class="card-content">
          <h3 class="star-name">{{ star.name }}</h3>
          <div class="star-category">{{ star.category }}</div>

          <!-- 性格标签 -->
          <div class="personality-tags">
            <span
              v-for="(tag, index) in getPersonalityTags(star.name)"
              :key="index"
              class="personality-tag"
            >
              {{ tag }}
            </span>
          </div>

          <!-- 现代职业 -->
          <div class="career-section">
            <div class="career-label">适合职业：</div>
            <div class="career-list">
              <span
                v-for="(career, index) in getCareerMatches(star.name)"
                :key="index"
                class="career-item"
              >
                {{ career }}
              </span>
            </div>
          </div>

          <!-- 简要描述 -->
          <p class="star-description">
            {{ star.description || getStarDescription(star.name) }}
          </p>
        </div>

        <!-- 卡片底部 -->
        <div class="card-footer">
          <div class="click-hint">点击查看详情 →</div>
        </div>
      </div>
    </div>

    <!-- 收集进度 -->
    <div class="collection-progress">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${collectionProgress}%` }"
        ></div>
      </div>
      <div class="progress-text">
        已收集 {{ collectedCount }} / {{ mainStars.length }} 颗主星
      </div>
    </div>

    <!-- 星曜详情弹窗 -->
    <StarDetailModal
      v-if="selectedStar"
      :star="selectedStar"
      :show="showStarModal"
      @update:show="showStarModal = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useZiweiStore } from '../store/ziweiStore';
import { MAIN_STARS } from '../data/stars';
import { StarDetailModal } from '../components';
import type { Star } from '../types';

const ziweiStore = useZiweiStore();

// 主星列表
const mainStars = MAIN_STARS;

// 选中的星曜
const selectedStar = ref<Star | null>(null);
const showStarModal = ref(false);

// 已收集的星曜（从命盘中获取）
const collectedStars = computed(() => {
  const chart = ziweiStore.currentChart;
  if (!chart) return [];
  
  const collected: string[] = [];
  chart.palaces.forEach(palace => {
    palace.stars.forEach(star => {
      if (star.category === '主星' && !collected.includes(star.id)) {
        collected.push(star.id);
      }
    });
  });
  return collected;
});

// 检查星曜是否已收集
const isStarCollected = (starId: string): boolean => {
  return collectedStars.value.includes(starId);
};

// 收集进度
const collectedCount = computed(() => collectedStars.value.length);
const collectionProgress = computed(() => {
  return Math.round((collectedCount.value / mainStars.length) * 100);
});

// 显示星曜详情
const showStarDetail = (star: Star) => {
  selectedStar.value = star;
  showStarModal.value = true;
};

// 获取性格标签
const getPersonalityTags = (starName: string): string[] => {
  const tagsMap: Record<string, string[]> = {
    '紫微': ['领导力', '权威', '自信', '果断'],
    '天机': ['智慧', '灵活', '善变', '机敏'],
    '太阳': ['热情', '开朗', '积极', '光明'],
    '武曲': ['刚强', '果断', '执行力', '财富'],
    '天同': ['温和', '善良', '享受', '随和'],
    '廉贞': ['刚烈', '正直', '执着', '情感'],
    '天府': ['稳重', '保守', '财富', '包容'],
    '太阴': ['温柔', '细腻', '内敛', '情感'],
    '贪狼': ['多才', '欲望', '交际', '灵活'],
    '巨门': ['口才', '思考', '暗星', '沟通'],
    '天相': ['辅助', '协调', '稳重', '服务'],
    '天梁': ['智慧', '稳重', '长辈', '保护'],
    '七杀': ['刚强', '果断', '冒险', '突破'],
    '破军': ['变动', '破坏', '创新', '突破']
  };
  return tagsMap[starName] || ['神秘', '独特'];
};

// 获取现代职业对应
const getCareerMatches = (starName: string): string[] => {
  const careerMap: Record<string, string[]> = {
    '紫微': ['CEO', '企业家', '政府官员', '管理者'],
    '天机': ['策划师', '咨询顾问', '分析师', '研究员'],
    '太阳': ['销售', '公关', '教师', '主持人'],
    '武曲': ['金融', '投资', '工程', '军警'],
    '天同': ['服务', '餐饮', '娱乐', '艺术'],
    '廉贞': ['律师', '法官', '纪检', '审计'],
    '天府': ['财务', '会计', '房地产', '投资'],
    '太阴': ['设计', '艺术', '教育', '医疗'],
    '贪狼': ['营销', '媒体', '娱乐', '创业'],
    '巨门': ['律师', '记者', '教师', '咨询'],
    '天相': ['助理', '秘书', '协调', '服务'],
    '天梁': ['教师', '医生', '顾问', '导师'],
    '七杀': ['创业', '投资', '军警', '体育'],
    '破军': ['创新', '变革', '创业', '技术']
  };
  return careerMap[starName] || ['自由职业'];
};

// 获取星曜描述
const getStarDescription = (starName: string): string => {
  const descMap: Record<string, string> = {
    '紫微': '帝王之星，具有领导力和权威性，适合担任管理职位。',
    '天机': '智慧之星，思维敏捷，善于分析和策划。',
    '太阳': '光明之星，热情开朗，适合与人打交道的工作。',
    '武曲': '财富之星，执行力强，适合金融和工程领域。',
    '天同': '福星，温和善良，享受生活，适合服务行业。',
    '廉贞': '刚烈之星，正直执着，适合法律和纪检工作。',
    '天府': '财库之星，稳重保守，善于理财和投资。',
    '太阴': '月亮之星，温柔细腻，适合艺术和设计工作。',
    '贪狼': '欲望之星，多才多艺，善于交际和营销。',
    '巨门': '暗星，口才出众，适合沟通和教育工作。',
    '天相': '辅助之星，协调能力强，适合服务和支持工作。',
    '天梁': '智慧之星，稳重可靠，适合教育和咨询工作。',
    '七杀': '将星，刚强果断，适合创业和挑战性工作。',
    '破军': '变动之星，勇于创新，适合技术和变革领域。'
  };
  return descMap[starName] || '神秘的主星，具有独特的特质。';
};
</script>

<style scoped>
.star-collection {
  width: 100%;
  padding: 2rem;
}

.collection-header {
  text-align: center;
  margin-bottom: 3rem;
}

.collection-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.collection-subtitle {
  font-size: 1.1rem;
  color: #666;
}

/* 主星卡片网格 */
.stars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.star-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(139, 92, 246, 0.2);
  border-radius: 20px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.star-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.star-card:hover::before {
  opacity: 1;
}

.star-card:hover {
  transform: translateY(-8px);
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
}

.star-card.collected {
  border-color: rgba(147, 51, 234, 0.5);
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.star-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(147, 51, 234, 0.2);
}

.star-emoji-large {
  font-size: 3rem;
}

.collected-badge {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #9333EA;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.2rem;
}

.card-content {
  flex: 1;
}

.star-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.25rem;
}

.star-category {
  font-size: 0.9rem;
  color: #999;
  margin-bottom: 1rem;
}

/* 性格标签 */
.personality-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.personality-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(147, 51, 234, 0.1);
  color: #9333EA;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* 职业部分 */
.career-section {
  margin-bottom: 1rem;
}

.career-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.career-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.career-item {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
  border-radius: 12px;
  font-size: 0.85rem;
}

.star-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.card-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 1rem;
}

.click-hint {
  font-size: 0.85rem;
  color: #9333EA;
  text-align: center;
  font-weight: 600;
}

/* 收集进度 */
.collection-progress {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #9333EA 0%, #3B82F6 100%);
  transition: width 0.3s ease;
  border-radius: 6px;
}

.progress-text {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stars-grid {
    grid-template-columns: 1fr;
  }

  .collection-title {
    font-size: 1.5rem;
  }
}
</style>

