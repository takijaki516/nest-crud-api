import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

@Injectable()
export class S3Service {
  s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.getOrThrow('AWS_S3_REGION'),
      credentials: {
        accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async getPutPresignedUrl(filetype: string) {
    // TODO: check filetype
    const randomFileName = this.generateRandomFileName();

    const putObjCommand = new PutObjectCommand({
      Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
      Key: randomFileName,
      ContentType: filetype,
    });

    const presignedUrl = await getSignedUrl(this.s3Client, putObjCommand, {
      expiresIn: 60 * 5,
    });

    const imageUrl = presignedUrl.split('?')[0];

    return { presignedUrl, fileName: randomFileName, imageUrl };
  }

  private generateRandomFileName(bytes = 32) {
    return randomBytes(bytes).toString('hex');
  }

  async deleteObject(imageUrl: string) {
    const key = imageUrl.split('/').pop();

    const deleteParams = {
      Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
      Key: key,
    };

    await this.s3Client.send(new DeleteObjectCommand(deleteParams));
  }
}
