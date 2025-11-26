import React, { useState } from 'react';
import { Layout, Drawer, List, Avatar, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Employee } from '../types';

const { Content } = Layout;
const { Text } = Typography;

interface MasterLayoutProps {
  currentUser: Employee | null;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  onLogout: () => void;
}

const MasterLayout: React.FC<MasterLayoutProps> = ({ currentUser, isDarkMode, setIsDarkMode, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Mock Notifications
  const notifications = [
    { title: 'Low Stock Alert', desc: 'Burger Buns are running low (5 packs left).', time: '10 min ago' },
    { title: 'New Order', desc: 'Order #1024 received from Table 5.', time: '1 hr ago' },
    { title: 'Shift Report', desc: 'Daily sales report is ready for review.', time: '3 hrs ago' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar 
        collapsed={collapsed}
        onCollapse={setCollapsed}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onLogout={onLogout}
        currentUser={currentUser}
        onOpenNotifications={() => setIsNotifOpen(true)}
        notificationCount={notifications.length}
      />

      <Layout style={{ position: 'relative' }}>
        
        {/* Notification Drawer */}
        <Drawer title="Notifications" placement="right" onClose={() => setIsNotifOpen(false)} open={isNotifOpen}>
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#6132C0' }} icon={<BellOutlined />} />}
                    title={item.title}
                    description={
                      <div>
                          <div>{item.desc}</div>
                          <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
        </Drawer>

        {/* Main Content Area */}
        <Content style={{ margin: '24px 32px 24px 24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 48px)' }}>
            <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MasterLayout;