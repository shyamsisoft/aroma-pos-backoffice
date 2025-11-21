import React from "react";
import { Form, Input, InputNumber, Button, Space, Card, Select, Radio, Checkbox, DatePicker, } from "antd";
import type { FormSchema, FormFieldSchema, EmployeeModel } from "../types/FormFieldSchema";



export interface FormValues {
    [field: string]: any;
}

export interface FormComponentProps {
    schema: FormSchema;
    values?: FormValues;
    data?: EmployeeModel;
    onSave: (values: FormValues) => void;
    onCancel: () => void;
}


const FormComponent: React.FC<FormComponentProps> = ({ schema, onSave, onCancel, data }) => {
    const [form] = Form.useForm();


    const renderField = (field: FormFieldSchema) => {
        console.log(data);

        switch (field.type) {
            case "text":
                return <Input placeholder={field.placeholder} />;

            case "textarea":
                return <Input.TextArea rows={3} placeholder={field.placeholder} />;

            case "number":

                return <InputNumber style={{ width: "100%" }} />;

            case "email":
                return <Input type="email" placeholder={field.placeholder} />;

            case "select":
                return (
                    <Select placeholder={field.placeholder}>
                        {field.options?.map((op) => (
                            <Select.Option key={op.value} value={op.value}>
                                {op.label}
                            </Select.Option>
                        ))}
                    </Select>
                );

            case "radio":
                return (
                    <Radio.Group>
                        {field.options?.map((op) => (
                            <Radio key={op.value} value={op.value}>
                                {op.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                );

            case "checkbox":
                return <Checkbox>{field.label}</Checkbox>;

            case "date":
                return <DatePicker style={{ width: "100%" }} />;

            default:
                return <Input placeholder={field.placeholder} />;
        }
    };

    // const dataField = (field: FormFieldSchema) => {
    //     field.dataField = 

    // };

    return (
        <Card
            title={schema.formTitle}
            style={{ padding: 20, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
            <Form layout="vertical" form={form} onFinish={onSave} initialValues={data}>
                {schema.sections.length !== 0 && schema.sections.map(section => (
                    <Card
                        key={section.title}
                        title={section.title}
                        size="small"
                        style={{ marginBottom: 20, borderRadius: 8 }}
                    >
                        {section.fields.map(function mapFields(field) {
                            //const dataSection = data.sections.filter(sec => sec.title === section.title)
                            //console.log("datasection begin");

                            //console.log(dataSection);
                            //console.log("datasection end");

                            //console.log("currentDataField begin");
                            //const [currentDataField] = dataSection[0].fields.filter(fld => fld.name === field.name)
                            //console.log(currentDataField)
                            //console.log("currentDataField end");
                            return <Form.Item
                                key={field.name}
                                label={field.type !== "checkbox" ? field.label : undefined}
                                name={field.name}
                                valuePropName={field.type == "checkbox" ? "checked" : "value"}

                            >
                                {renderField(field)}
                            </Form.Item>
                        })}
                    </Card>
                ))}

                <Space style={{ marginTop: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </Space>
            </Form>
        </Card>
    );
};

export default FormComponent;
