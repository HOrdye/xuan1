import type { Hexagram } from '../features/dilemma/types';

// 模拟LLM响应延迟
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

// 卦象详细解释库
const HEXAGRAM_INTERPRETATIONS: Record<string, {
  essence: string;
  meaning: string[];
  advice: string[];
}> = {
  '乾': {
    essence: '刚健、创造、领导力',
    meaning: [
      '乾为天，象征着纯粹的阳刚之气和创造力。',
      '表示事物处于积极向上、充满活力的状态。',
      '代表一种坚强、自强不息的精神。'
    ],
    advice: [
      '保持刚毅坚定的态度，勇敢面对挑战。',
      '发挥自己的领导才能，但要避免过于强势。',
      '保持诚信正直，不断完善自我。'
    ]
  },
  '坤': {
    essence: '包容、顺从、承载',
    meaning: [
      '坤为地，象征着包容、顺从和承载万物的能力。',
      '表示事物处于稳定、厚重、宁静的状态。',
      '代表一种柔顺、包容、有耐心的品质。'
    ],
    advice: [
      '保持谦逊和耐心，静待时机成熟。',
      '顺应自然规律，不要强求改变。',
      '培养包容心和服务精神，广结善缘。'
    ]
  },
  '震': {
    essence: '行动、震动、启发',
    meaning: [
      '震为雷，象征着强烈的动力和突破性的行动。',
      '表示事物处于变动、活跃、惊醒的状态。',
      '代表一种新生、觉醒、振奋的力量。'
    ],
    advice: [
      '积极行动，把握机会，不要犹豫不决。',
      '保持警觉，准备应对突发变化。',
      '勇于突破旧有的思维模式，寻找创新的解决方案。'
    ]
  },
  '艮': {
    essence: '停止、限制、稳定',
    meaning: [
      '艮为山，象征着稳固、限制和停止。',
      '表示事物需要止步不前、保持现状的状态。',
      '代表一种坚定、自我控制、谨慎的品质。'
    ],
    advice: [
      '适当休息，不要过度追求进展。',
      '加强自我约束，避免冲动决策。',
      '明确边界，专注于已有的目标和责任。'
    ]
  },
  '坎': {
    essence: '危险、困难、智慧',
    meaning: [
      '坎为水，象征着危险、陷阱和深邃。',
      '表示事物处于困难、挑战、需要智慧应对的状态。',
      '代表一种深刻、敏锐、富有洞察力的品质。'
    ],
    advice: [
      '谨慎前行，认清潜在的风险和陷阱。',
      '培养内在的智慧和洞察力，以应对困境。',
      '保持内心的诚信和坚定，困境中仍不失正道。'
    ]
  },
  '离': {
    essence: '光明、优雅、附着',
    meaning: [
      '离为火，象征着光明、美丽和依附。',
      '表示事物处于明朗、清晰、光辉的状态。',
      '代表一种聪明、优雅、有吸引力的品质。'
    ],
    advice: [
      '保持清晰的判断力，不被表象迷惑。',
      '培养内在的智慧，平衡感性和理性。',
      '注意言行举止的优雅得体，提升个人魅力。'
    ]
  },
  '兑': {
    essence: '喜悦、满足、交流',
    meaning: [
      '兑为泽，象征着喜悦、愉快和交流。',
      '表示事物处于欢乐、满足、交际的状态。',
      '代表一种开朗、乐观、善于表达的品质。'
    ],
    advice: [
      '保持开朗乐观的心态，享受当下的快乐。',
      '加强与他人的沟通和交流，分享自己的喜悦。',
      '学会适当表达自己的情感，但避免过度放纵。'
    ]
  },
  '巽': {
    essence: '柔顺、渗透、谦逊',
    meaning: [
      '巽为风，象征着柔和、渗透和谦逊。',
      '表示事物处于温和、灵活、适应性强的状态。',
      '代表一种随和、谦虚、善于适应的品质。'
    ],
    advice: [
      '保持谦逊和顺从，不要过于强势。',
      '灵活应对变化，提高适应能力。',
      '善于倾听他人意见，寻求共识和合作。'
    ]
  },
  '鼎': {
    essence: '变革、更新、大器',
    meaning: [
      '鼎象征着变革和巨大的转变。',
      '表示处于一个重要的转折点，需要重新调整和安排。',
      '代表着积累和蓄势待发，有大事即将成就。'
    ],
    advice: [
      '认真审视自己的处境，准备迎接重大变革。',
      '保持开放的心态，接纳新的可能性。',
      '建立坚实的基础，为长期发展做准备。'
    ]
  },
  '解': {
    essence: '释放、解脱、化解',
    meaning: [
      '解卦象征着摆脱困境、获得释放。',
      '表示阻碍正在消除，困难将被克服。',
      '代表一种从压力和束缚中解脱出来的状态。'
    ],
    advice: [
      '保持耐心，困难正在逐渐解决。',
      '积极寻找突破口，不要被表面困难吓倒。',
      '适时放下包袱，轻装前行。'
    ]
  }
  // 可以继续添加更多卦象的解释
};

