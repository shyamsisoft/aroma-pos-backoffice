import React, { useEffect, useState } from "react";
import { Form, Input, Button, Space, Row, Col, Checkbox, Card, Collapse } from "antd";

export interface APFormSectionValues {
    key?: string;
    created?: string;
    createdDate?: string;
    completedDate?: string;
    status?: string;
    remarks?: string;
    // Additional Options
    createdDate1?: string;
    createdDate2?: string;
    createdDate3?: string;
    optionPaid?: boolean;
    optionNotify?: boolean;
    optionEmail?: boolean;
    optionOther?: boolean;
}

interface APFormSectionProps {
    APFormSection?: APFormSectionValues;
    mode: "view" | "edit" | "add";
    onSave: (values: APFormSectionValues) => void;
    onCancelEdit: () => void;
}

const { Panel } = Collapse;

const APFormSection: React.FC<APFormSectionProps> = ({
    APFormSection,
    onSave,
}) => {
    const [form] = Form.useForm();

    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [isEditingAdditional, setIsEditingAdditional] = useState(false);

    useEffect(() => {
        if (APFormSection) {
            form.setFieldsValue(APFormSection);
        } else {
            form.resetFields();
        }
    }, [APFormSection, form]);

    const saveSection = async () => {
        const values = await form.validateFields();
        onSave({ ...APFormSection, ...values });
        setIsEditingStatus(false);
        setIsEditingAdditional(false);
    };

    return (
        <Card
            style={{
                background: "#fff",
                borderRadius: 10,
                padding: 0,
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
        >
            <Collapse defaultActiveKey={["1"]}>
                <Panel header="Additional Options" key="1">
                    <Card style={{ padding: 20, borderRadius: 10 }}>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Created" name="created">
                                        <Input disabled={!isEditingAdditional} />
                                    </Form.Item>

                                    <Form.Item label="Created Date 1" name="createdDate1">
                                        <Input disabled={!isEditingAdditional} />
                                    </Form.Item>

                                    <Form.Item label="Created Date 2" name="createdDate2">
                                        <Input disabled={!isEditingAdditional} />
                                    </Form.Item>

                                    <Form.Item label="Created Date 3" name="createdDate3">
                                        <Input disabled={!isEditingAdditional} />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <div style={{ marginTop: 6 }}>
                                        <Checkbox name="optionPaid" disabled={!isEditingAdditional}>
                                            Mark invoice as paid
                                        </Checkbox>
                                    </div>

                                    <div style={{ marginTop: 15 }}>
                                        <Checkbox name="optionNotify" disabled={!isEditingAdditional}>
                                            Notify me when invoice is received
                                        </Checkbox>
                                    </div>

                                    <div style={{ marginTop: 15 }}>
                                        <Checkbox name="optionEmail" disabled={!isEditingAdditional}>
                                            Send email notification to supplier
                                        </Checkbox>
                                    </div>

                                    <div style={{ marginTop: 15 }}>
                                        <Checkbox name="optionOther" disabled={!isEditingAdditional}>
                                            Another checkbox
                                        </Checkbox>
                                    </div>
                                </Col>
                            </Row>

                            <Form.Item style={{ marginTop: 10 }}>
                                {isEditingAdditional ? (
                                    <Space>
                                        <Button type="primary" onClick={saveSection}>
                                            Save
                                        </Button>
                                        <Button onClick={() => setIsEditingAdditional(false)}>
                                            Cancel
                                        </Button>
                                    </Space>
                                ) : (
                                    <Button
                                        type="primary"
                                        onClick={() => setIsEditingAdditional(true)}
                                    >
                                        Edit
                                    </Button>
                                )}
                            </Form.Item>
                        </Form>
                    </Card>
                </Panel>

                <Panel header="Status Details" key="2">
                    <Card style={{ padding: 20, borderRadius: 10 }}>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Created" name="created">
                                        <Input disabled={!isEditingStatus} />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item label="Created Date" name="createdDate">
                                        <Input disabled={!isEditingStatus} />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item label="Completed Date" name="completedDate">
                                        <Input disabled={!isEditingStatus} />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item label="Status" name="status">
                                        <Input disabled={!isEditingStatus} />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item label="Remarks" name="remarks">
                                        <Input.TextArea disabled={!isEditingStatus} rows={4} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item style={{ marginTop: 10 }}>
                                {isEditingStatus ? (
                                    <Space>
                                        <Button type="primary" onClick={saveSection}>
                                            Save
                                        </Button>
                                        <Button onClick={() => setIsEditingStatus(false)}>
                                            Cancel
                                        </Button>
                                    </Space>
                                ) : (
                                    <Button type="primary" onClick={() => setIsEditingStatus(true)}>
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

export default APFormSection;
