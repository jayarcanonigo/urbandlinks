export interface Job{
    id?: string;
    name: string;
    price: number;
    minimunPrice: number;
    quantity: number;
    categoryId: string;
    createdDate: string;
    isSelected?: boolean;
  }