import * as knexConfig from '../../../knexfile';
import * as Knex from 'knex';
import {Entities} from './entity/entityContainer';

interface ExtendedKnex {
  entities: Entities;
  knex: Knex;
}

const environment = process.env.NODE_ENV;

export const knex = Knex(knexConfig[environment]);
export const extendKnex: ExtendedKnex = {
  entities: new Entities(knex),
  knex: knex
};

