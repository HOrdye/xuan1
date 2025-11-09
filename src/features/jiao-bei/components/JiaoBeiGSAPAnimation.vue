<template>
  <div class="jiaobei-gsap-container relative w-full h-[600px] overflow-hidden bg-gradient-to-b from-purple-900/20 via-blue-900/10 to-transparent">
    <!-- 环境光效 -->
    <div class="absolute inset-0 bg-gradient-radial from-purple-200/20 via-transparent to-transparent pointer-events-none"></div>
    
    <!-- 地面 -->
    <div ref="groundRef" class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900/80 via-gray-800/60 to-transparent"></div>
    
    <!-- 地面阴影 -->
    <div ref="shadowRef" class="shadow absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-3 bg-gradient-to-r from-black/20 via-black/40 to-black/20 rounded-full blur-md"></div>
    
    <!-- 粒子效果容器 -->
    <div ref="particlesRef" class="particles-container absolute inset-0 pointer-events-none"></div>
    
    <!-- 筊杯容器 -->
    <div ref="cupContainerRef" class="jiaobei-container absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div ref="cup1Ref" class="jiaobei-cup jiaobei-cup-1">
        <svg width="80" height="40" viewBox="0 0 60 30" class="cup-svg">
          <defs>
            <linearGradient id="cupGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#dc2626;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#b91c1c;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#991b1b;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="cupShadow1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#7f1d1d;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#450a0a;stop-opacity:0.6" />
            </linearGradient>
            <filter id="innerShadow1">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
              <feOffset dx="0" dy="1" result="offsetblur"/>
              <feFlood flood-color="#000000" flood-opacity="0.3"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <!-- 3D 光照效果 -->
            <filter id="glow1">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path
            d="M 5 15 Q 15 5, 30 5 Q 45 5, 55 15 Q 45 25, 30 25 Q 15 25, 5 15 Z"
            fill="url(#cupGradient1)"
            stroke="#991b1b"
            stroke-width="1"
            filter="url(#innerShadow1)"
            class="cup-body"
          />
          <path
            d="M 10 15 Q 18 8, 30 8 Q 42 8, 50 15 Q 42 22, 30 22 Q 18 22, 10 15 Z"
            fill="url(#cupShadow1)"
            opacity="0.6"
            class="cup-inner"
          />
          <ellipse cx="20" cy="12" rx="8" ry="3" fill="rgba(255,255,255,0.5)" opacity="0.9" class="cup-highlight" />
        </svg>
      </div>
      
      <div ref="cup2Ref" class="jiaobei-cup jiaobei-cup-2">
        <svg width="80" height="40" viewBox="0 0 60 30" class="cup-svg">
          <defs>
            <linearGradient id="cupGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#dc2626;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#b91c1c;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#991b1b;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="cupShadow2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#7f1d1d;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#450a0a;stop-opacity:0.6" />
            </linearGradient>
            <filter id="innerShadow2">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
              <feOffset dx="0" dy="1" result="offsetblur"/>
              <feFlood flood-color="#000000" flood-opacity="0.3"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="glow2">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path
            d="M 5 15 Q 15 5, 30 5 Q 45 5, 55 15 Q 45 25, 30 25 Q 15 25, 5 15 Z"
            fill="url(#cupGradient2)"
            stroke="#991b1b"
            stroke-width="1"
            filter="url(#innerShadow2)"
            class="cup-body"
          />
          <path
            d="M 10 15 Q 18 8, 30 8 Q 42 8, 50 15 Q 42 22, 30 22 Q 18 22, 10 15 Z"
            fill="url(#cupShadow2)"
            opacity="0.6"
            class="cup-inner"
          />
          <ellipse cx="20" cy="12" rx="8" ry="3" fill="rgba(255,255,255,0.5)" opacity="0.9" class="cup-highlight" />
        </svg>
      </div>
    </div>
    
    <!-- 结果展示 -->
    <div v-if="showResult" ref="resultRef" class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="bg-black/70 backdrop-blur-sm rounded-2xl p-6 text-white text-center shadow-2xl">
        <div class="text-4xl mb-3">{{ resultEmoji }}</div>
        <h3 class="text-xl font-bold mb-2">{{ currentResult }}</h3>
        <p class="text-sm text-gray-300">{{ resultDescription }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'
// 注意：MotionPathPlugin 和 Physics2DPlugin 是付费插件
// 如果未购买，可以移除这些导入，使用基础的 gsap 动画
// import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
// import { Physics2DPlugin } from 'gsap/Physics2DPlugin'

// 注册 GSAP 插件（如果已购买）
// gsap.registerPlugin(MotionPathPlugin, Physics2DPlugin)

const props = defineProps<{
  isThrowing: boolean
  targetResult?: string | null
}>()

const emit = defineEmits<{
  (e: 'throw-complete', result: string): void
}>()

// DOM 引用
const cupContainerRef = ref<HTMLElement | null>(null)
const cup1Ref = ref<HTMLElement | null>(null)
const cup2Ref = ref<HTMLElement | null>(null)
const shadowRef = ref<HTMLElement | null>(null)
const groundRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const resultRef = ref<HTMLElement | null>(null)

// 状态
const showResult = ref(false)
const currentResult = ref('')
const resultEmoji = ref('')
const resultDescription = ref('')

// 动画时间线
let masterTimeline: gsap.core.Timeline | null = null

// 筊杯结果映射
const resultMap = {
  '圣杯': { emoji: '🥤', desc: '正面向上，表示肯定' },
  '笑杯': { emoji: '😊', desc: '一正一反，表示不确定' },
  '阴杯': { emoji: '🌙', desc: '反面向上，表示否定' },
  '立杯': { emoji: '⚡', desc: '立起，表示需要重新投掷' }
}

// 生成随机结果
const generateResult = (): string => {
  if (props.targetResult) {
    return props.targetResult
  }
  
  const rand = Math.random()
  if (rand < 0.05) return '立杯'
  if (rand < 0.45) return '圣杯'
  if (rand < 0.75) return '笑杯'
  return '阴杯'
}

// 创建粒子效果
const createParticles = () => {
  if (!particlesRef.value) return
  
  // 清空现有粒子
  particlesRef.value.innerHTML = ''
  
  // 创建 20 个粒子
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: radial-gradient(circle, rgba(220,38,38,0.8) 0%, rgba(220,38,38,0) 100%);
      border-radius: 50%;
      pointer-events: none;
      left: 50%;
      top: 50%;
    `
    particlesRef.value.appendChild(particle)
    
    // 随机方向飞散
    const angle = (Math.PI * 2 * i) / 20
    const distance = 100 + Math.random() * 50
    const duration = 0.8 + Math.random() * 0.4
    
    gsap.to(particle, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity: 0,
      scale: 0,
      duration: duration,
      ease: 'power2.out'
    })
  }
}

// 执行投掷动画
const performThrow = () => {
  if (!cupContainerRef.value || !cup1Ref.value || !cup2Ref.value || !shadowRef.value) return
  
  const result = generateResult()
  const resultInfo = resultMap[result as keyof typeof resultMap]
  
  // 重置状态
  showResult.value = false
  currentResult.value = result
  resultEmoji.value = resultInfo.emoji
  resultDescription.value = resultInfo.desc
  
  // 创建主时间线
  masterTimeline = gsap.timeline({
    onComplete: () => {
      showResult.value = true
      if (resultRef.value) {
        gsap.fromTo(resultRef.value, 
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
        )
      }
      emit('throw-complete', result)
    }
  })
  
  // 阶段1: 准备投掷（0-0.3s）
  masterTimeline.set(cupContainerRef.value, {
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1
  })
  
  masterTimeline.set([cup1Ref.value, cup2Ref.value], {
    rotation: 0,
    x: 0,
    y: 0,
    z: 0
  })
  
  masterTimeline.set(shadowRef.value, {
    scale: 1,
    opacity: 0.3
  })
  
  // 阶段2: 向上投掷（0.3-0.6s）
  masterTimeline.to(cupContainerRef.value, {
    y: -150,
    scale: 1.2,
    duration: 0.3,
    ease: 'power2.out'
  })
  
  // 阶段3: 旋转和分离（0.6-1.2s）
  masterTimeline.to(cupContainerRef.value, {
    rotation: 720,
    duration: 0.6,
    ease: 'power1.inOut'
  }, '-=0.3')
  
  // 筊杯1的轨迹
  const cup1Path = [
    { x: 0, y: -150 },
    { x: -80, y: 50 },
    { x: -100, y: 200 },
    { x: -80, y: 250 }
  ]
  
  // 筊杯2的轨迹
  const cup2Path = [
    { x: 0, y: -150 },
    { x: 80, y: 50 },
    { x: 100, y: 200 },
    { x: 80, y: 250 }
  ]
  
  // 根据结果设置最终朝向
  let cup1FinalRotation = 0
  let cup2FinalRotation = 0
  
  if (result === '圣杯') {
    cup1FinalRotation = 0
    cup2FinalRotation = 0
  } else if (result === '阴杯') {
    cup1FinalRotation = 180
    cup2FinalRotation = 180
  } else if (result === '笑杯') {
    cup1FinalRotation = 0
    cup2FinalRotation = 180
  } else { // 立杯
    cup1FinalRotation = 90
    cup2FinalRotation = 90
  }
  
  // 筊杯1动画
  masterTimeline.to(cup1Ref.value, {
    x: cup1Path[3].x,
    y: cup1Path[3].y,
    rotation: cup1FinalRotation + 1080,
    duration: 0.8,
    ease: 'power2.in'
  }, '-=0.6')
  
  // 筊杯2动画
  masterTimeline.to(cup2Ref.value, {
    x: cup2Path[3].x,
    y: cup2Path[3].y,
    rotation: cup2FinalRotation + 1080,
    duration: 0.8,
    ease: 'power2.in'
  }, '-=0.6')
  
  // 容器跟随
  masterTimeline.to(cupContainerRef.value, {
    y: 200,
    duration: 0.8,
    ease: 'power2.in'
  }, '-=0.8')
  
  // 阴影动画
  masterTimeline.to(shadowRef.value, {
    scale: 1.5,
    opacity: 0.6,
    duration: 0.3,
    ease: 'power2.out'
  }, '-=0.8')
  
  masterTimeline.to(shadowRef.value, {
    scale: 1.2,
    opacity: 0.4,
    duration: 0.5,
    ease: 'power2.in'
  })
  
  // 粒子效果
  masterTimeline.call(createParticles, null, '-=0.8')
  
  // 落地弹跳效果
  masterTimeline.to([cup1Ref.value, cup2Ref.value], {
    y: '+=10',
    duration: 0.1,
    ease: 'power2.out',
    yoyo: true,
    repeat: 1
  }, '-=0.3')
}

// 监听投掷状态
watch(() => props.isThrowing, (newValue) => {
  if (newValue) {
    performThrow()
  }
})

// 初始化
onMounted(() => {
  if (cupContainerRef.value && cup1Ref.value && cup2Ref.value) {
    // 设置初始状态
    gsap.set(cupContainerRef.value, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1
    })
    
    gsap.set([cup1Ref.value, cup2Ref.value], {
      rotation: 0,
      x: 0,
      y: 0,
      z: 0
    })
  }
})

// 清理
onUnmounted(() => {
  if (masterTimeline) {
    masterTimeline.kill()
  }
})
</script>

<style scoped>
.jiaobei-gsap-container {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.jiaobei-container {
  transform-style: preserve-3d;
}

.jiaobei-cup {
  position: absolute;
  transform-style: preserve-3d;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.jiaobei-cup-1 {
  left: -40px;
}

.jiaobei-cup-2 {
  left: 40px;
}

.cup-svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.shadow {
  transform-origin: center;
}

.particles-container {
  z-index: 10;
}

.particle {
  will-change: transform, opacity;
}

/* 3D 变换支持 */
@supports (transform-style: preserve-3d) {
  .jiaobei-container {
    transform-style: preserve-3d;
  }
  
  .jiaobei-cup {
    transform-style: preserve-3d;
  }
}
</style>

