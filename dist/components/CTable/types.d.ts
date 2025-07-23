import { ReactNode } from 'react';
export interface SearchConfig {
    name: string;
    label: string;
    type: 'input' | 'select' | 'dateRange' | 'numberRange';
    options?: {
        label: string;
        value: any;
    }[];
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
    render?: (value: any, record: T, index: number) => ReactNode;
    valueType?: 'text' | 'number' | 'date' | 'dateTime' | 'select' | 'tag';
    hideInSearch?: boolean;
    searchConfig?: {
        type: 'input' | 'select' | 'dateRange' | 'numberRange';
        options?: {
            label: string;
            value: any;
        }[];
        placeholder?: string;
    };
    sorter?: boolean | ((a: T, b: T) => number);
    filters?: {
        text: string;
        value: any;
    }[];
    onFilter?: (value: any, record: T) => boolean;
}
export interface CTableProps<T = any> {
    columns: CTableColumn<T>[];
    dataSource: T[];
    loading?: boolean;
    rowKey?: string | ((record: T) => string);
    search?: {
        searchConfig?: SearchConfig[];
        onSearch?: (values: Record<string, any>) => void;
        onReset?: () => void;
        defaultCollapsed?: boolean;
    };
    pagination?: {
        current?: number;
        pageSize?: number;
        total?: number;
        sizeCanChange?: boolean;
        sizeOptions?: number[];
        onChange?: (page: number, pageSize: number) => void;
        onPageSizeChange?: (size: number, current: number) => void;
    } | false;
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
    toolBarRender?: () => ReactNode;
    tableAlertRender?: () => ReactNode;
    size?: 'mini' | 'small' | 'default' | 'middle';
    bordered?: boolean;
    stripe?: boolean;
    scroll?: {
        x?: number | string;
        y?: number | string;
    };
}
export type ValueType = 'text' | 'number' | 'date' | 'dateTime' | 'select' | 'tag';
export interface ColumnConfig<T = any> {
    column: CTableColumn<T>;
    searchable: boolean;
    sortable: boolean;
    filterable: boolean;
}
//# sourceMappingURL=types.d.ts.map