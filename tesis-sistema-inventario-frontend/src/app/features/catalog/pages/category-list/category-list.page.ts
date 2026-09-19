import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CategoryService } from '../../../../core/services/category.service';
import { Category, Subcategory } from '../../../../core/models/api.models';

@Component({
  selector: 'app-category-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  templateUrl: './category-list.page.html',
})
export class CategoryListPage implements OnInit {
  readonly categories    = signal<Category[]>([]);
  readonly subcategories = signal<Subcategory[]>([]);
  readonly loading       = signal(true);

  // Category form
  catName = '';
  catDesc = '';
  savingCat = false;

  // Subcategory form
  subName       = '';
  subDesc       = '';
  subCategoryId = '';
  savingSub     = false;

  constructor(private readonly categorySvc: CategoryService) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading.set(true);
    this.categorySvc.getCategories().subscribe((res) => {
      this.categories.set(res.data);
      this.loading.set(false);
    });
    this.categorySvc.getSubcategories().subscribe((res) => this.subcategories.set(res.data));
  }

  addCategory() {
    if (!this.catName.trim() || this.savingCat) return;
    this.savingCat = true;
    this.categorySvc.createCategory({ name: this.catName.trim(), description: this.catDesc || null }).subscribe({
      next: () => { this.catName = ''; this.catDesc = ''; this.savingCat = false; this.loadAll(); },
      error: () => { this.savingCat = false; },
    });
  }

  deleteCategory(id: string) {
    if (!confirm('¿Eliminar esta categoría y sus subcategorías?')) return;
    this.categorySvc.deleteCategory(id).subscribe({ next: () => this.loadAll() });
  }

  addSubcategory() {
    if (!this.subName.trim() || !this.subCategoryId || this.savingSub) return;
    this.savingSub = true;
    this.categorySvc.createSubcategory({ name: this.subName.trim(), categoryId: this.subCategoryId, description: this.subDesc || null }).subscribe({
      next: () => { this.subName = ''; this.subDesc = ''; this.savingSub = false; this.loadAll(); },
      error: () => { this.savingSub = false; },
    });
  }

  deleteSubcategory(id: string) {
    if (!confirm('¿Eliminar esta subcategoría?')) return;
    this.categorySvc.deleteSubcategory(id).subscribe({ next: () => this.loadAll() });
  }
}
