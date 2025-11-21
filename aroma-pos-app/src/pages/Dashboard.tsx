import React, { useEffect, useState } from "react";
import { Card, Button, Table, Row, Col, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import ItemForm, { type ProductFormValues } from "../components/ItemForm";
import DynamicForm, { type DynamicFormValues } from "../components/APFormSection";
import { type FormSchema, type EmployeeModel } from "../types/FormFieldSchema";
import FormComponent from "../components/FormComponent";

interface Product {
    id: string;
    name: string;
    category: string;
    unitPrice: number;
    description?: string;
}

const ItemMasterPage: React.FC = () => {

    const [products, setProducts] = useState<Product[]>([]);
    const [itemsSchema, setItemsSchema] = useState<any[][]>([]);
    // const [statusSchema, setStatusSchema] = useState<any[]>([]);
    const [employeeSchema, setEmployeeSchema] = useState<FormSchema | null>(null);
    const [formValues, setFormValues] = useState<EmployeeModel | undefined>()


    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [formMode, setFormMode] = useState<"view" | "edit" | "add">("view");


    useEffect(() => {
        fetch("/data/products.json")
            .then(res => res.json())
            .then((json: any[][]) => {
                const mapped: Product[] = json.map((recordFields, index) => {
                    const obj: any = {};
                    recordFields.forEach(field => {
                        obj[field.fieldname] = field.dataField;
                    });
                    return {
                        id: "P" + (index + 1).toString().padStart(3, "0"),
                        name: obj.name,
                        category: obj.category,
                        unitPrice: obj.unitPrice,
                        description: obj.description
                    };
                });

                setProducts(mapped);
                setItemsSchema(json);
            })
            .catch(err => console.error("Error loading products:", err));

        // fetch("/data/status-details.json")
        //     .then(res => res.json())
        //     .then(setStatusSchema)
        //     .catch(err => console.error("Error loading status-details:", err));

        fetch("/data/FormSchema.json")
            .then(res => res.json())
            .then(res => setEmployeeSchema(res))
            .catch(err => console.error("Error loading EmployeeFormSchema:", err));

        fetch("/data/FormValues.json")
            .then(res => res.json())
            .then(res => setFormValues(res))
            .catch(err => console.error("Error loading Values:", err));


    }, []);


    const baseColumns: ColumnsType<Product> = [
        { title: "Name", dataIndex: "name", key: "name", width: "60%" },
        { title: "Category", dataIndex: "category", key: "category" },
        { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice" }
    ];

    const columns =
        selectedProduct || formMode === "add"
            ? baseColumns.slice(0, 1) // shrink: only show name
            : baseColumns;

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

    const handleSaveProduct = (values: ProductFormValues) => {
        if (formMode === "add") {
            const newProduct: Product = {
                id: "P" + (products.length + 1).toString().padStart(3, "0"),
                name: values.name,
                category: values.category!,
                unitPrice: values.unitPrice!,
                description: values.description ?? ""
            };
            setProducts(prev => [...prev, newProduct]);
            message.success("Product added!");
            setSelectedProduct(newProduct);
        }

        if (formMode === "edit" && selectedProduct) {
            const updated = products.map(p =>
                p.id === selectedProduct.id ? { ...p, ...values } : p
            );
            setProducts(updated);
            message.success("Product updated!");
        }

        setFormMode("view");
    };

    const handleSaveAP = (values: DynamicFormValues) => {
        console.log("AP Saved:", values);
        message.success("AP saved!");
    };

    const handleCancel = () => setFormMode("view");

    const currentItemSchema =
        formMode === "add"
            ? []
            : selectedIndex !== null
                ? itemsSchema[selectedIndex]
                : [];


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
                        borderRight: "1px solid #eee",
                        transition: "all 0.3s ease",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <div style={{ flex: 1, overflowY: "auto" }}>
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
                        />
                    </div>
                </Col>

                {/* RIGHT PANEL */}
                {(selectedProduct || formMode === "add") && (
                    <Col
                        span={18}
                        style={{ height: "100%", overflowY: "auto", paddingLeft: 16 }}
                    >
                        {/* EMPLOYEE SCHEMA FORM */}
                        {employeeSchema && (
                            <FormComponent
                                schema={employeeSchema}
                                onSave={(data) => console.log("ERP Saved:", data)}
                                onCancel={() => console.log("ERP Cancelled")}
                                data={formValues}
                            />
                        )}

                    </Col>
                )}
            </Row>
        </Card>
    );
};

export default ItemMasterPage;
