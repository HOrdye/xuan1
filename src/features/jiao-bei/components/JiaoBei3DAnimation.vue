<template>
  <div class="jiaobei-3d-container relative w-full h-[600px]">
    <!-- 3D渲染容器 -->
    <div ref="containerRef" class="w-full h-full rounded-xl overflow-hidden"></div>
    
    <!-- 简化的投掷控制界面 -->
    <div v-if="!isThrowing && !isAnimating" class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <div class="bg-black/60 backdrop-blur-sm rounded-xl p-4 text-white text-center shadow-2xl">
        <button
          @click="simpleThrow"
          class="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
        >
          🥤 投掷筊杯
        </button>
        <p class="text-xs mt-2 text-gray-300">点击按钮进行投掷</p>
      </div>
    </div>
    
    <!-- 投掷状态指示 -->
    <div v-if="isThrowing || isAnimating" class="absolute top-4 left-1/2 transform -translate-x-1/2">
      <div class="bg-black/60 backdrop-blur-sm rounded-xl p-4 text-white text-center shadow-2xl">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          <span class="text-sm font-medium">{{ isThrowing ? '投掷中...' : '物理模拟中...' }}</span>
        </div>
        <div class="mt-2 w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- 结果展示 -->
    <div v-if="showResult" class="absolute inset-0 flex items-center justify-center">
      <div class="bg-black/70 backdrop-blur-sm rounded-2xl p-6 text-white text-center shadow-2xl animate-fade-in">
        <div class="text-4xl mb-3">{{ getResultEmoji(currentResult) }}</div>
        <h3 class="text-xl font-bold mb-2">{{ currentResult }}</h3>
        <p class="text-sm text-gray-300">{{ getResultDescription(currentResult) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  isThrowing: boolean
  targetResult?: string | null
}>()

const emit = defineEmits<{
  (e: 'throw-complete', result: string): void
}>()

// 3D场景相关
const containerRef = ref<HTMLElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId: number

// 筊杯相关
let jiaoBeiMeshes: THREE.Group[] = []
let jiaoBeiPositions: THREE.Vector3[] = []
let jiaoBeiVelocities: THREE.Vector3[] = []
let jiaoBeiAngularVelocities: THREE.Vector3[] = []
let jiaoBeiRotations: THREE.Vector3[] = []

// 动画状态
const isAnimating = ref(false)
const showResult = ref(false)
const currentResult = ref('')

// 物理参数 - 优化的物理模拟
const gravity = new THREE.Vector3(0, -9.8, 0)
const airResistance = 0.98
const groundFriction = 0.85
const bounceDamping = 0.6
const groundY = -2
const rotationDamping = 0.95

// 初始化3D场景
const initScene = () => {
  if (!containerRef.value) return

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a1a)
  scene.fog = new THREE.Fog(0x0a0a1a, 15, 30)

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    60,
    containerRef.value.clientWidth / containerRef.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 12, 18)
  camera.lookAt(0, 0, 0)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
  })
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  containerRef.value.appendChild(renderer.domElement)

  // 添加光源
  addLights()

  // 创建环境
  createEnvironment()

  // 创建筊杯
  createJiaoBei()

  // 开始渲染循环
  animate()
}

// 添加光源 - 增强的光照系统
const addLights = () => {
  // 环境光
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
  scene.add(ambientLight)

  // 主光源 - 增强亮度
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
  directionalLight.position.set(10, 20, 10)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 50
  directionalLight.shadow.camera.left = -15
  directionalLight.shadow.camera.right = 15
  directionalLight.shadow.camera.top = 15
  directionalLight.shadow.camera.bottom = -15
  scene.add(directionalLight)

  // 补充光源 - 增强对比度
  const fillLight = new THREE.DirectionalLight(0x4facfe, 0.4)
  fillLight.position.set(-8, 12, -8)
  scene.add(fillLight)

  // 顶部光源 - 突出平面和凸面
  const topLight = new THREE.DirectionalLight(0xffffff, 0.6)
  topLight.position.set(0, 25, 0)
  scene.add(topLight)
}

