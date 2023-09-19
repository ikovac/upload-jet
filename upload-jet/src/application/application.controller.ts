import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Param,
  Body,
  Delete,
  ParseIntPipe,
  Req,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { ApplicationService } from './application.service';
import { ApiKeyService } from './api-key.service';
import { readApplicationSchema } from './validation';
import { PermissionGuard } from 'shared/auth/permission.guard';
import { hasPermission } from 'shared/auth/authorization';
import { IdentityService } from 'identity/identity.service';

@Controller('application')
@UseGuards(PermissionGuard)
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly apiKeyService: ApiKeyService,
    private readonly identityService: IdentityService
  ) {}

  @Get('list')
  async getAll(@Req() req: Request) {
    if (!hasPermission(req.permissions, 'read', 'Application')) {
      throw new ForbiddenException();
    }

    const identity = await this.identityService.get(req.userId);
    return this.applicationService.getUserApplications(identity.id);
  }

  @Get(':id')
  async getById(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const validationResult = await readApplicationSchema.safeParseAsync({ id });

    if (validationResult.success === false) {
      throw new BadRequestException(validationResult.error);
    }

    const application = await this.applicationService.getById(
      validationResult.data.id
    );

    if (!hasPermission(req.permissions, 'read', application)) {
      throw new ForbiddenException();
    }

    return application;
  }

  @Post('generate-api-key')
  async generateApiKey(@Req() req: Request, @Body('applicationId') id: string) {
    const validationResult = await readApplicationSchema.safeParseAsync({ id });

    if (validationResult.success === false) {
      throw new BadRequestException(validationResult.error);
    }

    const applicationId = validationResult.data.id;
    const application = await this.applicationService.getById(applicationId);

    if (!hasPermission(req.permissions, 'update', application)) {
      throw new ForbiddenException();
    }

    return this.apiKeyService.generateApiKey(application);
  }

  @Delete('delete-api-key')
  async deleteApiKey(@Req() req: Request, @Body('applicationId') id: number) {
    const validationResult = await readApplicationSchema.safeParseAsync(id);

    if (validationResult.success === false) {
      throw new BadRequestException(validationResult.error);
    }

    const applicationId = validationResult.data.id;
    const application = await this.applicationService.getById(applicationId);

    if (!hasPermission(req.permissions, 'update', application)) {
      throw new ForbiddenException();
    }

    await this.apiKeyService.deleteApiKey(applicationId);
  }
}
