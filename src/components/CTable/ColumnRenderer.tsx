import React from 'react';
import { Tag } from '@arco-design/web-react';
import { ValueType } from './types';

interface ColumnRendererProps {
  value: any;
  record: any;
  index: number;
  valueType?: ValueType;
}

const ColumnRenderer: React.FC<ColumnRendererProps> = ({
  value,
  record,
  index,
  valueType = 'text',
}) => {
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
          return (
            <div>
              {value.map((item, idx) => (
                <Tag key={idx} style={{ marginRight: 4 }}>
                  {item}
                </Tag>
              ))}
            </div>
          );
        }
        if (typeof value === 'string') {
          return <Tag>{value}</Tag>;
        }
        return value;

      case 'text':
      default:
        return String(value);
    }
  };

  return <>{renderValue()}</>;
};

export default ColumnRenderer;
