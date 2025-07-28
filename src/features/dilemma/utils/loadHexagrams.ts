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
  overall: string; // 象辞
  yao_texts: string[];
  lines: number[]; // 六爻数组 [1,1,1,1,1,1] 等
  // 注意：原文件中的 binary_representation 字段在实际JSON中不存在，已移除
}

/**
 * 将二进制字符串转换为数字数组 (0表示阴爻，1表示阳爻)
 * @param binary 二进制字符串，如"101010"
 * @returns 数字数组，如[1, 0, 1, 0, 1, 0]
 */
function _binaryToLines(binary: string): number[] {
  return binary.split('').map(char => parseInt(char, 10));
}

/**
 * 加载完整的六十四卦数据
 * @returns 格式化后的64个卦象数据
 */
export async function loadAllHexagrams(): Promise<Hexagram[]> {
  try {
    console.log('开始加载卦象数据...');
    
    // 使用正确的路径加载JSON文件（考虑BASE_URL）
    const baseUrl = import.meta.env.BASE_URL || '/';
    const url = `${baseUrl}hexagrams.json`;
    console.log(`Loading hexagrams from URL: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`加载卦象数据HTTP错误: ${response.status} ${response.statusText}`);
      throw new Error(`加载卦象数据失败: HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`成功获取JSON数据，包含 ${Object.keys(data).length} 个卦象记录`);
    
    // 转换数据格式
    const hexagrams: Hexagram[] = [];
    
    // 遍历所有卦象键（数字键 "1", "2", "3" ... "64"）
    for (const [key, rawData] of Object.entries(data)) {
      try {
        // 解析原始数据
        const hexagramData = rawData as HexagramRawData;
        
        // 验证必要字段
        if (!hexagramData.sequence || !hexagramData.name || !hexagramData.lines) {
          console.warn(`跳过无效卦象数据: ${key}，缺少必要字段`);
          continue;
        }
        
        // 验证爻组合
        if (!Array.isArray(hexagramData.lines) || hexagramData.lines.length !== 6) {
          console.warn(`跳过无效卦象数据: ${key}，爻组合格式错误`);
          continue;
        }
        
        // 从爻组合确定上下卦
        const lowerTrigramLines = hexagramData.lines.slice(0, 3); // 下卦（下三爻）
        const upperTrigramLines = hexagramData.lines.slice(3, 6); // 上卦（上三爻）
        
        const lowerTrigram = determineTrigramName(lowerTrigramLines.join(''));
        const upperTrigram = determineTrigramName(upperTrigramLines.join(''));
        
      // 转换为内部格式
      hexagrams.push({
        number: hexagramData.sequence,
        sequence: hexagramData.sequence,
        name: hexagramData.name,
        chineseName: hexagramData.name,
        symbol: getHexagramSymbol(hexagramData.sequence),
        trigrams: {
          upper: upperTrigram,
          lower: lowerTrigram
        },
        lines: hexagramData.lines.map(line => line === 0 ? 0 : 1) as (0 | 1)[],
        meaning: hexagramData.description || `${hexagramData.name}卦`, // 使用 description 作为含义
        judgment: hexagramData.description || '', // 卦辞（使用description字段）
        image: hexagramData.overall || '', // 象辞（使用overall字段）
        tuan: '', // 彖辞（原数据中不存在）
        svg_path: `/static/hexagrams/${hexagramData.sequence}.svg`,
        yao_texts: hexagramData.yao_texts || [],
        modernInterpretation: `${hexagramData.name}卦的现代解读。${getModernInterpretation(hexagramData.name)}`,
        attribute: hexagramData.nature ? hexagramData.nature.split('上')[0] : hexagramData.name, // 从 nature 提取属性
        nature: hexagramData.nature || '',
        description: hexagramData.description || '',
        overall: hexagramData.description || '' // 使用 description 作为 overall
      });
        
        console.log(`✅ 成功解析卦象: ${hexagramData.sequence} - ${hexagramData.name}`);
        
      } catch (error) {
        console.error(`解析卦象 ${key} 时出错:`, error);
        continue;
      }
    }
    
    // 检查是否有64个卦象
    if (hexagrams.length < 64) {
      console.warn(`警告：只加载了 ${hexagrams.length} 个卦象，应该有64个`);
    } else {
      console.log(`✅ 成功转换 ${hexagrams.length} 个卦象数据`);
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
function _getEnglishName(chineseName: string): string {
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
      sequence: 1,
      name: 'Qian (The Creative)',
      chineseName: '乾',
      symbol: '䷀',
      trigrams: { upper: 'Heaven', lower: 'Heaven' },
      lines: [1, 1, 1, 1, 1, 1] as (0 | 1)[],
      meaning: '乾为天，刚健中正',
      judgment: '元亨利贞。君子自强不息。',
      yao_texts: [
        '潜龙勿用。',
        '见龙在田，利见大人。',
        '君子终日乾乾，夕惕若厉，无咎。',
        '或跃在渊，无咎。',
        '飞龙在天，利见大人。',
        '亢龙有悔。'
      ],
      svg_path: '/static/hexagrams/1.svg',
      modernInterpretation: '乾卦代表创造、力量和主动。当前形势利于开创新局面，适合主动出击，但需注意量力而行，谨防过度自信。',
      attribute: '刚健',
      tuan: '大哉乾元，万物资始，乃统天。云行雨施，品物流形。大明终始，六位时成。时乘六龙以御天。乾道变化，各正性命。保合大和，乃利贞。首出庶物，万国咸宁。',
      image: '天行健，君子以自强不息。'
    },
    {
      number: 2,
      sequence: 2,
      name: 'Kun (The Receptive)',
      chineseName: '坤',
      symbol: '䷁',
      trigrams: { upper: 'Earth', lower: 'Earth' },
      lines: [0, 0, 0, 0, 0, 0] as (0 | 1)[],
      meaning: '坤为地，柔顺包容',
      judgment: '元亨。利牝马之贞。君子有攸往，先迷后得主，利。西南得朋，东北丧朋。安贞吉。',
      yao_texts: [
        '履霜，坚冰至。',
        '直、方、大，不习无不利。',
        '含章可贞。或从王事，无成有终。',
        '括囊，无咎无誉。',
        '黄裳，元吉。',
        '龙战于野，其血玄黄。'
      ],
      svg_path: '/static/hexagrams/2.svg',
      modernInterpretation: '坤卦代表接受、包容和孕育。当前形势需要顺势而为，保持耐心和韧性，静待时机成熟再行动。',
      attribute: '柔顺',
      tuan: '至哉坤元，万物资生，乃顺承天。坤厚载物，德合无疆。含弘光大，品物咸亨。牝马地类，行地无疆，柔顺利贞。君子攸行，先迷失道，后顺得常。西南得朋，乃与类行；东北丧朋，乃终有庆。安贞之吉，应地无疆。',
      image: '地势坤，君子以厚德载物。'
    }
  ];
}
