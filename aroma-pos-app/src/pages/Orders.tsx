import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import OrderView from '../features/orders/components/OrderView';
import { Order } from '../shared/types';
import { orderService } from '../features/orders/api/order.service';

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await orderService.getOrders();
            setOrders(data);
        } catch (error) {
            message.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}><Spin size="large" /></div>;

    return <OrderView orders={orders} />;
};

export default Orders;