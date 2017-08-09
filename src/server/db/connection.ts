import * as knexConfig from '../../../knexfile';
import * as Knex from 'knex';

const environment = process.env.NODE_ENV;
export const knex = Knex(knexConfig[environment]);


