/**
 * P0阶段功能测试运行器
 * 可以直接在Node.js环境中运行
 */

import { runPhase1Tests } from './test-phase1';

// 运行测试
console.log('🚀 启动P0阶段功能测试...\n');
const results = runPhase1Tests();

// 导出结果供其他模块使用
export { results };

