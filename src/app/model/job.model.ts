export interface Job{
    id?: string;
    name: string;
    price: number;
    minimumPrice: number;
    quantity: number;
    categoryId: string;
    createdDate: string;
    isSelected?: boolean;
  }