import { SearchConfig } from '../components/CTable/types';
/**
 * 验证搜索配置的有效性
 */
export declare function validateSearchConfig(searchConfig: SearchConfig[]): boolean;
/**
 * 处理搜索表单值
 */
export declare function processSearchValues(values: Record<string, any>): Record<string, any>;
/**
 * 重置搜索表单值
 */
export declare function resetSearchValues(searchConfig: SearchConfig[]): Record<string, any>;
/**
 * 生成搜索表单的初始值
 */
export declare function getInitialSearchValues(searchConfig: SearchConfig[]): Record<string, any>;
/**
 * 验证搜索值的格式
 */
export declare function validateSearchValues(values: Record<string, any>, searchConfig: SearchConfig[]): {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=searchUtils.d.ts.map