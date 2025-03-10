import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import BaseDeleteableEntity from '../shared/database/base-deleteable.entity';
import Application from './application.entity';

@Entity({ tableName: 'api_key' })
export default class ApiKey extends BaseDeleteableEntity {
  @Unique()
  @Property({ nullable: false })
  keyHash: string;

  @ManyToOne({
    entity: () => Application,
    fieldName: 'application_id',
    serializedName: 'applicationId'
  })
  application!: Application;

  @Property({ nullable: false })
  keyHint: string;

  constructor(keyHash: string, keyHint: string) {
    super();
    this.keyHash = keyHash;
    this.keyHint = keyHint;
  }
}
