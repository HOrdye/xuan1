<template>
  <div class="tarot-page" :class="{ 'is-revealing-animation': isRevealing }">
    <!-- Background effects -->
    <div class="stars-background">
      <div class="stars" v-for="n in 50" :key="n" 
           :style="{ 
             left: Math.random() * 100 + '%', 
             top: Math.random() * 100 + '%',
             animationDelay: Math.random() * 3 + 's'
           }">⭐</div>
    </div>

    <div class="container mx-auto px-4 py-8 relative z-10">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-white mb-4 mystical-glow">🔮 塔罗占卜 🔮</h1>
        <p class="text-xl text-purple-200">探索命运的神秘面纱，聆听心灵的智慧之声</p>
      </div>

      <!-- Stage 1: Intro & Question Input -->
      <div v-if="currentStage === 'intro'" class="max-w-4xl mx-auto">
        <div class="bg-black/30 backdrop-blur-md rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
          <div class="text-center mb-8">
            <div class="text-6xl mb-6 animate-pulse">🌟</div>
            <h2 class="text-3xl font-bold text-white mb-4">欢迎来到神秘的塔罗世界</h2>
            <p class="text-lg text-purple-200 mb-6 leading-relaxed">
              塔罗牌是古老的智慧结晶，能够帮助您探索内心深处的答案。<br>
              在开始占卜之前，请静下心来，专注于您想要了解的问题。
            </p>
          </div>

          <div class="mb-8">
            <div class="mb-6">
              <div class="text-center mb-4">
                <h3 class="text-lg font-medium text-purple-200 mb-2">💫 高频问题弹幕</h3>
                <p class="text-sm text-purple-300">点击飘过的问题可快速填充</p>
              </div>
              <div 
                ref="barrageArea"
                class="barrage-area relative w-full h-32 overflow-hidden bg-white/5 rounded-xl border border-purple-400/30 shadow-inner"
              ></div>
            </div>
            
            <label class="block text-white text-lg font-medium mb-4">
              💭 请输入您想要咨询的问题（可选）
            </label>
            <textarea 
              ref="questionInput"
              v-model="userQuestion"
              placeholder="例如：我的事业发展如何？我的感情运势怎样？我应该如何面对当前的困境？"
              class="w-full h-32 px-4 py-3 bg-white/10 border border-purple-400/50 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
            ></textarea>
          </div>

          <div class="mt-6 mb-8 p-6 bg-black/20 rounded-2xl border border-purple-400/30">
            <h4 class="font-semibold text-purple-200 mb-4 flex items-center justify-center text-lg">
              <span class="text-xl mr-2">📜</span>
              占卜须知
            </h4>
            <ul class="space-y-3 text-purple-300 max-w-md mx-auto">
              <li class="flex items-start">
                <span class="text-amber-400 mr-3 mt-1">✨</span>
                <div class="text-left">
                  <strong class="font-semibold text-white">诚心正念</strong><br>
                  <span class="text-sm opacity-90">请静心专注，心诚则灵。</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-amber-400 mr-3 mt-1">☝️</span>
                <div class="text-left">
                  <strong class="font-semibold text-white">一事一问</strong><br>
                  <span class="text-sm opacity-90">短时间内请勿为同一问题重复占卜。</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-amber-400 mr-3 mt-1">🙏</span>
                <div class="text-left">
                  <strong class="font-semibold text-white">尊重指引</strong><br>
                  <span class="text-sm opacity-90">无论结果好坏，请尊重塔罗的指引。命运并非游戏。</span>
                </div>
              </li>
            </ul>
          </div>

          <div class="text-center">
            <button 
              @click="goToSpreadSelection" 
              class="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mystical-glow"
            >
              🎴 选择牌阵
            </button>
          </div>
        </div>
      </div>

      <!-- Stage 1.5: Spread Selection -->
      <div v-if="currentStage === 'spreadSelection'" class="max-w-6xl mx-auto">
        <div class="bg-black/30 backdrop-blur-md rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
          <div class="text-center mb-12">
            <div class="text-5xl mb-6 animate-pulse">🔮</div>
            <h2 class="text-3xl font-bold text-white mb-4">选择您的专属牌阵</h2>
            <p class="text-lg text-purple-200 mb-8">每个牌阵都有其独特的智慧与启示，请根据您的问题选择最适合的牌阵</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div 
              v-for="(spread) in classicSpreads" 
              :key="spread.name"
              class="spread-card cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              :class="{ 'selected': selectedSpread?.name === spread.name }"
              @click="selectSpread(spread)"
            >
              <div class="bg-gradient-to-br from-purple-800/50 to-indigo-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl h-full flex flex-col">
                <div class="text-center mb-4">
                  <div class="text-4xl mb-3">{{ getSpreadIcon(spread.name) }}</div>
                  <h3 class="text-xl font-bold text-white mb-2">{{ spread.chineseName }}</h3>
                  <div class="text-sm text-purple-300 mb-4">{{ spread.positions.length }}张牌</div>
                </div>
                <div class="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl p-4 mb-4 border border-yellow-400/40">
                  <div class="text-center">
                    <div class="text-yellow-200 text-sm font-bold mb-2 flex items-center justify-center">
                      <span class="mr-2">⭐</span>
                      <span>最擅长解决</span>
                    </div>
                    <div class="text-yellow-100 text-base font-semibold">{{ spread.bestFor[0] }}</div>
                  </div>
                </div>
                <p class="text-xs text-purple-400 text-white opacity-80 leading-relaxed break-words mt-auto pt-3 border-t border-purple-500/20">
                  {{ spread.description }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-center space-x-6 mt-12">
            <button @click="goBackToIntro" class="bg-gray-600 hover:bg-gray-700 text-white text-lg font-medium py-3 px-8 rounded-full transition-colors duration-300">
              ← 返回
            </button>
            <button @click="startReading" :disabled="!selectedSpread" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold py-3 px-12 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mystical-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              🎴 开始占卜
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Shuffling Animation -->
      <div v-if="currentStage === 'shuffling'" class="arcane-sanctuary">
        <!-- Mystical Altar Background -->
        <div class="mystical-altar"></div>

        <!-- Ancient Sigil Rings -->
        <div class="ancient-sigil">
          <div class="sigil-ring ring-outer"></div>
          <div class="sigil-ring ring-middle"></div>
          <div class="sigil-ring ring-inner"></div>
      </div>

        <!-- Arcane Symbols -->
        <div class="arcane-symbols">
          <div v-for="(symbol, index) in arcaneSymbols" :key="index" 
               class="symbol" 
               :style="getSymbolPosition(index)">
            {{ symbol }}
            </div>
          </div>

        <!-- Tarot Vortex -->
        <div class="tarot-vortex">
          <div v-for="n in 22" :key="n" 
               class="mystical-card"
               :style="getCardPosition(n-1)">
            </div>
          </div>
          
        <!-- Crystal Orb -->
        <div class="crystal-orb"></div>

        <!-- Mystical Text -->
        <div class="arcane-text">
          <div class="primary-incantation">命运之牌正在洗牌</div>
          <div class="secondary-incantation">
            静心凝神，让宇宙的智慧与您的灵魂共鸣<br>
            古老的预言即将为您揭示未来的奥秘
        </div>
      </div>

        <!-- Progress Sigil -->
        <div class="progress-sigil">
          <div class="progress-circle">
            <svg class="progress-ring" viewBox="0 0 80 80">
              <defs>
                <linearGradient id="mysticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
                  <stop offset="33%" style="stop-color:#BA55D3;stop-opacity:1" />
                  <stop offset="66%" style="stop-color:#8A2BE2;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#4B0082;stop-opacity:1" />
                </linearGradient>
              </defs>
              <circle class="progress-background" cx="40" cy="40" r="36"/>
              <circle class="progress-foreground" cx="40" cy="40" r="36"/>
            </svg>
              </div>
          <div class="progress-runes">
            <div class="progress-rune" style="top: 0; left: 50%; transform: translateX(-50%);">⚡</div>
            <div class="progress-rune" style="top: 50%; right: 0; transform: translateY(-50%);">⚹</div>
            <div class="progress-rune" style="bottom: 0; left: 50%; transform: translateX(-50%);">⚛</div>
            <div class="progress-rune" style="top: 50%; left: 0; transform: translateY(-50%);">⚜</div>
            </div>
          </div>
          
        <!-- Ethereal Particles -->
        <div class="ethereal-particles">
          <div v-for="n in 30" :key="n" 
               class="particle"
               :class="getParticleClass(n)"
               :style="getParticlePosition(n)">
            </div>
                      </div>
                    </div>
                    
      <!-- Drawing Stage -->
      <div v-if="currentStage === 'drawing'" class="drawing-stage-grid-container">
        <!-- 1. Header Area (Grid Row 1) -->
        <div class="header-area">
          <h2 class="text-3xl font-bold text-white mb-4 mystical-glow">✨ 请选择您的命运之牌</h2>
          <p class="text-lg text-purple-200 mb-6">请用心感受，点击下方的牌来抽取您的{{ selectedSpread?.positions.length }}张牌</p>
          <p class="text-purple-300">已抽取: {{ drawnCards.length }} / {{ selectedSpread?.positions.length }}</p>
                      </div>
                      
        <!-- 2. Animation Area (Grid Row 2) -->
        <div class="animation-area">
          <div class="scene-container">
            <div class="magic-circle-container">
              <svg class="magic-circle" width="100%" height="100%" viewBox="0 0 500 500">
                <defs>
                  <g id="sym-1" stroke-width="6" stroke-linecap="round">
                    <circle cx="0" cy="0" r="12" />
                    <circle cx="0" cy="0" r="5" fill="#FFD700"/>
                  </g>
                  <g id="sym-2" stroke-width="6" stroke-linecap="round">
                    <path d="M 0 -12 L 0 12 M -10 -6 L 10 -6 M -10 6 L 10 6" />
                  </g>
                  <g id="sym-3" stroke-width="6" stroke-linecap="round">
                    <path d="M 0 -12 L 10 6 L -10 6 Z" />
                  </g>
                  <g id="sym-4" stroke-width="6" stroke-linecap="round">
                    <path d="M 0 12 L -10 -6 L 10 -6 Z" />
                  </g>
                  <g id="sym-5" stroke-width="6" stroke-linecap="round">
                    <path d="M 0 -12 L 0 12 M -12 0 L 0 0" />
                  </g>
                  <g id="sym-6" stroke-width="6" stroke-linecap="round">
                    <path d="M 0 -12 L 0 0 M 0 12 L 0 0 M -12 0 L 0 0 L 12 0" />
                  </g>
                </defs>
                <g stroke="#FFD700" fill="none">
                  <circle class="sigil-element" cx="250" cy="250" r="220" stroke-width="4"/>
                  <circle class="sigil-element" cx="250" cy="250" r="180" stroke-width="1.5"/>
                  <g stroke-width="4">
                    <path class="sigil-element" d="M 250 80 L 405 330 L 95 330 Z" />
                    <path class="sigil-element" d="M 250 420 L 95 170 L 405 170 Z" />
                  </g>
                  <g id="symbols-layer">
                    <!-- Symbols will be placed here by JS -->
                  </g>
                </g>
              </svg>
                        </div>
            <div class="card-spread-container">
              <div
                v-for="(item, index) in displayedDeck"
                :key="item.id"
                class="card-wrapper"
                :class="{ 'drawn': item.drawn }"
                @click="drawCard(item, index)"
              >
                <div class="card"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
        <!-- 3. Slots Area (Grid Row 3) -->
        <div class="slots-area">
          <div class="drawn-positions">
            <div class="grid gap-4 justify-center" :class="getCardLayoutClass(positions.length)">
              <div v-for="(_position, index) in positions" :key="index" class="position-slot">
                <div class="text-center mb-2">
                  <h3 class="text-base font-bold text-white mb-2">{{ positions[index] }}</h3>
                      </div>
                <div class="card-slot w-28 h-40 mx-auto rounded-lg border-2 border-dashed border-purple-400/50 flex items-center justify-center" :class="{ 'filled': drawnCards[index] }">
                  <div v-if="!drawnCards[index]" class="text-purple-400 text-5xl opacity-50">?</div>
                  <div v-else class="drawn-card-preview w-full h-full bg-gradient-to-br from-purple-800 to-indigo-900 rounded-lg flex flex-col items-center justify-center transform animate-flip-in border border-purple-400/50">
                    <div class="text-white text-2xl animate-pulse">🌟</div>
                    </div>
                        </div>
                      </div>
                        </div>
                        </div>
          
          <div v-if="isReadyToReveal" class="text-center mt-8">
            <button @click="revealCards" class="bg-gradient-to-r from-pink-600 to-red-600 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mystical-glow">
              ✨ 揭示命运
            </button>
                      </div>
                    </div>
                  </div>
                  
      <!-- Reveal Stage -->
      <div v-if="currentStage === 'reveal'">
        <!-- isRevealing a full screen overlay with canvas -->
        <div v-if="isRevealing" class="revealing-container">
          <!-- 3D星空Canvas -->
          <canvas ref="threeCanvasRef" class="celestial-canvas"></canvas>
          
          <div class="revelation-content">
            <div class="revelation-header">
              <h2 class="text-4xl font-bold mb-4">命运的启示</h2>
              <p v-if="userQuestion" class="text-xl mt-2 mb-8">关于您的问题: "{{ userQuestion }}"</p>
            </div>
            
            <div class="revelation-footer">
              <h3 class="text-2xl font-bold mb-4 interpreting-text">正在解读星辰的密语...</h3>
              <p class="text-lg connecting-text">请稍候，我们正在为您连接宇宙的智慧。</p>
            </div>
          </div>
        </div>
          
        <div v-else-if="revealedCards.length > 0" class="max-w-6xl mx-auto px-4 py-8 space-y-12">
          <!-- Revealed Cards Display -->
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-white mb-2 mystical-glow">✨ 命运的启示 ✨</h2>
            <p v-if="userQuestion" class="text-lg text-purple-200 mt-2">关于您的问题: "{{ userQuestion }}"</p>
          </div>
          <div class="revealed-cards-grid grid gap-8" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
            <div 
              v-for="(card, index) in revealedCards" 
              :key="card.name"
              class="revealed-card-container animate-fade-in"
              :style="{ animationDelay: `${index * 150}ms` }"
              @mouseover="showCardTooltip(card, $event)"
              @mouseleave="hideTooltip"
            >
              <div class="enhanced-card-container bg-gradient-to-br from-indigo-800/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl h-full flex flex-col text-center transition-all duration-300 hover:shadow-2xl hover:border-yellow-400/80 hover:scale-105">
                <h4 class="text-base font-bold text-yellow-300 mb-2 font-serif">{{ card.position }}</h4>
                <div class="relative mx-auto mb-3">
                  <img :src="card.imageUrl" :alt="card.name" class="w-48 h-72 object-cover rounded-xl shadow-2xl transition-all duration-500 border-2 border-yellow-400/30" :class="{'transform rotate-180': card.orientation === 'reversed'}" @error="handleImageError">
                  <span v-if="card.orientation === 'reversed'" class="absolute bottom-1 right-1 text-xs bg-red-600/80 text-white px-2 py-1 rounded-full font-bold">逆位</span>
                </div>
                <h3 class="text-lg font-semibold text-white">{{ card.name }}</h3>
              </div>
            </div>
          </div>
            
          <!-- Main Interpretation Sections -->
          <div class="mt-12 space-y-6" v-if="mainInterpretation.length > 0">
            <div 
              v-for="(section, index) in mainInterpretation" 
              :key="index"
              class="enhanced-interpretation-section bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-indigo-400/30 shadow-xl"
            >
              <h3 class="text-2xl font-bold text-yellow-300 mb-4 font-serif flex items-center gap-3">
                <span class="text-3xl">{{ section.icon }}</span>
                <span>{{ section.title }}</span>
              </h3>
              <div class="mb-4 p-4 bg-black/20 rounded-xl border border-yellow-400/30">
                <p class="text-lg font-semibold text-yellow-200 leading-relaxed">
                  <strong class="font-bold">核心洞见：</strong>{{ section.summary }}
                </p>
              </div>
              <p
                class="text-lg text-gray-200 leading-relaxed"
                style="white-space: pre-wrap;"
              >
                {{ section.content }}
              </p>
            </div>
          </div>
        </div>
      </div>
          
      <div 
        ref="tooltipRef"
        class="fixed top-0 left-0 z-50 p-4 bg-gray-900 bg-opacity-90 border border-yellow-400/50 text-white rounded-lg shadow-lg max-w-sm transition-opacity duration-200"
        :style="tooltipStyle"
        v-show="isTooltipVisible"
        style="white-space: pre-wrap;"
      >
        <p class="text-base leading-relaxed">{{ tooltipContent }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { storyTarotDeck, type StoryTarotCard } from '../utils/storyTarotData';
import { classicSpreads, type TarotSpread, type TarotPosition } from '../utils/tarotInterpretation';
import { LLMService, type InterpretationSection } from '../../../services/LLMService';
import anime from 'animejs/lib/anime.es.js';
import * as THREE from 'three';

// Use direct path to card back image
const newCardBackImage = '/src/assets/new-card-back.png';
const cardBackStyle = { backgroundImage: `url(${newCardBackImage})` };

// Enhanced Shuffling Animation Data
const arcaneSymbols = ref(['⚡', '⚹', '⚛', '⚜', '✦', '✧', '✨', '⭐', '🌟', '💫', '🔮', '🌙']);

// Enhanced Shuffling Animation Functions
function getSymbolPosition(index: number): Record<string, string> {
  const radius = 300;
  const angle = (index * 30) - 90;
  const x = 50 + (radius / 10) * Math.cos(angle * Math.PI / 180);
  const y = 50 + (radius / 10) * Math.sin(angle * Math.PI / 180);
  return {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    'animation-delay': `${index * 0.1}s`
  };
}

function getCardPosition(index: number): Record<string, string> {
  const radius = 280;
  const angle = (index * 16.36) - 180; // 360/22 = 16.36 degrees per card
  const x = 50 + (radius / 10) * Math.cos(angle * Math.PI / 180);
  const y = 50 + (radius / 10) * Math.sin(angle * Math.PI / 180);
  return {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
    'animation-delay': `${index * 0.05}s`
  };
}

function getParticleClass(index: number): string {
  const types = ['star', 'sparkle', 'glow'];
  return types[index % types.length];
}

function getParticlePosition(index: number): Record<string, string> {
  return {
    position: 'absolute',
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    'animation-delay': `${Math.random() * 3}s`
  };
}

function getRandomStarStyle(): Record<string, string | number> {
  const size = Math.random() * 2 + 1;
  return {
    position: 'absolute',
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    'animation-delay': `${Math.random() * 5}s`,
    'animation-duration': `${Math.random() * 3 + 2}s`
  };
}

type Orientation = 'upright' | 'reversed';

interface RevealedCard extends StoryTarotCard {
    position: string;
  interpretation?: string;
  orientation: Orientation;
}

type Stage = 'intro' | 'spreadSelection' | 'shuffling' | 'drawing' | 'reveal';

const currentStage = ref<Stage>('intro');
const selectedSpread = ref<TarotSpread | null>(null);
const userQuestion = ref('');
const positions = ref<string[]>([]);
const drawnCards = ref<StoryTarotCard[]>([]);
const revealedCards = ref<RevealedCard[]>([]);
const deck = ref<StoryTarotCard[]>([]);
const displayedDeck = ref<{id: number, drawn: boolean}[]>([]);

const mainInterpretation = ref<InterpretationSection[]>([]);
const isRevealing = ref(false);

const barrageArea = ref<HTMLElement | null>(null);
const questionInput = ref<HTMLTextAreaElement | null>(null);

const isReadyToReveal = computed(() => selectedSpread.value && drawnCards.value.length === selectedSpread.value.positions.length);

function goToSpreadSelection() { currentStage.value = 'spreadSelection'; }
function goBackToIntro() { currentStage.value = 'intro'; }

function selectSpread(spread: TarotSpread) {
  selectedSpread.value = spread;
  positions.value = spread.positions.map((p: TarotPosition) => p.chineseName);
}

function getSpreadIcon(spreadName: string): string {
  const icons: Record<string, string> = { 'Three Card Spread': '🔮', 'Love Pyramid Spread': '💕', 'Decision Making Spread': '⚖️' };
  return icons[spreadName] || '🎴';
}

function startReading() {
  if (!selectedSpread.value) return;
  currentStage.value = 'shuffling';
        setTimeout(() => {
    currentStage.value = 'drawing';
    setupDeck();
  }, 3000);
}

function setupDeck() {
  // Initialize the actual tarot deck
  deck.value = [...storyTarotDeck].sort(() => Math.random() - 0.5);
  
  // Create visual deck for display
  const deckSize = 22;
  displayedDeck.value = Array.from({ length: deckSize }, (_, i) => ({
    id: i,
    drawn: false,
  }));
}

function drawCard(item: {id: number, drawn: boolean}, index: number) {
  if (item.drawn || !selectedSpread.value || drawnCards.value.length >= selectedSpread.value.positions.length) return;
  
  const card = deck.value.pop();
  if (card) {
    drawnCards.value.push(card);
    item.drawn = true;
  }
}

// [新增] 3D星空动画相关状态
const threeCanvasRef = ref<HTMLCanvasElement | null>(null);
let threeScene: THREE.Scene | null = null;
let threeCamera: THREE.PerspectiveCamera | null = null;
let threeRenderer: THREE.WebGLRenderer | null = null;
let threeStars: THREE.Points | null = null;
let threeShootingStars: THREE.Points | null = null;
let shootingStarsVelocities: number[] = [];
let animationFrameId: number | null = null;

// [新增] 初始化3D星空动画
function initCelestialAnimation() {
  if (!threeCanvasRef.value) {
    console.error('❌ Canvas元素未找到');
    return;
  }

  try {
    // 获取容器尺寸计算相机纵横比和渲染器尺寸
    const container = threeCanvasRef.value.parentElement;
    const containerRect = container?.getBoundingClientRect();
    const width = containerRect?.width || window.innerWidth;
    const height = containerRect?.height || window.innerHeight;
    
    // 场景设置
    threeScene = new THREE.Scene();

    threeCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 4000);
    threeCamera.position.z = 1000;

    threeRenderer = new THREE.WebGLRenderer({ 
      canvas: threeCanvasRef.value, 
      antialias: true, 
      alpha: true,
      premultipliedAlpha: false
    });
    threeRenderer.setSize(width, height);
    threeRenderer.setPixelRatio(window.devicePixelRatio);
    threeRenderer.setClearColor(0x000000, 0);

    // --- 质感修复：忠实复刻预览图 ---

    // 1. 创建巨大的、柔和的外部光晕
    const outerGlowMaterial = new THREE.SpriteMaterial({
      map: createGlowTexture(),
      color: 0xffeeb4, // 温暖的淡黄色
      transparent: true,
      blending: THREE.AdditiveBlending, // 使用叠加混合，模拟光照
      opacity: 0.6,
    });
    const outerGlowSprite = new THREE.Sprite(outerGlowMaterial);
    outerGlowSprite.scale.set(400, 400, 1.0); // 设定巨大的尺寸
    threeScene.add(outerGlowSprite);

    // 2. 创建明亮的、集中的内部核心
    const innerCoreMaterial = new THREE.SpriteMaterial({
      map: createGlowTexture(), // 复用同样的放射渐变贴图
      color: 0xffffff, // 纯白色
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.95,
    });
    const innerCoreSprite = new THREE.Sprite(innerCoreMaterial);
    innerCoreSprite.scale.set(150, 150, 1.0); // 尺寸小于外圈辉光
    threeScene.add(innerCoreSprite);

    // --- 修复结束 ---
    
    // 创建密集星空背景
    const starGeo = new THREE.BufferGeometry();
    const starVertices = [];
    const starSizes = [];
    
    for (let i = 0; i < 8000; i++) {
      // 创建球形分布的星空
      const radius = Math.random() * 2000 + 500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      starVertices.push(x, y, z);
      starSizes.push(Math.random() * 3 + 1);
    }
    
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starGeo.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
    
    const starMat = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 2, 
      transparent: true, 
      opacity: 0.8, 
      sizeAttenuation: true,
      vertexColors: false
    });
    threeStars = new THREE.Points(starGeo, starMat);
    threeScene.add(threeStars);

    // 创建放射状流星效果
    const shootingGeo = new THREE.BufferGeometry();
    const shootingVertices = [];
    shootingStarsVelocities = [];
    
    for (let i = 0; i < 300; i++) {
      // 从中心向外放射的流星
      const angle = (i / 300) * Math.PI * 2;
      const distance = Math.random() * 1500 + 200;
      const height = (Math.random() - 0.5) * 800;
      
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const z = height;
      
      shootingVertices.push(x, y, z);
      
      // 向外运动的速度
      const speed = Math.random() * 2 + 1;
      shootingStarsVelocities.push(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        (Math.random() - 0.5) * 0.5
      );
    }
    
    shootingGeo.setAttribute('position', new THREE.Float32BufferAttribute(shootingVertices, 3));
    const shootingMat = new THREE.PointsMaterial({ 
      color: 0xaaccff, 
      size: 1.5, 
      transparent: true, 
      opacity: 0.6, 
      sizeAttenuation: true 
    });
    threeShootingStars = new THREE.Points(shootingGeo, shootingMat);
    threeScene.add(threeShootingStars);

    // 启动动画时间轴
    startCelestialTimeline();
    
    // 确保Canvas样式透明
    threeCanvasRef.value.style.background = 'transparent';
    threeCanvasRef.value.style.backgroundColor = 'transparent';
    
    // 开始渲染循环
    animateCelestialScene();

  } catch (error) {
    console.error('❌ 3D星空动画初始化失败:', error);
  }
}

