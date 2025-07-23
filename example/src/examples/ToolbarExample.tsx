import React, { useState } from 'react';
import { Message, Button } from '@arco-design/web-react';
import { CTable, CTableColumn } from '@mass001/pro-components';

interface Task {
  id: number;
  title: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string;
}

const mockTasks: Task[] = [
  {
    id: 1,
    title: '完成用户登录功能',
    assignee: '张三',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2024-02-15',
  },
  {
    id: 2,
    title: '设计首页UI界面',
    assignee: '李四',
    priority: 'medium',
    status: 'todo',
    dueDate: '2024-02-20',
  },
  {
    id: 3,
    title: '编写API文档',
    assignee: '王五',
    priority: 'low',
    status: 'done',
    dueDate: '2024-02-10',
  },
  {
    id: 4,
    title: '数据库优化',
    assignee: '赵六',
    priority: 'high',
    status: 'todo',
    dueDate: '2024-02-25',
  },
];

const columns: CTableColumn<Task>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '任务标题',
    dataIndex: 'title',
    width: 200,
  },
  {
    title: '负责人',
    dataIndex: 'assignee',
    width: 120,
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    width: 100,
    render: (value: Task['priority']) => {
      const priorityMap = {
        high: { text: '高', color: '#f53f3f' },
        medium: { text: '中', color: '#ff7d00' },
        low: { text: '低', color: '#00b42a' },
      };
      const priority = priorityMap[value];
      return (
        <span style={{ color: priority.color, fontWeight: 500 }}>
          {priority.text}
        </span>
      );
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    render: (value: Task['status']) => {
      const statusMap = {
        todo: { text: '待办', color: '#86909c' },
        in_progress: { text: '进行中', color: '#165dff' },
        done: { text: '已完成', color: '#00b42a' },
      };
      const status = statusMap[value];
      return (
        <span style={{ color: status.color, fontWeight: 500 }}>
          {status.text}
        </span>
      );
    },
  },
  {
    title: '截止日期',
    dataIndex: 'dueDate',
    width: 120,
    valueType: 'date',
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render: (_, record: Task) => (
      <div>
        <Button
          type="text"
          size="small"
          onClick={() => Message.info(`编辑任务: ${record.title}`)}
          style={{ marginRight: 8 }}
        >
          编辑
        </Button>
        <Button
          type="text"
          size="small"
          status="danger"
          onClick={() => Message.info(`删除任务: ${record.title}`)}
        >
          删除
        </Button>
      </div>
    ),
  },
];

const ToolbarExample: React.FC = () => {
  const [data, setData] = useState<Task[]>(mockTasks);
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    Message.info('正在刷新数据...');

    // 模拟刷新延迟
    setTimeout(() => {
      setLoading(false);
      Message.success('数据刷新成功！');
    }, 1000);
  };

  const handleExport = () => {
    Message.info('正在导出数据...');

    // 模拟导出功能
    setTimeout(() => {
      Message.success('数据导出成功！');
    }, 500);
  };

  const handleCreate = () => {
    const newTask: Task = {
      id: data.length + 1,
      title: `新任务 ${data.length + 1}`,
      assignee: '新用户',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date().toISOString().split('T')[0],
    };

    setData([...data, newTask]);
    Message.success('新任务创建成功！');
  };

  // 先使用简化版本的工具栏，使用 toolBarRender 属性
  const toolBarRender = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        padding: '12px 0',
      }}
    >
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>任务管理</h3>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={handleRefresh} loading={loading}>
          刷新
        </Button>
        <Button onClick={handleExport}>导出</Button>
        <Button type="primary" onClick={handleCreate}>
          新建任务
        </Button>
        <Button size="small" onClick={() => Message.info('批量操作')}>
          批量操作
        </Button>
        <Button size="small" onClick={() => Message.info('高级筛选')}>
          高级筛选
        </Button>
      </div>
    </div>
  );

  return (
    <CTable
      columns={columns}
      dataSource={data}
      loading={loading}
      toolBarRender={toolBarRender}
      bordered
    />
  );
};

export default ToolbarExample;
