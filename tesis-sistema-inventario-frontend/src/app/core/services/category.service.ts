import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Category, Subcategory } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly catBase = `${environment.apiBaseUrl}/categories`;
  private readonly subBase = `${environment.apiBaseUrl}/subcategories`;

  constructor(private readonly http: HttpClient) {}

  // ── Categories ─────────────────────────────────────────────

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(this.catBase);
  }

  createCategory(payload: { name: string; description?: string | null }): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.catBase, payload);
  }

  updateCategory(id: string, payload: Partial<Category>): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.catBase}/${id}`, payload);
  }

  deleteCategory(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.catBase}/${id}`);
  }

  // ── Subcategories ───────────────────────────────────────────

  getSubcategories(): Observable<ApiResponse<Subcategory[]>> {
    return this.http.get<ApiResponse<Subcategory[]>>(this.subBase);
  }

  getSubcategoriesByCategory(categoryId: string): Observable<ApiResponse<Subcategory[]>> {
    return this.http.get<ApiResponse<Subcategory[]>>(`${this.subBase}/by-category/${categoryId}`);
  }

  createSubcategory(payload: { name: string; categoryId: string; description?: string | null }): Observable<ApiResponse<Subcategory>> {
    return this.http.post<ApiResponse<Subcategory>>(this.subBase, payload);
  }

  updateSubcategory(id: string, payload: Partial<Subcategory>): Observable<ApiResponse<Subcategory>> {
    return this.http.put<ApiResponse<Subcategory>>(`${this.subBase}/${id}`, payload);
  }

  deleteSubcategory(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.subBase}/${id}`);
  }
}
