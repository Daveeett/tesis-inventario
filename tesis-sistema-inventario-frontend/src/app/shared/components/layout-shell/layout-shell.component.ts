import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIconComponent, CommonModule],
  templateUrl: './layout-shell.component.html',
  styleUrl: './layout-shell.component.scss',
})
export class LayoutShellComponent {
  readonly user = this.auth.getCurrentUser();

  readonly navLinks = [
    { path: '/dashboard',           label: 'Dashboard',            icon: 'heroHome' },
    { path: '/catalog',             label: 'Catálogo',              icon: 'heroArchiveBox' },
    { path: '/inventory',           label: 'Entrada Mercadería',   icon: 'heroQueueList' },
    { path: '/inventory/out-register', label: 'Salida Inventario',  icon: 'heroShoppingCart' },
    { path: '/inventory/history',   label: 'Historial Movimientos', icon: 'heroClock' },
    { path: '/categories',          label: 'Categorías',            icon: 'heroTag' },
  ];

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  logout() {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
