/**
 * 紫微斗数排盘结果验证工具
 * 用于验证排盘结果的正确性
 */

import type { ZiweiChart } from '../types';

/**
 * 验证命盘数据完整性
 */
export function validateChart(chart: ZiweiChart): {
  isValid: boolean;
  issues: string[];
  warnings: string[];
} {
  const issues: string[] = [];
  const warnings: string[] = [];

  // 1. 检查宫位数量
  if (chart.palaces.length !== 12) {
    issues.push(`宫位数量不正确：应为12个，实际${chart.palaces.length}个`);
  }

  // 2. 检查命宫
  if (!chart.mingGong) {
    issues.push('命宫不存在');
  } else {
    // 检查命宫是否在索引0
    if (chart.palaces[0].name !== chart.mingGong.name) {
      issues.push(`命宫位置不正确：应在索引0（${chart.palaces[0].name}），实际在${chart.palaces.findIndex(p => p.name === chart.mingGong.name)}`);
    }
    
    // 检查命宫主星
    const mainStars = chart.mingGong.stars.filter(s => s.category === '主星');
    if (mainStars.length === 0) {
      warnings.push('命宫没有主星（空宫）');
    }
  }

  // 3. 检查身宫
  if (!chart.shenGong) {
    warnings.push('身宫不存在');
  }

  // 4. 检查大限数量
  if (chart.daxian.length !== 12) {
    issues.push(`大限数量不正确：应为12个，实际${chart.daxian.length}个`);
  }

  // 5. 检查每个宫位都有名称
  const palaceNames = ['命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫', '奴仆宫', '官禄宫', '田宅宫', '福德宫', '父母宫'];
  chart.palaces.forEach((palace, index) => {
    if (!palace.name) {
      issues.push(`索引${index}的宫位没有名称`);
    }
    if (palace.name !== palaceNames[index]) {
      warnings.push(`索引${index}的宫位名称不匹配：期望${palaceNames[index]}，实际${palace.name}`);
    }
  });

  // 6. 检查主星总数（应该有14颗主星分布在12个宫位中）
  const allMainStars = chart.palaces.flatMap(p => p.stars.filter(s => s.category === '主星'));
  const uniqueMainStars = new Set(allMainStars.map(s => s.name));
  if (uniqueMainStars.size < 10) {
    warnings.push(`主星数量偏少：发现${uniqueMainStars.size}颗不同的主星，应该有14颗`);
  }

  // 7. 检查五行局
  const validWuxingJu = ['水二局', '木三局', '金四局', '土五局', '火六局'];
  if (!validWuxingJu.includes(chart.wuxingJu)) {
    issues.push(`五行局不正确：${chart.wuxingJu}`);
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings
  };
}

/**
 * 生成验证报告
 */
export function generateValidationReport(chart: ZiweiChart): string {
  const validation = validateChart(chart);
  
  let report = '📊 命盘验证报告\n';
  report += '='.repeat(50) + '\n\n';
  
  if (validation.isValid) {
    report += '✅ 基本验证通过\n\n';
  } else {
    report += '❌ 发现以下问题：\n';
    validation.issues.forEach(issue => {
      report += `  - ${issue}\n`;
    });
    report += '\n';
  }
  
  if (validation.warnings.length > 0) {
    report += '⚠️ 警告信息：\n';
    validation.warnings.forEach(warning => {
      report += `  - ${warning}\n`;
    });
    report += '\n';
  }
  
  // 详细信息
  report += '📋 命盘详情：\n';
  report += `  五行局：${chart.wuxingJu}\n`;
  report += `  命宫：${chart.mingGong.name}（${chart.mingGong.stars.map(s => s.name).join('、') || '空宫'}）\n`;
  report += `  身宫：${chart.shenGong.name}\n`;
  report += `  格局数量：${chart.patterns.length}\n`;
  report += `  大限数量：${chart.daxian.length}\n`;
  
  // 主星分布
  report += '\n⭐ 主星分布：\n';
  chart.palaces.forEach((palace, index) => {
    const mainStars = palace.stars.filter(s => s.category === '主星');
    if (mainStars.length > 0) {
      report += `  ${palace.name}：${mainStars.map(s => s.name).join('、')}\n`;
    }
  });
  
  return report;
}

