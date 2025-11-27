
import React from 'react';
import EmployeesView from '../components/UsersView';
import { Activity, Branch } from '../types';

interface EmployeesPageProps {
    onLogActivity: (action: string, target: string) => void;
    activities: Activity[];
    branches: Branch[];
}

const Employees: React.FC<EmployeesPageProps> = ({ onLogActivity, activities, branches }) => {
  return <EmployeesView onLogActivity={onLogActivity} activities={activities} branches={branches} />;
};

export default Employees;
