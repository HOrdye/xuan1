  <template>
    <div class="chart-display min-h-screen relative overflow-hidden">
    <!-- 动态星空背景 -->
    <div class="cosmic-background">
      <div class="stars-layer"></div>
      <div class="nebula-layer"></div>
      <div class="energy-particles"></div>
    </div>

    <div class="relative z-10 p-4 pb-20">
      <div v-if="!currentChart" class="no-chart">
        <n-empty description="还没有生成命盘">
          <template #extra>
            <n-button type="primary" @click="goToInput">去输入生辰</n-button>   
          </template>
        </n-empty>
      </div>

      <div v-else class="chart-content">
      <!-- 核心信息面板（一句话总结、核心标签、综合评分） -->
      <SummaryPanel 
        v-if="currentChart" 
        :chart-data="currentChart" 
      />

      <!-- 头部信息 -->
      <div class="chart-header">
        <div class="header-content">
          <h2 class="chart-title">✨ 你的紫微命盘</h2>
          <div class="birth-info">
            <div class="info-item">
              <span class="info-label">出生：</span>
              <span class="info-value">{{ birthInfoText }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">五行局：</span>
              <span class="info-value">{{ currentChart.wuxingJu }}</span>       
            </div>
          </div>
          
          <!-- 升级提示 -->
          <UpgradePrompt
            v-if="showUpgradePrompt && !canViewFlowYear"
            title="解锁流年运势预测"
            description="升级会员可查看流年流月流日对本命盘的影响，获得更精准的运势预测"
            :features="[
              '流年运势预测',
              '流月流日分析',
              '四化影响解读',
              '深度命盘分析'
            ]"
            required-tier="premium"
            @dismiss="showUpgradePrompt = false"
            class="mb-6"
          />

          <!-- 流年流月流日时间选择器 -->
          <div class="time-selector-section" :class="{ 'disabled-section': !canViewFlowYear }">
            <div class="section-title">
              <span class="icon">📅</span>
              <span>查看流年流月流日</span>
              <span v-if="!canViewFlowYear" class="premium-badge">会员专享</span>
            </div>
            <div class="time-selectors">
              <n-date-picker
                v-model:value="selectedDate"
                type="date"
                format="yyyy年MM月dd日"
                placeholder="选择日期"
                clearable
                @update:value="handleDateChange"
                class="date-picker"
              />
              <n-button
                type="primary"
                ghost
                @click="resetToToday"
                class="reset-btn"
              >
                重置为今天
              </n-button>
            </div>
            
            <!-- 流年流月流日信息显示 -->
            <div v-if="displayLiunianInfo" class="liunian-info">
              <div class="liunian-item">
                <span class="label">流年：</span>
                <span class="value">{{ displayLiunianInfo.year }}年 ({{ displayLiunianInfo.tiangan }}{{ displayLiunianInfo.dizhi }})</span>
              </div>
              <div v-if="displayLiumonthInfo" class="liunian-item">
                <span class="label">流月：</span>
                <span class="value">{{ displayLiumonthInfo.year }}年{{ displayLiumonthInfo.month }}月 ({{ displayLiumonthInfo.tiangan }}{{ displayLiumonthInfo.dizhi }})</span>
              </div>
              <div v-if="displayLiudayInfo" class="liunian-item">
                <span class="label">流日：</span>
                <span class="value">{{ displayLiudayInfo.year }}年{{ displayLiudayInfo.month }}月{{ displayLiudayInfo.day }}日 ({{ displayLiudayInfo.tiangan }}{{ displayLiudayInfo.dizhi }})</span>
              </div>
              
              <!-- 流年对本命盘的影响 -->
              <div v-if="displayLiunianInfo.impactOnPalaces && displayLiunianInfo.impactOnPalaces.length > 0" class="impact-section">                           
                <div class="impact-title">📊 流年对本命盘的影响</div>
                <div class="impact-list">
                  <div v-for="impact in displayLiunianInfo.impactOnPalaces.slice(0, 3)" :key="impact.palaceIndex" class="impact-item">                          
                    <div class="palace-name">{{ impact.palaceName }}</div>      
                      <div class="sihua-tags">
                        <span v-if="impact.sihuaImpact.lu" class="sihua-tag lu">
                          <TermTooltip term="化禄">禄</TermTooltip>: {{ impact.sihuaImpact.lu.join('、') }}
                        </span>
                        <span v-if="impact.sihuaImpact.quan" class="sihua-tag quan">
                          <TermTooltip term="化权">权</TermTooltip>: {{ impact.sihuaImpact.quan.join('、') }}
                        </span>
                        <span v-if="impact.sihuaImpact.ke" class="sihua-tag ke">
                          <TermTooltip term="化科">科</TermTooltip>: {{ impact.sihuaImpact.ke.join('、') }}
                        </span>
                        <span v-if="impact.sihuaImpact.ji" class="sihua-tag ji">
                          <TermTooltip term="化忌">忌</TermTooltip>: {{ impact.sihuaImpact.ji.join('、') }}
                        </span>
                      </div>
                  </div>
                </div>
              </div>

              <!-- 流月对本命盘的影响 -->
              <div v-if="displayLiumonthInfo && displayLiumonthInfo.impactOnPalaces && displayLiumonthInfo.impactOnPalaces.length > 0" class="impact-section">                           
                <div class="impact-title">🌙 流月对本命盘的影响</div>
                <div class="impact-list">
                  <div v-for="impact in displayLiumonthInfo.impactOnPalaces.slice(0, 3)" :key="impact.palaceIndex" class="impact-item">                          
                    <div class="palace-name">{{ impact.palaceName }}</div>      
                      <div class="sihua-tags">
                        <span v-if="impact.sihuaImpact.lu" class="sihua-tag lu">
                          <TermTooltip term="化禄">禄</TermTooltip>: {{ impact.sihuaImpact.lu.join('、') }}
                        </span>
                        <span v-if="impact.sihuaImpact.quan" class="sihua-tag quan">
                          <TermTooltip term="化权">权</TermTooltip>: {{ impact.sihuaImpact.quan.join('、') }}
                        </span>
                        <span v-if="impact.sihuaImpact.ke" class="sihua-tag ke">
                          <TermTooltip term="化科">科</TermTooltip>: {{ impact.sihuaImpact.ke.join('、') }}
                        </span>
                        <span v-if="impact.sihuaImpact.ji" class="sihua-tag ji">
                          <TermTooltip term="化忌">忌</TermTooltip>: {{ impact.sihuaImpact.ji.join('、') }}
                        </span>
                      </div>
                  </div>
                </div>
              </div>

              <!-- 流日对本命盘的影响 -->
              <div v-if="displayLiudayInfo && displayLiudayInfo.impactOnPalaces && displayLiudayInfo.impactOnPalaces.length > 0" class="impact-section">                           
                <div class="impact-title">☀️ 流日对本命盘的影响</div>
                <div class="impact-list">
                  <div v-for="impact in displayLiudayInfo.impactOnPalaces.slice(0, 3)" :key="impact.palaceIndex" class="impact-item">                          
                    <div class="palace-name">{{ impact.palaceName }}</div>      
                      <div class="sihua-tags">
                        <span v-if="impact.sihuaImpact.lu" class="sihua-tag lu">
                          <TermTooltip term="化禄">禄</TermTooltip>: {{ impact.sihuaImpact.lu.join('、') }}
                        </span>
                        <span v-if="impact.sihuaImpact.quan" class="sihua-tag quan">
                          <TermTooltip term="化权">权</TermTooltip>: {{ impact.sihuaImpact.quan.join('、') }}
                        </span>
                        <span v-if="impact.sihuaImpact.ke" class="sihua-tag ke">
                          <TermTooltip term="化科">科</TermTooltip>: {{ impact.sihuaImpact.ke.join('、') }}
                        </span>
                        <span v-if="impact.sihuaImpact.ji" class="sihua-tag ji">
                          <TermTooltip term="化忌">忌</TermTooltip>: {{ impact.sihuaImpact.ji.join('、') }}
                        </span>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="action-buttons">
          <n-button
            type="info"
            @click="viewEmptyPalace"
            class="action-btn"
          >
            <template #icon>
              <span>🌌</span>
            </template>
            查看空宫解读
          </n-button>
          <n-button
            type="primary"
            @click="goToTripleAnalysis"
            class="action-btn"
          >
            <template #icon>
              <span>🔮</span>
            </template>
            三维解读
          </n-button>
        </div>

        <!-- 视图切换 -->
        <div class="view-controls">
          <n-button-group>
            <n-button
              :type="viewMode === 'circular' ? 'primary' : 'default'"
              @click="viewMode = 'circular'"
            >
              <template #icon>
                <n-icon><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg></n-icon>                                                                
              </template>
              圆形星盘
            </n-button>
            <n-button
              :type="viewMode === 'list' ? 'primary' : 'default'"
              @click="viewMode = 'list'"
            >
              <template #icon>
                <n-icon><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18"/></svg></n-icon>                                                      
              </template>
              列表视图
            </n-button>
            <n-button
              :type="viewMode === 'explore' ? 'primary' : 'default'"
              @click="viewMode = 'explore'"
            >
              <template #icon>
                <span>🗺️</span>
              </template>
              探索模式
            </n-button>
            <n-button
              :type="viewMode === 'collection' ? 'primary' : 'default'"
              @click="viewMode = 'collection'"
            >
              <template #icon>
                <span>⭐</span>
              </template>
              星曜图鉴
            </n-button>
          </n-button-group>
        </div>
      </div>

      <!-- 圆形星盘视图 -->
      <Transition name="fade-slide" mode="out-in">
        <div v-if="viewMode === 'circular'" key="circular" class="circular-view">
          <ZiweiChart :chart="currentChart" :is-dark-mode="isDarkMode" />
        </div>
      </Transition>

      <!-- 探索模式 -->
      <Transition name="fade-slide" mode="out-in">
        <div v-if="viewMode === 'explore'" key="explore" class="explore-view">
          <PalaceUnlockExplorer
            :chart="currentChart"
            @complete="viewMode = 'circular'"
          />
        </div>
      </Transition>

      <!-- 星曜图鉴 -->
      <Transition name="fade-slide" mode="out-in">
        <div v-if="viewMode === 'collection'" key="collection" class="collection-view">
          <StarCollection />
        </div>
      </Transition>

      <!-- 列表视图 -->
      <Transition name="fade-slide" mode="out-in">
        <div v-if="viewMode === 'list'" key="list" class="list-view">
          <div class="palaces-grid">
          <div
            v-for="(palace, index) in currentChart.palaces"
            :key="index"
            class="palace-card"
            :class="{ 'ming-gong': index === 0, 'shen-gong': isShenGong(index) }"
          >
            <div class="palace-header">
              <h3>{{ palace.name }}</h3>
              <div class="badges">
                <span v-if="index === 0" class="ming-gong-badge">命宫</span>
                <span v-if="isShenGong(index)" class="shen-gong-badge">身宫</span>
              </div>
            </div>

            <div class="stars-list">
              <div
                v-for="star in palace.stars"
                :key="star.id"
                class="star-item"
                :class="star.category"
                :style="{ color: star.color }"
              >
                <span class="star-emoji">{{ star.emoji }}</span>
                <span class="star-name">{{ star.name }}</span>
                <span class="star-category">{{ star.category }}</span>
              </div>
              <div v-if="palace.stars.length === 0" class="empty-palace">
                空宫
              </div>
            </div>

            <div v-if="palace.sihua" class="sihua-info">
              <span v-if="palace.sihua.lu" class="sihua-tag lu">
                <TermTooltip term="化禄">化禄</TermTooltip>: {{ palace.sihua.lu }}
              </span>
              <span v-if="palace.sihua.quan" class="sihua-tag quan">
                <TermTooltip term="化权">化权</TermTooltip>: {{ palace.sihua.quan }}
              </span>
              <span v-if="palace.sihua.ke" class="sihua-tag ke">
                <TermTooltip term="化科">化科</TermTooltip>: {{ palace.sihua.ke }}
              </span>
              <span v-if="palace.sihua.ji" class="sihua-tag ji">
                <TermTooltip term="化忌">化忌</TermTooltip>: {{ palace.sihua.ji }}
              </span>
            </div>
          </div>
        </div>
        </div>
      </Transition>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useZiweiStore } from '../store/ziweiStore';
