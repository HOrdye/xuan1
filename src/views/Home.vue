<template>
  <!-- 魔法光标 -->
  <div class="cursor" id="cursor"></div>
  <div class="cursor-follower" id="cursorFollower"></div>



  <div class="min-h-screen text-white overflow-x-hidden relative">
    <div class="mystical-bg"></div>
    <div class="floating-particles" id="particles"></div>
    
    <!-- 完美太极图案 -->
    <div class="taiji-svg-container" id="taijiContainer">
      <svg class="taiji-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <!-- 外圆边框 -->
        <circle cx="100" cy="100" r="100" fill="none" stroke="#8b5cf6" stroke-width="2" opacity="0.8"/>
        
        <!-- 标准太极路径 -->
        <path d="M100,0 
                 A100,100 0 1,1 100,200 
                 A50,50 0 1,0 100,100 
                 A50,50 0 1,1 100,0 
                 Z" 
              fill="#000"/>
        <path d="M100,0 
                 A100,100 0 1,0 100,200 
                 A50,50 0 1,1 100,100 
                 A50,50 0 1,0 100,0 
                 Z" 
              fill="#fff"/>
        
        <!-- 鱼眼 -->
        <circle cx="100" cy="50" r="15" fill="#000"/>
        <circle cx="100" cy="150" r="15" fill="#fff"/>
        
        <!-- 增强发光效果 -->
        <circle cx="100" cy="100" r="100" fill="none" stroke="url(#taijiGlow)" stroke-width="3" opacity="0.6"/>
        
        <!-- 发光渐变定义 -->
        <defs>
          <radialGradient id="taijiGlow">
            <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0.8" />
            <stop offset="50%" style="stop-color:#ec4899;stop-opacity:0.4" />
            <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
    
    <!-- 星辰效果 -->
    <div class="constellation-container" id="starsContainer"></div>

    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">选择困难？让玄学来帮你</h1>
        <p class="hero-subtitle">
          不是迷信，是生活的调味剂<br>
          用有趣的方式，给选择加点"玄学buff"
        </p>
      </div>
    </section>

    <!-- 每日挑战 -->
    <div class="daily-challenge">
      <div class="challenge-title">🎯 今日挑战</div>
      <div class="challenge-content">{{ currentChallenge }}</div>
      <button class="challenge-action" @click="generateNewChallenge">换一个挑战</button>
    </div>

    <!-- 功能卡片 -->
    <section class="features-grid">
      <!-- To be or not to be -->
      <div class="feature-card" @click="navigateTo('/dilemma')">
        <div class="feature-icon">
          ⚖️
        </div>
        <h3 class="feature-title">To be or not to be</h3>
        <p class="feature-description">
          选择困难症终极解决方案<br>
          输入你的困惑，让玄学给你点灵感
        </p>
        <div class="interaction-hint">点我试试</div>
      </div>

      <!-- 今日运势 -->
      <div class="feature-card" @click="navigateTo('/fortune')">
        <div class="feature-icon">
          ⭐
        </div>
        <h3 class="feature-title">今天我左眼皮在跳</h3>
        <p class="feature-description">
          每日专属运势签<br>
          不是"今天宜出门"，而是"今天宜尝试燕麦拿铁"
        </p>
        <div class="interaction-hint">解锁今日签</div>
      </div>

      <!-- 掐指一算 -->
      <div class="feature-card" @click="navigateTo('/dilemma/divination')">
        <div class="feature-icon">
          ☯️
        </div>
        <h3 class="feature-title">待我掐指一算</h3>
        <p class="feature-description">
          三种传统占卜方式<br>
          铜钱、梅花、随机起卦，仪式感满满
        </p>
        <div class="interaction-hint">开始占卜</div>
      </div>

      <!-- 笅杯占卜 -->
      <div class="feature-card" @click="navigateTo('/dilemma/divination?method=jiaobei')">
        <div class="feature-icon">
          🎲
        </div>
        <h3 class="feature-title">我跟关圣帝君请示过</h3>
        <p class="feature-description">
          传统笅杯仪式<br>
          正反面决定吉凶，简单直接不纠结
        </p>
        <div class="interaction-hint">掷杯问卜</div>
      </div>

      <!-- 塔罗牌阵 -->
      <div class="feature-card" @click="navigateTo('/tarot')">
        <div class="feature-icon">
          ✨
        </div>
        <h3 class="feature-title">塔罗牌阵</h3>
        <p class="feature-description">
          78张塔罗牌的故事<br>
          每张牌都有独特的解读，像读故事一样有趣
        </p>
        <div class="interaction-hint premium">解锁故事</div>
      </div>

      <!-- 六十四卦 -->
      <div class="feature-card" @click="navigateTo('/hexagrams')">
        <div class="feature-icon">
          📚
        </div>
        <h3 class="feature-title">六十四卦图鉴</h3>
        <p class="feature-description">
          古老智慧的现代解读<br>
          每个卦象都有详细的故事和启示
        </p>
        <div class="interaction-hint">探索卦象</div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import anime from 'animejs/lib/anime.es.js';

