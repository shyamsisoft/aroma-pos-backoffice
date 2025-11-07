import React, { useState } from "react";
import { Card, Button, Table, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import ItemForm, { type ItemFormValues } from "../components/ItemForm";

interface Item {
    key: string;
    name: string;
    description: string;
}

const ItemMasterPage: React.FC = () => {
    const [data, setData] = useState<Item[]>([
        { key: "1", name: "Item A", description: "First item" },
        { key: "2", name: "Item B", description: "Second item" },
        { key: "3", name: "Item C", description: "Third item" },
    ]);

    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [formMode, setFormMode] = useState<"view" | "edit" | "add">("view");

    const columns: ColumnsType<Item> = [
        { title: "Name", dataIndex: "name", key: "name", width: "40%" },
        { title: "Description", dataIndex: "description", key: "description" },
    ];

    const handleRowClick = (record: Item) => {
        setSelectedItem(record);
        setFormMode("view");
    };

    const handleSave = (values: ItemFormValues) => {
        if (formMode === "add") {
            const newItem: Item = {
                key: (data.length + 1).toString(),
                name: values.name,
                description: values.description,
            };
            setData([...data, newItem]);
            setSelectedItem(newItem);
            setFormMode("view");
        } else if (formMode === "edit" && values.key) {
            const updated = data.map((item) =>
                item.key === values.key ? { ...item, ...values } : item
            );
            setData(updated);
            setSelectedItem(values as Item);
            setFormMode("view");
        }
    };

    const handleAddNew = () => {
        setSelectedItem(null);
        setFormMode("add");
    };

    const handleCancelEdit = () => {
        setFormMode("view");
    };

    return (
        <Card
            title="Item Master"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                    Add New
                </Button>
            }
            style={{
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
        >
            <Row gutter={16}>
                {/* Grid Column */}
                <Col
                    span={selectedItem || formMode === "add" ? 14 : 24}
                    style={{
                        transition: "all 0.3s ease",
                    }}
                >
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        rowKey="key"
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                            style: {
                                cursor: "pointer",
                                background:
                                    selectedItem?.key === record.key ? "#f0f7ff" : undefined,
                            },
                        })}
                    />
                </Col>

                {/* Form Column */}
                {(selectedItem || formMode === "add") && (
                    <Col span={10}>
                        <ItemForm
                            item={selectedItem || undefined}
                            mode={formMode}
                            onSave={handleSave}
                            onCancelEdit={handleCancelEdit}
                        />
                    </Col>
                )}
            </Row>
        </Card>
    );
};

export default ItemMasterPage;
