import React, { useEffect, useState } from "react";
import { Card, Button, Table, Row, Col, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import ItemForm, { type ProductFormValues } from "../components/ItemForm";
import DynamicForm, { type DynamicFormValues } from "../components/APFormSection";
import type ItemSchema from "../types/ItemSchema";
import type FieldSchema from "../types/Fieldschema";

interface Product {
    id: string;
    name: string;
    category: string;
    unitPrice: number;
}

interface productDisplay {
    id: string;
    name: string;
    category: string;
    unitPrice: number;
    description: string;
}

const ItemMasterPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [itemSchema, setItemSchema] = useState<ItemSchema[]>([]);
    const [apSchema, setAPSchema] = useState<FieldSchema[]>([]);
    const [formMode, setFormMode] = useState<"view" | "edit" | "add">("view");
    const [displayProducts, setDisplayProducts] = useState<productDisplay[]>([]);

    // Fetch products and schemas
    useEffect(() => {
        fetch("public/data/products.json")
            .then((res) => res.json())
            .then((json) => setProducts(json))
            .catch((err) => console.error("Error loading products.json:", err));

        fetch("public/data/status-details.json")
            .then((res) => res.json())
            .then((json) => setAPSchema(json))
            .catch((err) => console.error("Error loading status-details.json:", err));

        fetch("public/data/prod.json")
            .then((res) => res.json())
            .then((json) => setDisplayProducts(json))
            .catch((err) => console.error("Error loading prod.json:", err));

        // Optional: define ItemForm schema dynamically
        const productFormSchema: ItemSchema[] = [
            { fieldname: "name", label: "Name", type: "string", dataField: "", validations: ["required"] },
            { fieldname: "category", label: "Category", type: "string", dataField: "", validations: ["required"] },
            { fieldname: "unitPrice", label: "Unit Price", type: "number", dataField: 0, validations: ["required", "min:0"] },
        ];
        setItemSchema(productFormSchema);
    }, []);

    const columns: ColumnsType<Product> = [
        { title: "Name", dataIndex: "name", key: "name", width: "40%" },
        { title: "Category", dataIndex: "category", key: "category" },
        { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice" },
    ];

    const handleRowClick = (record: Product) => {
        setSelectedProduct(record);
        setFormMode("view");
    };

    const handleSaveForm = (values: ProductFormValues) => {
        if (formMode === "add") {
            const newProduct: Product = {
                id: "P" + (products.length + 1).toString().padStart(3, "0"),
                name: values.name,
                category: values.category!,
                unitPrice: values.unitPrice!,
            };
            setProducts([...products, newProduct]);
            setSelectedProduct(newProduct);
            message.success("Product added successfully!");
        } else if (formMode === "edit" && selectedProduct) {
            const updated = products.map((p) =>
                p.id === selectedProduct.id ? { ...p, ...values } : p
            );
            setProducts(updated);
            setSelectedProduct({ ...selectedProduct, ...values });
            message.success("Product updated successfully!");
        }
        setFormMode("view");
    };

    const handleAddNew = () => {
        setSelectedProduct(null);
        setFormMode("add");
    };

    const handleCancelEdit = () => {
        setSelectedProduct(null);
        setFormMode("view");
    };

    const handleSaveAPForm = (values: DynamicFormValues) => {
        console.log("AP Section Saved:", values);
        message.success("AP section saved!");
    };

    return (
        <Card
            title="Product Master"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                    Add New
                </Button>
            }
            style={{ height: "92vh", display: "flex", flexDirection: "column" }}
        >
            <Row gutter={16} style={{ flex: 1, overflow: "hidden" }}>
                {/* LEFT PANEL */}
                <Col
                    span={selectedProduct || formMode === "add" ? 6 : 24}
                    style={{
                        height: "100%",
                        overflow: "hidden",
                        borderRight: selectedProduct ? "1px solid #f0f0f0" : undefined,
                        transition: "all 0.3s ease",
                    }}
                >
                    <Table
                        columns={columns}
                        dataSource={displayProducts}
                        pagination={false}
                        rowKey="id"
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                            style: {
                                cursor: "pointer",
                                background:
                                    selectedProduct?.id === record.id ? "#f0f7ff" : undefined,
                            },
                        })}
                        scroll={{ y: "calc(92vh - 150px)" }}
                    />
                </Col>

                {/* RIGHT PANEL */}
                {(selectedProduct || formMode === "add") && (
                    <Col span={18} style={{ height: "100%", overflow: "hidden", paddingLeft: 16 }}>
                        <div
                            style={{
                                height: "calc(92vh - 150px)",
                                overflowY: "auto",
                                paddingRight: 12,
                            }}
                        >
                            {/* Product Form */}
                            {itemSchema.length > 0 && (
                                <ItemForm
                                    item={selectedProduct || undefined}
                                    mode={formMode}
                                    onSave={handleSaveForm}
                                    onCancelEdit={handleCancelEdit}
                                    schema={itemSchema}
                                />
                            )}

                            {/* AP Section */}
                            {apSchema.length > 0 && (
                                <DynamicForm
                                    data={selectedProduct || undefined}
                                    mode={formMode}
                                    onSave={handleSaveAPForm}
                                    onCancelEdit={() => { }}
                                    schema={apSchema}
                                />
                            )}
                        </div>
                    </Col>
                )}
            </Row>
        </Card>
    );
};

export default ItemMasterPage;
