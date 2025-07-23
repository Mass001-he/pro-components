import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import { useState, useMemo, useCallback, Component } from 'react';
import { Tag, Grid, DatePicker, Form, Input, InputNumber, Select, Space, Button, Divider, Result, Table } from '@arco-design/web-react';
import { IconSearch, IconRefresh, IconDown, IconUp, IconDownload, IconPlus, IconExclamationCircle } from '@arco-design/web-react/icon';

/**
 * 验证列配置的有效性
 */
function validateColumns(columns) {
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
            console.warn('CTable: column must have dataIndex, key, or render function', column);
            return false;
        }
    }
    return true;
}
/**
 * 转换列配置为内部使用的格式
 */
function transformColumns(columns) {
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
function generateSearchConfig(columns) {
    return columns
        .filter(column => !column.hideInSearch && column.searchConfig)
        .map(column => ({
        name: String(column.dataIndex),
        label: column.title,
        type: column.searchConfig.type,
        options: column.searchConfig.options,
        placeholder: column.searchConfig.placeholder || `请输入${column.title}`,
    }));
}
/**
 * 获取列的默认渲染器
 */
function getDefaultRenderer(valueType) {
    switch (valueType) {
        case 'number':
            return (value) => {
                if (typeof value === 'number') {
                    return value.toLocaleString();
                }
                return value;
            };
        case 'date':
            return (value) => {
                if (value instanceof Date) {
                    return value.toLocaleDateString();
                }
                if (typeof value === 'string' || typeof value === 'number') {
                    return new Date(value).toLocaleDateString();
                }
                return value;
            };
        case 'dateTime':
            return (value) => {
                if (value instanceof Date) {
                    return value.toLocaleString();
                }
                if (typeof value === 'string' || typeof value === 'number') {
                    return new Date(value).toLocaleString();
                }
                return value;
            };
        case 'tag':
            return (value) => {
                if (Array.isArray(value)) {
                    return value.join(', ');
                }
                return value;
            };
        default:
            return (value) => value;
    }
}
/**
 * 处理列的排序函数
 */
function createSorter(column) {
    if (typeof column.sorter === 'function') {
        return column.sorter;
    }
    if (column.sorter === true) {
        return (a, b) => {
            // 如果没有dataIndex，无法排序
            if (!column.dataIndex)
                return 0;
            const aValue = a[column.dataIndex];
            const bValue = b[column.dataIndex];
            if (aValue === bValue)
                return 0;
            if (aValue == null)
                return -1;
            if (bValue == null)
                return 1;
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return aValue - bValue;
            }
            return String(aValue).localeCompare(String(bValue));
        };
    }
    return undefined;
}

/**
 * 处理分页配置
 */
