import React, { useMemo, useCallback } from 'react';
import { Table } from '@arco-design/web-react';
import { CTableProps } from './types';
import {
  validateColumns,
  createSorter,
  generateSearchConfig,
} from '../../utils/columnUtils';
import { processPaginationConfig } from '../../utils/paginationUtils';
import ColumnRenderer from './ColumnRenderer';
import SearchForm from './SearchForm';
import TableToolbar from './TableToolbar';
import CTableErrorBoundary from './ErrorBoundary';

const CTable = <T extends Record<string, any> = any>(props: CTableProps<T>) => {
  const {
    columns,
    dataSource,
    loading = false,
    rowKey = 'id',
    search,
    pagination,
    toolbar,
    toolBarRender,
    tableAlertRender,
    size = 'default',
    bordered = false,
    stripe = false,
    scroll,
    ...restProps
  } = props;

  // 验证列配置
  const isValidColumns = useMemo(() => {
    return validateColumns(columns);
  }, [columns]);

  // 处理rowKey
  const processedRowKey = useMemo(() => {
    if (typeof rowKey === 'string') {
      return (record: T) =>
        record[rowKey] || record.id || Math.random().toString(36);
    }
    return rowKey;
  }, [rowKey]);

  // 处理列配置，集成ColumnRenderer和增强功能
  const processedColumns = useMemo(() => {
    if (!isValidColumns) return [];

    return columns.map(column => {
      const baseColumn: any = {
        title: column.title,
        key:
          column.key || String(column.dataIndex || Math.random().toString(36)),
        width: column.width,
        fixed: column.fixed,
        align: column.align,
        filters: column.filters,
        onFilter: column.onFilter,
      };

      // 只有当dataIndex存在时才设置
      if (column.dataIndex) {
        baseColumn.dataIndex = column.dataIndex as string;
      }

      // 处理排序
      const sorter = createSorter(column);
      if (sorter) {
        baseColumn.sorter = sorter;
      }

      // 处理渲染函数
      if (column.render) {
        // 如果用户提供了自定义render函数，使用用户的
        baseColumn.render = column.render;
      } else if (column.valueType && column.valueType !== 'text') {
        // 如果指定了valueType且不是默认的text，使用ColumnRenderer
        baseColumn.render = (value: any, record: T, index: number) => (
          <ColumnRenderer
            value={value}
            record={record}
            index={index}
            valueType={column.valueType}
          />
        );
      }

      return baseColumn;
    });
  }, [columns, isValidColumns]);

  // 处理搜索配置
  const searchConfig = useMemo(() => {
    if (!search) return [];

    // 如果用户提供了自定义搜索配置，使用用户的
    if (search.searchConfig) {
      return search.searchConfig;
    }

    // 否则从列配置生成搜索配置
    return generateSearchConfig(columns);
  }, [search, columns]);

  // 处理搜索回调
  const handleSearch = useCallback(
    (values: Record<string, any>) => {
      search?.onSearch?.(values);
    },
    [search]
  );

  // 处理重置回调
  const handleReset = useCallback(() => {
    search?.onReset?.();
  }, [search]);

  // 处理分页配置
  const processedPagination = useMemo(() => {
    const result = processPaginationConfig(pagination, dataSource.length);
    // 调试信息
    if (process.env.NODE_ENV === 'development') {
      console.log('CTable分页配置:', {
        原始配置: pagination,
        处理后配置: result,
      });
    }
    return result;
  }, [pagination, dataSource.length]);

  // 数据验证错误处理
  if (!isValidColumns) {
    return (
      <CTableErrorBoundary>
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#999',
            border: '1px dashed #d9d9d9',
            borderRadius: '6px',
            backgroundColor: '#fafafa',
          }}
        >
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            ⚠️ 表格配置错误
          </div>
          <div>请检查columns配置是否正确</div>
          {process.env.NODE_ENV === 'development' && (
            <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
              提示：每个column必须包含title属性，以及dataIndex、key或render函数中的至少一个
            </div>
          )}
        </div>
      </CTableErrorBoundary>
    );
  }

  // 数据源验证
  if (!Array.isArray(dataSource)) {
    return (
      <CTableErrorBoundary>
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#999',
            border: '1px dashed #d9d9d9',
            borderRadius: '6px',
            backgroundColor: '#fafafa',
          }}
        >
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            ⚠️ 数据源错误
          </div>
          <div>dataSource必须是一个数组</div>
        </div>
      </CTableErrorBoundary>
    );
  }

  return (
    <CTableErrorBoundary>
      <div className="ctable-container">
        {/* 搜索表单 */}
        {search && searchConfig.length > 0 && (
          <CTableErrorBoundary>
            <SearchForm
              searchConfig={searchConfig}
              onSearch={handleSearch}
              onReset={handleReset}
              defaultCollapsed={search.defaultCollapsed}
            />
          </CTableErrorBoundary>
        )}

        {/* 工具栏 */}
        {toolbar && (
          <CTableErrorBoundary>
            <TableToolbar
              title={toolbar.title}
              extra={toolbar.extra}
              actions={toolbar.actions}
            />
          </CTableErrorBoundary>
        )}

        {/* 自定义工具栏（向后兼容） */}
        {toolBarRender && (
          <CTableErrorBoundary>
            <div className="ctable-toolbar" style={{ marginBottom: 16 }}>
              {toolBarRender()}
            </div>
          </CTableErrorBoundary>
        )}

        {/* 表格提示信息 */}
        {tableAlertRender && (
          <CTableErrorBoundary>
            <div className="ctable-alert" style={{ marginBottom: 16 }}>
              {tableAlertRender()}
            </div>
          </CTableErrorBoundary>
        )}

        {/* 主表格 */}
        <CTableErrorBoundary>
          <Table
            columns={processedColumns}
            data={dataSource}
            loading={loading}
            rowKey={processedRowKey}
            pagination={processedPagination}
            size={size}
            border={bordered}
            stripe={stripe}
            scroll={scroll}
            {...restProps}
          />
        </CTableErrorBoundary>
      </div>
    </CTableErrorBoundary>
  );
};

export default CTable;
