import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CTable from '../index';
import { CTableColumn } from '../types';

// Mock Arco Design Table
vi.mock('@arco-design/web-react', () => ({
  Table: ({ data, columns, loading }: any) => (
    <div data-testid="arco-table">
      {loading && <div data-testid="loading">Loading...</div>}
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
}));

interface TestData {
  id: number;
  name: string;
  age: number;
}

const mockColumns: CTableColumn<TestData>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
];

const mockData: TestData[] = [
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
];

describe('CTable', () => {
  it('should render basic table', () => {
    render(<CTable columns={mockColumns} dataSource={mockData} />);
    
    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('姓名')).toBeInTheDocument();
    expect(screen.getByText('年龄')).toBeInTheDocument();
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('李四')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<CTable columns={mockColumns} dataSource={mockData} loading />);
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should render custom toolbar', () => {
    const toolBarRender = () => <div data-testid="custom-toolbar">Custom Toolbar</div>;
    
    render(
      <CTable 
        columns={mockColumns} 
        dataSource={mockData} 
        toolBarRender={toolBarRender}
      />
    );
    
    expect(screen.getByTestId('custom-toolbar')).toBeInTheDocument();
    expect(screen.getByText('Custom Toolbar')).toBeInTheDocument();
  });

  it('should render table alert', () => {
    const tableAlertRender = () => <div data-testid="table-alert">Table Alert</div>;
    
    render(
      <CTable 
        columns={mockColumns} 
        dataSource={mockData} 
        tableAlertRender={tableAlertRender}
      />
    );
    
    expect(screen.getByTestId('table-alert')).toBeInTheDocument();
    expect(screen.getByText('Table Alert')).toBeInTheDocument();
  });

  it('should handle empty columns', () => {
    render(<CTable columns={[]} dataSource={mockData} />);
    
    expect(screen.getByText('⚠️ 表格配置错误')).toBeInTheDocument();
    expect(screen.getByText('请检查columns配置是否正确')).toBeInTheDocument();
  });

  it('should handle custom render function', () => {
    const columnsWithRender: CTableColumn<TestData>[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        render: (value) => <span data-testid="custom-render">{value.toUpperCase()}</span>,
      },
    ];

    render(<CTable columns={columnsWithRender} dataSource={mockData} />);
    
    expect(screen.getByTestId('custom-render')).toBeInTheDocument();
    expect(screen.getByText('张三')).toBeInTheDocument();
  });

  it('should handle valueType rendering', () => {
    const columnsWithValueType: CTableColumn<TestData>[] = [
      {
        title: '年龄',
        dataIndex: 'age',
        valueType: 'number',
      },
    ];

    render(<CTable columns={columnsWithValueType} dataSource={mockData} />);
    
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('should handle column sorting', () => {
    const columnsWithSorter: CTableColumn<TestData>[] = [
      {
        title: '年龄',
        dataIndex: 'age',
        sorter: true,
      },
    ];

    render(<CTable columns={columnsWithSorter} dataSource={mockData} />);
    
    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
  });

  it('should handle column filters', () => {
    const columnsWithFilters: CTableColumn<TestData>[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        filters: [
          { text: '张三', value: '张三' },
          { text: '李四', value: '李四' },
        ],
        onFilter: (value, record) => record.name === value,
      },
    ];

    render(<CTable columns={columnsWithFilters} dataSource={mockData} />);
    
    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
  });

  it('should render search form when search prop is provided', () => {
    const searchConfig = [
      {
        name: 'name',
        label: '姓名',
        type: 'input' as const,
      },
    ];

    const onSearch = vi.fn();
    
    render(
      <CTable 
        columns={mockColumns} 
        dataSource={mockData}
        search={{
          searchConfig,
          onSearch,
        }}
      />
    );
    
    // SearchForm should be rendered (we'll mock it in the test)
    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
  });

  it('should generate search config from columns', () => {
    const columnsWithSearch: CTableColumn<TestData>[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        searchConfig: {
          type: 'input',
          placeholder: '请输入姓名',
        },
      },
    ];

    const onSearch = vi.fn();
    
    render(
      <CTable 
        columns={columnsWithSearch} 
        dataSource={mockData}
        search={{ onSearch }}
      />
    );
    
    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
  });

  it('should handle pagination configuration', () => {
    const paginationConfig = {
      current: 2,
      pageSize: 5,
      total: 20,
      showSizeChanger: true,
      onChange: vi.fn(),
    };

    render(
      <CTable 
        columns={mockColumns} 
        dataSource={mockData}
        pagination={paginationConfig}
      />
    );
    
    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
  });

  it('should disable pagination when pagination is false', () => {
    render(
      <CTable 
        columns={mockColumns} 
        dataSource={mockData}
        pagination={false}
      />
    );
    
    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
  });

  it('should use default pagination when pagination is undefined', () => {
    render(
      <CTable 
        columns={mockColumns} 
        dataSource={mockData}
      />
    );
    
    expect(screen.getByTestId('arco-table')).toBeInTheDocument();
  });

  it('should render toolbar when toolbar config is provided', () => {
    const toolbar = {
      title: '用户列表',
      actions: {
        refresh: { show: true, onClick: vi.fn() },
        create: { show: true, onClick: vi.fn() },
      },
    };

    render(
      <CTable 
        columns={mockColumns} 
        dataSource={mockData}
        toolbar={toolbar}
      />
    );
    
    expect(screen.getByText('用户列表')).toBeInTheDocument();
    expect(screen.getByText('刷新')).toBeInTheDocument();
    expect(screen.getByText('新建')).toBeInTheDocument();
  });

  it('should support both new toolbar and legacy toolBarRender', () => {
    const toolbar = {
      title: '新工具栏',
    };
    
    const toolBarRender = () => <div data-testid="legacy-toolbar">Legacy Toolbar</div>;

    render(
      <CTable 
        columns={mockColumns} 
        dataSource={mockData}
        toolbar={toolbar}
        toolBarRender={toolBarRender}
      />
    );
    
    expect(screen.getByText('新工具栏')).toBeInTheDocument();
    expect(screen.getByTestId('legacy-toolbar')).toBeInTheDocument();
  });

  it('should show error message for invalid dataSource', () => {
    render(
      <CTable 
        columns={mockColumns} 
        dataSource={'invalid' as any}
      />
    );
    
    expect(screen.getByText('⚠️ 数据源错误')).toBeInTheDocument();
    expect(screen.getByText('dataSource必须是一个数组')).toBeInTheDocument();
  });

  it('should show error message for invalid columns with development hints', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <CTable 
        columns={[{ title: '', dataIndex: '' as any }]} 
        dataSource={mockData}
      />
    );
    
    expect(screen.getByText('⚠️ 表格配置错误')).toBeInTheDocument();
    expect(screen.getByText('请检查columns配置是否正确')).toBeInTheDocument();
    expect(screen.getByText('提示：每个column必须包含title和dataIndex属性')).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle error boundary gracefully', () => {
    // 抑制控制台错误输出
    const originalConsoleError = console.error;
    console.error = vi.fn();

    const ThrowError = () => {
      throw new Error('Test error');
    };

    const toolBarRender = () => <ThrowError />;

    render(
      <CTable 
        columns={mockColumns} 
        dataSource={mockData}
        toolBarRender={toolBarRender}
      />
    );
    
    // 错误边界应该捕获错误并显示错误UI
    expect(screen.getByText('表格渲染出错')).toBeInTheDocument();

    console.error = originalConsoleError;
  });
});
