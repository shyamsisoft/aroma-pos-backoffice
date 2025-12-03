import React from 'react';
import DashboardView from '../components/DashboardView';
import { Activity } from '../../../shared/types';

interface DashboardPageProps {
    isDarkMode: boolean;
    activities: Activity[];
}

const Dashboard: React.FC<DashboardPageProps> = ({ isDarkMode, activities }) => {
  return <DashboardView isDarkMode={isDarkMode} activities={activities} />;
};

export default Dashboard;