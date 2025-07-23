// 主要组件导出
export { default as CTable } from './components/CTable';

// 子组件导出（可选，用于高级定制）
export {
  CTableErrorBoundary,
  SearchForm,
  TableToolbar,
  ColumnRenderer,
} from './components';

// 类型导出
export type {
  CTableProps,
  CTableColumn,
  SearchConfig,
  ValueType,
  ColumnConfig,
  TableToolbarProps,
} from './components';

// 工具函数导出（可选，用于高级定制）
export {
  validateColumns,
  transformColumns,
  generateSearchConfig,
  getDefaultRenderer,
  createSorter,
} from './utils/columnUtils';

export {
  validateSearchConfig,
  processSearchValues,
  resetSearchValues,
  getInitialSearchValues,
  validateSearchValues,
} from './utils/searchUtils';

export {
  processPaginationConfig,
  validatePaginationParams,
  calculatePaginationInfo,
  getCurrentPageData,
} from './utils/paginationUtils';
