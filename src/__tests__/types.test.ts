import { describe, it, expect } from 'vitest';
import type { 
  CTableProps, 
  CTableColumn, 
  SearchConfig, 
  ValueType, 
  ColumnConfig,
  TableToolbarProps
} from '../index';

describe('Type Definitions', () => {
  it('should have correct CTableProps interface', () => {
    const props: CTableProps = {
      columns: [],
      dataSource: [],
    };

    expect(props).toBeDefined();
    expect(Array.isArray(props.columns)).toBe(true);
    expect(Array.isArray(props.dataSource)).toBe(true);
  });

  it('should have correct CTableColumn interface', () => {
    const column: CTableColumn = {
      title: 'Test',
      dataIndex: 'test',
    };

    expect(column.title).toBe('Test');
    expect(column.dataIndex).toBe('test');
  });

  it('should have correct SearchConfig interface', () => {
    const searchConfig: SearchConfig = {
      name: 'test',
      label: 'Test Label',
      type: 'input',
    };

    expect(searchConfig.name).toBe('test');
    expect(searchConfig.label).toBe('Test Label');
    expect(searchConfig.type).toBe('input');
  });

  it('should have correct ValueType union', () => {
    const valueTypes: ValueType[] = ['text', 'number', 'date', 'dateTime', 'select', 'tag'];
    
    valueTypes.forEach(type => {
      const valueType: ValueType = type;
      expect(valueType).toBeDefined();
    });
  });

  it('should have correct ColumnConfig interface', () => {
    const columnConfig: ColumnConfig = {
      column: {
        title: 'Test',
        dataIndex: 'test',
      },
      searchable: true,
      sortable: false,
      filterable: false,
    };

    expect(columnConfig.searchable).toBe(true);
    expect(columnConfig.sortable).toBe(false);
    expect(columnConfig.filterable).toBe(false);
  });

  it('should have correct TableToolbarProps interface', () => {
    const toolbarProps: TableToolbarProps = {
      title: 'Test Toolbar',
    };

    expect(toolbarProps.title).toBe('Test Toolbar');
  });

  it('should support generic types', () => {
    interface TestData {
      id: number;
      name: string;
    }

    const props: CTableProps<TestData> = {
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
        },
        {
          title: 'Name',
          dataIndex: 'name',
        },
      ],
      dataSource: [
        { id: 1, name: 'Test' },
      ],
    };

    expect(props.dataSource[0].id).toBe(1);
    expect(props.dataSource[0].name).toBe('Test');
  });

  it('should support optional properties', () => {
    const minimalProps: CTableProps = {
      columns: [],
      dataSource: [],
    };

    const fullProps: CTableProps = {
      columns: [],
      dataSource: [],
      loading: true,
      rowKey: 'id',
      search: {
        onSearch: () => {},
        onReset: () => {},
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 100,
      },
      toolbar: {
        title: 'Test',
        actions: {
          refresh: { show: true },
          create: { show: true },
        },
      },
      size: 'default',
      bordered: true,
      stripe: true,
    };

    expect(minimalProps).toBeDefined();
    expect(fullProps).toBeDefined();
    expect(fullProps.loading).toBe(true);
    expect(fullProps.size).toBe('default');
  });
});
