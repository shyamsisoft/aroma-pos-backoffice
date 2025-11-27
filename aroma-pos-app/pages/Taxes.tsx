
import React from 'react';
import TaxView from '../components/TaxView';
import { Tax } from '../types';

interface TaxesPageProps {
    taxes: Tax[];
    onSave: (tax: Tax) => void;
    onDelete: (id: string) => void;
}

const Taxes: React.FC<TaxesPageProps> = (props) => {
  return <TaxView {...props} />;
};

export default Taxes;
