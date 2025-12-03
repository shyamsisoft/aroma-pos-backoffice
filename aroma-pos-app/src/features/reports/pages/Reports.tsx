import React from 'react';
import { Typography, theme } from 'antd';

const { Text } = Typography;

const Reports: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const { token } = theme.useToken();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ 
                width: 200, 
                height: 200, 
                background: isDarkMode ? '#1c1c1c' : '#e2e8f0', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: 24
            }}>
            <span style={{ fontSize: 64 }}>📊</span>
            </div>
            <div style={{fontSize: 24, fontWeight: 600, color: token.colorText }}>Sales Reports</div>
            <Text type="secondary">Analytics features are currently under development.</Text>
        </div>
    );
};

export default Reports;