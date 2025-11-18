import React, { useState } from "react";
import { Card, Button, Table, Space } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import APMasterForm, { type ProductFormValues } from "../components/APMasterForm";

export interface DynamicFormValues {
    key?: string;
    [field: string]: any; // Allow any dynamic field
}

const ItemMasterPage: React.FC = () => {
    const [data, setData] = useState<DynamicFormValues[]>([
        { key: "1", name: "Item A", description: "First item" },
        { key: "2", name: "Item B", description: "Second item" },
    ]);

    const [formState, setFormState] = useState<{
        open: boolean;
        mode: "add" | "edit";
        record?: DynamicFormValues;
    }>({
        open: false,
        mode: "add",
    });

    const columns: ColumnsType<DynamicFormValues> = [
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
                            setFormState({ open: true, mode: "edit", record })
                        }
                    >
                        Edit
                    </Button>
                </Space>
            ),
        },
    ];

    const handleSubmit = (values: ProductFormValues) => {
        if (formState.mode === "add") {
            const newItem: DynamicFormValues = {
                key: (data.length + 1).toString(),
                ...values,
            };
            setData([...data, newItem]);
        } else if (formState.mode === "edit" && values.key) {
            const updated = data.map((item) =>
                item.key === values.key ? { ...item, ...values } : item
            );
            setData(updated);
        }

        setFormState({ open: false, mode: "add" }); // Reset form state
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
            <Table
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 5 }}
                rowKey="key"
            />

            <APMasterForm
                open={formState.open}
                mode={formState.mode}
                initialValues={formState.record ?? {}}
                onCancel={() => setFormState({ ...formState, open: false })}
                onSubmit={handleSubmit}
            />
        </Card>
    );
};

export default ItemMasterPage;
