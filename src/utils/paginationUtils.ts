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
export function processPaginationConfig(
  pagination: PaginationConfig | false | undefined,
  dataSourceLength: number
) {
  if (pagination === false) {
    return false;
  }

  const defaultConfig = {
    current: 1,
    pageSize: 10,
    total: dataSourceLength,
    sizeCanChange: true,
    sizeOptions: [10, 20, 50, 100],
    showTotal: (total: number, range: number[]) =>
      `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
    showJumper: true,
  };

  if (!pagination) {
    return defaultConfig;
  }

  // 先处理回调函数
  const callbacks: any = {};

  // 处理onChange回调 - 页码变化
  if (pagination.onChange) {
    callbacks.onChange = pagination.onChange;
  }

  // 处理onPageSizeChange回调 - 页面大小变化
  if (pagination.onPageSizeChange) {
    callbacks.onPageSizeChange = pagination.onPageSizeChange;
  } else if (pagination.onChange) {
    // 如果没有提供onPageSizeChange但提供了onChange，
    // 将页面大小变化也通过onChange处理
    callbacks.onPageSizeChange = (size: number, current: number) => {
      pagination.onChange?.(current, size);
    };
  }

  const processedConfig: any = {
    ...defaultConfig,
    ...pagination,
    // 确保关键属性使用正确的值
    current: pagination.current || defaultConfig.current,
    pageSize: pagination.pageSize || defaultConfig.pageSize,
    total: pagination.total || dataSourceLength,
    // 确保回调函数不被覆盖
    ...callbacks,
  };

  return processedConfig;
}

/**
 * 验证分页参数
 */
export function validatePaginationParams(
  current: number,
  pageSize: number,
  total: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (current < 1) {
    errors.push('当前页码不能小于1');
  }

  if (pageSize < 1) {
    errors.push('页面大小不能小于1');
  }

  if (total < 0) {
    errors.push('总数不能小于0');
  }

  const maxPage = Math.ceil(total / pageSize) || 1;
  if (current > maxPage) {
    errors.push(`当前页码不能大于最大页码 ${maxPage}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 计算分页信息
 */
export function calculatePaginationInfo(
  current: number,
  pageSize: number,
  total: number
) {
  const maxPage = Math.ceil(total / pageSize) || 1;
  const startIndex = (current - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, total - 1);

  return {
    current: Math.min(current, maxPage),
    pageSize,
    total,
    maxPage,
    startIndex,
    endIndex,
    hasNext: current < maxPage,
    hasPrev: current > 1,
  };
}

/**
 * 获取当前页的数据
 */
export function getCurrentPageData<T>(
  dataSource: T[],
  current: number,
  pageSize: number
): T[] {
  const startIndex = (current - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return dataSource.slice(startIndex, endIndex);
}
