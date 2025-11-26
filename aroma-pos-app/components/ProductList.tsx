import React from 'react';
import { Table, Button, Space, Popconfirm, List, theme, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Define local type to resolve missing export
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock?: number;
}

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
  selectedId?: string | null;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  onEdit, 
  onDelete, 
  compact = false,
  selectedId 
}) => {
  const { token } = theme.useToken();

  // Compact View (Sidebar style for Split View)
  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: token.colorBgContainer }}>
        {/* Header */}
        <div style={{ 
          padding: '16px 20px', 
          background: token.colorPrimary, // Purple
          color: 'white',
          fontWeight: 600,
          fontSize: 14,
          letterSpacing: '0.5px'
        }}>
           PRODUCT LIST
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
            <List
                dataSource={products}
                rowKey="id"
                renderItem={item => {
                    const isSelected = item.id === selectedId;
                    return (
                        <List.Item 
                            onClick={() => onEdit(item)}
                            style={{ 
                                padding: '16px 20px', 
                                cursor: 'pointer',
                                background: isSelected ? token.colorFillSecondary : 'transparent',
                                borderLeft: isSelected ? `4px solid ${token.colorPrimary}` : '4px solid transparent',
                                transition: 'all 0.2s',
                                borderBottom: `1px solid ${token.colorBorderSecondary}`
                             }}
                             // Add hover class via CSS or leave to standard behavior
                             onMouseEnter={(e) => {
                                 if (!isSelected) e.currentTarget.style.background = token.colorFillTertiary;
                             }}
                             onMouseLeave={(e) => {
                                 if (!isSelected) e.currentTarget.style.background = 'transparent';
                             }}
                        >
                            <div style={{ width: '100%' }}>
                                <div style={{ 
                                    whiteSpace: 'nowrap', 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    color: isSelected ? token.colorPrimary : token.colorText,
                                    fontWeight: isSelected ? 600 : 500,
                                    fontSize: 14
                                }}>
                                    {item.name}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                    <span style={{ fontSize: 12, color: token.colorTextSecondary }}>{item.category}</span>
                                    <span style={{ fontSize: 12, fontWeight: 500, color: token.colorTextSecondary }}>${(item.price ?? 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </List.Item>
                    );
                }}
            />
        </div>
      </div>
    );
  }

  // Full Table View
  const columns = [
    {
      title: 'PRODUCT NAME',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text: string) => <span style={{ fontWeight: 500, color: token.colorText }}>{text}</span>
    },
    {
      title: 'CATEGORY',
      dataIndex: 'category',
      key: 'category',
      width: '15%',
      render: (cat: string) => <Tag style={{ borderRadius: 12 }}>{cat}</Tag>
    },
    {
        title: 'STATUS',
        key: 'status',
        width: '15%',
        render: (_: any, record: Product) => {
            const stock = record.stock ?? 0;
            let color = 'green';
            let text = 'In Stock';
            if (stock === 0) { color = 'red'; text = 'Out of Stock'; }
            else if (stock < 20) { color = 'orange'; text = 'Low Stock'; }
            
            return <Tag color={color} bordered={false} style={{ fontWeight: 600 }}>{text}</Tag>;
        }
    },
    {
      title: 'UNIT PRICE',
      dataIndex: 'price',
      key: 'price',
      width: '15%',
      render: (price: number | undefined | null) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>${(price ?? 0).toFixed(2)}</span>,
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_: any, record: Product) => (
        <Space size="small">
          <Tooltip title="Edit Product">
            <Button 
                type="text" 
                size="small" 
                icon={<EditOutlined style={{ color: token.colorPrimary }} />}
                onClick={() => onEdit(record)}
                style={{ background: token.colorFillTertiary }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Product"
            description="Are you sure you want to delete this product?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
                <Button 
                    type="text"
                    size="small" 
                    icon={<DeleteOutlined style={{ color: '#ef4444' }} />}
                    style={{ background: token.colorErrorBg }}
                />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: token.colorBgContainer, borderRadius: 12, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
      <Table 
        className="custom-table"
        columns={columns} 
        dataSource={products} 
        rowKey="id"
        pagination={{ pageSize: 8, position: ['bottomCenter'] }}
        scroll={{ y: 'calc(100vh - 240px)' }}
        style={{ flex: 1 }}
      />
    </div>
  );
};

export default ProductList;