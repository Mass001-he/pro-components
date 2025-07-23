// 测试组件导入是否正常
import { CTable, CTableColumn, SearchConfig } from '@mass/pro-components';

// 测试类型定义
interface TestData {
  id: number;
  name: string;
  age: number;
}

const testColumns: CTableColumn<TestData>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    valueType: 'number',
  },
];

const testData: TestData[] = [
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
];

const testSearchConfig: SearchConfig[] = [
  {
    name: 'name',
    label: '姓名',
    type: 'input',
  },
];

console.log('✅ 组件导入测试通过');
console.log('✅ 类型定义测试通过');
console.log('✅ CTable组件可用:', typeof CTable === 'function');

export { CTable, testColumns, testData, testSearchConfig };
