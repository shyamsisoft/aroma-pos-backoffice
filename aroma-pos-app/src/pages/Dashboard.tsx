import { useEffect, useState, type JSX } from "react";

import { Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Modal } from "antd";

import { type FormSchema, type ProductModel } from "../types/FormFieldSchema";
import APGrid from "../components/APGrid";
import FormComponent from "../components/FormComponent";
import ListMasterDetailFormLayout from "../components/ListMasterDetailFormLayout";

const { confirm } = Modal;

function ItemMasterPage(): JSX.Element {

    const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
    const [formValues, setFormValues] = useState<ProductModel[]>([])
    const [formMode, setFormMode] = useState<"view" | "edit" | "add">("view");
    const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);

    useEffect(() => {

        fetch("/data/FormValues.json")
            .then(res => res.json())
            .then((data) => { setFormValues(data) })
            .catch(err => console.error("Error fetching products:", err));

        fetch("/data/FormSchema.json")
            .then(res => res.json())
            .then(res => setFormSchema(res))
            .catch(err => console.error("Error loading EmployeeFormSchema:", err));

    }, []);

    const columns: ColumnsType<ProductModel> = [
        { title: "Name", dataIndex: "productName", key: "productName", width: "60%" },
        { title: "Category", dataIndex: "category", key: "category" },
        { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice" },
        {
            title: "Actions",
            key: "actions",
            width: "120px",
            render: (item) => (
                <div style={{ display: "flex", gap: 8 }}>

                    <Button
                        className="lm-delete-btn"
                        type="primary"
                        danger
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item);
                        }}
                    >
                        Delete
                    </Button>


                </div>
            ),
        },
    ];

    const handleRowClick = (record: ProductModel) => {
        setSelectedProduct(record);
        setFormMode("view");
    };

    const handleAddNew = () => {
        setSelectedProduct(null);
        setFormMode("add");
    };

    function handleDelete(item: ProductModel | null) {
        confirm({
            title: "Do you want to delete this product?",
            content: `Product: ${item?.productName}`,
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                setFormValues(formValues.filter(formValue => formValue.productName !== item?.productName));
                setSelectedProduct(null);
            },
            onCancel() {
                console.log("Delete cancelled");
            },
        })
    }

    function handleSaveProduct(values: ProductModel) {
        if (formMode === "add") {
            const newformValues: ProductModel = {
                ...values
            };
            setFormValues(prev => [...prev, newformValues]);
            message.success("Product Added!");
            setSelectedProduct(newformValues);
        } else if (selectedProduct && formMode === "edit") {
            const updated = formValues.map(p =>
                p.productName === selectedProduct.productName ? { ...p, ...values } : p
            );
            setFormValues(updated);
            message.success("Product Updated!");
        }

        setFormMode("view");
    };

    function handleCancel() {
        setFormMode("view");
        setSelectedProduct(null);
    }

    return (

        <ListMasterDetailFormLayout pageTitle="ProductMaster" handleAddNew={handleAddNew}>

            <APGrid
                selectedProduct={selectedProduct}
                mode={formMode}
                formValues={formValues}
                baseColumns={columns}
                RowClick={(record) => { handleRowClick(record); }}
            />
            {(selectedProduct || formMode === "add") && (<FormComponent
                schema={formSchema}
                mode={formMode}
                data={formValues}
                dataId={selectedProduct?.productName}
                onSave={handleSaveProduct}
                onCancel={handleCancel}
                onEdit={() => setFormMode("edit")}
                onDelete={() => handleDelete(selectedProduct)}
            />)}

        </ListMasterDetailFormLayout>

    );
};

export default ItemMasterPage;
