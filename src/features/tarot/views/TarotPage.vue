<template>
  <div class="tarot-page container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8">塔罗牌占卜</h1>
    
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="p-6 md:p-8">
        <!-- 介绍部分 -->
        <div v-if="!started" class="text-center mb-8">
          <p class="text-lg text-gray-700 mb-6">
            塔罗牌是一种古老的占卜工具，可以帮助你探索未知的可能性，指引你的方向。
            <br>点击下方按钮开始你的塔罗之旅。
          </p>
          <button 
            @click="startTarot" 
            class="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
          >
            开始占卜
          </button>
        </div>
        
        <!-- 塔罗牌展示区域 -->
        <div v-if="started" class="tarot-spread">
          <div class="text-center mb-6">
            <p class="text-gray-700 mb-4">请在心中默念你的问题，然后点击下方的牌堆抽取三张牌。</p>
            <p class="text-sm text-gray-500 mb-4" v-if="!cardsDrawn">这三张牌分别代表：过去、现在、未来。</p>
          </div>
          
          <!-- 牌堆 -->
          <div v-if="!cardsDrawn" class="deck-container flex justify-center mb-8">
            <div 
              class="tarot-deck w-32 h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1" 
              @click="drawCards"
            >
              <div class="h-full flex items-center justify-center">
                <div class="text-white text-center">
                  <div class="text-3xl mb-2">🃏</div>
                  <div class="text-sm">点击抽牌</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 已抽取的牌 -->
          <div v-if="cardsDrawn" class="drawn-cards">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div v-for="(card, index) in drawnCards" :key="index" class="card-container">
                <div class="card-title text-center mb-2 font-medium text-gray-700">
                  {{ ['过去', '现在', '未来'][index] }}
                </div>
                <div 
                  class="tarot-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  :class="{'flipped': cardFlipped[index]}"
                  @click="flipCard(index)"
                >
                  <div class="card-inner relative">
                    <!-- 牌背面 -->
                    <div class="card-back absolute inset-0 w-full h-64 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <div class="text-white text-3xl">🃏</div>
                    </div>
                    
                    <!-- 牌正面 -->
                    <div class="card-front absolute inset-0 w-full h-64 bg-white p-4 flex flex-col items-center justify-between transform opacity-0" :class="{'show': cardFlipped[index]}">
                      <div class="card-name text-center font-bold">{{ card.name }}</div>
                      <div class="card-image w-24 h-36 bg-gray-100 rounded flex items-center justify-center">
                        <span class="text-4xl">{{ card.symbol }}</span>
                      </div>
                      <div class="card-meaning text-sm text-center text-gray-600">{{ card.meaning }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-8 text-center">
              <button 
                @click="resetTarot" 
                class="bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition"
              >
                重新占卜
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { tarotCards, type TarotCard } from '../utils/tarotData';

const started = ref(false);
const cardsDrawn = ref(false);
const drawnCards = ref<TarotCard[]>([]);
const cardFlipped = ref([false, false, false]);

function startTarot() {
  started.value = true;
}

function drawCards() {
  // 随机抽取3张牌
  const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
  drawnCards.value = shuffled.slice(0, 3);
  cardsDrawn.value = true;
}

function flipCard(index: number) {
  cardFlipped.value[index] = !cardFlipped.value[index];
}

function resetTarot() {
  cardsDrawn.value = false;
  drawnCards.value = [];
  cardFlipped.value = [false, false, false];
}
</script>

<style scoped>
.tarot-deck {
  transform-style: preserve-3d;
  transition: all 0.3s ease;
}

.tarot-card {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.tarot-card.flipped {
  transform: rotateY(180deg);
}

.card-inner {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.card-back, .card-front {
  backface-visibility: hidden;
  transition: all 0.8s ease;
}

.card-front {
  transform: rotateY(180deg);
}

.card-front.show {
  opacity: 1;
}
</style> 