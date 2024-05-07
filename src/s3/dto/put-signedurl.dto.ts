import { IsString } from 'class-validator';

export class PreSignedUrlDto {
  @IsString()
  filetype: string;
}
