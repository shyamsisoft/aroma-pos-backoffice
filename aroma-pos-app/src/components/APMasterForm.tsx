import React, { useEffect } from "react";
import { Form, Input, Modal } from "antd";

export interface APFormValues {
  key?: string;
  name: string;
  description: string;
}

interface ItemFormProps {
  open: boolean;
  mode: "add" | "edit";
  initialValues?: APFormValues;
  onCancel: () => void;
  onSubmit: (values: APFormValues) => void;
}

const APMasterForm: React.FC<ItemFormProps> = ({
  open,
  mode,
  initialValues,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues || { name: "", description: "" });
    }
  }, [open, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({ ...initialValues, ...values });
      form.resetFields();
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={mode === "add" ? "Add New Item" : "Edit Item"}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={mode === "add" ? "Save" : "Update"}
      cancelText="Cancel"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Item Name"
          name="name"
          rules={[{ required: true, message: "Please enter the item name" }]}
        >
          <Input placeholder="Enter item name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea rows={3} placeholder="Enter description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default APMasterForm;
