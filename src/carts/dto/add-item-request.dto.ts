import { IsNumber, IsString } from 'class-validator';

export class AddItemRequestDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;
}
