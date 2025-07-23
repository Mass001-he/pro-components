import React from 'react';
import { CTable, CTableColumn } from '@mass/pro-components';

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  department: string;
}

const mockData: User[] = [
  {
    id: 1,
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
    department: '技术部',
  },
  {
    id: 2,
    name: '李四',
    age: 30,
    email: 'lisi@example.com',
    department: '产品部',
  },
  {
    id: 3,
    name: '王五',
    age: 28,
    email: 'wangwu@example.com',
    department: '设计部',
  },
  {
    id: 4,
    name: '赵六',
    age: 35,
    email: 'zhaoliu@example.com',
    department: '运营部',
  },
];

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
  {
    title: '部门',
    dataIndex: 'department',
    width: 120,
  },
];

const BasicExample: React.FC = () => {
  return <CTable columns={columns} dataSource={mockData} bordered />;
};

export default BasicExample;