// [新增] 启动3D动画时间轴
function startCelestialTimeline() {
  if (!threeCamera || !threeStars || !threeShootingStars) return;

  const tl = anime.timeline({ easing: 'easeInOutSine' });

  tl.add({
    targets: threeCamera.position,
    z: 400,
    duration: 6000,
    easing: 'easeInOutCubic'
  })
  .add({ 
    targets: threeStars.material, 
    opacity: [0.8, 1], 
    duration: 2000 
  }, 0)
  .add({ 
    targets: threeShootingStars.material, 
    opacity: [0.6, 0.9], 
    duration: 2000 
  }, 300)
  .add({ 
    targets: threeStars.material, 
    opacity: [0.6, 0.9], 
    duration: 2000 
  }, 300);
}

// [新增] 3D场景渲染循环
function animateCelestialScene() {
  if (!threeScene || !threeCamera || !threeRenderer) return;

  // 更新放射状流星位置
  if (threeShootingStars) {
    const positions = threeShootingStars.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += shootingStarsVelocities[i];
      positions[i + 1] += shootingStarsVelocities[i + 1];
      positions[i + 2] += shootingStarsVelocities[i + 2];

      // 重置飞出视野的流星，重新从中心开始
      const distance = Math.sqrt(positions[i] * positions[i] + positions[i + 1] * positions[i + 1]);
      if (distance > 2000) {
        const angle = Math.atan2(positions[i + 1], positions[i]);
        positions[i] = Math.cos(angle) * 200;
        positions[i + 1] = Math.sin(angle) * 200;
        positions[i + 2] = (Math.random() - 0.5) * 800;
      }
    }
    threeShootingStars.geometry.attributes.position.needsUpdate = true;
  }

  // 旋转中央恒星
  if (threeStars) {
    threeStars.rotation.y += 0.001;
  }

  threeRenderer.render(threeScene, threeCamera);
  animationFrameId = requestAnimationFrame(animateCelestialScene);
}