const router = useRouter();
const currentChallenge = ref('尝试用左手完成一件小事，可能会有意外惊喜！');

const challenges = [
  "今天尝试用左手刷牙，可能会有新发现",
  "给陌生人一个微笑，收获一天好心情",
  "听一首没听过的歌，发现新宝藏",
  "今天穿一件平时不会穿的颜色",
  "给三年没联系的朋友发个消息",
  "尝试一家新的咖啡店",
  "今天不说随便，自己做决定",
  "今天走路时故意绕远路，看看新风景"
];

const generateNewChallenge = () => {
  const challenge = challenges[Math.floor(Math.random() * challenges.length)];
  currentChallenge.value = challenge;
  
  // 添加动画效果
  const challengeEl = document.querySelector<HTMLElement>('.daily-challenge');
  if (challengeEl) {
    challengeEl.style.transform = 'scale(0.95)';
    setTimeout(() => {
      challengeEl.style.transform = 'scale(1)';
    }, 200);
  }
};

const navigateTo = (path: string) => {
  router.push(path);
};

// 创建粒子效果
const createParticles = () => {
  const container = document.getElementById('particles');
  if (!container) return;
  
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    container.appendChild(particle);
  }
};

// 创建星辰效果
const createBrightStars = () => {
  const container = document.getElementById('starsContainer');
  if (!container) {
    console.warn('Stars container not found');
    return;
  }
  
  console.log('Creating bright stars...');
  
  // 清空容器
  container.innerHTML = '';
  
  const starCount = 120;
  
  // 主要星座位置
  const constellationStars = [
    {x: 15, y: 20, size: 'large'}, {x: 18, y: 25, size: 'medium'}, {x: 22, y: 22, size: 'large'},
    {x: 75, y: 15, size: 'extra'}, {x: 78, y: 18, size: 'medium'}, {x: 82, y: 15, size: 'large'},
    {x: 25, y: 75, size: 'medium'}, {x: 28, y: 78, size: 'small'}, {x: 30, y: 72, size: 'medium'},
    {x: 70, y: 80, size: 'large'}, {x: 73, y: 83, size: 'medium'}, {x: 75, y: 78, size: 'small'}
  ];
  
  // 添加主要星座
  constellationStars.forEach((star, index) => {
    const starEl = document.createElement('div');
    starEl.className = `star-bright ${star.size}`;
    starEl.style.left = star.x + '%';
    starEl.style.top = star.y + '%';
    starEl.style.animationDelay = (index * 0.3) + 's';
    container.appendChild(starEl);
  });
  
  console.log(`Created ${constellationStars.length} constellation stars`);
  
  // 添加随机背景星
  for (let i = 0; i < starCount - constellationStars.length; i++) {
    const star = document.createElement('div');
    const sizes = ['small', 'medium', 'large'];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    
    star.className = `star-bright ${size}`;
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.animationDuration = (2 + Math.random() * 2) + 's';
    
    container.appendChild(star);
  }
  
  console.log(`Created ${starCount} total stars`);
  
  // 验证星辰元素是否正确创建
  const createdStars = container.querySelectorAll('.star-bright');
  console.log(`Verified ${createdStars.length} stars in DOM`);
  
  // 添加星座连线
  const lines = [
    {x1: 15, y1: 20, x2: 18, y2: 25},
    {x1: 18, y1: 25, x2: 22, y2: 22},
    {x1: 75, y1: 15, x2: 78, y2: 18},
    {x1: 78, y1: 18, x2: 82, y2: 15}
  ];
  
  lines.forEach(line => {
    const lineEl = document.createElement('div');
    lineEl.className = 'constellation-line';
    
    const length = Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2));
    const angle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1) * 180 / Math.PI;
    
    lineEl.style.left = line.x1 + '%';
    lineEl.style.top = line.y1 + '%';
    lineEl.style.width = length + '%';
    lineEl.style.transform = `rotate(${angle}deg)`;
    lineEl.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(lineEl);
  });
};

