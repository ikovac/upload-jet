import { Inject, Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigType } from '@nestjs/config';
import awsConfig from 'config/aws.config';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { PolicyOptions } from './policy.dto';

@Injectable()
export class S3ClientService {
  private s3Client: S3Client;

  constructor(
    @Inject(awsConfig.KEY)
    private config: ConfigType<typeof awsConfig>
  ) {
    const { region, accessKey, secretKey } = this.config;

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey
      }
    });
  }

  generatePostPolicy({
    bucket,
    key,
    ...conditions
  }: PolicyOptions & { bucket: string }) {
    const Conditions = [];
    const Fields = {};
    if ('maxFileSize' in conditions) {
      Conditions.push(['content-length-range', 0, conditions.maxFileSize]);
    }
    if ('fileType' in conditions) {
      Conditions.push({ 'Content-Type': conditions.fileType });
    }
    if ('public' in conditions && conditions.public) {
      const tagKey = 'policy';
      const tagValue = 'public';
      Fields[
        'Tagging'
      ] = `<Tagging><TagSet><Tag><Key>${tagKey}</Key><Value>${tagValue}</Value></Tag></TagSet></Tagging>`;
    }

    return createPresignedPost(this.s3Client, {
      Bucket: bucket,
      Key: key,
      Fields,
      Conditions
    });
  }
}
