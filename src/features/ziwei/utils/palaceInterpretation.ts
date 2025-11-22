/**
 * 紫微斗数宫位解读模板库
 * 提供200-300字的宫位解读内容
 */

import type { Palace, Star } from '../types';

/**
 * 命宫解读生成器
 * 根据命宫的主星、辅星、四化等信息生成200-300字的概述解读
 */
export function generateMingGongInterpretation(palace: Palace): string {
  if (!palace || palace.stars.length === 0) {
    return generateEmptyMingGongInterpretation();
  }

  const mainStars = palace.stars.filter(s => s.category === '主星');
  const auxiliaryStars = palace.stars.filter(s => s.category === '辅星');
  const hasSihua = palace.sihua && Object.keys(palace.sihua).length > 0;

  // 根据主星组合生成解读
  let interpretation = '';

  if (mainStars.length === 1) {
    // 单主星
    interpretation = generateSingleStarInterpretation(mainStars[0], auxiliaryStars, hasSihua);
  } else if (mainStars.length === 2) {
    // 双主星组合
    interpretation = generateDoubleStarInterpretation(mainStars[0], mainStars[1], auxiliaryStars, hasSihua);
  } else {
    // 多主星或特殊情况
    interpretation = generateMultipleStarInterpretation(mainStars, auxiliaryStars, hasSihua);
  }

  return interpretation;
}

/**
 * 空宫命宫解读
 */
function generateEmptyMingGongInterpretation(): string {
  return `命宫为空宫，这在紫微斗数中有着特殊的含义。空宫不代表空白，而是意味着你的性格特质更加灵活多变，容易受到对宫（迁移宫）的影响。

你天生具有适应力强的特点，能够根据环境变化调整自己的行为模式。这种特质让你在人际关系中游刃有余，但也可能让你缺乏明确的核心价值观。

建议你多关注迁移宫的星曜配置，它们会为你提供重要的性格补充。同时，通过后天的学习和修养，你可以塑造出独特的个人魅力。记住，空宫不是缺陷，而是一种需要主动塑造的天赋。`;
}

/**
 * 单主星解读
 */