function processPaginationConfig(pagination, dataSourceLength) {
    if (pagination === false) {
        return false;
    }
    const defaultConfig = {
        current: 1,
        pageSize: 10,
        total: dataSourceLength,
        sizeCanChange: true,
        sizeOptions: [10, 20, 50, 100],
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        showJumper: true,
    };
    if (!pagination) {
        return defaultConfig;
    }
    // 先处理回调函数
    const callbacks = {};
    // 处理onChange回调 - 页码变化
    if (pagination.onChange) {
        callbacks.onChange = pagination.onChange;
    }
    // 处理onPageSizeChange回调 - 页面大小变化
    if (pagination.onPageSizeChange) {
        callbacks.onPageSizeChange = pagination.onPageSizeChange;
    }
    else if (pagination.onChange) {
        // 如果没有提供onPageSizeChange但提供了onChange，
        // 将页面大小变化也通过onChange处理
        callbacks.onPageSizeChange = (size, current) => {
            pagination.onChange?.(current, size);
        };
    }
    const processedConfig = {
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
function validatePaginationParams(current, pageSize, total) {
    const errors = [];
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
function calculatePaginationInfo(current, pageSize, total) {
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
function getCurrentPageData(dataSource, current, pageSize) {
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return dataSource.slice(startIndex, endIndex);
}

const ColumnRenderer = ({ value, record, index, valueType = 'text', }) => {
    const renderValue = () => {
        if (value === null || value === undefined) {
            return '-';
        }
        switch (valueType) {
            case 'number':
                if (typeof value === 'number') {
                    return value.toLocaleString();
                }
                return value;
            case 'date':
                if (value instanceof Date) {
                    return value.toLocaleDateString('zh-CN');
                }
                if (typeof value === 'string' || typeof value === 'number') {
                    const date = new Date(value);
                    return isNaN(date.getTime()) ? value : date.toLocaleDateString('zh-CN');
                }
                return value;
            case 'dateTime':
                if (value instanceof Date) {
                    return value.toLocaleString('zh-CN');
                }
                if (typeof value === 'string' || typeof value === 'number') {
                    const date = new Date(value);
                    return isNaN(date.getTime()) ? value : date.toLocaleString('zh-CN');
                }
                return value;
            case 'select':
                return value;
            case 'tag':
                if (Array.isArray(value)) {
                    return (jsx("div", { children: value.map((item, idx) => (jsx(Tag, { style: { marginRight: 4 }, children: item }, idx))) }));
                }
                if (typeof value === 'string') {
                    return jsx(Tag, { children: value });
                }
                return value;
            case 'text':
            default:
                return String(value);
        }
    };
    return jsx(Fragment, { children: renderValue() });
};

/**
 * 验证搜索配置的有效性
 */
function validateSearchConfig(searchConfig) {
    if (!Array.isArray(searchConfig)) {
        console.warn('CTable: searchConfig should be an array');
        return false;
    }
    for (const config of searchConfig) {
        if (!config.name || !config.label || !config.type) {
            console.warn('CTable: searchConfig item must have name, label and type', config);
            return false;
        }
        if (config.type === 'select' && !config.options) {
            console.warn('CTable: select type searchConfig must have options', config);
            return false;
        }
    }
    return true;
}
/**
 * 处理搜索表单值
 */
function processSearchValues(values) {
    const processed = {};
    Object.keys(values).forEach(key => {
        const value = values[key];
        // 过滤空值
        if (value !== undefined && value !== null && value !== '') {
            // 处理日期范围
            if (Array.isArray(value) && value.length === 2) {
                processed[key] = value;
            }
            // 处理数字范围
            else if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
                processed[key] = value;
            }
            // 处理普通值
            else {
                processed[key] = value;
            }
        }
    });
    return processed;
}
/**
 * 重置搜索表单值
 */
function resetSearchValues(searchConfig) {
    const resetValues = {};
    searchConfig.forEach(config => {
        switch (config.type) {
            case 'input':
                resetValues[config.name] = '';
                break;
            case 'select':
                resetValues[config.name] = undefined;
                break;
            case 'dateRange':
                resetValues[config.name] = [];
                break;
            case 'numberRange':
                resetValues[config.name] = { min: undefined, max: undefined };
                break;
            default:
                resetValues[config.name] = undefined;
        }
    });
    return resetValues;
}
/**
 * 生成搜索表单的初始值
 */
function getInitialSearchValues(searchConfig) {
    return resetSearchValues(searchConfig);
}
/**
 * 验证搜索值的格式
 */
function validateSearchValues(values, searchConfig) {
    const errors = [];
    searchConfig.forEach(config => {
        const value = values[config.name];
        if (value !== undefined && value !== null && value !== '') {
            switch (config.type) {
                case 'numberRange':
                    if (typeof value === 'object') {
                        const { min, max } = value;
                        if (min !== undefined && max !== undefined && min > max) {
                            errors.push(`${config.label}: 最小值不能大于最大值`);
                        }
                    }
                    break;
                case 'dateRange':
                    if (Array.isArray(value) && value.length === 2) {
                        const [start, end] = value;
                        if (start && end && new Date(start) > new Date(end)) {
                            errors.push(`${config.label}: 开始日期不能晚于结束日期`);
                        }
                    }
                    break;
            }
        }
    });
    return {
        valid: errors.length === 0,
        errors,
    };
}

const { Row, Col } = Grid;
const { RangePicker } = DatePicker;
const SearchForm = ({ searchConfig, onSearch, onReset, defaultCollapsed = true, }) => {
    const [form] = Form.useForm();
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    // 验证搜索配置
    const isValidConfig = useMemo(() => {
        return validateSearchConfig(searchConfig);
    }, [searchConfig]);
    // 计算显示的字段数量
    const visibleFields = useMemo(() => {
        if (!collapsed)
            return searchConfig;
        return searchConfig.slice(0, 3); // 收起时只显示前3个字段
    }, [searchConfig, collapsed]);
    // 处理搜索
    const handleSearch = useCallback(async () => {
        try {
            const values = await form.validate();
            const processedValues = processSearchValues(values);
            onSearch?.(processedValues);
        }
        catch (error) {
            console.warn('Search form validation failed:', error);
        }
    }, [form, onSearch]);
    // 处理重置
    const handleReset = useCallback(() => {
        const resetValues = resetSearchValues(searchConfig);
        form.setFieldsValue(resetValues);
        onReset?.();
    }, [form, searchConfig, onReset]);
    // 切换展开/收起
    const toggleCollapsed = useCallback(() => {
        setCollapsed(!collapsed);
    }, [collapsed]);
    // 渲染表单项
    const renderFormItem = useCallback((config) => {
        switch (config.type) {
            case 'input':
                return (jsx(Input, { placeholder: config.placeholder || `请输入${config.label}`, allowClear: true }));
            case 'select':
                return (jsx(Select, { placeholder: config.placeholder || `请选择${config.label}`, options: config.options || [], allowClear: true }));
            case 'dateRange':
                return (jsx(RangePicker, { placeholder: ['开始日期', '结束日期'], style: { width: '100%' } }));
            case 'numberRange':
                return (jsxs(Input.Group, { compact: true, children: [jsx(Form.Item, { field: `${config.name}.min`, noStyle: true, children: jsx(InputNumber, { placeholder: "\u6700\u5C0F\u503C", style: { width: '50%' } }) }), jsx(Form.Item, { field: `${config.name}.max`, noStyle: true, children: jsx(InputNumber, { placeholder: "\u6700\u5927\u503C", style: { width: '50%' } }) })] }));
            default:
                return (jsx(Input, { placeholder: config.placeholder || `请输入${config.label}`, allowClear: true }));
        }
    }, []);
    if (!isValidConfig || searchConfig.length === 0) {
        return null;
    }
    return (jsx("div", { className: "ctable-search-form", style: { marginBottom: 16 }, children: jsx(Form, { form: form, layout: "horizontal", labelCol: { span: 6 }, wrapperCol: { span: 18 }, autoComplete: "off", children: jsxs(Row, { gutter: 24, children: [visibleFields.map((config) => (jsx(Col, { span: 8, children: jsx(Form.Item, { label: config.label, field: config.name, rules: config.rules, children: renderFormItem(config) }) }, config.name))), jsx(Col, { span: 8, children: jsx(Form.Item, { label: " ", colon: false, children: jsxs(Space, { children: [jsx(Button, { type: "primary", icon: jsx(IconSearch, {}), onClick: handleSearch, children: "\u641C\u7D22" }), jsx(Button, { icon: jsx(IconRefresh, {}), onClick: handleReset, children: "\u91CD\u7F6E" }), searchConfig.length > 3 && (jsx(Button, { type: "text", icon: collapsed ? jsx(IconDown, {}) : jsx(IconUp, {}), onClick: toggleCollapsed, children: collapsed ? '展开' : '收起' }))] }) }) })] }) }) }));
};

const TableToolbar = ({ title, extra, actions = {}, customRender, }) => {
    // 如果提供了自定义渲染函数，直接使用
    if (customRender) {
        return jsx("div", { className: "ctable-toolbar", children: customRender() });
    }
    const { refresh, export: exportAction, create } = actions;
    const hasActions = refresh?.show || exportAction?.show || create?.show;
    if (!title && !extra && !hasActions) {
        return null;
    }
    return (jsxs("div", { className: "ctable-toolbar", style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            padding: '12px 0',
        }, children: [jsx("div", { className: "ctable-toolbar-left", children: title && (jsx("h3", { style: { margin: 0, fontSize: 16, fontWeight: 500 }, children: title })) }), jsx("div", { className: "ctable-toolbar-right", children: jsxs(Space, { children: [refresh?.show && (jsx(Button, { icon: jsx(IconRefresh, {}), onClick: refresh.onClick, loading: refresh.loading, children: "\u5237\u65B0" })), exportAction?.show && (jsx(Button, { icon: jsx(IconDownload, {}), onClick: exportAction.onClick, loading: exportAction.loading, children: "\u5BFC\u51FA" })), (refresh?.show || exportAction?.show) && create?.show && (jsx(Divider, { type: "vertical" })), create?.show && (jsx(Button, { type: "primary", icon: jsx(IconPlus, {}), onClick: create.onClick, children: create.text || '新建' })), extra] }) })] }));
};

class CTableErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.handleRetry = () => {
            this.setState({
                hasError: false,
                error: undefined,
                errorInfo: undefined,
            });
        };
        this.state = {
            hasError: false,
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
        };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo,
        });
        // 调用错误回调
        this.props.onError?.(error, errorInfo);
        // 在开发环境下打印详细错误信息
        if (process.env.NODE_ENV === 'development') {
            console.error('CTable Error Boundary caught an error:', error);
            console.error('Error Info:', errorInfo);
        }
    }
    render() {
        if (this.state.hasError) {
            // 如果提供了自定义fallback，使用自定义的
            if (this.props.fallback && this.state.error && this.state.errorInfo) {
                return this.props.fallback(this.state.error, this.state.errorInfo);
            }
            // 默认错误UI
            return (jsxs("div", { className: "ctable-error-boundary", style: { padding: '40px 20px' }, children: [jsx(Result, { status: "error", icon: jsx(IconExclamationCircle, {}), title: "\u8868\u683C\u6E32\u67D3\u51FA\u9519", subTitle: process.env.NODE_ENV === 'development' && this.state.error
                            ? `错误信息: ${this.state.error.message}`
                            : '抱歉，表格组件遇到了一个错误，请稍后重试。', extra: [
                            jsx(Button, { type: "primary", onClick: this.handleRetry, children: "\u91CD\u65B0\u52A0\u8F7D" }, "retry"),
                        ] }), process.env.NODE_ENV === 'development' && this.state.error && (jsxs("details", { style: { marginTop: 20, fontSize: 12, color: '#666' }, children: [jsx("summary", { children: "\u8BE6\u7EC6\u9519\u8BEF\u4FE1\u606F\uFF08\u4EC5\u5F00\u53D1\u73AF\u5883\u663E\u793A\uFF09" }), jsx("pre", { style: {
                                    marginTop: 10,
                                    padding: 10,
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: 4,
                                    overflow: 'auto',
                                    maxHeight: 200,
                                }, children: this.state.error.stack }), this.state.errorInfo && (jsx("pre", { style: {
                                    marginTop: 10,
                                    padding: 10,
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: 4,
                                    overflow: 'auto',
                                    maxHeight: 200,
                                }, children: this.state.errorInfo.componentStack }))] }))] }));
        }
        return this.props.children;
    }
}

