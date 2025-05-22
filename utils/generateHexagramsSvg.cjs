const fs = require('fs');
const path = require('path');

// 读取hexagrams.json
console.log('读取hexagrams.json数据...');
const hexagramsJsonPath = path.join(__dirname, '../public/hexagrams.json');
const hexagramsData = JSON.parse(fs.readFileSync(hexagramsJsonPath, 'utf8'));

// 确保目标目录存在
const svgOutputDir = path.join(__dirname, '../public/static/hexagrams');
if (!fs.existsSync(svgOutputDir)) {
  fs.mkdirSync(svgOutputDir, { recursive: true });
  console.log(`创建输出目录: ${svgOutputDir}`);
}

// SVG生成函数
function generateHexagramSvg(lines, sequence) {
  // SVG基本属性
  const width = 120;
  const height = 180;
  const yaoHeight = 18;
  const yaoSpacing = 30; // 爻之间的间距
  const yaoWidth = 100;
  const halfYaoWidth = 40;
  const gapWidth = 20; // 阴爻中间的间隙
  const startY = 20; // 从顶部开始的位置

  // SVG头部
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // 添加标题
  svg += `<title>卦象 ${sequence}</title>`;
  
  // 绘制每一爻
  for (let i = 5; i >= 0; i--) {
    const yaoY = startY + (5 - i) * yaoSpacing;
    
    if (lines[i] === 1) {
      // 阳爻 (实线)
      svg += `<rect x="${(width - yaoWidth) / 2}" y="${yaoY}" width="${yaoWidth}" height="${yaoHeight}" fill="black" />`;
    } else {
      // 阴爻 (两短线)
      svg += `<rect x="${(width - yaoWidth) / 2}" y="${yaoY}" width="${halfYaoWidth}" height="${yaoHeight}" fill="black" />`;
      svg += `<rect x="${(width - yaoWidth) / 2 + halfYaoWidth + gapWidth}" y="${yaoY}" width="${halfYaoWidth}" height="${yaoHeight}" fill="black" />`;
    }
  }

  // 可选：添加卦名
  // svg += `<text x="${width / 2}" y="${height - 10}" text-anchor="middle" font-size="12">${name}</text>`;

  // 关闭SVG标签
  svg += `</svg>`;
  
  return svg;
}

// 生成所有卦象的SVG
console.log('开始生成卦象SVG...');
let generatedCount = 0;

Object.keys(hexagramsData).forEach(key => {
  const hexagram = hexagramsData[key];
  const sequence = hexagram.sequence;
  
  // 确保lines数据存在
  if (hexagram.lines && Array.isArray(hexagram.lines) && hexagram.lines.length === 6) {
    const svgContent = generateHexagramSvg(hexagram.lines, sequence);
    const outputPath = path.join(svgOutputDir, `${sequence}.svg`);
    
    fs.writeFileSync(outputPath, svgContent);
    generatedCount++;
    
    if (generatedCount % 10 === 0 || generatedCount === 64) {
      console.log(`已生成 ${generatedCount} 个卦象SVG文件...`);
    }
  } else {
    console.error(`错误：卦象 ${sequence} 的lines数据不存在或格式不正确`);
  }
});

console.log(`完成！成功生成了 ${generatedCount} 个卦象SVG文件。`);
console.log(`输出目录: ${svgOutputDir}`); 