function generateSingleStarInterpretation(
  mainStar: Star,
  auxiliaryStars: Star[],
  hasSihua: boolean
): string {
  const starName = mainStar.name;
  const personality = mainStar.personality.join('、');
  const description = mainStar.description || '';

  let interpretation = `命宫坐${starName}，${description}。你的性格特质主要体现在${personality}等方面。\n\n`;

  // 添加主星特质描述
  interpretation += `${starName}坐命的人，通常具有鲜明的个性特征。`;

  // 根据主星类型添加具体描述
  switch (mainStar.id) {
    case 'ziwei':
      interpretation += `你天生具有领导气质，喜欢掌控全局，在团队中往往扮演决策者的角色。你的格局宏大，不会满足于小成就，总是追求更高的目标。`;
      break;
    case 'tianji':
      interpretation += `你思维敏捷，善于分析和谋划，是典型的智慧型人才。你适应能力强，能够在变化中找到机会，但也需要注意不要过于善变。`;
      break;
    case 'taiyang':
      interpretation += `你性格光明磊落，热情开朗，像太阳一样温暖他人。你乐于助人，人缘很好，但也要注意不要过度消耗自己的能量。`;
      break;
    case 'wuqu':
      interpretation += `你执行力强，做事果断，是典型的行动派。你在理财方面有天赋，但也可能因为过于刚硬而缺乏灵活性。`;
      break;
    case 'tiantong':
      interpretation += `你性格温和，人缘极佳，是典型的和谐型人格。你享受生活，不喜欢冲突，但也可能因为过于随和而缺乏主见。`;
      break;
    case 'lianzhen':
      interpretation += `你原则性强，廉洁自律，是典型的道德型人格。你情感丰富，但也可能因为过于执着而显得固执。`;
      break;
    case 'tianfu':
      interpretation += `你稳重可靠，有管理才能，是典型的管家型人格。你注重细节，善于规划，但也可能因为过于谨慎而错失机会。`;
      break;
    case 'taiyin':
      interpretation += `你性格内敛，心思细腻，是典型的思考型人格。你注重精神享受，但也可能因为过于敏感而显得脆弱。`;
      break;
    case 'tanlang':
      interpretation += `你性格外向，行动力强，是典型的开拓型人格。你勇于冒险，但也可能因为过于冲动而缺乏规划。`;
      break;
    case 'jumen':
      interpretation += `你性格稳重，有责任感，是典型的守护型人格。你注重家庭，但也可能因为过于保守而缺乏创新。`;
      break;
    case 'pojun':
      interpretation += `你性格刚强，有突破力，是典型的变革型人格。你勇于改变，但也可能因为过于激进而显得不稳定。`;
      break;
    case 'qisha':
      interpretation += `你性格果断，有决断力，是典型的领导型人格。你敢于担当，但也可能因为过于强势而显得独断。`;
      break;
    case 'qixing':
      interpretation += `你性格多变，适应力强，是典型的灵活型人格。你善于应变，但也可能因为过于善变而缺乏稳定性。`;
      break;
    case 'piaoyang':
      interpretation += `你性格自由，不受约束，是典型的独立型人格。你追求自由，但也可能因为过于散漫而缺乏目标。`;
      break;
    default:
      interpretation += `你具有独特的性格特质，需要在生活中不断探索和完善自己。`;
  }

  // 添加辅星影响
  if (auxiliaryStars.length > 0) {
    interpretation += `\n\n命宫中还有${auxiliaryStars.map(s => s.name).join('、')}等星曜，`;
    if (auxiliaryStars.some(s => s.category === '吉星')) {
      interpretation += `这些吉星为你带来了额外的助力，增强了你的正面特质。`;
    } else if (auxiliaryStars.some(s => s.category === '煞星')) {
      interpretation += `这些星曜会带来一些挑战，但也可能激发你的潜能，让你在逆境中成长。`;
    } else {
      interpretation += `这些辅星会为你的性格增添不同的色彩，让你的人生更加丰富多彩。`;
    }
  }

  // 添加四化影响
  if (hasSihua) {
    interpretation += `\n\n命宫中的四化星曜会进一步影响你的性格表现，需要结合具体星曜来分析。`;
  }

  interpretation += `\n\n总的来说，你的命宫配置显示了你独特的性格特质和人生方向。了解这些特质，可以帮助你更好地发挥优势，同时注意规避可能的弱点。`;

  return interpretation;
}

/**
 * 双主星组合解读
 */
function generateDoubleStarInterpretation(
  star1: Star,
  star2: Star,
  auxiliaryStars: Star[],
  hasSihua: boolean
): string {
  const starNames = `${star1.name}${star2.name}`;
  const personality1 = star1.personality.join('、');
  const personality2 = star2.personality.join('、');

    let interpretation = `命宫坐${starNames}，这是一个非常特别的组合。${star1.name}和${star2.name}的相遇，会产生独特的化学反应。\n\n`;

    // 根据常见组合生成解读
    // 处理组合顺序（确保顺序一致，避免顺序问题）
    const sortedIds = [star1.id, star2.id].sort();
    const normalizedCombination = `${sortedIds[0]}-${sortedIds[1]}`;
    
    switch (normalizedCombination) {
    case 'ziwei-tianfu':
      interpretation += `紫微天府同宫，这是"紫府同宫"的格局，是紫微斗数中的上等格局。你天生具有帝王气质和管家才能，既有宏大的格局，又有细致的执行力。`;
      break;
    case 'tianji-taiyin':
      interpretation += `天机太阴同宫，这是"机月同梁"格局的一部分。你思维敏捷且心思细腻，既有智慧又有情感，是典型的智慧型人才。`;
      break;
    case 'taiyang-taiyin':
      interpretation += `太阳太阴同宫，这是"日月同宫"的格局。你既有太阳的光明热情，又有太阴的细腻内敛，性格丰富而平衡。`;
      break;
    case 'lianzhen-wuqu':
      interpretation += `武曲廉贞同宫，这是"武贪"格局的一部分。你既有武曲的执行力，又有廉贞的原则性，是典型的行动派。`;
      break;
    case 'tanlang-wuqu':
    case 'wuqu-tanlang':
      interpretation += `贪狼武曲同宫，这是"武贪"格局的经典组合。你既有贪狼的多才多艺和社交能力，又有武曲的执行力和理财天赋。这个组合让你在事业上既有开拓精神，又有执行能力，是典型的创业型人才。`;
      break;
    default:
      interpretation += `${star1.name}的${personality1}特质与${star2.name}的${personality2}特质相互融合，`;
      interpretation += `形成了独特的性格组合。你需要学会平衡这两种特质，让它们相互促进而不是相互冲突。`;
  }

  // 添加辅星和四化影响
  if (auxiliaryStars.length > 0) {
    interpretation += `\n\n命宫中的辅星${auxiliaryStars.map(s => s.name).join('、')}会为这个组合增添不同的色彩。`;
  }

  if (hasSihua) {
    interpretation += `四化星曜的影响会让这个组合的表现更加丰富多样。`;
  }

  interpretation += `\n\n这个组合显示了你性格的复杂性和丰富性。你需要深入了解这两种主星的特质，学会在不同场合发挥不同的优势。`;

  return interpretation;
}

