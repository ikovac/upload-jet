import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import Application from './application.entity';
import { createHash, randomUUID } from 'crypto';

export class ApplicationNotFoundError extends Error {
  constructor() {
    super('Application not found');
    this.name = this.constructor.name;
  }
}

export class ApiKeyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

@Injectable()
export class ApplicationService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Application)
    private readonly applicationRepository: EntityRepository<Application>
  ) {}

  getAllByUserId(userId: number) {
    return this.applicationRepository.find({ userId });
  }

  async getById(id: number) {
    const result = await this.applicationRepository.findOne({ id });
    if (!result) throw new ApplicationNotFoundError();
    return result;
  }

  async generateApiKey(application: Application) {
    const apiKey = randomUUID();
    const hashedKey = await this.hashApiKey(apiKey);

    await application.generateApiKey(hashedKey);
    await this.em.persistAndFlush(application);

    return apiKey;
  }

  async deleteApiKey(application: Application) {
    await application.deleteApiKey();
    this.em.persistAndFlush(application);
  }

  private async hashApiKey(apiKey: string): Promise<string> {
    const hash = createHash('sha512');
    hash.update(apiKey);
    return hash.digest('hex');
  }
}