import type { ZiweiChart as ZiweiChartType } from '../types';
import { NEmpty, NButton, NButtonGroup, NIcon, NDatePicker } from 'naive-ui';
import ZiweiChart from '../components/ZiweiChart.vue';
import PalaceUnlockExplorer from '../components/PalaceUnlockExplorer.vue';
import StarCollection from '../components/StarCollection.vue';
import TermTooltip from '../components/TermTooltip.vue';
import SummaryPanel from '../components/SummaryPanel.vue';
import { calculateLiunianInfo, calculateLiumonthInfo, calculateLiudayInfo } from '../utils/liunianCalculator';
import type { LiunianInfo, LiumonthInfo, LiudayInfo } from '../utils/liunianCalculator';
import { trackCognitiveLadder } from '../utils/cognitiveLadderTracking';
import UpgradePrompt from '../../../components/membership/UpgradePrompt.vue';
import { useMembershipGuard } from '../../../composables/useMembershipGuard';

const router = useRouter();
const ziweiStore = useZiweiStore();

const currentChart = computed(() => ziweiStore.currentChart);

// 会员权限守卫
const { currentTier, checkPermission, canAccessAdvanced } = useMembershipGuard();
const showUpgradePrompt = ref(false);
const canViewFlowYear = computed(() => canAccessAdvanced.value);
const canViewAdvancedAnalysis = computed(() => canAccessAdvanced.value);

