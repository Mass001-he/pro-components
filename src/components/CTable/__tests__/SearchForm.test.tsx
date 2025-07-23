import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchForm from '../SearchForm';
import { SearchConfig } from '../types';

// Mock Arco Design components
vi.mock('@arco-design/web-react', () => ({
  Form: {
    useForm: () => [
      {
        validate: vi.fn().mockResolvedValue({ name: 'test', age: 25 }),
        setFieldsValue: vi.fn(),
      },
    ],
    Item: ({ children, label }: any) => (
      <div data-testid="form-item">
        <label>{label}</label>
        {children}
      </div>
    ),
  },
  Input: ({ placeholder, onChange }: any) => (
    <input data-testid="input" placeholder={placeholder} onChange={onChange} />
  ),
  Select: ({ placeholder, options }: any) => (
    <select data-testid="select" placeholder={placeholder}>
      {options?.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
  DatePicker: {
    RangePicker: ({ placeholder }: any) => (
      <input data-testid="date-range" placeholder={placeholder?.[0]} />
    ),
  },
  InputNumber: ({ placeholder }: any) => (
    <input data-testid="input-number" placeholder={placeholder} />
  ),
  Button: ({ children, onClick, icon }: any) => (
    <button data-testid="button" onClick={onClick}>
      {icon}
      {children}
    </button>
  ),
  Grid: {
    Row: ({ children }: any) => <div data-testid="row">{children}</div>,
    Col: ({ children }: any) => <div data-testid="col">{children}</div>,
  },
  Space: ({ children }: any) => <div data-testid="space">{children}</div>,
}));

vi.mock('@arco-design/web-react/icon', () => ({
  IconDown: () => <span data-testid="icon-down">Down</span>,
  IconUp: () => <span data-testid="icon-up">Up</span>,
  IconSearch: () => <span data-testid="icon-search">Search</span>,
  IconRefresh: () => <span data-testid="icon-refresh">Refresh</span>,
}));

const mockSearchConfig: SearchConfig[] = [
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
    label: '日期范围',
    type: 'dateRange',
  },
  {
    name: 'ageRange',
    label: '年龄范围',
    type: 'numberRange',
  },
];

describe('SearchForm', () => {
  it('should render search form with basic fields', () => {
    render(<SearchForm searchConfig={mockSearchConfig.slice(0, 2)} />);
    
    expect(screen.getByText('姓名')).toBeInTheDocument();
    expect(screen.getByText('状态')).toBeInTheDocument();
    expect(screen.getByTestId('input')).toBeInTheDocument();
    expect(screen.getByTestId('select')).toBeInTheDocument();
  });

  it('should render search and reset buttons', () => {
    render(<SearchForm searchConfig={mockSearchConfig.slice(0, 2)} />);
    
    const buttons = screen.getAllByTestId('button');
    expect(buttons).toHaveLength(2);
    expect(screen.getByText('搜索')).toBeInTheDocument();
    expect(screen.getByText('重置')).toBeInTheDocument();
  });

  it('should show expand/collapse button when more than 3 fields', () => {
    render(<SearchForm searchConfig={mockSearchConfig} />);
    
    const buttons = screen.getAllByTestId('button');
    expect(buttons).toHaveLength(3); // 搜索、重置、展开
    expect(screen.getByText('展开')).toBeInTheDocument();
  });

  it('should handle search button click', async () => {
    const onSearch = vi.fn();
    render(<SearchForm searchConfig={mockSearchConfig.slice(0, 2)} onSearch={onSearch} />);
    
    const searchButton = screen.getByText('搜索');
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith({ name: 'test', age: 25 });
    });
  });

  it('should handle reset button click', () => {
    const onReset = vi.fn();
    render(<SearchForm searchConfig={mockSearchConfig.slice(0, 2)} onReset={onReset} />);
    
    const resetButton = screen.getByText('重置');
    fireEvent.click(resetButton);
    
    expect(onReset).toHaveBeenCalled();
  });

  it('should render different input types correctly', () => {
    render(<SearchForm searchConfig={mockSearchConfig} />);
    
    // 只显示前3个字段（默认收起状态）
    expect(screen.getByTestId('input')).toBeInTheDocument(); // input type
    expect(screen.getByTestId('select')).toBeInTheDocument(); // select type
    expect(screen.getByTestId('date-range')).toBeInTheDocument(); // dateRange type
  });

  it('should not render when searchConfig is empty', () => {
    const { container } = render(<SearchForm searchConfig={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render when searchConfig is invalid', () => {
    const invalidConfig = [
      { name: '', label: '', type: 'input' as const },
    ];
    
    const { container } = render(<SearchForm searchConfig={invalidConfig} />);
    expect(container.firstChild).toBeNull();
  });
});