// 太极和星辰交替隐现
const startBackgroundAnimation = () => {
  const taijiContainer = document.getElementById('taijiContainer');
  const starsContainer = document.getElementById('starsContainer');
  
  if (!taijiContainer || !starsContainer) {
    console.warn('Background containers not found');
    return;
  }
  
  // 确保容器存在且正确
  console.log('Background containers found:', { taijiContainer, starsContainer });
  
  // 初始状态 - 显示太极
  taijiContainer.classList.add('active');
  console.log('Initial state: Taiji active');
  
  // 每8秒切换一次
  setInterval(() => {
    if (taijiContainer.classList.contains('active')) {
      taijiContainer.classList.remove('active');
      starsContainer.classList.add('active');
      console.log('Switched to Stars, container classes:', starsContainer.className);
    } else {
      taijiContainer.classList.add('active');
      starsContainer.classList.remove('active');
      console.log('Switched to Taiji, container classes:', taijiContainer.className);
    }
  }, 8000);
};

// 魔法光标逻辑
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;
let cursor: HTMLElement | null = null;
let cursorFollower: HTMLElement | null = null;
let animationFrameId: number | null = null;

const updateCursor = () => {
  if (cursor) cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  if (cursorFollower) {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
  }
  animationFrameId = requestAnimationFrame(updateCursor);
};

const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

onMounted(() => {
  console.log('Home.vue mounted, initializing...');
  
  cursor = document.getElementById('cursor');
  cursorFollower = document.getElementById('cursorFollower');
  
  // 启动光标动画
  animationFrameId = requestAnimationFrame(updateCursor);
  document.addEventListener('mousemove', handleMouseMove);
  
  // 初始化背景效果 - 确保顺序正确
  createParticles();
  createBrightStars();
  
  // 延迟启动背景动画，确保DOM完全渲染
  setTimeout(() => {
    startBackgroundAnimation();
    
    // 确保星辰能够显示
    setTimeout(() => {
      const starsContainer = document.getElementById('starsContainer');
      if (starsContainer) {
        console.log('Ensuring stars are visible...');
        starsContainer.classList.add('active');
      }
    }, 1000);
  }, 100);
  
  // 卡片悬停效果
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      anime({
        targets: card,
        scale: 1.05,
        duration: 300,
        easing: 'easeOutQuad'
      });
    });
    
    card.addEventListener('mouseleave', () => {
      anime({
        targets: card,
        scale: 1,
        duration: 300,
        easing: 'easeOutQuad'
      });
    });
  });
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  document.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style>
/* 使用全局CSS变量，避免重复定义 */
:root {
  --primary-purple: #8b5cf6;
  --primary-pink: #ec4899;
  --primary-gold: #f59e0b;
  --bg-dark: #0f0f23;
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --bg-card: rgba(255, 255, 255, 0.05);
  --gradient-primary: linear-gradient(135deg, var(--primary-purple), var(--primary-pink));
  --gradient-gold: linear-gradient(135deg, var(--primary-gold), #fbbf24);
  --accent-glow: var(--primary-purple);
}

/* 魔法光标 */
.cursor {
  width: 20px;
  height: 20px;
  border: 2px solid var(--primary-purple);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 99999; /* 提高 z-index */
  transition: transform 0.1s ease;
  box-shadow: 0 0 20px var(--accent-glow);
}

.cursor-follower {
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 9998;
  transition: transform 0.3s ease;
}

/* 背景魔法效果 */
.mystical-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
    linear-gradient(135deg, var(--bg-dark) 0%, #1a1a2e 100%);
  z-index: -1; /* 作为基础背景层 */
  pointer-events: none; /* 不阻止交互 */
}

/* 完美太极图案 */
.taiji-svg-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  opacity: 0;
  z-index: 10;
  transition: opacity 2s ease-in-out;
  filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.3));
  pointer-events: none; /* 不阻止交互 */
}

