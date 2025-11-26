

import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, theme, message, Card } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { Employee } from '../types';
import { MOCK_EMPLOYEES } from '../constants';

const { Title, Text } = Typography;

interface LoginViewProps {
  onLogin: (user: Employee) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const user = MOCK_EMPLOYEES.find(
        (u) => u.email.toLowerCase() === values.email.toLowerCase()
      );

      if (user) {
        // In a real app, we would check the password here.
        // For this demo, we assume password is correct if user exists.
        message.success(`Welcome back, ${user.name}!`);
        onLogin(user);
      } else {
        message.error('Invalid credentials. Try john@restaurant.com');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${token.colorBgLayout} 0%, #ede9fe 100%)`, // Light purple gradient
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Background Circle */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: token.colorPrimary,
          opacity: 0.1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: '#10b981',
          opacity: 0.1,
        }}
      />

      <Card
        style={{
          width: 420,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          borderRadius: 16,
          border: `1px solid ${token.colorBorderSecondary}`,
          zIndex: 1,
        }}
        bodyStyle={{ padding: '40px 32px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: token.colorPrimary,
              borderRadius: 12,
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 800,
              color: 'white',
              boxShadow: '0 4px 12px rgba(97, 50, 192, 0.4)',
            }}
          >
            A
          </div>
          <Title level={3} style={{ marginBottom: 4, fontWeight: 700, color: token.colorPrimary }}>
            Aroma POS
          </Title>
          <Text type="secondary">Sign in to manage your restaurant</Text>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true, email: 'john@restaurant.com' }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input prefix={<UserOutlined style={{ color: token.colorTextTertiary }} />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="#" style={{ color: token.colorPrimary, fontSize: 13 }}>
                Forgot password?
              </a>
            </div>
          </Form.Item>

          <Form.Item style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              icon={<LoginOutlined />}
              style={{
                height: 48,
                fontSize: 16,
                fontWeight: 600,
                background: token.colorPrimary,
                borderColor: token.colorPrimary,
                boxShadow: '0 4px 14px 0 rgba(97, 50, 192, 0.3)',
              }}
            >
              Sign In
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
             <Text type="secondary" style={{ fontSize: 12 }}>
                Demo Accounts: <br/>
                john@restaurant.com (Admin) <br/>
                jane@restaurant.com (Manager)
             </Text>
          </div>
        </Form>
      </Card>
      
      <div style={{ position: 'absolute', bottom: 20, textAlign: 'center', width: '100%' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>© 2024 Aroma POS Systems. All rights reserved.</Text>
      </div>
    </div>
  );
};

export default LoginView;