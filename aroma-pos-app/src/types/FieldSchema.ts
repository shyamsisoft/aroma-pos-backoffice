export default interface FieldSchema {
    fieldName: string,
    label: string,
    type: string | number | boolean,
    dataField: string | number,
    validations: string[];
}

