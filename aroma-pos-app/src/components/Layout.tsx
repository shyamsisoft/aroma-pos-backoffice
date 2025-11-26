import React, { useState } from "react";
import { Layout, Row } from "antd";
import Sidebar from "./Sidebar";
import HeadingComponent from "../components/Heading";
import { Header } from "antd/es/layout/layout";


const { Sider, Content } = Layout;

interface MasterLayoutProps {
    children: React.ReactNode;
    title: string | null;
    addNew: () => void;
}

const MasterLayout: React.FC<MasterLayoutProps> = ({ children, addNew, title }) => {

    const [pageTitle, setPageTitle] = useState<string | null>("Product Master")

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

            {/* <Header>
                <HeadingComponent

                    addNew={addNew}
                    title={`${title}`}
                />
                <Content >
                    {children}
                </Content>
            </Header> */}


            {/* Scrollable Content */}
            <Layout
                style={{ padding: 0, margin: 0, background: "#fff", overflow: "hidden", height: "100vh" }}
            >
                <HeadingComponent

                    addNew={addNew}
                    title={`${pageTitle}`}
                />
                <Content
                    style={{ height: "95vh" }} >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MasterLayout;