// 创建环境 - 简化的场景
const createEnvironment = () => {
  // 地面
  const groundGeometry = new THREE.PlaneGeometry(30, 30)
  const groundMaterial = new THREE.MeshLambertMaterial({ 
    color: 0x8b4513,
    transparent: true,
    opacity: 0.9
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = groundY
  ground.receiveShadow = true
  scene.add(ground)

  // 简化的背景装饰
  createSimpleBackground()
}

// 创建简化的背景装饰
const createSimpleBackground = () => {
  // 简单的香炉
  const incenseBurner = createSimpleIncenseBurner()
  incenseBurner.position.set(0, groundY + 0.5, -5)
  scene.add(incenseBurner)
}

// 创建简单的香炉
const createSimpleIncenseBurner = () => {
  const group = new THREE.Group()
  
  // 香炉主体
  const burnerGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.8, 12)
  const burnerMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x8b4513,
    shininess: 100
  })
  const burner = new THREE.Mesh(burnerGeometry, burnerMaterial)
  burner.castShadow = true
  group.add(burner)

  return group
}

// 创建筊杯 - 优化的传统筊杯模型
const createJiaoBei = () => {
  for (let i = 0; i < 2; i++) {
    const jiaoBeiGroup = new THREE.Group()
    
    // 筊杯主体 - 传统月牙形
    const jiaoBeiGeometry = createTraditionalJiaoBeiGeometry()
    const jiaoBeiMaterial = new THREE.MeshPhongMaterial({
      color: 0xdc2626, // 鲜艳的红色
      shininess: 100,
      specular: 0x444444
    })
    const jiaoBei = new THREE.Mesh(jiaoBeiGeometry, jiaoBeiMaterial)
    jiaoBei.castShadow = true
    jiaoBeiGroup.add(jiaoBei)

    // 平面标识 - 金色圆点（平面朝上时可见）
    const flatIndicatorGeometry = new THREE.CircleGeometry(0.15, 16)
    const flatIndicatorMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.9
    })
    const flatIndicator = new THREE.Mesh(flatIndicatorGeometry, flatIndicatorMaterial)
    flatIndicator.rotation.x = -Math.PI / 2 // 朝下，平面朝上时可见
    flatIndicator.position.y = 0.45
    jiaoBeiGroup.add(flatIndicator)

    // 凸面标识 - 金色圆点（凸面朝上时可见）
    const convexIndicatorGeometry = new THREE.CircleGeometry(0.12, 16)
    const convexIndicatorMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.9
    })
    const convexIndicator = new THREE.Mesh(convexIndicatorGeometry, convexIndicatorMaterial)
    convexIndicator.rotation.x = Math.PI / 2 // 朝上，凸面朝上时可见
    convexIndicator.position.y = 0.45
    jiaoBeiGroup.add(convexIndicator)

    // 设置初始位置
    jiaoBeiGroup.position.set(i * 1.2 - 0.6, 3, 0)
    scene.add(jiaoBeiGroup)
    
    jiaoBeiMeshes.push(jiaoBeiGroup)
    jiaoBeiPositions.push(new THREE.Vector3(i * 1.2 - 0.6, 3, 0))
    jiaoBeiVelocities.push(new THREE.Vector3(0, 0, 0))
    jiaoBeiAngularVelocities.push(new THREE.Vector3(0, 0, 0))
    jiaoBeiRotations.push(new THREE.Vector3(0, 0, 0))
  }
}

// 创建清晰的筊杯几何体 - 明显的平面和凸面
const createTraditionalJiaoBeiGeometry = () => {
  const geometry = new THREE.BufferGeometry()
  
  // 筊杯顶点 - 明显的月牙形，平面和凸面差异明显
  const vertices = new Float32Array([
    // 底面（平面）- 完全平坦，较大
    -1.0, 0, -0.5,  0.0, 0, -0.8,  1.0, 0, -0.5,  1.0, 0, 0.5,  0.0, 0, 0.8,  -1.0, 0, 0.5,
    // 顶面（凸面）- 明显凸起，较小
    -0.7, 0.4, -0.3,  0.0, 0.4, -0.5,  0.7, 0.4, -0.3,  0.7, 0.4, 0.3,  0.0, 0.4, 0.5,  -0.7, 0.4, 0.3
  ])
  
  // 面索引
  const indices = new Uint16Array([
    // 底面（平面）- 完全平坦
    0, 1, 2,  0, 2, 3,  0, 3, 4,  0, 4, 5,
    // 顶面（凸面）- 明显凸起
    6, 11, 10,  6, 10, 9,  6, 9, 8,  6, 8, 7,
    // 侧面 - 连接平面和凸面
    0, 6, 7,  0, 7, 1,
    1, 7, 8,  1, 8, 2,
    2, 8, 9,  2, 9, 3,
    3, 9, 10,  3, 10, 4,
    4, 10, 11,  4, 11, 5,
    5, 11, 6,  5, 6, 0
  ])
  
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geometry.setIndex(new THREE.BufferAttribute(indices, 1))
  geometry.computeVertexNormals()
  
  return geometry
}