// 变爻影响的详细解释
const CHANGING_LINE_MEANINGS: Record<number, Record<string, string[]>> = {
  0: { // 初爻
    'general': [
      '初爻变化表示事情处于起始阶段的变动。',
      '基础正在发生改变，可能需要重新审视根本问题。',
      '最初的想法或计划可能需要调整。'
    ],
    '乾': ['刚刚开始行动，需谨慎前行，不可贸然。', '内心的动机和初衷需要保持纯正。'],
    '坤': ['基础尚未稳固，需先打好根基再前进。', '内在品质的培养比外在表现更重要。'],
    '震': ['初始的冲击力要用在正确的方向。', '新的行动方案需要谨慎评估。'],
    '艮': ['及时止步，避免重蹈覆辙。', '退一步思考，找到更好的起点。']
  },
  1: { // 二爻
    'general': [
      '二爻变化关乎内在态度和个人品质的转变。',
      '内心的想法或态度需要调整。',
      '与自己的关系和自我认知正在改变。'
    ],
    '乾': ['内在力量在积累，暂时需要蛰伏。', '不要急于表现，先充实自己。'],
    '坤': ['柔顺中见刚强，和谐中有坚持。', '在服从中保持自己的原则。'],
    '震': ['内心的震动比外在的行动更重要。', '思想的转变先于行为的改变。'],
    '坎': ['面对内心的恐惧，找到勇气前行。', '水深而清，保持内心的澄明。']
  },
  // 其他爻位的解释可以继续添加
};

/**
 * 生成卦象解读的模拟LLM服务
 * 在实际项目中，这里应该调用真实的LLM API（如OpenAI、通义千问等）
 */
