import React, { useState } from 'react';
import { Table, Button, Space, Input, Modal, Typography, theme, Popconfirm, message, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Category, Device } from '../../../shared/types';

interface CategoryViewProps {
    categories: Category[];
    devices?: Device[]; // Made optional to prevent breaking, but expected to be passed
    onSave: (cat: Category) => void;
    onDelete: (id: string) => void;
}

const { Option } = Select;

const CategoryView: React.FC<CategoryViewProps> = ({ categories, devices = [], onSave, onDelete }) => {
    const { token } = theme.useToken();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCat, setEditingCat] = useState<Category | null>(null);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [selectedKds, setSelectedKds] = useState<string[]>([]);
    const [selectedPrinters, setSelectedPrinters] = useState<string[]>([]);

    const showModal = (cat?: Category) => {
        if (cat) {
            setEditingCat(cat);
            setName(cat.name);
            setDesc(cat.description || '');
            setSelectedKds(cat.kdsDeviceIds || []);
            setSelectedPrinters(cat.printerDeviceIds || []);
        } else {
            setEditingCat(null);
            setName('');
            setDesc('');
            setSelectedKds([]);
            setSelectedPrinters([]);
        }
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (!name) return message.error("Name is required");
        const newCat: Category = {
            id: editingCat ? editingCat.id : Date.now().toString(),
            name,
            description: desc,
            kdsDeviceIds: selectedKds,
            printerDeviceIds: selectedPrinters
        };
        onSave(newCat);
        setIsModalVisible(false);
    };

    const getDeviceNames = (ids?: string[]) => {
        if (!ids || ids.length === 0) return null;
        return ids.map(id => devices.find(d => d.id === id)?.name).filter(Boolean).join(', ');
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', width: '25%', render: (t: string) => <strong style={{ color: token.colorText }}>{t}</strong> },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { 
            title: 'Assigned KDS', 
            dataIndex: 'kdsDeviceIds', 
            key: 'kds',
            render: (ids: string[]) => {
                if(!ids || ids.length === 0) return <span style={{color: token.colorTextTertiary}}>-</span>;
                return ids.map(id => {
                    const d = devices.find(dev => dev.id === id);
                    return d ? <Tag key={id} color="blue">{d.name}</Tag> : null;
                });
            }
        },
        { 
            title: 'Assigned Printers', 
            dataIndex: 'printerDeviceIds', 
            key: 'printers',
            render: (ids: string[]) => {
                 if(!ids || ids.length === 0) return <span style={{color: token.colorTextTertiary}}>-</span>;
                 return ids.map(id => {
                    const d = devices.find(dev => dev.id === id);
                    return d ? <Tag key={id} color="geekblue">{d.name}</Tag> : null;
                });
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '120px',
            render: (_: any, record: Category) => (
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
                <Typography.Title level={2} style={{ margin: 0 }}>Categories</Typography.Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} style={{ background: '#10b981', borderColor: '#10b981' }}>Add Category</Button>
            </div>
            <div style={{ background: token.colorBgContainer, borderRadius: 12, border: `1px solid ${token.colorBorderSecondary}`, overflow: 'hidden' }}>
                 <Table className="custom-table" dataSource={categories} columns={columns} rowKey="id" pagination={false} />
            </div>

            <Modal 
                title={editingCat ? "Edit Category" : "Add Category"} 
                open={isModalVisible} 
                onOk={handleOk} 
                onCancel={() => setIsModalVisible(false)}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                    <Input placeholder="Category Name" value={name} onChange={e => setName(e.target.value)} />
                    <Input.TextArea placeholder="Description (Optional)" value={desc} onChange={e => setDesc(e.target.value)} />
                    
                    <div>
                        <div style={{marginBottom: 6, fontWeight: 500}}>Default KDS Routing</div>
                        <Select 
                            mode="multiple" 
                            style={{width: '100%'}} 
                            placeholder="Select KDS screens"
                            value={selectedKds}
                            onChange={setSelectedKds}
                        >
                            {devices.filter(d => d.type === 'KDS').map(d => (
                                <Option key={d.id} value={d.id}>{d.name}</Option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <div style={{marginBottom: 6, fontWeight: 500}}>Default Printer Routing</div>
                         <Select 
                            mode="multiple" 
                            style={{width: '100%'}} 
                            placeholder="Select Printers"
                            value={selectedPrinters}
                            onChange={setSelectedPrinters}
                        >
                            {devices.filter(d => d.type === 'Printer').map(d => (
                                <Option key={d.id} value={d.id}>{d.name}</Option>
                            ))}
                        </Select>
                    </div>

                </div>
            </Modal>
        </div>
    );
};

export default CategoryView;