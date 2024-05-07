import { IsEnum, IsString } from 'class-validator';

export type OrderStatusType =
  | 'PENDING'
  | 'ACCEPTED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export class ChangeOrderStatusDto {
  // @IsEnum(OrderStatusType)
  @IsString()
  status: OrderStatusType;
}