// 预设结果驱动的投掷筊杯
const simpleThrow = () => {
  if (isAnimating.value) return
  
  isAnimating.value = true
  showResult.value = false
  
  // 使用预设结果或随机生成结果
  const results = ['圣杯', '笑杯', '阴杯', '立杯', '叠杯']
  const targetResult = props.targetResult || results[Math.floor(Math.random() * results.length)]
  
  // 根据目标结果计算筊杯的最终朝向
  const finalRotations = calculateFinalRotations(targetResult)
  
  // 生成投掷参数（保持随机性但确保最终结果正确）
  const power = Math.random() * 15 + 5 // 5-20的随机力度
  const angle = Math.random() * Math.PI * 2
  const elevation = Math.PI / 4 + (Math.random() - 0.5) * Math.PI / 6
  
  const velocity = new THREE.Vector3(
    Math.cos(angle) * Math.cos(elevation) * power * 0.4,
    Math.sin(elevation) * power * 0.8,
    Math.sin(angle) * Math.cos(elevation) * power * 0.4
  )
  
  // 为每个筊杯设置初始速度和旋转
  jiaoBeiVelocities.forEach((vel, index) => {
    vel.copy(velocity)
    vel.x += (Math.random() - 0.5) * 3
    vel.z += (Math.random() - 0.5) * 3
    
    // 设置角速度，确保最终朝向正确
    const targetRotation = finalRotations[index]
    const currentRotation = jiaoBeiRotations[index]
    
    // 计算需要的角速度来达到目标旋转
    const rotationDiff = new THREE.Vector3(
      targetRotation.x - currentRotation.x,
      targetRotation.y - currentRotation.y,
      targetRotation.z - currentRotation.z
    )
    
    jiaoBeiAngularVelocities[index].copy(rotationDiff.multiplyScalar(0.5))
  })
  
  // 开始物理模拟
  startPhysicsSimulation(targetResult)
}

// 根据目标结果计算筊杯的最终朝向
const calculateFinalRotations = (targetResult: string) => {
  const rotations = []
  
  switch (targetResult) {
    case '圣杯': // 一平一凸
      rotations.push(
        new THREE.Vector3(0, 0, 0), // 第一个筊杯：平面朝上
        new THREE.Vector3(0, Math.PI, 0) // 第二个筊杯：凸面朝上
      )
      break
    case '笑杯': // 两平朝上
      rotations.push(
        new THREE.Vector3(0, 0, 0), // 第一个筊杯：平面朝上
        new THREE.Vector3(0, 0, 0) // 第二个筊杯：平面朝上
      )
      break
    case '阴杯': // 两凸朝上
      rotations.push(
        new THREE.Vector3(0, Math.PI, 0), // 第一个筊杯：凸面朝上
        new THREE.Vector3(0, Math.PI, 0) // 第二个筊杯：凸面朝上
      )
      break
    case '立杯': // 筊杯直立
      rotations.push(
        new THREE.Vector3(Math.PI / 2, 0, 0), // 第一个筊杯：直立
        new THREE.Vector3(0, 0, 0) // 第二个筊杯：正常
      )
      break
    case '叠杯': // 筊杯重叠
      rotations.push(
        new THREE.Vector3(0, 0, 0), // 第一个筊杯：平面朝上
        new THREE.Vector3(0, 0, 0) // 第二个筊杯：平面朝上（重叠）
      )
      break
    default:
      rotations.push(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, Math.PI, 0)
      )
  }
  
  return rotations
}

