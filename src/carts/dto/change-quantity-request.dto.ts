import { IsNumber } from 'class-validator';

export class ChangeQuantityRequestDto {
  @IsNumber()
  quantity: number;
}
