import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TableToolbar from '../TableToolbar';

// Mock Arco Design components
vi.mock('@arco-design/web-react', () => ({
  Space: ({ children }: any) => <div data-testid="space">{children}</div>,
  Button: ({ children, onClick, loading, icon }: any) => (
    <button data-testid="button" onClick={onClick} disabled={loading}>
      {icon}
      {children}
    </button>
  ),
  Divider: ({ type }: any) => <div data-testid={`divider-${type}`} />,
}));

vi.mock('@arco-design/web-react/icon', () => ({
  IconRefresh: () => <span data-testid="icon-refresh">Refresh</span>,
  IconDownload: () => <span data-testid="icon-download">Download</span>,
  IconPlus: () => <span data-testid="icon-plus">Plus</span>,
}));

describe('TableToolbar', () => {
  it('should render nothing when no props provided', () => {
    const { container } = render(<TableToolbar />);
    expect(container.firstChild).toBeNull();
  });

  it('should render title when provided', () => {
    render(<TableToolbar title="用户列表" />);
    
    expect(screen.getByText('用户列表')).toBeInTheDocument();
  });

  it('should render custom render when provided', () => {
    const customRender = () => <div data-testid="custom-toolbar">Custom Toolbar</div>;
    
    render(<TableToolbar customRender={customRender} />);
    
    expect(screen.getByTestId('custom-toolbar')).toBeInTheDocument();
    expect(screen.getByText('Custom Toolbar')).toBeInTheDocument();
  });

  it('should render refresh button when configured', () => {
    const onRefresh = vi.fn();
    
    render(
      <TableToolbar 
        actions={{
          refresh: {
            show: true,
            onClick: onRefresh,
          }
        }}
      />
    );
    
    const refreshButton = screen.getByText('刷新');
    expect(refreshButton).toBeInTheDocument();
    
    fireEvent.click(refreshButton);
    expect(onRefresh).toHaveBeenCalled();
  });

  it('should render export button when configured', () => {
    const onExport = vi.fn();
    
    render(
      <TableToolbar 
        actions={{
          export: {
            show: true,
            onClick: onExport,
          }
        }}
      />
    );
    
    const exportButton = screen.getByText('导出');
    expect(exportButton).toBeInTheDocument();
    
    fireEvent.click(exportButton);
    expect(onExport).toHaveBeenCalled();
  });

  it('should render create button when configured', () => {
    const onCreate = vi.fn();
    
    render(
      <TableToolbar 
        actions={{
          create: {
            show: true,
            onClick: onCreate,
            text: '添加用户',
          }
        }}
      />
    );
    
    const createButton = screen.getByText('添加用户');
    expect(createButton).toBeInTheDocument();
    
    fireEvent.click(createButton);
    expect(onCreate).toHaveBeenCalled();
  });

  it('should render default create button text', () => {
    render(
      <TableToolbar 
        actions={{
          create: {
            show: true,
            onClick: vi.fn(),
          }
        }}
      />
    );
    
    expect(screen.getByText('新建')).toBeInTheDocument();
  });

  it('should render all buttons with divider', () => {
    render(
      <TableToolbar 
        actions={{
          refresh: { show: true, onClick: vi.fn() },
          export: { show: true, onClick: vi.fn() },
          create: { show: true, onClick: vi.fn() },
        }}
      />
    );
    
    expect(screen.getByText('刷新')).toBeInTheDocument();
    expect(screen.getByText('导出')).toBeInTheDocument();
    expect(screen.getByText('新建')).toBeInTheDocument();
    expect(screen.getByTestId('divider-vertical')).toBeInTheDocument();
  });

  it('should render extra content', () => {
    const extra = <div data-testid="extra-content">Extra Content</div>;
    
    render(<TableToolbar extra={extra} />);
    
    expect(screen.getByTestId('extra-content')).toBeInTheDocument();
    expect(screen.getByText('Extra Content')).toBeInTheDocument();
  });

  it('should handle loading state for buttons', () => {
    render(
      <TableToolbar 
        actions={{
          refresh: {
            show: true,
            onClick: vi.fn(),
            loading: true,
          },
          export: {
            show: true,
            onClick: vi.fn(),
            loading: true,
          }
        }}
      />
    );
    
    const buttons = screen.getAllByTestId('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('should render complete toolbar with title and actions', () => {
    render(
      <TableToolbar 
        title="数据管理"
        actions={{
          refresh: { show: true, onClick: vi.fn() },
          create: { show: true, onClick: vi.fn(), text: '新增数据' },
        }}
        extra={<span>额外内容</span>}
      />
    );
    
    expect(screen.getByText('数据管理')).toBeInTheDocument();
    expect(screen.getByText('刷新')).toBeInTheDocument();
    expect(screen.getByText('新增数据')).toBeInTheDocument();
    expect(screen.getByText('额外内容')).toBeInTheDocument();
  });
});
