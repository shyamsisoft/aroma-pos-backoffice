import React, { useEffect, useState } from "react";
import { Form, Input, Button, Space, Row, Col, Checkbox, Card, Collapse, Select } from "antd";
import type Fieldschema from "../types/Fieldschema";

export interface DynamicFormValues {
    [field: string]: any;
}

interface DynamicFormProps {
    schema: Fieldschema[];
    data?: DynamicFormValues;
    mode: "view" | "edit" | "add";
    onSave: (values: DynamicFormValues) => void;
    onCancelEdit: () => void;
}

const { Panel } = Collapse;

const DynamicForm: React.FC<DynamicFormProps> = ({ schema, data, mode, onSave, onCancelEdit }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(mode === "edit" || mode === "add");

    useEffect(() => {
        if (data) {
            form.setFieldsValue(data);
        } else {
            const initial: DynamicFormValues = {};
            schema.forEach((f) => (initial[f.fieldName] = f.dataField ?? ""));
            form.setFieldsValue(initial);
        }
    }, [data, schema, form]);

    const save = async () => {
        try {
            const values = await form.validateFields();
            onSave(values);
            setIsEditing(false);
        } catch (err) {
            console.log("Validation failed:", err);
        }
    };

    const renderField = (field: Fieldschema) => {
        const rules =
            field.validations?.map((rule) => {
                if (rule === "required") return { required: true, message: `${field.label} is required` };
                if (rule.startsWith("min:")) return { min: parseInt(rule.split(":")[1]), message: `${field.label} min value` };
                return {};
            }) || [];

        switch (field.type) {
            case "string":
                return (
                    <Form.Item key={field.fieldName} label={field.label} name={field.fieldName} rules={rules}>
                        <Input disabled={!isEditing} placeholder={`Enter ${field.label}`} />
                    </Form.Item>
                );
            case "textarea":
                return (
                    <Form.Item key={field.fieldName} label={field.label} name={field.fieldName} rules={rules}>
                        <Input.TextArea disabled={!isEditing} rows={4} placeholder={`Enter ${field.label}`} />
                    </Form.Item>
                );
            case "boolean":
                return (
                    <Form.Item key={field.fieldName} name={field.fieldName} valuePropName="checked">
                        <Checkbox disabled={!isEditing}>{field.label}</Checkbox>
                    </Form.Item>
                );
            // case "select":
            //     return (
            //         <Form.Item key={field.fieldName} label={field.label} name={field.fieldName} rules={rules}>
            //             <Select disabled={!isEditing} placeholder={`Select ${field.label}`}>
            //                 {field.options?.map((opt) => (
            //                     <Select.Option key={opt} value={opt}>
            //                         {opt}
            //                     </Select.Option>
            //                 ))}
            //             </Select>
            //         </Form.Item>
            //     );
            default:
                return null;
        }
    };

    return (
        <Card style={{ background: "#fff", borderRadius: 10, padding: 0, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
            <Collapse defaultActiveKey={["1"]}>
                <Panel header="Details" key="1">
                    <Card style={{ padding: 20, borderRadius: 10 }}>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col span={24}>
                                    {schema.map((field) => renderField(field))}
                                </Col>
                            </Row>

                            <Form.Item>
                                {isEditing ? (
                                    <Space>
                                        <Button type="primary" onClick={save}>
                                            Save
                                        </Button>
                                        <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                                    </Space>
                                ) : (
                                    <Button type="primary" onClick={() => setIsEditing(true)}>
                                        Edit
                                    </Button>
                                )}
                            </Form.Item>
                        </Form>
                    </Card>
                </Panel>
            </Collapse>
        </Card>
    );
};

export default DynamicForm;
