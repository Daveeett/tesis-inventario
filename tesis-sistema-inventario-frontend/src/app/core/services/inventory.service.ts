import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, InventoryMovement, QuickRegisterPayload } from '../models/api.models';

export interface QuickExitPayload {
  items: Array<{ productId: string; quantity: number }>;
  reason: string;
  customerName?: string;
  exitDate?: string;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly base = `${environment.apiBaseUrl}/inventory`;

  constructor(private readonly http: HttpClient) {}

  /** Get movement history, optionally filtered by product */
  getMovements(productId?: string): Observable<ApiResponse<InventoryMovement[]>> {
    const url = productId
      ? `${this.base}/movements?productId=${productId}`
      : `${this.base}/movements`;
    return this.http.get<ApiResponse<InventoryMovement[]>>(url);
  }

  /** Register a single inventory movement */
  createMovement(payload: { productId: string; type: string; quantity: number; reason?: string }): Observable<ApiResponse<InventoryMovement>> {
    return this.http.post<ApiResponse<InventoryMovement>>(`${this.base}/movements`, payload);
  }

  /** Quick bulk merchandise registration */
  quickRegister(payload: QuickRegisterPayload): Observable<ApiResponse<InventoryMovement[]>> {
    return this.http.post<ApiResponse<InventoryMovement[]>>(`${this.base}/quick-register`, payload);
  }

  /** Quick bulk exit / sale / dispatch inventory debiting */
  quickExit(payload: QuickExitPayload): Observable<ApiResponse<InventoryMovement[]>> {
    return this.http.post<ApiResponse<InventoryMovement[]>>(`${this.base}/quick-exit`, payload);
  }
}
