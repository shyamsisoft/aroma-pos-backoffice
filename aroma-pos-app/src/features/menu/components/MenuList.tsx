import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, List, theme, Tag, Tooltip, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { MenuItem, Category, ModifierGroup, Device } from '../../../shared/types';

interface MenuListProps {
  items: MenuItem[];
  categories: Category[];
  modifierGroups: ModifierGroup[];
  devices: Device[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
  selectedId?: string | null;
}

const MenuList: React.FC<MenuListProps> = ({ 
  items, 
  categories,
  modifierGroups,
  devices,
  onEdit, 
  onDelete, 
  compact = false,
  selectedId 
}) => {
  const { token } = theme.useToken();
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const getCatName = (id: string) => categories.find(c => c.id === id)?.name || 'Uncategorized';
  const getModifierGroupNames = (ids: string[]) => ids.map(id => modifierGroups.find(g => g.id === id)?.name).filter(Boolean).join(', ');
  
  const getCategoryDevices = (categoryId: string, type: 'KDS' | 'Printer') => {
      const category = categories.find(c => c.id === categoryId);
      if (!category) return null;
      
      const deviceIds = type === 'KDS' ? category.kdsDeviceIds : category.printerDeviceIds;
      if (!deviceIds || deviceIds.length === 0) return null;

      return deviceIds.map(id => {
          const dev = devices.find(d => d.id === id);
          return dev ? dev.name : null;
      }).filter(Boolean);
  };

  const filteredItems = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = filterCategory ? item.categoryId === filterCategory : true;
      return matchesSearch && matchesCategory;
  });

  const getPriceRange = (item: MenuItem) => {
    if (item.variants && item.variants.length > 0) {
        const prices = item.variants.map(v => v.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        if (min === max) return `$${min.toFixed(2)}`;
        return `$${min.toFixed(2)} - $${max.toFixed(2)}`;
    }
    return '$0.00';
  };

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
           MENU ITEMS
        </div>
        
        {/* Compact Filter */}
        <div style={{ padding: '8px 12px', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
            <Input 
                placeholder="Search..." 
                prefix={<SearchOutlined style={{ color: token.colorTextSecondary }} />} 
                size="small"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ borderRadius: 4 }}
            />
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
            <List
                dataSource={filteredItems}
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
                                    <span style={{ fontSize: 12, color: token.colorTextSecondary }}>{getCatName(item.categoryId)}</span>
                                    <span style={{ fontSize: 12, fontWeight: 500, color: token.colorTextSecondary }}>
                                        {getPriceRange(item)}
                                    </span>
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
      title: 'ITEM NAME',
      dataIndex: 'name',
      key: 'name',
      width: '18%',
      render: (text: string) => <span style={{ fontWeight: 500, color: token.colorText }}>{text}</span>
    },
    {
      title: 'CATEGORY',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: '10%',
      render: (catId: string) => <Tag style={{ borderRadius: 12 }}>{getCatName(catId)}</Tag>
    },
    {
      title: 'PRICE',
      key: 'price',
      width: '10%',
      render: (_: any, record: MenuItem) => (
          <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{getPriceRange(record)}</span>
      ),
    },
    {
        title: 'MODIFIERS',
        key: 'modifiers',
        width: '12%',
        render: (_: any, record: MenuItem) => (
            <span style={{ fontSize: 12, color: token.colorTextSecondary }}>
                {getModifierGroupNames(record.modifierGroupIds)}
            </span>
        )
    },
    {
        title: 'VARIANTS',
        key: 'variants',
        width: '12%',
        render: (_: any, record: MenuItem) => (
            <span style={{ fontSize: 12, color: token.colorTextSecondary }}>
                {record.variants.map(v => v.name).join(', ')}
            </span>
        )
    },
    {
        title: 'KDS',
        key: 'kds',
        width: '12%',
        render: (_: any, record: MenuItem) => {
            // Get from category now, not item
            const names = getCategoryDevices(record.categoryId, 'KDS');
            if (!names || names.length === 0) return <span style={{ color: '#ccc', fontSize: 11 }}>--</span>;
            return (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {names.map(n => <Tag key={n} color="blue" style={{ margin: 0, fontSize: 10 }}>{n}</Tag>)}
                </div>
            );
        }
    },
    {
        title: 'PRINTERS',
        key: 'printers',
        width: '12%',
        render: (_: any, record: MenuItem) => {
             // Get from category now, not item
            const names = getCategoryDevices(record.categoryId, 'Printer');
            if (!names || names.length === 0) return <span style={{ color: '#ccc', fontSize: 11 }}>--</span>;
            return (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {names.map(n => <Tag key={n} color="geekblue" style={{ margin: 0, fontSize: 10 }}>{n}</Tag>)}
                </div>
            );
        }
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_: any, record: MenuItem) => (
        <Space size="small">
          <Tooltip title="Edit Item">
            <Button 
                type="text" 
                size="small" 
                icon={<EditOutlined style={{ color: token.colorPrimary }} />}
                onClick={() => onEdit(record)}
                style={{ background: token.colorFillTertiary }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Item"
            description="Are you sure you want to delete this menu item?"
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
      {/* Toolbar */}
      <div style={{ padding: 16, borderBottom: `1px solid ${token.colorBorderSecondary}`, display: 'flex', gap: 16 }}>
        <Input 
            placeholder="Search items..." 
            prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ maxWidth: 300 }}
        />
        <Select 
            placeholder="Filter Category" 
            allowClear 
            style={{ width: 200 }}
            onChange={val => setFilterCategory(val)}
        >
            {categories.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
        </Select>
      </div>

      <Table 
        className="custom-table"
        columns={columns} 
        dataSource={filteredItems} 
        rowKey="id"
        pagination={{ pageSize: 8, position: ['bottomCenter'] }}
        scroll={{ y: 'calc(100vh - 300px)' }}
        style={{ flex: 1 }}
      />
    </div>
  );
};

export default MenuList;