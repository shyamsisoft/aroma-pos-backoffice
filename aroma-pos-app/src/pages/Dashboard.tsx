import React, { useEffect, useState } from "react";
import { Card, Button, Table, Row, Col, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import type FieldSchema from "../types/FieldSchema";
import ItemForm, { type ProductFormValues } from "../components/ItemForm";
import DynamicForm, { type DynamicFormValues } from "../components/APFormSection";

interface Product {
    id: string;
    name: string;
    category: string;
    unitPrice: number;
    description?: string;
}

const ItemMasterPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [itemsSchema, setItemsSchema] = useState<any[][]>([]);   // schema for each product
    const [apSchema, setAPSchema] = useState<FieldSchema[]>([]);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const [formMode, setFormMode] = useState<"view" | "edit" | "add">("view");


    useEffect(() => {
        fetch("/data/products.json")
            .then((res) => res.json())
            .then((json: any[][]) => {

                const mapped: Product[] = json.map((productFields, index) => {
                    const p: any = {};
                    productFields.forEach((field) => {
                        p[field.fieldname] = field.dataField;
                    });

                    return {
                        id: "P" + (index + 1).toString().padStart(3, "0"),
                        name: p.name,
                        category: p.category,
                        unitPrice: p.unitPrice,
                        description: p.description,
                    };
                });

                setProducts(mapped);
                setItemsSchema(json);     // keep raw schema for ItemForm
            })
            .catch((err) => console.error("Error loading products.json:", err));

        fetch("/data/status-details.json")
            .then((res) => res.json())
            .then((json: FieldSchema[]) => setAPSchema(json))
            .catch((err) => console.error("Error loading status-details.json:", err));
    }, []);

    const baseColumns: ColumnsType<Product> = [
        { title: "Name", dataIndex: "name", key: "name", width: "50%" },
        { title: "Category", dataIndex: "category", key: "category" },
        { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice" },
    ];

    const columns = selectedProduct || formMode === "add"
        ? baseColumns.slice(0, 1)   // show ONLY name column
        : baseColumns;              // show all columns normally



    const handleRowClick = (record: Product, index: number) => {
        setSelectedProduct(record);
        setSelectedIndex(index);
        setFormMode("view");
    };

    const handleAddNew = () => {
        setSelectedProduct(null);
        setSelectedIndex(null);
        setFormMode("add");
    };

    const handleSaveForm = (values: ProductFormValues) => {
        if (formMode === "add") {
            const newProduct: Product = {
                id: "P" + (products.length + 1).toString().padStart(3, "0"),
                name: values.name,
                category: values.category!,
                unitPrice: values.unitPrice!,
                description: values.description ?? "",
            };

            setProducts([...products, newProduct]);
            message.success("Product added!");
            setSelectedProduct(newProduct);
        }

        if (formMode === "edit" && selectedProduct) {
            const updated = products.map((p) =>
                p.id === selectedProduct.id ? { ...p, ...values } : p
            );
            setProducts(updated);
            message.success("Product updated!");
        }

        setFormMode("view");
    };

    const handleCancelEdit = () => {
        setFormMode("view");
    };

    const handleSaveAPForm = (values: DynamicFormValues) => {
        console.log("AP Saved:", values);
        message.success("AP section saved!");
    };

    const currentItemSchema =
        formMode === "add"
            ? [] // new item → empty schema
            : selectedIndex !== null
                ? itemsSchema[selectedIndex] || []
                : [];

    return (
        <Card
            className="product-master-card"
            title="Product Master"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                    Add New
                </Button>
            }
        >
            <Row gutter={16} style={{ flex: 1, minHeight: 0 }}>
                {/* LEFT PANEL (sticky) */}
                <Col
                    span={selectedProduct || formMode === "add" ? 6 : 24}
                    style={{
                        position: "sticky",
                        top: 56, // height of Card header
                        height: "calc(90vh - 56px)",
                        alignSelf: "flex-start",
                        borderRight: "1px solid #f0f0f0",
                        background: "white",
                        zIndex: 20,
                        paddingRight: 8,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden" // IMPORTANT: prevents column from scrolling
                    }}
                >
                    {/* Scrollable table */}
                    <div style={{ overflowY: "auto", flex: 1, maxHeight: 600 }}>
                        <Table
                            columns={columns}
                            dataSource={products}
                            pagination={false}
                            rowKey="id"
                            onRow={(record, index) => ({
                                onClick: () => handleRowClick(record, index!),
                                style: {
                                    cursor: "pointer",
                                    background:
                                        selectedProduct?.id === record.id ? "#f0f7ff" : undefined
                                }
                            })}
                            scroll={{
                                x: "max-content"
                            }}
                        />
                    </div>
                </Col>

                {/* RIGHT PANEL (scrollable) */}
                {(selectedProduct || formMode === "add") && (
                    <Col
                        span={18}
                        style={{
                            height: "calc(90vh - 56px)",
                            overflowY: "auto",
                            paddingLeft: 16
                        }}
                    >
                        {selectedProduct ? (
                            <div>
                                <h3>{selectedProduct.name}</h3>
                                <p>Category: {selectedProduct.category}</p>
                                <p>Price: {selectedProduct.unitPrice}</p>
                                <p>Description: {selectedProduct.description}</p>
                            </div>
                        ) : (
                            <div>Add new product form goes here</div>
                        )}

                        <ItemForm
                            item={selectedProduct || undefined}
                            mode={formMode}
                            onSave={handleSaveForm}
                            onCancelEdit={handleCancelEdit}
                            schema={currentItemSchema}
                        />

                        <DynamicForm
                            data={selectedProduct || undefined}
                            mode={formMode}
                            onSave={handleSaveAPForm}
                            onCancelEdit={() => { }}
                            schema={apSchema}
                        />
                    </Col>
                )}
            </Row>

            {/* Sticky Card header CSS */}
            <style>
                {`
                    .product-master-card {
                        height: 90vh;
                        display: flex;
                        flex-direction: column;
                    }

                    .product-master-card .ant-card-head {
                        position: sticky;
                        top: 0;
                        z-index: 100;
                        background: white;
                    }

                    .product-master-card .ant-card-body {
                        flex: 1;
                        min-height: 0;
                        padding: 16px;
                        overflow: hidden; /* prevents body scrolling */
                    }
                `}
            </style>
        </Card>
    );
};

export default ItemMasterPage;
