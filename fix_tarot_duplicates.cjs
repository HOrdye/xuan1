const fs = require('fs');

// 读取文件内容
const filePath = 'src/features/tarot/views/TarotPage.vue';
console.log('📁 处理文件:', filePath);

const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('📊 原文件有', lines.length, '行');

// 找到两个重复函数的位置
let firstFunctionStart = -1;
let secondFunctionStart = -1;
let secondFunctionEnd = -1;
let functionCount = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('async function generateInterpretation(')) {
    functionCount++;
    if (functionCount === 1) {
      firstFunctionStart = i;
      console.log('🔍 找到第一个函数在第', i + 1, '行');
    } else if (functionCount === 2) {
      secondFunctionStart = i;
      console.log('🔍 找到第二个重复函数在第', i + 1, '行');
    }
  }
}

if (functionCount === 2) {
  // 找到第二个函数的结束位置
  let braceCount = 0;
  let inFunction = false;
  
  for (let i = secondFunctionStart; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.includes('async function generateInterpretation(')) {
      inFunction = true;
    }
    
    if (inFunction) {
      // 计算大括号
      for (let char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
      }
      
      // 当大括号平衡且不在函数第一行时，说明函数结束
      if (braceCount === 0 && i > secondFunctionStart) {
        secondFunctionEnd = i;
        console.log('🔍 第二个重复函数结束在第', i + 1, '行');
        break;
      }
    }
  }
  
  if (secondFunctionEnd !== -1) {
    // 检查是否有前导注释需要一起删除
    let deleteStart = secondFunctionStart;
    if (deleteStart > 0 && lines[deleteStart - 1].trim().startsWith('//')) {
      deleteStart = secondFunctionStart - 1;
      console.log('🔍 包含注释行，从第', deleteStart + 1, '行开始删除');
    }
    
    // 创建新的内容，删除重复的函数
    const newLines = [
      ...lines.slice(0, deleteStart),
      ...lines.slice(secondFunctionEnd + 1)
    ];
    
    console.log('📊 修复后文件有', newLines.length, '行');
    console.log('📉 删除了', lines.length - newLines.length, '行');
    
    // 备份原文件
    const backupPath = filePath + '.backup';
    fs.writeFileSync(backupPath, content);
    console.log('💾 已备份原文件到:', backupPath);
    
    // 写入修复后的文件
    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log('✅ 修复完成！重复的generateInterpretation函数已删除');
  } else {
    console.log('❌ 未找到第二个函数的结束位置');
  }
} else {
  console.log('❌ 未找到重复的函数，当前函数数量:', functionCount);
} 