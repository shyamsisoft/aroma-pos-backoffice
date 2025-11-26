import React from 'react';
import { 
    Tabs, 
    Form, 
    Input, 
    Select, 
    Switch, 
    Button, 
    Typography, 
    theme, 
    Divider, 
    Row, 
    Col, 
    TimePicker, 
    InputNumber, 
    Upload,
    Card,
    message 
} from 'antd';
import { 
    UploadOutlined, 
    SaveOutlined, 
    ShopOutlined, 
    CreditCardOutlined, 
    DesktopOutlined, 
    NotificationOutlined, 
    GiftOutlined, 
    CalendarOutlined, 
    QrcodeOutlined, 
    BranchesOutlined, 
    ClockCircleOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const ConfigurationView: React.FC = () => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    const handleSave = () => {
        message.success("Configurations saved successfully!");
    };

    const tabItems = [
        {
            key: '1',
            label: <span><ShopOutlined /> Business Profile</span>,
            children: (
                <div style={{ maxWidth: 800 }}>
                    <Title level={4}>Business Profile & Branding</Title>
                    <Divider />
                    <Form layout="vertical">
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="Business Name">
                                    <Input placeholder="Enter business name" defaultValue="The Burger Joint" />
                                </Form.Item>
                                <Form.Item label="Contact Email">
                                    <Input placeholder="admin@restaurant.com" />
                                </Form.Item>
                                <Form.Item label="Contact Phone">
                                    <Input placeholder="+1 (555) 123-4567" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="POS Screen Logo">
                                    <Upload>
                                        <Button icon={<UploadOutlined />}>Upload Logo</Button>
                                    </Upload>
                                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                                        Upload a separate logo optimized for POS screens.
                                    </Text>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                             <Col span={8}>
                                <Form.Item label="Time Zone">
                                    <Select defaultValue="EST">
                                        <Option value="EST">Eastern Standard Time</Option>
                                        <Option value="PST">Pacific Standard Time</Option>
                                        <Option value="UTC">UTC</Option>
                                    </Select>
                                </Form.Item>
                             </Col>
                             <Col span={8}>
                                <Form.Item label="Country">
                                    <Select defaultValue="USA">
                                        <Option value="USA">United States</Option>
                                        <Option value="CAN">Canada</Option>
                                    </Select>
                                </Form.Item>
                             </Col>
                             <Col span={8}>
                                <Form.Item label="Currency">
                                    <Select defaultValue="USD">
                                        <Option value="USD">USD ($)</Option>
                                        <Option value="EUR">EUR (€)</Option>
                                    </Select>
                                </Form.Item>
                             </Col>
                        </Row>
                        <Form.Item label="Franchise / Multi-brand Profile">
                            <Select mode="tags" placeholder="Select brands" defaultValue={['Burger Joint HQ']} />
                        </Form.Item>
                    </Form>
                </div>
            )
        },
        {
            key: '2',
            label: <span><CreditCardOutlined /> Payments</span>,
            children: (
                <div style={{ maxWidth: 800 }}>
                    <Title level={4}>Payment Gateway & Terminals</Title>
                    <Divider />
                    <Form layout="vertical">
                        <Form.Item label="Payment Processor">
                            <Select defaultValue="Stripe">
                                <Option value="Stripe">Stripe</Option>
                                <Option value="Square">Square</Option>
                                <Option value="Clover">Clover</Option>
                                <Option value="PAX">PAX Technology</Option>
                            </Select>
                        </Form.Item>
                        <Card size="small" title="Processor Credentials" style={{ marginBottom: 24 }}>
                             <Form.Item label="API Key / Token">
                                <Input.Password placeholder="sk_test_..." />
                             </Form.Item>
                             <Form.Item label="Terminal IP / Port (If applicable)">
                                <Input placeholder="192.168.1.50:10009" />
                             </Form.Item>
                        </Card>
                        
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="Surcharge / Convenience Fee (%)">
                                    <InputNumber min={0} max={100} defaultValue={0} formatter={value => `${value}%`} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Tip Configuration">
                                    <Select defaultValue="Prompt on Terminal">
                                        <Option value="None">Disabled</Option>
                                        <Option value="Prompt on Screen">Prompt on POS Screen</Option>
                                        <Option value="Prompt on Terminal">Prompt on Card Terminal</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider style={{ fontSize: 14 }}>Rules</Divider>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="Offline Mode" valuePropName="checked">
                                    <Switch /> <Text type="secondary" style={{ marginLeft: 8 }}>Allow transactions without internet</Text>
                                </Form.Item>
                                <Form.Item label="Auto-Close Card Batch" valuePropName="checked">
                                    <Switch defaultChecked />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Cash Drawer Opens On">
                                    <Select mode="multiple" defaultValue={['Cash Sale']}>
                                        <Option value="Cash Sale">Cash Sale</Option>
                                        <Option value="Card Sale">Card Sale</Option>
                                        <Option value="Refund">Refund</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            )
        },
        {
            key: '3',
            label: <span><DesktopOutlined /> KDS</span>,
            children: (
                <div style={{ maxWidth: 800 }}>
                    <Title level={4}>Kitchen Display System (KDS)</Title>
                    <Divider />
                    <Form layout="vertical">
                        <Form.Item label="Enable KDS Functionality" valuePropName="checked">
                            <Switch defaultChecked />
                        </Form.Item>
                        
                        <Form.Item label="Kitchen Routing Rules">
                            <Select defaultValue="Category Based">
                                <Option value="Simple">Send all items to all screens</Option>
                                <Option value="Category Based">Route by Category (e.g. Drinks to Bar)</Option>
                                <Option value="Item Based">Route by specific item settings</Option>
                            </Select>
                        </Form.Item>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="Sound / Beep Alerts" valuePropName="checked">
                                    <Switch defaultChecked />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Auto-clear Completed Orders (mins)">
                                    <InputNumber min={0} defaultValue={15} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            )
        },
        {
            key: '4',
            label: <span><NotificationOutlined /> Alerts</span>,
            children: (
                <div style={{ maxWidth: 800 }}>
                    <Title level={4}>Notifications & Alerts</Title>
                    <Divider />
                    <Form layout="vertical">
                        <Card size="small" style={{ marginBottom: 16 }}>
                            <Row align="middle" justify="space-between">
                                <Col><Text strong>Low Stock Notifications</Text></Col>
                                <Col><Switch defaultChecked /></Col>
                            </Row>
                        </Card>
                        <Card size="small" style={{ marginBottom: 16 }}>
                            <Row align="middle" justify="space-between">
                                <Col><Text strong>Order Ready SMS (to Customer)</Text></Col>
                                <Col><Switch /></Col>
                            </Row>
                        </Card>
                        
                        <Form.Item label="Email Alert Recipients (Comma separated)">
                            <Input.TextArea rows={2} placeholder="manager@restaurant.com, owner@restaurant.com" />
                        </Form.Item>

                         <Form.Item label="WhatsApp Integration">
                            <Select defaultValue="Disabled">
                                <Option value="Disabled">Disabled</Option>
                                <Option value="Twilio">Via Twilio</Option>
                                <Option value="Business API">WhatsApp Business API</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
            )
        },
        {
            key: '5',
            label: <span><GiftOutlined /> Loyalty</span>,
            children: (
                <div style={{ maxWidth: 800 }}>
                    <Title level={4}>Customer Loyalty & Rewards</Title>
                    <Divider />
                    <Form layout="vertical">
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="Points Earning Rule">
                                    <Input addonBefore="Earn 1 point per" addonAfter="$ spent" defaultValue="1" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Redemption Rule">
                                    <Input addonBefore="Redeem 100 points for" addonAfter="$ credit" defaultValue="5" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Loyalty Tiers">
                             <Select mode="tags" defaultValue={['Silver', 'Gold', 'VIP']} />
                        </Form.Item>
                        
                        <Form.Item label="Birthday Reward">
                            <Input placeholder="e.g. Free Dessert" />
                        </Form.Item>
                    </Form>
                </div>
            )
        },
        {
            key: '6',
            label: <span><GiftOutlined /> Gift Cards</span>,
            children: (
                <div style={{ maxWidth: 800 }}>
                    <Title level={4}>Gift Card System</Title>
                    <Divider />
                    <Form layout="vertical">
                         <Form.Item label="Card Expiry (Months from issue)">
                            <InputNumber min={0} defaultValue={12} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="Allow Partial Redemption" valuePropName="checked">
                            <Switch defaultChecked />
                        </Form.Item>
                        <Form.Item label="Reload Rules">
                            <Select defaultValue="Any Amount">
                                <Option value="Any Amount">Any Amount</Option>
                                <Option value="Fixed Denominations">Fixed Denominations ($10, $20, $50)</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
            )
        },
        {
            key: '7',
            label: <span><CalendarOutlined /> Reservations</span>,
            children: (
                <div style={{ maxWidth: 800 }}>
                    <Title level={4}>Reservation Settings</Title>
                    <Divider />
                    <Form layout="vertical">
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="Time Slot Duration (mins)">
                                    <InputNumber step={15} defaultValue={90} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Max Party Size">
                                    <InputNumber min={1} defaultValue={10} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label="Require Deposit">
                            <Select defaultValue="For Parties > 6">
                                <Option value="Never">Never</Option>
                                <Option value="Always">Always</Option>
                                <Option value="For Parties > 6">For Parties &gt; 6</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Auto-cancel Policy (mins late)">
                             <InputNumber min={5} defaultValue={15} />
                        </Form.Item>
                    </Form>
                </div>
            )
        },
        {
            key: '8',
            label: <span><BranchesOutlined /> Reports</span>,
            children: (
                <div style={{ maxWidth: 800 }}>
                    <Title level={4}>Reports Customization</Title>
                    <Divider />
                     <Form layout="vertical">
                        <Form.Item label="Scheduled Email Reports">
                            <Select mode="multiple" defaultValue={['Daily Sales', 'Labor Cost']}>
                                <Option value="Daily Sales">Daily Sales</Option>
                                <Option value="Weekly Summary">Weekly Summary</Option>
                                <Option value="Labor Cost">Labor Cost</Option>
                                <Option value="Inventory Low Stock">Inventory Low Stock</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="KPI Dashboard Widgets">
                             <Select mode="multiple" defaultValue={['Revenue', 'Top Items']}>
                                <Option value="Revenue">Total Revenue</Option>
                                <Option value="Top Items">Top Selling Items</Option>
                                <Option value="Void Tracks">Void Tracks</Option>
                                <Option value="Labor %">Labor Percentage</Option>
                            </Select>
                        </Form.Item>
                     </Form>
                </div>
            )
        },
        {
            key: '9',
            label: <span><QrcodeOutlined /> QR Ordering</span>,
            children: (
                <div style={{ maxWidth: 800 }}>
                    <Title level={4}>QR Ordering</Title>
                    <Divider />
                    <Form layout="vertical">
                        <Form.Item label="Enable QR Ordering" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <Form.Item label="Payment Flow">
                             <Select defaultValue="Pay at Table">
                                <Option value="Pay to Order">Pay before ordering</Option>
                                <Option value="Pay at Table">Order first, pay later</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Order Throttling (Max orders/min)">
                            <InputNumber min={0} defaultValue={5} />
                        </Form.Item>
                    </Form>
                </div>
            )
        },
        {
            key: '10',
            label: <span><BranchesOutlined /> Multi-Store</span>,
            children: (
                <div style={{ maxWidth: 800 }}>
                    <Title level={4}>Multi-Store / Franchise</Title>
                    <Divider />
                     <Form layout="vertical">
                        <Form.Item label="Store Linking ID">
                            <Input placeholder="Enter HQ Link ID" />
                        </Form.Item>
                        <Form.Item label="Centralized Menu Management" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <Form.Item label="Share Inventory Across Stores" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <Form.Item label="Allow Store-level Overrides" valuePropName="checked">
                            <Switch defaultChecked />
                        </Form.Item>
                     </Form>
                </div>
            )
        },
        {
            key: '11',
            label: <span><ClockCircleOutlined /> Shifts</span>,
            children: (
                <div style={{ maxWidth: 800 }}>
                    <Title level={4}>Business Day & Shift</Title>
                    <Divider />
                    <Form layout="vertical">
                        <Form.Item label="Business Day Start Time">
                            <TimePicker format="HH:mm" />
                        </Form.Item>
                        <Form.Item label="Auto End-of-Day" valuePropName="checked">
                            <Switch /> <Text type="secondary" style={{ marginLeft: 8 }}>Automatically close business day at cutoff</Text>
                        </Form.Item>
                        <Form.Item label="Shift Summary Requirements">
                             <Select mode="multiple" defaultValue={['Cash Count', 'Manager Approval']}>
                                <Option value="Cash Count">Cash Count Blind</Option>
                                <Option value="Manager Approval">Manager Approval</Option>
                                <Option value="Clock Out All">Clock Out All Employees</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
            )
        }
    ];

    return (
        <div style={{ 
            padding: 24, 
            height: '100%', 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column' 
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Configurations</Title>
                <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    onClick={handleSave}
                    size="large"
                    style={{ background: '#10b981', borderColor: '#10b981' }}
                >
                    Save Changes
                </Button>
            </div>
            
            <div style={{ 
                background: token.colorBgContainer, 
                borderRadius: 12, 
                border: `1px solid ${token.colorBorderSecondary}`,
                flex: 1,
                overflow: 'hidden',
                padding: '24px 0'
            }}>
                <Tabs 
                    tabPosition="left" 
                    items={tabItems} 
                    style={{ height: '100%' }}
                    tabBarStyle={{ width: 220 }}
                />
            </div>
        </div>
    );
};

export default ConfigurationView;