/**
 * 六十四卦数据服务
 * 
 * 负责六十四卦数据的加载、查询和处理
 */

import { ref, reactive } from 'vue';

// 卦象数据接口
export interface Hexagram {
  name: string;            // 卦名
  sequence: number;        // 序号
  nature: string;          // 卦性质
  description: string;     // 卦辞
  tuan_text: string;       // 彖辞 
  xiang_text: string;      // 象辞
  overall: string;         // 整体解读
  yao_texts: string[];     // 爻辞
  lines: number[];         // 爻线数组 (0表示阴爻，1表示阳爻)
}

// 卦象数据类型
export type HexagramData = Record<string, Hexagram>;

// 单例服务类
export class HexagramService {
  private static instance: HexagramService;
  private hexagramData = reactive<HexagramData>({});
  private isLoaded = ref(false);
  private isLoading = ref(false);
  private loadError = ref<Error | null>(null);
  
  // 私有构造函数
  private constructor() {}
  
  // 获取实例
  public static getInstance(): HexagramService {
    if (!HexagramService.instance) {
      HexagramService.instance = new HexagramService();
    }
    return HexagramService.instance;
  }
  
  // 加载卦象数据
  public async loadHexagramData(): Promise<void> {
    // 如果已加载或正在加载，则返回
    if (this.isLoaded.value || this.isLoading.value) return;
    
    this.isLoading.value = true;
    this.loadError.value = null;
    
    try {
      // 从公共目录加载数据
      const response = await fetch('/hexagrams.json');
      
      if (!response.ok) {
        throw new Error(`加载六十四卦数据失败: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // 清空现有数据
      Object.keys(this.hexagramData).forEach(key => {
        delete this.hexagramData[key];
      });
      
      // 添加新数据
      Object.entries(data).forEach(([key, value]) => {
        this.hexagramData[key] = value as Hexagram;
      });
      
      this.isLoaded.value = true;
      console.log('六十四卦数据加载完成');
    } catch (error) {
      this.loadError.value = error as Error;
      console.error('加载六十四卦数据错误:', error);
    } finally {
      this.isLoading.value = false;
    }
  }
  
  // 获取所有卦象数据
  public getAllHexagrams(): HexagramData {
    return this.hexagramData;
  }
  
  // 获取卦象列表
  public getHexagramList(): Hexagram[] {
    return Object.values(this.hexagramData).sort((a, b) => a.sequence - b.sequence);
  }
  
  // 根据二进制码获取卦象
  public getHexagramByCode(code: string): Hexagram | undefined {
    return this.hexagramData[code];
  }
  
  // 根据名称搜索卦象
  public searchHexagramsByName(name: string): Hexagram[] {
    const searchTerm = name.toLowerCase().trim();
    return Object.values(this.hexagramData).filter(hexagram => 
      hexagram.name.toLowerCase().includes(searchTerm)
    );
  }
  
  // 根据序号获取卦象
  public getHexagramBySequence(sequence: number): Hexagram | undefined {
    return Object.values(this.hexagramData).find(hexagram => hexagram.sequence === sequence);
  }
  
  // 根据爻线数组获取卦象
  public getHexagramByLines(lines: number[]): Hexagram | undefined {
    if (lines.length !== 6) return undefined;
    
    const code = lines.join('');
    return this.getHexagramByCode(code);
  }
  
  // 根据特定条件过滤卦象
  public filterHexagrams(filter: Partial<Hexagram>): Hexagram[] {
    return Object.values(this.hexagramData).filter(hexagram => {
      // 检查每个过滤条件
      return Object.entries(filter).every(([key, value]) => {
        if (key === 'lines') {
          // 对于爻线数组，需要特殊处理
          return JSON.stringify(hexagram.lines) === JSON.stringify(value);
        }
        return hexagram[key as keyof Hexagram] === value;
      });
    });
  }
  
  // 获取加载状态
  public getLoadingState() {
    return {
      isLoaded: this.isLoaded.value,
      isLoading: this.isLoading.value,
      error: this.loadError.value,
    };
  }
  
  // 生成卦象图像数据
  public generateHexagramImage(code: string | number[]): string {
    // 确保传入的是标准格式
    const lines = Array.isArray(code) ? code : code.split('').map(Number);
    
    if (lines.length !== 6) {
      throw new Error('生成卦象图像失败: 无效的卦象数据');
    }
    
    // 创建SVG字符串
    const svgWidth = 64;
    const svgHeight = 84;
    const lineHeight = 8;
    const lineGap = 6;
    const lineWidthLong = 50;
    const lineWidthShort = 22;
    
    let svg = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
    
    // 绘制每一爻
    for (let i = 0; i < 6; i++) {
      const y = svgHeight - (i + 1) * (lineHeight + lineGap) + lineGap / 2;
      
      if (lines[i] === 1) {
        // 阳爻 (实线)
        svg += `<rect x="${(svgWidth - lineWidthLong) / 2}" y="${y}" width="${lineWidthLong}" height="${lineHeight}" fill="currentColor" />`;
      } else {
        // 阴爻 (两条短线)
        svg += `<rect x="${(svgWidth - lineWidthLong) / 2}" y="${y}" width="${lineWidthShort}" height="${lineHeight}" fill="currentColor" />`;
        svg += `<rect x="${(svgWidth + lineWidthLong) / 2 - lineWidthShort}" y="${y}" width="${lineWidthShort}" height="${lineHeight}" fill="currentColor" />`;
      }
    }
    
    svg += '</svg>';
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
}

// 导出单例实例
export default HexagramService.getInstance(); 