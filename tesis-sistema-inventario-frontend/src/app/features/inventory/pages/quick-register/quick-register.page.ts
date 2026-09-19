import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { ProductService } from '../../../../core/services/product.service';
import { InventoryService } from '../../../../core/services/inventory.service';
import { Product } from '../../../../core/models/api.models';

interface QuickItem {
  productId: string;
  quantity: number;
  productName: string;
  currentStock: number;
}

@Component({
  selector: 'app-quick-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgIconComponent],
  templateUrl: './quick-register.page.html',
})
export class QuickRegisterPage implements OnInit {
  readonly products = signal<Product[]>([]);
  readonly loading  = signal(true);
  readonly saving   = signal(false);
  readonly success  = signal('');
  readonly error    = signal('');

  items: QuickItem[] = [{ productId: '', quantity: 1, productName: '', currentStock: 0 }];
  reason = 'Entrada de mercadería';

  constructor(
    private readonly productSvc: ProductService,
    private readonly inventorySvc: InventoryService,
  ) {}

  ngOnInit() {
    this.productSvc.getAll().subscribe({
      next: (res) => { this.products.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onProductSelect(index: number) {
    const item = this.items[index];
    const product = this.products().find((p) => p.id === item.productId);
    if (product) {
      item.productName   = product.name;
      item.currentStock  = product.stock;
    }
  }

  addRow() {
    this.items.push({ productId: '', quantity: 1, productName: '', currentStock: 0 });
  }

  removeRow(i: number) {
    this.items.splice(i, 1);
  }

  register() {
    const validItems = this.items.filter((i) => i.productId && i.quantity > 0);
    if (validItems.length === 0 || this.saving()) return;

    this.saving.set(true);
    this.error.set('');
    this.success.set('');

    this.inventorySvc.quickRegister({
      items: validItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      reason: this.reason,
    }).subscribe({
      next: (res) => {
        this.saving.set(false);
        this.success.set(`✅ ${(res.data as any[]).length} producto(s) registrado(s) exitosamente.`);
        this.items = [{ productId: '', quantity: 1, productName: '', currentStock: 0 }];
        // Refresh product list to show updated stocks
        this.productSvc.getAll().subscribe((r) => this.products.set(r.data));
      },
      error: (err: Error) => { this.error.set(err.message); this.saving.set(false); },
    });
  }
}
