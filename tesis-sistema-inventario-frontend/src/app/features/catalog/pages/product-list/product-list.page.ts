import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { ProductService } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Product, Category, ProductSearchParams, PaginatedResponse } from '../../../../core/models/api.models';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgIconComponent],
  templateUrl: './product-list.page.html',
})
export class ProductListPage implements OnInit {
  readonly products  = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly brands    = signal<string[]>([]);
  readonly loading   = signal(true);
  readonly deleting  = signal<string | null>(null);

  // Pagination meta
  total      = 0;
  totalPages = 0;

  // Search & filter state
  searchQuery  = '';
  selectedBrand     = '';
  selectedCategoryId = '';
  currentPage  = 1;
  readonly pageSize = 10;

  private readonly search$ = new Subject<void>();

  constructor(
    private readonly productSvc: ProductService,
    private readonly categorySvc: CategoryService,
    public readonly authSvc: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    // Load filter options
    this.categorySvc.getCategories().subscribe((res) => this.categories.set(res.data));
    this.productSvc.getBrands().subscribe((res) => this.brands.set(res.data));

    // Debounced search pipeline
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => {
          this.loading.set(true);
          const params: ProductSearchParams = {
            page:        this.currentPage,
            limit:       this.pageSize,
            search:      this.searchQuery || undefined,
            brand:       this.selectedBrand || undefined,
            categoryId:  this.selectedCategoryId || undefined,
            sortBy:      'createdAt',
            sortOrder:   'DESC',
          };
          return this.productSvc.search(params);
        }),
      )
      .subscribe({
        next: (res: PaginatedResponse<Product>) => {
          this.products.set(res.data);
          this.total      = res.meta.total;
          this.totalPages = res.meta.totalPages;
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });

    this.triggerSearch();
  }

  triggerSearch() {
    this.currentPage = 1;
    this.search$.next();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.search$.next();
  }

  edit(id: string) {
    void this.router.navigate(['/catalog/edit', id]);
  }

  delete(id: string) {
    if (!confirm('¿Está seguro de que desea eliminar este producto?')) return;
    this.deleting.set(id);
    this.productSvc.delete(id).subscribe({
      next: () => {
        this.deleting.set(null);
        this.triggerSearch();
      },
      error: () => this.deleting.set(null),
    });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
