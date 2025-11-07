import React, { useState } from "react";
import APGridLayout from "../components/APGridLayout";
import type { ColumnsType } from "antd/es/table";

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
}

const columns: ColumnsType<DataType> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Address", dataIndex: "address", key: "address" },
];

const initialData: DataType[] = [
    { key: "1", name: "John Brown", age: 32, address: "New York" },
    { key: "2", name: "Jim Green", age: 42, address: "London" },
    { key: "3", name: "Joe Black", age: 28, address: "Sydney" },
    { key: "4", name: "Jason White", age: 35, address: "Toronto" },
];

const CustomerPage: React.FC = () => {
    const [data, setData] = useState(initialData);

    const handleSearch = (value: string) => {
        const filtered = initialData.filter((item) =>
            item.name.toLowerCase().includes(value.toLowerCase())
        );
        setData(filtered);
    };

    const handleRefresh = () => setData(initialData);

    return (
        <APGridLayout
            title="Customer List"
            columns={columns}
            data={data}
            onSearch={handleSearch}
            onRefresh={handleRefresh}
        />
    );
};

export default CustomerPage;
