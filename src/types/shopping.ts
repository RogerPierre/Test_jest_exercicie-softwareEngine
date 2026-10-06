export type ShoppingItem = {
  id: string;
  name: string;
  quantity: number;
  priceInCents: number;
  purchased: boolean;
};

export type ShoppingList = {
  budgetInCents: number;
  items: ShoppingItem[];
};
