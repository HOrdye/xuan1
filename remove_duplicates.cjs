const fs = require('fs');
const path = require('path');

function removeDuplicatesFromLLMService() {
  const filePath = path.join(__dirname, 'src', 'services', 'LLMService.ts');
  
  try {
    // 读取文件内容
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    console.log(`📊 原文件有 ${lines.length} 行`);
    
    // 找到第一个 "static async getTarotInterpretation(" 的位置
    let firstMethodIndex = -1;
    let classStartIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('export class LLMService {')) {
        classStartIndex = i;
      }
      if (lines[i].includes('static async getTarotInterpretation(') && firstMethodIndex === -1) {
        firstMethodIndex = i;
        break;
      }
    }
    
    if (firstMethodIndex === -1 || classStartIndex === -1) {
      console.error('❌ 未找到关键代码位置');
      return;
    }
    
    console.log(`🔍 找到类定义在第 ${classStartIndex + 1} 行`);
    console.log(`🔍 找到第一个方法在第 ${firstMethodIndex + 1} 行`);
    
    // 找到第一个方法的结束位置
    let methodEndIndex = -1;
    let braceCount = 0;
    let inMethod = false;
    
    for (let i = firstMethodIndex; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes('static async getTarotInterpretation(')) {
        inMethod = true;
      }
      
      if (inMethod) {
        // 计算大括号
        for (let char of line) {
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
        }
        
        // 如果找到了完整的方法（大括号平衡）
        if (braceCount === 0 && line.includes('}') && i > firstMethodIndex) {
          methodEndIndex = i;
          break;
        }
      }
    }
    
    if (methodEndIndex === -1) {
      console.error('❌ 未找到方法结束位置');
      return;
    }
    
    console.log(`🔍 第一个完整方法结束在第 ${methodEndIndex + 1} 行`);
    
    // 保留从开始到第一个完整方法结束的部分
    const cleanLines = lines.slice(0, methodEndIndex + 1);
    
    // 找到剩余部分中的其他必要方法（非重复的）
    const remainingLines = lines.slice(methodEndIndex + 1);
    const necessaryMethods = [];
    
    // 查找其他重要方法（非getTarotInterpretation的）
    let currentMethodLines = [];
    let inOtherMethod = false;
    let currentMethodName = '';
    
    for (let i = 0; i < remainingLines.length; i++) {
      const line = remainingLines[i];
      
      // 检查是否是其他方法的开始
      if (line.includes('static ') && !line.includes('getTarotInterpretation')) {
        if (inOtherMethod && currentMethodLines.length > 0) {
          // 保存之前的方法
          necessaryMethods.push(...currentMethodLines);
        }
        
        currentMethodLines = [line];
        inOtherMethod = true;
        currentMethodName = line;
      } else if (line.includes('private static ') && !line.includes('getTarotInterpretation')) {
        if (inOtherMethod && currentMethodLines.length > 0) {
          necessaryMethods.push(...currentMethodLines);
        }
        
        currentMethodLines = [line];
        inOtherMethod = true;
        currentMethodName = line;
      } else if (inOtherMethod) {
        currentMethodLines.push(line);
        
        // 检查方法是否结束
        if (line.trim() === '}' && !line.includes('{')) {
          necessaryMethods.push(...currentMethodLines);
          currentMethodLines = [];
          inOtherMethod = false;
        }
      }
    }
    
    // 添加类的结束大括号
    cleanLines.push('}');
    
    // 如果有其他必要的方法，添加它们
    if (necessaryMethods.length > 0) {
      // 移除最后的类结束大括号，添加其他方法，然后再添加结束大括号
      cleanLines.pop();
      cleanLines.push(...necessaryMethods);
      cleanLines.push('}');
    }
    
    const cleanContent = cleanLines.join('\n');
    
    // 备份原文件
    const backupPath = filePath + '.backup';
    fs.writeFileSync(backupPath, content);
    console.log(`💾 已备份原文件到: ${backupPath}`);
    
    // 写入清理后的内容
    fs.writeFileSync(filePath, cleanContent);
    
    const newLineCount = cleanContent.split('\n').length;
    console.log(`✅ 清理完成！从 ${lines.length} 行减少到 ${newLineCount} 行`);
    console.log(`📉 减少了 ${lines.length - newLineCount} 行重复代码`);
    
  } catch (error) {
    console.error('❌ 清理失败:', error);
  }
}

// 执行清理
removeDuplicatesFromLLMService(); 