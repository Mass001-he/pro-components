#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 检查构建产物...');

const distPath = path.join(__dirname, '../dist');
const packageJson = JSON.parse(readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

// 检查dist目录是否存在
if (!fs.existsSync(distPath)) {
  console.error('❌ dist目录不存在');
  process.exit(1);
}

// 检查必要的文件
const requiredFiles = [
  'index.cjs.js',
  'index.esm.js',
  'index.umd.js',
  'index.d.ts'
];

const missingFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.join(distPath, file);
  if (!fs.existsSync(filePath)) {
    missingFiles.push(file);
  } else {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} (${(stats.size / 1024).toFixed(2)}KB)`);
  }
});

if (missingFiles.length > 0) {
  console.error('❌ 缺少以下文件:');
  missingFiles.forEach(file => {
    console.error(`   - ${file}`);
  });
  process.exit(1);
}

// 检查package.json配置
console.log('\n📦 检查package.json配置...');

const requiredFields = ['main', 'module', 'types'];
requiredFields.forEach(field => {
  if (packageJson[field]) {
    const filePath = path.join(__dirname, '..', packageJson[field]);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${field}: ${packageJson[field]}`);
    } else {
      console.error(`❌ ${field}指向的文件不存在: ${packageJson[field]}`);
      process.exit(1);
    }
  } else {
    console.error(`❌ package.json缺少${field}字段`);
    process.exit(1);
  }
});

// 检查TypeScript声明文件
console.log('\n🔍 检查TypeScript声明文件...');
const dtsPath = path.join(distPath, 'index.d.ts');
const dtsContent = fs.readFileSync(dtsPath, 'utf8');

const expectedExports = [
  'CTable',
  'CTableProps',
  'CTableColumn',
  'SearchConfig'
];

expectedExports.forEach(exportName => {
  if (dtsContent.includes(exportName)) {
    console.log(`✅ 导出 ${exportName}`);
  } else {
    console.error(`❌ 缺少导出 ${exportName}`);
    process.exit(1);
  }
});

console.log('\n🎉 构建产物检查通过！');
console.log('\n📊 构建统计:');

// 计算总大小
let totalSize = 0;
requiredFiles.forEach(file => {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    totalSize += stats.size;
  }
});

console.log(`总大小: ${(totalSize / 1024).toFixed(2)}KB`);

// 检查是否有source map
const sourceMapFiles = requiredFiles.filter(file =>
  fs.existsSync(path.join(distPath, file + '.map'))
);

console.log(`Source Maps: ${sourceMapFiles.length}/${requiredFiles.length - 1} 个文件`); // -1 因为.d.ts不需要source map
