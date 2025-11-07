import React, { useState } from "react";
import { Card, Button, Table, Space } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import APMasterForm, { type APFormValues } from "../components/APMasterForm.tsx";

interface Item {
    key: string;
    name: string;
    description: string;
}

const ItemMasterPage: React.FC = () => {
    const [data, setData] = useState<Item[]>([
        { key: "1", name: "Item A", description: "First item" },
        { key: "2", name: "Item B", description: "Second item" },
    ]);

    const [formState, setFormState] = useState<{
        open: boolean;
        mode: "add" | "edit";
        record?: Item;
    }>({
        open: false,
        mode: "add",
    });

    const columns: ColumnsType<Item> = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Description", dataIndex: "description", key: "description" },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() =>
                            setFormState({ open: true, mode: "edit", record: record })
                        }
                    >
                        Edit
                    </Button>
                </Space>
            ),
        },
    ];

    const handleSubmit = (values: APFormValues) => {
        if (formState.mode === "add") {
            const newItem: Item = {
                key: (data.length + 1).toString(),
                name: values.name,
                description: values.description,
            };
            setData([...data, newItem]);
        } else if (formState.mode === "edit" && values.key) {
            const updated = data.map((item) =>
                item.key === values.key ? { ...item, ...values } : item
            );
            setData(updated);
        }

        setFormState({ ...formState, open: false });
    };

    return (
        <Card
            title="Item Master"
            extra={
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setFormState({ open: true, mode: "add" })}
                >
                    Add Item
                </Button>
            }
            style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />

            <APMasterForm
                open={formState.open}
                mode={formState.mode}
                initialValues={formState.record}
                onCancel={() => setFormState({ ...formState, open: false })}
                onSubmit={handleSubmit}
            />
        </Card>
    );
};

export default ItemMasterPage;