.taiji-svg-container.active {
  opacity: 0.4;
}

.taiji-svg {
  width: 100%;
  height: 100%;
  animation: taijiRotate 40s linear infinite;
}

@keyframes taijiRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 星辰效果 */
.constellation-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5; /* 确保星辰在渐变背景之上，太极之下 */
  overflow: hidden;
  opacity: 0;
  transition: opacity 2s ease-in-out;
  pointer-events: none; /* 不阻止交互 */
}

.constellation-container.active {
  opacity: 1 !important;
}

.star-bright {
  position: absolute;
  background: radial-gradient(circle, #ffffff 0%, rgba(255, 255, 255, 0.8) 40%, transparent 70%);
  border-radius: 50%;
  animation: starTwinkle 3s ease-in-out infinite;
  z-index: 6;
}

.star-bright.small {
  width: 4px;
  height: 4px;
  box-shadow: 0 0 10px #ffffff, 0 0 20px #ffffff;
}

.star-bright.medium {
  width: 6px;
  height: 6px;
  box-shadow: 0 0 15px #ffffff, 0 0 30px #ffffff;
}

.star-bright.large {
  width: 8px;
  height: 8px;
  box-shadow: 0 0 20px #ffffff, 0 0 40px #ffffff;
}

.star-bright.extra {
  width: 10px;
  height: 10px;
  box-shadow: 0 0 20px #ffffff, 0 0 45px #ffffff;
  background: radial-gradient(circle, #fffacd 0%, #ffffff 50%, transparent 80%);
}

@keyframes starTwinkle {
  0%, 100% { 
    opacity: 0.3; 
    transform: scale(0.8);
  }
  50% { 
    opacity: 1; 
    transform: scale(1.2);
  }
}

.constellation-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  height: 1px;
  transform-origin: left center;
  opacity: 0.5;
  animation: lineGlow 4s ease-in-out infinite;
}

@keyframes lineGlow {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.7; }
}

/* 浮动粒子 */
.floating-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: var(--primary-purple);
  border-radius: 50%;
  opacity: 0.5;
  animation: float 25s infinite linear;
}

@keyframes float {
  from {
    transform: translateY(100vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.5;
  }
  90% {
    opacity: 0.5;
  }
  to {
    transform: translateY(-100vh) translateX(50px) rotate(360deg);
    opacity: 0;
  }
}

/* 英雄区域 */
.hero-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem;
  z-index: 20;
  pointer-events: auto;
}

.hero-content {
  text-align: center;
  max-width: 600px;
  animation: fadeInUp 1s ease-out;
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

.hero-title {
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 800;
  margin-bottom: 1rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: glow 3s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 0 0 20px var(--accent-glow);
  }
  to {
    text-shadow: 0 0 30px var(--accent-glow), 0 0 40px var(--accent-glow);
  }
}

.hero-subtitle {
  font-size: 1.3rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.8;
}

/* 每日挑战 */
.daily-challenge {
  background: var(--gradient-gold);
  color: var(--bg-dark);
  padding: 2rem;
  border-radius: 20px;
  margin: 2rem auto;
  max-width: 600px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease;
  z-index: 20;
  pointer-events: auto;
}

.daily-challenge::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.challenge-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.challenge-content {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.challenge-action {
  background: rgba(0, 0, 0, 0.2);
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  color: var(--bg-dark);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.challenge-action:hover {
  background: rgba(0, 0, 0, 0.3);
  transform: scale(1.05);
}

/* 功能卡片网格 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 2rem;
  position: relative;
  z-index: 20;
  pointer-events: auto;
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
  border-color: var(--primary-purple);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  background: var(--gradient-primary);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: rotate(360deg) scale(1.1);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
}

.feature-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
  z-index: 1;
}

.features-grid .feature-description {
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.interaction-hint {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--gradient-gold);
  color: var(--bg-dark);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
}

.interaction-hint.premium {
  background: var(--gradient-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }

  .taiji-svg-container {
    width: 100px;
    height: 100px;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
