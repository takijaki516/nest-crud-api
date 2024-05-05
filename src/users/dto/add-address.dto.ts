import { IsString, Length } from 'class-validator';

export class AddAddressDto {
  @IsString()
  lineOne: string;

  @IsString()
  lineTwo: string;

  // TODO: length
  @IsString()
  @Length(5, 5)
  zipcode: string;

  @IsString()
  city: string;

  @IsString()
  country: string;
}
