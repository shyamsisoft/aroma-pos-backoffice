export interface FormFieldSchema {
    name: string;
    label: string;
    type: string;
    options?: { label: string; value: string }[];
    dataField: string;
    placeholder?: string;
    defaultValue?: any;
    validations?: {};
}

export interface SectionSchema {
    title: string;
    fields: FormFieldSchema[];
}

export interface FormSchema {
    formTitle: string;
    sections: SectionSchema[];
}

export interface ProductModel {
    productName: string
    category: string
    sku: string
    unitPrice: number
    quantity: number
    isActive: boolean
    supplierName: string
    supplierContact: number
    deliveryDays: number
    description: string
    warranty: number
    launchDate: Date
}