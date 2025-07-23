import React, { useState } from 'react';
import { Message, Tag, Button } from '@arco-design/web-react';
import { CTable, CTableColumn } from '@mass001/pro-components';

interface Employee {
  id: number;
  name: string;
  avatar: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  skills: string[];
  performance: number;
  status: 'active' | 'inactive' | 'pending';
  hireDate: string;
  lastLogin: string;
}

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: '张三',
    avatar: '👨‍💻',
    email: 'zhangsan@company.com',
    department: '技术部',
    position: '高级前端工程师',
    salary: 25000,
    skills: ['React', 'TypeScript', 'Node.js'],
    performance: 92,
    status: 'active',
    hireDate: '2022-03-15',
    lastLogin: '2024-01-20T09:30:00Z',
  },
  {
    id: 2,
    name: '李四',
    avatar: '👩‍💼',
    email: 'lisi@company.com',
    department: '产品部',
    position: '产品经理',
    salary: 22000,
    skills: ['产品设计', '用户研究', 'Axure'],
    performance: 88,
    status: 'active',
    hireDate: '2021-08-20',
    lastLogin: '2024-01-19T16:45:00Z',
  },
  {
    id: 3,
    name: '王五',
    avatar: '🎨',
    email: 'wangwu@company.com',
    department: '设计部',
    position: 'UI设计师',
    salary: 18000,
    skills: ['Figma', 'Sketch', 'Photoshop'],
    performance: 85,
    status: 'inactive',
    hireDate: '2023-01-10',
    lastLogin: '2024-01-15T11:20:00Z',
  },
  {
    id: 4,
    name: '赵六',
    avatar: '⚙️',
    email: 'zhaoliu@company.com',
    department: '技术部',
    position: '后端工程师',
    salary: 23000,
    skills: ['Java', 'Spring', 'MySQL'],
    performance: 90,
    status: 'active',
    hireDate: '2022-06-01',
    lastLogin: '2024-01-20T08:15:00Z',
  },
  {
    id: 5,
    name: '钱七',
    avatar: '📊',
    email: 'qianqi@company.com',
    department: '运营部',
    position: '数据分析师',
    salary: 20000,
    skills: ['Python', 'SQL', 'Tableau'],
    performance: 87,
    status: 'pending',
    hireDate: '2023-09-15',
    lastLogin: '2024-01-18T14:30:00Z',
  },
  {
    id: 6,
    name: '孙八',
    avatar: '🔧',
    email: 'sunba@company.com',
    department: '技术部',
    position: 'DevOps工程师',
    salary: 24000,
    skills: ['Docker', 'Kubernetes', 'AWS'],
    performance: 94,
    status: 'active',
    hireDate: '2021-12-01',
    lastLogin: '2024-01-20T07:45:00Z',
  },
];

