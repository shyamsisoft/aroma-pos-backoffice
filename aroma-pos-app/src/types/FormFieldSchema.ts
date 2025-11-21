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








// export interface FormFieldValue {
//     formTitle: string;
//     sections: ItemSection[];


// }

// export interface ItemSection {
//     title: string;
//     fields: ItemField[];
// }

// export interface ItemField {
//     name: string;
//     label: string;
//     type: string;
//     value: string
// }

export interface EmployeeModel {
    department: string
    isPermanent: boolean
    salary: number
}