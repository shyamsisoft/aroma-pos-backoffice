import React, { useState } from "react";
import { Input, Table, Card, Space, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons";

interface GridLayoutProps<T> {
    title?: string;
    columns: ColumnsType<T>;
    data: T[];
    onSearch?: (value: string) => void;
    onRefresh?: () => void;
}

const APGridLayout = <T extends { key: React.Key }>({
    title,
    columns,
    data,
    onSearch,
    onRefresh,
}: GridLayoutProps<T>) => {
    const [searchText, setSearchText] = useState("");

    return (
        <Card
            title={title}
            style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            extra={
                <Button type="primary" icon={<PlusOutlined />} />
            }
        >
            <Space
                style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Input
                    placeholder="Search..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearchText(value);
                        onSearch?.(value); // ✅ triggers every time you type
                    }}
                    style={{ width: 250 }}
                    allowClear
                />
                <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                        setSearchText("");
                        onRefresh?.();
                    }}
                />
            </Space>

            <Table
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 10 }}
                bordered
                size="middle"
            />
        </Card>
    );
};

export default APGridLayout;
