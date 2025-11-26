import React, { useState } from 'react';
import { Table, Button, Tag, Space, Typography, theme, Modal, Form, Input, Select, message, Popconfirm, Timeline, Card, Empty } from 'antd';
import { UserAddOutlined, EditOutlined, DeleteOutlined, LockOutlined, NumberOutlined, HistoryOutlined } from '@ant-design/icons';
import { Employee, Activity } from '../types';
import { MOCK_EMPLOYEES } from '../constants';

const { Title, Text } = Typography;
const { Option } = Select;

interface EmployeesViewProps {
    onLogActivity: (action: string, target: string) => void;
    activities: Activity[];
}

const EmployeesView: React.FC<EmployeesViewProps> = ({ onLogActivity, activities }) => {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const { token } = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  // Activity Modal State
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedUserForActivity, setSelectedUserForActivity] = useState<Employee | null>(null);

  const [form] = Form.useForm();

  const showModal = (employee?: Employee) => {
    if (employee) {
        setEditingEmployee(employee);
        form.setFieldsValue(employee);
    } else {
        setEditingEmployee(null);
        form.resetFields();
        form.setFieldsValue({ status: 'Active', role: 'Server' });
    }
    setIsModalOpen(true);
  };

  const showActivityModal = (employee: Employee) => {
      setSelectedUserForActivity(employee);
      setIsActivityModalOpen(true);
  };

  const handleDelete = (id: string) => {
      const emp = employees.find(e => e.id === id);
      setEmployees(employees.filter(u => u.id !== id));
      message.success('Employee deleted');
      if (emp) onLogActivity('deleted employee', emp.name);
  };

  const handleOk = () => {
      form.validateFields().then(values => {
          if (editingEmployee) {
              setEmployees(employees.map(u => u.id === editingEmployee.id ? { ...u, ...values } : u));
              message.success('Employee updated');
              onLogActivity('updated employee details for', values.name);
          } else {
              const newEmployee: Employee = {
                  id: Date.now().toString(),
                  ...values,
              };
              setEmployees([...employees, newEmployee]);
              message.success('Employee added');
              onLogActivity('added new employee', values.name);
          }
          setIsModalOpen(false);
      });
  };

  // Filter activities for the selected user
  const userActivities = activities.filter(a => a.user === selectedUserForActivity?.name);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 500, color: token.colorText }}>{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'POS Login',
      dataIndex: 'loginNumber',
      key: 'loginNumber',
      render: (num: string) => <Tag icon={<NumberOutlined />} bordered={false}>{num}</Tag>
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = role === 'Admin' ? 'purple' : role === 'Manager' ? 'blue' : 'default';
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        return (
            <Space>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: status === 'Active' ? '#52c41a' : '#d9d9d9' }} />
                <span>{status}</span>
            </Space>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Employee) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<HistoryOutlined style={{ color: token.colorInfo }} />} 
            onClick={() => showActivityModal(record)} 
            title="View History"
          />
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: token.colorPrimary }} />} 
            onClick={() => showModal(record)} 
            title="Edit"
          />
          <Popconfirm title="Delete employee?" onConfirm={() => handleDelete(record.id)} okButtonProps={{ danger: true }}>
            <Button type="text" icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} title="Delete" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ height: '100%', padding: 24, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
         <Title level={2} style={{ margin: 0 }}>Staff Management</Title>
         <Button type="primary" icon={<UserAddOutlined />} onClick={() => showModal()} style={{ background: '#22c55e', borderColor: '#22c55e' }}>Add Employee</Button>
      </div>
      
      <div style={{ background: token.colorBgContainer, borderRadius: 8, overflow: 'hidden', border: `1px solid ${token.colorBorder}` }}>
        <Table 
            className="custom-table"
            dataSource={employees} 
            columns={columns} 
            rowKey="id" 
            pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Edit/Add Modal */}
      <Modal 
        title={editingEmployee ? "Edit Employee" : "Add New Employee"} 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={() => setIsModalOpen(false)}
      >
          <Form form={form} layout="vertical">
              <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                  <Input placeholder="e.g. John Doe" />
              </Form.Item>
              <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                  <Input placeholder="john@restaurant.com" />
              </Form.Item>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password is required' }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="******" />
                </Form.Item>
                <Form.Item name="loginNumber" label="POS Login PIN" rules={[{ required: true, message: 'Login PIN is required' }]}>
                    <Input prefix={<NumberOutlined />} placeholder="e.g. 1001" maxLength={6} />
                </Form.Item>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                    <Select>
                        <Option value="Admin">Admin</Option>
                        <Option value="Manager">Manager</Option>
                        <Option value="Server">Server</Option>
                        <Option value="Kitchen">Kitchen</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                    <Select>
                        <Option value="Active">Active</Option>
                        <Option value="Inactive">Inactive</Option>
                    </Select>
                </Form.Item>
              </div>
          </Form>
      </Modal>

      {/* Activity History Modal */}
      <Modal
        title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <HistoryOutlined />
                <span>Activity History: {selectedUserForActivity?.name}</span>
            </div>
        }
        open={isActivityModalOpen}
        footer={null}
        onCancel={() => setIsActivityModalOpen(false)}
        width={600}
        bodyStyle={{ maxHeight: '60vh', overflowY: 'auto', padding: '24px' }}
      >
        {userActivities.length > 0 ? (
            <Timeline
                items={userActivities.map(act => ({
                    children: (
                        <div>
                            <Text strong>{act.action}</Text> <Text>{act.target}</Text>
                            <div style={{ fontSize: 12, color: token.colorTextSecondary }}>
                                {new Date(act.time).toLocaleString()}
                            </div>
                        </div>
                    ),
                    color: 'purple'
                }))}
            />
        ) : (
            <Empty description="No recent activity found for this user." />
        )}
      </Modal>
    </div>
  );
};

export default EmployeesView;