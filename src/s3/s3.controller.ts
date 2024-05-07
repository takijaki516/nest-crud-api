import { Body, Controller, Get } from '@nestjs/common';
import { S3Service } from './s3.service';
import { PreSignedUrlDto } from './dto/put-signedurl.dto';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  // TODO: add guard
  @Get('put-presigned-url')
  async getPutPresignedUrl(@Body() body: PreSignedUrlDto) {
    const { fileName, presignedUrl, imageUrl } =
      await this.s3Service.getPutPresignedUrl(body.filetype);

    return {
      message: 'got presigned url successfully',
      data: { fileName, presignedUrl, imageUrl },
    };
  }
}
