/**
 * 测试故事化塔罗牌数据的完整性和质量
 */

const fs = require('fs');
const path = require('path');

// 读取生成的数据文件
const dataPath = path.join(__dirname, '..', 'src', 'features', 'tarot', 'utils', 'storyTarotData.ts');

if (!fs.existsSync(dataPath)) {
  console.error('❌ 数据文件不存在:', dataPath);
  process.exit(1);
}

console.log('🔍 开始测试故事化塔罗牌数据...\n');

// 读取文件内容
const fileContent = fs.readFileSync(dataPath, 'utf8');

// 提取数据数组
const dataMatch = fileContent.match(/export const storyTarotDeck: StoryTarotCard\[\] = (\[[\s\S]*?\]);/);
if (!dataMatch) {
  console.error('❌ 无法解析数据文件');
  process.exit(1);
}

let storyTarotDeck;
try {
  storyTarotDeck = JSON.parse(dataMatch[1]);
} catch (error) {
  console.error('❌ 数据格式错误:', error.message);
  process.exit(1);
}

console.log('✅ 数据文件读取成功\n');

// 测试函数
function runTests() {
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
  };

  function test(name, condition, errorMsg) {
    results.total++;
    if (condition) {
      console.log(`✅ ${name}`);
      results.passed++;
    } else {
      console.log(`❌ ${name}: ${errorMsg}`);
      results.failed++;
      results.errors.push(`${name}: ${errorMsg}`);
    }
  }

  // 基础数据测试
  console.log('📊 基础数据测试:');
  test('总牌数检查', storyTarotDeck.length === 78, `应为78张，实际${storyTarotDeck.length}张`);
  
  const majorCards = storyTarotDeck.filter(card => card.category === 'major');
  const minorCards = storyTarotDeck.filter(card => card.category === 'minor');
  
  test('大阿尔卡纳数量', majorCards.length === 22, `应为22张，实际${majorCards.length}张`);
  test('小阿尔卡纳数量', minorCards.length === 56, `应为56张，实际${minorCards.length}张`);

  // ID唯一性测试
  console.log('\n🔢 ID唯一性测试:');
  const ids = storyTarotDeck.map(card => card.id);
  const uniqueIds = [...new Set(ids)];
  test('ID唯一性', ids.length === uniqueIds.length, `发现重复ID: ${ids.length - uniqueIds.length}个`);
  
  // ID连续性测试
  const sortedIds = ids.sort((a, b) => a - b);
  const expectedIds = Array.from({length: 78}, (_, i) => i);
  test('ID连续性', JSON.stringify(sortedIds) === JSON.stringify(expectedIds), 'ID不连续或缺失');

  // 故事解读测试
  console.log('\n📖 故事解读测试:');
  const cardsWithStories = storyTarotDeck.filter(card => card.storyInterpretation && card.storyInterpretation.length > 0);
  test('故事解读完整性', cardsWithStories.length === 78, `${78 - cardsWithStories.length}张牌缺少故事解读`);
  
  // 故事解读长度测试
  const shortStories = storyTarotDeck.filter(card => card.storyInterpretation && card.storyInterpretation.length < 20);
  test('故事解读长度', shortStories.length === 0, `${shortStories.length}张牌的故事解读过短`);
  
  const longStories = storyTarotDeck.filter(card => card.storyInterpretation && card.storyInterpretation.length > 100);
  test('故事解读长度适中', longStories.length === 0, `${longStories.length}张牌的故事解读过长`);

  // 关键词测试
  console.log('\n🔑 关键词测试:');
  const cardsWithKeywords = storyTarotDeck.filter(card => card.keywords && card.keywords.length > 0);
  test('关键词完整性', cardsWithKeywords.length === 78, `${78 - cardsWithKeywords.length}张牌缺少关键词`);
  
  const cardsWithEnoughKeywords = storyTarotDeck.filter(card => card.keywords && card.keywords.length >= 3);
  test('关键词数量', cardsWithEnoughKeywords.length === 78, `${78 - cardsWithEnoughKeywords.length}张牌关键词不足3个`);

  // 元素测试
  console.log('\n🌟 元素测试:');
  const validElements = ['fire', 'water', 'air', 'earth'];
  const cardsWithValidElements = storyTarotDeck.filter(card => validElements.includes(card.element));
  test('元素有效性', cardsWithValidElements.length === 78, `${78 - cardsWithValidElements.length}张牌元素无效`);

  // 小阿尔卡纳花色测试
  console.log('\n🎴 小阿尔卡纳测试:');
  const suits = ['wands', 'cups', 'swords', 'pentacles'];
  suits.forEach(suit => {
    const suitCards = storyTarotDeck.filter(card => card.suit === suit);
    test(`${suit}花色数量`, suitCards.length === 14, `${suit}应为14张，实际${suitCards.length}张`);
  });

  // 大阿尔卡纳测试
  console.log('\n🌟 大阿尔卡纳测试:');
  const majorCardIds = majorCards.map(card => card.id).sort((a, b) => a - b);
  const expectedMajorIds = Array.from({length: 22}, (_, i) => i);
  test('大阿尔卡纳ID范围', JSON.stringify(majorCardIds) === JSON.stringify(expectedMajorIds), '大阿尔卡纳ID不在0-21范围');

  // 中文名称测试
  console.log('\n🇨🇳 中文名称测试:');
  const cardsWithChineseNames = storyTarotDeck.filter(card => card.chineseName && card.chineseName.length > 0);
  test('中文名称完整性', cardsWithChineseNames.length === 78, `${78 - cardsWithChineseNames.length}张牌缺少中文名称`);

  // 英文名称测试
  console.log('\n🇺🇸 英文名称测试:');
  const cardsWithEnglishNames = storyTarotDeck.filter(card => card.name && card.name.length > 0);
  test('英文名称完整性', cardsWithEnglishNames.length === 78, `${78 - cardsWithEnglishNames.length}张牌缺少英文名称`);

  // 图片路径测试
  console.log('\n🖼️ 图片路径测试:');
  const cardsWithImages = storyTarotDeck.filter(card => card.imageUrl && card.imageUrl.length > 0);
  test('图片路径完整性', cardsWithImages.length === 78, `${78 - cardsWithImages.length}张牌缺少图片路径`);

  return results;
}

