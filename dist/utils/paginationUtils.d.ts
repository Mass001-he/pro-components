export interface PaginationConfig {
    current?: number;
    pageSize?: number;
    total?: number;
    sizeCanChange?: boolean;
    sizeOptions?: number[];
    onChange?: (page: number, pageSize: number) => void;
    onPageSizeChange?: (size: number, current: number) => void;
}
/**
 * 处理分页配置
 */
export declare function processPaginationConfig(pagination: PaginationConfig | false | undefined, dataSourceLength: number): any;
/**
 * 验证分页参数
 */
export declare function validatePaginationParams(current: number, pageSize: number, total: number): {
    valid: boolean;
    errors: string[];
};
/**
 * 计算分页信息
 */
export declare function calculatePaginationInfo(current: number, pageSize: number, total: number): {
    current: number;
    pageSize: number;
    total: number;
    maxPage: number;
    startIndex: number;
    endIndex: number;
    hasNext: boolean;
    hasPrev: boolean;
};
/**
 * 获取当前页的数据
 */
export declare function getCurrentPageData<T>(dataSource: T[], current: number, pageSize: number): T[];
//# sourceMappingURL=paginationUtils.d.ts.map