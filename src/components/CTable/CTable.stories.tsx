import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CTable from './index';
import { CTableColumn } from './types';

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  status: 'active' | 'inactive';
  tags: string[];
  createTime: string;
  score: number;
}

const mockData: User[] = [
  {
    id: 1,
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
    status: 'active',
    tags: ['前端', 'React'],
    createTime: '2023-01-15T10:30:00Z',
    score: 95.5,
  },
  {
    id: 2,
    name: '李四',
    age: 30,
    email: 'lisi@example.com',
    status: 'inactive',
    tags: ['后端', 'Node.js', 'Python'],
    createTime: '2023-02-20T14:20:00Z',
    score: 88.2,
  },
  {
    id: 3,
    name: '王五',
    age: 28,
    email: 'wangwu@example.com',
    status: 'active',
    tags: ['全栈'],
    createTime: '2023-03-10T09:15:00Z',
    score: 92.8,
  },
  {
    id: 4,
    name: '赵六',
    age: 35,
    email: 'zhaoliu@example.com',
    status: 'active',
    tags: ['DevOps', 'Docker'],
    createTime: '2023-04-05T16:45:00Z',
    score: 87.3,
  },
  {
    id: 5,
    name: '钱七',
    age: 26,
    email: 'qianqi@example.com',
    status: 'inactive',
    tags: ['UI/UX'],
    createTime: '2023-05-12T11:30:00Z',
    score: 91.7,
  },
];

const basicColumns: CTableColumn<User>[] = [
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
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (value) => (
      <span style={{ 
        color: value === 'active' ? '#00b42a' : '#f53f3f',
        fontWeight: 500 
      }}>
        {value === 'active' ? '启用' : '禁用'}
      </span>
    ),
  },
];

const advancedColumns: CTableColumn<User>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
    fixed: 'left',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
    fixed: 'left',
    searchConfig: {
      type: 'input',
      placeholder: '请输入姓名',
    },
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 80,
    valueType: 'number',
    sorter: true,
    searchConfig: {
      type: 'numberRange',
    },
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 200,
    searchConfig: {
      type: 'input',
      placeholder: '请输入邮箱',
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    filters: [
      { text: '启用', value: 'active' },
      { text: '禁用', value: 'inactive' },
    ],
    onFilter: (value, record) => record.status === value,
    searchConfig: {
      type: 'select',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' },
      ],
    },
    render: (value) => (
      <span style={{ 
        color: value === 'active' ? '#00b42a' : '#f53f3f',
        fontWeight: 500 
      }}>
        {value === 'active' ? '启用' : '禁用'}
      </span>
    ),
  },
  {
    title: '技能标签',
    dataIndex: 'tags',
    width: 200,
    valueType: 'tag',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    valueType: 'dateTime',
    searchConfig: {
      type: 'dateRange',
    },
  },
  {
    title: '评分',
    dataIndex: 'score',
    width: 100,
    valueType: 'number',
    sorter: true,
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right',
    render: (_, record) => (
      <div>
        <button 
          style={{ marginRight: 8, color: '#1890ff', border: 'none', background: 'none', cursor: 'pointer' }}
          onClick={() => action('edit')(record)}
        >
          编辑
        </button>
        <button 
          style={{ color: '#f53f3f', border: 'none', background: 'none', cursor: 'pointer' }}
          onClick={() => action('delete')(record)}
        >
          删除
        </button>
      </div>
    ),
  },
];