// 运行测试
const testResults = runTests();

// 输出测试结果
console.log('\n' + '='.repeat(50));
console.log('📋 测试结果汇总:');
console.log(`总测试数: ${testResults.total}`);
console.log(`通过: ${testResults.passed} ✅`);
console.log(`失败: ${testResults.failed} ❌`);
console.log(`成功率: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

if (testResults.failed > 0) {
  console.log('\n❌ 失败的测试:');
  testResults.errors.forEach(error => {
    console.log(`  - ${error}`);
  });
  process.exit(1);
} else {
  console.log('\n🎉 所有测试通过！故事化塔罗牌数据完整且质量良好。');
}

// 生成示例展示
console.log('\n' + '='.repeat(50));
console.log('📝 数据示例展示:');

// 显示几张代表性的牌
const examples = [
  storyTarotDeck.find(card => card.id === 0), // 愚者
  storyTarotDeck.find(card => card.id === 21), // 世界
  storyTarotDeck.find(card => card.suit === 'wands' && card.number === 1), // 权杖王牌
  storyTarotDeck.find(card => card.suit === 'cups' && card.number === 2), // 圣杯二
];

examples.forEach((card, index) => {
  if (card) {
    console.log(`\n${index + 1}. ${card.chineseName} (${card.name})`);
    console.log(`   故事解读: ${card.storyInterpretation}`);
    console.log(`   关键词: ${card.keywords.join('、')}`);
    console.log(`   元素: ${card.element}`);
  }
});

console.log('\n✨ 测试完成！'); 