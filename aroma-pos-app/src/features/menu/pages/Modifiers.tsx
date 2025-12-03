import React from 'react';
import ModifierView from '../components/ModifierView';
import { ModifierGroup, ModifierItem } from '../../../shared/types';

interface ModifiersProps {
    groups: ModifierGroup[];
    onSave: (g: ModifierGroup) => void;
    onDelete: (id: string) => void;
    // New props for managing individual items
    modifierItems: ModifierItem[];
    onSaveItem: (item: ModifierItem) => void;
    onDeleteItem: (id: string) => void;
}

const Modifiers: React.FC<ModifiersProps> = ({ 
    groups, 
    onSave, 
    onDelete,
    modifierItems,
    onSaveItem,
    onDeleteItem
}) => {
  return (
    <ModifierView 
        groups={groups} 
        onSaveGroup={onSave} 
        onDeleteGroup={onDelete}
        items={modifierItems}
        onSaveItem={onSaveItem}
        onDeleteItem={onDeleteItem}
    />
  );
};

export default Modifiers;