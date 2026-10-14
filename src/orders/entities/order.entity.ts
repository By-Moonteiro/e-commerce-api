export type OrderStatus = 'PENDING' | 'CANCELED';

export interface OrderProduct {
  id: string;
  name: string;
}

export interface OrderItemEntity {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  product: OrderProduct;
}

export interface OrderEntity {
  id: string;
  userId: string;
  status: OrderStatus;
  total: string;
  items: OrderItemEntity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderItemData {
  productId: string;
  quantity: number;
}

export interface CreateOrderData {
  userId: string;
  items: CreateOrderItemData[];
}
