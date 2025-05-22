export interface TarotCard {
  id: number;
  name: string;
  symbol: string;
  meaning: string;
  description: string;
  reversed?: string;
}

export const tarotCards: TarotCard[] = [
  {
    id: 1,
    name: "愚者",
    symbol: "🃏",
    meaning: "新的开始，冒险，天真",
    description: "代表着纯真、冒险和无畏的开始。暗示你可能正处于人生的一个新阶段，准备踏上一段未知的旅程。",
    reversed: "鲁莽，冲动，缺乏计划"
  },
  {
    id: 2,
    name: "魔术师",
    symbol: "🪄",
    meaning: "创造力，技能，专注",
    description: "象征着创造力、意志力和表现能力。你有能力将想法转化为现实，通过你的才能和技能来实现目标。",
    reversed: "欺骗，资源浪费，才能误用"
  },
  {
    id: 3,
    name: "女祭司",
    symbol: "🔮",
    meaning: "直觉，内在智慧，神秘",
    description: "代表着内在的智慧、直觉和深度。建议你聆听内心的声音，相信自己的直觉判断。",
    reversed: "隐藏的动机，信息缺失，表面理解"
  },
  {
    id: 4,
    name: "皇后",
    symbol: "👑",
    meaning: "丰饶，滋养，创造力",
    description: "象征着丰饶、滋养和创造力。在生活中带来温暖、关爱和满足感，强调与自然和生命力的联系。",
    reversed: "依赖，过度保护，创意受阻"
  },
  {
    id: 5,
    name: "皇帝",
    symbol: "👑",
    meaning: "权威，结构，控制",
    description: "代表着权威、稳定和控制。表明你可能需要建立秩序，或者需要更多的自律和结构来实现目标。",
    reversed: "专制，僵化，控制欲过强"
  },
  {
    id: 6,
    name: "教皇",
    symbol: "🙏",
    meaning: "传统，精神指导，遵从",
    description: "象征着传统、信仰和精神指导。可能表示你正在寻求智慧或遵循某种传统或信仰体系。",
    reversed: "个人信仰，不服从，挑战传统"
  },
  {
    id: 7,
    name: "恋人",
    symbol: "❤️",
    meaning: "爱情，关系，选择",
    description: "代表着爱情、和谐和重要的选择。通常与感情、伙伴关系或重大决定有关，强调合作与共鸣。",
    reversed: "不平衡的关系，价值观冲突，犹豫不决"
  },
  {
    id: 8,
    name: "战车",
    symbol: "🏆",
    meaning: "决心，意志力，成功",
    description: "象征着胜利、意志力和克服困难。预示着通过坚持和决心，你将能够战胜挑战并取得成功。",
    reversed: "攻击性，缺乏方向，失控"
  },
  {
    id: 9,
    name: "力量",
    symbol: "💪",
    meaning: "勇气，耐心，影响力",
    description: "代表着内在力量、勇气和自信。表明你有能力通过耐心和毅力来控制自己的情绪和处境。",
    reversed: "自我怀疑，弱点，力量滥用"
  },
  {
    id: 10,
    name: "隐士",
    symbol: "🔦",
    meaning: "反思，孤独，内在寻求",
    description: "象征着孤独、反思和寻找内在真理。建议你可能需要时间独处，深入思考并探索内心世界。",
    reversed: "社交退缩，孤立，被忽视的真相"
  },
  {
    id: 11,
    name: "命运之轮",
    symbol: "🎡",
    meaning: "命运，转变，机会",
    description: "代表着生命的循环、变化和机会。提醒你生活中的起起落落是自然的，命运的车轮总在转动。",
    reversed: "抵抗变化，坏运气，外部控制"
  },
  {
    id: 12,
    name: "正义",
    symbol: "⚖️",
    meaning: "公正，真相，因果",
    description: "象征着公正、平衡和诚实。可能暗示需要公平对待某种情况或认真考虑行动的后果。",
    reversed: "不公正，不诚实，失衡"
  }
]; 