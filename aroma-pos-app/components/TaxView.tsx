
import React, { useState } from 'react';
import { Table, Button, Space, Input, Modal, Typography, theme, Popconfirm, message, Select, InputNumber, Form, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PercentageOutlined, DollarOutlined } from '@ant-design/icons';
import { Tax } from '../types';

interface TaxViewProps {
    taxes: Tax[];
    onSave: (tax: Tax) => void;
    onDelete: (id: string) => void;
}

const { Option } = Select;
const { Title } = Typography;

const TaxView: React.FC<TaxViewProps> = ({ taxes, onSave, onDelete }) => {
    const { token } = theme.useToken();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTax, setEditingTax] = useState<Tax | null>(null);
    const [form] = Form.useForm();

    const showModal = (tax?: Tax) => {
        if (tax) {
            setEditingTax(tax);
            // Convert rate for display if it's percentage (0.08 -> 8)
            const displayRate = tax.type === 'Percentage' ? tax.rate * 100 : tax.rate;
            form.setFieldsValue({
                ...tax,
                rate: displayRate
            });
        } else {
            setEditingTax(null);
            form.resetFields();
            form.setFieldsValue({ type: 'Percentage', rate: 0 });
        }
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then((values: any) => {
            // Convert rate back if it's percentage (8 -> 0.08)
            const finalRate = values.type === 'Percentage' ? values.rate / 100 : values.rate;
            
            const newTax: Tax = {
                id: editingTax ? editingTax.id : Date.now().toString(),
                name: values.name,
                type: values.type,
                rate: finalRate
            };
            onSave(newTax);
            setIsModalVisible(false);
        });
    };

    const columns = [
        { 
            title: 'Tax Name', 
            dataIndex: 'name', 
            key: 'name',
            render: (text: string) => <strong style={{ color: token.colorText }}>{text}</strong> 
        },
        { 
            title: 'Type', 
            dataIndex: 'type', 
            key: 'type',
            render: (type: string) => (
                <Tag color={type === 'Percentage' ? 'blue' : 'green'}>
                    {type === 'Percentage' ? <PercentageOutlined /> : <DollarOutlined />} {type}
                </Tag>
            )
        },
        { 
            title: 'Rate / Amount', 
            key: 'rate',
            render: (_: any, record: Tax) => (
                <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                    {record.type === 'Percentage' 
                        ? `${(record.rate * 100).toFixed(3)}%` 
                        : `$${record.rate.toFixed(2)}`}
                </span>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '120px',
            render: (_: any, record: Tax) => (
                <Space>
                    <Button type="text" icon={<EditOutlined style={{ color: token.colorPrimary }} />} onClick={() => showModal(record)} />
                    <Popconfirm title="Delete Tax?" description="This will remove it from all assigned categories." onConfirm={() => onDelete(record.id)} okButtonProps={{ danger: true }}>
                        <Button type="text" icon={<DeleteOutlined style={{ color: 'red' }} />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Tax Management</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Add Tax
                </Button>
            </div>

            <div style={{ background: token.colorBgContainer, borderRadius: 12, border: `1px solid ${token.colorBorderSecondary}`, overflow: 'hidden' }}>
                 <Table 
                    className="custom-table" 
                    dataSource={taxes} 
                    columns={columns} 
                    rowKey="id" 
                    pagination={false} 
                 />
            </div>

            <Modal 
                title={editingTax ? "Edit Tax" : "Add Tax"} 
                open={isModalVisible} 
                onOk={handleOk} 
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical" initialValues={{ type: 'Percentage' }}>
                    <Form.Item name="name" label="Tax Name" rules={[{ required: true, message: 'Tax name is required' }]}>
                        <Input placeholder="e.g. Sales Tax" />
                    </Form.Item>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item name="type" label="Type">
                            <Select>
                                <Option value="Percentage">Percentage (%)</Option>
                                <Option value="Fixed">Fixed Amount ($)</Option>
                            </Select>
                        </Form.Item>
                        
                        <Form.Item 
                            noStyle
                            shouldUpdate={(prev, curr) => prev.type !== curr.type}
                        >
                            {({ getFieldValue }) => {
                                const type = getFieldValue('type');
                                return (
                                    <Form.Item 
                                        name="rate" 
                                        label={type === 'Percentage' ? "Rate (%)" : "Amount ($)"}
                                        rules={[{ required: true }]}
                                    >
                                        <InputNumber 
                                            style={{ width: '100%' }} 
                                            min={0} 
                                            precision={type === 'Percentage' ? 3 : 2}
                                            step={type === 'Percentage' ? 0.1 : 0.01}
                                        />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default TaxView;
