export interface Category {
  id: number;
  parentId: number;
  name: string;
  isActive: boolean;
  children: Category[];
  isOpen?: boolean;
}

export interface Product {
  id: number;
  categoryId: number;
  code: string;
  name: string;
  price: number;
  countryId?: number;
  countryName?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  errorOccured: boolean;
  errorMessage: string;
  data: T;
} 