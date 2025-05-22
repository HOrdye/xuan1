const fs = require('fs');
const path = require('path');

// 确保hexagrams目录存在
const hexagramsDir = path.join(__dirname, '../../public/hexagrams');
if (!fs.existsSync(hexagramsDir)) {
  fs.mkdirSync(hexagramsDir, { recursive: true });
  console.log(`创建目录: ${hexagramsDir}`);
}

// 读取卦象数据
const hexagramsJson = require('../../hexagrams.json');

// 生成SVG文件
let count = 0;
for (const key in hexagramsJson) {
  const hexagram = hexagramsJson[key];
  const { lines, name, sequence } = hexagram;
  
  if (!lines || !Array.isArray(lines) || lines.length !== 6) {
    console.warn(`跳过无效卦象数据: ${name || key}`);
    continue;
  }
  
  // 使用序号作为文件名
  const fileName = `${sequence}.svg`;
  const filePath = path.join(hexagramsDir, fileName);
  
  // 生成SVG内容
  const svgContent = generateHexagramSvg(lines, name);
  
  // 写入文件
  fs.writeFileSync(filePath, svgContent);
  count++;
  
  console.log(`已生成 ${fileName} - ${name}卦`);
}

console.log(`完成! 共生成 ${count} 个卦象SVG文件`);

/**
 * 生成卦象的SVG图像
 * @param {Array<number>} lines 六爻数组 (0=阴爻, 1=阳爻)
 * @param {string} name 卦名
 * @returns {string} SVG内容
 */
function generateHexagramSvg(lines, name) {
  const width = 200;
  const height = 240;
  const lineHeight = 20;
  const lineWidth = 120;
  const lineGap = 15;
  const startY = 50;
  
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .yang-line { fill: #333; }
    .yin-line { fill: #333; }
    .hexagram-name { font-family: "SimSun", "STKaiti", serif; font-size: 24px; text-anchor: middle; }
  </style>
  
  <!-- 卦名 -->
  <text x="${width/2}" y="30" class="hexagram-name">${name}卦</text>
  
  <!-- 六爻线条 -->
`;

  // 从上到下绘制六爻
  for (let i = 5; i >= 0; i--) {
    const y = startY + (5-i) * (lineHeight + lineGap);
    const isYang = lines[i] === 1;
    
    if (isYang) {
      // 阳爻 (实线)
      svg += `  <rect x="${(width-lineWidth)/2}" y="${y}" width="${lineWidth}" height="${lineHeight}" class="yang-line" />\n`;
    } else {
      // 阴爻 (断开的线)
      const halfWidth = lineWidth / 2 - 10;
      svg += `  <rect x="${(width-lineWidth)/2}" y="${y}" width="${halfWidth}" height="${lineHeight}" class="yin-line" />\n`;
      svg += `  <rect x="${(width-lineWidth)/2 + lineWidth - halfWidth}" y="${y}" width="${halfWidth}" height="${lineHeight}" class="yin-line" />\n`;
    }
  }
  
  svg += '</svg>';
  return svg;
} 