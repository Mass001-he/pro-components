# @mass001/pro-components

一个基于 React + TypeScript 的专业组件库，基于 Arco Design 设计系统构建。目前包含 CTable 高级表格组件，提供搜索、分页、排序、筛选等企业级功能。

## ✨ 特性

- 🚀 **开箱即用** - 基于 Arco Design，无需额外样式配置
- 🔍 **智能搜索** - 支持多种搜索控件类型（输入框、选择器、日期范围等）
- 📄 **灵活分页** - 完整的分页功能，支持页面大小选择
- 🎨 **列配置** - 支持排序、筛选、固定列、自定义渲染
- 🛠️ **工具栏** - 内置工具栏，支持标题和常用操作按钮
- 🔧 **TypeScript** - 完整的类型定义，提供优秀的开发体验
- 🎯 **高性能** - 优化的渲染性能，支持大数据量展示
- 🛡️ **错误边界** - 完善的错误处理机制
- 📱 **响应式** - 支持不同屏幕尺寸的自适应布局

## 📦 安装

```bash
npm install @mass001/pro-components
# 或
yarn add @mass001/pro-components
# 或
pnpm add @mass001/pro-components
```

### 依赖要求

```json
{
  "react": ">=16.8.0",
  "react-dom": ">=16.8.0",
  "@arco-design/web-react": ">=2.0.0"
}
```

## 🚀 快速开始

### 基础用法

```tsx
import React from 'react';
import { CTable, CTableColumn } from '@mass001/pro-components';
import '@arco-design/web-react/dist/css/arco.css';

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

const columns: CTableColumn<User>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 80,
    valueType: 'number',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 200,
  },
];

const data: User[] = [
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
];

function App() {
  return <CTable columns={columns} dataSource={data} />;
}
```

### 带搜索功能

```tsx
import React from 'react';
import { CTable, CTableColumn } from '@mass001/pro-components';

const columns: CTableColumn<User>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    searchConfig: {
      type: 'input',
      placeholder: '请输入姓名',
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    searchConfig: {
      type: 'select',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' },
      ],
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
    searchConfig: {
      type: 'dateRange',
    },
  },
];

function App() {
  const handleSearch = (values: Record<string, any>) => {
    console.log('搜索参数:', values);
    // 处理搜索逻辑
  };

  const handleReset = () => {
    console.log('重置搜索');
    // 处理重置逻辑
  };

  return (
    <CTable
      columns={columns}
      dataSource={data}
      search={{
        onSearch: handleSearch,
        onReset: handleReset,
        defaultCollapsed: true,
      }}
    />
  );
}
```

### 带分页和工具栏

```tsx
import React, { useState } from 'react';
import { CTable, CTableColumn } from '@mass001/pro-components';

function App() {
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 100,
  });

  const handlePaginationChange = (current: number, pageSize: number) => {
    setPagination({ ...pagination, current, pageSize });
    // 加载新页面数据
  };

  const handleRefresh = () => {
    setLoading(true);
    // 刷新数据逻辑
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <CTable
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{
        ...pagination,
        onChange: handlePaginationChange,
        showSizeChanger: true,
      }}
      toolbar={{
        title: '用户列表',
        actions: {
          refresh: {
            show: true,
            onClick: handleRefresh,
            loading: loading,
          },
          create: {
            show: true,
            onClick: () => console.log('新建用户'),
            text: '新建用户',
          },
        },
      }}
    />
  );
}
```

## 📖 API 文档

### CTable Props

| 属性       | 类型                                        | 默认值      | 说明           |
| ---------- | ------------------------------------------- | ----------- | -------------- |
| columns    | `CTableColumn<T>[]`                         | -           | 表格列配置     |
| dataSource | `T[]`                                       | -           | 表格数据源     |
| loading    | `boolean`                                   | `false`     | 加载状态       |
| rowKey     | `string \| ((record: T) => string)`         | `'id'`      | 行唯一标识     |
| search     | `SearchConfig`                              | -           | 搜索配置       |
| pagination | `PaginationConfig \| false`                 | -           | 分页配置       |
| toolbar    | `ToolbarConfig`                             | -           | 工具栏配置     |
| size       | `'mini' \| 'small' \| 'default' \| 'large'` | `'default'` | 表格尺寸       |
| bordered   | `boolean`                                   | `false`     | 是否显示边框   |
| stripe     | `boolean`                                   | `false`     | 是否显示斑马纹 |

### CTableColumn

| 属性         | 类型                                                              | 说明       |
| ------------ | ----------------------------------------------------------------- | ---------- |
| title        | `string`                                                          | 列标题     |
| dataIndex    | `keyof T`                                                         | 数据字段名 |
| key          | `string`                                                          | 列唯一标识 |
| width        | `number`                                                          | 列宽度     |
| fixed        | `'left' \| 'right'`                                               | 固定列     |
| align        | `'left' \| 'center' \| 'right'`                                   | 对齐方式   |
| render       | `(value, record, index) => ReactNode`                             | 自定义渲染 |
| valueType    | `'text' \| 'number' \| 'date' \| 'dateTime' \| 'select' \| 'tag'` | 值类型     |
| sorter       | `boolean \| ((a, b) => number)`                                   | 排序配置   |
| filters      | `{ text: string; value: any }[]`                                  | 筛选配置   |
| searchConfig | `ColumnSearchConfig`                                              | 搜索配置   |

### SearchConfig

| 属性             | 类型               | 说明           |
| ---------------- | ------------------ | -------------- |
| searchConfig     | `SearchConfig[]`   | 自定义搜索配置 |
| onSearch         | `(values) => void` | 搜索回调       |
| onReset          | `() => void`       | 重置回调       |
| defaultCollapsed | `boolean`          | 默认是否收起   |

### ToolbarConfig

| 属性    | 类型             | 说明         |
| ------- | ---------------- | ------------ |
| title   | `string`         | 工具栏标题   |
| actions | `ToolbarActions` | 操作按钮配置 |
| extra   | `ReactNode`      | 额外内容     |

## 🎨 主题定制

组件基于 Arco Design，支持主题定制：

```tsx
import { ConfigProvider } from '@arco-design/web-react';

function App() {
  return (
    <ConfigProvider
      theme={{
        primaryColor: '#1890ff',
      }}
    >
      <CTable columns={columns} dataSource={data} />
    </ConfigProvider>
  );
}
```

## 🔧 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 运行测试

```bash
npm run test
```

### 构建

```bash
npm run build
```

### 启动 Storybook

```bash
npm run storybook
```

## 📝 更新日志

### 1.0.0

- 🎉 首次发布
- ✨ 支持基础表格功能
- ✨ 支持搜索、分页、排序、筛选
- ✨ 支持工具栏和错误边界
- ✨ 完整的 TypeScript 支持

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Arco Design](https://arco.design/) - 优秀的设计系统
- [React](https://reactjs.org/) - 强大的前端框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
