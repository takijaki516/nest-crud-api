import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Type(() => Number) // REVIEW:
  price: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  tags: string;

  @ApiProperty({ type: String })
  @IsString()
  imageUrl: string;
}
