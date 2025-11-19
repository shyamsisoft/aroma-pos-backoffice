export default interface DasboadrdSchema {
    fieldName: string,
    fieldType: string,
    dataField: string | number | boolean | object | any[],
    isRequired: boolean,
    // label: string,
    // type: string | number | boolean,
    // dataField: string | number,
    // validations: string[];
}