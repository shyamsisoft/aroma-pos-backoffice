import React, { useState } from 'react';
import { Table, Button, Space, Input, Modal, Typography, theme, Popconfirm, message, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Variant } from '../../../shared/types';

interface VariantsViewProps {
    variants: Variant[];
    onSave: (cat: Variant) => void;
    onDelete: (id: string) => void;
}

const VariantsView: React.FC<VariantsViewProps> = ({ variants, onSave, onDelete }) => {
    const { token } = theme.useToken();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCat, setEditingCat] = useState<Variant | null>(null);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');

    const showModal = (cat?: Variant) => {
        if (cat) {
            setEditingCat(cat);
            setName(cat.name);
            setDesc(cat.description || '');
        } else {
            setEditingCat(null);
            setName('');
            setDesc('');
        }
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (!name) return message.error("Name is required");
        const newCat: Variant = {
            id: editingCat ? editingCat.id : '',
            name,
            description: desc,
        };
        onSave(newCat);
        setIsModalVisible(false);
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', width: '20%', render: (t: string) => <strong style={{ color: token.colorText }}>{t}</strong> },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        {
            title: 'Actions',
            key: 'actions',
            width: '100px',
            render: (_: any, record: Variant) => (
                <Space>
                    <Button type="text" icon={<EditOutlined style={{ color: token.colorPrimary }} />} onClick={() => showModal(record)} />
                    <Popconfirm title="Delete?" onConfirm={() => onDelete(record.id)} okButtonProps={{ danger: true }}>
                        <Button type="text" icon={<DeleteOutlined style={{ color: 'red' }} />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <Typography.Title level={2} style={{ margin: 0 }}>Variants</Typography.Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>Add Variant</Button>
            </div>
            <div style={{ background: token.colorBgContainer, borderRadius: 12, border: `1px solid ${token.colorBorderSecondary}`, overflow: 'hidden' }}>
                 <Table className="custom-table" dataSource={variants} columns={columns} rowKey="id" pagination={false} />
            </div>

            <Modal 
                title={editingCat ? "Edit Variant" : "Add Variant"} 
                open={isModalVisible} 
                onOk={handleOk} 
                onCancel={() => setIsModalVisible(false)}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                    <Input placeholder="Variant Name" value={name} onChange={e => setName(e.target.value)} />
                    <Input.TextArea placeholder="Description (Optional)" value={desc} onChange={e => setDesc(e.target.value)} />
                </div>
            </Modal>
        </div>
    );
};

export default VariantsView;