// 从 localStorage 恢复命盘
onMounted(() => {
  try {
    const savedChartStr = localStorage.getItem('ziwei_current_chart');
    if (savedChartStr && !ziweiStore.currentChart) {
      const savedChart = JSON.parse(savedChartStr) as ZiweiChartType;
      // 恢复日期对象
      if (savedChart.createdAt) {
        savedChart.createdAt = new Date(savedChart.createdAt);
      }
      ziweiStore.currentChart = savedChart;
      console.log('✅ 从 localStorage 恢复命盘');
    }
    
    // 认知阶梯埋点：查看命盘
    if (currentChart.value) {
      trackCognitiveLadder('chart_view', {
        chartId: currentChart.value.id,
        viewMode: viewMode.value
      });
    }

    // 检查是否需要显示升级提示
    if (currentTier.value === 'free' || currentTier.value === 'basic') {
      showUpgradePrompt.value = true;
    }
  } catch (error) {
    console.warn('⚠️ 恢复命盘失败:', error);
  }
});

const viewMode = ref<'circular' | 'list' | 'explore' | 'collection'>('circular');
const isDarkMode = ref(false);

// 时间选择器相关
const selectedDate = ref<number | null>(null);
const displayLiunianInfo = ref<LiunianInfo | null>(null);
const displayLiumonthInfo = ref<LiumonthInfo | null>(null);
const displayLiudayInfo = ref<LiudayInfo | null>(null);

