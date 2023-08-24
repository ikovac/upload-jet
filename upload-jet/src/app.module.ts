import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadPolicyModule } from './upload-policy/upload-policy.module';
import { IdentityModule } from './identity/identity.module';
import awsConfig from './config/aws.config';
import appConfig from './config/app.config';
import { LoggerModule } from 'nestjs-pino';
import { GithubProviderModule } from 'github/githubProvider.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: { target: 'pino-pretty' },
        redact: ['req.headers.authorization'],
        quietReqLogger: true
      }
    }),
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig, awsConfig] }),
    UploadPolicyModule,
    GithubProviderModule,
    IdentityModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
