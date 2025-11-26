import React from 'react';
import ActivityLogView from '../components/ActivityLogView';
import { Activity } from '../types';

interface ActivitiesPageProps {
    activities: Activity[];
}

const Activities: React.FC<ActivitiesPageProps> = ({ activities }) => {
  return <ActivityLogView activities={activities} />;
};

export default Activities;