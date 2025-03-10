import { Module } from '@nestjs/common';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';
import { GithubProviderService } from 'identity/github-provider.service';
import { HttpModule } from '@nestjs/axios';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import Identity from './identity.entity';
import { AuthorizationService } from './authorization.service';

@Module({
  controllers: [IdentityController],
  imports: [HttpModule, MikroOrmModule.forFeature([Identity])],
  providers: [IdentityService, AuthorizationService, GithubProviderService]
})
export class IdentityModule {}