// 确保最终结果与目标结果一致
const ensureFinalResult = (targetResult: string) => {
  const finalRotations = calculateFinalRotations(targetResult)
  
  // 强制设置筊杯的最终位置和朝向
  jiaoBeiMeshes.forEach((mesh, index) => {
    const targetRotation = finalRotations[index]
    
    // 设置最终位置（在地面上）
    const finalPosition = new THREE.Vector3(
      index * 1.2 - 0.6,
      groundY + 0.1, // 稍微高于地面
      0
    )
    
    // 应用最终位置和旋转
    mesh.position.copy(finalPosition)
    mesh.rotation.set(targetRotation.x, targetRotation.y, targetRotation.z, 'XYZ')
    
    // 更新状态数组
    jiaoBeiPositions[index].copy(finalPosition)
    jiaoBeiRotations[index].copy(targetRotation)
    jiaoBeiVelocities[index].set(0, 0, 0)
    jiaoBeiAngularVelocities[index].set(0, 0, 0)
  })
}

// 开始物理模拟 - 预设结果驱动的物理模拟
const startPhysicsSimulation = (targetResult: string) => {
  let simulationTime = 0
  const maxSimulationTime = 6000 // 6秒
  let stableCount = 0
  const stableThreshold = 60 // 60帧稳定后停止
  
  const simulate = () => {
    if (simulationTime >= maxSimulationTime) {
      checkResult()
      return
    }
    
    // 更新物理
    jiaoBeiMeshes.forEach((mesh, index) => {
      const pos = jiaoBeiPositions[index]
      const vel = jiaoBeiVelocities[index]
      const angVel = jiaoBeiAngularVelocities[index]
      const rot = jiaoBeiRotations[index]
      
      // 应用重力
      vel.add(gravity.clone().multiplyScalar(0.016))
      
      // 应用空气阻力
      vel.multiplyScalar(airResistance)
      
      // 更新位置
      pos.add(vel.clone().multiplyScalar(0.016))
      
      // 地面碰撞
      if (pos.y <= groundY) {
        pos.y = groundY
        
        // 计算反弹
        const bounceForce = Math.abs(vel.y) * bounceDamping
        vel.y = bounceForce
        
        // 地面摩擦力
        vel.x *= groundFriction
        vel.z *= groundFriction
        
        // 角速度衰减
        angVel.multiplyScalar(rotationDamping)
      }
      
      // 边界碰撞
      if (Math.abs(pos.x) > 6) {
        pos.x = Math.sign(pos.x) * 6
        vel.x = -vel.x * 0.3
      }
      if (Math.abs(pos.z) > 6) {
        pos.z = Math.sign(pos.z) * 6
        vel.z = -vel.z * 0.3
      }
      
      // 更新旋转
      rot.x += angVel.x * 0.016
      rot.y += angVel.y * 0.016
      rot.z += angVel.z * 0.016
      
      // 限制旋转角度
      rot.x = Math.max(-Math.PI * 2, Math.min(Math.PI * 2, rot.x))
      rot.y = Math.max(-Math.PI * 2, Math.min(Math.PI * 2, rot.y))
      rot.z = Math.max(-Math.PI * 2, Math.min(Math.PI * 2, rot.z))
      
      // 应用位置和旋转
      mesh.position.copy(pos)
      mesh.rotation.set(rot.x, rot.y, rot.z, 'XYZ')
    })
    
    // 检查是否稳定
    const isStable = jiaoBeiVelocities.every(vel => 
      Math.abs(vel.x) < 0.005 && Math.abs(vel.y) < 0.005 && Math.abs(vel.z) < 0.005
    ) && jiaoBeiAngularVelocities.every(angVel =>
      Math.abs(angVel.x) < 0.01 && Math.abs(angVel.y) < 0.01 && Math.abs(angVel.z) < 0.01
    )
    
    if (isStable) {
      stableCount++
      if (stableCount >= stableThreshold) {
        // 确保最终结果与目标结果一致
        ensureFinalResult(targetResult)
        checkResult()
        return
      }
    } else {
      stableCount = 0
    }
    
    simulationTime += 16
    requestAnimationFrame(simulate)
  }
  
  simulate()
}

