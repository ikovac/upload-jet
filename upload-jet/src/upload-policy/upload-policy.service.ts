import { Inject, Injectable } from '@nestjs/common';
import { S3ClientService } from './s3-client.service';
import { CreateUploadPolicyPayload } from './policy.dto';
import { ConfigType } from '@nestjs/config';
import awsConfig from 'config/aws.config';
import { objectify } from 'radash';

@Injectable()
export class UploadPolicyService {
  constructor(
    @Inject(awsConfig.KEY)
    private readonly config: ConfigType<typeof awsConfig>,
    private readonly s3ClientService: S3ClientService
  ) {}

  async createUploadPolicy(payload: CreateUploadPolicyPayload) {
    const bucket = this.config.bucketName;
    const pResult = Object.entries(payload).map(
      async ([fileName, policyOptions]) => {
        const policy = await this.s3ClientService.generatePostPolicy({
          bucket,
          ...policyOptions
        });
        return { fileName, policy };
      }
    );

    const result = await Promise.all(pResult);
    return objectify(
      result,
      it => it.fileName,
      it => it.policy
    );
  }
}
