import { SearchConfig } from '../components/CTable/types';

/**
 * 验证搜索配置的有效性
 */
export function validateSearchConfig(searchConfig: SearchConfig[]): boolean {
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
export function processSearchValues(values: Record<string, any>): Record<string, any> {
  const processed: Record<string, any> = {};

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
export function resetSearchValues(searchConfig: SearchConfig[]): Record<string, any> {
  const resetValues: Record<string, any> = {};

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
export function getInitialSearchValues(searchConfig: SearchConfig[]): Record<string, any> {
  return resetSearchValues(searchConfig);
}

/**
 * 验证搜索值的格式
 */
export function validateSearchValues(
  values: Record<string, any>,
  searchConfig: SearchConfig[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

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
