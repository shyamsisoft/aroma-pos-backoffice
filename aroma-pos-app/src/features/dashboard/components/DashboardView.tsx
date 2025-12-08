import React from 'react';
import { Row, Col, List, Avatar, Typography, theme } from 'antd';
import { 
    DollarOutlined, 
    ShoppingOutlined, 
    CodeSandboxOutlined, 
    RiseOutlined,
} from '@ant-design/icons';
import { Activity } from '../../../shared/types';
import Card from 'antd/es/card/Card';

const { Title, Text } = Typography;

const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    color: string;
    bg: string;
    trend?: string;
    isDarkMode?: boolean;
}> = ({ title, value, icon, color, bg, trend, isDarkMode }) => {
    
    const { token } = theme.useToken();

    return (
        <Card 
            bordered={true} 
            style={{ 
                height: '100%', 
                borderRadius: 6,
                background: token.colorBgContainer,
                borderColor: token.colorBorder,
                boxShadow: isDarkMode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
            }}
            bodyStyle={{ padding: 20 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <Text type="secondary" style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</Text>
                    <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4, color: token.colorText, letterSpacing: '-0.5px' }}>
                        {value}
                    </div>
                    {trend && (
                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ 
                                background: isDarkMode ? 'rgba(74, 222, 128, 0.1)' : '#dcfce7', 
                                color: isDarkMode ? '#4ade80' : '#15803d',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: 2
                            }}>
                                <RiseOutlined style={{ fontSize: 10 }} /> {trend}
                            </span>
                            <Text type="secondary" style={{ fontSize: 12 }}>vs last month</Text>
                        </div>
                    )}
                </div>
                <div style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 8, 
                    background: isDarkMode ? '#2e2e2e' : '#f3f4f6', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: color,
                    fontSize: 18,
                    border: `1px solid ${token.colorBorder}`
                }}>
                    {icon}
                </div>
            </div>
        </Card>
    );
};

interface DashboardViewProps {
    isDarkMode: boolean;
    activities: Activity[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ isDarkMode, activities }) => {
  const { token } = theme.useToken();
  
  const getRelativeTime = (date: Date) => {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div style={{ padding: '0 8px', overflowY: 'auto', height: '100%' }}>
        
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
                <StatCard 
                    title="Total Revenue" 
                    value="$45,231" 
                    icon={<DollarOutlined />} 
                    color="#10b981" 
                    bg="#dcfce7"
                    trend="+12.5%"
                    isDarkMode={isDarkMode}
                />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                 <StatCard 
                    title="Total Orders" 
                    value="1,203" 
                    icon={<ShoppingOutlined />} 
                    color="#6132C0"
                    bg="#f3e8ff"
                    trend="+5.2%"
                    isDarkMode={isDarkMode}
                />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                 <StatCard 
                    title="Products" 
                    value="84" 
                    icon={<CodeSandboxOutlined />} 
                    color="#f59e0b" 
                    bg="#ffedd5"
                    trend="+2 new"
                    isDarkMode={isDarkMode}
                />
            </Col>
            <Col xs={24} sm={12} lg={6}>
                 <StatCard 
                    title="Growth" 
                    value="18.2%" 
                    icon={<RiseOutlined />} 
                    color="#8b5cf6" 
                    bg="#f3e8ff"
                    trend="+1.4%"
                    isDarkMode={isDarkMode}
                />
            </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={16}>
                <Card 
                    title={<span style={{ fontWeight: 600, fontSize: 16 }}>Revenue Analytics</span>} 
                    bordered={true}
                    style={{ 
                        height: 400, 
                        borderRadius: 6,
                        borderColor: token.colorBorder,
                        background: token.colorBgContainer
                    }}
                >
                    <div style={{ 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        background: token.colorBgLayout, 
                        borderRadius: 6, 
                        border: `1px dashed ${token.colorBorder}` 
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <RiseOutlined style={{ fontSize: 32, color: token.colorTextQuaternary }} />
                            <p style={{ color: token.colorTextQuaternary, marginTop: 12, fontSize: 13 }}>Chart Visualization Placeholder</p>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col xs={24} lg={8}>
                <Card 
                    title={<span style={{ fontWeight: 600, fontSize: 16 }}>Recent Activity</span>} 
                    bordered={true}
                    style={{ 
                        height: 400, 
                        borderRadius: 6,
                        borderColor: token.colorBorder,
                        background: token.colorBgContainer
                    }}
                    bodyStyle={{ padding: 0, overflowY: 'auto', height: 340 }}
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={activities}
                        locale={{ emptyText: 'No recent activities' }}
                        renderItem={item => (
                            <List.Item style={{ padding: '12px 16px', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                                <List.Item.Meta
                                    avatar={
                                        <Avatar 
                                            style={{ 
                                                backgroundColor: isDarkMode ? '#2e2e2e' : '#f3f4f6', 
                                                color: '#6132C0',
                                                border: `1px solid ${token.colorBorder}`,
                                                verticalAlign: 'middle',
                                                fontSize: 12
                                            }}
                                        >
                                            {item.user[0]}
                                        </Avatar>
                                    }
                                    title={
                                        <Text style={{ fontSize: 13 }}>
                                            <Text strong>{item.user}</Text> {item.action} <Text strong>{item.target}</Text>
                                        </Text>
                                    }
                                    description={<Text type="secondary" style={{ fontSize: 11 }}>{getRelativeTime(item.time)}</Text>}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>
        </Row>
    </div>
  );
};

export default DashboardView;