import React from 'react';
import ModifierView from '../components/ModifierView';
import { ModifierGroup } from '../types';

interface ModifiersProps {
    groups: ModifierGroup[];
    onSave: (g: ModifierGroup) => void;
    onDelete: (id: string) => void;
}

const Modifiers: React.FC<ModifiersProps> = (props) => {
  return <ModifierView {...props} />;
};

export default Modifiers;