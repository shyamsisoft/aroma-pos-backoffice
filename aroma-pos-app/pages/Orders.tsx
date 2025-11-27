
import React from 'react';
import OrderView from '../components/OrderView';
import { Order } from '../types';

interface OrdersPageProps {
    orders: Order[];
}

const Orders: React.FC<OrdersPageProps> = ({ orders }) => {
  return <OrderView orders={orders} />;
};

export default Orders;
