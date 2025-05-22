 // 自动校验并修正hexagrams.json中的lines字段，以卦象.txt为准
// 用法：node fixHexagramsLines.js
const fs = require('fs');
const path = require('path');

// 读取卦象.txt
const txtPath = path.resolve(__dirname, '../../../../卦象.txt');
const txtContent = fs.readFileSync(txtPath, 'utf-8');

// 读取hexagrams.json
const jsonPath = path.resolve(__dirname, '../../../../public/hexagrams.json');
const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
const hexagramsJson = JSON.parse(jsonContent);

// 解析卦象.txt，返回 {number, name, lines}
function parseTxtHexagrams(txt) {
  const result = [];
  const regex = /number:\s*(\d+)[\s\S]*?name:\s*"([^"]+)"[\s\S]*?lines:\s*\[([01,\s]+)\]/g;
  let match;
  let count = 0;
  while ((match = regex.exec(txt)) !== null) {
    const number = parseInt(match[1], 10);
    const name = match[2].trim();
    const lines = match[3].split(',').map(s => parseInt(s.trim(), 10));
    result.push({ number, name, lines });
    count++;
  }
  console.log(`解析卦象.txt得到${count}条数据`);
  return result;
}

// 解析json，返回 {key, sequence, name, lines}
function parseJsonHexagrams(json) {
  const result = [];
  for (const [key, value] of Object.entries(json)) {
    // key可能带有_后缀
    const cleanKey = key.split('_')[0];
    const lines = cleanKey.split('').map(x => parseInt(x, 10));
    result.push({
      key,
      sequence: value.sequence,
      name: value.name,
      lines,
      value
    });
  }
  console.log(`解析hexagrams.json得到${result.length}条数据`);
  return result;
}

// 1. 解析数据
const txtHexagrams = parseTxtHexagrams(txtContent);
const jsonHexagrams = parseJsonHexagrams(hexagramsJson);

// 2. 自动修正lines
let fixCount = 0;
let notFound = 0;
for (const txtHex of txtHexagrams) {
  // 在json中找对应的卦，优先用sequence匹配
  const jsonHex = jsonHexagrams.find(j => j.sequence === txtHex.number || j.name === txtHex.name);
  if (!jsonHex) {
    console.log(`❌ 未找到：${txtHex.number} ${txtHex.name}`);
    notFound++;
    continue;
  }
  // 比较lines
  const linesEqual = JSON.stringify(txtHex.lines) === JSON.stringify(jsonHex.lines);
  if (!linesEqual) {
    // 修正json中的lines编码
    const newKey = txtHex.lines.join('');
    // 复制原数据，替换key
    const oldValue = hexagramsJson[jsonHex.key];
    // 删除旧key，插入新key
    delete hexagramsJson[jsonHex.key];
    hexagramsJson[newKey] = { ...oldValue };
    fixCount++;
    console.log(`已修正：${txtHex.number} ${txtHex.name} lines: ${jsonHex.lines} => ${txtHex.lines}`);
  }
}

// 3. 保存修正后的json
const backupPath = jsonPath + '.bak';
fs.writeFileSync(backupPath, JSON.stringify(hexagramsJson, null, 2), 'utf-8');
fs.writeFileSync(jsonPath, JSON.stringify(hexagramsJson, null, 2), 'utf-8');

console.log(`\n修正完成！共修正${fixCount}项，未匹配到${notFound}项。`);
console.log(`已备份原文件到: ${backupPath}`);