import React, { useState } from "react";
import { Card, Button, Table, Row, Col, Collapse } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import ItemForm, { type ItemFormValues } from "../components/ItemForm";
import APFormSection, { type APFormSectionValues } from "../components/APFormSection";

const { Panel } = Collapse;

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
        { key: "4", name: "Item D", description: "Fourth item" },
        { key: "5", name: "Item E", description: "Fifth item" },
        { key: "6", name: "Item F", description: "Sixth item" },
        { key: "7", name: "Item G", description: "Seventh item" },
        { key: "8", name: "Item H", description: "Eighth item" },
        { key: "9", name: "Item I", description: "Ninth item" },
        { key: "10", name: "Item J", description: "Tenth item" },
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

    const handleSaveForm = (values: ItemFormValues) => {
        if (formMode === "add") {
            const newItem: Item = {
                key: (data.length + 1).toString(),
                name: values.name,
                description: values.description,
            };
            setData([...data, newItem]);
            setSelectedItem(newItem);
        } else if (formMode === "edit" && values.key) {
            const updated = data.map((item) =>
                item.key === values.key ? { ...item, ...values } : item
            );
            setData(updated);
            setSelectedItem(values as Item);
        }
        setFormMode("view");
    };

    const handleSaveAPForm = (values: APFormSectionValues) => {
        console.log("AP Form Section Saved:", values);
    };

    const handleAddNew = () => {
        setSelectedItem(null);
        setFormMode("add");
    };

    const handleCancelEdit = () => {
        setSelectedItem(null);
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
                height: "92vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Row gutter={16} style={{ flex: 1, overflow: "hidden" }}>

                {/* LEFT PANEL (FIXED HEIGHT, NO PAGE SCROLL) */}
                <Col
                    span={selectedItem || formMode === "add" ? 5 : 24}
                    style={{
                        height: "100%",
                        overflow: "hidden",
                        borderRight: selectedItem ? "1px solid #f0f0f0" : undefined,
                        transition: "all 0.3s ease",
                    }}
                >
                    <Table
                        columns={selectedItem ? [{ title: "Name", dataIndex: "name" }] : columns}
                        dataSource={data}
                        pagination={false}
                        rowKey="key"
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                            style: {
                                cursor: "pointer",
                                background: selectedItem?.key === record.key ? "#f0f7ff" : undefined,
                            },
                        })}
                        scroll={{ y: "calc(92vh - 150px)" }} // table scrolls internally
                    />
                </Col>

                {/* RIGHT PANEL — SCROLLABLE */}
                {(selectedItem || formMode === "add") && (
                    <Col
                        span={19}
                        style={{
                            height: "100%",
                            overflow: "hidden",
                            paddingLeft: 16,
                        }}
                    >
                        <div
                            style={{
                                height: "calc(92vh - 150px)",
                                overflowY: "auto",
                                paddingRight: 12,
                            }}
                        >
                            <Collapse defaultActiveKey={["1"]} accordion>

                                <Panel header="Item Details" key="1">
                                    <ItemForm
                                        item={selectedItem || undefined}
                                        mode={formMode}
                                        onSave={handleSaveForm}
                                        onCancelEdit={handleCancelEdit}
                                    />
                                </Panel>
                                <Panel header="Additional Options" key="2">
                                    <APFormSection
                                        APFormSection={undefined}
                                        mode={"view"}
                                        onSave={handleSaveAPForm}
                                        onCancelEdit={() => { }}
                                    />
                                </Panel>

                            </Collapse>
                        </div>
                    </Col>
                )}
            </Row>
        </Card>
    );
};

export default ItemMasterPage;
