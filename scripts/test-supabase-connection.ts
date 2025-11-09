/**
 * Supabase连接测试脚本
 * 用于验证Supabase配置是否正确
 * 
 * 使用方法：
 * npx tsx scripts/test-supabase-connection.ts
 * 或
 * node --loader tsx scripts/test-supabase-connection.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// 加载.env文件
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

console.log('🔍 开始测试Supabase连接...\n');

// 检查环境变量
if (!supabaseUrl || supabaseUrl.includes('your-project')) {
  console.error('❌ 错误：VITE_SUPABASE_URL未正确配置');
  console.log('   请检查.env文件中的VITE_SUPABASE_URL配置');
  process.exit(1);
}

if (!supabaseAnonKey || supabaseAnonKey.includes('your-anon-key')) {
  console.error('❌ 错误：VITE_SUPABASE_ANON_KEY未正确配置');
  console.log('   请检查.env文件中的VITE_SUPABASE_ANON_KEY配置');
  process.exit(1);
}

console.log('✅ 环境变量检查通过');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Anon Key: ${supabaseAnonKey.substring(0, 20)}...\n`);

// 创建Supabase客户端
console.log('🔧 正在创建Supabase客户端...');
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  }
});

// 测试连接
async function testConnection() {
  try {
    console.log('🔌 正在测试Supabase连接...');
    
    // 尝试获取当前用户（不需要登录）
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError && userError.message.includes('Invalid API key')) {
      console.error('❌ 连接失败：API密钥无效');
      console.error('   错误信息:', userError.message);
      return false;
    }
    
    // 如果没有用户是正常的（未登录）
    if (!user) {
      console.log('✅ 连接成功！客户端已正确初始化');
      console.log('   当前状态：未登录（这是正常的）');
    } else {
      console.log('✅ 连接成功！客户端已正确初始化');
      console.log(`   当前用户：${user.email}`);
    }
    
    // 测试健康检查（尝试访问一个不存在的表来验证连接）
    console.log('\n🔍 正在进行健康检查...');
    const { error: healthError } = await supabase
      .from('_health_check')
      .select('*')
      .limit(1);
    
    // PGRST116错误表示表不存在，这是正常的
    if (healthError && healthError.code === 'PGRST116') {
      console.log('✅ 数据库连接正常（健康检查表不存在是正常的）');
      console.log('   下一步：创建数据库表和RLS策略');
    } else if (healthError && healthError.code !== 'PGRST116') {
      console.warn('⚠️  数据库连接警告:', healthError.message);
      console.log('   这可能是因为数据库表还未创建');
    } else {
      console.log('✅ 数据库连接完全正常！');
    }
    
    return true;
  } catch (error: any) {
    console.error('❌ 连接测试失败：', error.message);
    console.error('   详细信息:', error);
    return false;
  }
}

// 运行测试
testConnection()
  .then((success) => {
    if (success) {
      console.log('\n🎉 Supabase配置验证完成！');
      console.log('\n📋 下一步操作：');
      console.log('   1. 在Supabase Dashboard中创建数据库表');
      console.log('   2. 配置Row Level Security (RLS)策略');
      console.log('   3. 创建触发器');
      console.log('\n   详细步骤请参考：memory-bank/Supabase实施计划.md');
      process.exit(0);
    } else {
      console.log('\n❌ 请检查配置后重试');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ 测试过程中发生错误：', error);
    process.exit(1);
  });






