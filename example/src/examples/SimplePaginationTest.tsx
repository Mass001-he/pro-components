import React, { useState } from 'react';
import { CTable, CTableColumn } from '@mass/pro-components';

interface TestData {
  id: number;
  name: string;
  value: number;
}

const testData: TestData[] = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `项目${index + 1}`,
  value: Math.floor(Math.random() * 1000),
}));

const columns: CTableColumn<TestData>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '数值',
    dataIndex: 'value',
    width: 100,
  },
];

const SimplePaginationTest: React.FC = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: testData.length,
  });

  const handleChange = (current: number, pageSize: number) => {
    console.log('SimplePaginationTest - onChange:', { current, pageSize });
    setPagination({ current, pageSize, total: testData.length });
  };

  const handlePageSizeChange = (size: number, current: number) => {
    console.log('SimplePaginationTest - onPageSizeChange:', { current, size });
    setPagination({ current, pageSize: size, total: testData.length });
  };

  return (
    <div>
      <h3>简单分页测试</h3>
      <p>测试页面大小选择器是否显示和工作</p>

      <div style={{ marginBottom: 16 }}>
        <p>
          当前配置: 第{pagination.current}页，每页{pagination.pageSize}条，共
          {pagination.total}条
        </p>
      </div>

      <CTable
        columns={columns}
        dataSource={testData}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          sizeCanChange: true,
          sizeOptions: [5, 10, 20, 50],
          onChange: handleChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />
    </div>
  );
};

export default SimplePaginationTest;
