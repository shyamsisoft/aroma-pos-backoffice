import React, { useState } from "react";
import { Layout, Avatar } from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from "@ant-design/icons";
import Sidebar from "./Sidebar";
import "./Layout.css";

const { Sider, Content } = Layout;

interface MasterLayoutProps {
    children: React.ReactNode;
}

const MasterLayout: React.FC<MasterLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: "100vh", minWidth: "120vw" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                trigger={null}
                collapsedWidth={60}   // icon-only width
                breakpoint="lg"
                className="sider"
                style={{ position: "relative" }}
            >
                {/* HEADER */}
                <div
                    style={{
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: collapsed ? "center" : "flex-start",
                        fontSize: 20,
                        fontWeight: "bold",
                        marginTop: 20,
                        marginBottom: 16,
                        gap: 8,
                        paddingLeft: collapsed ? 0 : 15,
                        transition: "all 0.3s ease",
                    }}
                >
                    {/* Title (Hidden when collapsed) */}
                    {!collapsed && (
                        <div style={{ marginTop: 10 }}>
                            Aroma POS
                        </div>
                    )}

                    {/* Expand / Collapse Button */}
                    <span
                        style={{
                            cursor: "pointer",
                            fontSize: 18,
                            marginTop: 10,
                            marginLeft: collapsed ? -20 : 10,
                        }}
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </span>
                </div>

                {/* MENU */}
                <Sidebar />

                {/* BOTTOM USER PANEL */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        padding: collapsed ? "6px 0" : "8px 0", // reduced padding
                        textAlign: "center",
                        transition: "all 0.3s ease",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            width: "95%",
                            background: "rgba(255, 255, 255, 0.1)", // semi-transparent glass effect
                            backdropFilter: "blur(8px)",            // glass blur
                            padding: "6px 10px",                     // reduced padding
                            borderRadius: "12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            border: "1px solid rgba(255, 255, 255, 0.2)", // subtle border
                        }}
                    >
                        {/* Avatar always visible */}
                        <Avatar
                            size={collapsed ? 32 : 48}
                            icon={<UserOutlined />}
                            style={{
                                marginBottom: collapsed ? 0 : 6,  // reduce spacing below avatar
                                marginTop: collapsed ? 3 : 0,     // reduce top margin
                            }}
                        />

                        {/* Text hidden when collapsed */}
                        {!collapsed && (
                            <div style={{ textAlign: "center", color: "white" }}>
                                <div style={{ fontWeight: "bold" }}>John Doe</div>
                                <div style={{ fontSize: 12 }}>Admin</div>
                            </div>
                        )}
                    </div>
                </div>



            </Sider>


            <Layout>
                <Content style={{ margin: "16px", padding: 24, background: "#fff" }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MasterLayout;
