import React, { useState } from 'react';
import { Table, Button, Space, Input, Modal, Typography, theme, Popconfirm, message, InputNumber, Row, Col, Card, Tabs, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BarsOutlined, AppstoreOutlined } from '@ant-design/icons';
import { ModifierGroup, ModifierItem, GroupModifierConfig } from '../../../shared/types';

const { Title, Text } = Typography;
const { Option } = Select;

interface ModifierViewProps {
    groups: ModifierGroup[];
    onSaveGroup: (group: ModifierGroup) => void;
    onDeleteGroup: (id: string) => void;
    
    items: ModifierItem[];
    onSaveItem: (item: ModifierItem) => void;
    onDeleteItem: (id: string) => void;
}

const ModifierView: React.FC<ModifierViewProps> = ({ 
    groups, 
    onSaveGroup, 
    onDeleteGroup,
    items,
    onSaveItem,
    onDeleteItem
}) => {
    const { token } = theme.useToken();
    
    // --- State for Modifier Items Tab ---
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ModifierItem | null>(null);
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState(0);

    // --- State for Modifier Groups Tab ---
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null);
    const [groupName, setGroupName] = useState('');
    const [groupMin, setGroupMin] = useState(0);
    const [groupMax, setGroupMax] = useState(1);
    const [assignedModifiers, setAssignedModifiers] = useState<GroupModifierConfig[]>([]);

    // --- Helper to look up item name by ID ---
    const getItemName = (id: string) => items.find(i => i.id === id)?.name || 'Unknown Item';
    const getItemPrice = (id: string) => items.find(i => i.id === id)?.price || 0;

    // ==========================================
    // ITEM HANDLERS
    // ==========================================
    const openItemModal = (item?: ModifierItem) => {
        if (item) {
            setEditingItem(item);
            setItemName(item.name);
            setItemPrice(item.price);
        } else {
            setEditingItem(null);
            setItemName('');
            setItemPrice(0);
        }
        setIsItemModalOpen(true);
    };

    const handleSaveItem = () => {
        if (!itemName) return message.error("Item name is required");
        const newItem: ModifierItem = {
            id: editingItem ? editingItem.id : Date.now().toString(),
            name: itemName,
            price: itemPrice
        };
        onSaveItem(newItem);
        setIsItemModalOpen(false);
    };

    // ==========================================
    // GROUP HANDLERS
    // ==========================================
    const openGroupModal = (group?: ModifierGroup) => {
        if (group) {
            setEditingGroup(group);
            setGroupName(group.name);
            setGroupMin(group.minSelection);
            setGroupMax(group.maxSelection);
            setAssignedModifiers(group.modifiers || []);
        } else {
            setEditingGroup(null);
            setGroupName('');
            setGroupMin(0);
            setGroupMax(1);
            setAssignedModifiers([]);
        }
        setIsGroupModalOpen(true);
    };

    const handleSaveGroup = () => {
        if (!groupName) return message.error("Group name is required");
        if (assignedModifiers.length === 0) return message.warning("Please add at least one modifier to the group");
        
        const newGroup: ModifierGroup = {
            id: editingGroup ? editingGroup.id : Date.now().toString(),
            name: groupName,
            minSelection: groupMin,
            maxSelection: groupMax,
            modifiers: assignedModifiers
        };
        onSaveGroup(newGroup);
        setIsGroupModalOpen(false);
    };

    // --- Inside Group Modal: Assigning Modifiers ---
    const addModifierToGroup = (modifierId: string) => {
        if (assignedModifiers.find(m => m.modifierId === modifierId)) {
            return message.warning("This modifier is already added to the group");
        }
        setAssignedModifiers([...assignedModifiers, { modifierId, minQuantity: 0, maxQuantity: 1 }]);
    };

    const removeModifierFromGroup = (modifierId: string) => {
        setAssignedModifiers(assignedModifiers.filter(m => m.modifierId !== modifierId));
    };

    const updateModifierConfig = (modifierId: string, field: 'minQuantity' | 'maxQuantity', value: number) => {
        setAssignedModifiers(prev => prev.map(m => m.modifierId === modifierId ? { ...m, [field]: value } : m));
    };

    // ==========================================
    // RENDERERS
    // ==========================================
    
    // 1. Items Tab Content
    const renderItemsTab = () => {
        const columns = [
            { title: 'Name', dataIndex: 'name', key: 'name', width: '40%', render: (t: string) => <strong>{t}</strong> },
            { title: 'Base Price', dataIndex: 'price', key: 'price', render: (p: number) => `$${p.toFixed(2)}` },
            {
                title: 'Actions',
                key: 'actions',
                render: (_: any, record: ModifierItem) => (
                    <Space>
                        <Button size="small" icon={<EditOutlined />} onClick={() => openItemModal(record)}>Edit</Button>
                        <Popconfirm title="Delete item?" onConfirm={() => onDeleteItem(record.id)} okButtonProps={{ danger: true }}>
                            <Button size="small" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Space>
                )
            }
        ];

        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openItemModal()} style={{ background: '#10b981', borderColor: '#10b981' }}>
                        Create Modifier Item
                    </Button>
                </div>
                <Table 
                    className="custom-table"
                    dataSource={items} 
                    columns={columns} 
                    rowKey="id" 
                    pagination={{ pageSize: 8 }} 
                    bordered 
                    size="middle"
                />
            </div>
        );
    };

    // 2. Groups Tab Content
    const renderGroupsTab = () => (
        <div>
             <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openGroupModal()} style={{ background: '#6132C0', borderColor: '#6132C0' }}>
                    Create Modifier Group
                </Button>
            </div>
            <Row gutter={[16, 16]}>
                {groups.map(group => (
                    <Col xs={24} md={12} lg={8} key={group.id}>
                        <Card 
                            title={<span style={{ fontWeight: 600 }}>{group.name}</span>} 
                            extra={
                                <Space>
                                    <Button type="text" icon={<EditOutlined style={{ color: token.colorPrimary }} />} onClick={() => openGroupModal(group)} />
                                    <Popconfirm title="Delete group?" onConfirm={() => onDeleteGroup(group.id)} okButtonProps={{ danger: true }}>
                                        <Button type="text" danger icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                </Space>
                            }
                            style={{ borderRadius: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                            bodyStyle={{ padding: '12px 16px' }}
                        >
                            <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
                                <Tag color="blue">Min: {group.minSelection}</Tag>
                                <Tag color="orange">Max: {group.maxSelection}</Tag>
                            </div>
                            <div style={{ height: 150, overflowY: 'auto', background: token.colorBgLayout, padding: 8, borderRadius: 6 }}>
                                {group.modifiers.map(mod => (
                                    <div key={mod.modifierId} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                                        <span>{getItemName(mod.modifierId)}</span>
                                        <Space size={4}>
                                            <span style={{ fontSize: 11, color: token.colorTextSecondary }}>({mod.minQuantity}-{mod.maxQuantity})</span>
                                            <span style={{ fontWeight: 600 }}>+${getItemPrice(mod.modifierId).toFixed(2)}</span>
                                        </Space>
                                    </div>
                                ))}
                                {group.modifiers.length === 0 && <span style={{ color: '#ccc', fontSize: 12 }}>No modifiers assigned</span>}
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );

    return (
        <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={2} style={{ margin: 0 }}>Modifier Management</Title>
            </div>

            <div style={{ background: token.colorBgContainer, padding: 24, borderRadius: 12, minHeight: 400 }}>
                <Tabs 
                    defaultActiveKey="groups"
                    items={[
                        { key: 'groups', label: <span><AppstoreOutlined /> Modifier Groups</span>, children: renderGroupsTab() },
                        { key: 'items', label: <span><BarsOutlined /> Modifier Items (Registry)</span>, children: renderItemsTab() },
                    ]}
                />
            </div>

            {/* ITEM MODAL */}
            <Modal
                title={editingItem ? "Edit Modifier Item" : "Create Modifier Item"}
                open={isItemModalOpen}
                onOk={handleSaveItem}
                onCancel={() => setIsItemModalOpen(false)}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                    <div>
                        <div style={{ marginBottom: 4 }}>Item Name</div>
                        <Input 
                            placeholder="e.g. Extra Cheese" 
                            value={itemName} 
                            onChange={e => setItemName(e.target.value)} 
                        />
                    </div>
                    <div>
                        <div style={{ marginBottom: 4 }}>Base Price ($)</div>
                        <InputNumber 
                            style={{ width: '100%' }} 
                            min={0} 
                            prefix="$" 
                            value={itemPrice} 
                            onChange={val => setItemPrice(val || 0)} 
                        />
                    </div>
                </div>
            </Modal>

            {/* GROUP MODAL */}
            <Modal
                title={editingGroup ? "Edit Modifier Group" : "Create Modifier Group"}
                open={isGroupModalOpen}
                onOk={handleSaveGroup}
                onCancel={() => setIsGroupModalOpen(false)}
                width={700}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                    {/* General Group Settings */}
                    <Card size="small" title="Group Settings" style={{ background: token.colorBgLayout }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <Input 
                                placeholder="Group Name (e.g. Pizza Toppings)" 
                                value={groupName} 
                                onChange={e => setGroupName(e.target.value)} 
                            />
                            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                <span style={{ width: 150 }}>Global Constraints:</span>
                                <InputNumber 
                                    addonBefore="Min Select" 
                                    min={0} 
                                    value={groupMin} 
                                    onChange={v => setGroupMin(v || 0)} 
                                />
                                <InputNumber 
                                    addonBefore="Max Select" 
                                    min={1} 
                                    value={groupMax} 
                                    onChange={v => setGroupMax(v || 1)} 
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Assigned Modifiers */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text strong>Assigned Modifiers</Text>
                            <Select
                                showSearch
                                placeholder="Add Modifier Item..."
                                style={{ width: 250 }}
                                onChange={(val) => addModifierToGroup(val)}
                                value={null} // Always reset
                                filterOption={(input, option) => 
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={items.map(i => ({ value: i.id, label: `${i.name} ($${i.price})` }))}
                            />
                        </div>

                        <div style={{ 
                            border: `1px solid ${token.colorBorder}`, 
                            borderRadius: 6, 
                            maxHeight: 300, 
                            overflowY: 'auto' 
                        }}>
                            <Table 
                                dataSource={assignedModifiers}
                                rowKey="modifierId"
                                pagination={false}
                                size="small"
                                columns={[
                                    { 
                                        title: 'Item Name', 
                                        dataIndex: 'modifierId', 
                                        render: (id) => <Text strong>{getItemName(id)}</Text> 
                                    },
                                    {
                                        title: 'Price',
                                        dataIndex: 'modifierId',
                                        width: 80,
                                        render: (id) => `$${getItemPrice(id).toFixed(2)}`
                                    },
                                    {
                                        title: 'Min Qty',
                                        dataIndex: 'minQuantity',
                                        width: 100,
                                        render: (val, record) => (
                                            <InputNumber 
                                                min={0} 
                                                size="small" 
                                                value={val} 
                                                onChange={v => updateModifierConfig(record.modifierId, 'minQuantity', v || 0)} 
                                            />
                                        )
                                    },
                                    {
                                        title: 'Max Qty',
                                        dataIndex: 'maxQuantity',
                                        width: 100,
                                        render: (val, record) => (
                                            <InputNumber 
                                                min={1} 
                                                size="small" 
                                                value={val} 
                                                onChange={v => updateModifierConfig(record.modifierId, 'maxQuantity', v || 1)} 
                                            />
                                        )
                                    },
                                    {
                                        title: '',
                                        key: 'action',
                                        width: 50,
                                        render: (_, record) => (
                                            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeModifierFromGroup(record.modifierId)} />
                                        )
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ModifierView;