import * as Knex from 'knex';
import * as Promise from 'bluebird';
import {BaseEntity, m_user} from './entity';

export class BaseEntityContainer<T extends BaseEntity> {
  tableName: string = '';
  conn: Knex;

  public constructor(tblName: string, conn: Knex) {
    this.tableName = tblName;
    this.conn = conn;
  }

  //return new id
  public insert(entity: T): Promise<number> {
    entity.created_datetime = new Date();
    entity.modified_datetime = entity.created_datetime;
    entity.auditstat = 1;
    //entity.creator_id = userContext.id;
    //entity.modifier_id = userContent.id;

    return this.conn(this.tableName).returning('id').insert(entity);
  }

  //Number of rows affected will return
  public deleteById(id: number): Promise<number> {
    let updatedProperties = {
      modified_datetime: new Date(),
      auditstat: 10,
      modifier_id: 0//TBD userContext.id
    };
    return this.conn(this.tableName).where({id: id, auditstat: 1}).update(updatedProperties);
  }

  //Number of rows affected will return
  public update(entity: T): Promise<number> {
    entity.modified_datetime = new Date();
    entity.modifier_id = 0;//TBD
    return this.conn(this.tableName).where({id: entity.id, auditstat: 1}).update(entity);
  }

  //undefined or retrieved entity
  public retrieveById(id: number): Promise<T> {
    return this.conn(this.tableName).where({id: id, auditstat: 1}).first().then((row) => row);
  }

  public retrieve(parameters: any): Promise<T[]> {
    return this.conn(this.tableName).where(parameters);
  }
}

export class Entities {
  m_uers: BaseEntityContainer<m_user>;

  public constructor(knexConn: Knex) {
    this.m_uers = new BaseEntityContainer<m_user>('m_user', knexConn);

  }

}



