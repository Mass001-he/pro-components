import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TableToolbar from './TableToolbar';

const meta: Meta<typeof TableToolbar> = {
  title: 'Components/TableToolbar',
  component: TableToolbar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '表格工具栏组件，支持标题、操作按钮和自定义内容。',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TableToolbar>;

// 基础工具栏
export const Basic: Story = {
  args: {
    title: '用户列表',
  },
  parameters: {
    docs: {
      description: {
        story: '只包含标题的基础工具栏。',
      },
    },
  },
};

// 带刷新按钮
export const WithRefresh: Story = {
  args: {
    title: '数据列表',
    actions: {
      refresh: {
        show: true,
        onClick: action('refresh'),
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: '带刷新按钮的工具栏。',
      },
    },
  },
};

// 带导出按钮
export const WithExport: Story = {
  args: {
    title: '报表数据',
    actions: {
      export: {
        show: true,
        onClick: action('export'),
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: '带导出按钮的工具栏。',
      },
    },
  },
};

// 带新建按钮
export const WithCreate: Story = {
  args: {
    title: '用户管理',
    actions: {
      create: {
        show: true,
        onClick: action('create'),
        text: '新增用户',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: '带新建按钮的工具栏，可以自定义按钮文本。',
      },
    },
  },
};

// 完整功能
export const FullFeatures: Story = {
  args: {
    title: '数据管理',
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
        text: '新增数据',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: '包含所有功能的工具栏：标题、刷新、导出、新建按钮。',
      },
    },
  },
};

// 加载状态
export const LoadingState: Story = {
  args: {
    title: '数据处理中',
    actions: {
      refresh: {
        show: true,
        onClick: action('refresh'),
        loading: true,
      },
      export: {
        show: true,
        onClick: action('export'),
        loading: true,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: '按钮加载状态的工具栏。',
      },
    },
  },
};

// 带额外内容
export const WithExtra: Story = {
  args: {
    title: '高级功能',
    actions: {
      refresh: {
        show: true,
        onClick: action('refresh'),
      },
    },
    extra: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={action('custom-action-1')}>自定义按钮1</button>
        <button onClick={action('custom-action-2')}>自定义按钮2</button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '带额外自定义内容的工具栏。',
      },
    },
  },
};

// 自定义渲染
export const CustomRender: Story = {
  args: {
    customRender: () => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #e5e5e5'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>自定义工具栏</h2>
          <span style={{ color: '#666', fontSize: '14px' }}>共 100 条数据</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={action('filter')}>筛选</button>
          <button onClick={action('sort')}>排序</button>
          <button onClick={action('settings')}>设置</button>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '完全自定义渲染的工具栏。',
      },
    },
  },
};

// 只有操作按钮
export const ActionsOnly: Story = {
  args: {
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
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: '只包含操作按钮，没有标题的工具栏。',
      },
    },
  },
};

// 空工具栏
export const Empty: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '空配置时不会渲染任何内容。',
      },
    },
  },
};
