import { FoodItem } from './canteen.model';

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

export interface CanteenOrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CanteenOrder {
  id: string;
  items: CanteenOrderItem[];
  totalAmount: number;
  studentName: string;
  registerNumber: string;
  phone: string;
  orderType: 'Takeaway' | 'Dine-In' | 'Hostel Delivery';
  paymentMethod: 'UPI' | 'Campus Card' | 'Cash on Delivery';
  status: 'Received' | 'Preparing' | 'Ready for Pickup' | 'Completed' | 'Cancelled';
  orderTime: string;
  estimatedTime: string;
}
