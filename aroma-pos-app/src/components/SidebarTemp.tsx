import { Menu } from "antd";
import {
    DashboardOutlined,
    UserOutlined,
    BarChartOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={[
                {
                    key: "/",
                    icon: <DashboardOutlined />,
                    label: <Link to="/">Dashboard</Link>,
                },
                {
                    key: "/users",
                    icon: <UserOutlined />,
                    label: <Link to="/users">Users</Link>,
                },
                {
                    key: "/reports",
                    icon: <BarChartOutlined />,
                    label: <Link to="/reports">Reports</Link>,
                },
            ]}
        />
    );
};

export default Sidebar;
