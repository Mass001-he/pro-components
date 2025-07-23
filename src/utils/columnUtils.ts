import {
  CTableColumn,
  ColumnConfig,
  SearchConfig,
} from '../components/CTable/types';

/**
 * 验证列配置的有效性
 */
export function validateColumns<T>(columns: CTableColumn<T>[]): boolean {
  if (!Array.isArray(columns) || columns.length === 0) {
    console.warn('CTable: columns should be a non-empty array');
    return false;
  }

  for (const column of columns) {
    // 检查是否有title
    if (!column.title) {
      console.warn('CTable: column must have title', column);
      return false;
    }

    // 对于操作列（有key但没有dataIndex）或者有render函数的列，不强制要求dataIndex
    // 其他列必须有dataIndex
    if (!column.dataIndex && !column.key && !column.render) {
      console.warn(
        'CTable: column must have dataIndex, key, or render function',
        column
      );
      return false;
    }
  }

  return true;
}

/**
 * 转换列配置为内部使用的格式
 */
export function transformColumns<T>(
  columns: CTableColumn<T>[]
): ColumnConfig<T>[] {
  return columns.map(column => ({
    column,
    searchable: !column.hideInSearch && !!column.searchConfig,
    sortable: !!column.sorter,
    filterable: !!column.filters && column.filters.length > 0,
  }));
}

/**
 * 从列配置生成搜索配置
 */
export function generateSearchConfig<T>(
  columns: CTableColumn<T>[]
): SearchConfig[] {
  return columns
    .filter(column => !column.hideInSearch && column.searchConfig)
    .map(column => ({
      name: String(column.dataIndex),
      label: column.title,
      type: column.searchConfig!.type,
      options: column.searchConfig!.options,
      placeholder: column.searchConfig!.placeholder || `请输入${column.title}`,
    }));
}

/**
 * 获取列的默认渲染器
 */
export function getDefaultRenderer(valueType?: string) {
  switch (valueType) {
    case 'number':
      return (value: any) => {
        if (typeof value === 'number') {
          return value.toLocaleString();
        }
        return value;
      };
    case 'date':
      return (value: any) => {
        if (value instanceof Date) {
          return value.toLocaleDateString();
        }
        if (typeof value === 'string' || typeof value === 'number') {
          return new Date(value).toLocaleDateString();
        }
        return value;
      };
    case 'dateTime':
      return (value: any) => {
        if (value instanceof Date) {
          return value.toLocaleString();
        }
        if (typeof value === 'string' || typeof value === 'number') {
          return new Date(value).toLocaleString();
        }
        return value;
      };
    case 'tag':
      return (value: any) => {
        if (Array.isArray(value)) {
          return value.join(', ');
        }
        return value;
      };
    default:
      return (value: any) => value;
  }
}

/**
 * 处理列的排序函数
 */
export function createSorter<T>(column: CTableColumn<T>) {
  if (typeof column.sorter === 'function') {
    return column.sorter;
  }

  if (column.sorter === true) {
    return (a: T, b: T) => {
      // 如果没有dataIndex，无法排序
      if (!column.dataIndex) return 0;

      const aValue = a[column.dataIndex];
      const bValue = b[column.dataIndex];

      if (aValue === bValue) return 0;
      if (aValue == null) return -1;
      if (bValue == null) return 1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      }

      return String(aValue).localeCompare(String(bValue));
    };
  }

  return undefined;
}
