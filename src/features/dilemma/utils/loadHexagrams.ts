/**
 * 加载完整的六十四卦数据
 * 将JSON数据转换为应用内部使用的格式
 */
import { Hexagram } from '../types';

// 卦象数据接口
interface HexagramRawData {
  name: string;
  sequence: number;
  nature: string;
  element: string;
  description: string;
  overall: string;
  yao_texts: string[];
  lines?: number[]; // 确保lines字段存在
}

/**
 * 将二进制字符串转换为数字数组 (0表示阴爻，1表示阳爻)
 * @param binary 二进制字符串，如"101010"
 * @returns 数字数组，如[1, 0, 1, 0, 1, 0]
 */
function binaryToLines(binary: string): number[] {
  return binary.split('').map(char => parseInt(char, 10));
}

/**
 * 加载完整的六十四卦数据
 * @returns 格式化后的64个卦象数据
 */
export async function loadAllHexagrams(): Promise<Hexagram[]> {
  try {
    console.log('开始加载卦象数据...');
    
    // 尝试导入外部JSON文件
    const response = await fetch('/hexagrams.json');
    if (!response.ok) {
      console.error(`加载卦象数据HTTP错误: ${response.status} ${response.statusText}`);
      throw new Error(`加载卦象数据失败: HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`成功获取JSON数据，包含 ${Object.keys(data).length} 个卦象记录`);
    
    // 转换数据格式
    const hexagrams: Hexagram[] = [];
    
    // 遍历所有卦象键（二进制表示）
    for (const [binary, rawData] of Object.entries(data)) {
      // 提取二进制码（移除可能的后缀，如"110110_10"中的"_10"）
      const cleanBinary = binary.split('_')[0];
      if (cleanBinary.length !== 6) {
        console.warn(`跳过无效卦象格式: ${binary}`);
        continue;
      }
      
      // 解析原始数据
      const hexagramData = rawData as HexagramRawData;
      
      // 确定上下卦
      const upperTrigram = determineTrigramName(cleanBinary.slice(0, 3));
      const lowerTrigram = determineTrigramName(cleanBinary.slice(3, 6));
      
      // 使用hexagramData中的lines字段或从二进制生成
      const lines = hexagramData.lines || binaryToLines(cleanBinary);
      
      // 转换为内部格式
      hexagrams.push({
        number: hexagramData.sequence,
        name: hexagramData.name,
        chineseName: hexagramData.name,
        symbol: getHexagramSymbol(hexagramData.sequence),
        upperTrigram,
        lowerTrigram,
        lines,
        meaning: hexagramData.overall,
        judgment: hexagramData.description,
        image: `${hexagramData.nature}卦象`,
        lines_meaning: hexagramData.yao_texts,
        modernInterpretation: `${hexagramData.name}卦代表"${hexagramData.overall}"，${getModernInterpretation(hexagramData.name)}`,
        attribute: hexagramData.overall.split('，')[0],
        element: hexagramData.element
      });
    }
    
    // 检查是否有64个卦象
    if (hexagrams.length < 64) {
      console.warn(`警告：只加载了 ${hexagrams.length} 个卦象，应该有64个`);
    } else {
      console.log(`成功转换 ${hexagrams.length} 个卦象数据`);
    }
    
    // 按序号排序
    return hexagrams.sort((a, b) => a.number - b.number);
  } catch (error) {
    console.error('加载六十四卦数据失败:', error);
    // 返回基础数据，供应用继续运行
    console.log('使用基础数据作为备用...');
    return getBasicHexagrams();
  }
}

/**
 * 根据三爻确定八卦名称
 * @param binary 三位二进制字符串，如"101"
 * @returns 卦名，如"离"
 */
function determineTrigramName(binary: string): string {
  const trigramMap: {[key: string]: string} = {
    '111': 'Heaven', // 乾
    '110': 'Lake',   // 兑
    '101': 'Fire',   // 离
    '100': 'Thunder', // 震
    '011': 'Wind',   // 巽
    '010': 'Water',  // 坎
    '001': 'Mountain', // 艮
    '000': 'Earth'   // 坤
  };
  
  return trigramMap[binary] || 'Unknown';
}

/**
 * 获取卦象的Unicode符号
 * @param sequence 卦象序号（1-64）
 * @returns Unicode符号
 */
function getHexagramSymbol(sequence: number): string {
  // Unicode中六十四卦符号的起始码位是4DC0
  const baseCodePoint = 0x4DC0;
  const index = sequence - 1; // 序号从1开始，但索引从0开始
  return String.fromCodePoint(baseCodePoint + index);
}

/**
 * 获取卦象的英文名称
 * @param chineseName 中文卦名
 * @returns 英文名称
 */
function getEnglishName(chineseName: string): string {
  const nameMap: {[key: string]: string} = {
    '乾': 'The Creative',
    '坤': 'The Receptive',
    '屯': 'Difficulty at the Beginning',
    '蒙': 'Youthful Folly',
    '需': 'Waiting',
    '讼': 'Conflict',
    '师': 'The Army',
    '比': 'Holding Together',
    '小畜': 'Small Accumulates',
    '履': 'Treading',
    '泰': 'Peace',
    '否': 'Standstill',
    '同人': 'Fellowship',
    '大有': 'Great Possession',
    '谦': 'Modesty',
    '豫': 'Enthusiasm',
    '随': 'Following',
    '蛊': 'Work on the Decayed',
    '临': 'Approach',
    '观': 'Contemplation',
    '噬嗑': 'Biting Through',
    '贲': 'Grace',
    '剥': 'Splitting Apart',
    '复': 'Return',
    '无妄': 'Innocence',
    '大畜': 'Great Accumulates',
    '颐': 'Nourishment',
    '大过': 'Great Exceeding',
    '坎': 'The Abysmal Water',
    '离': 'The Clinging Fire',
    '咸': 'Influence',
    '恒': 'Duration',
    '遁': 'Retreat',
    '大壮': 'Great Power',
    '晋': 'Progress',
    '明夷': 'Darkening of the Light',
    '家人': 'The Family',
    '睽': 'Opposition',
    '蹇': 'Obstruction',
    '解': 'Deliverance',
    '损': 'Decrease',
    '益': 'Increase',
    '夬': 'Breakthrough',
    '姤': 'Coming to Meet',
    '萃': 'Gathering Together',
    '升': 'Pushing Upward',
    '困': 'Oppression',
    '井': 'The Well',
    '革': 'Revolution',
    '鼎': 'The Cauldron',
    '震': 'The Arousing Thunder',
    '艮': 'Keeping Still Mountain',
    '渐': 'Development',
    '归妹': 'The Marrying Maiden',
    '丰': 'Abundance',
    '旅': 'The Wanderer',
    '巽': 'The Gentle Wind',
    '兑': 'The Joyous Lake',
    '涣': 'Dispersion',
    '节': 'Limitation',
    '中孚': 'Inner Truth',
    '小过': 'Small Exceeding',
    '既济': 'After Completion',
    '未济': 'Before Completion'
  };
  
  return nameMap[chineseName] || 'Unknown';
}

/**
 * 获取卦象的现代解读
 * @param chineseName 中文卦名
 * @returns 现代解读文本
 */
function getModernInterpretation(chineseName: string): string {
  // 这里可以根据需要扩展更多卦象的现代解读
  const interpretations: {[key: string]: string} = {
    '乾': '当前形势利于开创新局面，适合主动出击，但需注意量力而行，谨防过度自信。',
    '坤': '当前形势需要顺势而为，保持耐心和韧性，静待时机成熟再行动。',
    '屯': '新的开始总是艰难的，需要坚韧不拔、谨慎前行，适当寻求帮助才能度过难关。',
    '蒙': '当前需要开放心态学习新知识，寻求正确的指导和启蒙，避免固步自封。',
    '需': '当前形势需要耐心等待恰当的时机，同时积极做好准备，时机成熟时才能顺利行动。',
    '讼': '面临冲突时需要理性处理，不可意气用事，适时妥协可能更有利于长远发展。',
    '未济': '当前任务已接近完成但仍有最后的障碍，需要谨慎处理最后的关键步骤，不可掉以轻心。'
  };
  
  return interpretations[chineseName] || 
         '当前阶段需要根据卦象特质行事，保持谨慎乐观的态度，顺应形势发展。';
}

/**
 * 获取基础卦象数据（作为加载失败时的备用）
 * @returns 基础卦象数据（仅包含少量必要卦象）
 */
function getBasicHexagrams(): Hexagram[] {
  return [
    {
      number: 1,
      name: 'Qian (The Creative)',
      chineseName: '乾',
      symbol: '䷀',
      upperTrigram: 'Heaven',
      lowerTrigram: 'Heaven',
      lines: [1, 1, 1, 1, 1, 1],
      meaning: '乾为天，刚健中正',
      judgment: '元亨利贞。君子自强不息。',
      image: '天行健，君子以自强不息。',
      lines_meaning: [
        '潜龙勿用。',
        '见龙在田，利见大人。',
        '君子终日乾乾，夕惕若厉，无咎。',
        '或跃在渊，无咎。',
        '飞龙在天，利见大人。',
        '亢龙有悔。'
      ],
      modernInterpretation: '乾卦代表纯阳、积极进取的品质。当前形势利于开创新局面，适合主动出击，但需注意量力而行，谨防过度自信。'
    },
    {
      number: 2,
      name: 'Kun (The Receptive)',
      chineseName: '坤',
      symbol: '䷁',
      upperTrigram: 'Earth',
      lowerTrigram: 'Earth',
      lines: [0, 0, 0, 0, 0, 0],
      meaning: '坤为地，柔顺包容',
      judgment: '元亨，利牝马之贞。君子有攸往，先迷后得主。',
      image: '地势坤，君子以厚德载物。',
      lines_meaning: [
        '履霜，坚冰至。',
        '直方大，不习无不利。',
        '含章可贞，或从王事，无成有终。',
        '括囊，无咎无誉。',
        '黄裳，元吉。',
        '龙战于野，其血玄黄。'
      ],
      modernInterpretation: '坤卦代表包容、适应的品质。当前形势需要顺势而为，保持耐心和韧性，静待时机成熟再行动。'
    },
    {
      number: 64,
      name: 'Wei Ji (Before Completion)',
      chineseName: '未济',
      symbol: '䷿',
      upperTrigram: 'Fire',
      lowerTrigram: 'Water',
      lines: [0, 1, 0, 1, 0, 1],
      meaning: '火在水上，未济待渡',
      judgment: '亨，小狐汔济，濡其尾，无攸利。',
      image: '火在水上，未济；君子以慎辨物居方。',
      lines_meaning: [
        '濡其尾，吝。',
        '曳其轮，贞吉。',
        '未济，征凶，利涉大川。',
        '贞吉，悔亡，震用伐鬼方，三年有赏于大国。',
        '贞吉，无悔，君子之光，有孚，吉。',
        '有孚于饮酒，无咎，濡其首，有孚失是。'
      ],
      modernInterpretation: '未济卦代表尚未完成的过渡阶段。当前任务已接近完成但仍有最后的障碍，需要谨慎处理最后的关键步骤，不可掉以轻心。'
    }
  ];
} 