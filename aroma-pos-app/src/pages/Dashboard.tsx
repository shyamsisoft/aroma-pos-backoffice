import React, { useEffect, useState } from "react";
import { Card, Button, Table, Row, Col, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import { type FormSchema, type ProductModel } from "../types/FormFieldSchema";
import FormComponent from "../components/FormComponent";



const ItemMasterPage: React.FC = () => {

    const [employeeSchema, setEmployeeSchema] = useState<FormSchema | null>(null);
    const [formValues, setFormValues] = useState<ProductModel[]>([])
    const [formMode, setFormMode] = useState<"view" | "edit" | "add">("view");


    const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);




    useEffect(() => {

        fetch("/data/FormValues.json")
            .then(res => res.json())
            .then((data) => { setFormValues(data) })
            .catch(err => console.error("Error fetching products:", err));

        fetch("/data/FormSchema.json")
            .then(res => res.json())
            .then(res => setEmployeeSchema(res))
            .catch(err => console.error("Error loading EmployeeFormSchema:", err));

    }, []);

    const baseColumns: ColumnsType<ProductModel> = [
        { title: "Name", dataIndex: "productName", key: "productName", width: "60%" },
        { title: "Category", dataIndex: "category", key: "category" },
        { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice" },

        {
            title: "Actions",
            key: "actions",
            width: "120px",
            render: (_, record, index) => (
                <div style={{ display: "flex", gap: 8 }}>

                    {/* EDIT BUTTON */}
                    <Button
                        type="primary"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation(); // prevent row click
                            handleRowClick(record, index);
                            setFormMode("edit");
                        }}
                    >
                        Edit
                    </Button>

                    {/* DELETE BUTTON */}
                    <Button
                        danger
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation(); // prevent row click
                            setSelectedIndex(index);
                            setSelectedProduct(record);
                            handleDelete();
                        }}
                    >
                        Delete
                    </Button>

                </div>
            ),
        },
    ];


    const columns =
        selectedProduct || formMode === "add"
            ? baseColumns.slice(0, 1) // shrink: only show name
            : baseColumns;

    const handleRowClick = (record: ProductModel, index: number) => {
        setSelectedProduct(record);
        setSelectedIndex(index);
        setFormMode("view");

    };

    const handleAddNew = () => {
        setSelectedProduct(null);
        setSelectedIndex(null);
        setFormMode("add");
    };



    const handleSaveProduct = (values: ProductModel) => {

        if (formMode === "add") {
            const newformValues: ProductModel = {
                //id: "P" + (products.length + 1).toString().padStart(3, "0"),
                productName: values.productName,
                category: values.category!,
                sku: values.sku!,
                unitPrice: values.unitPrice!,
                quantity: values.quantity!,
                isActive: values.isActive!,
                supplierName: values.supplierName!,
                supplierContact: values.supplierContact!,
                deliveryDays: values.deliveryDays!,
                description: values.description!,
                warranty: values.warranty!,
                launchDate: values.launchDate!
            };

            setFormValues(prev => [...prev, newformValues]);
            message.success("Product Added!");
            setSelectedProduct(newformValues);

            console.log("updated products");

            console.log(newformValues);

        }

        if (formMode === "edit" && selectedProduct) {
            const updated = formValues.map(p =>
                p.productName === selectedProduct.productName ? { ...p, ...values } : p
            );
            setFormValues(updated);
            message.success("Product Updated!");
        }

        setFormMode("view");
    };


    const handleCancel = () => {
        setFormMode("view");
        setSelectedProduct(null);


    }

    const handleDelete = () => {
        if (selectedIndex === null) return;

        const updatedList = formValues!.filter((_, index) => index !== selectedIndex);

        setFormValues(updatedList);
        setSelectedIndex(null);
        setSelectedProduct(null);
    };


    return (
        <Card
            title="Product Master"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                    Add New
                </Button>
            }

        >
            <Row gutter={16} style={{ flex: 1, minHeight: 0 }}>
                {/* LEFT PANEL */}
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
                    <div style={{ overflowY: "auto", flex: 1 }}>
                        <Table
                            columns={columns}
                            dataSource={formValues}
                            pagination={false}
                            rowKey="id"
                            onRow={(record, index) => ({
                                onClick: () => handleRowClick(record, index!),
                                style: {
                                    cursor: "pointer",
                                    background:
                                        selectedProduct?.productName === record.productName ? "#f0f7ff" : undefined
                                }
                            })}

                            scroll={{
                                x: "max-content",
                            }}

                        />

                    </div>
                </Col>

                {/* RIGHT PANEL */}
                {(selectedProduct || formMode === "add") && (
                    <Col
                        span={18}
                        style={{
                            height: "calc(90vh - 56px)",
                            overflowY: "auto",
                            paddingLeft: 16
                        }}
                    >
                        {/* EMPLOYEE SCHEMA FORM */}
                        {employeeSchema && (
                            <FormComponent
                                schema={employeeSchema}
                                mode={formMode}
                                onSave={handleSaveProduct}
                                onCancel={handleCancel}
                                onEdit={() => setFormMode("edit")}
                                data={formValues}
                                dataId={selectedProduct?.productName}
                                onDelete={handleDelete}
                            />
                        )}

                    </Col>


                )}
            </Row>

        </Card>
    );
};

export default ItemMasterPage;
