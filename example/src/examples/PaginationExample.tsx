import React, { useState, useEffect } from 'react';
import { Message } from '@arco-design/web-react';
import { CTable, CTableColumn } from '@mass001/pro-components';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'available' | 'out_of_stock' | 'discontinued';
  createTime: string;
}

// 生成大量模拟数据
const generateProducts = (count: number): Product[] => {
  const categories = ['电子产品', '服装', '家居', '图书', '食品'];
  const statuses: Product['status'][] = [
    'available',
    'out_of_stock',
    'discontinued',
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `商品${index + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    price: Math.floor(Math.random() * 1000) + 10,
    stock: Math.floor(Math.random() * 100),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createTime: new Date(
      2023,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    )
      .toISOString()
      .split('T')[0],
  }));
};

const columns: CTableColumn<Product>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '分类',
    dataIndex: 'category',
    width: 120,
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 100,
    valueType: 'number',
    render: (value: number) => `¥${value}`,
  },
  {
    title: '库存',
    dataIndex: 'stock',
    width: 80,
    valueType: 'number',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    render: (value: Product['status']) => {
      const statusMap = {
        available: { text: '有库存', color: '#00b42a' },
        out_of_stock: { text: '缺货', color: '#f53f3f' },
        discontinued: { text: '已停产', color: '#86909c' },
      };
      const status = statusMap[value];
      return (
        <span style={{ color: status.color, fontWeight: 500 }}>
          {status.text}
        </span>
      );
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 120,
    valueType: 'date',
  },
];

const PaginationExample: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 模拟所有数据
  const [allData] = useState<Product[]>(() => generateProducts(156));

  // 模拟异步加载数据
  const loadData = async (current: number, pageSize: number) => {
    setLoading(true);

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 计算分页数据
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = allData.slice(startIndex, endIndex);

    setData(pageData);
    setPagination({
      current,
      pageSize,
      total: allData.length,
    });
    setLoading(false);
  };

  // 初始化加载数据
  useEffect(() => {
    loadData(1, 10);
  }, []);

  const handlePaginationChange = (current: number, pageSize: number) => {
    console.log('分页变化:', { current, pageSize });
    Message.info(`切换到第 ${current} 页，每页 ${pageSize} 条`);
    loadData(current, pageSize);
  };

  const handlePageSizeChange = (size: number, current: number) => {
    console.log('页面大小变化:', { current, size });
    Message.info(`页面大小变化：第 ${current} 页，每页 ${size} 条`);
    loadData(current, size);
  };

  return (
    <div>
      <div style={{ marginBottom: 16, color: '#4e5969' }}>
        <p>
          总共 {allData.length} 条数据，当前显示第 {pagination.current} 页
        </p>
      </div>

      <CTable
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          ...pagination,
          onChange: handlePaginationChange,
          onPageSizeChange: handlePageSizeChange,
          sizeCanChange: true,
          sizeOptions: [5, 10, 20, 50],
        }}
        bordered
      />
    </div>
  );
};

export default PaginationExample;
