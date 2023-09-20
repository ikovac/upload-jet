import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import Application from './application.entity';

export class ApplicationNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: EntityRepository<Application>
  ) {}

  getUserApplications(userId: number) {
    return this.applicationRepository.find({ userId });
  }

  async getById(id: number) {
    return this.applicationRepository.findOne({ id }).then(result => {
      if (!result)
        throw new ApplicationNotFoundError(
          `Application with id ${id} not found`
        );

      return result;
    });
  }
}
