import React, { useState } from 'react';
import { 
    Layout, 
    Menu, 
    Typography, 
    Table, 
    DatePicker, 
    Button, 
    Space, 
    theme, 
    Tabs, 
    Card, 
    Tag, 
    Statistic, 
    Row, 
    Col,
    message,
    Empty
} from 'antd';
import { 
    BarChartOutlined, 
    UserOutlined, 
    CreditCardOutlined, 
    AuditOutlined, 
    DownloadOutlined, 
    PrinterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// --- Mock Data Generators ---

const generateSalesSummary = () => {
    return Array.from({ length: 10 }).map((_, i) => ({
        key: i,
        date: dayjs().subtract(i, 'day').format('YYYY-MM-DD'),
        orders: Math.floor(Math.random() * 100) + 50,
        grossSales: (Math.random() * 2000 + 1000).toFixed(2),
        discounts: (Math.random() * 100).toFixed(2),
        netSales: (Math.random() * 1800 + 900).toFixed(2),
        tax: (Math.random() * 200).toFixed(2),
        total: (Math.random() * 2200 + 1100).toFixed(2),
    }));
};

const generateHourlySales = () => {
    return Array.from({ length: 12 }).map((_, i) => ({
        key: i,
        hour: `${i + 10}:00 - ${i + 11}:00`,
        orders: Math.floor(Math.random() * 20) + 5,
        sales: (Math.random() * 500 + 100).toFixed(2),
        labor: (Math.random() * 15 + 10).toFixed(2) + '%',
    }));
};

const generateItemSales = () => {
    const items = ['Classic Burger', 'Cheese Pizza', 'Coke', 'Fries', 'Steak', 'Salad'];
    return items.map((item, i) => ({
        key: i,
        item: item,
        category: i % 2 === 0 ? 'Food' : 'Drinks',
        qty: Math.floor(Math.random() * 50) + 10,
        amount: (Math.random() * 500 + 50).toFixed(2),
    }));
};

const generateCategorySales = () => {
    return [
        { key: 1, category: 'Food', qty: 145, amount: 2350.50 },
        { key: 2, category: 'Beverage', qty: 89, amount: 450.25 },
        { key: 3, category: 'Alcohol', qty: 45, amount: 890.00 },
        { key: 4, category: 'Merchandise', qty: 12, amount: 240.00 },
    ];
};

const generateTipReport = () => {
    return [
        { key: 1, employee: 'John Doe', cashTips: 45.00, creditTips: 120.00, total: 165.00 },
        { key: 2, employee: 'Jane Smith', cashTips: 20.00, creditTips: 80.00, total: 100.00 },
        { key: 3, employee: 'Mike Cook', cashTips: 10.00, creditTips: 0.00, total: 10.00 },
    ];
};

const generateShiftSalesReport = () => {
    return [
        { key: 1, shift: 'Morning (8am-4pm)', orders: 45, sales: 1250.00 },
        { key: 2, shift: 'Dinner (4pm-11pm)', orders: 89, sales: 3450.50 },
        { key: 3, shift: 'Late Night (11pm-2am)', orders: 22, sales: 650.00 },
    ];
};

const generateOrderSummary = () => {
    return Array.from({ length: 15 }).map((_, i) => ({
        key: i,
        orderId: `#100${i}`,
        time: dayjs().subtract(i * 20, 'minute').format('HH:mm'),
        type: i % 3 === 0 ? 'Dine In' : 'Takeout',
        items: Math.floor(Math.random() * 5) + 1,
        total: (Math.random() * 50 + 10).toFixed(2),
        status: 'Completed'
    }));
};

const generateEmployeeShiftReport = () => {
    return [
        { key: 1, name: 'John Doe', role: 'Server', clockIn: '10:00 AM', clockOut: '4:00 PM', hours: 6.0, sales: 850.50, tips: 120.00 },
        { key: 2, name: 'Jane Smith', role: 'Manager', clockIn: '09:00 AM', clockOut: '5:00 PM', hours: 8.0, sales: 0.00, tips: 0.00 },
        { key: 3, name: 'Mike Cook', role: 'Kitchen', clockIn: '11:00 AM', clockOut: '8:00 PM', hours: 9.0, sales: 0.00, tips: 0.00 },
    ];
};

const generatePaymentReport = () => {
    return [
        { key: 1, method: 'Cash', count: 45, amount: 1250.00 },
        { key: 2, method: 'Visa', count: 89, amount: 3450.50 },
        { key: 3, method: 'MasterCard', count: 56, amount: 2100.25 },
        { key: 4, method: 'Amex', count: 12, amount: 890.00 },
        { key: 5, method: 'Gift Card', count: 5, amount: 125.00 },
    ];
};

const generateDrawerReport = () => {
    return [
        { key: 1, drawerId: 'DRW-01', user: 'John Doe', openTime: '10:00 AM', startAmount: 200.00, cashSales: 450.00, drops: 300.00, expected: 350.00, actual: 350.00, variance: 0.00 },
        { key: 2, drawerId: 'DRW-02', user: 'Jane Smith', openTime: '04:00 PM', startAmount: 200.00, cashSales: 890.00, drops: 800.00, expected: 290.00, actual: 285.00, variance: -5.00 },
    ];
};

const generateAuditLog = () => {
    return Array.from({ length: 8 }).map((_, i) => ({
        key: i,
        time: dayjs().subtract(i * 45, 'minute').format('HH:mm'),
        user: i % 2 === 0 ? 'Manager' : 'Admin',
        action: i % 3 === 0 ? 'Void Order' : i % 3 === 1 ? 'Comp Item' : 'Open Drawer',
        details: 'Auth Override',
        amount: (Math.random() * 50).toFixed(2),
    }));
};

const generateShiftAuditReport = () => {
    return [
        { key: 1, shift: 'Morning', manager: 'Jane Smith', startCash: 1200, endCash: 1500, overShort: 0 },
        { key: 2, shift: 'Evening', manager: 'John Doe', startCash: 1500, endCash: 3200, overShort: -5.50 },
    ];
};

interface ReportsViewProps {
    isDarkMode: boolean;
    permissions: string[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ isDarkMode, permissions }) => {
    const { token } = theme.useToken();
    const [mainCategory, setMainCategory] = useState('sales');
    const [subReport, setSubReport] = useState('summary');

    let reportConfig = { data: [] as any[], columns: [] as any[], title: '' };

    const menuItems = [
        { key: 'sales', icon: <BarChartOutlined />, label: 'Sales Reports' },
        { key: 'employee', icon: <UserOutlined />, label: 'Employee Reports' },
        { key: 'payment', icon: <CreditCardOutlined />, label: 'Payment Reports' },
        { key: 'audit', icon: <AuditOutlined />, label: 'Audit Reports' },
    ];

    const handleMenuClick = (e: { key: string }) => {
        setMainCategory(e.key);
        if (e.key === 'sales') setSubReport('summary');
        if (e.key === 'employee') setSubReport('attendance');
        if (e.key === 'payment') setSubReport('payment_methods');
        if (e.key === 'audit') setSubReport('shift_summary');
    };

    const renderSalesReports = () => {
        const availableTabs = [
            { key: 'summary', label: 'Sales Summary', perm: 'rpt_sales_summary' },
            { key: 'hourly', label: 'Hourly Sales', perm: 'rpt_sales_hourly' },
            { key: 'tips', label: 'Tip Report', perm: 'rpt_sales_tips' },
            { key: 'item', label: 'Sales by Item', perm: 'rpt_sales_item' },
            { key: 'category', label: 'Sales by Category', perm: 'rpt_sales_category' },
            { key: 'shift', label: 'Sales by Shift', perm: 'rpt_sales_shift' },
            { key: 'orders', label: 'Order Summary', perm: 'rpt_sales_orders' },
        ].filter(t => permissions.includes(t.perm));

        let content;
        let data: any[] = [];
        let columns: any[] = [];
        let title = '';

        switch (subReport) {
            case 'summary':
                title = 'Sales Summary';
                data = generateSalesSummary();
                columns = [
                    { title: 'Date', dataIndex: 'date', key: 'date' },
                    { title: 'Orders', dataIndex: 'orders', key: 'orders' },
                    { title: 'Gross Sales', dataIndex: 'grossSales', key: 'grossSales', render: (val: string) => `$${val}` },
                    { title: 'Discounts', dataIndex: 'discounts', key: 'discounts', render: (val: string) => `-${val}` },
                    { title: 'Net Sales', dataIndex: 'netSales', key: 'netSales', render: (val: string) => `$${val}` },
                    { title: 'Tax', dataIndex: 'tax', key: 'tax', render: (val: string) => `$${val}` },
                    { title: 'Total', dataIndex: 'total', key: 'total', render: (val: string) => `$${val}` },
                ];
                break;
            case 'hourly':
                title = 'Hourly Sales';
                data = generateHourlySales();
                columns = [
                    { title: 'Hour', dataIndex: 'hour', key: 'hour' },
                    { title: 'Orders', dataIndex: 'orders', key: 'orders' },
                    { title: 'Total Sales', dataIndex: 'sales', key: 'sales', render: (val: string) => `$${val}` },
                    { title: 'Labor %', dataIndex: 'labor', key: 'labor' },
                ];
                break;
            case 'item':
                title = 'Sales by Item';
                data = generateItemSales();
                columns = [
                    { title: 'Item Name', dataIndex: 'item', key: 'item' },
                    { title: 'Category', dataIndex: 'category', key: 'category' },
                    { title: 'Qty Sold', dataIndex: 'qty', key: 'qty' },
                    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (val: string) => `$${val}` },
                ];
                break;
            case 'category':
                title = 'Sales by Category';
                data = generateCategorySales();
                columns = [
                    { title: 'Category', dataIndex: 'category', key: 'category' },
                    { title: 'Qty Sold', dataIndex: 'qty', key: 'qty' },
                    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (val: string) => `$${val}` },
                ];
                break;
            case 'tips':
                title = 'Tip Report';
                data = generateTipReport();
                columns = [
                    { title: 'Employee', dataIndex: 'employee', key: 'employee' },
                    { title: 'Cash Tips', dataIndex: 'cashTips', key: 'cashTips', render: (v: number) => `$${v.toFixed(2)}` },
                    { title: 'Credit Tips', dataIndex: 'creditTips', key: 'creditTips', render: (v: number) => `$${v.toFixed(2)}` },
                    { title: 'Total', dataIndex: 'total', key: 'total', render: (v: number) => `$${v.toFixed(2)}` },
                ];
                break;
            case 'shift':
                title = 'Sales by Shift';
                data = generateShiftSalesReport();
                columns = [
                    { title: 'Shift', dataIndex: 'shift', key: 'shift' },
                    { title: 'Orders', dataIndex: 'orders', key: 'orders' },
                    { title: 'Total Sales', dataIndex: 'sales', key: 'sales', render: (v: number) => `$${v.toFixed(2)}` },
                ];
                break;
            case 'orders':
                title = 'Order Summary';
                data = generateOrderSummary();
                columns = [
                    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
                    { title: 'Time', dataIndex: 'time', key: 'time' },
                    { title: 'Type', dataIndex: 'type', key: 'type', render: (t: string) => <Tag>{t}</Tag> },
                    { title: 'Items', dataIndex: 'items', key: 'items' },
                    { title: 'Total', dataIndex: 'total', key: 'total', render: (v: string) => `$${v}` },
                    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color="green">{s}</Tag> },
                ];
                break;
        }

        reportConfig = { data, columns, title };
        
        if (data.length > 0) {
            content = <Table dataSource={data} columns={columns} pagination={false} size="middle" />;
        } else {
             content = <Empty description="Select a report from the tabs" />;
        }

        return { tabs: availableTabs, content };
    };

    const renderEmployeeReports = () => {
        const availableTabs = [
            { key: 'attendance', label: 'Attendance', perm: 'rpt_emp_attendance' },
            { key: 'shifts', label: 'Shift Report', perm: 'rpt_emp_shifts' },
            { key: 'performance', label: 'Sales by Employee', perm: 'rpt_emp_performance' },
        ].filter(t => permissions.includes(t.perm));

        const data = generateEmployeeShiftReport();
        const columns = [
            { title: 'Employee', dataIndex: 'name', key: 'name' },
            { title: 'Role', dataIndex: 'role', key: 'role', render: (r: string) => <Tag color="blue">{r}</Tag> },
            { title: 'Clock In', dataIndex: 'clockIn', key: 'clockIn' },
            { title: 'Clock Out', dataIndex: 'clockOut', key: 'clockOut' },
            { title: 'Hours', dataIndex: 'hours', key: 'hours' },
            { title: 'Total Sales', dataIndex: 'sales', key: 'sales', render: (val: number) => `$${val.toFixed(2)}` },
            { title: 'Tips', dataIndex: 'tips', key: 'tips', render: (val: number) => `$${val.toFixed(2)}` },
        ];
        
        reportConfig = { data, columns, title: 'Employee Report' };
        
        return { tabs: availableTabs, content: <Table dataSource={data} columns={columns} pagination={false} size="middle" /> };
    };

    const renderPaymentReports = () => {
        const availableTabs = [
            { key: 'payment_methods', label: 'Payment Methods', perm: 'rpt_pay_methods' },
            { key: 'batch', label: 'Batch Report', perm: 'rpt_pay_batch' },
            { key: 'summary', label: 'Batch Summary', perm: 'rpt_pay_summary' },
        ].filter(t => permissions.includes(t.perm));

        const data = generatePaymentReport();
        const columns = [
            { title: 'Method', dataIndex: 'method', key: 'method', render: (t: string) => <strong>{t}</strong> },
            { title: 'Count', dataIndex: 'count', key: 'count' },
            { title: 'Total Amount', dataIndex: 'amount', key: 'amount', render: (val: number) => `$${val.toFixed(2)}` },
            { title: '% of Sales', key: 'pct', render: (_: any, r: any) => `${(Math.random() * 30 + 5).toFixed(1)}%` },
        ];

        reportConfig = { data, columns, title: 'Payment Report' };

        return { tabs: availableTabs, content: <Table dataSource={data} columns={columns} pagination={false} size="middle" /> };
    };

    const renderAuditReports = () => {
        const availableTabs = [
            { key: 'shift_summary', label: 'Shift Summary', perm: 'rpt_audit_shift' },
            { key: 'drawer', label: 'Drawer Report', perm: 'rpt_audit_drawer' },
            { key: 'logs', label: 'Audit Logs', perm: 'rpt_audit_logs' },
        ].filter(t => permissions.includes(t.perm));

        let content;
        let data: any[] = [];
        let columns: any[] = [];
        let title = '';

        if (subReport === 'drawer') {
            title = 'Drawer Report';
            data = generateDrawerReport();
            columns = [
                { title: 'Drawer ID', dataIndex: 'drawerId', key: 'drawerId' },
                { title: 'User', dataIndex: 'user', key: 'user' },
                { title: 'Start', dataIndex: 'startAmount', key: 'start', render: (v: number) => `$${v.toFixed(2)}` },
                { title: 'Cash Sales', dataIndex: 'cashSales', key: 'sales', render: (v: number) => `$${v.toFixed(2)}` },
                { title: 'Drops', dataIndex: 'drops', key: 'drops', render: (v: number) => `$${v.toFixed(2)}` },
                { title: 'Expected', dataIndex: 'expected', key: 'exp', render: (v: number) => `$${v.toFixed(2)}` },
                { title: 'Actual', dataIndex: 'actual', key: 'act', render: (v: number) => `$${v.toFixed(2)}` },
                { title: 'Variance', dataIndex: 'variance', key: 'var', render: (v: number) => <span style={{ color: v < 0 ? 'red' : 'green', fontWeight: 'bold' }}>{v.toFixed(2)}</span> },
            ];
        } else if (subReport === 'shift_summary') {
            title = 'Shift Summary Audit';
            data = generateShiftAuditReport();
            columns = [
                { title: 'Shift', dataIndex: 'shift', key: 'shift' },
                { title: 'Manager', dataIndex: 'manager', key: 'manager' },
                { title: 'Start Cash', dataIndex: 'startCash', key: 'startCash', render: (v: number) => `$${v.toFixed(2)}` },
                { title: 'End Cash', dataIndex: 'endCash', key: 'endCash', render: (v: number) => `$${v.toFixed(2)}` },
                { title: 'Over/Short', dataIndex: 'overShort', key: 'overShort', render: (v: number) => <span style={{ color: v !== 0 ? 'red' : 'green' }}>{v.toFixed(2)}</span> },
            ];
        } else {
            title = 'Sensitive Action Logs';
            data = generateAuditLog();
            columns = [
                { title: 'Time', dataIndex: 'time', key: 'time' },
                { title: 'User', dataIndex: 'user', key: 'user' },
                { title: 'Action', dataIndex: 'action', key: 'action', render: (t: string) => <Tag color="orange">{t}</Tag> },
                { title: 'Details', dataIndex: 'details', key: 'details' },
                { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v: string) => `$${v}` },
            ];
        }

        reportConfig = { data, columns, title };

        if (data.length > 0) {
            content = <Table dataSource={data} columns={columns} pagination={false} size="middle" />;
        } else {
            content = <Empty description="Select a report" />;
        }

        return { tabs: availableTabs, content };
    };


    let currentData;
    switch(mainCategory) {
        case 'sales': currentData = renderSalesReports(); break;
        case 'employee': currentData = renderEmployeeReports(); break;
        case 'payment': currentData = renderPaymentReports(); break;
        case 'audit': currentData = renderAuditReports(); break;
        default: currentData = renderSalesReports();
    }

    const handleExportCSV = () => {
        if (!reportConfig.data || reportConfig.data.length === 0) {
            message.warning("No data to export");
            return;
        }

        const headers = reportConfig.columns.map(c => c.title).join(',');
        const rows = reportConfig.data.map(row => {
            return reportConfig.columns.map(c => {
                const val = row[c.dataIndex];
                return `"${String(val).replace(/"/g, '""')}"`;
            }).join(',');
        }).join('\n');

        const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${reportConfig.title.replace(/\s+/g, '_')}_${dayjs().format('YYYY-MM-DD')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        if (!reportConfig.data || reportConfig.data.length === 0) {
            message.warning("No data to print");
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            message.error("Please allow popups to print");
            return;
        }

        const dateStr = dayjs().format('MMMM D, YYYY h:mm A');
        
        const tableHeaders = reportConfig.columns.map(c => `<th>${c.title}</th>`).join('');
        const tableRows = reportConfig.data.map(row => {
            return `<tr>${reportConfig.columns.map(c => {
                let val = row[c.dataIndex];
                if (c.title.includes('Sales') || c.title.includes('Amount') || c.title.includes('Total') || c.title.includes('Price')) {
                    if (typeof val === 'number') val = `$${val.toFixed(2)}`;
                    else if (typeof val === 'string' && !val.includes('$') && !isNaN(parseFloat(val))) val = `$${val}`;
                }
                return `<td>${val}</td>`;
            }).join('')}</tr>`;
        }).join('');

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print Report - ${reportConfig.title}</title>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                    .logo-placeholder { 
                        width: 60px; height: 60px; background-color: #6132C0; color: white; 
                        border-radius: 8px; line-height: 60px; font-size: 24px; font-weight: bold;
                        margin: 0 auto 10px auto; display: inline-block;
                    }
                    .company-name { font-size: 24px; font-weight: bold; margin: 5px 0; color: #6132C0; }
                    .company-info { font-size: 12px; color: #666; line-height: 1.4; }
                    .report-title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
                    .report-meta { font-size: 12px; color: #888; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; font-size: 12px; }
                    th { text-align: left; background-color: #f8f9fa; padding: 10px 8px; border-bottom: 2px solid #ddd; font-weight: 600; text-transform: uppercase; color: #444; }
                    td { padding: 10px 8px; border-bottom: 1px solid #eee; }
                    tr:last-child td { border-bottom: none; }
                    .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo-placeholder">A</div>
                    <div class="company-name">THE BURGER JOINT</div>
                    <div class="company-info">
                        123 Culinary Avenue, Food District, NY 10012<br>
                        Mobile: +1 (555) 019-2834 &bull; Email: admin@burgerjoint.com
                    </div>
                </div>

                <div class="report-title">${reportConfig.title}</div>
                <div class="report-meta">Generated on: ${dateStr}</div>

                <table>
                    <thead><tr>${tableHeaders}</tr></thead>
                    <tbody>${tableRows}</tbody>
                </table>

                <div class="footer">
                    Printed from Aroma POS System &bull; Page 1 of 1
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    return (
        <Layout style={{ height: '100%', background: token.colorBgContainer }}>
            <Sider width={220} style={{ background: token.colorBgContainer, borderRight: `1px solid ${token.colorBorderSecondary}` }}>
                <div style={{ padding: '20px 16px', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                    <Title level={4} style={{ margin: 0 }}>Reports</Title>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[mainCategory]}
                    onClick={handleMenuClick}
                    items={menuItems}
                    style={{ borderRight: 0 }}
                />
            </Sider>
            <Layout>
                <Content style={{ padding: '24px', overflowY: 'auto', background: token.colorBgLayout }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <Space direction="vertical" size={0}>
                            <Title level={3} style={{ margin: 0, textTransform: 'capitalize' }}>{mainCategory} Reports</Title>
                            <Text type="secondary">View and export detailed analytics</Text>
                        </Space>
                        <Space>
                            <RangePicker />
                            <Button icon={<PrinterOutlined />} onClick={handlePrint}>Print</Button>
                            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportCSV}>Export CSV</Button>
                        </Space>
                    </div>

                    <Card 
                        bordered={false} 
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: 8 }}
                        bodyStyle={{ padding: 0 }}
                    >
                        {currentData.tabs.length > 0 ? (
                            <Tabs 
                                activeKey={subReport}
                                onChange={setSubReport}
                                items={currentData.tabs.map(tab => ({
                                    key: tab.key,
                                    label: tab.label,
                                    children: (
                                        <div style={{ padding: '0 24px 24px' }}>
                                            <div style={{ marginBottom: 24, padding: 16, background: token.colorFillAlter, borderRadius: 8 }}>
                                                <Row gutter={16}>
                                                    <Col span={6}>
                                                        <Statistic title="Total Records" value={reportConfig.data.length || 0} />
                                                    </Col>
                                                    <Col span={6}>
                                                        <Statistic title="Generated At" value={dayjs().format('HH:mm A')} valueStyle={{ fontSize: 16 }} />
                                                    </Col>
                                                </Row>
                                            </div>
                                            {currentData.content}
                                        </div>
                                    )
                                }))}
                                tabBarStyle={{ padding: '0 24px' }}
                            />
                        ) : (
                            <div style={{ padding: 48, textAlign: 'center' }}>
                                <Empty description="You do not have permission to view reports in this category." />
                            </div>
                        )}
                    </Card>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ReportsView;