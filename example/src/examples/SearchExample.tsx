import React, { useState } from 'react';
import { Message } from '@arco-design/web-react';
import { CTable, CTableColumn } from '@mass001/pro-components';

interface Employee {
  id: number;
  name: string;
  age: number;
  department: string;
  position: string;
  salary: number;
  status: 'active' | 'inactive' | 'pending';
  hireDate: string;
}

const generateMockData = (): Employee[] => [
  {
    id: 1,
    name: '张三',
    age: 25,
    department: '技术部',
    position: '前端工程师',
    salary: 15000,
    status: 'active',
    hireDate: '2023-01-15',
  },
  {
    id: 2,
    name: '李四',
    age: 30,
    department: '产品部',
    position: '产品经理',
    salary: 18000,
    status: 'active',
    hireDate: '2022-08-20',
  },
  {
    id: 3,
    name: '王五',
    age: 28,
    department: '设计部',
    position: 'UI设计师',
    salary: 12000,
    status: 'inactive',
    hireDate: '2023-03-10',
  },
  {
    id: 4,
    name: '赵六',
    age: 32,
    department: '技术部',
    position: '后端工程师',
    salary: 16000,
    status: 'pending',
    hireDate: '2023-06-01',
  },
  {
    id: 5,
    name: '钱七',
    age: 26,
    department: '运营部',
    position: '运营专员',
    salary: 10000,
    status: 'active',
    hireDate: '2023-09-15',
  },
];

const columns: CTableColumn<Employee>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
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
    searchConfig: {
      type: 'numberRange',
    },
  },
  {
    title: '部门',
    dataIndex: 'department',
    width: 120,
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
    render: (value: number) => `¥${value.toLocaleString()}`,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    searchConfig: {
      type: 'select',
      options: [
        { label: '在职', value: 'active' },
        { label: '离职', value: 'inactive' },
        { label: '待入职', value: 'pending' },
      ],
    },
    render: (value: Employee['status']) => {
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
    title: '入职时间',
    dataIndex: 'hireDate',
    width: 120,
    valueType: 'date',
    searchConfig: {
      type: 'dateRange',
    },
  },
];

const SearchExample: React.FC = () => {
  const [data, setData] = useState<Employee[]>(generateMockData());
  const [originalData] = useState<Employee[]>(generateMockData());

  const handleSearch = (values: Record<string, any>) => {
    console.log('搜索参数:', values);
    Message.info(`搜索参数: ${JSON.stringify(values)}`);

    // 简单的前端过滤逻辑（实际项目中应该调用后端API）
    let filteredData = [...originalData];

    if (values.name) {
      filteredData = filteredData.filter(item =>
        item.name.includes(values.name)
      );
    }

    if (values.department) {
      filteredData = filteredData.filter(
        item => item.department === values.department
      );
    }

    if (values.status) {
      filteredData = filteredData.filter(item => item.status === values.status);
    }

    if (values.age && (values.age.min || values.age.max)) {
      filteredData = filteredData.filter(item => {
        const { min, max } = values.age;
        if (min && item.age < min) return false;
        if (max && item.age > max) return false;
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
    console.log('重置搜索');
    Message.info('已重置搜索条件');
    setData(originalData);
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
      bordered
    />
  );
};

export default SearchExample;
