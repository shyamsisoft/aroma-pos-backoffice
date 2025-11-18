import React from "react";

interface FieldSchema {
    fieldName: string;
    label: string;
    type: string;
    options?: string[];
    validations?: string[];
}

interface DynamicFormProps {
    schema: FieldSchema[];
    initialValues?: any;
    mode: "create" | "edit" | "view";
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
    schema,
    initialValues = {},
    mode,
    onSubmit,
    onCancel
}) => {
    const [formData, setFormData] = React.useState(initialValues);

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(formData);
            }}
        >
            {schema.map((field) => (
                <div key={field.fieldName} style={{ marginBottom: "10px" }}>
                    <label>{field.label}</label>

                    {/* Input Type: Text */}
                    {field.type === "string" && (
                        <input
                            type="text"
                            value={formData[field.fieldName] || ""}
                            onChange={(e) =>
                                handleChange(field.fieldName, e.target.value)
                            }
                            disabled={mode === "view"}
                        />
                    )}

                    {/* Input Type: Select */}
                    {field.type === "select" && (
                        <select
                            value={formData[field.fieldName] || ""}
                            onChange={(e) =>
                                handleChange(field.fieldName, e.target.value)
                            }
                            disabled={mode === "view"}
                        >
                            <option value="">Select...</option>
                            {field.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Input Type: Textarea */}
                    {field.type === "textarea" && (
                        <textarea
                            value={formData[field.fieldName] || ""}
                            onChange={(e) =>
                                handleChange(field.fieldName, e.target.value)
                            }
                            disabled={mode === "view"}
                        />
                    )}
                </div>
            ))}

            {mode !== "view" && (
                <button type="submit">Save</button>
            )}
            <button type="button" onClick={onCancel}>
                Cancel
            </button>
        </form>
    );
};

export default DynamicForm;
