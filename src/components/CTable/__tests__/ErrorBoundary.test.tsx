import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CTableErrorBoundary from '../ErrorBoundary';

// Mock Arco Design components
vi.mock('@arco-design/web-react', () => ({
  Result: ({ title, subTitle, extra, icon }: any) => (
    <div data-testid="result">
      {icon}
      <h1>{title}</h1>
      <p>{subTitle}</p>
      <div>{extra}</div>
    </div>
  ),
  Button: ({ children, onClick }: any) => (
    <button data-testid="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock('@arco-design/web-react/icon', () => ({
  IconExclamationCircle: () => <span data-testid="icon-error">Error Icon</span>,
}));

// 创建一个会抛出错误的组件用于测试
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div data-testid="normal-content">Normal Content</div>;
};

describe('CTableErrorBoundary', () => {
  // 抑制控制台错误输出，因为我们故意触发错误
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it('should render children when no error occurs', () => {
    render(
      <CTableErrorBoundary>
        <ThrowError shouldThrow={false} />
      </CTableErrorBoundary>
    );

    expect(screen.getByTestId('normal-content')).toBeInTheDocument();
    expect(screen.getByText('Normal Content')).toBeInTheDocument();
  });

  it('should render error UI when error occurs', () => {
    render(
      <CTableErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CTableErrorBoundary>
    );

    expect(screen.getByTestId('result')).toBeInTheDocument();
    expect(screen.getByText('表格渲染出错')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toBeInTheDocument();
    expect(screen.getByText('重新加载')).toBeInTheDocument();
  });

  it('should call onError callback when error occurs', () => {
    const onError = vi.fn();

    render(
      <CTableErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </CTableErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('should use custom fallback when provided', () => {
    const customFallback = (error: Error) => (
      <div data-testid="custom-fallback">
        Custom Error: {error.message}
      </div>
    );

    render(
      <CTableErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </CTableErrorBoundary>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.getByText('Custom Error: Test error message')).toBeInTheDocument();
  });

  it('should reset error state when retry button is clicked', () => {
    const { rerender } = render(
      <CTableErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CTableErrorBoundary>
    );

    // 确认错误UI显示
    expect(screen.getByText('表格渲染出错')).toBeInTheDocument();

    // 点击重试按钮
    const retryButton = screen.getByText('重新加载');
    fireEvent.click(retryButton);

    // 重新渲染不抛出错误的组件
    rerender(
      <CTableErrorBoundary>
        <ThrowError shouldThrow={false} />
      </CTableErrorBoundary>
    );

    // 确认正常内容显示
    expect(screen.getByTestId('normal-content')).toBeInTheDocument();
  });

  it('should show different error message in production vs development', () => {
    // 模拟生产环境
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <CTableErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CTableErrorBoundary>
    );

    expect(screen.getByText('抱歉，表格组件遇到了一个错误，请稍后重试。')).toBeInTheDocument();

    // 恢复环境变量
    process.env.NODE_ENV = originalEnv;
  });

  it('should show detailed error in development environment', () => {
    // 确保是开发环境
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <CTableErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CTableErrorBoundary>
    );

    expect(screen.getByText(/错误信息: Test error message/)).toBeInTheDocument();

    // 恢复环境变量
    process.env.NODE_ENV = originalEnv;
  });
});
