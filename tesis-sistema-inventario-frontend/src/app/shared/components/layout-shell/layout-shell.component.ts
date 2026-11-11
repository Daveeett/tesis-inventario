import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs';

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
    { path: '/dashboard',              label: 'Dashboard',             exact: true },
    { path: '/catalog',                label: 'Catálogo',              exact: false },
    { path: '/inventory',              label: 'Entrada mercadería',    exact: true },
    { path: '/inventory/out-register', label: 'Salida inventario',     exact: true },
    { path: '/inventory/history',      label: 'Historial movimientos', exact: true },
    { path: '/categories',             label: 'Categorías',            exact: true },
  ];

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  logout() {
    this.auth.revokeSession().pipe(finalize(() => {
      this.auth.logout();
      void this.router.navigateByUrl('/login');
    })).subscribe({ error: () => {} });
  }
}
