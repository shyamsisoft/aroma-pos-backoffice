import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import EmployeesView from '../features/system/components/UsersView';
import { Activity, Branch, Employee } from '../shared/types';
import { systemService } from '../features/system/api/system.service';

const Employees: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [empData, branchData, actData] = await Promise.all([
                systemService.getEmployees(),
                systemService.getBranches(),
                systemService.getActivities()
            ]);
            setEmployees(empData);
            setBranches(branchData);
            setActivities(actData);
        } catch (error) {
            message.error("Failed to load employee data");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (emp: Employee) => {
        try {
            if (emp.id) await systemService.updateEmployee(emp.id, emp);
            else await systemService.createEmployee(emp);
            message.success("Employee saved");
            fetchData();
        } catch (e) { }
    };

    const handleDelete = async (id: string) => {
        try {
            await systemService.deleteEmployee(id);
            setEmployees(prev => prev.filter(x => x.id !== id));
            message.success("Employee deleted");
        } catch (e) { }
    };

    const handleLogActivity = (action: string, target: string) => {
        systemService.logActivity({ action, target, user: 'User' });
        const newAct: Activity = { 
            id: Date.now().toString(), 
            user: 'User', 
            action, 
            target, 
            time: new Date() 
        };
        setActivities(prev => [newAct, ...prev]);
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}><Spin size="large" /></div>;

    return (
        <EmployeesView 
            onLogActivity={handleLogActivity} 
            activities={activities} 
            branches={branches}
            employees={employees}
            onSave={handleSave}
            onDelete={handleDelete}
        />
    );
};

export default Employees;