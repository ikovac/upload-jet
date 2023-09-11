import { Module } from '@nestjs/common';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';
import { GithubProviderService } from 'identity/github-provider.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import Identity from './identity.entity';

@Module({
  controllers: [IdentityController],
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      useFactory(config: ConfigService) {
        return {
          secret: config.get('app.jwt.secret')
        };
      },
      inject: [ConfigService]
    }),
    MikroOrmModule.forFeature([Identity])
  ],
  providers: [IdentityService, GithubProviderService]
})
export class IdentityModule {}