// 初始化：显示当前时间的流年流月流日信息
onMounted(() => {
  if (currentChart.value) {
    const now = new Date();
    selectedDate.value = now.getTime();
    updateLiunianInfo(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }
});

// 更新流年流月流日信息（传入本命盘以计算关联）
const updateLiunianInfo = (year: number, month: number, day: number) => {
  try {
    // 传入本命盘，计算流年流月流日对本命盘的影响
    if (currentChart.value) {
      displayLiunianInfo.value = calculateLiunianInfo(year, currentChart.value);
      displayLiumonthInfo.value = calculateLiumonthInfo(year, month, currentChart.value);
      displayLiudayInfo.value = calculateLiudayInfo(year, month, day, currentChart.value);
    } else {
      displayLiunianInfo.value = calculateLiunianInfo(year);
      displayLiumonthInfo.value = calculateLiumonthInfo(year, month);
      displayLiudayInfo.value = calculateLiudayInfo(year, month, day);
    }
    console.log('✅ 流年流月流日信息已更新:', {
      liunian: displayLiunianInfo.value,
      liumonth: displayLiumonthInfo.value,
      liuday: displayLiudayInfo.value
    });
    
    // 打印对本命盘的影响
    if (displayLiunianInfo.value?.impactOnPalaces) {
      console.log('📊 流年对本命盘的影响:', displayLiunianInfo.value.impactOnPalaces);
    }
    if (displayLiumonthInfo.value?.impactOnPalaces) {
      console.log('📊 流月对本命盘的影响:', displayLiumonthInfo.value.impactOnPalaces);
    }
    if (displayLiudayInfo.value?.impactOnPalaces) {
      console.log('📊 流日对本命盘的影响:', displayLiudayInfo.value.impactOnPalaces);
    }
  } catch (error) {
    console.error('❌ 更新流年流月流日信息失败:', error);
  }
};

// 日期变化处理
const handleDateChange = (value: number | null) => {
  if (value === null) {
    // 如果清空，重置为今天
    resetToToday();
    return;
  }
  
  const date = new Date(value);
  updateLiunianInfo(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

// 重置为今天
const resetToToday = () => {
  const now = new Date();
  selectedDate.value = now.getTime();
  updateLiunianInfo(now.getFullYear(), now.getMonth() + 1, now.getDate());
};

// 监听命盘变化，自动保存到 localStorage 并更新流年信息
watch(
  () => ziweiStore.currentChart,
  (chart) => {
    if (chart) {
      try {
        localStorage.setItem('ziwei_current_chart', JSON.stringify(chart));     
        console.log('✅ 命盘已保存到 localStorage');
        
        // 认知阶梯埋点：查看命盘
        trackCognitiveLadder('chart_view', {
          chartId: chart.id,
          viewMode: viewMode.value
        });
        
        // 命盘变化时，更新流年信息（如果还没有选择日期，使用当前日期）
        if (!selectedDate.value) {
          const now = new Date();
          selectedDate.value = now.getTime();
          updateLiunianInfo(now.getFullYear(), now.getMonth() + 1, now.getDate());
        }
      } catch (error) {
        console.warn('⚠️ 保存命盘失败:', error);
      }
    } else {
      // 清除保存的命盘
      localStorage.removeItem('ziwei_current_chart');
      // 清空流年信息
      displayLiunianInfo.value = null;
      displayLiumonthInfo.value = null;
      displayLiudayInfo.value = null;
      selectedDate.value = null;
    }
  },
  { deep: true }
);


const birthInfoText = computed(() => {
  if (!currentChart.value) return '';
  const { year, month, day, hour, gender } = currentChart.value.birthInfo;
  const hourNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  return `${year}年${month}月${day}日 ${hourNames[hour]}时 ${gender === 'male' ? '男' : '女'}`;
});

const isShenGong = (index: number): boolean => {
  if (!currentChart.value?.shenGong) return false;
  const shenGongIndex = currentChart.value.palaces.findIndex(
    p => p.name === currentChart.value.shenGong.name
  );
  return shenGongIndex === index;
};

const goToInput = () => {
  router.push('/ziwei/input');
};

const viewEmptyPalace = () => {
  router.push('/ziwei/empty-palace');
};

const goToTripleAnalysis = () => {
  router.push('/ziwei/triple-analysis');
};

// 视图切换时重置动画
watch(viewMode, () => {
  // 视图切换时，可以触发重新动画
  // 这里主要依赖 Transition 组件处理
});
</script>

<style scoped>
.chart-display {
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
  pointer-events: none; /* 不阻止鼠标事件 */
}

.stars-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(2px 2px at 20% 30%, #fff, transparent),
    radial-gradient(2px 2px at 60% 70%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 50% 50%, #fff, transparent),
    radial-gradient(1px 1px at 80% 10%, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 90% 60%, #fff, transparent),
    radial-gradient(1px 1px at 33% 80%, rgba(255,255,255,0.4), transparent);
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
  animation: nebulaFloat 15s ease-in-out infinite;
}

@keyframes nebulaFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -20px) scale(1.1); }
}

.energy-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 30% 40%, rgba(147, 51, 234, 0.1) 0%, transparent 30%),
    radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 30%);
  animation: particlesPulse 8s ease-in-out infinite;
}