// [新增] 清理3D资源
function disposeCelestialAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (threeRenderer) {
    threeRenderer.dispose();
    threeRenderer = null;
  }

  if (threeScene) {
    threeScene.clear();
    threeScene = null;
  }

  threeCamera = null;
  threeStars = null;
  threeShootingStars = null;
  shootingStarsVelocities = [];
}

// [新增] 窗口大小调整处理
function handleCelestialResize() {
  if (!threeCamera || !threeRenderer) return;
  
  threeCamera.aspect = window.innerWidth / window.innerHeight;
  threeCamera.updateProjectionMatrix();
  threeRenderer.setSize(window.innerWidth, window.innerHeight);
}

async function revealCards() {
  if (!selectedSpread.value) return;
  
  currentStage.value = 'reveal';
  isRevealing.value = true;
  mainInterpretation.value = [];
  revealedCards.value = [];

  // [新增] 启动3D星空动画
  await nextTick();
  
  // 添加短暂延迟确保DOM完全渲染
  setTimeout(() => {
    initCelestialAnimation();
  }, 100);

  const cardsToInterpret = drawnCards.value.map(card => ({
    ...card,
    orientation: Math.random() < 0.5 ? 'reversed' : 'upright' as Orientation,
  }));

  try {
    const { mainInterpretation: sections, cards: cardsWithInterpretations } = await LLMService.getTarotInterpretation(
      cardsToInterpret,
      selectedSpread.value,
      userQuestion.value
    );

    mainInterpretation.value = sections;
    
    // Assign positions to revealed cards
    revealedCards.value = cardsWithInterpretations.map((card, index) => ({
      ...card,
      position: positions.value[index] || `位置 ${index + 1}`
    }));

  } catch (error) {
    console.error("Failed to get tarot interpretation:", error);
    mainInterpretation.value = [{
      icon: '⚠️',
      title: '解读生成失败',
      summary: '服务或网络出现异常，请稍后重试。',
      content: `抱歉，在为您生成解读时遇到问题。请检查您的网络连接或稍后再试。\n\n错误信息: ${(error as Error).message}`
    }];
  } finally {
    isRevealing.value = false;
    // [新增] 解读完成后清理3D动画资源
    setTimeout(() => {
      disposeCelestialAnimation();
    }, 1000);
  }
}

