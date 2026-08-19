export interface FoodItem {
  id: string;
  name: string;
  price: number;
  available: boolean;
  veg: boolean;
}

export interface CanteenCategory {
  id: string;
  category: string;
  items: FoodItem[];
}
