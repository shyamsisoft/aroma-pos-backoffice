
import React, { useEffect, useState } from 'react';
import { 
    Form, 
    Input, 
    InputNumber, 
    Select, 
    Button, 
    Collapse, 
    theme, 
    message,
    Popconfirm,
    Typography,
    CollapseProps
} from 'antd';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';

// Defining types locally to resolve missing exports
interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  description?: string;
  price: number;
  stock?: number;
  supplier?: string;
  weight?: string;
  dimensions?: string;
}

const CATEGORIES = ['Burgers', 'Pizza', 'Drinks', 'Appetizers'];

interface ProductFormProps {
  initialData?: Product | null;
  onSave: (values: Omit<Product, 'id'>) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSave, onCancel, onDelete }) => {
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const [activeKey, setActiveKey] = useState<string | string[]>(['1', '2', '3', '4']); 

  useEffect(() => {
    if (initialData) {
      (form as any).setFieldsValue(initialData);
    } else {
      (form as any).resetFields();
    }
  }, [initialData, form]);

  const onFinish = (values: any) => {
    onSave(values);
    message.success('Product saved successfully');
  };

  const panelStyle = {
    background: token.colorPrimary, // Uses the #6132C0
    borderRadius: 8,
    border: 'none',
    overflow: 'hidden'
  };

  const renderHeader = (title: string) => (
    <div style={{ color: 'white', fontWeight: 600, fontSize: 15, letterSpacing: '0.3px', padding: '4px 0' }}>
        {title}
    </div>
  );
  
  // Dynamic background for form content areas
  const contentStyle = { 
    background: token.colorBgContainer, 
    padding: 24 
  };

  const collapseItems: CollapseProps['items'] = [
      {
          key: '1',
          label: renderHeader("Basic Information"),
          style: panelStyle,
          children: (
              <div style={contentStyle}>
                  <Form.Item 
                      label="Product Name" 
                      name="name" 
                      rules={[{ required: true, message: 'Please enter product name' }]}
                  >
                      <Input 
                          placeholder="Enter product name" 
                          size="large"
                      />
                  </Form.Item>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Form.Item 
                          label="Category" 
                          name="category"
                          rules={[{ required: true, message: 'Please select a category' }]}
                      >
                          <Select placeholder="Select Category" size="large">
                              {CATEGORIES.map(cat => <Option key={cat} value={cat}>{cat}</Option>)}
                          </Select>
                      </Form.Item>

                      <Form.Item 
                          label="SKU" 
                          name="sku"
                          rules={[{ required: true, message: 'Please enter SKU' }]}
                      >
                          <Input placeholder="Enter SKU" size="large" />
                      </Form.Item>
                  </div>

                  <Form.Item label="Description" name="description">
                      <TextArea rows={4} placeholder="Product description..." style={{ resize: 'none' }} />
                  </Form.Item>
              </div>
          )
      },
      {
          key: '2',
          label: renderHeader("Pricing & Stock"),
          style: panelStyle,
          children: (
              <div style={{ ...contentStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <Form.Item label="Price" name="price">
                      <InputNumber 
                          style={{ width: '100%' }} 
                          min={0} 
                          precision={2} 
                          prefix="$" 
                          size="large"
                      />
                  </Form.Item>
                  <Form.Item label="Stock Quantity" name="stock">
                      <InputNumber style={{ width: '100%' }} min={0} size="large" />
                  </Form.Item>
              </div>
          )
      },
      {
          key: '3',
          label: renderHeader("Supplier Details"),
          style: panelStyle,
          children: (
               <div style={contentStyle}>
                  <Form.Item label="Supplier Name" name="supplier" style={{ margin: 0 }}>
                      <Input placeholder="Enter supplier name" size="large" />
                  </Form.Item>
              </div>
          )
      },
      {
          key: '4',
          label: renderHeader("Additional Information"),
          style: panelStyle,
          children: (
               <div style={{ ...contentStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <Form.Item label="Weight" name="weight" style={{ margin: 0 }}>
                      <Input placeholder="e.g. 1.5kg" size="large" />
                  </Form.Item>
                  <Form.Item label="Dimensions" name="dimensions" style={{ margin: 0 }}>
                      <Input placeholder="e.g. 10x10x20 cm" size="large" />
                  </Form.Item>
              </div>
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
                Product Master
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
            initialValues={{ price: 0, stock: 0 }}
            requiredMark="optional"
        >
            <Collapse 
                activeKey={activeKey} 
                onChange={setActiveKey}
                expandIconPosition="end"
                bordered={false}
                style={{ background: 'transparent', display: 'flex', flexDirection: 'column', gap: 16 }}
                expandIcon={({ isActive }) => <div style={{ color: 'white', transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</div>}
                items={collapseItems}
            />
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
                title="Delete Product"
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
                    Delete Product
                </Button>
            </Popconfirm>
        )}

        <Button onClick={onCancel} size="large" style={{ width: 100 }}>
            Cancel
        </Button>
        <Button 
            type="primary" 
            onClick={() => (form as any).submit()} 
            icon={<SaveOutlined />}
            size="large"
            style={{ 
                width: 120, 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }} 
        >
            Save
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
