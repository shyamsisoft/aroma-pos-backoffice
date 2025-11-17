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
            {/* Fixed Sidebar */}
            <Sider
                width={250} // fixed width
                style={{
                    height: "100vh", // full viewport height
                    position: "sticky", // make sidebar sticky
                    top: 0,
                    left: 0,
                    overflow: "auto", // scroll sidebar if content is tall
                    background: "#001529", // default antd sider color
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

            {/* Scrollable Content */}
            <Layout
                style={{
                    marginLeft: 0, // no margin needed, sider is fixed
                    flex: 1,
                    overflowY: "auto", // content scrolls
                }}
            >
                <Content style={{ margin: "16px", padding: 24, background: "#fff" }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MasterLayout;
