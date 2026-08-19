import { Injectable, signal, computed } from '@angular/core';
import { FoodItem } from '../models/canteen.model';
import { CartItem, CanteenOrder } from '../models/canteen-order.model';

@Injectable({ providedIn: 'root' })
export class CanteenService {
  private readonly STORAGE_KEY = 'canteen_orders';

  // Shopping cart signal state
  cartItems = signal<CartItem[]>([]);

  // Computed totals
  cartCount = computed(() => this.cartItems().reduce((sum, item) => sum + item.quantity, 0));
  cartTotal = computed(() => this.cartItems().reduce((sum, item) => sum + item.foodItem.price * item.quantity, 0));

  addToCart(foodItem: FoodItem): void {
    const current = this.cartItems();
    const existingIndex = current.findIndex(i => i.foodItem.id === foodItem.id);

    if (existingIndex > -1) {
      const updated = [...current];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1
      };
      this.cartItems.set(updated);
    } else {
      this.cartItems.set([...current, { foodItem, quantity: 1 }]);
    }
  }

  removeFromCart(foodItemId: string): void {
    const current = this.cartItems();
    const existingIndex = current.findIndex(i => i.foodItem.id === foodItemId);

    if (existingIndex > -1) {
      const updated = [...current];
      if (updated[existingIndex].quantity > 1) {
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity - 1
        };
        this.cartItems.set(updated);
      } else {
        this.cartItems.set(current.filter(i => i.foodItem.id !== foodItemId));
      }
    }
  }

  getItemQuantity(foodItemId: string): number {
    const found = this.cartItems().find(i => i.foodItem.id === foodItemId);
    return found ? found.quantity : 0;
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  getOrders(): CanteenOrder[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  createOrder(orderData: Omit<CanteenOrder, 'id' | 'status' | 'orderTime' | 'estimatedTime'>): CanteenOrder {
    const orders = this.getOrders();
    const now = new Date();
    
    // Calculate estimated pickup/delivery time (approx 15-25 mins)
    const estDate = new Date(now.getTime() + 20 * 60000);
    const estTimeString = estDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: CanteenOrder = {
      ...orderData,
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      status: 'Preparing',
      orderTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + now.toLocaleDateString(),
      estimatedTime: estTimeString
    };

    orders.unshift(newOrder);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    this.clearCart();
    return newOrder;
  }

  cancelOrder(id: string): void {
    this.deleteOrder(id);
  }

  deleteOrder(id: string): void {
    const orders = this.getOrders().filter(o => o.id.toLowerCase() !== id.toLowerCase());
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
  }

  clearAllOrders(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
