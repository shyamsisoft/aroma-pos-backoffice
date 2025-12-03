export interface GeneratedMenuDetails {
  description: string;
  suggestedCategory: string;
  allergens: string;
}

export const generateMenuDetails = async (itemName: string, categoryName?: string): Promise<GeneratedMenuDetails | null> => {
    return null;
};