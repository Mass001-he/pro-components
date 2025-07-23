import React, { useState, useCallback, useMemo } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Grid,
  Space,
} from '@arco-design/web-react';
import { IconDown, IconUp, IconSearch, IconRefresh } from '@arco-design/web-react/icon';
import { SearchConfig } from './types';
import { validateSearchConfig, processSearchValues, resetSearchValues } from '../../utils/searchUtils';

const { Row, Col } = Grid;
const { RangePicker } = DatePicker;

interface SearchFormProps {
  searchConfig: SearchConfig[];
  onSearch?: (values: Record<string, any>) => void;
  onReset?: () => void;
  defaultCollapsed?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchConfig,
  onSearch,
  onReset,
  defaultCollapsed = true,
}) => {
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  // 验证搜索配置
  const isValidConfig = useMemo(() => {
    return validateSearchConfig(searchConfig);
  }, [searchConfig]);

  // 计算显示的字段数量
  const visibleFields = useMemo(() => {
    if (!collapsed) return searchConfig;
    return searchConfig.slice(0, 3); // 收起时只显示前3个字段
  }, [searchConfig, collapsed]);

  // 处理搜索
  const handleSearch = useCallback(async () => {
    try {
      const values = await form.validate();
      const processedValues = processSearchValues(values);
      onSearch?.(processedValues);
    } catch (error) {
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
  const renderFormItem = useCallback((config: SearchConfig) => {
    switch (config.type) {
      case 'input':
        return (
          <Input
            placeholder={config.placeholder || `请输入${config.label}`}
            allowClear
          />
        );

      case 'select':
        return (
          <Select
            placeholder={config.placeholder || `请选择${config.label}`}
            options={config.options || []}
            allowClear
          />
        );

      case 'dateRange':
        return (
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            style={{ width: '100%' }}
          />
        );

      case 'numberRange':
        return (
          <Input.Group compact>
            <Form.Item field={`${config.name}.min`} noStyle>
              <InputNumber
                placeholder="最小值"
                style={{ width: '50%' }}
              />
            </Form.Item>
            <Form.Item field={`${config.name}.max`} noStyle>
              <InputNumber
                placeholder="最大值"
                style={{ width: '50%' }}
              />
            </Form.Item>
          </Input.Group>
        );

      default:
        return (
          <Input
            placeholder={config.placeholder || `请输入${config.label}`}
            allowClear
          />
        );
    }
  }, []);

  if (!isValidConfig || searchConfig.length === 0) {
    return null;
  }

  return (
    <div className="ctable-search-form" style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        autoComplete="off"
      >
        <Row gutter={24}>
          {visibleFields.map((config) => (
            <Col span={8} key={config.name}>
              <Form.Item
                label={config.label}
                field={config.name}
                rules={config.rules}
              >
                {renderFormItem(config)}
              </Form.Item>
            </Col>
          ))}
          
          {/* 操作按钮 */}
          <Col span={8}>
            <Form.Item label=" " colon={false}>
              <Space>
                <Button
                  type="primary"
                  icon={<IconSearch />}
                  onClick={handleSearch}
                >
                  搜索
                </Button>
                <Button
                  icon={<IconRefresh />}
                  onClick={handleReset}
                >
                  重置
                </Button>
                {searchConfig.length > 3 && (
                  <Button
                    type="text"
                    icon={collapsed ? <IconDown /> : <IconUp />}
                    onClick={toggleCollapsed}
                  >
                    {collapsed ? '展开' : '收起'}
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchForm;
