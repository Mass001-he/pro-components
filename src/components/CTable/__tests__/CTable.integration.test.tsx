import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CTable from '../index';
import { CTableColumn } from '../types';

// Mock Arco Design components for integration testing
vi.mock('@arco-design/web-react', () => ({
  Table: ({ data, columns, loading, pagination, ...props }: any) => (
    <div data-testid="arco-table" {...props}>
      {loading && <div data-testid="loading">Loading...</div>}
      <table>
        <thead>
          <tr>
            {columns.map((col: any) => (
              <th key={col.key || col.dataIndex}>
                {col.title}
                {col.sorter && (
                  <button 
                    data-testid={`sort-${col.dataIndex}`}
                    onClick={() => col.sorter(data[0], data[1])}
                  >
                    Sort
                  </button>
                )}
                {col.filters && (
                  <select data-testid={`filter-${col.dataIndex}`}>
                    {col.filters.map((filter: any) => (
                      <option key={filter.value} value={filter.value}>
                        {filter.text}
                      </option>
                    ))}
                  </select>
                )}
              </th>
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
      {pagination && (
        <div data-testid="pagination">
          <button 
            data-testid="pagination-prev"
            onClick={() => pagination.onChange?.(pagination.current - 1, pagination.pageSize)}
            disabled={pagination.current <= 1}
          >
            Previous
          </button>
          <span data-testid="pagination-info">
            Page {pagination.current} of {Math.ceil(pagination.total / pagination.pageSize)}
          </span>
          <button 
            data-testid="pagination-next"
            onClick={() => pagination.onChange?.(pagination.current + 1, pagination.pageSize)}
            disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  ),
  Form: {
    useForm: () => [
      {
        validate: vi.fn().mockResolvedValue({ name: 'test', status: 'active' }),
        setFieldsValue: vi.fn(),
      },
    ],
    Item: ({ children, label, field }: any) => (
      <div data-testid={`form-item-${field}`}>
        <label>{label}</label>
        {children}
      </div>
    ),
  },
  Input: ({ placeholder, onChange }: any) => (
    <input 
      data-testid="search-input" 
      placeholder={placeholder} 
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
  Select: ({ placeholder, options, onChange }: any) => (
    <select 
      data-testid="search-select" 
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options?.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
  DatePicker: {
    RangePicker: ({ onChange }: any) => (
      <input 
        data-testid="date-range-picker"
        type="date"
        onChange={(e) => onChange?.([e.target.value, e.target.value])}
      />
    ),
  },
  InputNumber: ({ placeholder, onChange }: any) => (
    <input 
      data-testid="number-input"
      type="number"
      placeholder={placeholder}
      onChange={(e) => onChange?.(Number(e.target.value))}
    />
  ),
  Button: ({ children, onClick, loading, icon }: any) => (
    <button 
      data-testid={`button-${children?.toLowerCase?.()}`}
      onClick={onClick}
      disabled={loading}
    >
      {icon}
      {children}
    </button>
  ),
  Grid: {
    Row: ({ children }: any) => <div data-testid="grid-row">{children}</div>,
    Col: ({ children }: any) => <div data-testid="grid-col">{children}</div>,
  },
  Space: ({ children }: any) => <div data-testid="space">{children}</div>,
  Tag: ({ children }: any) => <span data-testid="tag">{children}</span>,
  Result: ({ title, subTitle, extra }: any) => (
    <div data-testid="result">
      <h1>{title}</h1>
      <p>{subTitle}</p>
      <div>{extra}</div>
    </div>
  ),
}));

vi.mock('@arco-design/web-react/icon', () => ({
  IconDown: () => <span>Down</span>,
  IconUp: () => <span>Up</span>,
  IconSearch: () => <span>Search</span>,
  IconRefresh: () => <span>Refresh</span>,
  IconDownload: () => <span>Download</span>,
  IconPlus: () => <span>Plus</span>,
  IconExclamationCircle: () => <span>Error</span>,
}));

interface TestUser {
  id: number;
  name: string;
  age: number;
  status: 'active' | 'inactive';
  tags: string[];
  createTime: string;
}

const mockUsers: TestUser[] = [
  {
    id: 1,
    name: '张三',
    age: 25,
    status: 'active',
    tags: ['React', 'TypeScript'],
    createTime: '2023-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: '李四',
    age: 30,
    status: 'inactive',
    tags: ['Vue', 'JavaScript'],
    createTime: '2023-02-20T14:20:00Z',
  },
  {
    id: 3,
    name: '王五',
    age: 28,
    status: 'active',
    tags: ['Angular'],
    createTime: '2023-03-10T09:15:00Z',
  },
];

const columns: CTableColumn<TestUser>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    searchConfig: {
      type: 'input',
      placeholder: '请输入姓名',
    },
  },
  {
    title: '年龄',
    dataIndex: 'age',
    valueType: 'number',
    sorter: true,
    searchConfig: {
      type: 'numberRange',
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
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
      <span style={{ color: value === 'active' ? 'green' : 'red' }}>
        {value === 'active' ? '启用' : '禁用'}
      </span>
    ),
  },
  {
    title: '标签',
    dataIndex: 'tags',
    valueType: 'tag',
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

describe('CTable Integration Tests', () => {
  it('should integrate search, pagination, and table functionality', async () => {
    const onSearch = vi.fn();
    const onPaginationChange = vi.fn();

    render(
      <CTable
        columns={columns}
        dataSource={mockUsers}
        search={{
          onSearch,
          onReset: vi.fn(),
        }}
        pagination={{
          current: 1,
          pageSize: 2,
          total: mockUsers.length,
          onChange: onPaginationChange,
        }}
      />
    );

    // 验证表格渲染
    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('李四')).toBeInTheDocument();

    // 验证搜索表单渲染
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-select')).toBeInTheDocument();

    // 测试搜索功能
    const searchButton = screen.getByTestId('button-搜索');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith({ name: 'test', status: 'active' });
    });

    // 验证分页功能
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();

    // 测试分页切换
    const nextButton = screen.getByTestId('pagination-next');
    fireEvent.click(nextButton);

    expect(onPaginationChange).toHaveBeenCalledWith(2, 2);
  });

  it('should handle toolbar and table interactions', () => {
    const onRefresh = vi.fn();
    const onCreate = vi.fn();

    render(
      <CTable
        columns={columns}
        dataSource={mockUsers}
        toolbar={{
          title: '用户列表',
          actions: {
            refresh: {
              show: true,
              onClick: onRefresh,
            },
            create: {
              show: true,
              onClick: onCreate,
              text: '新增用户',
            },
          },
        }}
      />
    );

    // 验证工具栏渲染
    expect(screen.getByText('用户列表')).toBeInTheDocument();
    expect(screen.getByText('刷新')).toBeInTheDocument();
    expect(screen.getByText('新增用户')).toBeInTheDocument();

    // 测试工具栏按钮
    fireEvent.click(screen.getByText('刷新'));
    expect(onRefresh).toHaveBeenCalled();

    fireEvent.click(screen.getByText('新增用户'));
    expect(onCreate).toHaveBeenCalled();
  });

  it('should handle sorting and filtering integration', () => {
    render(
      <CTable
        columns={columns}
        dataSource={mockUsers}
      />
    );

    // 验证排序按钮存在
    expect(screen.getByTestId('sort-age')).toBeInTheDocument();

    // 验证筛选器存在
    expect(screen.getByTestId('filter-status')).toBeInTheDocument();

    // 测试排序功能
    fireEvent.click(screen.getByTestId('sort-age'));

    // 测试筛选功能
    const filterSelect = screen.getByTestId('filter-status');
    fireEvent.change(filterSelect, { target: { value: 'active' } });
  });

  it('should handle different column value types', () => {
    render(
      <CTable
        columns={columns}
        dataSource={mockUsers}
      />
    );

    // 验证数字类型渲染
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();

    // 验证标签类型渲染
    expect(screen.getAllByTestId('tag')).toHaveLength(5); // React, TypeScript, Vue, JavaScript, Angular

    // 验证自定义渲染
    expect(screen.getByText('启用')).toBeInTheDocument();
    expect(screen.getByText('禁用')).toBeInTheDocument();
  });

  it('should handle error states gracefully', () => {
    // 测试无效列配置
    render(
      <CTable
        columns={[]}
        dataSource={mockUsers}
      />
    );

    expect(screen.getByText('⚠️ 表格配置错误')).toBeInTheDocument();

    // 测试无效数据源
    render(
      <CTable
        columns={columns}
        dataSource={'invalid' as any}
      />
    );

    expect(screen.getByText('⚠️ 数据源错误')).toBeInTheDocument();
  });

  it('should handle loading states', () => {
    render(
      <CTable
        columns={columns}
        dataSource={mockUsers}
        loading={true}
      />
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should handle empty data state', () => {
    render(
      <CTable
        columns={columns}
        dataSource={[]}
      />
    );

    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
    // 空数据时表格仍然渲染，但没有数据行
  });

  it('should handle complex search scenarios', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();

    render(
      <CTable
        columns={columns}
        dataSource={mockUsers}
        search={{
          onSearch,
          defaultCollapsed: false,
        }}
      />
    );

    // 测试输入框搜索
    const nameInput = screen.getByTestId('search-input');
    await user.type(nameInput, '张三');

    // 测试选择器搜索
    const statusSelect = screen.getByTestId('search-select');
    await user.selectOptions(statusSelect, 'active');

    // 测试日期范围搜索
    const dateRangePicker = screen.getByTestId('date-range-picker');
    await user.type(dateRangePicker, '2023-01-01');

    // 执行搜索
    const searchButton = screen.getByTestId('button-搜索');
    await user.click(searchButton);

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalled();
    });
  });
});
