/**
 * 六十四卦数据
 * 包含每一卦的名称、符号、爻位、解释等信息
 */
import { Hexagram } from '../types';

// 完整的六十四卦数据
const hexagramsData: Hexagram[] = [
  {
    number: 1,
    sequence: 1,
    name: 'Qian (The Creative)',
    symbol: '䷀',
    lines: [1, 1, 1, 1, 1, 1],
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
    trigrams: { upper: 'Heaven', lower: 'Heaven' },
    chineseName: '乾',
    modernInterpretation: '乾卦代表纯阳、积极进取的品质。当前形势利于开创新局面，适合主动出击，但需注意量力而行，谨防过度自信。'
  },
  {
    number: 2,
    sequence: 2,
    name: 'Kun (The Receptive)',
    symbol: '䷁',
    lines: [0, 0, 0, 0, 0, 0],
    meaning: '坤为地，柔顺包容',
    judgment: '元亨，利牝马之贞。君子有攸往，先迷后得主。',
    yao_texts: [
      '履霜，坚冰至。',
      '直方大，不习无不利。',
      '含章可贞，或从王事，无成有终。',
      '括囊，无咎无誉。',
      '黄裳，元吉。',
      '龙战于野，其血玄黄。'
    ],
    trigrams: { upper: 'Earth', lower: 'Earth' },
    chineseName: '坤',
    modernInterpretation: '坤卦代表包容、适应的品质。当前形势需要顺势而为，保持耐心和韧性，静待时机成熟再行动。'
  },
  {
    number: 3,
    sequence: 3,
    name: 'Zhun (Difficulty at the Beginning)',
    symbol: '䷂',
    lines: [1, 0, 0, 0, 1, 0],
    meaning: '屯为雷雨，品难于起始',
    judgment: '元亨利贞。勿用有攸往，利建侯。',
    yao_texts: [
      '磐桓，利居贞，利建侯。',
      '屯如邅如，乘马班如。匪寇婚媾，女子贞不字，十年乃字。',
      '即鹿无虞，惟入于林中，君子几不如舍，往吝。',
      '乘马班如，求婚媾，往吉，无不利。',
      '屯其膏，小贞吉，大贞凶。',
      '乘马班如，泣血涟如。'
    ],
    trigrams: { upper: 'Water', lower: 'Thunder' },
    chineseName: '屯',
    modernInterpretation: '屯卦代表起始阶段的困难。新的开始总是艰难的，需要坚韧不拔、谨慎前行，适当寻求帮助才能度过难关。'
  },
  {
    number: 4,
    sequence: 4,
    name: 'Meng (Youthful Folly)',
    symbol: '䷃',
    lines: [0, 1, 0, 1, 0, 0],
    meaning: '山下出泉，蒙昧待启',
    judgment: '亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。',
    yao_texts: [
      '发蒙，利用刑人，用说桎梏，以往吝。',
      '包蒙吉。纳妇吉，子克家。',
      '勿用取女，见金夫，不有躬，无攸利。',
      '困蒙，吝。',
      '童蒙，吉。',
      '击蒙，不利为寇，利御寇。'
    ],
    trigrams: { upper: 'Mountain', lower: 'Water' },
    chineseName: '蒙',
    modernInterpretation: '蒙卦代表蒙昧、学习的阶段。当前需要开放心态学习新知识，寻求正确的指导和启蒙，避免固步自封。'
  },
  {
    number: 5,
    sequence: 5,
    name: 'Xu (Waiting)',
    symbol: '䷄',
    lines: [1, 1, 1, 0, 1, 0],
    meaning: '云上有水，需待时机',
    judgment: '有孚，光亨，贞吉。利涉大川。',
    yao_texts: [
      '需于郊，利用恒，无咎。',
      '需于沙，小有言，终吉。',
      '需于泥，致寇至。',
      '需于血，出自穴。',
      '需于酒食，贞吉。',
      '入于穴，有不速之客三人来，敬之终吉。'
    ],
    trigrams: { upper: 'Water', lower: 'Heaven' },
    chineseName: '需',
    modernInterpretation: '需卦代表等待和准备。当前形势需要耐心等待恰当的时机，同时积极做好准备，时机成熟时才能顺利行动。'
  },
  // 为了简化，这里只列出了前5个卦象，实际需要完整的64卦
  // 以下示例为第64卦，完整实现时需要填充6-63卦的数据
  {
    number: 64,
    sequence: 64,
    name: 'Wei Ji (Before Completion)',
    symbol: '䷿',
    lines: [0, 1, 0, 1, 0, 1],
    meaning: '火在水上，未济待渡',
    judgment: '亨，小狐汔济，濡其尾，无攸利。',
    yao_texts: [
      '濡其尾，吝。',
      '曳其轮，贞吉。',
      '未济，征凶，利涉大川。',
      '贞吉，悔亡，震用伐鬼方，三年有赏于大国。',
      '贞吉，无悔，君子之光，有孚，吉。',
      '有孚于饮酒，无咎，濡其首，有孚失是。'
    ],
    trigrams: { upper: 'Fire', lower: 'Water' },
    chineseName: '未济',
    modernInterpretation: '未济卦代表尚未完成的过渡阶段。当前任务已接近完成但仍有最后的障碍，需要谨慎处理最后的关键步骤，不可掉以轻心。'
  }
];

/**
 * 获取完整的六十四卦数据
 * 注意：这里仅包含了示例卦象，实际应用中需要完整的64卦数据
 */
export default hexagramsData;

/**
 * 通过卦序号获取卦象
 */
export function getHexagramByNumber(number: number): Hexagram | undefined {
  return hexagramsData.find(h => h.number === number);
}

/**
 * 通过卦名获取卦象
 */
export function getHexagramByName(name: string): Hexagram | undefined {
  return hexagramsData.find(h => h.name === name || h.chineseName === name);
}

/**
 * 通过爻组合获取卦象
 * @param lines 6个爻的组合，0表示阴爻，1表示阳爻
 */
export function getHexagramByLines(lines: number[]): Hexagram | undefined {
  return hexagramsData.find(h => 
    h.lines.length === lines.length && 
    h.lines.every((line, index) => line === lines[index])
  );
} 