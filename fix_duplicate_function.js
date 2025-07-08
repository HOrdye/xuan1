const fs = require('fs');

// 读取文件内容
const filePath = 'src/features/tarot/views/TarotPage.vue';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('原始文件行数:', lines.length);

// 找到两个重复函数的位置
let firstFunctionStart = -1;
let firstFunctionEnd = -1;
let secondFunctionStart = -1;
let secondFunctionEnd = -1;

let functionCount = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('async function generateInterpretation(')) {
    functionCount++;
    if (functionCount === 1) {
      firstFunctionStart = i;
      console.log('找到第一个函数，开始行:', i + 1);
    } else if (functionCount === 2) {
      secondFunctionStart = i;
      console.log('找到第二个重复函数，开始行:', i + 1);
    }
  }
  
  // 查找函数结束位置（基于缩进和大括号）
  if (functionCount === 1 && firstFunctionStart !== -1 && firstFunctionEnd === -1) {
    if (i > firstFunctionStart && lines[i].trim() === '}' && !lines[i].startsWith('  ')) {
      firstFunctionEnd = i;
      console.log('第一个函数结束行:', i + 1);
    }
  }
  
  if (functionCount === 2 && secondFunctionStart !== -1 && secondFunctionEnd === -1) {
    if (i > secondFunctionStart && lines[i].trim() === '}' && !lines[i].startsWith('  ')) {
      secondFunctionEnd = i;
      console.log('第二个重复函数结束行:', i + 1);
      break;
    }
  }
}

if (secondFunctionStart !== -1 && secondFunctionEnd !== -1) {
  console.log(`准备删除第二个重复函数 (行 ${secondFunctionStart + 1} 到 ${secondFunctionEnd + 1})`);
  
  // 删除重复的函数（包括前面的注释行）
  let deleteStart = secondFunctionStart;
  
  // 检查前面是否有注释行
  if (deleteStart > 0 && lines[deleteStart - 1].trim().startsWith('//')) {
    deleteStart = secondFunctionStart - 1;
    console.log('包含注释行，从行', deleteStart + 1, '开始删除');
  }
  
  // 创建新的内容，删除重复的函数
  const newLines = [
    ...lines.slice(0, deleteStart),
    ...lines.slice(secondFunctionEnd + 1)
  ];
  
  console.log('删除后文件行数:', newLines.length);
  console.log('删除了', lines.length - newLines.length, '行');
  
  // 写入修复后的文件
  fs.writeFileSync(filePath, newLines.join('\n'));
  console.log('✅ 修复完成！重复的generateInterpretation函数已删除');
} else {
  console.log('❌ 未找到重复的函数或函数边界');
} 