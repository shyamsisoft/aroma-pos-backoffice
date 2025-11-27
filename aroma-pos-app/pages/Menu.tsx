
import React, { useState } from 'react';
import { Button, theme } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MenuList from '../components/MenuList';
import MenuForm from '../components/MenuForm';
import { MenuItem, Category, ModifierGroup, Device, Employee } from '../types';

interface MenuPageProps {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  categories: Category[];
  modifierGroups: ModifierGroup[];
  devices: Device[];
  currentUser: Employee | null;
  onLogActivity: (action: string, target: string) => void;
}

const Menu: React.FC<MenuPageProps> = ({ 
  menuItems, 
  setMenuItems, 
  categories, 
  modifierGroups, 
  devices,
  currentUser,
  onLogActivity
}) => {
  const { token } = theme.useToken();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const isEditing = isCreating || !!selectedItemId;
  const selectedItem = menuItems.find(p => p.id === selectedItemId) || null;

  const handleCreateNewItem = () => {
    setSelectedItemId(null);
    setIsCreating(true);
  };

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItemId(item.id);
    setIsCreating(false);
  };

  const handleSaveItem = (itemData: Omit<MenuItem, 'id'>) => {
    if (isCreating) {
        const newItem: MenuItem = { ...itemData, id: Date.now().toString() };
        setMenuItems(prev => [newItem, ...prev]);
        setIsCreating(false);
        setSelectedItemId(newItem.id); 
        onLogActivity('created menu item', newItem.name);
    } else if (selectedItemId) {
        setMenuItems(prev => prev.map(p => p.id === selectedItemId ? { ...itemData, id: selectedItemId } : p));
        onLogActivity('updated menu item', itemData.name);
    }
  };

  const handleDeleteItem = (id: string) => {
    const item = menuItems.find(i => i.id === id);
    setMenuItems(prev => prev.filter(p => p.id !== id));
    if (selectedItemId === id) {
        setSelectedItemId(null);
        setIsCreating(false);
    }
    if (item) onLogActivity('deleted menu item', item.name);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div />
            {(currentUser?.role === 'Admin' || currentUser?.role === 'Manager') && (
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={handleCreateNewItem}
                    size="large"
                    style={{ 
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        padding: '0 24px'
                    }}
                >
                    Add New Item
                </Button>
            )}
        </div>

        <div style={{ flex: 1, display: 'flex', gap: 24, overflow: 'hidden' }}>
            {isEditing ? (
                <>
                    <div style={{ 
                        width: 320, 
                        borderRadius: 6,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        background: token.colorBgContainer,
                        border: `1px solid ${token.colorBorder}`
                    }}>
                        <MenuList 
                            items={menuItems} 
                            categories={categories}
                            modifierGroups={modifierGroups}
                            devices={devices}
                            onEdit={handleSelectItem} 
                            onDelete={handleDeleteItem} 
                            compact={true}
                            selectedId={selectedItemId}
                        />
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden', height: '100%' }}>
                        <MenuForm 
                            initialData={isCreating ? null : selectedItem} 
                            categories={categories}
                            modifierGroups={modifierGroups}
                            devices={devices}
                            onSave={handleSaveItem}
                            onCancel={() => { setIsCreating(false); setSelectedItemId(null); }}
                            onDelete={handleDeleteItem}
                        />
                    </div>
                </>
            ) : (
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <MenuList 
                        items={menuItems}
                        categories={categories} 
                        modifierGroups={modifierGroups}
                        devices={devices}
                        onEdit={handleSelectItem} 
                        onDelete={handleDeleteItem}
                    />
                </div>
            )}
        </div>
    </div>
  );
};

export default Menu;
