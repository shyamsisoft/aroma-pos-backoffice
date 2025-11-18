import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Space, Card } from "antd";
import type ItemSchema from "../types/ItemSchema";

export interface ProductFormValues {
    [field: string]: any; // Allow any dynamic field
}



interface ItemFormProps {
    schema: ItemSchema[];
    item?: ProductFormValues;
    mode: "view" | "edit" | "add";
    onSave: (values: ProductFormValues) => void;
    onCancelEdit: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ schema, item, mode, onSave, onCancelEdit }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(mode === "edit" || mode === "add");

    useEffect(() => {
        if (item) {
            form.setFieldsValue(item);
        } else {
            const initial: any = {};
            schema.forEach((f) => (initial[f.fieldname] = f.dataField));
            form.setFieldsValue(initial);
        }
    }, [item, schema, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            onSave(values);
            setIsEditing(false);
        } catch (err) {
            console.log("Validation failed:", err);
        }
    };

    return (
        <Card style={{ padding: 20, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Form form={form} layout="vertical" disabled={!isEditing && mode !== "add"}>
                {schema.map((field) => {
                    const rules =
                        field.validations?.map((rule) => {
                            if (rule === "required") return { required: true, message: `${field.label} is required` };
                            if (rule.startsWith("min:")) return { min: parseInt(rule.split(":")[1]), message: `${field.label} min value` };
                            return {};
                        }) || [];

                    switch (field.type) {
                        case "string":
                            return (
                                <Form.Item key={field.fieldname} label={field.label} name={field.fieldname} rules={rules}>
                                    <Input disabled={!isEditing} placeholder={`Enter ${field.label}`} />
                                </Form.Item>
                            );
                        case "number":
                            return (
                                <Form.Item key={field.fieldname} label={field.label} name={field.fieldname} rules={rules}>
                                    <InputNumber style={{ width: "100%" }} min={0} disabled={!isEditing} placeholder={`Enter ${field.label}`} />
                                </Form.Item>
                            );
                        case "boolean":
                            return (
                                <Form.Item key={field.fieldname} name={field.fieldname} valuePropName="checked">
                                    <Input type="checkbox" disabled={!isEditing} /> {field.label}
                                </Form.Item>
                            );
                        default:
                            return null;
                    }
                })}

                <Space style={{ marginTop: 16 }}>
                    {(isEditing || mode === "add") && (
                        <>
                            <Button type="primary" onClick={handleSave}>
                                Save
                            </Button>
                            <Button onClick={onCancelEdit}>Cancel</Button>
                        </>
                    )}
                    {!isEditing && mode !== "add" && (
                        <Button type="primary" onClick={() => setIsEditing(true)}>
                            Edit
                        </Button>
                    )}
                    {!isEditing && (
                        <Button onClick={onCancelEdit} style={{ marginLeft: 10 }}>
                            Back
                        </Button>
                    )}
                </Space>
            </Form>
        </Card>
    );
};

export default ItemForm;