// Tooltip State & Logic
const tooltipRef = ref<HTMLElement | null>(null);
const isTooltipVisible = ref(false);
const tooltipContent = ref('');
const tooltipStyle = ref<any>({});

const showCardTooltip = (card: RevealedCard, event: MouseEvent) => {
  if (!card) {
    console.error('Card object is missing.');
    return;
  }
  
  // Set tooltip content
  if (card.interpretation) {
    tooltipContent.value = card.interpretation;
  } else {
    tooltipContent.value = `${card.name}\n${card.orientation === 'reversed' ? '逆位' : '正位'}\n暂无详细解读`;
  }

  isTooltipVisible.value = true;

  nextTick(() => {
    const tooltipEl = tooltipRef.value;
    if (!tooltipEl) {
      console.error("Tooltip element not found in DOM.");
      return;
    }
    
    const cardEl = event.currentTarget as HTMLElement;
    const cardRect = cardEl.getBoundingClientRect();
    const containerRect = cardEl.closest('.tarot-page')?.getBoundingClientRect();

    if (!containerRect) return;

    let top = cardRect.top - containerRect.top + cardRect.height + 10;
    let left = cardRect.left - containerRect.left + cardRect.width / 2;

    // Check if tooltip would go off-screen vertically
    if (top + tooltipEl.offsetHeight > containerRect.height) {
      top = cardRect.top - containerRect.top - tooltipEl.offsetHeight - 10;
    }

    tooltipStyle.value = {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      transform: 'translateX(-50%)'
    };
  });
};

