import { CTableColumn, ColumnConfig, SearchConfig } from '../components/CTable/types';
/**
 * 验证列配置的有效性
 */
export declare function validateColumns<T>(columns: CTableColumn<T>[]): boolean;
/**
 * 转换列配置为内部使用的格式
 */
export declare function transformColumns<T>(columns: CTableColumn<T>[]): ColumnConfig<T>[];
/**
 * 从列配置生成搜索配置
 */
export declare function generateSearchConfig<T>(columns: CTableColumn<T>[]): SearchConfig[];
/**
 * 获取列的默认渲染器
 */
export declare function getDefaultRenderer(valueType?: string): (value: any) => any;
/**
 * 处理列的排序函数
 */
export declare function createSorter<T>(column: CTableColumn<T>): ((a: T, b: T) => number) | undefined;
//# sourceMappingURL=columnUtils.d.ts.map