/**
 * 多主星解读
 */
function generateMultipleStarInterpretation(
  mainStars: Star[],
  auxiliaryStars: Star[],
  hasSihua: boolean
): string {
  const starNames = mainStars.map(s => s.name).join('、');
  
  let interpretation = `命宫坐${starNames}等多颗主星，这是一个非常丰富的配置。\n\n`;
  
  interpretation += `多主星同宫意味着你的性格特质非常丰富，但也可能因为特质过多而显得复杂。`;
  interpretation += `你需要学会识别哪些特质是核心的，哪些是辅助的，这样才能更好地发挥自己的优势。\n\n`;
  
  interpretation += `这些主星的组合会产生复杂的相互作用，需要结合具体的星曜来分析。`;
  interpretation += `建议你深入了解每颗主星的特质，找到它们之间的平衡点。`;

  if (auxiliaryStars.length > 0) {
    interpretation += `\n\n命宫中的辅星${auxiliaryStars.map(s => s.name).join('、')}会进一步丰富你的性格表现。`;
  }

  return interpretation;
}

/**
 * 生成宫位基本解读（用于非命宫）
 */
export function generatePalaceBasicInterpretation(palace: Palace): string {
  const palaceName = palace.name;
  const description = palace.description || '';
  
  let interpretation = `${palaceName}${description}。\n\n`;

  if (palace.stars.length === 0) {
    interpretation += `${palaceName}为空宫，意味着这个领域需要你主动去发展和经营。`;
    interpretation += `空宫不代表不好，而是需要你通过后天的努力来填补这个领域的空白。`;
  } else {
    const mainStars = palace.stars.filter(s => s.category === '主星');
    const starNames = mainStars.map(s => s.name).join('、');
    
    interpretation += `${palaceName}坐${starNames}，`;
    
    // 根据宫位类型添加具体描述
    switch (palace.name) {
      case '兄弟宫':
        interpretation += `显示你在兄弟姐妹、朋友关系方面的特质。`;
        break;
      case '夫妻宫':
        interpretation += `显示你在感情、婚姻方面的特质和倾向。`;
        break;
      case '子女宫':
        interpretation += `显示你在子女、创作、娱乐方面的特质。`;
        break;
      case '财帛宫':
        interpretation += `显示你在财运、理财方面的能力和倾向。`;
        break;
      case '疾厄宫':
        interpretation += `显示你在健康、身体状况方面的信息。`;
        break;
      case '迁移宫':
        interpretation += `显示你在外出、发展方面的特质和机会。`;
        break;
      case '奴仆宫':
        interpretation += `显示你在下属、合作伙伴方面的关系。`;
        break;
      case '官禄宫':
        interpretation += `显示你在事业、工作方面的特质和发展方向。`;
        break;
      case '田宅宫':
        interpretation += `显示你在房产、家庭环境方面的信息。`;
        break;
      case '福德宫':
        interpretation += `显示你在精神享受、内心世界方面的特质。`;
        break;
      case '父母宫':
        interpretation += `显示你在父母关系、教育方面的信息。`;
        break;
      default:
        interpretation += `显示这个领域的特质和发展方向。`;
    }
  }

  return interpretation;
}

