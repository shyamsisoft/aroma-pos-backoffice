import React, { useEffect, useState } from 'react';
import { 
    Form, 
    Input, 
    InputNumber, 
    Select, 
    Button, 
    theme, 
    message,
    Popconfirm,
    Typography,
    Tabs,
    Table,
    Switch
} from 'antd';
import { DeleteOutlined, SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { MenuItem, ModifierGroup, Category, Variant, Device } from '../types';

interface MenuFormProps {
  initialData?: MenuItem | null;
  categories: Category[];
  modifierGroups: ModifierGroup[];
  devices: Device[];
  onSave: (values: Omit<MenuItem, 'id'>) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const MenuForm: React.FC<MenuFormProps> = ({ initialData, categories, modifierGroups, devices, onSave, onCancel, onDelete }) => {
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const [variants, setVariants] = useState<Variant[]>([]);

  // Track the active tab to help user navigate to errors
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
      setVariants(initialData.variants || []);
    } else {
      form.resetFields();
      setVariants([{ id: Date.now().toString(), name: 'Standard', price: 0 }]); // Default variant for new items
      form.setFieldsValue({ isAvailable: true, modifierGroupIds: [] });
    }
  }, [initialData, form]);

  const onFinish = (values: any) => {
    if (variants.length === 0) {
        message.error('At least one variant is required.');
        setActiveTab('2'); // Switch to variants tab
        return;
    }

    const finalData = {
        ...values,
        variants: variants
    };
    onSave(finalData);
    message.success('Item saved successfully');
  };

  // --- Variant Handlers ---
  const handleAddVariant = () => {
      const newVariant: Variant = { id: Date.now().toString(), name: 'New Variant', price: 0 };
      setVariants([...variants, newVariant]);
  };

  const handleVariantChange = (id: string, field: keyof Variant, value: any) => {
      setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleDeleteVariant = (id: string) => {
      if (variants.length <= 1) {
          message.warning('Items must have at least one variant.');
          return;
      }
      setVariants(variants.filter(v => v.id !== id));
  };

  const variantColumns = [
      {
          title: 'Variant Name (e.g., Standard, Small)',
          dataIndex: 'name',
          render: (text: string, record: Variant) => (
              <Input value={text} onChange={e => handleVariantChange(record.id, 'name', e.target.value)} />
          )
      },
      {
          title: 'Price',
          dataIndex: 'price',
          render: (val: number, record: Variant) => (
              <InputNumber 
                min={0} 
                prefix="$" 
                value={val} 
                onChange={val => handleVariantChange(record.id, 'price', val)} 
                style={{ width: '100%' }}
              />
          )
      },
      {
          title: 'Action',
          render: (_: any, record: Variant) => (
              <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteVariant(record.id)} />
          )
      }
  ];

  return (
    <div style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: token.colorBgContainer, 
        borderRadius: 12,
        border: `1px solid ${token.colorBorderSecondary}`,
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    }}>
      
      {/* Scrollable Form Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                {initialData ? 'Edit Menu Item' : 'New Menu Item'}
            </Title>
            {initialData && (
                <span style={{ background: token.colorFillTertiary, padding: '4px 12px', borderRadius: 20, fontSize: 12, color: token.colorTextSecondary }}>
                    ID: {initialData.id}
                </span>
            )}
        </div>
        
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark="optional"
        >
            <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                items={[
                {
                    key: '1',
                    label: 'Basic Info',
                    children: (
                        <div style={{ padding: '8px 0' }}>
                             <Form.Item 
                                label="Item Name" 
                                name="name" 
                                rules={[{ required: true, message: 'Please enter item name' }]}
                            >
                                <Input 
                                    placeholder="e.g. Classic Burger" 
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item 
                                label="Category" 
                                name="categoryId"
                                rules={[{ required: true, message: 'Please select a category' }]}
                            >
                                <Select placeholder="Select Category" size="large">
                                    {categories.map(cat => <Option key={cat.id} value={cat.id}>{cat.name}</Option>)}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Description" name="description">
                                <TextArea rows={4} placeholder="Appetizing description..." style={{ resize: 'none' }} />
                            </Form.Item>

                            <Form.Item name="isAvailable" valuePropName="checked" label="Available Status">
                                <Switch checkedChildren="Available" unCheckedChildren="Sold Out" />
                            </Form.Item>
                        </div>
                    )
                },
                {
                    key: '2',
                    label: 'Variants & Price',
                    children: (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <Text type="secondary">Define price points (e.g., Standard, Large). At least one is required.</Text>
                                <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddVariant}>Add Variant</Button>
                            </div>
                            <Table 
                                dataSource={variants} 
                                columns={variantColumns} 
                                rowKey="id" 
                                pagination={false} 
                                size="small"
                                locale={{ emptyText: 'No variants added. Please add at least one.' }}
                            />
                            {variants.length === 0 && <span style={{ color: 'red', fontSize: 12 }}>* At least one variant is required</span>}
                        </div>
                    )
                },
                {
                    key: '3',
                    label: 'Modifiers',
                    children: (
                        <div>
                             <Form.Item 
                                label="Select Modifier Groups" 
                                name="modifierGroupIds"
                                help="Customers will be asked to make selections from these groups"
                            >
                                <Select mode="multiple" placeholder="Select modifier groups" size="large" style={{ width: '100%' }}>
                                    {modifierGroups.map(grp => (
                                        <Option key={grp.id} value={grp.id}>{grp.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    )
                }
            ]} />
        </Form>
      </div>

      {/* Footer Actions */}
      <div style={{ 
          padding: '16px 32px', 
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          display: 'flex',
          gap: 16,
          background: token.colorBgLayout,
          alignItems: 'center',
          justifyContent: 'flex-end'
      }}>
        {initialData && onDelete && (
            <Popconfirm
                title="Delete Item"
                description="This action cannot be undone."
                onConfirm={() => onDelete(initialData.id)}
                okText="Yes, Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
            >
                <Button 
                    type="text"
                    danger 
                    icon={<DeleteOutlined />}
                    style={{ marginRight: 'auto' }}
                >
                    Delete Item
                </Button>
            </Popconfirm>
        )}

        <Button onClick={onCancel} size="large" style={{ width: 100 }}>
            Cancel
        </Button>
        <Button 
            type="primary" 
            onClick={() => form.submit()} 
            icon={<SaveOutlined />}
            size="large"
            style={{ 
                backgroundColor: '#10b981', 
                borderColor: '#10b981', 
                width: 120, 
                boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)' 
            }} 
        >
            Save
        </Button>
      </div>
    </div>
  );
};

export default MenuForm;