@keyframes particlesPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.no-chart {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  max-width: 600px;
  margin: 4rem auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.chart-content {
  max-width: 1400px;
  margin: 0 auto;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.header-content {
  flex: 1;
}

/* 时间选择器区域 */
.time-selector-section {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(139, 92, 246, 0.9);
}

.section-title .icon {
  font-size: 1.2rem;
}

.time-selectors {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
}

.date-picker {
  flex: 1;
  max-width: 250px;
}

.reset-btn {
  white-space: nowrap;
}

/* 流年流月流日信息显示 */
.liunian-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(59, 130, 246, 0.08);
  border-radius: 8px;
  border-left: 3px solid rgba(59, 130, 246, 0.5);
}

.liunian-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.liunian-item .label {
  font-weight: 600;
  color: rgba(139, 92, 246, 0.9);
  min-width: 50px;
}

.liunian-item .value {
  color: #333;
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

/* 流年影响区域 */
.impact-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
}

.impact-title {
  font-weight: 600;
  color: rgba(139, 92, 246, 0.9);
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
}

.impact-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.impact-item {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  border-left: 2px solid rgba(59, 130, 246, 0.3);
}

.impact-item .palace-name {
  font-weight: 600;
  color: #333;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.sihua-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.sihua-tag {
  font-size: 0.75rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-weight: 500;
}

.sihua-tag.lu {
  background: rgba(34, 197, 94, 0.15);
  color: #16a34a;
}

.sihua-tag.quan {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
}

.sihua-tag.ke {
  background: rgba(59, 130, 246, 0.15);
  color: #2563eb;
}

.sihua-tag.ji {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
  font-weight: 600; /* 化忌最重要，加粗显示 */
}

.chart-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #9333EA 0%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.birth-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  gap: 0.5rem;
  color: #666;
}

