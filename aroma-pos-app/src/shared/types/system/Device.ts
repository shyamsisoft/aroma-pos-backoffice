import { DeviceStatus } from './DeviceStatus';
import { DeviceType } from './DeviceType';
import { DeviceProtocol } from './DeviceProtocol';

export interface Device {
  id: string;
  name: string;
  status: DeviceStatus;
  location?: string;
  serialNumber?: string;
  ipAddress?: string;
  port?: number;
  deviceTypeId?: string;
  deviceProtocolId?: string;
  type?: DeviceType;
  protocol?: DeviceProtocol;
}
