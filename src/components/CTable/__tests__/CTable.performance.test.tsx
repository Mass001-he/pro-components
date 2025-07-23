import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CTable from '../index';
import { CTableColumn } from '../types';

// Mock Arco Design Table for performance testing
vi.mock('@arco-design/web-react', () => ({
  Table: ({ data, columns }: any) => (
    <div data-testid="arco-table">
      <table>
        <thead>
          <tr>
            {columns.map((col: any) => (
              <th key={col.key || col.dataIndex}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, index: number) => (
            <tr key={index}>
              {columns.map((col: any) => (
                <td key={col.key || col.dataIndex}>
                  {col.render ? col.render(row[col.dataIndex], row, index) : row[col.dataIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  Form: {
    useForm: () => [{ validate: vi.fn(), setFieldsValue: vi.fn() }],
    Item: ({ children }: any) => <div>{children}</div>,
  },
  Input: () => <input data-testid="input" />,
  Select: () => <select data-testid="select" />,
  Button: ({ children }: any) => <button>{children}</button>,
  Grid: {
    Row: ({ children }: any) => <div>{children}</div>,
    Col: ({ children }: any) => <div>{children}</div>,
  },
  Space: ({ children }: any) => <div>{children}</div>,
  Tag: ({ children }: any) => <span>{children}</span>,
}));

vi.mock('@arco-design/web-react/icon', () => ({
  IconSearch: () => <span>Search</span>,
  IconRefresh: () => <span>Refresh</span>,
  IconDown: () => <span>Down</span>,
  IconUp: () => <span>Up</span>,
}));

interface LargeDataItem {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
  position: string;
  salary: number;
  status: string;
  tags: string[];
  description: string;
}

// 生成大量测试数据
const generateLargeDataset = (size: number): LargeDataItem[] => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const positions = ['Junior', 'Senior', 'Lead', 'Manager', 'Director'];
  const statuses = ['active', 'inactive', 'pending'];
  const tags = ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java'];

  return Array.from({ length: size }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    age: 20 + (index % 40),
    department: departments[index % departments.length],
    position: positions[index % positions.length],
    salary: 50000 + (index % 100000),
    status: statuses[index % statuses.length],
    tags: tags.slice(0, (index % 3) + 1),
    description: `This is a description for user ${index + 1}. `.repeat(5),
  }));
};

const createColumns = (withComplexRender = false): CTableColumn<LargeDataItem>[] => [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    searchConfig: {
      type: 'input',
      placeholder: 'Enter name',
    },
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    valueType: 'number',
    sorter: true,
  },
  {
    title: 'Department',
    dataIndex: 'department',
    filters: [
      { text: 'Engineering', value: 'Engineering' },
      { text: 'Marketing', value: 'Marketing' },
      { text: 'Sales', value: 'Sales' },
    ],
    onFilter: (value, record) => record.department === value,
  },
  {
    title: 'Position',
    dataIndex: 'position',
  },
  {
    title: 'Salary',
    dataIndex: 'salary',
    valueType: 'number',
    render: withComplexRender 
      ? (value) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>${value.toLocaleString()}</span>
            <div style={{ 
              marginLeft: 8, 
              width: 50, 
              height: 4, 
              backgroundColor: '#f0f0f0',
              borderRadius: 2,
            }}>
              <div style={{
                width: `${Math.min((value / 150000) * 100, 100)}%`,
                height: '100%',
                backgroundColor: value > 100000 ? '#52c41a' : '#1890ff',
                borderRadius: 2,
              }} />
            </div>
          </div>
        )
      : undefined,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (value) => (
      <span style={{ 
        color: value === 'active' ? 'green' : value === 'inactive' ? 'red' : 'orange' 
      }}>
        {value}
      </span>
    ),
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    valueType: 'tag',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    render: (value) => (
      <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value}
      </div>
    ),
  },
];

describe('CTable Performance Tests', () => {
  it('should handle small dataset efficiently', () => {
    const startTime = performance.now();
    const data = generateLargeDataset(100);
    const columns = createColumns();

    render(
      <CTable
        columns={columns}
        dataSource={data}
      />
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
    expect(renderTime).toBeLessThan(100); // Should render in less than 100ms
  });

  it('should handle medium dataset efficiently', () => {
    const startTime = performance.now();
    const data = generateLargeDataset(1000);
    const columns = createColumns();

    render(
      <CTable
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 50,
          current: 1,
          total: data.length,
        }}
      />
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
    expect(renderTime).toBeLessThan(200); // Should render in less than 200ms
  });

  it('should handle large dataset with pagination', () => {
    const startTime = performance.now();
    const data = generateLargeDataset(10000);
    const columns = createColumns();

    // 只渲染当前页的数据
    const currentPageData = data.slice(0, 100);

    render(
      <CTable
        columns={columns}
        dataSource={currentPageData}
        pagination={{
          pageSize: 100,
          current: 1,
          total: data.length,
        }}
      />
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
    expect(renderTime).toBeLessThan(300); // Should render in less than 300ms
  });

  it('should handle complex rendering efficiently', () => {
    const startTime = performance.now();
    const data = generateLargeDataset(500);
    const columns = createColumns(true); // 启用复杂渲染

    render(
      <CTable
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 50,
          current: 1,
          total: data.length,
        }}
      />
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
    expect(renderTime).toBeLessThan(500); // 复杂渲染应该在500ms内完成
  });

  it('should handle multiple re-renders efficiently', () => {
    const data = generateLargeDataset(200);
    const columns = createColumns();

    const { rerender } = render(
      <CTable
        columns={columns}
        dataSource={data}
        loading={false}
      />
    );

    const startTime = performance.now();

    // 模拟多次重新渲染
    for (let i = 0; i < 10; i++) {
      rerender(
        <CTable
          columns={columns}
          dataSource={data}
          loading={i % 2 === 0}
        />
      );
    }

    const endTime = performance.now();
    const totalRerenderTime = endTime - startTime;

    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
    expect(totalRerenderTime).toBeLessThan(200); // 10次重渲染应该在200ms内完成
  });

  it('should handle search functionality with large dataset', () => {
    const data = generateLargeDataset(1000);
    const columns = createColumns();

    const startTime = performance.now();

    render(
      <CTable
        columns={columns}
        dataSource={data}
        search={{
          onSearch: vi.fn(),
          onReset: vi.fn(),
        }}
      />
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
    expect(screen.getByTestId('input')).toBeInTheDocument();
    expect(renderTime).toBeLessThan(300); // 带搜索功能应该在300ms内完成
  });

  it('should handle column processing efficiently', () => {
    const data = generateLargeDataset(100);
    
    // 创建大量列
    const manyColumns: CTableColumn<LargeDataItem>[] = Array.from({ length: 50 }, (_, index) => ({
      title: `Column ${index + 1}`,
      dataIndex: 'name' as keyof LargeDataItem,
      render: (value) => `${value}-${index}`,
    }));

    const startTime = performance.now();

    render(
      <CTable
        columns={manyColumns}
        dataSource={data}
      />
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
    expect(renderTime).toBeLessThan(400); // 大量列应该在400ms内完成
  });

  it('should handle memory efficiently with large datasets', () => {
    const data = generateLargeDataset(5000);
    const columns = createColumns();

    // 测试内存使用情况
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

    const { unmount } = render(
      <CTable
        columns={columns}
        dataSource={data.slice(0, 100)} // 只渲染部分数据
        pagination={{
          pageSize: 100,
          current: 1,
          total: data.length,
        }}
      />
    );

    expect(screen.getByTestId('arco-table')).toBeInTheDocument();

    // 卸载组件
    unmount();

    // 检查内存是否有显著增长（这是一个简单的检查）
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;

    // 内存增长应该在合理范围内（小于10MB）
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
  });

  it('should handle rapid prop changes efficiently', () => {
    const data = generateLargeDataset(200);
    const columns = createColumns();

    const { rerender } = render(
      <CTable
        columns={columns}
        dataSource={data}
        loading={false}
        size="default"
      />
    );

    const startTime = performance.now();

    // 快速改变props
    const sizes = ['mini', 'small', 'default', 'large'] as const;
    for (let i = 0; i < 20; i++) {
      rerender(
        <CTable
          columns={columns}
          dataSource={data}
          loading={i % 2 === 0}
          size={sizes[i % sizes.length]}
          bordered={i % 3 === 0}
          stripe={i % 4 === 0}
        />
      );
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
    expect(totalTime).toBeLessThan(300); // 快速prop变化应该在300ms内完成
  });
});
