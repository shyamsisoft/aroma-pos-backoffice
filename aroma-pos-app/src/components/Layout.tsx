import React from "react";
import { Layout } from "antd";
import Sidebar from "./SidebarTemp";

const { Sider, Header, Content } = Layout;

interface MasterLayoutProps {
    children: React.ReactNode;
}

const MasterLayout: React.FC<MasterLayoutProps> = ({ children }) => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible breakpoint="lg">
                <div
                    style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "bold",
                        margin: "16px 0",
                    }}
                >
                    ERP
                </div>
                <Sidebar />
            </Sider>

            <Layout>
                <Header style={{ background: "#fff", padding: "0 16px" }}>
                    <h3>ERP Management System</h3>
                </Header>

                <Content style={{ margin: "16px", padding: 24, background: "#fff" }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MasterLayout;