.info-label {
  font-weight: 500;
}

.info-value {
  color: #333;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.action-btn {
  font-size: 1rem;
}

.view-controls {
  display: flex;
  align-items: center;
}

/* 圆形视图 */
.circular-view {
  width: 100%;
  display: flex;
  justify-content: center;
}

  /* 探索视图 */
  .explore-view {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  /* 星曜图鉴视图 */
  .collection-view {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  /* 列表视图 */
  .list-view {
    width: 100%;
  }

.palaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.palace-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.palace-card:hover {
  transform: translateY(-4px);
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 12px 24px rgba(139, 92, 246, 0.2);
}

.palace-card.ming-gong {
  border-color: #9333EA;
  background: rgba(147, 51, 234, 0.05);
  box-shadow: 0 8px 20px rgba(147, 51, 234, 0.2);
}

.palace-card.shen-gong {
  border-color: #3B82F6;
  background: rgba(59, 130, 246, 0.05);
}

.palace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(139, 92, 246, 0.1);
}

.palace-header h3 {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.badges {
  display: flex;
  gap: 0.5rem;
}

.ming-gong-badge,
.shen-gong-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: bold;
}

.ming-gong-badge {
  background: #9333EA;
  color: white;
}

.shen-gong-badge {
  background: #3B82F6;
  color: white;
}

.stars-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.star-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba(139, 92, 246, 0.05);
  transition: all 0.2s ease;
}

.star-item:hover {
  background: rgba(139, 92, 246, 0.1);
  transform: translateX(4px);
}

.star-item .star-emoji {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.star-item .star-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.star-item .star-category {
  font-size: 0.85rem;
  color: #666;
  padding: 0.2rem 0.5rem;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 6px;
}

.empty-palace {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-style: italic;
  font-size: 1rem;
}


@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.palace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.palace-header h3 {
  font-size: 1.2rem;
  margin: 0;
}

.badges {
  display: flex;
  gap: 0.3rem;
}

.ming-gong-badge {
  background: #9333EA;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.shen-gong-badge {
  background: #3B82F6;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.stars-list {
  min-height: 60px;
  margin-bottom: 0.5rem;
}

.star-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
  font-weight: 500;
}

.star-item.主星 {
  font-weight: 600;
}

.star-category {
  font-size: 0.7rem;
  color: #999;
  margin-left: auto;
}

.star-emoji {
  font-size: 1.2rem;
}

.empty-palace {
  color: #999;
  font-style: italic;
}

.sihua-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.5rem;
}

.sihua-tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
}

.sihua-tag.lu {
  color: #10B981;
}

.sihua-tag.quan {
  color: #F59E0B;
}

.sihua-tag.ke {
  color: #3B82F6;
}

.sihua-tag.ji {
  color: #EF4444;
}

.patterns-section {
  margin-top: 2rem;
}

.patterns-section h3 {
  margin-bottom: 1rem;
}

.patterns-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.pattern-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.pattern-card.excellent {
  border-color: #10B981;
}

.pattern-card.good {
  border-color: #3B82F6;
}

.pattern-card.normal {
  border-color: #F59E0B;
}

.pattern-score {
  margin-top: 0.5rem;
  font-weight: bold;
  color: #9333EA;
}


@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 视图切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* 列表视图动画 */
.palace-card {
  animation: slideInUp 0.5s ease-out backwards;
}

.palace-card:nth-child(1) { animation-delay: 0.1s; }
.palace-card:nth-child(2) { animation-delay: 0.15s; }
.palace-card:nth-child(3) { animation-delay: 0.2s; }
.palace-card:nth-child(4) { animation-delay: 0.25s; }
.palace-card:nth-child(5) { animation-delay: 0.3s; }
.palace-card:nth-child(6) { animation-delay: 0.35s; }
.palace-card:nth-child(7) { animation-delay: 0.4s; }
.palace-card:nth-child(8) { animation-delay: 0.45s; }
.palace-card:nth-child(9) { animation-delay: 0.5s; }
.palace-card:nth-child(10) { animation-delay: 0.55s; }
.palace-card:nth-child(11) { animation-delay: 0.6s; }
.palace-card:nth-child(12) { animation-delay: 0.65s; }

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
  @media (max-width: 768px) {
    .chart-header {
      flex-direction: column;
      gap: 1rem;
    }

    .action-buttons {
      width: 100%;
      justify-content: center;
    }

    .view-controls {
      width: 100%;
    }

}
</style>

