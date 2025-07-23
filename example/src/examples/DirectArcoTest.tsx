import React, { useState } from 'react';
import { Table } from '@arco-design/web-react';

interface TestData {
  id: number;
  name: string;
  age: number;
}

const testData: TestData[] = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `用户${index + 1}`,
  age: 20 + Math.floor(Math.random() * 40),
}));

const columns = [
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
  },
];

const DirectArcoTest: React.FC = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: testData.length,
  });

  const handleChange = (current: number, pageSize: number) => {
    console.log('Direct Arco onChange:', { current, pageSize });
    setPagination({ current, pageSize, total: testData.length });
  };

  const handlePageSizeChange = (size: number, current: number) => {
    console.log('Direct Arco onPageSizeChange:', { current, size });
    setPagination({ current, pageSize: size, total: testData.length });
  };

  return (
    <div>
      <h3>直接使用Arco Design Table测试</h3>
      <Table
        columns={columns}
        data={testData}
        pagination={{
          ...pagination,
          onChange: handleChange,
          onPageSizeChange: handlePageSizeChange,
          sizeCanChange: true,
          sizeOptions: [5, 10, 20, 30],
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        }}
      />
    </div>
  );
};

export default DirectArcoTest;