const meta: Meta<typeof CTable> = {
  title: 'Components/CTable',
  component: CTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '基于 Arco Design 的高级表格组件，提供搜索、分页、排序、筛选等功能。',
      },
    },
  },
  argTypes: {
    loading: {
      control: 'boolean',
      description: '表格加载状态',
    },
    size: {
      control: 'select',
      options: ['mini', 'small', 'default', 'large'],
      description: '表格尺寸',
    },
    bordered: {
      control: 'boolean',
      description: '是否显示边框',
    },
    stripe: {
      control: 'boolean',
      description: '是否显示斑马纹',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CTable>;

// 基础表格
export const Basic: Story = {
  args: {
    columns: basicColumns,
    dataSource: mockData,
  },
  parameters: {
    docs: {
      description: {
        story: '最基本的表格使用方式，只需要提供 columns 和 dataSource。',
      },
    },
  },
};

// 加载状态
export const Loading: Story = {
  args: {
    columns: basicColumns,
    dataSource: mockData,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: '表格加载状态展示。',
      },
    },
  },
};

// 不同尺寸
export const Sizes: Story = {
  args: {
    columns: basicColumns,
    dataSource: mockData.slice(0, 3),
    size: 'small',
  },
  parameters: {
    docs: {
      description: {
        story: '表格支持不同的尺寸：mini、small、default、large。',
      },
    },
  },
};

// 带边框和斑马纹
export const StyledTable: Story = {
  args: {
    columns: basicColumns,
    dataSource: mockData,
    bordered: true,
    stripe: true,
  },
  parameters: {
    docs: {
      description: {
        story: '带边框和斑马纹的表格样式。',
      },
    },
  },
};

// 带搜索功能
export const WithSearch: Story = {
  args: {
    columns: advancedColumns,
    dataSource: mockData,
    search: {
      onSearch: action('search'),
      onReset: action('reset'),
      defaultCollapsed: false,
    },
  },
  parameters: {
    docs: {
      description: {
        story: '带搜索功能的表格，支持多种搜索控件类型。',
      },
    },
  },
};

// 带分页功能
export const WithPagination: Story = {
  args: {
    columns: basicColumns,
    dataSource: mockData,
    pagination: {
      current: 1,
      pageSize: 3,
      total: mockData.length,
      showSizeChanger: true,
      onChange: action('pagination-change'),
    },
  },
  parameters: {
    docs: {
      description: {
        story: '带分页功能的表格，支持页面大小选择。',
      },
    },
  },
};

// 带工具栏
export const WithToolbar: Story = {
  args: {
    columns: basicColumns,
    dataSource: mockData,
    toolbar: {
      title: '用户列表',
      actions: {
        refresh: {
          show: true,
          onClick: action('refresh'),
        },
        export: {
          show: true,
          onClick: action('export'),
        },
        create: {
          show: true,
          onClick: action('create'),
          text: '新增用户',
        },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: '带工具栏的表格，支持标题和常用操作按钮。',
      },
    },
  },
};

// 完整功能
export const FullFeatures: Story = {
  args: {
    columns: advancedColumns,
    dataSource: mockData,
    loading: false,
    search: {
      onSearch: action('search'),
      onReset: action('reset'),
      defaultCollapsed: true,
    },
    pagination: {
      current: 1,
      pageSize: 3,
      total: mockData.length,
      showSizeChanger: true,
      onChange: action('pagination-change'),
    },
    toolbar: {
      title: '用户管理',
      actions: {
        refresh: {
          show: true,
          onClick: action('refresh'),
        },
        export: {
          show: true,
          onClick: action('export'),
        },
        create: {
          show: true,
          onClick: action('create'),
          text: '新增用户',
        },
      },
    },
    bordered: true,
  },
  parameters: {
    docs: {
      description: {
        story: '展示 CTable 的完整功能：搜索、分页、工具栏、排序、筛选等。',
      },
    },
  },
};

// 空数据
export const EmptyData: Story = {
  args: {
    columns: basicColumns,
    dataSource: [],
  },
  parameters: {
    docs: {
      description: {
        story: '空数据状态的表格展示。',
      },
    },
  },
};

// 错误状态
export const ErrorState: Story = {
  args: {
    columns: [],
    dataSource: mockData,
  },
  parameters: {
    docs: {
      description: {
        story: '错误配置时的表格展示（空 columns）。',
      },
    },
  },
};
