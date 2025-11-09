/**
 * 八宫六十四卦详细数据
 * 包含：卦宫、五行、世爻位、纳甲地支序列
 * 
 * 数据来源：public/bagongliushisi.xlsx
 * 生成时间：2025-11-02 00:04:14
 */

export interface HexagramPalaceData {
  /** 卦序号（1-64） */
  number: number;
  
  /** 中文卦名 */
  chineseName: string;
  
  /** 卦宫归属（八宫之一） */
  palace: '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤';
  
  /** 五行属性 */
  element: '金' | '木' | '水' | '火' | '土';
  
  /** 世爻位置（0-5，对应初爻到上爻） */
  shiYao: number;
  
  /** 纳甲地支序列（6个地支，对应6个爻位） */
  naJiaSequence: [string, string, string, string, string, string];
}

export const hexagramPalaceData: HexagramPalaceData[] = [
  {
    "number": 1,
    "chineseName": "乾",
    "palace": "乾",
    "element": "金",
    "shiYao": 5,
    "naJiaSequence": [
      "子",
      "寅",
      "辰",
      "午",
      "申",
      "戌"
    ]
  },
  {
    "number": 2,
    "chineseName": "天风姤",
    "palace": "乾",
    "element": "金",
    "shiYao": 0,
    "naJiaSequence": [
      "子",
      "寅",
      "辰",
      "午",
      "申",
      "戌"
    ]
  },
  {
    "number": 3,
    "chineseName": "天山遁",
    "palace": "乾",
    "element": "金",
    "shiYao": 1,
    "naJiaSequence": [
      "子",
      "寅",
      "辰",
      "午",
      "申",
      "戌"
    ]
  },
  {
    "number": 4,
    "chineseName": "天地否",
    "palace": "乾",
    "element": "金",
    "shiYao": 2,
    "naJiaSequence": [
      "子",
      "寅",
      "辰",
      "午",
      "申",
      "戌"
    ]
  },
  {
    "number": 5,
    "chineseName": "风地观",
    "palace": "乾",
    "element": "金",
    "shiYao": 3,
    "naJiaSequence": [
      "子",
      "寅",
      "辰",
      "午",
      "申",
      "戌"
    ]
  },
  {
    "number": 6,
    "chineseName": "山地剥",
    "palace": "乾",
    "element": "金",
    "shiYao": 4,
    "naJiaSequence": [
      "子",
      "寅",
      "辰",
      "午",
      "申",
      "戌"
    ]
  },
  {
    "number": 7,
    "chineseName": "火地晋",
    "palace": "乾",
    "element": "金",
    "shiYao": 3,
    "naJiaSequence": [
      "子",
      "寅",
      "辰",
      "午",
      "申",
      "戌"
    ]
  },
  {
    "number": 8,
    "chineseName": "火天大有",
    "palace": "乾",
    "element": "金",
    "shiYao": 2,
    "naJiaSequence": [
      "子",
      "寅",
      "辰",
      "午",
      "申",
      "戌"
    ]
  },
  {
    "number": 9,
    "chineseName": "震",
    "palace": "震",
    "element": "木",
    "shiYao": 5,
    "naJiaSequence": [
      "子",
      "寅",
      "辰",
      "午",
      "申",
      "戌"
    ]
  },
  {
    "number": 10,
    "chineseName": "雷地豫",
    "palace": "震",
    "element": "木",
    "shiYao": 0,
    "naJiaSequence": [
      "子",
      "寅",
      "辰",
      "午",
      "申",
      "戌"
    ]
  },
  {
    "number": 11,
    "chineseName": "雷水解",
    "palace": "震",
    "element": "木",
    "shiYao": 1,
    "naJiaSequence": [
      "子",
      "寅",
      "辰",
      "午",
      "申",
      "戌"
    ]
  },
  {
    "number": 12,
    "chineseName": "雷风恒",
    "palace": "震",
    "element": "木",
    "shiYao": 2,
    "naJiaSequence": [
      "子",
      "寅",
      "辰",
      "午",
      "申",
      "戌"
    ]
  },
  {
    "number": 13,
    "chineseName": "地风升",
    "palace": "震",
    "element": "木",
    "shiYao": 3,
    "naJiaSequence": [
      "子",
      "寅",
      "辰",
      "午",
      "申",
      "戌"
    ]
  },
  {
    "number": 14,
    "chineseName": "水风井",
    "palace": "震",
    "element": "木",
    "shiYao": 4,
    "naJiaSequence": [
      "子",
      "寅",
      "辰",
      "午",
      "申",
      "戌"
    ]
  },
  {
    "number": 15,
    "chineseName": "泽风大过",
    "palace": "震",
    "element": "木",
    "shiYao": 3,
    "naJiaSequence": [
      "子",
      "寅",
      "辰",
      "午",
      "申",
      "戌"
    ]
  },
  {
    "number": 16,
    "chineseName": "泽雷随",
    "palace": "震",
    "element": "木",
    "shiYao": 2,
    "naJiaSequence": [
      "子",
      "寅",
      "辰",
      "午",
      "申",
      "戌"
    ]
  },
  {
    "number": 17,
    "chineseName": "坎",
    "palace": "坎",
    "element": "水",
    "shiYao": 5,
    "naJiaSequence": [
      "寅",
      "辰",
      "午",
      "申",
      "戌",
      "子"
    ]
  },
  {
    "number": 18,
    "chineseName": "水泽节",
    "palace": "坎",
    "element": "水",
    "shiYao": 0,
    "naJiaSequence": [
      "寅",
      "辰",
      "午",
      "申",
      "戌",
      "子"
    ]
  },
  {
    "number": 19,
    "chineseName": "水雷屯",
    "palace": "坎",
    "element": "水",
    "shiYao": 1,
    "naJiaSequence": [
      "寅",
      "辰",
      "午",
      "申",
      "戌",
      "子"
    ]
  },
  {
    "number": 20,
    "chineseName": "水火既济",
    "palace": "坎",
    "element": "水",
    "shiYao": 2,
    "naJiaSequence": [
      "寅",
      "辰",
      "午",
      "申",
      "戌",
      "子"
    ]
  },
  {
    "number": 21,
    "chineseName": "泽火革",
    "palace": "坎",
    "element": "水",
    "shiYao": 3,
    "naJiaSequence": [
      "寅",
      "辰",
      "午",
      "申",
      "戌",
      "子"
    ]
  },
  {
    "number": 22,
    "chineseName": "雷火丰",
    "palace": "坎",
    "element": "水",
    "shiYao": 4,
    "naJiaSequence": [
      "寅",
      "辰",
      "午",
      "申",
      "戌",
      "子"
    ]
  },
  {
    "number": 23,
    "chineseName": "地火明夷",
    "palace": "坎",
    "element": "水",
    "shiYao": 3,
    "naJiaSequence": [
      "寅",
      "辰",
      "午",
      "申",
      "戌",
      "子"
    ]
  },
  {
    "number": 24,
    "chineseName": "地水师",
    "palace": "坎",
    "element": "水",
    "shiYao": 2,
    "naJiaSequence": [
      "寅",
      "辰",
      "午",
      "申",
      "戌",
      "子"
    ]
  },
  {
    "number": 25,
    "chineseName": "艮",
    "palace": "艮",
    "element": "土",
    "shiYao": 5,
    "naJiaSequence": [
      "辰",
      "午",
      "申",
      "戌",
      "子",
      "寅"
    ]
  },
  {
    "number": 26,
    "chineseName": "山火贲",
    "palace": "艮",
    "element": "土",
    "shiYao": 0,
    "naJiaSequence": [
      "辰",
      "午",
      "申",
      "戌",
      "子",
      "寅"
    ]
  },
  {
    "number": 27,
    "chineseName": "山天大畜",
    "palace": "艮",
    "element": "土",
    "shiYao": 1,
    "naJiaSequence": [
      "辰",
      "午",
      "申",
      "戌",
      "子",
      "寅"
    ]
  },
  {
    "number": 28,
    "chineseName": "山泽损",
    "palace": "艮",
    "element": "土",
    "shiYao": 2,
    "naJiaSequence": [
      "辰",
      "午",
      "申",
      "戌",
      "子",
      "寅"
    ]
  },
  {
    "number": 29,
    "chineseName": "火泽睽",
    "palace": "艮",
    "element": "土",
    "shiYao": 3,
    "naJiaSequence": [
      "辰",
      "午",
      "申",
      "戌",
      "子",
      "寅"
    ]
  },
  {
    "number": 30,
    "chineseName": "天泽履",
    "palace": "艮",
    "element": "土",
    "shiYao": 4,
    "naJiaSequence": [
      "辰",
      "午",
      "申",
      "戌",
      "子",
      "寅"
    ]
  },
  {
    "number": 31,
    "chineseName": "风泽中孚",
    "palace": "艮",
    "element": "土",
    "shiYao": 3,
    "naJiaSequence": [
      "辰",
      "午",
      "申",
      "戌",
      "子",
      "寅"
    ]
  },
  {
    "number": 32,
    "chineseName": "风山渐",
    "palace": "艮",
    "element": "土",
    "shiYao": 2,
    "naJiaSequence": [
      "辰",
      "午",
      "申",
      "戌",
      "子",
      "寅"
    ]
  },
  {
    "number": 33,
    "chineseName": "坤",
    "palace": "坤",
    "element": "土",
    "shiYao": 5,
    "naJiaSequence": [
      "未",
      "巳",
      "卯",
      "丑",
      "亥",
      "酉"
    ]
  },
  {
    "number": 34,
    "chineseName": "地雷复",
    "palace": "坤",
    "element": "土",
    "shiYao": 0,
    "naJiaSequence": [
      "未",
      "巳",
      "卯",
      "丑",
      "亥",
      "酉"
    ]
  },
  {
    "number": 35,
    "chineseName": "地泽临",
    "palace": "坤",
    "element": "土",
    "shiYao": 1,
    "naJiaSequence": [
      "未",
      "巳",
      "卯",
      "丑",
      "亥",
      "酉"
    ]
  },
  {
    "number": 36,
    "chineseName": "地天泰",
    "palace": "坤",
    "element": "土",
    "shiYao": 2,
    "naJiaSequence": [
      "未",
      "巳",
      "卯",
      "丑",
      "亥",
      "酉"
    ]
  },
  {
    "number": 37,
    "chineseName": "雷天大壮",
    "palace": "坤",
    "element": "土",
    "shiYao": 3,
    "naJiaSequence": [
      "未",
      "巳",
      "卯",
      "丑",
      "亥",
      "酉"
    ]
  },
  {
    "number": 38,
    "chineseName": "泽天夬",
    "palace": "坤",
    "element": "土",
    "shiYao": 4,
    "naJiaSequence": [
      "未",
      "巳",
      "卯",
      "丑",
      "亥",
      "酉"
    ]
  },
  {
    "number": 39,
    "chineseName": "水天需",
    "palace": "坤",
    "element": "土",
    "shiYao": 3,
    "naJiaSequence": [
      "未",
      "巳",
      "卯",
      "丑",
      "亥",
      "酉"
    ]
  },
  {
    "number": 40,
    "chineseName": "水地比",
    "palace": "坤",
    "element": "土",
    "shiYao": 2,
    "naJiaSequence": [
      "未",
      "巳",
      "卯",
      "丑",
      "亥",
      "酉"
    ]
  },
  {
    "number": 41,
    "chineseName": "巽",
    "palace": "巽",
    "element": "木",
    "shiYao": 5,
    "naJiaSequence": [
      "丑",
      "亥",
      "酉",
      "卯",
      "巳",
      "未"
    ]
  },
  {
    "number": 42,
    "chineseName": "风天小畜",
    "palace": "巽",
    "element": "木",
    "shiYao": 0,
    "naJiaSequence": [
      "丑",
      "亥",
      "酉",
      "卯",
      "巳",
      "未"
    ]
  },
  {
    "number": 43,
    "chineseName": "风火家人",
    "palace": "巽",
    "element": "木",
    "shiYao": 1,
    "naJiaSequence": [
      "丑",
      "亥",
      "酉",
      "卯",
      "巳",
      "未"
    ]
  },
  {
    "number": 44,
    "chineseName": "风雷益",
    "palace": "巽",
    "element": "木",
    "shiYao": 2,
    "naJiaSequence": [
      "丑",
      "亥",
      "酉",
      "卯",
      "巳",
      "未"
    ]
  },
  {
    "number": 45,
    "chineseName": "天雷无妄",
    "palace": "巽",
    "element": "木",
    "shiYao": 3,
    "naJiaSequence": [
      "丑",
      "亥",
      "酉",
      "卯",
      "巳",
      "未"
    ]
  },
  {
    "number": 46,
    "chineseName": "火雷噬嗑",
    "palace": "巽",
    "element": "木",
    "shiYao": 4,
    "naJiaSequence": [
      "丑",
      "亥",
      "酉",
      "卯",
      "巳",
      "未"
    ]
  },
  {
    "number": 47,
    "chineseName": "山雷颐",
    "palace": "巽",
    "element": "木",
    "shiYao": 3,
    "naJiaSequence": [
      "丑",
      "亥",
      "酉",
      "卯",
      "巳",
      "未"
    ]
  },
  {
    "number": 48,
    "chineseName": "山风蛊",
    "palace": "巽",
    "element": "木",
    "shiYao": 2,
    "naJiaSequence": [
      "丑",
      "亥",
      "酉",
      "卯",
      "巳",
      "未"
    ]
  },
  {
    "number": 49,
    "chineseName": "离",
    "palace": "离",
    "element": "火",
    "shiYao": 5,
    "naJiaSequence": [
      "卯",
      "巳",
      "未",
      "酉",
      "亥",
      "丑"
    ]
  },
  {
    "number": 50,
    "chineseName": "火山旅",
    "palace": "离",
    "element": "火",
    "shiYao": 0,
    "naJiaSequence": [
      "卯",
      "巳",
      "未",
      "酉",
      "亥",
      "丑"
    ]
  },
  {
    "number": 51,
    "chineseName": "火风鼎",
    "palace": "离",
    "element": "火",
    "shiYao": 1,
    "naJiaSequence": [
      "卯",
      "巳",
      "未",
      "酉",
      "亥",
      "丑"
    ]
  },
  {
    "number": 52,
    "chineseName": "火水未济",
    "palace": "离",
    "element": "火",
    "shiYao": 2,
    "naJiaSequence": [
      "卯",
      "巳",
      "未",
      "酉",
      "亥",
      "丑"
    ]
  },
  {
    "number": 53,
    "chineseName": "山水蒙",
    "palace": "离",
    "element": "火",
    "shiYao": 3,
    "naJiaSequence": [
      "卯",
      "巳",
      "未",
      "酉",
      "亥",
      "丑"
    ]
  },
  {
    "number": 54,
    "chineseName": "风水涣",
    "palace": "离",
    "element": "火",
    "shiYao": 4,
    "naJiaSequence": [
      "卯",
      "巳",
      "未",
      "酉",
      "亥",
      "丑"
    ]
  },
  {
    "number": 55,
    "chineseName": "天水讼",
    "palace": "离",
    "element": "火",
    "shiYao": 3,
    "naJiaSequence": [
      "卯",
      "巳",
      "未",
      "酉",
      "亥",
      "丑"
    ]
  },
  {
    "number": 56,
    "chineseName": "天火同人",
    "palace": "离",
    "element": "火",
    "shiYao": 2,
    "naJiaSequence": [
      "卯",
      "巳",
      "未",
      "酉",
      "亥",
      "丑"
    ]
  },
  {
    "number": 57,
    "chineseName": "兑",
    "palace": "兑",
    "element": "金",
    "shiYao": 5,
    "naJiaSequence": [
      "巳",
      "卯",
      "丑",
      "酉",
      "亥",
      "未"
    ]
  },
  {
    "number": 58,
    "chineseName": "泽水困",
    "palace": "兑",
    "element": "金",
    "shiYao": 0,
    "naJiaSequence": [
      "巳",
      "卯",
      "丑",
      "酉",
      "亥",
      "未"
    ]
  },
  {
    "number": 59,
    "chineseName": "泽地萃",
    "palace": "兑",
    "element": "金",
    "shiYao": 1,
    "naJiaSequence": [
      "巳",
      "卯",
      "丑",
      "酉",
      "亥",
      "未"
    ]
  },
  {
    "number": 60,
    "chineseName": "泽山咸",
    "palace": "兑",
    "element": "金",
    "shiYao": 2,
    "naJiaSequence": [
      "巳",
      "卯",
      "丑",
      "酉",
      "亥",
      "未"
    ]
  },
  {
    "number": 61,
    "chineseName": "水山蹇",
    "palace": "兑",
    "element": "金",
    "shiYao": 3,
    "naJiaSequence": [
      "巳",
      "卯",
      "丑",
      "酉",
      "亥",
      "未"
    ]
  },
  {
    "number": 62,
    "chineseName": "地山谦",
    "palace": "兑",
    "element": "金",
    "shiYao": 4,
    "naJiaSequence": [
      "巳",
      "卯",
      "丑",
      "酉",
      "亥",
      "未"
    ]
  },
  {
    "number": 63,
    "chineseName": "雷山小过",
    "palace": "兑",
    "element": "金",
    "shiYao": 3,
    "naJiaSequence": [
      "巳",
      "卯",
      "丑",
      "酉",
      "亥",
      "未"
    ]
  },
  {
    "number": 64,
    "chineseName": "雷泽归妹",
    "palace": "兑",
    "element": "金",
    "shiYao": 2,
    "naJiaSequence": [
      "巳",
      "卯",
      "丑",
      "酉",
      "亥",
      "未"
    ]
  }
];