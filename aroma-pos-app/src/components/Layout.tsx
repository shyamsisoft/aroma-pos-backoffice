import React from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";

const { Sider, Content } = Layout;

interface MasterLayoutProps {
    children: React.ReactNode;
}

const MasterLayout: React.FC<MasterLayoutProps> = ({ children }) => {
    return (
        <Layout style={{ minHeight: "100vh", minWidth: "100vw" }}>
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
                <Content style={{ margin: "16px", padding: 24, background: "#fff" }}>
                    {children}
                </Content>
            </Layout>
            {/* <Layout>
                <Content style={{ margin: "16px", padding: 24, background: "#fff" }}>
                    {children}
                </Content>
            </Layout> */}
        </Layout>
    );
};

export default MasterLayout;