export class LLMService {
  /**
   * 获取卦象解读
   * @param hexagram 主卦
   * @param changingLines 变爻位置
   * @param relatedHexagram 变卦
   * @param question 用户问题
   * @returns 解读内容
   */
  static async getHexagramInterpretation(
    hexagram: Hexagram,
    changingLines: number[] = [],
    relatedHexagram: Hexagram | null = null,
    question: string = ''
  ): Promise<string> {
    // 模拟API调用延迟
    await simulateDelay();
    
    // 构建LLM响应（实际项目中这里应该调用真实API）
    let interpretation = '';
    
    // 获取卦象基本信息
    const hexagramInfo = `《${hexagram.chineseName || hexagram.name}》卦`;
    const chineseName = hexagram.chineseName || '';
    
    // 查找详细解释库中是否有该卦的专门解释
    const detailedInterpretation = Object.keys(HEXAGRAM_INTERPRETATIONS).find(key => 
      chineseName.includes(key)
    );
    
    // 根据不同情况生成不同的解读
    if (question) {
      interpretation += `关于"${question}"的问题，${hexagramInfo}给出的启示是：\n\n`;
    } else {
      interpretation += `${hexagramInfo}的解读：\n\n`;
    }
    
    // 卦象主体解读 - 使用更详细的解释
    interpretation += `${hexagram.name}卦代表"${hexagram.modernInterpretation || hexagram.judgment || hexagram.meaning || '变化'}"。`;
    
    // 如果有详细解释库中的内容，使用它
    if (detailedInterpretation) {
      const details = HEXAGRAM_INTERPRETATIONS[detailedInterpretation];
      interpretation += `\n\n此卦的核心精神是：${details.essence}。`;
      interpretation += `\n\n卦象含义：`;
      details.meaning.forEach(m => interpretation += `\n• ${m}`);
    } else {
      // 否则使用通用解释
      interpretation += `\n\n这个卦象提示你当前的情况处于${hexagram.nature || '变化'}状态，需要${hexagram.element || '平衡阴阳'}。`;
      
      // 根据卦象特性添加一些解释
      if (chineseName.includes('乾') || chineseName.includes('坤')) {
        interpretation += '\n\n此卦为易经六十四卦之首，代表着阴阳之根本。体现了天地万物的基本法则，建议你回归本质，把握核心原则。';
      } else if (chineseName.includes('离') || chineseName.includes('坎')) {
        interpretation += '\n\n此卦代表离火坎水，象征着明暗对立、相互转化。暗示你目前处于一个需要智慧抉择的关键时刻，需要平衡内外、主客观因素。';
      }
    }
    
    // 根据卦象组合特点进行解读
    const upperTrigram = hexagram.trigrams?.upper;
    const lowerTrigram = hexagram.trigrams?.lower;
    
    if (upperTrigram && lowerTrigram) {
      interpretation += `\n\n此卦由${lowerTrigram}在下，${upperTrigram}在上组成，`;
      
      // 根据不同的上下卦组合给出针对性解释
      if (lowerTrigram.includes('震') && upperTrigram.includes('艮')) {
        interpretation += '表示行动受到限制，进退维谷的状态。建议审时度势，适时止步。';
      } else if (lowerTrigram.includes('坎') && upperTrigram.includes('离')) {
        interpretation += '表示内险外明，虽有困难但能看到希望。建议内心保持警觉，同时把握外在机会。';
      } else if (lowerTrigram.includes('艮') && upperTrigram.includes('兑')) {
        interpretation += '表示内敛外现，有节制的表达。建议保持内在的稳定，适度表达情感和想法。';
      } else {
        interpretation += `反映了${lowerTrigram}的品质如何影响${upperTrigram}的表现，需要协调两者关系。`;
      }
    }
    
    // 如果有变爻，增加变爻解读
    if (changingLines.length > 0 && relatedHexagram) {
      interpretation += `\n\n【变化分析】\n你的卦象有${changingLines.length}个变爻，从${hexagram.chineseName || hexagram.name}卦变为${relatedHexagram.chineseName || relatedHexagram.name}卦，`;
      interpretation += `这表明当前局势正在发生转变，最终会从${hexagram.nature || '当前状态'}转向${relatedHexagram.nature || '新的状态'}。`;
      
      changingLines.forEach(lineIndex => {
        // 爻位名称
        const linePositions = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
        const lineName = linePositions[lineIndex] || `第${lineIndex+1}爻`;
        
        interpretation += `\n\n${lineName}的变化意义：`;
        
        // 查找是否有针对该卦象和爻位的特殊解释
        let specificLineExplanation = '';
        if (CHANGING_LINE_MEANINGS[lineIndex]) {
          const lineDetails = CHANGING_LINE_MEANINGS[lineIndex];
          
          // 检查是否有针对该卦象的特殊解释
          for (const key of Object.keys(lineDetails)) {
            if (key !== 'general' && chineseName.includes(key)) {
              specificLineExplanation = lineDetails[key].join(' ');
              break;
            }
          }
          
          // 如果没有找到特定卦象的解释，使用通用解释
          if (!specificLineExplanation && lineDetails['general']) {
            specificLineExplanation = lineDetails['general'][0];
          }
        }
        
        // 如果找到了特殊解释，使用它
        if (specificLineExplanation) {
          interpretation += specificLineExplanation;
        } else {
          // 否则使用默认解释
          switch (lineIndex) {
            case 0: // 初爻
              interpretation += '基础正在改变，需要调整起点或重新审视根本问题。';
              break;
            case 1: // 二爻
              interpretation += '内在的想法或态度需要调整，可能需要重新思考自己的立场。';
              break;
            case 2: // 三爻
              interpretation += '行动方式需要改变，之前的做法可能需要调整，寻找更有效的途径。';
              break;
            case 3: // 四爻
              interpretation += '外部环境或他人的态度正在变化，需要重新评估形势，适应新的环境。';
              break;
            case 4: // 五爻
              interpretation += '领导方式或核心策略需要调整，可能需要重新思考目标和方向。';
              break;
            case 5: // 上爻
              interpretation += '事情正接近尾声或新的开始，需要为下一阶段做好准备，总结经验教训。';
              break;
          }
        }
      });
    }
    
    // 具体建议
    interpretation += '\n\n【具体建议】\n';
    
    // 如果有详细解释库中的内容，使用它的建议
    if (detailedInterpretation) {
      const details = HEXAGRAM_INTERPRETATIONS[detailedInterpretation];
      details.advice.forEach((advice, index) => {
        interpretation += `${index + 1}. ${advice}\n`;
      });
    } else {
      // 否则使用通用建议
      interpretation += '1. 保持内心平静，客观分析当前局势\n';
      interpretation += '2. 顺应卦象指引，不要违背自然规律\n';
      
      // 根据问题给出更具体的建议
      if (question) {
        // 分析问题类型并给出相应建议
        if (question.includes('工作') || question.includes('事业') || question.includes('职业')) {
          interpretation += '3. 职业方面，建议你' + (Math.random() > 0.5 ? 
            '注重长期发展，打好基础，不要急于求成' : 
            '把握当前机会，展现自己的才能和价值') + '\n';
        } else if (question.includes('感情') || question.includes('爱情') || question.includes('婚姻')) {
          interpretation += '3. 感情方面，建议你' + (Math.random() > 0.5 ? 
            '保持真诚沟通，理解彼此的需求和期望' : 
            '给对方和自己适当的空间，让关系自然发展') + '\n';
        } else if (question.includes('健康') || question.includes('身体')) {
          interpretation += '3. 健康方面，建议你保持规律作息，注意身心平衡，适当放松\n';
        } else {
          interpretation += `3. 关于"${question}"，建议你${Math.random() > 0.5 ? 
            '稍作等待，收集更多信息后再决定' : 
            '按照自己的直觉行动，但要做好充分准备'}\n`;
        }
      } else {
        interpretation += '3. 综合考虑各方面因素，做出平衡的决策\n';
      }
    }
    
    // 添加针对问题的总结性建议
    if (question) {
      interpretation += `\n最后，对于"${question}"，${hexagramInfo}的最终指引是：`;
      
      if (changingLines.length > 0 && relatedHexagram) {
        interpretation += `当前情况处于变化之中，从${hexagram.name || ''}到${relatedHexagram.name || ''}的转变提示你需要适应这个过程。`;
        interpretation += `建议在变化中保持定力，既要尊重当前的${hexagram.name || ''}卦所代表的局面，又要为${relatedHexagram.name || ''}卦所示的未来做好准备。`;
      } else {
        interpretation += `遵循${hexagram.name || ''}卦的指引，${
          detailedInterpretation ? 
          HEXAGRAM_INTERPRETATIONS[detailedInterpretation].essence :
          '保持平衡与耐心'
        }，最终能够找到适合你的答案。`;
      }
    }
    
    return interpretation;
  }
} 