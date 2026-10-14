export interface ProductCategory {
  id: string;
  name: string;
}

export interface ProductEntity {
  id: string;
  name: string;
  price: string;
  stock: number;
  categoryId: string;
  category: ProductCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilters {
  categoryId?: string;
  search?: string;
}

export interface CreateProductData {
  name: string;
  price: number;
  stock: number;
  categoryId: string;
}

export interface UpdateProductData {
  name?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
}
