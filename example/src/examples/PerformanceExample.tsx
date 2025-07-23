import React, { useState, useMemo } from 'react';
import { Message, Button, Space, Select } from '@arco-design/web-react';
import { CTable, CTableColumn } from '@mass001/pro-components';

interface DataItem {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  age: number;
  score: number;
  status: string;
  createTime: string;
}

// 生成大量测试数据
const generateLargeDataset = (size: number): DataItem[] => {
  const departments = [
    '技术部',
    '产品部',
    '设计部',
    '运营部',
    '市场部',
    '人事部',
    '财务部',
  ];
  const positions = ['工程师', '高级工程师', '专家', '经理', '总监', 'VP'];
  const statuses = ['active', 'inactive', 'pending'];

  return Array.from({ length: size }, (_, index) => ({
    id: index + 1,
    name: `用户${index + 1}`,
    email: `user${index + 1}@company.com`,
    department: departments[index % departments.length],
    position: positions[index % positions.length],
    salary: Math.floor(Math.random() * 50000) + 10000,
    age: Math.floor(Math.random() * 40) + 22,
    score: Math.floor(Math.random() * 40) + 60,
    status: statuses[index % statuses.length],
    createTime: new Date(
      2020 + Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    )
      .toISOString()
      .split('T')[0],
  }));
};

const columns: CTableColumn<DataItem>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
    fixed: 'left',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
    fixed: 'left',
    searchConfig: {
      type: 'input',
      placeholder: '请输入姓名',
    },
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 200,
  },
  {
    title: '部门',
    dataIndex: 'department',
    width: 100,
    filters: [
      { text: '技术部', value: '技术部' },
      { text: '产品部', value: '产品部' },
      { text: '设计部', value: '设计部' },
      { text: '运营部', value: '运营部' },
    ],
    onFilter: (value: any, record: DataItem) => record.department === value,
    searchConfig: {
      type: 'select',
      options: [
        { label: '技术部', value: '技术部' },
        { label: '产品部', value: '产品部' },
        { label: '设计部', value: '设计部' },
        { label: '运营部', value: '运营部' },
      ],
    },
  },
  {
    title: '职位',
    dataIndex: 'position',
    width: 120,
  },
  {
    title: '薪资',
    dataIndex: 'salary',
    width: 120,
    valueType: 'number',
    sorter: true,
    render: (value: number) => `¥${value.toLocaleString()}`,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 80,
    valueType: 'number',
    sorter: true,
  },
  {
    title: '评分',
    dataIndex: 'score',
    width: 100,
    sorter: true,
    render: (value: number) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 8 }}>{value}</span>
        <div
          style={{
            width: 40,
            height: 4,
            backgroundColor: '#f0f0f0',
            borderRadius: 2,
          }}
        >
          <div
            style={{
              width: `${(value / 100) * 100}%`,
              height: '100%',
              backgroundColor:
                value >= 80 ? '#00b42a' : value >= 60 ? '#ff7d00' : '#f53f3f',
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (value: string) => {
      const statusMap = {
        active: { text: '活跃', color: '#00b42a' },
        inactive: { text: '非活跃', color: '#f53f3f' },
        pending: { text: '待定', color: '#ff7d00' },
      };
      const status = statusMap[value as keyof typeof statusMap];
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
    sorter: true,
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    fixed: 'right',
    render: (_, record: DataItem) => (
      <div>
        <Button
          type="text"
          size="small"
          onClick={() => Message.info(`查看用户 ${record.name}`)}
          style={{ marginRight: 4 }}
        >
          查看
        </Button>
        <Button
          type="text"
          size="small"
          onClick={() => Message.info(`编辑用户 ${record.name}`)}
        >
          编辑
        </Button>
      </div>
    ),
  },
];

const PerformanceExample: React.FC = () => {
  const [dataSize, setDataSize] = useState(1000);
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [renderTime, setRenderTime] = useState(0);

  // 生成大数据集
  const allData = useMemo(() => {
    console.log(`生成 ${dataSize} 条数据...`);
    const startTime = performance.now();
    const data = generateLargeDataset(dataSize);
    const endTime = performance.now();
    console.log(`数据生成耗时: ${(endTime - startTime).toFixed(2)}ms`);
    return data;
  }, [dataSize]);

  // 当前页数据
  const currentPageData = useMemo(() => {
    const startTime = performance.now();
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = allData.slice(startIndex, endIndex);
    const endTime = performance.now();
    setRenderTime(endTime - startTime);
    return pageData;
  }, [allData, currentPage, pageSize]);

  const handleDataSizeChange = (size: number) => {
    setLoading(true);
    setDataSize(size);
    setCurrentPage(1);

    // 模拟加载延迟
    setTimeout(() => {
      setLoading(false);
      Message.success(`已生成 ${size} 条数据`);
    }, 100);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handlePaginationChange = (current: number, size: number) => {
    setCurrentPage(current);
    setPageSize(size);
  };

  const handleSearch = (values: Record<string, any>) => {
    console.log('搜索参数:', values);
    Message.info(`搜索: ${JSON.stringify(values)}`);
  };

  const handleReset = () => {
    Message.info('重置搜索条件');
  };

  return (
    <div>
      {/* 性能控制面板 */}
      <div
        style={{
          marginBottom: 16,
          padding: 16,
          backgroundColor: '#f7f8fa',
          borderRadius: 6,
          border: '1px solid #e5e6eb',
        }}
      >
        <h4 style={{ margin: '0 0 12px 0' }}>性能测试控制面板</h4>
        <Space wrap>
          <div>
            <span style={{ marginRight: 8 }}>数据量:</span>
            <Select
              value={dataSize}
              onChange={handleDataSizeChange}
              style={{ width: 120 }}
              options={[
                { label: '100条', value: 100 },
                { label: '500条', value: 500 },
                { label: '1000条', value: 1000 },
                { label: '5000条', value: 5000 },
                { label: '10000条', value: 10000 },
              ]}
            />
          </div>
          <div>
            <span style={{ marginRight: 8 }}>每页显示:</span>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              style={{ width: 100 }}
              options={[
                { label: '20', value: 20 },
                { label: '50', value: 50 },
                { label: '100', value: 100 },
                { label: '200', value: 200 },
              ]}
            />
          </div>
        </Space>

        <div style={{ marginTop: 12, fontSize: '14px', color: '#4e5969' }}>
          <div>总数据量: {allData.length.toLocaleString()} 条</div>
          <div>当前页数据: {currentPageData.length} 条</div>
          <div>渲染耗时: {renderTime.toFixed(2)}ms</div>
          <div>
            当前页码: {currentPage} / {Math.ceil(allData.length / pageSize)}
          </div>
        </div>
      </div>

      {/* 表格 */}
      <CTable
        columns={columns}
        dataSource={currentPageData}
        loading={loading}
        search={{
          onSearch: handleSearch,
          onReset: handleReset,
          defaultCollapsed: true,
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: allData.length,
          onChange: handlePaginationChange,
          sizeCanChange: true,
          sizeOptions: [20, 50, 100, 200],
        }}
        toolBarRender={() => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              padding: '12px 0',
            }}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
              性能测试 ({allData.length.toLocaleString()} 条数据)
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    Message.success('刷新完成');
                  }, 500);
                }}
                loading={loading}
              >
                刷新
              </Button>
              <Button onClick={() => Message.info('导出大数据集')}>导出</Button>
            </div>
          </div>
        )}
        bordered
        size="small"
      />
    </div>
  );
};

export default PerformanceExample;
