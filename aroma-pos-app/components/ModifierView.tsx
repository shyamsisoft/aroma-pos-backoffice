import React, { useState } from 'react';
import { Table, Button, Space, Input, Modal, Typography, theme, Popconfirm, message, List, InputNumber, Row, Col, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { ModifierGroup, Modifier } from '../types';

interface ModifierViewProps {
    groups: ModifierGroup[];
    onSave: (group: ModifierGroup) => void;
    onDelete: (id: string) => void;
}

const ModifierView: React.FC<ModifierViewProps> = ({ groups, onSave, onDelete }) => {
    const { token } = theme.useToken();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null);
    
    // Form States
    const [name, setName] = useState('');
    const [minSel, setMinSel] = useState(0);
    const [maxSel, setMaxSel] = useState(1);
    const [modifiers, setModifiers] = useState<Modifier[]>([]);

    const showModal = (group?: ModifierGroup) => {
        if (group) {
            setEditingGroup(group);
            setName(group.name);
            setMinSel(group.minSelection);
            setMaxSel(group.maxSelection);
            setModifiers(group.modifiers);
        } else {
            setEditingGroup(null);
            setName('');
            setMinSel(0);
            setMaxSel(1);
            setModifiers([]);
        }
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (!name) return message.error("Group name is required");
        const newGroup: ModifierGroup = {
            id: editingGroup ? editingGroup.id : Date.now().toString(),
            name,
            minSelection: minSel,
            maxSelection: maxSel,
            modifiers
        };
        onSave(newGroup);
        setIsModalVisible(false);
    };

    // Modifier Item Logic
    const addModifier = () => {
        setModifiers([...modifiers, { id: Date.now().toString(), name: 'New Option', price: 0 }]);
    };
    const updateModifier = (id: string, field: keyof Modifier, val: any) => {
        setModifiers(modifiers.map(m => m.id === id ? { ...m, [field]: val } : m));
    };
    const removeModifier = (id: string) => {
        setModifiers(modifiers.filter(m => m.id !== id));
    };

    return (
        <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <Typography.Title level={2} style={{ margin: 0 }}>Modifier Groups</Typography.Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} style={{ background: '#10b981', borderColor: '#10b981' }}>Create Group</Button>
            </div>

            <Row gutter={[16, 16]}>
                {groups.map(group => (
                    <Col xs={24} md={12} lg={8} key={group.id}>
                        <Card 
                            title={<span style={{ fontWeight: 600 }}>{group.name}</span>} 
                            extra={
                                <Space>
                                    <Button type="text" icon={<EditOutlined />} onClick={() => showModal(group)} />
                                    <Popconfirm title="Delete?" onConfirm={() => onDelete(group.id)} okButtonProps={{ danger: true }}>
                                        <Button type="text" danger icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                </Space>
                            }
                            style={{ borderRadius: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                        >
                            <div style={{ marginBottom: 12 }}>
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                    Required: {group.minSelection} | Max: {group.maxSelection}
                                </Typography.Text>
                            </div>
                            <div style={{ maxHeight: 150, overflowY: 'auto' }}>
                                {group.modifiers.map(mod => (
                                    <div key={mod.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                                        <span>{mod.name}</span>
                                        <span style={{ fontWeight: 600 }}>+${mod.price.toFixed(2)}</span>
                                    </div>
                                ))}
                                {group.modifiers.length === 0 && <span style={{ color: '#ccc' }}>No options defined</span>}
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal 
                title={editingGroup ? "Edit Modifier Group" : "Create Modifier Group"} 
                open={isModalVisible} 
                onOk={handleOk} 
                onCancel={() => setIsModalVisible(false)}
                width={600}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                    <Input placeholder="Group Name (e.g., Pizza Toppings)" value={name} onChange={e => setName(e.target.value)} />
                    <Space>
                        <span>Min Selection:</span>
                        <InputNumber min={0} value={minSel} onChange={v => setMinSel(v || 0)} />
                        <span>Max Selection:</span>
                        <InputNumber min={1} value={maxSel} onChange={v => setMaxSel(v || 1)} />
                    </Space>
                    
                    <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}`, paddingTop: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <strong>Options</strong>
                            <Button size="small" onClick={addModifier} icon={<PlusOutlined />}>Add Option</Button>
                        </div>
                        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                            {modifiers.map(mod => (
                                <div key={mod.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                    <Input placeholder="Name" value={mod.name} onChange={e => updateModifier(mod.id, 'name', e.target.value)} style={{ flex: 2 }} />
                                    <InputNumber prefix="$" placeholder="Price" value={mod.price} onChange={v => updateModifier(mod.id, 'price', v)} style={{ flex: 1 }} />
                                    <Button danger icon={<DeleteOutlined />} onClick={() => removeModifier(mod.id)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ModifierView;