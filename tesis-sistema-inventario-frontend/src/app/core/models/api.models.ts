/** Generic API response wrapper matching the backend structure */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/** Paginated API response (for search/list endpoints) */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ── Domain Models ──────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  subcategories?: Subcategory[];
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpecifications {
  [key: string]: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string | null;
  serialNumber: string | null;
  description: string | null;
  specifications: ProductSpecifications | null;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  isActive: boolean;
  subcategoryId: string | null;
  subcategory?: Subcategory;
  imageBase64?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export interface InventoryMovement {
  id: string;
  type: MovementType;
  quantity: number;
  reason: string | null;
  previousStock: number;
  newStock: number;
  productId: string;
  product?: Product;
  createdAt: string;
  updatedAt: string;
}

// ── DTO / Form Payloads ────────────────────────────────────────

export interface CreateProductPayload {
  name: string;
  brand: string;
  model?: string | null;
  serialNumber?: string | null;
  description?: string | null;
  specifications?: ProductSpecifications | null;
  purchasePrice: number;
  salePrice: number;
  stock?: number;
  minStock?: number;
  subcategoryId?: string | null;
  imageBase64?: string | null;
}

export interface ProductSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  categoryId?: string;
  subcategoryId?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'brand' | 'salePrice' | 'stock' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface QuickRegisterPayload {
  items: { productId: string; quantity: number }[];
  reason?: string;
}