// 检查投掷结果 - 简化的结果判断
const checkResult = () => {
  isAnimating.value = false
  
  // 分析筊杯的最终状态
  const results = jiaoBeiMeshes.map((mesh, index) => {
    const pos = jiaoBeiPositions[index]
    const rot = jiaoBeiRotations[index]
    
    return {
      position: pos.clone(),
      rotation: rot.clone(),
      height: pos.y - groundY
    }
  })
  
  // 判断结果
  let result = determineResult(results)
  
  // 显示结果
  currentResult.value = result
  showResult.value = true
  
  // 3秒后隐藏结果并触发回调
  setTimeout(() => {
    showResult.value = false
    emit('throw-complete', result)
  }, 3000)
}

// 判断投掷结果 - 简化的结果判断
const determineResult = (results: any[]) => {
  const [result1, result2] = results
  
  // 检查立杯（特殊位置）
  const isStanding1 = Math.abs(result1.rotation.x) > Math.PI / 3
  const isStanding2 = Math.abs(result2.rotation.x) > Math.PI / 3
  
  if (isStanding1 || isStanding2) {
    return '立杯'
  }
  
  // 检查叠杯 - 距离判断
  const distance = result1.position.distanceTo(result2.position)
  if (distance < 0.8) {
    return '叠杯'
  }
  
  // 检查常规结果 - 基于Y轴旋转判断
  const isFlat1 = Math.abs(result1.rotation.y) < Math.PI / 4 // 平面朝上
  const isFlat2 = Math.abs(result2.rotation.y) < Math.PI / 4 // 平面朝上
  
  if (isFlat1 && isFlat2) {
    return '笑杯'
  } else if (!isFlat1 && !isFlat2) {
    return '阴杯'
  } else {
    return '圣杯'
  }
}

// 获取结果表情符号
const getResultEmoji = (result: string) => {
  const emojiMap: Record<string, string> = {
    '圣杯': '🙏',
    '笑杯': '😊',
    '阴杯': '😔',
    '立杯': '⚡',
    '叠杯': '🥤'
  }
  return emojiMap[result] || '🥤'
}

// 获取结果描述
const getResultDescription = (result: string) => {
  const descriptionMap: Record<string, string> = {
    '圣杯': '一平一凸，神明应允',
    '笑杯': '两平朝上，神明笑答',
    '阴杯': '两凸朝上，神明否定',
    '立杯': '筊杯直立，神明显灵',
    '叠杯': '筊杯重叠，神明暗示'
  }
  return descriptionMap[result] || '神明自有安排'
}

// 动画循环 - 优化的渲染
const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  // 相机轻微摆动
  const time = Date.now() * 0.001
  camera.position.x = Math.sin(time * 0.5) * 0.5
  camera.position.z = 12 + Math.cos(time * 0.3) * 0.3
  camera.lookAt(0, 0, 0)
  
  renderer.render(scene, camera)
}

// 重置筊杯位置
const resetJiaoBei = () => {
  jiaoBeiMeshes.forEach((mesh, index) => {
    const pos = jiaoBeiPositions[index]
    const vel = jiaoBeiVelocities[index]
    const angVel = jiaoBeiAngularVelocities[index]
    const rot = jiaoBeiRotations[index]
    
    pos.set(index * 1.2 - 0.6, 3, 0)
    vel.set(0, 0, 0)
    angVel.set(0, 0, 0)
    rot.set(0, 0, 0)
    
    mesh.position.copy(pos)
    mesh.rotation.set(rot.x, rot.y, rot.z, 'XYZ')
  })
  
  isAnimating.value = false
  showResult.value = false
}

// 监听投掷状态
watch(() => props.isThrowing, (newValue) => {
  if (newValue) {
    resetJiaoBei()
  }
})

// 窗口大小变化处理函数
const handleResize = () => {
  if (!containerRef.value) return
  
  camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
}

// 生命周期
onMounted(async () => {
  await nextTick()
  initScene()
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  
  // 清理Three.js资源
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  if (renderer) {
    renderer.dispose()
  }
  
  if (containerRef.value && renderer) {
    containerRef.value.removeChild(renderer.domElement)
  }
})
</script>

<style scoped>
.jiaobei-3d-container {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.jiaobei-3d-container canvas {
  display: block;
  border-radius: 0.75rem;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style> 