export const ROLES = { admin: 'ADMIN', superAdmin: 'SUPER_ADMIN' } as const;
export const RentalStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  IN_DELIVERY: 'IN_DELIVERY',
} as const;

export type RentalStatusType = (typeof RentalStatus)[keyof typeof RentalStatus];

export interface IUpdatedRentalProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
}

export interface IUpdatedRental {
  id: number;
  userId: number;
  dateFrom: string;
  dateTo: string;
  isDelivery: null;
  status: string;
  createdAt: string;
  rentalProducts: IUpdatedRentalProduct[];
}
