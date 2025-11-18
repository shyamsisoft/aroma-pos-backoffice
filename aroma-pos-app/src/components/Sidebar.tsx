import { Menu } from "antd";
import {
    DashboardOutlined,
    UserOutlined,
    BarChartOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
 import "./sidebar.css";

const Sidebar: React.FC = () => {
    const location = useLocation();

    // Detect main root path for submenu
    const rootKey = "/" + location.pathname.split("/")[1];

    const [openKeys, setOpenKeys] = useState<string[]>([rootKey]);

    // Allow only one submenu open at a time
    const onOpenChange = (keys: string[]) => {
        const latestKey = keys.find((key) => !openKeys.includes(key));
        setOpenKeys(latestKey ? [latestKey] : []);
    };

    return (
        <div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}    // highlight
                openKeys={openKeys}                  // control submenu state
                onOpenChange={onOpenChange}          // allow single open
                items={[
                    {
                        key: "/",
                        icon: <DashboardOutlined />,
                        label: <Link to="/">Dashboard</Link>,
                    },
                    {
                        key: "/users",
                        icon: <UserOutlined />,
                        label: "Users",
                        children: [
                            { key: "/users/list", label: <Link to="/users/list">User List</Link> },
                            { key: "/users/create", label: <Link to="/users/create">Add User</Link> },
                        ],
                    },
                    {
                        key: "/reports",
                        icon: <BarChartOutlined />,
                        label: "Reports",
                        children: [
                            { key: "/reports/daily", label: <Link to="/reports/daily">Daily Report</Link> },
                            { key: "/reports/monthly", label: <Link to="/reports/monthly">Monthly Report</Link> },
                        ],
                    },
                ]}
            />
        </div>
    );
};

export default Sidebar;
