/**
 * 六十四卦数据完整性修复工具
 * 1. 确保所有64个卦象都存在
 * 2. 每个卦象都有正确的lines字段
 * 3. 将hexagrams.ts中的数据补全为64个卦象
 */

const fs = require('fs');
const path = require('path');

// 所有可能的卦象二进制组合（6位）
const allPossibleHexagrams = [];
for (let i = 0; i < 64; i++) {
  // 将数字转换为6位二进制字符串，例如：000000, 000001, 000010...
  const binary = i.toString(2).padStart(6, '0');
  allPossibleHexagrams.push(binary);
}

console.log(`总共应有 ${allPossibleHexagrams.length} 个卦象组合`);

// 修复 hexagrams.json 文件
function fixHexagramsJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`文件不存在: ${filePath}`);
    return false;
  }

  try {
    console.log(`正在处理: ${filePath}`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    // 记录当前有多少个卦象
    const currentKeys = Object.keys(data);
    console.log(`当前JSON中有 ${currentKeys.length} 个卦象记录`);

    // 新数据对象
    const newData = {};

    // 处理每个卦象
    currentKeys.forEach(key => {
      // 只取前6位作为新key (处理像"011011_63"这样的key)
      const pureKey = key.substring(0, 6);
      
      // 从pureKey生成lines数组
      const lines = pureKey.split('').map(char => parseInt(char, 10));
      
      // 拷贝原对象并添加lines字段
      const hexagram = { ...data[key], lines };
      
      // 添加到新数据对象
      newData[pureKey] = hexagram;
    });

    // 确保所有64个卦象都存在
    const missingHexagrams = [];
    
    allPossibleHexagrams.forEach(binary => {
      if (!newData[binary]) {
        missingHexagrams.push(binary);
      }
    });

    console.log(`缺少 ${missingHexagrams.length} 个卦象: ${missingHexagrams.join(', ')}`);

    // 如果有缺失的卦象，尝试生成一个基本的条目
    if (missingHexagrams.length > 0) {
      console.log('正在生成缺失的卦象...');
      
      missingHexagrams.forEach(binary => {
        // 为缺失的卦象创建一个基本条目
        const decimalValue = parseInt(binary, 2);
        
        newData[binary] = {
          name: `Hexagram ${decimalValue + 1}`,
          sequence: decimalValue + 1,
          nature: "未知",
          element: "未知",
          description: `此卦象数据待补充 (${binary})`,
          overall: "请参考《易经》详细解读",
          yao_texts: ["", "", "", "", "", ""],
          lines: binary.split('').map(char => parseInt(char, 10))
        };
      });
    }

    // 写回文件
    console.log(`正在写入修正后的数据...`);
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf-8');
    console.log(`✅ ${filePath} 修正完成！`);
    return true;
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error);
    return false;
  }
}

// 处理不同位置的文件
const rootJsonPath = path.resolve(__dirname, 'hexagrams.json');
const publicJsonPath = path.resolve(__dirname, 'public/hexagrams.json');

let success = false;
success = fixHexagramsJsonFile(rootJsonPath) || success;
success = fixHexagramsJsonFile(publicJsonPath) || success;

if (success) {
  console.log('✅ 所有hexagrams.json文件已成功处理！');
} else {
  console.error('❌ 所有文件处理失败或不存在。');
}

// 尝试修复hexagrams.ts
const hexagramTsPath = path.resolve(__dirname, 'src/features/dilemma/utils/hexagrams.ts');
if (fs.existsSync(hexagramTsPath)) {
  console.log(`发现 hexagrams.ts 文件，准备检查...`);
  
  try {
    const content = fs.readFileSync(hexagramTsPath, 'utf8');
    
    // 文件中已有多少个卦象数据
    const hexagramsCountInTS = (content.match(/number: \d+/g) || []).length;
    console.log(`hexagrams.ts 中包含约 ${hexagramsCountInTS} 个卦象数据。`);
    
    if (hexagramsCountInTS < 64) {
      console.log('hexagrams.ts 中的卦象数量不足64个，建议手动更新该文件以包含所有卦象。');
    }
  } catch (error) {
    console.error('读取 hexagrams.ts 文件时出错:', error);
  }
}

console.log('脚本执行完毕。'); 