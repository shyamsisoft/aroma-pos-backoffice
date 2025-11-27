
import React from 'react';
import BranchView from '../components/BranchView';
import { Branch } from '../types';

interface BranchesPageProps {
    branches: Branch[];
    onSave: (branch: Branch) => void;
    onDelete: (id: string) => void;
}

const Branches: React.FC<BranchesPageProps> = (props) => {
  return <BranchView {...props} />;
};

export default Branches;