const hideTooltip = () => {
  isTooltipVisible.value = false;
};

const getCardLayoutClass = (count: number) => {
  if (count <= 3) return 'grid-cols-1 md:grid-cols-3';
  if (count <= 6) return 'grid-cols-3 md:grid-cols-3';
  return 'grid-cols-4';
};

const handleImageError = (event: Event) => { 
  (event.target as HTMLImageElement).src = newCardBackImage; 
};

// Animation Watcher
watch(currentStage, (newStage) => {
  if (newStage === 'drawing') {
    nextTick(() => {
      animateDrawingStage();
    });
  }
});

const animateDrawingStage = () => {
  // 1. Animate Magic Circle
  const symbolsLayer = document.getElementById('symbols-layer');
  if (!symbolsLayer) return;
  
  // Clear previous symbols if any
  while (symbolsLayer.firstChild) {
    symbolsLayer.removeChild(symbolsLayer.firstChild);
  }

  const centerX = 250;
  const centerY = 250;
  const radius = 200;
  const numSymbols = 6;
  
  for (let i = 0; i < numSymbols; i++) {
    const angleRad = (Math.PI / 180) * (i * 60 - 90);
    const x = centerX + radius * Math.cos(angleRad);
    const y = centerY + radius * Math.sin(angleRad);
    
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#sym-${i+1}`);
    use.setAttribute('x', x.toString());
    use.setAttribute('y', y.toString());
    symbolsLayer.appendChild(use);
  }
  
  const sigilElements = document.querySelectorAll('.magic-circle .sigil-element, .magic-circle use');
  sigilElements.forEach((el: any) => {
    el.style.opacity = '0';
  });
  
  anime({
    targets: sigilElements,
    strokeDashoffset: [anime.setDashoffset, 0],
    opacity: [0, 1],
    easing: 'easeInOutSine',
    duration: 2500,
    delay: anime.stagger(100, {start: 200})
  });

  // 2. Animate Cards with 3D transforms - wider arc to avoid center
  const cards = document.querySelectorAll('.card-wrapper');
  const numCards = cards.length;
  const totalAngle = 220; // Wider arc
  const anglePerCard = totalAngle / (numCards - 1);
  const startAngle = -totalAngle / 2;

  cards.forEach((card, i) => {
    const rotation = startAngle + i * anglePerCard;
    anime({
      targets: card,
      opacity: [0, 1],
      rotate: rotation,
      translateZ: [200, 0], // 3D animation: cards come from front and settle at Z=0
      delay: 1200 + i * 50,
      duration: 1500,
      easing: 'easeInOutCirc'
    });
  });
};

// --- Barrage System ---
interface BarrageItem {
  el: HTMLDivElement; text: string; x: number; width: number; speed: number; row: number; paused: boolean; likes: number;
}
const barrageItems = ref<BarrageItem[]>([]);
const BARRAGE_ROWS = 4;
const ROW_HEIGHT = 40;
interface BarrageRowState { lastItemExitTime: number; }
const rowStates = ref<BarrageRowState[]>(Array.from({ length: BARRAGE_ROWS }, () => ({ lastItemExitTime: 0 })));
let barrageAnimationId: number;

