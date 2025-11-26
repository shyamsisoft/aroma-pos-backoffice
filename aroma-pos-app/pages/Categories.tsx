import React from 'react';
import CategoryView from '../components/CategoryView';
import { Category, Device } from '../types';

interface CategoriesProps {
    categories: Category[];
    devices: Device[];
    onSave: (cat: Category) => void;
    onDelete: (id: string) => void;
}

const Categories: React.FC<CategoriesProps> = (props) => {
  return <CategoryView {...props} />;
};

export default Categories;