import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PaginatedResponse,
  Product,
  CreateProductPayload,
  ProductSearchParams,
} from '../models/api.models';

export interface BarcodeLookupInfo {
  name: string;
  brand: string;
  model?: string;
  serialNumber: string;
  description?: string;
  imageUrl?: string;
  specifications?: Record<string, string>;
  foundInInternet: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly base = `${environment.apiBaseUrl}/products`;

  constructor(private readonly http: HttpClient) {}

  /** Paginated search with filters */
  search(params: ProductSearchParams): Observable<PaginatedResponse<Product>> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        httpParams = httpParams.set(k, String(v));
      }
    });
    return this.http.get<PaginatedResponse<Product>>(`${this.base}/search`, { params: httpParams });
  }

  /** Get all products (for selects/dropdowns) */
  getAll(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(this.base);
  }

  /** Lookup product details by barcode in internet/API */
  lookupBarcode(barcode: string): Observable<ApiResponse<BarcodeLookupInfo>> {
    return this.http.get<ApiResponse<BarcodeLookupInfo>>(`${this.base}/barcode-lookup/${encodeURIComponent(barcode)}`);
  }

  /** Get single product */
  getById(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.base}/${id}`);
  }

  /** Create a new product */
  create(payload: CreateProductPayload): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.base, payload);
  }

  /** Update existing product */
  update(id: string, payload: Partial<CreateProductPayload>): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.base}/${id}`, payload);
  }

  /** Delete product */
  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }

  /** Get all distinct brands */
  getBrands(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.base}/brands`);
  }
}
