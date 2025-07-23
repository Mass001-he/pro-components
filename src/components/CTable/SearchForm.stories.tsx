import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SearchForm from './SearchForm';
import { SearchConfig } from './types';

const basicSearchConfig: SearchConfig[] = [
  {
    name: 'name',
    label: '姓名',
    type: 'input',
    placeholder: '请输入姓名',
  },
  {
    name: 'email',
    label: '邮箱',
    type: 'input',
    placeholder: '请输入邮箱地址',
  },
];

const advancedSearchConfig: SearchConfig[] = [
  {
    name: 'name',
    label: '姓名',
    type: 'input',
    placeholder: '请输入姓名',
  },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' },
    ],
  },
  {
    name: 'dateRange',
    label: '创建时间',
    type: 'dateRange',
  },
  {
    name: 'ageRange',
    label: '年龄范围',
    type: 'numberRange',
  },
  {
    name: 'department',
    label: '部门',
    type: 'select',
    options: [
      { label: '技术部', value: 'tech' },
      { label: '产品部', value: 'product' },
      { label: '设计部', value: 'design' },
    ],
  },
  {
    name: 'level',
    label: '级别',
    type: 'select',
    options: [
      { label: '初级', value: 'junior' },
      { label: '中级', value: 'middle' },
      { label: '高级', value: 'senior' },
    ],
  },
];

const meta: Meta<typeof SearchForm> = {
  title: 'Components/SearchForm',
  component: SearchForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '搜索表单组件，支持多种搜索控件类型和展开/收起功能。',
      },
    },
  },
  argTypes: {
    defaultCollapsed: {
      control: 'boolean',
      description: '默认是否收起',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchForm>;

// 基础搜索表单
export const Basic: Story = {
  args: {
    searchConfig: basicSearchConfig,
    onSearch: action('search'),
    onReset: action('reset'),
    defaultCollapsed: false,
  },
  parameters: {
    docs: {
      description: {
        story: '基础的搜索表单，包含输入框类型的搜索字段。',
      },
    },
  },
};

// 多种控件类型
export const MultipleTypes: Story = {
  args: {
    searchConfig: [
      {
        name: 'keyword',
        label: '关键词',
        type: 'input',
        placeholder: '请输入关键词',
      },
      {
        name: 'category',
        label: '分类',
        type: 'select',
        options: [
          { label: '前端', value: 'frontend' },
          { label: '后端', value: 'backend' },
          { label: '全栈', value: 'fullstack' },
        ],
      },
      {
        name: 'dateRange',
        label: '日期范围',
        type: 'dateRange',
      },
      {
        name: 'scoreRange',
        label: '评分范围',
        type: 'numberRange',
      },
    ],
    onSearch: action('search'),
    onReset: action('reset'),
    defaultCollapsed: false,
  },
  parameters: {
    docs: {
      description: {
        story: '展示不同类型的搜索控件：输入框、选择器、日期范围、数字范围。',
      },
    },
  },
};

// 默认收起状态
export const DefaultCollapsed: Story = {
  args: {
    searchConfig: advancedSearchConfig,
    onSearch: action('search'),
    onReset: action('reset'),
    defaultCollapsed: true,
  },
  parameters: {
    docs: {
      description: {
        story: '默认收起状态的搜索表单，超过3个字段时会显示展开/收起按钮。',
      },
    },
  },
};

// 展开状态
export const Expanded: Story = {
  args: {
    searchConfig: advancedSearchConfig,
    onSearch: action('search'),
    onReset: action('reset'),
    defaultCollapsed: false,
  },
  parameters: {
    docs: {
      description: {
        story: '展开状态的搜索表单，显示所有搜索字段。',
      },
    },
  },
};

// 只有输入框
export const InputOnly: Story = {
  args: {
    searchConfig: [
      {
        name: 'name',
        label: '姓名',
        type: 'input',
        placeholder: '请输入姓名',
      },
      {
        name: 'phone',
        label: '手机号',
        type: 'input',
        placeholder: '请输入手机号',
      },
      {
        name: 'email',
        label: '邮箱',
        type: 'input',
        placeholder: '请输入邮箱',
      },
    ],
    onSearch: action('search'),
    onReset: action('reset'),
  },
  parameters: {
    docs: {
      description: {
        story: '只包含输入框类型的搜索表单。',
      },
    },
  },
};

// 只有选择器
export const SelectOnly: Story = {
  args: {
    searchConfig: [
      {
        name: 'status',
        label: '状态',
        type: 'select',
        options: [
          { label: '启用', value: 'active' },
          { label: '禁用', value: 'inactive' },
        ],
      },
      {
        name: 'type',
        label: '类型',
        type: 'select',
        options: [
          { label: '管理员', value: 'admin' },
          { label: '普通用户', value: 'user' },
        ],
      },
      {
        name: 'role',
        label: '角色',
        type: 'select',
        options: [
          { label: '开发者', value: 'developer' },
          { label: '测试者', value: 'tester' },
          { label: '产品经理', value: 'pm' },
        ],
      },
    ],
    onSearch: action('search'),
    onReset: action('reset'),
  },
  parameters: {
    docs: {
      description: {
        story: '只包含选择器类型的搜索表单。',
      },
    },
  },
};

// 空配置
export const EmptyConfig: Story = {
  args: {
    searchConfig: [],
    onSearch: action('search'),
    onReset: action('reset'),
  },
  parameters: {
    docs: {
      description: {
        story: '空配置时不会渲染任何内容。',
      },
    },
  },
};