function initBarrage() {
  if (!barrageArea.value) return;
  const suggestions = [
    { text: '我的事业发展如何？', likes: 12 }, { text: '我的感情运势怎样？', likes: 25 }, { text: '近期财运如何？', likes: 8 },
    { text: '我该如何面对当前的困境？', likes: 15 }, { text: '未来三个月会有什么新机会？', likes: 5 }, { text: '我与TA的关系会如何发展？', likes: 18 },
    { text: '我应该接受这个工作机会吗？', likes: 20 }, { text: '我的爱情会长久吗？', likes: 30 }, { text: '什么时候能遇到真爱？', likes: 28 },
    { text: '如何提升我的财运？', likes: 16 }, { text: '我的健康状况如何？', likes: 10 }, { text: '今年是否适合创业？', likes: 14 },
    { text: '我与家人的关系会改善吗？', likes: 9 }, { text: '考试能否顺利通过？', likes: 22 }, { text: '这段感情值得坚持吗？', likes: 35 },
    { text: '什么阻碍了我的发展？', likes: 13 }, { text: '如何化解人际关系危机？', likes: 11 }, { text: '投资理财有什么建议？', likes: 17 },
    { text: '我的天赋在哪个领域？', likes: 19 }, { text: '如何找到人生方向？', likes: 24 }, { text: '搬家换环境是否有利？', likes: 7 },
    { text: '我们适合结婚吗？', likes: 32 }, { text: '如何提升自己的魅力？', likes: 21 }, { text: '职场晋升的机会在哪里？', likes: 18 }
  ];
  
  // 先添加3-4个初始弹幕
  const initialCount = 3 + Math.floor(Math.random() * 2); // 3-4个
  const shuffledSuggestions = [...suggestions].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < initialCount; i++) {
    setTimeout(() => {
      addBarrageItem(shuffledSuggestions[i]);
    }, i * 800); // 间隔800ms添加初始弹幕
  }
  
  // 然后开始定期添加新弹幕
  const add = () => {
    const currentTexts = new Set(barrageItems.value.map(item => item.text));
    const availableSuggestions = suggestions.filter(s => !currentTexts.has(s.text));
    if (availableSuggestions.length > 0) {
      const suggestion = availableSuggestions[Math.floor(Math.random() * availableSuggestions.length)];
      addBarrageItem(suggestion);
    }
    setTimeout(add, 1800 + Math.random() * 2200); // 稍微缩短间隔使弹幕更活跃
  }

  // 延迟启动定期添加，避免与初始弹幕冲突
  setTimeout(add, initialCount * 800 + 1000);
  animateBarrage();
}

