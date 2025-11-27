import React, { useEffect } from "react";
import { Form, Input, InputNumber, Button, Space, Card, Select, Radio, Checkbox, DatePicker, Collapse } from "antd";

import type { FormSchema, FormFieldSchema, ProductModel, SectionSchema } from "../types/FormFieldSchema";

const { Panel } = Collapse;

export interface FormValues {
    [field: string]: any;
}

export interface FormComponentProps {
    schema: FormSchema | null;
    values?: FormValues;
    data?: ProductModel[];
    dataId?: string;         // productName you want to load
    mode: "view" | "edit" | "add";
    onSave: (values: ProductModel) => void;
    onCancel: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onAddNew: () => void;

}

const FormComponent: React.FC<FormComponentProps> = ({ schema, onSave, onCancel, onDelete, onAddNew, data, dataId, mode, onEdit }) => {

    const [form] = Form.useForm();

    useEffect(() => {
        if (data && dataId) {
            const found = data.find(p => p.productName === dataId);


            if (found) {
                form.setFieldsValue(found);   // LOAD VALUES INTO FORM
            }
        }
    }, [data, dataId, form]);


    const renderField = (field: FormFieldSchema) => {
        switch (field.type) {
            case "text":
                return <Input placeholder={field.placeholder} disabled={mode == "view"} />;

            case "textarea":
                return <Input.TextArea rows={3} placeholder={field.placeholder} disabled={mode == "view"} />;

            case "number":
                return <InputNumber style={{ width: "100%" }} disabled={mode == "view"} />;

            case "email":
                return <Input type="email" placeholder={field.placeholder} disabled={mode == "view"} />;

            case "select":
                return (
                    <Select placeholder={field.placeholder} disabled={mode == "view"}>
                        {field.options?.map(op => (
                            <Select.Option key={op.value} value={op.value}>
                                {op.label}
                            </Select.Option>
                        ))}
                    </Select>
                );

            case "radio":
                return (
                    <Radio.Group disabled={mode == "view"}>
                        {field.options?.map(op => (
                            <Radio key={op.value} value={op.value}>
                                {op.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                );

            case "checkbox":
                return <Checkbox disabled={mode == "view"}>{field.label}</Checkbox>;

            case "Date":
                return <DatePicker style={{ width: "100%" }} disabled={mode == "view"} />;

            default:
                return <Input placeholder={field.placeholder} disabled={mode == "view"} />;
        }
    };

    const normalizeValidations = (rules: any[], fieldType: string) => {
        return rules.map(rule => {
            const newRule: any = { ...rule };


            if (fieldType === "text" || fieldType === "textarea") {

                // min -> convert to min length rule
                if (rule.min !== undefined) {
                    newRule.min = rule.min; // length validation
                    newRule.type = "string";
                }

                // max -> convert to max length rule
                if (rule.max !== undefined) {
                    newRule.max = rule.max;
                    newRule.type = "string";
                }

                // pattern rule
                if (rule.pattern) {
                    newRule.pattern = new RegExp(rule.pattern);
                }

                return newRule;
            }

            if (fieldType === "number") {
                newRule.type = "number";

                // Allow empty while typing
                newRule.transform = (value: any) =>
                    value === "" || value === null || value === undefined
                        ? undefined
                        : Number(value);

                return newRule;
            }

            if (fieldType === "date") {
                newRule.type = "date";
                return newRule;
            }


            if (fieldType === "checkbox" || fieldType === "select") {
                return newRule;
            }

            return newRule;
        });
    };

    function renderCollapse(field: FormFieldSchema): { key: string; label: React.ReactNode; children?: React.ReactNode } | null {
        if (!field) return null;
        return {
            key: field.name,
            label: field.label,
            children: (
                <div>
                    {/* Your fields */}
                </div>
            )
        };
    }
    return (
        <>

            <Card
                className="lm-card" title={`Details of : ${dataId}`} style={{ borderRadius: 5, fontWeight: 800, textShadow: "15px" }}>
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onSave}
                    className="lm-form"
                >
                    {/* {schema?.sections.map(section => ( */}
                    <Collapse
                        accordion
                        className="lm-collapse"
                        style={{ margin: -15 }}
                        defaultActiveKey={[schema ? schema.sections[0]?.title : "scmkey"]} // open first panel
                        items={schema?.sections.map(section => ({
                            key: section.title,
                            label: section.title,
                            children: (
                                section.fields.map(field => <Form.Item
                                    className="lm-form-item"
                                    key={field.name}
                                    label={field.type !== "checkbox" ? field.label : undefined}
                                    name={field.name}
                                    valuePropName={field.type === "checkbox" ? "checked" : "value"}
                                    rules={normalizeValidations(field.validations as any, field.type)}
                                >
                                    {renderField(field)}
                                </Form.Item>)
                            )
                        }))}
                    />

                    <Space className="lm-button-row" style={{ marginTop: 16 }}>
                        {mode === "view" && (
                            <>
                                <Button className="custom-btn lm-btn" type="primary" onClick={onEdit}>
                                    Edit
                                </Button>
                                <Button className="lm-btn-secondary" onClick={onCancel}>Cancel</Button>
                            </>
                        )}

                        {(mode === "edit" || mode === "add") && (
                            <>
                                <Button className="custom-btn lm-btn" type="primary" htmlType="submit">Save</Button>
                                <Button className="lm-btn-secondary" onClick={onCancel}>Cancel</Button>

                            </>
                        )}

                        {(mode != "add") && (
                            <Button className="lm-delete-btn" danger type="primary" style={{ marginLeft: 55 }} onClick={onDelete} >Delete Product</Button>
                        )}
                    </Space>
                </Form>
            </Card >
        </>

    );
};

export default FormComponent;
