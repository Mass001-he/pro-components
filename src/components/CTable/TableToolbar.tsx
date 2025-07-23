import React from 'react';
import { Space, Button, Divider } from '@arco-design/web-react';
import { IconRefresh, IconDownload, IconPlus } from '@arco-design/web-react/icon';

export interface TableToolbarProps {
  title?: string;
  extra?: React.ReactNode;
  actions?: {
    refresh?: {
      show?: boolean;
      onClick?: () => void;
      loading?: boolean;
    };
    export?: {
      show?: boolean;
      onClick?: () => void;
      loading?: boolean;
    };
    create?: {
      show?: boolean;
      onClick?: () => void;
      text?: string;
    };
  };
  customRender?: () => React.ReactNode;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  title,
  extra,
  actions = {},
  customRender,
}) => {
  // 如果提供了自定义渲染函数，直接使用
  if (customRender) {
    return <div className="ctable-toolbar">{customRender()}</div>;
  }

  const { refresh, export: exportAction, create } = actions;

  const hasActions = refresh?.show || exportAction?.show || create?.show;

  if (!title && !extra && !hasActions) {
    return null;
  }

  return (
    <div className="ctable-toolbar" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: 16,
      padding: '12px 0',
    }}>
      {/* 左侧标题 */}
      <div className="ctable-toolbar-left">
        {title && (
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
            {title}
          </h3>
        )}
      </div>

      {/* 右侧操作区 */}
      <div className="ctable-toolbar-right">
        <Space>
          {/* 刷新按钮 */}
          {refresh?.show && (
            <Button
              icon={<IconRefresh />}
              onClick={refresh.onClick}
              loading={refresh.loading}
            >
              刷新
            </Button>
          )}

          {/* 导出按钮 */}
          {exportAction?.show && (
            <Button
              icon={<IconDownload />}
              onClick={exportAction.onClick}
              loading={exportAction.loading}
            >
              导出
            </Button>
          )}

          {/* 分隔线 */}
          {(refresh?.show || exportAction?.show) && create?.show && (
            <Divider type="vertical" />
          )}

          {/* 新建按钮 */}
          {create?.show && (
            <Button
              type="primary"
              icon={<IconPlus />}
              onClick={create.onClick}
            >
              {create.text || '新建'}
            </Button>
          )}

          {/* 额外内容 */}
          {extra}
        </Space>
      </div>
    </div>
  );
};

export default TableToolbar;
