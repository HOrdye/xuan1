const fs = require('fs');

// 读取文件内容
const filePath = 'src/features/tarot/views/TarotPage.vue';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('原始行数:', lines.length);

// 删除第1303-1389行（包含注释和重复函数）
// JavaScript数组索引从0开始，所以第1303行是索引1302
const newLines = [
  ...lines.slice(0, 1302),  // 保留前1302行
  ...lines.slice(1389)      // 保留第1389行之后的内容
];

console.log('修复后行数:', newLines.length);
console.log('删除了', lines.length - newLines.length, '行');

// 写入文件
fs.writeFileSync(filePath, newLines.join('\n'));
console.log('✅ 修复完成！重复的generateInterpretation函数已删除'); 