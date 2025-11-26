import React, { useEffect, useState } from "react";
import { Card, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";




export interface HeadingProps {
    addNew: () => void;
    title: string | null;

}

const HeadingComponent: React.FC<HeadingProps> = ({ addNew, title }) => {



    return (
        <Card
            style={{

                margin: 0,
                padding: 0,
                height: "10vh"
            }}>
            <div className=" heading-card"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: 0,
                    marginTop: -8,
                    padding: 0
                }}>
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                    {title}
                </Title>

                <Button
                    className="custom-btn lm-btn-add"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addNew}
                >
                    Add New
                </Button>
            </div>
        </Card>

    )
}
export default HeadingComponent;
