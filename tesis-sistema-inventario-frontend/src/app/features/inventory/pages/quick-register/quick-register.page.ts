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
  /** Texto escrito en el buscador de la fila */
  term: string;
  options: Product[];
  requestNumber: number;
}

/** Pasa a minúsculas y quita tildes para comparar sin distinguirlas */
const normalize = (s: string | null | undefined) =>
  (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const emptyItem = (): QuickItem => ({ productId: '', quantity: 1, productName: '', currentStock: 0, term: '', options: [], requestNumber: 0 });

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

  items: QuickItem[] = [emptyItem()];
  reason = 'Entrada de mercadería';

  constructor(
    private readonly productSvc: ProductService,
    private readonly inventorySvc: InventoryService,
  ) {}

  ngOnInit() {
    this.loading.set(false);
    this.onSearch(0);
  }

  onProductSelect(index: number) {
    const item = this.items[index];
    const product = item.options.find((p) => p.id === item.productId);
    if (product) {
      item.productName   = product.name;
      item.currentStock  = product.stock;
    }
  }

  /**
   * Productos que coinciden con el buscador de la fila (nombre, marca, modelo o serie),
   * sin distinguir mayúsculas ni tildes. El producto ya elegido se mantiene en la lista.
   */
  filteredProducts(item: QuickItem): Product[] {
    return item.options;
  }

  /** Si la búsqueda deja un solo producto, se selecciona automáticamente */
  onSearch(index: number) {
    const item = this.items[index];
    item.productId = '';
    const request = ++item.requestNumber;
    setTimeout(() => {
      if (request !== item.requestNumber) return;
      this.productSvc.search({ page: 1, limit: 30, search: item.term || undefined, isActive: true, sortBy: 'name', sortOrder: 'ASC' }).subscribe({
        next: (res) => {
          if (request !== item.requestNumber) return;
          item.options = res.data;
          if (res.meta.total === 1) { const p = res.data[0]; item.productId = p.id; item.productName = p.name; item.currentStock = p.stock; }
        },
        error: (err: Error) => { this.error.set(err.message); },
      });
    }, 250);
  }

  addRow() {
    this.items.push(emptyItem());
    this.onSearch(this.items.length - 1);
  }

  removeRow(i: number) {
    this.items.splice(i, 1);
  }

  register() {
    const validItems = this.items.filter((i) => i.productId && Number.isInteger(i.quantity) && i.quantity > 0);
    if (this.saving()) return;
    if (validItems.length !== this.items.length) { this.error.set('Seleccione un producto y una cantidad válida en cada fila.'); return; }

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
        this.items = [emptyItem()];
        // Refresh product list to show updated stocks
        this.onSearch(0);
      },
      error: (err: Error) => { this.error.set(err.message); this.saving.set(false); },
    });
  }
}
