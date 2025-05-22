const fs = require('fs');
const path = require('path');

// 读取卦象数据
const hexagramsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/hexagrams.json'), 'utf8'));

// 确保输出目录存在
const outputDir = path.join(__dirname, '../public/static/hexagrams');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`创建输出目录: ${outputDir}`);
}

// 生成SVG的函数
function generateHexagramSvg(lines, sequence) {
  const width = 120;
  const height = 180;
  const lineHeight = 16;
  const lineWidth = 100;
  const lineGap = 10;
  const startY = 20;

  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="transparent" />
  <text x="${width/2}" y="10" font-family="Arial" font-size="12" text-anchor="middle" fill="#333">第 ${sequence} 卦</text>`;

  // 从下到上绘制每一爻
  lines.forEach((line, index) => {
    const y = startY + (5 - index) * (lineHeight + lineGap);
    
    if (line === 1) {
      // 阳爻: 一条完整的线
      svg += `<rect x="${(width-lineWidth)/2}" y="${y}" width="${lineWidth}" height="${lineHeight}" fill="#000" />`;
    } else {
      // 阴爻: 两条断开的线
      const halfWidth = (lineWidth - 16) / 2;
      svg += `<rect x="${(width-lineWidth)/2}" y="${y}" width="${halfWidth}" height="${lineHeight}" fill="#000" />
      <rect x="${(width-lineWidth)/2 + halfWidth + 16}" y="${y}" width="${halfWidth}" height="${lineHeight}" fill="#000" />`;
    }
  });

  svg += '</svg>';
  return svg;
}

// 生成所有卦象的SVG
let generatedCount = 0;
Object.entries(hexagramsData).forEach(([key, hexagram]) => {
  if (hexagram.sequence && Array.isArray(hexagram.lines)) {
    const svgContent = generateHexagramSvg(hexagram.lines, hexagram.sequence);
    const outputFile = path.join(outputDir, `${hexagram.sequence}.svg`);
    
    fs.writeFileSync(outputFile, svgContent);
    generatedCount++;
    console.log(`生成卦象SVG: 第${hexagram.sequence}卦 (${hexagram.name})`);
  }
});

console.log(`完成！已生成 ${generatedCount} 个卦象SVG文件`); 