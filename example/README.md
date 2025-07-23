# @mass/pro-components 组件示例

这个示例项目展示了 @mass/pro-components 组件库中 CTable 组件的各种使用方式和功能。

## 🚀 快速开始

### 安装依赖

```bash
cd example
npm install
```

### 启动开发服务器

```bash
npm run dev
```

然后在浏览器中打开 http://localhost:3000

## 📋 示例列表

### 1. 基础表格 (BasicExample)
- 最简单的表格使用方式
- 展示基本的列配置和数据绑定

### 2. 搜索功能 (SearchExample)
- 多种搜索控件类型演示
- 前端数据过滤实现
- 搜索表单的展开/收起功能

### 3. 分页功能 (PaginationExample)
- 完整的分页功能演示
- 模拟异步数据加载
- 页面大小选择和页码跳转

### 4. 工具栏功能 (ToolbarExample)
- 内置工具栏组件使用
- 刷新、导出、新建等操作按钮
- 自定义额外内容

### 5. 高级功能 (AdvancedExample)
- 复杂的列渲染和自定义组件
- 排序、筛选、固定列功能
- 综合业务场景演示

### 6. 性能测试 (PerformanceExample)
- 大数据量场景测试
- 性能监控和优化展示
- 可调节数据量和页面大小

## 🔧 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Arco Design** - UI 组件库
- **@mass/pro-components** - 专业组件库

## 📁 项目结构

```
example/
├── src/
│   ├── examples/          # 示例组件
│   │   ├── BasicExample.tsx
│   │   ├── SearchExample.tsx
│   │   ├── PaginationExample.tsx
│   │   ├── ToolbarExample.tsx
│   │   ├── AdvancedExample.tsx
│   │   └── PerformanceExample.tsx
│   ├── App.tsx           # 主应用组件
│   ├── main.tsx          # 入口文件
│   └── index.css         # 样式文件
├── index.html            # HTML 模板
├── package.json          # 依赖配置
├── vite.config.ts        # Vite 配置
└── tsconfig.json         # TypeScript 配置
```

## 🎯 学习要点

通过这些示例，你可以学习到：

1. **基础使用** - 如何快速上手 CTable 组件
2. **搜索集成** - 如何实现复杂的搜索功能
3. **分页处理** - 如何处理大数据量的分页展示
4. **工具栏定制** - 如何自定义表格工具栏
5. **高级特性** - 如何使用排序、筛选、固定列等功能
6. **性能优化** - 如何在大数据量场景下保持良好性能

## 💡 提示

- 所有示例都包含详细的注释和说明
- 可以通过浏览器开发者工具查看控制台输出
- 建议按顺序查看示例，从简单到复杂
- 每个示例都是独立的，可以单独学习和使用

## 🐛 问题反馈

如果在使用过程中遇到问题，请：

1. 检查浏览器控制台是否有错误信息
2. 确认依赖版本是否正确
3. 参考组件文档和 API 说明
4. 提交 Issue 或联系开发团队
