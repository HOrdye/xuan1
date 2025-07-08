/**
 * 塔罗牌数据完整性测试脚本
 */

const fs = require('fs');
const path = require('path');

// 读取生成的塔罗牌数据文件
function readTarotData() {
  const filePath = path.join(__dirname, '../src/features/tarot/utils/completeTarotData.ts');
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ 塔罗牌数据文件不存在:', filePath);
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 简单解析数据（提取JSON部分）
  const match = content.match(/export const completeTarotDeck: CompleteTarotCard\[\] = (\[[\s\S]*?\]);/);
  if (!match) {
    console.error('❌ 无法解析塔罗牌数据');
    return null;
  }
  
  try {
    const data = JSON.parse(match[1]);
    return data;
  } catch (error) {
    console.error('❌ JSON解析失败:', error.message);
    return null;
  }
}

// 验证数据完整性
function validateTarotData(cards) {
  const results = {
    total: cards.length,
    majorArcana: 0,
    minorArcana: 0,
    suits: {
      wands: 0,
      cups: 0,
      swords: 0,
      pentacles: 0
    },
    missing: [],
    duplicates: [],
    errors: []
  };
  
  const seenIds = new Set();
  
  // 检查每张牌
  cards.forEach(card => {
    // 检查重复ID
    if (seenIds.has(card.id)) {
      results.duplicates.push(`ID ${card.id} 重复`);
    }
    seenIds.add(card.id);
    
    // 检查必要字段
    if (!card.name || !card.chineseName || !card.category) {
      results.errors.push(`ID ${card.id}: 缺少必要字段`);
    }
    
    // 统计分类
    if (card.category === 'major') {
      results.majorArcana++;
    } else if (card.category === 'minor') {
      results.minorArcana++;
      if (card.suit) {
        results.suits[card.suit]++;
      }
    }
  });
  
  // 检查大阿尔卡纳完整性 (0-21)
  for (let i = 0; i <= 21; i++) {
    if (!cards.find(card => card.id === i && card.category === 'major')) {
      results.missing.push(`大阿尔卡纳 ${i}`);
    }
  }
  
  // 检查小阿尔卡纳完整性
  const suits = ['wands', 'cups', 'swords', 'pentacles'];
  suits.forEach((suit, suitIndex) => {
    for (let i = 1; i <= 14; i++) {
      const expectedId = 22 + suitIndex * 14 + (i - 1);
      if (!cards.find(card => card.id === expectedId && card.suit === suit)) {
        results.missing.push(`${suit} ${i} (ID: ${expectedId})`);
      }
    }
  });
  
  return results;
}

// 生成测试报告
function generateReport(results) {
  console.log('\n🔮 塔罗牌数据完整性测试报告');
  console.log('='.repeat(50));
  
  // 基本统计
  console.log('\n📊 基本统计:');
  console.log(`   总牌数: ${results.total}/78`);
  console.log(`   大阿尔卡纳: ${results.majorArcana}/22`);
  console.log(`   小阿尔卡纳: ${results.minorArcana}/56`);
  
  console.log('\n🃏 花色统计:');
  console.log(`   权杖 (Wands): ${results.suits.wands}/14`);
  console.log(`   圣杯 (Cups): ${results.suits.cups}/14`);
  console.log(`   宝剑 (Swords): ${results.suits.swords}/14`);
  console.log(`   星币 (Pentacles): ${results.suits.pentacles}/14`);
  
  // 问题报告
  if (results.missing.length > 0) {
    console.log('\n❌ 缺失的牌:');
    results.missing.forEach(missing => console.log(`   - ${missing}`));
  }
  
  if (results.duplicates.length > 0) {
    console.log('\n⚠️  重复的牌:');
    results.duplicates.forEach(duplicate => console.log(`   - ${duplicate}`));
  }
  
  if (results.errors.length > 0) {
    console.log('\n🚨 数据错误:');
    results.errors.forEach(error => console.log(`   - ${error}`));
  }
  
  // 总结
  const isComplete = results.total === 78 && 
                    results.majorArcana === 22 && 
                    results.minorArcana === 56 &&
                    results.missing.length === 0 &&
                    results.duplicates.length === 0 &&
                    results.errors.length === 0;
  
  console.log('\n' + '='.repeat(50));
  if (isComplete) {
    console.log('✅ 塔罗牌数据完整性验证通过！');
    console.log('🎉 所有78张塔罗牌数据完整且正确！');
  } else {
    console.log('❌ 塔罗牌数据存在问题，需要修复');
  }
  
  return isComplete;
}

// 主函数
function main() {
  console.log('🔍 开始验证塔罗牌数据完整性...');
  
  const cards = readTarotData();
  if (!cards) {
    process.exit(1);
  }
  
  const results = validateTarotData(cards);
  const isComplete = generateReport(results);
  
  process.exit(isComplete ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = { readTarotData, validateTarotData, generateReport }; 