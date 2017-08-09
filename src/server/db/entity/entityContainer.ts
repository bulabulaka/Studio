import * as Promise from 'bluebird';
import {BaseEntity, m_user} from '../../../shared/index';
import {knex} from '../connection';

export class BaseEntityContainer<T extends BaseEntity> {
  tableName: string = '';

  public constructor(tblName: string) {
    this.tableName = tblName;
  }

  //return new id
  public insert(entity: T) {
    entity.created_datetime = new Date();
    entity.auditstat = 1;
    return knex(this.tableName).insert(entity).returning('id');
  }

  //Number of rows affected will return
  public deleteById(id: number): Promise<number> {
    let updatedProperties = {
      modified_datetime: new Date(),
      auditstat: 10,
      modifier_id: 0//TBD userContext.id
    };
    return knex(this.tableName).where({id: id, auditstat: 1}).update(updatedProperties);
  }

  //Number of rows affected will return
  public update(entity: T): Promise<number> {
    entity.modified_datetime = new Date();
    entity.modifier_id = 0;//TBD
    return knex(this.tableName).where({id: entity.id, auditstat: 1}).update(entity);
  }

  //undefined or retrieved entity
  public retrieveById(id: number): Promise<T> {
    return knex(this.tableName).where({id: id, auditstat: 1}).first().then((row) => row);
  }

  public retrieve(parameters: any): Promise<T[]> {
    return knex(this.tableName).where(parameters);
  }
}






