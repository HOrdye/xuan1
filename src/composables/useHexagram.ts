/**
 * 六十四卦组合式API
 * 
 * 用于在Vue组件中方便地使用六十四卦数据和功能
 */

import { ref, computed, onMounted, watch, nextTick } from 'vue';
import hexagramService, { type Hexagram } from '../services/HexagramService';
import { useSystemStore } from '../store/system';

export function useHexagram() {
  // 加载状态
  const isLoading = ref(false);
  const isLoaded = ref(false);
  const loadError = ref<Error | null>(null);
  
  // 当前选中的卦象
  const currentHexagram = ref<Hexagram | null>(null);
  const currentHexagramCode = ref<string>('');
  
  // 系统状态
  const systemStore = useSystemStore();
  
  // 加载六十四卦数据
  const loadHexagramData = async () => {
    if (isLoaded.value || isLoading.value) return;
    
    isLoading.value = true;
    loadError.value = null;
    
    try {
      systemStore.setLoading(true, '正在加载六十四卦数据...');
      await hexagramService.loadHexagramData();
      
      const loadState = hexagramService.getLoadingState();
      isLoaded.value = loadState.isLoaded;
      
      if (loadState.error) {
        throw loadState.error;
      }
      
      systemStore.addNotification({
        type: 'success',
        title: '数据加载完成',
        message: '六十四卦数据已成功加载',
        duration: 3000,
      });
    } catch (error) {
      loadError.value = error as Error;
      systemStore.addError({
        message: `加载六十四卦数据失败: ${(error as Error).message}`,
        code: 'HEXAGRAM_LOAD_ERROR',
      });
    } finally {
      isLoading.value = false;
      systemStore.setLoading(false);
    }
  };
  
  // 获取所有卦象列表
  const hexagramList = computed(() => {
    return hexagramService.getHexagramList();
  });
  
  // 根据代码选择卦象
  const selectHexagramByCode = async (code: string) => {
    // 先清空当前卦象，确保即使选择相同卦象时也会触发更新
    currentHexagram.value = null;
    currentHexagramCode.value = '';
    
    // 等待下一次DOM更新后再设置新值
    await nextTick();
    
    // 获取新的卦象
    const hexagram = hexagramService.getHexagramByCode(code);
    
    // 如果找到卦象，创建一个新对象以确保引用变化
    if (hexagram) {
      currentHexagram.value = { ...hexagram };
      currentHexagramCode.value = code;
      
      // 记录日志
      console.log(`选择卦象: ${hexagram.name}（第${hexagram.sequence}卦）`);
    } else if (code) {
      console.warn(`未找到代码为 ${code} 的卦象`);
    }
    
    return hexagram;
  };
  
  // 根据序号选择卦象
  const selectHexagramBySequence = async (sequence: number) => {
    const hexagram = hexagramService.getHexagramBySequence(sequence);
    
    if (hexagram) {
      // 使用上面修改过的方法，确保组件重新渲染
      await selectHexagramByCode(hexagram.lines.join(''));
      return hexagram;
    } else {
      currentHexagram.value = null;
      currentHexagramCode.value = '';
      console.warn(`未找到序号为 ${sequence} 的卦象`);
      return null;
    }
  };
  
  // 根据名称搜索卦象
  const searchHexagrams = (name: string) => {
    return hexagramService.searchHexagramsByName(name);
  };
  
  // 根据条件过滤卦象
  const filterHexagrams = (filter: Partial<Hexagram>) => {
    return hexagramService.filterHexagrams(filter);
  };
  
  // 生成卦象图像
  const generateHexagramImage = (code?: string | number[]) => {
    try {
      if (!code && currentHexagram.value) {
        // 使用当前卦象的爻线
        return hexagramService.generateHexagramImage(currentHexagram.value.lines);
      } else if (code) {
        // 使用指定代码
        return hexagramService.generateHexagramImage(code);
      }
      return '';
    } catch (error) {
      console.error('生成卦象图像失败:', error);
      return '';
    }
  };
  
  // 从两个三爻生成完整的卦象
  const generateHexagramFromTrigramPair = async (upperTrigram: number[], lowerTrigram: number[]) => {
    if (upperTrigram.length !== 3 || lowerTrigram.length !== 3) {
      throw new Error('上下卦必须各包含3个爻');
    }
    
    const lines = [...lowerTrigram, ...upperTrigram];
    const code = lines.join('');
    return await selectHexagramByCode(code);
  };
  
  // 生成随机卦象
  const generateRandomHexagram = async () => {
    // 随机生成6个爻 (0或1)
    const lines = Array.from({ length: 6 }, () => Math.round(Math.random()));
    const code = lines.join('');
    return await selectHexagramByCode(code);
  };
  
  // 根据变化生成新卦象 (根据变爻)
  const generateChangedHexagram = async (originalCode: string, changingLines: number[]) => {
    if (originalCode.length !== 6) {
      throw new Error('无效的卦象代码');
    }
    
    const originalLines = originalCode.split('').map(Number);
    const newLines = [...originalLines];
    
    // 对变爻位置进行变化 (0变1, 1变0)
    changingLines.forEach(position => {
      if (position >= 0 && position < 6) {
        newLines[position] = 1 - newLines[position];
      }
    });
    
    const newCode = newLines.join('');
    const hexagram = hexagramService.getHexagramByCode(newCode);
    
    if (hexagram) {
      return await selectHexagramByCode(newCode);
    }
    
    return null;
  };
  
  // 在组件挂载时自动加载数据
  onMounted(() => {
    loadHexagramData();
  });
  
  // 监听当前卦象变化
  watch(currentHexagram, (newHexagram) => {
    if (newHexagram) {
      console.log(`当前卦象: ${newHexagram.name}`, newHexagram);
    }
  });
  
  // 返回组合式API
  return {
    // 状态
    isLoading,
    isLoaded,
    loadError,
    currentHexagram,
    currentHexagramCode,
    hexagramList,
    
    // 方法
    loadHexagramData,
    selectHexagramByCode,
    selectHexagramBySequence,
    searchHexagrams,
    filterHexagrams,
    generateHexagramImage,
    generateHexagramFromTrigramPair,
    generateRandomHexagram,
    generateChangedHexagram,
  };
} 