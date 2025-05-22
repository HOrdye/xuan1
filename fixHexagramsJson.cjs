const fs = require('fs');
const path = require('path');

// 需要处理的文件路径列表
const filePaths = [
  path.resolve(__dirname, 'hexagrams.json'),
  path.resolve(__dirname, 'public/hexagrams.json'),
];

// 处理每个文件
filePaths.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`文件不存在: ${filePath}`);
    return;
  }

  // 读取文件内容
  console.log(`正在处理: ${filePath}`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);

  // 新数据对象
  const newData = {};

  // 处理每个卦象
  Object.keys(data).forEach(key => {
    // 只取前6位作为新key (处理像"011011_63"这样的key)
    const pureKey = key.substring(0, 6);
    
    // 从pureKey生成lines数组
    const lines = pureKey.split('').map(char => parseInt(char, 10));
    
    // 拷贝原对象并添加lines字段
    const hexagram = { ...data[key], lines };
    
    // 添加到新数据对象
    newData[pureKey] = hexagram;
  });

  // 写回文件
  console.log(`正在写入修正后的数据...`);
  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf-8');
  console.log(`✅ ${filePath} 修正完成！`);
});

// 处理hexagrams.ts文件，更新导入方式
const hexagramTsPath = path.resolve(__dirname, 'src/features/dilemma/utils/hexagrams.ts');
if (fs.existsSync(hexagramTsPath)) {
  console.log(`正在处理TypeScript导入文件: ${hexagramTsPath}`);
  const content = fs.readFileSync(hexagramTsPath, 'utf-8');
  
  // 查看content，确定如何处理
  console.log(`文件内容预览:\n${content.substring(0, 200)}...`);
  console.log('请手动检查hexagrams.ts文件确保它正确导入了带有lines字段的数据！');
}

console.log('所有hexagrams.json文件处理完成！'); 