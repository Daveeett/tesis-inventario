import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { InventoryService } from '../../../../core/services/inventory.service';
import { InventoryMovement } from '../../../../core/models/api.models';

@Component({
  selector: 'app-movement-history-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent],
  templateUrl: './movement-history.page.html',
})
export class MovementHistoryPage implements OnInit {
  readonly movements = signal<InventoryMovement[]>([]);
  readonly loading   = signal(true);

  readonly typeLabels: Record<string, { label: string; class: string }> = {
    IN:         { label: 'Entrada',  class: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    OUT:        { label: 'Salida',   class: 'text-rose-700 bg-rose-50 border-rose-200'   },
    ADJUSTMENT: { label: 'Ajuste',   class: 'text-amber-700 bg-amber-50 border-amber-200' },
  };

  constructor(private readonly inventorySvc: InventoryService) {}

  ngOnInit() {
    this.inventorySvc.getMovements().subscribe({
      next: (res) => { this.movements.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
