import React from 'react';
import DeviceView from '../components/DeviceView';
import { Device } from '../../../shared/types';

interface DevicesProps {
    devices: Device[];
    onSave: (d: Device) => void;
    onDelete: (id: string) => void;
}

const Devices: React.FC<DevicesProps> = (props) => {
  return <DeviceView {...props} />;
};

export default Devices;