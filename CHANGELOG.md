# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added

#### 🎉 首次发布 @mass/pro-components

- **CTable 主组件**
  - 基于 Arco Design 的高级表格组件
  - 完整的 TypeScript 类型支持
  - 支持泛型，提供类型安全的数据处理

#### 🔍 搜索功能

- **多种搜索控件类型**
  - 输入框搜索 (`input`)
  - 选择器搜索 (`select`)
  - 日期范围搜索 (`dateRange`)
  - 数字范围搜索 (`numberRange`)
- **智能搜索表单**
  - 自动从列配置生成搜索表单
  - 支持展开/收起功能
  - 响应式布局适配

#### 📄 分页功能

- **完整的分页支持**
  - 页码切换
  - 页面大小选择
  - 总数显示
  - 跳转到指定页面
- **灵活的分页配置**
  - 自定义页面大小选项
  - 支持禁用分页
  - 分页回调处理

#### 🎨 列配置功能

- **多种列类型支持**
  - 文本 (`text`)
  - 数字 (`number`)
  - 日期 (`date`)
  - 日期时间 (`dateTime`)
  - 选择器 (`select`)
  - 标签 (`tag`)
- **高级列功能**
  - 列排序（内置和自定义排序函数）
  - 列筛选（下拉菜单筛选）
  - 固定列（左侧/右侧固定）
  - 自定义渲染函数
  - 列宽度和对齐方式配置

#### 🛠️ 工具栏功能

- **内置工具栏组件**
  - 标题显示
  - 刷新按钮
  - 导出按钮
  - 新建按钮
  - 自定义额外内容
- **灵活的配置方式**
  - 支持按钮加载状态
  - 支持完全自定义渲染
  - 向后兼容的 `toolBarRender` 属性

#### 🛡️ 错误处理

- **完善的错误边界**
  - React Error Boundary 包装
  - 开发环境详细错误信息
  - 生产环境友好错误提示
  - 错误恢复机制
- **数据验证**
  - 列配置验证
  - 数据源类型检查
  - 搜索配置验证

#### ⚡ 性能优化

- **渲染优化**
  - React.memo 优化重渲染
  - useMemo 缓存计算结果
  - useCallback 优化事件处理
- **大数据支持**
  - 分页减少渲染数据量
  - 虚拟滚动准备（未来版本）

#### 🧪 测试覆盖

- **完整的测试套件**
  - 单元测试（90%+ 覆盖率）
  - 集成测试
  - 性能测试
  - 类型测试
- **测试工具**
  - Vitest 测试框架
  - React Testing Library
  - 用户交互测试

#### 📚 文档和示例

- **Storybook 文档**
  - 基础使用示例
  - 高级功能演示
  - 完整业务场景示例
  - 交互式文档
- **完整的 API 文档**
  - 详细的属性说明
  - 类型定义文档
  - 使用示例

#### 🔧 开发体验

- **现代化工具链**
  - Vite 开发服务器
  - Rollup 构建工具
  - TypeScript 严格模式
  - ESLint + Prettier 代码规范
- **多格式构建产物**
  - ES 模块 (ESM)
  - CommonJS (CJS)
  - UMD 格式
  - TypeScript 声明文件

### Technical Details

- **依赖要求**
  - React >= 16.8.0
  - React DOM >= 16.8.0
  - Arco Design >= 2.0.0

- **浏览器支持**
  - Chrome >= 60
  - Firefox >= 60
  - Safari >= 12
  - Edge >= 79

- **包大小**
  - 压缩后约 50KB
  - Gzip 后约 15KB
  - Tree-shaking 友好

### Migration Guide

这是首次发布，无需迁移。

### Breaking Changes

无破坏性变更。

### Deprecations

无废弃功能。

---

## 未来计划

### [1.1.0] - 计划中

- 🚀 虚拟滚动支持
- 🎨 更多主题定制选项
- 📱 移动端适配优化
- 🔍 高级搜索功能
- 📊 内置图表列类型

### [1.2.0] - 计划中

- 🔄 拖拽排序
- 📋 批量操作
- 💾 本地存储状态
- 🌐 国际化支持
- ♿ 无障碍功能增强
