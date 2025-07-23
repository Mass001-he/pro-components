import React from 'react';
export interface TableToolbarProps {
    title?: string;
    extra?: React.ReactNode;
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
    customRender?: () => React.ReactNode;
}
declare const TableToolbar: React.FC<TableToolbarProps>;
export default TableToolbar;
//# sourceMappingURL=TableToolbar.d.ts.map