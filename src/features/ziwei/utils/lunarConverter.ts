/**
 * 农历转换工具
 * 实现公历到农历的转换（简化版，基于算法实现）
 * 
 * 注意：这是一个简化实现，对于精确度要求高的场景，建议使用专业的农历转换库
 * 如：lunar-javascript, chinese-lunar
 */

/**
 * 农历日期结构
 */
export interface LunarDate {
  year: number;      // 农历年
  month: number;      // 农历月（1-12，含闰月）
  day: number;       // 农历日（1-30）
  isLeapMonth: boolean; // 是否为闰月
  tiangan: string;   // 天干（甲、乙、丙...）
  dizhi: string;     // 地支（子、丑、寅...）
}

/**
 * 1900-2100年的农历数据表（简化版）
 * 每个数字代表该年农历正月初一对应的公历日期（月日）
 * 格式：MMDD（如：205 表示2月5日，使用月*100+日）
 */
const LUNAR_NEW_YEAR: Record<number, number> = {
  // 2000-2025年的数据（示例）
  2000: 205, 2001: 124, 2002: 212, 2003: 201, 2004: 122,
  2005: 209, 2006: 129, 2007: 218, 2008: 207, 2009: 126,
  2010: 214, 2011: 203, 2012: 123, 2013: 210, 2014: 131,
  2015: 219, 2016: 208, 2017: 128, 2018: 216, 2019: 205,
  2020: 125, 2021: 212, 2022: 201, 2023: 122, 2024: 210,
  2025: 129,
};

/**
 * 农历月份天数表（简化版）
 * 1表示大月（30天），0表示小月（29天）
 */
const LUNAR_MONTH_DAYS: Record<number, number[]> = {
  // 示例数据，实际应该根据年份计算
  2024: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1], // 12个月
};

/**
 * 天干列表
 */
const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

/**
 * 地支列表
 */
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 根据年份获取天干地支
 */
function getTianganDizhi(year: number): { tiangan: string; dizhi: string } {
  // 天干：年份尾数对应（甲4、乙5、丙6...）
  const tianganIndex = (year - 4) % 10;
  const tiangan = TIANGAN[tianganIndex < 0 ? tianganIndex + 10 : tianganIndex];
  
  // 地支：年份尾数对应（子4、丑5、寅6...）
  const dizhiIndex = (year - 4) % 12;
  const dizhi = DIZHI[dizhiIndex < 0 ? dizhiIndex + 12 : dizhiIndex];
  
  return { tiangan, dizhi };
}

/**
 * 计算两个日期之间的天数差
 */
function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

/**
 * 将公历日期转换为农历日期（简化版）
 * 
 * @param year 公历年
 * @param month 公历月（1-12）
 * @param day 公历日（1-31）
 * @returns 农历日期
 */
export function solarToLunar(
  year: number,
  month: number,
  day: number
): LunarDate {
  // 获取该年农历正月初一的公历日期
  const newYearDate = LUNAR_NEW_YEAR[year];
  
  if (!newYearDate) {
    // 如果没有数据，使用简化算法估算
    return estimateLunarDate(year, month, day);
  }
  
  const newYearMonth = Math.floor(newYearDate / 100);
  const newYearDay = newYearDate % 100;
  const newYear = new Date(year, newYearMonth - 1, newYearDay);
  const targetDate = new Date(year, month - 1, day);
  
  // 计算距离正月初一的天数
  let daysDiff = daysBetween(newYear, targetDate);
  
  // 如果目标日期在正月初一之前，说明是上一年的农历
  if (targetDate < newYear) {
    const prevYearNewYear = LUNAR_NEW_YEAR[year - 1];
    if (prevYearNewYear) {
      const prevNewYearMonth = Math.floor(prevYearNewYear / 100);
      const prevNewYearDay = prevYearNewYear % 100;
      const prevNewYear = new Date(year - 1, prevNewYearMonth - 1, prevNewYearDay);
      daysDiff = daysBetween(prevNewYear, targetDate);
      return calculateLunarFromDays(year - 1, daysDiff);
    }
  }
  
  return calculateLunarFromDays(year, daysDiff);
}

/**
 * 根据距离正月初一的天数计算农历日期
 */
function calculateLunarFromDays(year: number, daysDiff: number): LunarDate {
  const monthDays = LUNAR_MONTH_DAYS[year] || [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1];
  let month = 1;
  let day = daysDiff + 1;
  let isLeapMonth = false;
  
  // 遍历月份，找到对应的农历月
  for (let i = 0; i < monthDays.length; i++) {
    const daysInMonth = monthDays[i] === 1 ? 30 : 29;
    if (day <= daysInMonth) {
      month = i + 1;
      break;
    }
    day -= daysInMonth;
  }
  
  // 如果超过12个月，说明是下一年的农历
  if (month > 12) {
    month = month - 12;
    year = year + 1;
  }
  
  const { tiangan, dizhi } = getTianganDizhi(year);
  
  return {
    year,
    month,
    day,
    isLeapMonth,
    tiangan,
    dizhi,
  };
}

/**
 * 估算农历日期（当没有精确数据时使用）
 * 基于公历日期和农历的近似关系
 */
function estimateLunarDate(
  year: number,
  month: number,
  day: number
): LunarDate {
  // 简化算法：假设农历比公历晚约1个月
  // 这是一个非常简化的估算，实际应该使用专业的转换算法
  
  let lunarMonth = month - 1;
  let lunarYear = year;
  
  if (lunarMonth <= 0) {
    lunarMonth = 12;
    lunarYear = year - 1;
  }
  
  // 农历日期大致等于公历日期
  let lunarDay = day;
  if (lunarDay > 30) {
    lunarDay = 30;
  }
  
  const { tiangan, dizhi } = getTianganDizhi(lunarYear);
  
  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeapMonth: false,
    tiangan,
    dizhi,
  };
}

/**
 * 获取农历年的天干地支
 */
export function getLunarYearTianganDizhi(year: number): { tiangan: string; dizhi: string } {
  return getTianganDizhi(year);
}

