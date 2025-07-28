const fs = require('fs');
const path = require('path');

// 确保hexagrams目录存在 - 只使用一个位置
const staticHexagramsDir = path.join(__dirname, '../../public/static/hexagrams');

if (!fs.existsSync(staticHexagramsDir)) {
  fs.mkdirSync(staticHexagramsDir, { recursive: true });
  console.log(`创建目录: ${staticHexagramsDir}`);
}

// 读取卦象数据
const hexagramsPath = path.join(__dirname, '../../public/hexagrams.json');
console.log(`尝试从以下路径加载卦象数据: ${hexagramsPath}`);
  const hexagramsData = fs.readFileSync(hexagramsPath, 'utf8');
  const hexagramsJson = JSON.parse(hexagramsData);

// 生成SVG文件
let count = 0;
for (const key in hexagramsJson) {
  const hexagram = hexagramsJson[key];
  const { lines, name, sequence } = hexagram;
  
  if (!lines || !Array.isArray(lines) || lines.length !== 6) {
    console.warn(`跳过无效卦象数据: ${name || key}`);
    continue;
  }
  
  // 使用序号作为文件名，确保序号是数字类型
  const fileName = `${Number(sequence)}.svg`;
  const staticFilePath = path.join(staticHexagramsDir, fileName);
  
  // 确保卦象序号存在
  if (isNaN(sequence)) {
    console.warn(`卦象序号无效: ${sequence} (${name})`);
    continue;
  }
  
  // 处理卦象名称，确保只有中文部分
  let pureName = name;
  
  // 移除英文部分，比如"震 (The Arousing Thunder)"中的" (The Arousing Thunder)"
  if (pureName && pureName.includes('(')) {
    pureName = pureName.split('(')[0].trim();
  }
  
  // 对于"Hexagram X"样式的名称，使用"第X卦"作为默认名称
  if (pureName && pureName.includes('Hexagram')) {
    const num = pureName.match(/\d+/);
    if (num) {
      pureName = `第${num[0]}卦`;
      console.log(`将 "${name}" 替换为 "${pureName}"`);
    } else {
      pureName = `第${sequence}卦`;
    }
  }
  
  // 如果没有名称，使用序号作为默认名称
  if (!pureName || pureName === '') {
    pureName = `第${sequence}卦`;
  }
  
  // 生成SVG内容 - 更健壮的版本 (确保序列号是数字)
  const svgContent = generateBetterSvg(lines, Number(sequence));
  
  // 只写入到静态目录
  fs.writeFileSync(staticFilePath, svgContent, 'utf8');
  count++;
  
  console.log(`已生成 ${fileName} - ${pureName}`);
}

console.log(`完成! 共生成 ${count} 个卦象SVG文件`);

/**
 * 生成更健壮的卦象SVG图像
 * @param {Array<number>} lines 六爻数组 (0=阴爻, 1=阳爻)
 * @param {string} number 卦象序号
 * @returns {string} SVG内容
 */
function generateBetterSvg(lines, number) {
  const width = 200;
  const height = 240;
  const lineHeight = 20;
  const lineWidth = 120;
  const lineGap = 15;
  const startY = 50;
  
  // 生成更健壮的SVG，确保包含viewBox和正确的命名空间
  let svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
     xmlns="http://www.w3.org/2000/svg" version="1.1">
  <title>Hexagram ${number}</title>
  
  <!-- 卦象背景 -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="white" />
  
  <!-- 卦序号 -->
  <text x="${width/2}" y="30" font-family="Arial, sans-serif" font-size="24px" 
        text-anchor="middle" fill="black">${number}</text>
  
  <!-- 卦象线条 -->
`;

  // 从上到下绘制六爻
  for (let i = 5; i >= 0; i--) {
    const y = startY + (5-i) * (lineHeight + lineGap);
    const isYang = lines[i] === 1;
    
    if (isYang) {
      // 阳爻 (实线)
      svg += `  <rect x="${(width-lineWidth)/2}" y="${y}" width="${lineWidth}" height="${lineHeight}" fill="black" />\n`;
    } else {
      // 阴爻 (断开的线)
      const halfWidth = lineWidth / 2 - 10;
      svg += `  <rect x="${(width-lineWidth)/2}" y="${y}" width="${halfWidth}" height="${lineHeight}" fill="black" />\n`;
      svg += `  <rect x="${(width-lineWidth)/2 + lineWidth - halfWidth}" y="${y}" width="${halfWidth}" height="${lineHeight}" fill="black" />\n`;
    }
  }
  
  svg += '</svg>';
  return svg;
}
