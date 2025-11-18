export default interface ItemSchema {
    fieldname: string,
    label: string,
    type: string,
    dataField: string | number,
    validations: string[];
}