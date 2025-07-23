import React, { Component, ReactNode } from 'react';
import { Result, Button } from '@arco-design/web-react';
import { IconExclamationCircle } from '@arco-design/web-react/icon';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: React.ErrorInfo) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class CTableErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // 调用错误回调
    this.props.onError?.(error, errorInfo);

    // 在开发环境下打印详细错误信息
    if (process.env.NODE_ENV === 'development') {
      console.error('CTable Error Boundary caught an error:', error);
      console.error('Error Info:', errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义fallback，使用自定义的
      if (this.props.fallback && this.state.error && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      // 默认错误UI
      return (
        <div className="ctable-error-boundary" style={{ padding: '40px 20px' }}>
          <Result
            status="error"
            icon={<IconExclamationCircle />}
            title="表格渲染出错"
            subTitle={
              process.env.NODE_ENV === 'development' && this.state.error
                ? `错误信息: ${this.state.error.message}`
                : '抱歉，表格组件遇到了一个错误，请稍后重试。'
            }
            extra={[
              <Button key="retry" type="primary" onClick={this.handleRetry}>
                重新加载
              </Button>,
            ]}
          />
          
          {/* 开发环境下显示详细错误信息 */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: 20, fontSize: 12, color: '#666' }}>
              <summary>详细错误信息（仅开发环境显示）</summary>
              <pre style={{ 
                marginTop: 10, 
                padding: 10, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 4,
                overflow: 'auto',
                maxHeight: 200,
              }}>
                {this.state.error.stack}
              </pre>
              {this.state.errorInfo && (
                <pre style={{ 
                  marginTop: 10, 
                  padding: 10, 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: 4,
                  overflow: 'auto',
                  maxHeight: 200,
                }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default CTableErrorBoundary;
