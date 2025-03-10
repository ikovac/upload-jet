import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import Application from './application.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { GetApplicationMiddleware } from './get-application.middleware';
import ApiKey from './api-key.entity';
@Module({
  controllers: [ApplicationController],
  imports: [MikroOrmModule.forFeature([Application, ApiKey])],
  providers: [ApplicationService],
  exports: [ApplicationService]
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GetApplicationMiddleware)
      .forRoutes('applications/:applicationId/api-keys');
  }
}
