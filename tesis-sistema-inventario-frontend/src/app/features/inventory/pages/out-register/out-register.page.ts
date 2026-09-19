import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { ProductService } from '../../../../core/services/product.service';
import { InventoryService } from '../../../../core/services/inventory.service';
import { Product } from '../../../../core/models/api.models';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-out-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgIconComponent],
  templateUrl: './out-register.page.html',
})
export class OutRegisterPage implements OnInit {
  readonly products     = signal<Product[]>([]);
  readonly loading      = signal(true);
  readonly saving       = signal(false);
  readonly success      = signal('');
  readonly error        = signal('');

  // Form Fields
  exitDate = new Date().toISOString().substring(0, 10);
  reason = 'Venta';
  customerName = '';

  // Product Selection & Search
  searchTerm = '';
  selectedProductId = '';

  // Exit Cart
  cart: CartItem[] = [];

  readonly cartTotal = computed(() => {
    return this.cart.reduce((total, item) => total + (item.quantity * item.product.salePrice), 0);
  });

  readonly cartTotalItems = computed(() => {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  });

  constructor(
    private readonly productSvc: ProductService,
    private readonly inventorySvc: InventoryService,
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.productSvc.getAll().subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  filteredProducts(): Product[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.products();
    return this.products().filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        (p.serialNumber && p.serialNumber.toLowerCase().includes(term))
    );
  }

  addToCart(product: Product) {
    if (!product || product.stock <= 0) return;

    const existingIndex = this.cart.findIndex((i) => i.product.id === product.id);
    if (existingIndex > -1) {
      if (this.cart[existingIndex].quantity < product.stock) {
        this.cart[existingIndex].quantity += 1;
      }
    } else {
      this.cart.push({ product, quantity: 1 });
    }
  }

  onSelectProduct() {
    if (!this.selectedProductId) return;
    const prod = this.products().find((p) => p.id === this.selectedProductId);
    if (prod) {
      this.addToCart(prod);
      this.selectedProductId = '';
    }
  }

  updateQuantity(index: number, newQty: number) {
    if (newQty <= 0) {
      this.removeFromCart(index);
      return;
    }
    const item = this.cart[index];
    if (newQty > item.product.stock) {
      item.quantity = item.product.stock;
    } else {
      item.quantity = newQty;
    }
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  clearCart() {
    this.cart = [];
  }

  hasStockIssue(): boolean {
    return this.cart.some((item) => item.quantity > item.product.stock || item.quantity <= 0);
  }

  confirmExit() {
    if (this.cart.length === 0 || this.saving() || this.hasStockIssue()) return;

    this.saving.set(true);
    this.error.set('');
    this.success.set('');

    const payload = {
      items: this.cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      reason: this.reason,
      customerName: this.customerName || undefined,
      exitDate: this.exitDate || undefined,
    };

    this.inventorySvc.quickExit(payload).subscribe({
      next: (res) => {
        this.saving.set(false);
        this.success.set(`✅ Salida registrada exitosamente. ${this.cartTotalItems()} producto(s) debitado(s) del inventario.`);
        this.cart = [];
        this.customerName = '';
        this.loadProducts(); // Refresh stocks
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.saving.set(false);
      },
    });
  }
}
