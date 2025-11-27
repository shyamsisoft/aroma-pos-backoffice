
import React from 'react';
import RolePermissionsView from '../components/RolePermissionsView';
import { Role } from '../types';

interface RolePermissionsPageProps {
    rolePermissions: Record<Role, string[]>;
    onSave: (permissions: Record<Role, string[]>) => void;
}

const RolePermissions: React.FC<RolePermissionsPageProps> = ({ rolePermissions, onSave }) => {
  return <RolePermissionsView rolePermissions={rolePermissions} onSave={onSave} />;
};

export default RolePermissions;
