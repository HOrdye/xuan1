const fs = require('fs');

// 读取文件内容
const content = fs.readFileSync('src/services/LLMService.ts', 'utf8');
const lines = content.split('\n');

// 找到第一个import语句后面插入新的导入
const newImports = [
  `import type { StoryTarotCard } from '../features/tarot/utils/storyTarotData';`,
  `import type { TarotSpread } from '../features/tarot/utils/tarotInterpretation';`,
  ``,
  `/**`,
  ` * 塔罗牌结构化解读结果接口`,
  ` */`,
  `export interface StructuredTarotInterpretation {`,
  `  overallInterpretation: {`,
  `    title: string;`,
  `    content: string;`,
  `  };`,
  `  cardInterpretations: Array<{`,
  `    position: string;`,
  `    cardName: string;`,
  `    interpretation: string;`,
  `  }>;`,
  `  guidance: {`,
  `    title: string;`,
  `    content: string;`,
  `  };`,
  `  summary: {`,
  `    title: string;`,
  `    content: string;`,
  `  };`,
  `}`
];

// 在第二行（第一个import之后）插入新的导入
const modifiedLines = [
  lines[0], // 第一个import
  ...newImports, // 新的导入和接口
  ...lines.slice(1) // 其余内容
];

// 写入修改后的内容
fs.writeFileSync('src/services/LLMService.ts', modifiedLines.join('\n'), 'utf8');
console.log('✅ 导入修复完成'); 