<template>
  <div class="jiaobei-animation-player relative w-full h-[500px] flex items-center justify-center overflow-hidden">
    <!-- 动画容器 -->
    <div 
      ref="animationContainerRef" 
      class="animation-container"
      :class="{ 'playing': isPlaying }"
    >
      <!-- 视频动画将在这里动态加载 -->
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  isThrowing: boolean
  animationUrl?: string // 投掷动画URL，默认使用 /jiaobei.mp4
}>()

const emit = defineEmits<{
  (e: 'throw-complete'): void
}>()

const animationContainerRef = ref<HTMLElement | null>(null)
const isPlaying = ref(false)
const hasVideo = ref(false)

// 当前动画元素
let currentVideoElement: HTMLVideoElement | null = null

// 视频播放完成后直接触发完成事件，由父组件生成3次结果

// 播放投掷动画
const playAnimation = () => {
  if (!animationContainerRef.value) {
    console.error('动画容器未找到')
    // 如果容器不存在，直接触发完成事件
    setTimeout(() => {
      emit('throw-complete')
    }, 100)
    return
  }
  
  console.log('开始播放动画（只播放一次）')
  
  // 清理之前的动画
  if (currentVideoElement && animationContainerRef.value) {
    console.log('清除之前的视频')
    currentVideoElement.pause()
    currentVideoElement.remove()
    currentVideoElement = null
    hasVideo.value = false
  }
  
  // 清空容器
  if (animationContainerRef.value) {
    animationContainerRef.value.innerHTML = ''
  }
  
  // 获取动画URL
  const animationUrl = props.animationUrl || '/jiaobei.mp4'
  console.log('加载动画:', animationUrl)
  
  // 创建视频元素
  const video = document.createElement('video')
  video.src = animationUrl
  video.className = 'animation-video'
  video.style.width = '100%'
  video.style.height = '100%'
  video.style.objectFit = 'contain'
  video.style.background = 'transparent'
  video.style.display = 'block'
  video.autoplay = true
  video.muted = true
  video.loop = false
  video.playsInline = true
  video.preload = 'auto'
  video.controls = false
  // 确保视频可以停在最后一帧
  video.pauseOnEnd = false
  
  // 视频加载成功
  video.onloadeddata = () => {
    console.log('视频加载成功，readyState:', video.readyState)
  }
  
  // 视频可以播放
  video.oncanplay = () => {
    console.log('视频可以播放')
  }
  
  // 视频播放开始
  video.onplay = () => {
    console.log('视频开始播放')
    isPlaying.value = true
  }
  
  // 视频播放结束事件
  video.onended = () => {
    console.log('视频播放结束')
    // 动画播放完成后，视频停在最后一帧（保留显示）
    isPlaying.value = false
    
    if (currentVideoElement) {
      // 视频停在最后一帧
      const duration = currentVideoElement.duration
      if (duration && !isNaN(duration)) {
        currentVideoElement.currentTime = duration
      }
      currentVideoElement.pause()
      console.log('视频保留在最后一帧')
    }
    
    // 触发完成事件（不传递结果，由父组件生成3次结果）
    setTimeout(() => {
      emit('throw-complete')
    }, 100)
  }
  
  // 视频加载错误处理
  video.onerror = (e) => {
    console.error('动画加载失败:', animationUrl, e)
    // 如果视频加载失败，延迟触发完成事件
    isPlaying.value = false
    setTimeout(() => {
      emit('throw-complete')
    }, 500)
  }
  
  // 添加到容器
  try {
    animationContainerRef.value.appendChild(video)
    currentVideoElement = video
    hasVideo.value = true
    isPlaying.value = true
    
    console.log('视频元素已添加到容器，准备播放')
    
    // 等待视频可以播放
    const tryPlay = () => {
      if (video.readyState >= 2) {
        // 视频已加载足够数据
        console.log('视频已准备好，开始播放')
        video.play().then(() => {
          console.log('视频播放成功')
          isPlaying.value = true
        }).catch((error) => {
          console.error('视频播放失败:', error)
          // 如果自动播放失败，延迟触发完成事件
          setTimeout(() => {
            emit('throw-complete')
          }, 500)
        })
      } else {
        // 等待加载
        console.log('等待视频加载数据...')
        video.addEventListener('loadeddata', () => {
          console.log('视频数据加载完成，开始播放')
          video.play().then(() => {
            console.log('视频播放成功')
            isPlaying.value = true
          }).catch((error) => {
            console.error('视频播放失败:', error)
            setTimeout(() => {
              emit('throw-complete')
            }, 500)
          })
        }, { once: true })
        
        // 如果加载太慢，也尝试播放
        video.addEventListener('canplay', () => {
          if (video.paused) {
            console.log('视频可以播放，尝试播放')
            video.play().catch((error) => {
              console.error('视频播放失败:', error)
            })
          }
        }, { once: true })
      }
    }
    
    tryPlay()
  } catch (error) {
    console.error('添加视频元素失败:', error)
    setTimeout(() => {
      emit('throw-complete')
    }, 500)
  }
}

// 监听投掷状态
watch(() => props.isThrowing, (newValue, oldValue) => {
  console.log('投掷状态变化:', newValue, '旧值:', oldValue)
  if (newValue && newValue !== oldValue) {
    // 只有在状态从false变为true时才触发
    console.log('触发投掷动画（只播放一次）')
    startThrow()
  }
}, { immediate: false })

// 开始投掷
const startThrow = () => {
  console.log('开始播放投掷动画（只播放一次）')
  
  // 重置状态
  isPlaying.value = false
  
  // 确保容器存在
  if (!animationContainerRef.value) {
    console.error('动画容器未初始化')
    setTimeout(() => {
      playAnimation()
    }, 100)
  } else {
    // 播放投掷动画
    playAnimation()
  }
}

onMounted(() => {
  // 初始化
  console.log('动画播放器已挂载')
  if (animationContainerRef.value) {
    console.log('动画容器已找到')
  } else {
    console.error('动画容器未找到')
  }
})

onUnmounted(() => {
  // 清理
  if (currentVideoElement) {
    currentVideoElement.pause()
    currentVideoElement.remove()
    currentVideoElement = null
    hasVideo.value = false
  }
})
</script>

<style scoped>
.jiaobei-animation-player {
  background: transparent;
  position: relative;
  height: 400px;
  min-height: 400px;
}

.animation-container {
  width: 100%;
  height: 400px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: transparent;
}

.animation-container.playing {
  animation: fadeIn 0.3s ease;
}

.animation-image,
.animation-video {
  max-width: 100%;
  max-height: 100%;
  display: block;
  background: transparent;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>