const CTable = (props) => {
    const { columns, dataSource, loading = false, rowKey = 'id', search, pagination, toolbar, toolBarRender, tableAlertRender, size = 'default', bordered = false, stripe = false, scroll, ...restProps } = props;
    // 验证列配置
    const isValidColumns = useMemo(() => {
        return validateColumns(columns);
    }, [columns]);
    // 处理rowKey
    const processedRowKey = useMemo(() => {
        if (typeof rowKey === 'string') {
            return (record) => record[rowKey] || record.id || Math.random().toString(36);
        }
        return rowKey;
    }, [rowKey]);
    // 处理列配置，集成ColumnRenderer和增强功能
    const processedColumns = useMemo(() => {
        if (!isValidColumns)
            return [];
        return columns.map(column => {
            const baseColumn = {
                title: column.title,
                key: column.key || String(column.dataIndex || Math.random().toString(36)),
                width: column.width,
                fixed: column.fixed,
                align: column.align,
                filters: column.filters,
                onFilter: column.onFilter,
            };
            // 只有当dataIndex存在时才设置
            if (column.dataIndex) {
                baseColumn.dataIndex = column.dataIndex;
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
            }
            else if (column.valueType && column.valueType !== 'text') {
                // 如果指定了valueType且不是默认的text，使用ColumnRenderer
                baseColumn.render = (value, record, index) => (jsx(ColumnRenderer, { value: value, record: record, index: index, valueType: column.valueType }));
            }
            return baseColumn;
        });
    }, [columns, isValidColumns]);
    // 处理搜索配置
    const searchConfig = useMemo(() => {
        if (!search)
            return [];
        // 如果用户提供了自定义搜索配置，使用用户的
        if (search.searchConfig) {
            return search.searchConfig;
        }
        // 否则从列配置生成搜索配置
        return generateSearchConfig(columns);
    }, [search, columns]);
    // 处理搜索回调
    const handleSearch = useCallback((values) => {
        search?.onSearch?.(values);
    }, [search]);
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
        return (jsx(CTableErrorBoundary, { children: jsxs("div", { style: {
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#999',
                    border: '1px dashed #d9d9d9',
                    borderRadius: '6px',
                    backgroundColor: '#fafafa',
                }, children: [jsx("div", { style: { fontSize: '16px', marginBottom: '8px' }, children: "\u26A0\uFE0F \u8868\u683C\u914D\u7F6E\u9519\u8BEF" }), jsx("div", { children: "\u8BF7\u68C0\u67E5columns\u914D\u7F6E\u662F\u5426\u6B63\u786E" }), process.env.NODE_ENV === 'development' && (jsx("div", { style: { marginTop: '12px', fontSize: '12px', color: '#666' }, children: "\u63D0\u793A\uFF1A\u6BCF\u4E2Acolumn\u5FC5\u987B\u5305\u542Btitle\u5C5E\u6027\uFF0C\u4EE5\u53CAdataIndex\u3001key\u6216render\u51FD\u6570\u4E2D\u7684\u81F3\u5C11\u4E00\u4E2A" }))] }) }));
    }
    // 数据源验证
    if (!Array.isArray(dataSource)) {
        return (jsx(CTableErrorBoundary, { children: jsxs("div", { style: {
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#999',
                    border: '1px dashed #d9d9d9',
                    borderRadius: '6px',
                    backgroundColor: '#fafafa',
                }, children: [jsx("div", { style: { fontSize: '16px', marginBottom: '8px' }, children: "\u26A0\uFE0F \u6570\u636E\u6E90\u9519\u8BEF" }), jsx("div", { children: "dataSource\u5FC5\u987B\u662F\u4E00\u4E2A\u6570\u7EC4" })] }) }));
    }
    return (jsx(CTableErrorBoundary, { children: jsxs("div", { className: "ctable-container", children: [search && searchConfig.length > 0 && (jsx(CTableErrorBoundary, { children: jsx(SearchForm, { searchConfig: searchConfig, onSearch: handleSearch, onReset: handleReset, defaultCollapsed: search.defaultCollapsed }) })), toolbar && (jsx(CTableErrorBoundary, { children: jsx(TableToolbar, { title: toolbar.title, extra: toolbar.extra, actions: toolbar.actions }) })), toolBarRender && (jsx(CTableErrorBoundary, { children: jsx("div", { className: "ctable-toolbar", style: { marginBottom: 16 }, children: toolBarRender() }) })), tableAlertRender && (jsx(CTableErrorBoundary, { children: jsx("div", { className: "ctable-alert", style: { marginBottom: 16 }, children: tableAlertRender() }) })), jsx(CTableErrorBoundary, { children: jsx(Table, { columns: processedColumns, data: dataSource, loading: loading, rowKey: processedRowKey, pagination: processedPagination, size: size, border: bordered, stripe: stripe, scroll: scroll, ...restProps }) })] }) }));
};

export { CTable, CTableErrorBoundary, ColumnRenderer, SearchForm, TableToolbar, calculatePaginationInfo, createSorter, generateSearchConfig, getCurrentPageData, getDefaultRenderer, getInitialSearchValues, processPaginationConfig, processSearchValues, resetSearchValues, transformColumns, validateColumns, validatePaginationParams, validateSearchConfig, validateSearchValues };
//# sourceMappingURL=index.esm.js.map
