import { TicketModifier } from './TicketModifier';
import { TicketVariant } from './TicketVariant';
import { TicketTax } from './TicketTax';

export interface TicketItem {
    id: string;
    itemId: string;
    name: string;
    quantity: number;
    price: number;
    portion: number;
    discount: number;
    isDiscountPercentage: boolean;
    modifiers: TicketModifier[];
    variant?: TicketVariant;
    taxes: TicketTax[];
}
