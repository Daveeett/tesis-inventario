import { Component, OnInit, OnDestroy, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { forkJoin } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { ProductService } from '../../../core/services/product.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { Product, InventoryMovement } from '../../../core/models/api.models';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage implements OnInit, OnDestroy {
  @ViewChild('categoryCanvas') categoryCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('movementCanvas') movementCanvas!: ElementRef<HTMLCanvasElement>;

  readonly lowStockProducts    = signal<Product[]>([]);
  readonly totalProducts       = signal<number>(0);
  readonly totalInventoryValue  = signal<number>(0);
  readonly totalCategories     = signal<number>(0);
  readonly recentMovements     = signal<InventoryMovement[]>([]);
  readonly loading             = signal(true);

  private categoryChartInstance?: Chart;
  private movementChartInstance?: Chart;

  readonly typeLabels: Record<string, { label: string; class: string }> = {
    IN: { label: 'Entrada', class: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    OUT: { label: 'Salida', class: 'bg-rose-100 text-rose-800 border-rose-300' },
    ADJUSTMENT: { label: 'Ajuste', class: 'bg-amber-100 text-amber-800 border-amber-300' },
  };

  constructor(
    private readonly productSvc: ProductService,
    private readonly inventorySvc: InventoryService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  private loadData() {
    this.loading.set(true);
    forkJoin({
      productsRes: this.productSvc.getAll(),
      movementsRes: this.inventorySvc.getMovements()
    }).subscribe({
      next: ({ productsRes, movementsRes }) => {
        const products = productsRes.data || [];
        const movements = movementsRes.data || [];

        // 1. KPIs
        this.totalProducts.set(products.length);
        this.lowStockProducts.set(products.filter((p) => p.stock <= p.minStock && p.isActive));
        
        const totalValue = products.reduce((sum, p) => sum + ((p.stock || 0) * (p.purchasePrice || p.salePrice || 0)), 0);
        this.totalInventoryValue.set(totalValue);

        this.recentMovements.set(movements.slice(0, 5));

        // Categories set
        const catMap = new Map<string, number>();
        products.forEach((p) => {
          const catName = p.subcategory?.category?.name || 'General';
          catMap.set(catName, (catMap.get(catName) || 0) + 1);
        });
        this.totalCategories.set(catMap.size);

        this.loading.set(false);

        // Render charts after Angular updates DOM
        setTimeout(() => {
          this.initCategoryChart(catMap);
          this.initMovementChart(movements);
        }, 50);
      },
      error: () => this.loading.set(false)
    });
  }

  private destroyCharts() {
    if (this.categoryChartInstance) {
      this.categoryChartInstance.destroy();
    }
    if (this.movementChartInstance) {
      this.movementChartInstance.destroy();
    }
  }

  private initCategoryChart(catMap: Map<string, number>) {
    if (!this.categoryCanvas) return;
    
    if (this.categoryChartInstance) {
      this.categoryChartInstance.destroy();
    }

    const labels = Array.from(catMap.keys());
    const data = Array.from(catMap.values());

    const colors = [
      '#1A3D63', '#4A7FA7', '#B3CFE5', '#0A1931',
      '#059669', '#D97706', '#DC2626', '#8B5CF6'
    ];

    this.categoryChartInstance = new Chart(this.categoryCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: { family: 'sans-serif', size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.label}: ${item.formattedValue} prod.`
            }
          }
        },
        cutout: '70%'
      }
    });
  }

  private initMovementChart(movements: InventoryMovement[]) {
    if (!this.movementCanvas) return;

    if (this.movementChartInstance) {
      this.movementChartInstance.destroy();
    }

    // Process movements for the last 14 days
    const daysMap = new Map<string, { in: number; out: number }>();
    const now = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      daysMap.set(key, { in: 0, out: 0 });
    }

    movements.forEach((m) => {
      const mDate = new Date(m.createdAt);
      const key = mDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      if (daysMap.has(key)) {
        const entry = daysMap.get(key)!;
        if (m.type === 'IN' || (m.type === 'ADJUSTMENT' && m.quantity > 0)) {
          entry.in += Math.abs(m.quantity);
        } else if (m.type === 'OUT' || (m.type === 'ADJUSTMENT' && m.quantity < 0)) {
          entry.out += Math.abs(m.quantity);
        }
      }
    });

    const labels = Array.from(daysMap.keys());
    const dataIn = labels.map((l) => daysMap.get(l)!.in);
    const dataOut = labels.map((l) => daysMap.get(l)!.out);

    this.movementChartInstance = new Chart(this.movementCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Entradas (+)',
            data: dataIn,
            backgroundColor: '#059669',
            borderRadius: 4
          },
          {
            label: 'Salidas (-)',
            data: dataOut,
            backgroundColor: '#E11D48',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, ticks: { precision: 0 } }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: { boxWidth: 12 }
          }
        }
      }
    });
  }
}