const columns: CTableColumn<Employee>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
    fixed: 'left',
  },
  {
    title: '员工信息',
    key: 'employee',
    width: 220,
    fixed: 'left',
    render: (_, record: Employee) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '24px', marginRight: '8px' }}>
          {record.avatar}
        </span>
        <div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#86909c' }}>
            {record.email}
          </div>
        </div>
      </div>
    ),
    searchConfig: {
      type: 'input',
      placeholder: '请输入姓名或邮箱',
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
    ],
    onFilter: (value: any, record: Employee) => record.department === value,
    searchConfig: {
      type: 'select',
      options: [
        { label: '技术部', value: '技术部' },
        { label: '产品部', value: '产品部' },
        { label: '设计部', value: '设计部' },
        { label: '运营部', value: '运营部' },
      ],
    },
  },
  {
    title: '职位',
    dataIndex: 'position',
    width: 140,
  },
  {
    title: '薪资',
    dataIndex: 'salary',
    width: 120,
    valueType: 'number',
    sorter: true,
    render: (value: number) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontWeight: 500 }}>¥{value.toLocaleString()}</span>
        <div
          style={{
            marginLeft: 8,
            width: 40,
            height: 4,
            backgroundColor: '#f2f3f5',
            borderRadius: 2,
          }}
        >
          <div
            style={{
              width: `${Math.min((value / 30000) * 100, 100)}%`,
              height: '100%',
              backgroundColor: value > 20000 ? '#00b42a' : '#165dff',
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    ),
    searchConfig: {
      type: 'numberRange',
    },
  },
  {
    title: '技能',
    dataIndex: 'skills',
    width: 200,
    render: (skills: string[]) => (
      <div>
        {skills.map((skill: string, index: number) => (
          <Tag
            key={index}
            size="small"
            style={{ marginRight: 4, marginBottom: 2 }}
          >
            {skill}
          </Tag>
        ))}
      </div>
    ),
  },
  {
    title: '绩效评分',
    dataIndex: 'performance',
    width: 120,
    sorter: true,
    render: (value: number) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 8, fontWeight: 500 }}>{value}</span>
        <div
          style={{
            width: 60,
            height: 6,
            backgroundColor: '#f2f3f5',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${value}%`,
              height: '100%',
              backgroundColor:
                value >= 90 ? '#00b42a' : value >= 80 ? '#ff7d00' : '#f53f3f',
              borderRadius: 3,
            }}
          />
        </div>
      </div>
    ),
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
    onFilter: (value: any, record: Employee) => record.status === value,
    render: (value: Employee['status']) => {
      const statusMap = {
        active: { text: '在职', color: '#00b42a' },
        inactive: { text: '离职', color: '#f53f3f' },
        pending: { text: '待入职', color: '#ff7d00' },
      };
      const status = statusMap[value];
      return (
        <Tag color={status.color} size="small">
          {status.text}
        </Tag>
      );
    },
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
    title: '最后登录',
    dataIndex: 'lastLogin',
    width: 150,
    valueType: 'dateTime',
    sorter: true,
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right',
    render: (_, record: Employee) => (
      <div>
        <Button
          type="text"
          size="small"
          onClick={() => Message.info(`查看 ${record.name} 的详细信息`)}
          style={{ marginRight: 4 }}
        >
          查看
        </Button>
        <Button
          type="text"
          size="small"
          onClick={() => Message.info(`编辑 ${record.name} 的信息`)}
          style={{ marginRight: 4 }}
        >
          编辑
        </Button>
        <Button
          type="text"
          size="small"
          status="danger"
          onClick={() => Message.warning(`确定要删除 ${record.name} 吗？`)}
        >
          删除
        </Button>
      </div>
    ),
  },
];

const AdvancedExample: React.FC = () => {
  const [data, setData] = useState<Employee[]>(mockEmployees);
  const [loading, setLoading] = useState(false);

  const handleSearch = (values: Record<string, any>) => {
    console.log('搜索参数:', values);
    Message.info(`搜索: ${JSON.stringify(values)}`);

    // 简单的前端过滤逻辑
    let filteredData = [...mockEmployees];

    if (values.employee) {
      filteredData = filteredData.filter(
        item =>
          item.name.includes(values.employee) ||
          item.email.includes(values.employee)
      );
    }

    if (values.department) {
      filteredData = filteredData.filter(
        item => item.department === values.department
      );
    }

    if (values.salary && (values.salary.min || values.salary.max)) {
      filteredData = filteredData.filter(item => {
        const { min, max } = values.salary;
        if (min && item.salary < min) return false;
        if (max && item.salary > max) return false;
        return true;
      });
    }

    if (values.hireDate && values.hireDate.length === 2) {
      const [startDate, endDate] = values.hireDate;
      filteredData = filteredData.filter(item => {
        const hireDate = new Date(item.hireDate);
        return hireDate >= new Date(startDate) && hireDate <= new Date(endDate);
      });
    }

    setData(filteredData);
  };

  const handleReset = () => {
    setData(mockEmployees);
    Message.info('已重置搜索条件');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Message.success('数据刷新成功！');
    }, 1000);
  };

  // 使用 toolBarRender 替代 toolbar 属性
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
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>员工管理系统</h3>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={handleRefresh} loading={loading}>
          刷新
        </Button>
        <Button onClick={() => Message.info('导出员工数据')}>导出</Button>
        <Button type="primary" onClick={() => Message.info('新增员工')}>
          新增员工
        </Button>
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <CTable
        columns={columns}
        dataSource={data}
        loading={loading}
        search={{
          onSearch: handleSearch,
          onReset: handleReset,
          defaultCollapsed: true,
        }}
        toolBarRender={toolBarRender}
        pagination={{
          pageSize: 5,
          sizeCanChange: true,
          sizeOptions: [5, 10, 20],
        }}
        bordered
        size="default"
        scroll={{ x: 1500 }}
      />
    </div>
  );
};

export default AdvancedExample;
