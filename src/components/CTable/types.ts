import { ReactNode } from 'react';

export interface SearchConfig {
  name: string;
  label: string;
  type: 'input' | 'select' | 'dateRange' | 'numberRange';
  options?: { label: string; value: any }[];
  placeholder?: string;
  rules?: any[];
}

export interface CTableColumn<T = any> {
  title: string;
  dataIndex?: keyof T;
  key?: string;
  width?: number;
  fixed?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';

  // 渲染相关
  render?: (value: any, record: T, index: number) => ReactNode;
  valueType?: 'text' | 'number' | 'date' | 'dateTime' | 'select' | 'tag';

  // 搜索相关
  hideInSearch?: boolean;
  searchConfig?: {
    type: 'input' | 'select' | 'dateRange' | 'numberRange';
    options?: { label: string; value: any }[];
    placeholder?: string;
  };

  // 排序和筛选
  sorter?: boolean | ((a: T, b: T) => number);
  filters?: { text: string; value: any }[];
  onFilter?: (value: any, record: T) => boolean;
}

export interface CTableProps<T = any> {
  // 基础表格属性
  columns: CTableColumn<T>[];
  dataSource: T[];
  loading?: boolean;
  rowKey?: string | ((record: T) => string);

  // 搜索功能
  search?: {
    searchConfig?: SearchConfig[];
    onSearch?: (values: Record<string, any>) => void;
    onReset?: () => void;
    defaultCollapsed?: boolean;
  };

  // 分页功能
  pagination?:
    | {
        current?: number;
        pageSize?: number;
        total?: number;
        sizeCanChange?: boolean;
        sizeOptions?: number[];
        onChange?: (page: number, pageSize: number) => void;
        onPageSizeChange?: (size: number, current: number) => void;
      }
    | false;

  // 工具栏配置
  toolbar?: {
    title?: string;
    extra?: ReactNode;
    actions?: {
      refresh?: {
        show?: boolean;
        onClick?: () => void;
        loading?: boolean;
      };
      export?: {
        show?: boolean;
        onClick?: () => void;
        loading?: boolean;
      };
      create?: {
        show?: boolean;
        onClick?: () => void;
        text?: string;
      };
    };
  };

  // 表格操作（向后兼容）
  toolBarRender?: () => ReactNode;
  tableAlertRender?: () => ReactNode;

  // 其他配置
  size?: 'mini' | 'small' | 'default' | 'middle';
  bordered?: boolean;
  stripe?: boolean;
  scroll?: {
    x?: number | string;
    y?: number | string;
  };
}

export type ValueType =
  | 'text'
  | 'number'
  | 'date'
  | 'dateTime'
  | 'select'
  | 'tag';

export interface ColumnConfig<T = any> {
  column: CTableColumn<T>;
  searchable: boolean;
  sortable: boolean;
  filterable: boolean;
}
