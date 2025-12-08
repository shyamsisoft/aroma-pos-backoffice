import React, { useState, useEffect } from 'react';
import { message, Modal, Spin } from 'antd';
import DeviceView from '../features/system/components/DeviceView';
import { Device } from '../shared/types';
import { DeviceSevices } from '../features/system/api/device.service';
import { showErrorMessage } from '../shared/types/ui/ErrorMessageModel';

const Devices: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Initialize Modal Hook
    const [popup, contextHolder] = Modal.useModal();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        // No try/catch needed here because DeviceSevices handles it
        const response = await DeviceSevices.getDevices();

        if (response.success && response.data) {
            // 2. Fix: Unwrap the data (response.data is the array, response is the wrapper)
            setDevices(response.data); 
        } else {
            showErrorMessage(popup, response.message, "Device Fetch Failed");
        }
        setLoading(false);
    };

    const handleSave = async (d: Device) => {
        // 3. Updated logic: Check .success instead of using try/catch
        const response = d.id 
            ? await DeviceSevices.updateDevice(d.id, d)
            : await DeviceSevices.createDevice(d);

        if (response.success) {
            message.success("Device saved successfully");
            fetchData();
        } else {
            showErrorMessage(popup, response.message, "Save Failed");
        }
    };

    const handleDelete = async (id: string) => {
        const response = await DeviceSevices.deleteDevice(id);

        if (response.success) {
            setDevices(prev => prev.filter(x => x.id !== id));
            message.success("Device deleted");
        } else {
            showErrorMessage(popup, response.message, "Delete Failed");
        }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}><Spin size="large" /></div>;

    return (
        <>
            {/* 4. Fix: Render the contextHolder here */}
            {contextHolder}
            
            <DeviceView 
                devices={devices}
                onSave={handleSave}
                onDelete={handleDelete}
            />
        </>
    );
};

export default Devices;