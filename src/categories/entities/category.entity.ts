export interface CategoryEntity {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryData {
  name: string;
}

export interface UpdateCategoryData {
  name?: string;
}

export interface UpdateCategoryParams {
  id: string;
  data: UpdateCategoryData;
}
