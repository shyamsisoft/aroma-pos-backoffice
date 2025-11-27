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
            <Sider
                width={250}
                style={{
                    height: "100vh",
                    position: "sticky",
                    top: 0,
                    left: 0,
                    overflow: "auto",
                    background: "#001529",
                }}
                collapsible
                breakpoint="lg"
            >
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
            <Layout
                style={{ padding: 0, margin: 0, background: "#fff", overflow: "hidden", height: "100vh" }}
            >
                <Content
                    style={{ height: "100vh" }} >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MasterLayout;
