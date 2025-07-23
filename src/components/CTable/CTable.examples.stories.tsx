import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { action } from '@storybook/addon-actions';
import CTable from './index';
import { CTableColumn } from './types';

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive' | 'pending';
  skills: string[];
  performance: number;
  email: string;
  phone: string;
}

const generateMockData = (count: number): Employee[] => {
  const departments = ['技术部', '产品部', '设计部', '运营部', '市场部'];
  const positions = ['工程师', '高级工程师', '技术专家', '经理', '总监'];
  const skills = ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'Go', 'TypeScript'];
  const statuses: Employee['status'][] = ['active', 'inactive', 'pending'];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `员工${index + 1}`,
    position: positions[Math.floor(Math.random() * positions.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    salary: Math.floor(Math.random() * 50000) + 10000,
    hireDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    skills: skills.slice(0, Math.floor(Math.random() * 4) + 1),
    performance: Math.floor(Math.random() * 40) + 60,
    email: `employee${index + 1}@company.com`,
    phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
  }));
};

const columns: CTableColumn<Employee>[] = [
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
    title: '职位',
    dataIndex: 'position',
    width: 120,
    searchConfig: {
      type: 'select',
      options: [
        { label: '工程师', value: '工程师' },
        { label: '高级工程师', value: '高级工程师' },
        { label: '技术专家', value: '技术专家' },
        { label: '经理', value: '经理' },
        { label: '总监', value: '总监' },
      ],
    },
  },
  {
    title: '部门',
    dataIndex: 'department',
    width: 100,
    filters: [
      { text: '技术部', value: '技术部' },
      { text: '产品部', value: '产品部' },
      { text: '设计部', value: '设计部' },
      { text: '运营部', value: '运营部' },
      { text: '市场部', value: '市场部' },
    ],
    onFilter: (value, record) => record.department === value,
    searchConfig: {
      type: 'select',
      options: [
        { label: '技术部', value: '技术部' },
        { label: '产品部', value: '产品部' },
        { label: '设计部', value: '设计部' },
        { label: '运营部', value: '运营部' },
        { label: '市场部', value: '市场部' },
      ],
    },
  },
  {
    title: '薪资',
    dataIndex: 'salary',
    width: 120,
    valueType: 'number',
    sorter: true,
    searchConfig: {
      type: 'numberRange',
    },
    render: (value) => `¥${value.toLocaleString()}`,
  },
  {
    title: '入职时间',
    dataIndex: 'hireDate',
    width: 120,
    valueType: 'date',
    sorter: true,
    searchConfig: {
      type: 'dateRange',
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    filters: [
      { text: '在职', value: 'active' },
      { text: '离职', value: 'inactive' },
      { text: '待入职', value: 'pending' },
    ],
    onFilter: (value, record) => record.status === value,
    searchConfig: {
      type: 'select',
      options: [
        { label: '在职', value: 'active' },
        { label: '离职', value: 'inactive' },
        { label: '待入职', value: 'pending' },
      ],
    },
    render: (value) => {
      const statusMap = {
        active: { text: '在职', color: '#00b42a' },
        inactive: { text: '离职', color: '#f53f3f' },
        pending: { text: '待入职', color: '#ff7d00' },
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
    title: '技能',
    dataIndex: 'skills',
    width: 200,
    valueType: 'tag',
  },
  {
    title: '绩效评分',
    dataIndex: 'performance',
    width: 100,
    sorter: true,
    render: (value) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 8 }}>{value}</span>
        <div style={{
          width: 60,
          height: 6,
          backgroundColor: '#f0f0f0',
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${value}%`,
            height: '100%',
            backgroundColor: value >= 80 ? '#00b42a' : value >= 60 ? '#ff7d00' : '#f53f3f',
          }} />
        </div>
      </div>
    ),
  },
  {
    title: '联系方式',
    key: 'contact',
    width: 200,
    render: (_, record) => (
      <div>
        <div style={{ fontSize: 12, color: '#666' }}>{record.email}</div>
        <div style={{ fontSize: 12, color: '#666' }}>{record.phone}</div>
      </div>
    ),
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
          onClick={() => action('view')(record)}
        >
          查看
        </button>
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

// 模拟异步数据加载
const useEmployeeData = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const loadData = async (params?: any) => {
    setLoading(true);
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const allData = generateMockData(100);
    let filteredData = allData;

    // 模拟搜索过滤
    if (params?.name) {
      filteredData = filteredData.filter(item => 
        item.name.includes(params.name)
      );
    }
    if (params?.department) {
      filteredData = filteredData.filter(item => 
        item.department === params.department
      );
    }
    if (params?.status) {
      filteredData = filteredData.filter(item => 
        item.status === params.status
      );
    }

    // 模拟分页
    const { current = 1, pageSize = 10 } = params || {};
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredData.slice(startIndex, endIndex);

    setData(pageData);
    setPagination({
      current,
      pageSize,
      total: filteredData.length,
    });
    setLoading(false);
  };

  return {
    data,
    loading,
    pagination,
    loadData,
  };
};

const meta: Meta = {
  title: 'Examples/Employee Management',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '员工管理系统示例，展示 CTable 在实际业务场景中的使用。',
      },
    },
  },
};

export default meta;

// 员工管理系统
export const EmployeeManagement: StoryObj = {
  render: () => {
    const { data, loading, pagination, loadData } = useEmployeeData();

    // 初始化数据
    React.useEffect(() => {
      loadData({ current: 1, pageSize: 10 });
    }, []);

    const handleSearch = (values: Record<string, any>) => {
      action('search')(values);
      loadData({ ...values, current: 1, pageSize: pagination.pageSize });
    };

    const handleReset = () => {
      action('reset')();
      loadData({ current: 1, pageSize: pagination.pageSize });
    };

    const handlePaginationChange = (current: number, pageSize: number) => {
      action('pagination-change')(current, pageSize);
      loadData({ current, pageSize });
    };

    const handleRefresh = () => {
      action('refresh')();
      loadData({ current: pagination.current, pageSize: pagination.pageSize });
    };

    return (
      <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px' }}>
          <CTable
            columns={columns}
            dataSource={data}
            loading={loading}
            search={{
              onSearch: handleSearch,
              onReset: handleReset,
              defaultCollapsed: true,
            }}
            pagination={{
              ...pagination,
              onChange: handlePaginationChange,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            toolbar={{
              title: '员工管理',
              actions: {
                refresh: {
                  show: true,
                  onClick: handleRefresh,
                  loading: loading,
                },
                export: {
                  show: true,
                  onClick: () => action('export')(),
                },
                create: {
                  show: true,
                  onClick: () => action('create')(),
                  text: '新增员工',
                },
              },
            }}
            bordered
            size="default"
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '完整的员工管理系统示例，包含搜索、分页、排序、筛选等功能，模拟真实的业务场景。',
      },
    },
  },
};
