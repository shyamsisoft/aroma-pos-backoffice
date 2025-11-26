import React from 'react';
import EmployeesView from '../components/UsersView';
import { Activity } from '../types';

interface EmployeesPageProps {
    onLogActivity: (action: string, target: string) => void;
    activities: Activity[];
}

const Employees: React.FC<EmployeesPageProps> = ({ onLogActivity, activities }) => {
  return <EmployeesView onLogActivity={onLogActivity} activities={activities} />;
};

export default Employees;