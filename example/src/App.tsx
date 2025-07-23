import React from 'react';
import BasicExample from './examples/BasicExample';
import SearchExample from './examples/SearchExample';
import PaginationExample from './examples/PaginationExample';
import ToolbarExample from './examples/ToolbarExample';
import AdvancedExample from './examples/AdvancedExample';
import PerformanceExample from './examples/PerformanceExample';
import DirectArcoTest from './examples/DirectArcoTest';
import SimplePaginationTest from './examples/SimplePaginationTest';

function App() {
  return (
    <div>
      {/* 页面头部 */}
      <div className="page-header">
        <h1>CTable 组件示例</h1>
        <p>基于 Arco Design 的高级表格组件，提供搜索、分页、排序、筛选等功能</p>
      </div>

      <div className="example-container">
        {/* 基础示例 */}
        <div className="example-section">
          <h2 className="example-title">1. 基础表格</h2>
          <p className="example-description">
            最基本的表格使用方式，只需要提供 columns 和 dataSource。
          </p>
          <BasicExample />
        </div>

        {/* 搜索示例 */}
        <div className="example-section">
          <h2 className="example-title">2. 搜索功能</h2>
          <p className="example-description">
            支持多种搜索控件类型：输入框、选择器、日期范围、数字范围等。
          </p>
          <SearchExample />
        </div>

        {/* 分页示例 */}
        <div className="example-section">
          <h2 className="example-title">3. 分页功能</h2>
          <p className="example-description">
            完整的分页功能，支持页面大小选择和页码跳转。
          </p>
          <PaginationExample />
        </div>

        {/* 工具栏示例 */}
        <div className="example-section">
          <h2 className="example-title">4. 工具栏功能</h2>
          <p className="example-description">
            内置工具栏组件，支持标题、刷新、导出、新建等常用操作。
          </p>
          <ToolbarExample />
        </div>

        {/* 高级功能示例 */}
        <div className="example-section">
          <h2 className="example-title">5. 高级功能</h2>
          <p className="example-description">
            展示排序、筛选、固定列、自定义渲染等高级功能。
          </p>
          <AdvancedExample />
        </div>

        {/* 简单分页测试 */}
        <div className="example-section">
          <h2 className="example-title">6. 简单分页测试</h2>
          <p className="example-description">
            测试CTable组件的页面大小选择器功能。
          </p>
          <SimplePaginationTest />
        </div>

        {/* 直接Arco测试 */}
        <div className="example-section">
          <h2 className="example-title">7. 直接Arco测试</h2>
          <p className="example-description">
            直接使用Arco Design Table测试分页功能。
          </p>
          <DirectArcoTest />
        </div>

        {/* 性能测试示例 */}
        <div className="example-section">
          <h2 className="example-title">8. 性能测试</h2>
          <p className="example-description">大数据量场景下的性能表现测试。</p>
          <PerformanceExample />
        </div>
      </div>
    </div>
  );
}

export default App;
