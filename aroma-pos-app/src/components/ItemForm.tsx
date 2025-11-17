import React, { useEffect, useState } from "react";
import { Form, Input, Button, Space } from "antd";

export interface ItemFormValues {
    key?: string;
    name: string;
    description: string;
}

interface ItemFormProps {
    item?: ItemFormValues;
    mode: "view" | "edit" | "add";
    onSave: (values: ItemFormValues) => void;
    onCancelEdit: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({
    item,
    mode,
    onSave,
    onCancelEdit,
}) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(mode === "edit");

    useEffect(() => {
        if (item) {
            form.setFieldsValue(item);
        } else {
            form.resetFields();
        }
    }, [item, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            onSave({ ...item, ...values });
            setIsEditing(false);
        } catch (err) {
            console.log("Validation failed:", err);
        }
    };

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                height: "100%",
            }}
        >
            <h3 style={{ marginBottom: 20 }}>
                {mode === "add"
                    ? "Add New Item"
                    : isEditing
                        ? "Edit Item"
                        : "Item Details"}
            </h3>

            <Form form={form} layout="vertical" disabled={!isEditing && mode !== "add"}>
                <Form.Item
                    label="Item Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter item name" }]}
                >
                    <Input placeholder="Enter item name" />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Please enter description" }]}
                >
                    <Input.TextArea rows={3} placeholder="Enter description" />
                </Form.Item>

                <Space>
                    {isEditing || mode === "add" ? (
                        <>
                            <Button type="primary" onClick={handleSave}>
                                Save
                            </Button>
                            <Button onClick={onCancelEdit}>Cancel</Button>
                        </>
                    ) : (
                        <Button type="primary" onClick={() => setIsEditing(true)}>
                            Edit
                        </Button>

                    )}

                </Space>
                <Button disabled={isEditing} onClick={onCancelEdit}>Back</Button>
            </Form>
        </div>
    );
};

export default ItemForm;
