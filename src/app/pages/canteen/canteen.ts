import { Component, OnInit, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Hero } from '../../components/hero/hero';
import { SectionTitle } from '../../components/section-title/section-title';
import { DataService } from '../../services/data.service';
import { CanteenService } from '../../services/canteen.service';
import { CanteenCategory, FoodItem } from '../../models/canteen.model';
import { CanteenOrder } from '../../models/canteen-order.model';

@Component({
  selector: 'app-canteen',
  imports: [Hero, SectionTitle, DecimalPipe, FormsModule],
  templateUrl: './canteen.html',
  styleUrl: './canteen.css'
})
export class Canteen implements OnInit {
  categories = signal<CanteenCategory[]>([]);
  myOrders = signal<CanteenOrder[]>([]);
  activeTab = signal<'menu' | 'orders'>('menu');

  // Filters & Search
  dietaryFilter = signal<'all' | 'veg' | 'nonveg'>('all');
  searchQuery = signal<string>('');

  // Modals & Drawers
  showCartDrawer = signal(false);
  showCheckoutModal = signal(false);
  showOrderSuccessModal = signal(false);
  showQrModal = signal(false);
  selectedQrOrder = signal<CanteenOrder | null>(null);
  lastOrder = signal<CanteenOrder | null>(null);

  // Form Fields
  formName = '';
  formRegNo = '';
  formPhone = '';
  orderType: 'Takeaway' | 'Dine-In' | 'Hostel Delivery' = 'Takeaway';
  paymentMethod: 'UPI' | 'Campus Card' | 'Cash on Delivery' = 'UPI';

  constructor(
    private data: DataService,
    public canteenService: CanteenService
  ) {}

  ngOnInit() {
    this.data.getCanteen().subscribe(c => this.categories.set(c));
    this.loadOrders();
  }

  loadOrders() {
    this.myOrders.set(this.canteenService.getOrders());
  }

  setTab(tab: 'menu' | 'orders') {
    this.activeTab.set(tab);
    if (tab === 'orders') {
      this.loadOrders();
    }
  }

  setDietaryFilter(filter: 'all' | 'veg' | 'nonveg') {
    this.dietaryFilter.set(filter);
  }

  filteredCategories = computed(() => {
    const filter = this.dietaryFilter();
    const query = this.searchQuery().toLowerCase().trim();

    return this.categories().map(cat => {
      const items = cat.items.filter(item => {
        const matchesFilter = filter === 'all' || (filter === 'veg' && item.veg) || (filter === 'nonveg' && !item.veg);
        const matchesQuery = !query || item.name.toLowerCase().includes(query);
        return matchesFilter && matchesQuery;
      });
      return { ...cat, items };
    }).filter(cat => cat.items.length > 0);
  });

  addToCart(item: FoodItem) {
    if (!item.available) return;
    this.canteenService.addToCart(item);
  }

  removeFromCart(itemId: string) {
    this.canteenService.removeFromCart(itemId);
  }

  getItemQuantity(itemId: string): number {
    return this.canteenService.getItemQuantity(itemId);
  }

  openCheckout() {
    if (this.canteenService.cartCount() === 0) return;
    this.formName = '';
    this.formRegNo = '';
    this.formPhone = '';
    this.orderType = 'Takeaway';
    this.paymentMethod = 'UPI';
    this.showCheckoutModal.set(true);
    this.showOrderSuccessModal.set(false);
  }

  closeCheckout() {
    this.showCheckoutModal.set(false);
    this.showOrderSuccessModal.set(false);
    this.lastOrder.set(null);
  }

  openQrModal(order: CanteenOrder) {
    this.selectedQrOrder.set(order);
    this.showQrModal.set(true);
  }

  closeQrModal() {
    this.showQrModal.set(false);
    this.selectedQrOrder.set(null);
  }

  isFormValid(): boolean {
    return this.formName.trim().length > 0 &&
           this.formRegNo.trim().length > 0 &&
           this.formPhone.trim().length > 0;
  }

  submitOrder() {
    if (!this.isFormValid() || this.canteenService.cartCount() === 0) return;

    const cartItems = this.canteenService.cartItems();
    const items = cartItems.map(ci => ({
      itemId: ci.foodItem.id,
      name: ci.foodItem.name,
      price: ci.foodItem.price,
      quantity: ci.quantity
    }));

    const newOrder = this.canteenService.createOrder({
      items,
      totalAmount: this.canteenService.cartTotal(),
      studentName: this.formName.trim(),
      registerNumber: this.formRegNo.trim(),
      phone: this.formPhone.trim(),
      orderType: this.orderType,
      paymentMethod: this.paymentMethod
    });

    this.lastOrder.set(newOrder);
    this.showOrderSuccessModal.set(true);
    this.loadOrders();
  }

  cancelOrder(id: string) {
    if (confirm('Are you sure you want to cancel this canteen order?')) {
      this.canteenService.cancelOrder(id);
      this.loadOrders();
    }
  }

  deleteOrder(id: string) {
    if (confirm(`Are you sure you want to remove order ${id}?`)) {
      this.canteenService.deleteOrder(id);
      this.loadOrders();
    }
  }

  clearAllOrders() {
    if (confirm('Are you sure you want to clear all canteen order records?')) {
      this.canteenService.clearAllOrders();
      this.loadOrders();
    }
  }

  downloadOrderHistory() {
    const orders = this.myOrders();
    if (orders.length === 0) return;

    const headers = ['Order ID', 'Order Time', 'Student Name', 'Reg No', 'Order Type', 'Payment Method', 'Items Summary', 'Total Amount (INR)', 'Status'];
    const rows = orders.map(o => {
      const itemsSummary = o.items.map(i => `${i.quantity}x ${i.name}`).join('; ');
      return [
        o.id,
        `"${o.orderTime}"`,
        `"${o.studentName}"`,
        `"${o.registerNumber}"`,
        `"${o.orderType}"`,
        `"${o.paymentMethod}"`,
        `"${itemsSummary}"`,
        o.totalAmount,
        o.status
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    this.triggerDownload(csvContent, 'Canteen_Order_History.csv');
  }

  private triggerDownload(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