function addBarrageItem(suggestion: {text: string, likes: number}) {
  if (!barrageArea.value) return;
  const containerWidth = barrageArea.value.offsetWidth;
  let bestRow = -1;
  let earliestExitTime = Infinity;
  for (let i = 0; i < BARRAGE_ROWS; i++) {
    if (performance.now() > rowStates.value[i].lastItemExitTime) {
      bestRow = i; break;
    }
    if (rowStates.value[i].lastItemExitTime < earliestExitTime) {
      earliestExitTime = rowStates.value[i].lastItemExitTime;
      bestRow = i;
    }
  }

  const el = document.createElement('div');
  el.className = 'barrage-item absolute whitespace-nowrap cursor-pointer transition-all duration-200 select-none flex items-center gap-3';
  el.style.top = `${bestRow * ROW_HEIGHT}px`;
  el.style.transform = `translateX(${containerWidth}px)`;
  const textSpan = document.createElement('span');
  textSpan.textContent = suggestion.text;
  textSpan.className = 'barrage-text flex-1 text-white';
  const likeButton = document.createElement('button');
  likeButton.className = 'like-button flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 hover:bg-red-500/20';
  likeButton.innerHTML = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg><span class="text-xs font-medium text-white">${suggestion.likes}</span>`;
  el.appendChild(textSpan);
  el.appendChild(likeButton);
  barrageArea.value.appendChild(el);
  const speed = Math.random() * 20 + 40;
  const width = el.offsetWidth;
  const item: BarrageItem = { el, text: suggestion.text, x: containerWidth, width, speed, row: bestRow, paused: false, likes: suggestion.likes };
  const duration = (containerWidth + width) / speed * 1000;
  rowStates.value[bestRow].lastItemExitTime = performance.now() + duration / 2;
  el.addEventListener('click', () => userQuestion.value = item.text);
  el.addEventListener('mouseenter', () => { item.paused = true; el.style.zIndex = '100'; });
  el.addEventListener('mouseleave', () => { item.paused = false; el.style.zIndex = 'auto'; });
  likeButton.addEventListener('click', e => {
      e.stopPropagation();
      item.likes++;
      likeButton.innerHTML = `<svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg><span class="text-xs font-medium text-red-500">${item.likes}</span>`;
  });
  barrageItems.value.push(item);
}

function animateBarrage() {
  let lastTime = 0;
  const animate = (currentTime: number) => {
    if (!lastTime) lastTime = currentTime;
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    for (let i = barrageItems.value.length - 1; i >= 0; i--) {
      const item = barrageItems.value[i];
      if (!item.paused) {
        item.x -= item.speed * deltaTime;
      }
      if (item.x + item.width < 0) {
        item.el.remove();
        barrageItems.value.splice(i, 1);
  } else {
        const scale = item.paused ? 1.05 : 1;
        item.el.style.transform = `translateX(${item.x}px) scale(${scale})`;
      }
    }
    barrageAnimationId = requestAnimationFrame(animate);
  }
  animate(performance.now());
}

onMounted(() => {
    initBarrage();
  // [新增] 添加窗口大小调整监听器
  window.addEventListener('resize', handleCelestialResize);
});

onUnmounted(() => {
  cancelAnimationFrame(barrageAnimationId);
  // [新增] 清理3D动画资源和事件监听器
  disposeCelestialAnimation();
  window.removeEventListener('resize', handleCelestialResize);
});

function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  
  if (context) {
    const gradient = context.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 220, 170, 0.8)');
    gradient.addColorStop(0.4, 'rgba(255, 200, 100, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  return new THREE.CanvasTexture(canvas);
}

function createSunTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');

  if (context) {
    // 基础颜色
    context.fillStyle = '#FF8C00'; // DarkOrange
    context.fillRect(0, 0, 256, 256);

    // 添加多层"斑点"来模拟动荡的表面
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const radius = Math.random() * 25 + 3;
      const opacity = Math.random() * 0.4 + 0.1;
      
      const colorSelector = Math.random();
      if (colorSelector > 0.7) {
        context.fillStyle = `rgba(255, 255, 224, ${opacity})`; // LightYellow
      } else if (colorSelector > 0.4) {
        context.fillStyle = `rgba(255, 165, 0, ${opacity})`; // Orange
      } else {
        context.fillStyle = `rgba(255, 140, 0, ${opacity})`; // DarkOrange lighter shade
      }

      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// [新增] 启动3D动画时间轴
// ... existing code ...

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:wght@400;600&display=swap');

html {
  scroll-behavior: smooth;
}

.tarot-page {
  font-family: 'Cormorant Garamond', serif;
  background-color: #0c0a1d;
  background-image: radial-gradient(circle at 10% 10%, rgba(120, 80, 255, 0.15) 0%, transparent 30%),
                    radial-gradient(circle at 90% 80%, rgba(100, 120, 255, 0.15) 0%, transparent 40%);
  overflow-x: hidden;
  min-height: calc(100vh - 120px);
}
.mystical-glow {
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.3), 0 0 10px rgba(192, 132, 252, 0.4), 0 0 20px rgba(192, 132, 252, 0.5);
}
.stars-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; }
.stars { position: absolute; color: #fff; opacity: 0.7; animation: twinkle 3s infinite ease-in-out; }
@keyframes twinkle {
  0%, 100% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
}
.spread-card > div { transition: transform 0.5s, box-shadow 0.5s; }
.spread-card.selected > div {
  border-color: rgba(233, 30, 99, 0.8);
  box-shadow: 0 0 20px rgba(233, 30, 99, 0.7);
  transform: scale(1.02);
}
.drawing-stage-container {
  background: radial-gradient(ellipse at center, #2a2141 0%, #0d0c14 70%);
  border-radius: 1.5rem;
  border: 1px solid rgba(168, 85, 247, 0.2);
  padding: 1rem 0;
}

/* --- Magic Sigil Animation --- */
.magic-sigil {
  pointer-events: none; /* Make sure it doesn't block clicks */
}

#sigil, #sigil * {
  /* Set initial state for animations */
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  opacity: 1; /* Ensure elements are visible for anime.js to control */
}


/* Enhanced Shuffling Animation Styles */
.arcane-sanctuary {
  position: relative;
  width: 100%;
  height: calc(100vh - 120px); /* 减去导航栏等固定元素的高度 */
  max-height: 800px; /* 设置最大高度防止超出 */
  background: radial-gradient(ellipse at center, #1a0d33 0%, #0a0510 50%, #000000 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto; /* 水平居中 */
}

.mystical-altar {
  position: absolute;
  width: min(800px, 90vw); /* 响应式尺寸 */
  height: min(800px, 90vh);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle at center, 
    rgba(75, 0, 130, 0.3) 0%, 
    rgba(138, 43, 226, 0.2) 30%, 
    rgba(186, 85, 211, 0.1) 60%, 
    transparent 100%);
  border-radius: 50%;
  animation: altar-pulse 4s infinite ease-in-out;
}

@keyframes altar-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
  50% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
}

.ancient-sigil {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(600px, 75vw); /* 响应式尺寸 */
  height: min(600px, 75vh);
}

.sigil-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid;
  animation: ring-rotation 20s linear infinite;
}

.ring-outer {
  width: 100%;
  height: 100%;
  border-color: rgba(255, 215, 0, 0.6);
  animation-duration: 30s;
}

.ring-middle {
  width: 66.66%;
  height: 66.66%;
  top: 16.67%;
  left: 16.67%;
  border-color: rgba(186, 85, 211, 0.7);
  animation-duration: 25s;
  animation-direction: reverse;
}

.ring-inner {
  width: 33.33%;
  height: 33.33%;
  top: 33.33%;
  left: 33.33%;
  border-color: rgba(138, 43, 226, 0.8);
  animation-duration: 20s;
}

@keyframes ring-rotation {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.arcane-symbols .symbol {
  position: absolute;
  font-size: 2rem;
  color: #FFD700;
  text-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700;
  animation: symbol-float 3s infinite ease-in-out alternate;
}

@keyframes symbol-float {
  from { transform: translateY(0px) scale(1); }
  to { transform: translateY(-10px) scale(1.1); }
}

.tarot-vortex {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(560px, 70vw); /* 响应式尺寸 */
  height: min(560px, 70vh);
}

.mystical-card {
  position: absolute;
  width: 60px;
  height: 90px;
  background: linear-gradient(135deg, #4B0082, #8A2BE2, #BA55D3);
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.5);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  animation: card-vortex 8s infinite linear;
}

@keyframes card-vortex {
  from { 
    transform: translate(-50%, -50%) rotate(0deg) scale(1);
    opacity: 0.8;
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(180deg) scale(1.1);
  }
  to { 
    transform: translate(-50%, -50%) rotate(360deg) scale(1);
    opacity: 0.8;
  }
}

.crystal-orb {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: radial-gradient(circle at 30% 30%, 
    rgba(255, 255, 255, 0.8) 0%, 
    rgba(186, 85, 211, 0.6) 30%, 
    rgba(75, 0, 130, 0.8) 70%, 
    rgba(0, 0, 0, 0.9) 100%);
  border-radius: 50%;
  box-shadow: 
    0 0 30px rgba(186, 85, 211, 0.8),
    inset 0 0 30px rgba(255, 255, 255, 0.3);
  animation: orb-glow 3s infinite ease-in-out alternate;
}

@keyframes orb-glow {
  from { 
    box-shadow: 
      0 0 30px rgba(186, 85, 211, 0.8),
      inset 0 0 30px rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%) scale(1);
  }
  to { 
    box-shadow: 
      0 0 50px rgba(186, 85, 211, 1),
      inset 0 0 50px rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.arcane-text {
  position: absolute;
  bottom: 25%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
}

.primary-incantation {
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  font-weight: bold;
  color: #FFD700;
  text-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700;
  margin-bottom: 1rem;
  animation: text-glow 2s infinite ease-in-out alternate;
}

.secondary-incantation {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  color: rgba(186, 85, 211, 0.9);
  text-shadow: 0 0 5px rgba(186, 85, 211, 0.8);
  line-height: 1.6;
  max-width: 600px;
}

@keyframes text-glow {
  from { text-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700; }
  to { text-shadow: 0 0 15px #FFD700, 0 0 30px #FFD700, 0 0 40px #FFD700; }
}

.progress-sigil {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
}

.progress-circle {
  width: 100%;
  height: 100%;
  position: relative;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-background {
  fill: none;
  stroke: rgba(75, 0, 130, 0.3);
  stroke-width: 4;
}

.progress-foreground {
  fill: none;
  stroke: url(#mysticalGradient);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 226;
  stroke-dashoffset: 226;
  animation: progress-fill 3s ease-in-out infinite;
}

@keyframes progress-fill {
  0% { stroke-dashoffset: 226; }
  50% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 226; }
}

.progress-runes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.progress-rune {
  position: absolute;
  font-size: 1.2rem;
  color: #FFD700;
  text-shadow: 0 0 8px #FFD700;
  animation: rune-pulse 2s infinite ease-in-out;
}

@keyframes rune-pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
}

.ethereal-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  animation: particle-float 4s infinite ease-in-out;
}

.particle.star {
  background: #FFD700;
  box-shadow: 0 0 6px #FFD700;
}

.particle.sparkle {
  background: #BA55D3;
  box-shadow: 0 0 6px #BA55D3;
}

.particle.glow {
  background: #8A2BE2;
  box-shadow: 0 0 6px #8A2BE2;
}

@keyframes particle-float {
  0%, 100% { 
    transform: translateY(0px) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
  50% {
    transform: translateY(-10px) scale(0.8);
    opacity: 0.8;
  }
  75% {
    transform: translateY(-30px) scale(1.1);
    opacity: 0.9;
  }
}
.card-back { background-size: cover; background-position: center; }
.deck-card {
  transition: transform 0.5s ease-in-out, opacity 0.5s;
}
.deck-card.drawn { opacity: 0.2; pointer-events: none; transform: translateY(20px) scale(0.9) !important; }
@keyframes flip-in {
  from { transform: rotateY(90deg) scale(0.8); }
  to { transform: rotateY(0deg) scale(1); }
}
.animate-flip-in { animation: flip-in 0.5s ease-out forwards; }

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9); 
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1); 
  }
}
.animate-fade-in { 
  animation: fade-in 0.8s ease-out forwards; 
}
.tarot-card-container {
  padding: 0.5rem; border-radius: 1rem; background: rgba(0, 0, 0, 0.2);
  border: 1px solid; transition: all 0.3s ease;
}
.major-arcana { border-color: rgba(250, 204, 21, 0.5); }
.minor-arcana { border-color: rgba(168, 85, 247, 0.4); }
.tarot-card-image { transition: transform 0.3s ease; border-radius: 0.75rem; }
.tarot-card-container:hover .tarot-card-image { transform: scale(1.05); }
.barrage-item {
  padding: 4px 12px;
  background: rgba(0,0,0,0.25);
  border-radius: 20px;
  border: 1px solid rgba(147,51,234,0.4);
  text-shadow: 0 0 5px rgba(167, 139, 250, 0.5);
  transition: background-color 0.3s, transform 0.3s ease;
}
.tarot-page .barrage-area .barrage-item,
.tarot-page .barrage-area .barrage-item * {
  color: white !important;
}
.barrage-item:hover {
  background-color: rgba(0,0,0,0.5);
}
/* Reversed card styling */
.reversed-card {
  transform: rotate(180deg);
  transition: transform 0.5s ease-in-out;
}

/* Enhanced card image styling */
.enhanced-card-container img {
  filter: brightness(1.1) contrast(1.1) saturate(1.2);
  transition: all 0.3s ease;
}

.enhanced-card-container:hover img {
  filter: brightness(1.2) contrast(1.2) saturate(1.3);
  transform: scale(1.05);
}

/* New styles from preview */
/* Stage Specific Wrapper */
.drawing-stage-grid-container {
  display: grid;
  grid-template-rows: auto 1fr 320px; /* Header auto-height, Animation takes remaining space, Slots increased height */
  width: 100%;
  min-height: 85vh; /* Slightly increase minimum height */
  max-height: 950px; /* Increase max height to accommodate slots */
  height: auto; /* Let content determine height */
  padding: 1rem;
  gap: 1rem; /* Spacing between grid areas */
}

/* Grid Area 1: Header */
.header-area {
  grid-row: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem 0;
}

/* Grid Area 2: Animation */
.animation-area {
  grid-row: 2;
  position: relative; /* Positioning context for absolute children */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Prevent animation overflow */
  min-height: 400px; /* Ensure minimum space for animations */
  aspect-ratio: 16 / 9; /* Maintain consistent aspect ratio */
}

/* Grid Area 3: Slots */
.slots-area {
  grid-row: 3;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 2rem; /* Increase top padding to create more space */
}

/* Optimized Animation Container */
.scene-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1800px;
  transform-style: preserve-3d;
}

.magic-circle-container {
  position: absolute;
  width: 300px; /* Fixed size for center placement */
  height: 300px;
  top: 20%; /* Move further up to avoid card overlap */
  left: 50%;
  transform: translateX(-50%) translateY(-50%) translateZ(-50px); /* Center in middle area */
  z-index: 1; /* Lower than cards so cards appear above */
  pointer-events: none; /* Allows clicks to pass through to cards below */
}

.magic-circle {
  filter: drop-shadow(0 0 8px #FFD700) drop-shadow(0 0 20px #FFD700);
  animation: subtle-glow 5s infinite ease-in-out;
  animation-delay: 2.8s;
  pointer-events: none;
}

@keyframes subtle-glow {
  0%, 100% { filter: drop-shadow(0 0 6px #FFD700) drop-shadow(0 0 15px #c9a22f); }
  50% { filter: drop-shadow(0 0 12px #ffe76e) drop-shadow(0 0 30px #e0b43a); }
}

.card-spread-container {
  position: absolute;
  width: min(100%, 1200px); /* Fluid width with maximum constraint */
  height: 600px;
  z-index: 20; /* Lower than magic circle but still elevated */
}

.card-wrapper {
  position: absolute;
  width: 70px; /* Smaller cards for better layout */
  height: 105px;
  left: 50%;
  top: 50%; /* Move cards to middle position to avoid blocking slots */
  margin-left: -35px;
  margin-top: -52px;
  transform-origin: 50% -280%; /* Increase arc radius for better spacing */
  cursor: pointer;
    opacity: 0;
}

.card-wrapper .card {
  width: 100%;
  height: 100%;
  background-image: url('/src/assets/new-card-back.png');
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  border: 2px solid rgba(212, 175, 55, 0.5);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
  transition: transform 0.4s ease-out;
}

.card-wrapper:not(.drawn):hover .card {
  transform: scale(1.1) translateZ(50px) !important; /* 3D hover effect */
}

.card-wrapper.drawn {
  opacity: 0.3 !important;
   pointer-events: none;
  filter: grayscale(80%);
}

/* Slots Area Optimization */
.drawn-positions {
  width: 100%;
  max-width: 800px;
}

/* Enhanced Card Container Styling */
.revealed-cards-grid .revealed-card-container {
  display: flex;
  flex-direction: column;
}

.enhanced-card-container {
  position: relative;
  background: radial-gradient(ellipse at top, rgba(49, 29, 99, 0.8), rgba(22, 11, 49, 0.9)) !important;
  border: 2px solid rgba(255, 215, 0, 0.4) !important;
  box-shadow: 
    0 0 30px rgba(255, 215, 0, 0.2),
    inset 0 0 30px rgba(233, 175, 75, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(10px);
}

.enhanced-card-container:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 
    0 0 40px rgba(255, 215, 0, 0.3),
    inset 0 0 40px rgba(233, 175, 75, 0.2),
    0 12px 48px rgba(0, 0, 0, 0.4) !important;
}

.enhanced-card-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
  border-radius: inherit;
  opacity: 0.05;
  pointer-events: none;
}

/* Enhanced Interpretation Section Styling */
.enhanced-interpretation-section {
  position: relative;
  background: radial-gradient(ellipse at top, rgba(49, 29, 99, 0.6), rgba(22, 11, 49, 0.8)) !important;
  border: 2px solid rgba(255, 215, 0, 0.3) !important;
  box-shadow: 
    0 0 25px rgba(255, 215, 0, 0.15),
    inset 0 0 20px rgba(233, 175, 75, 0.1) !important;
}

.enhanced-interpretation-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
  border-radius: inherit;
  opacity: 0.05;
  pointer-events: none;
}

.enhanced-interpretation-section h3 {
  position: relative;
  z-index: 1;
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, rgba(255, 215, 0, 0.8), transparent) 1;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem !important;
  line-height: 1.8;
}

/* Revealing Animation Styles */
.revealing-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #000;
}

/* 3D星空Canvas样式 */
.celestial-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.revelation-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.revelation-content h2,
.revelation-content p {
  color: #FFD700;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.7), 2px 2px 4px rgba(0, 0, 0, 1);
}

.revelation-content h3 {
  color: #FFFFFF;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.7), 2px 2px 4px rgba(0, 0, 0, 1);
  background: none;
  -webkit-text-fill-color: initial;
}

@keyframes fade-in-content {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.status-text-group {
  opacity: 0;
  animation: fade-in-text 1s ease-out 2s forwards;
}

@keyframes fade-in-text {
  from { opacity: 0; }
  to { opacity: 1; }
}

.interpreting-text {
  color: #FFFFFF;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.7), 2px 2px 4px rgba(0, 0, 0, 1);
  background: none;
  -webkit-text-fill-color: initial;
}

@keyframes text-shimmer {
    to {
        background-position: -200% center;
    }
}

.tarot-page.is-revealing-animation {
  background: #000;
}

.revelation-content .interpreting-text {
  color: #FFFFFF;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.7), 2px 2px 4px rgba(0, 0, 0, 1);
  background: none;
  -webkit-text-fill-color: initial;
}

.revelation-header {
  margin-bottom: 2rem;
}

.revelation-footer {
  margin-top: 2rem;
}
</style> 
