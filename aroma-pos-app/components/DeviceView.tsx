
import React, { useState } from 'react';
import { Table, Button, Space, Input, Modal, Typography, theme, Popconfirm, message, Tag, Select, InputNumber, Form, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DesktopOutlined, WifiOutlined, DisconnectOutlined, FilterOutlined, CreditCardOutlined } from '@ant-design/icons';
import { Device, DeviceType, DeviceStatus } from '../types';

interface DeviceViewProps {
    devices: Device[];
    onSave: (device: Device) => void;
    onDelete: (id: string) => void;
}

const { Option } = Select;

const DeviceView: React.FC<DeviceViewProps> = ({ devices, onSave, onDelete }) => {
    const { token } = theme.useToken();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDevice, setEditingDevice] = useState<Device | null>(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState<DeviceType | 'All'>('All');
    const [activeTab, setActiveTab] = useState('general');

    const showModal = (device?: Device) => {
        if (device) {
            setEditingDevice(device);
            (form as any).setFieldsValue(device);
        } else {
            setEditingDevice(null);
            (form as any).resetFields();
            // Default values based on active tab
            if (activeTab === 'pax') {
                 (form as any).setFieldsValue({ 
                    status: 'Online', 
                    protocol: 'TCP/IP', 
                    type: 'PAX',
                    port: 10009 
                });
            } else {
                (form as any).setFieldsValue({ 
                    status: 'Online', 
                    protocol: 'None', 
                    type: 'Printer' 
                });
            }
        }
        setIsModalVisible(true);
    };

    const handleOk = () => {
        (form as any).validateFields().then((values: any) => {
            const newDevice: Device = {
                id: editingDevice ? editingDevice.id : Date.now().toString(),
                ...values
            };
            onSave(newDevice);
            setIsModalVisible(false);
        });
    };

    const filteredDevices = devices.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchText.toLowerCase()) || 
                              d.location.toLowerCase().includes(searchText.toLowerCase()) ||
                              d.ipAddress?.includes(searchText);
        
        let matchesType = true;
        if (activeTab === 'pax') {
            matchesType = d.type === 'PAX';
        } else {
            // General Tab: Exclude PAX, then apply filter dropdown
            matchesType = d.type !== 'PAX';
            if (filterType !== 'All') {
                matchesType = matchesType && d.type === filterType;
            }
        }
        
        return matchesSearch && matchesType;
    });

    const columns = [
        { 
            title: 'Name', 
            dataIndex: 'name', 
            key: 'name',
            render: (text: string, record: Device) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {record.type === 'PAX' ? <CreditCardOutlined style={{ color: token.colorPrimary }} /> : <DesktopOutlined style={{ color: token.colorPrimary }} />}
                    <span style={{ fontWeight: 500, color: token.colorText }}>{text}</span>
                    {record.serialNumber && <span style={{ fontSize: 11, color: token.colorTextSecondary }}>({record.serialNumber})</span>}
                </div>
            )
        },
        { 
            title: 'Type', 
            dataIndex: 'type', 
            key: 'type',
            render: (type: DeviceType) => {
                let color = 'default';
                if (type === 'KDS') color = 'blue';
                if (type === 'Printer') color = 'geekblue';
                if (type === 'POS') color = 'purple';
                if (type === 'Expeditor') color = 'cyan';
                if (type === 'PAX') color = 'gold';
                return <Tag color={color}>{type}</Tag>;
            }
        },
        { 
            title: 'Location', 
            dataIndex: 'location', 
            key: 'location' 
        },
        { 
            title: 'Network', 
            key: 'network',
            render: (_: any, record: Device) => (
                <div style={{ fontSize: 12 }}>
                    {record.ipAddress && (
                        <div>IP: <span style={{ fontFamily: 'monospace' }}>{record.ipAddress}</span></div>
                    )}
                    {record.port && (
                        <div>Port: <span style={{ fontFamily: 'monospace' }}>{record.port}</span></div>
                    )}
                    {!record.ipAddress && !record.port && <span style={{ color: '#ccc' }}>--</span>}
                </div>
            )
        },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            key: 'status',
            render: (status: DeviceStatus) => {
                const isOnline = status === 'Online';
                return (
                    <Tag icon={isOnline ? <WifiOutlined /> : <DisconnectOutlined />} color={isOnline ? 'success' : 'error'}>
                        {status}
                    </Tag>
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '120px',
            render: (_: any, record: Device) => (
                <Space>
                    <Button type="text" icon={<EditOutlined style={{ color: token.colorPrimary }} />} onClick={() => showModal(record)} />
                    <Popconfirm title="Delete device?" onConfirm={() => onDelete(record.id)} okButtonProps={{ danger: true }}>
                        <Button type="text" icon={<DeleteOutlined style={{ color: 'red' }} />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const renderToolbar = () => (
        <div style={{ padding: 16, borderBottom: `1px solid ${token.colorBorderSecondary}`, display: 'flex', gap: 16 }}>
            <Input 
            placeholder="Search devices..." 
            onChange={e => setSearchText(e.target.value)} 
            style={{ maxWidth: 300 }}
            />
            {activeTab === 'general' && (
                <Select 
                    value={filterType} 
                    onChange={setFilterType} 
                    style={{ width: 180 }}
                    suffixIcon={<FilterOutlined />}
                >
                    <Option value="All">All Types</Option>
                    <Option value="POS">POS Terminal</Option>
                    <Option value="KDS">KDS</Option>
                    <Option value="Printer">Printer</Option>
                    <Option value="Expeditor">Expeditor</Option>
                </Select>
            )}
        </div>
    );

    return (
        <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <Typography.Title level={2} style={{ margin: 0 }}>Device Management</Typography.Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    {activeTab === 'pax' ? 'Add Terminal' : 'Add Device'}
                </Button>
            </div>
            
            <div style={{ background: token.colorBgContainer, borderRadius: 12, border: `1px solid ${token.colorBorderSecondary}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                 <Tabs 
                    activeKey={activeTab} 
                    onChange={setActiveTab}
                    type="card"
                    tabBarStyle={{ margin: 0, padding: '12px 16px 0', background: token.colorBgLayout }}
                    items={[
                        {
                            key: 'general',
                            label: 'General Devices',
                            children: (
                                <>
                                    {renderToolbar()}
                                    <Table className="custom-table" dataSource={filteredDevices} columns={columns} rowKey="id" pagination={{ pageSize: 8 }} />
                                </>
                            )
                        },
                        {
                            key: 'pax',
                            label: 'Payment Terminals (PAX)',
                            children: (
                                <>
                                    {renderToolbar()}
                                    <Table className="custom-table" dataSource={filteredDevices} columns={columns} rowKey="id" pagination={{ pageSize: 8 }} />
                                </>
                            )
                        }
                    ]}
                 />
            </div>

            <Modal 
                title={editingDevice ? "Edit Device" : (activeTab === 'pax' ? "Add PAX Terminal" : "Add Device")} 
                open={isModalVisible} 
                onOk={handleOk} 
                onCancel={() => setIsModalVisible(false)}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item name="name" label="Device Name" rules={[{ required: true }]}>
                            <Input placeholder="e.g. Bar Terminal" />
                        </Form.Item>
                        <Form.Item name="type" label="Device Type" rules={[{ required: true }]}>
                            {activeTab === 'pax' && !editingDevice ? (
                                <Select disabled>
                                    <Option value="PAX">PAX Payment Terminal</Option>
                                </Select>
                            ) : (
                                <Select disabled={activeTab === 'pax'}>
                                    <Option value="POS">POS Terminal</Option>
                                    <Option value="KDS">KDS (Kitchen Display)</Option>
                                    <Option value="Expeditor">Expeditor Screen</Option>
                                    <Option value="Printer">Printer</Option>
                                    {activeTab === 'pax' && <Option value="PAX">PAX Payment Terminal</Option>}
                                </Select>
                            )}
                        </Form.Item>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                         <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                            <Input placeholder="e.g. Bar, Kitchen" />
                        </Form.Item>
                        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                            <Select>
                                <Option value="Online">Online</Option>
                                <Option value="Offline">Offline</Option>
                                <Option value="Maintenance">Maintenance</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    
                    <Form.Item name="protocol" label="Protocol">
                        <Select>
                            <Option value="None">None</Option>
                            <Option value="TCP/IP">TCP/IP</Option>
                            <Option value="ESC/POS">ESC/POS (Printer)</Option>
                            <Option value="Serial">Serial</Option>
                        </Select>
                    </Form.Item>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item name="ipAddress" label="IP Address">
                            <Input placeholder="192.168.1.xxx" />
                        </Form.Item>
                        <Form.Item name="port" label="Port">
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <Form.Item name="serialNumber" label="Serial Number (Optional)">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DeviceView;
