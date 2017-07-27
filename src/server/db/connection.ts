import * as knexConfig from "../../../knexfile";
const environment = process.env.NODE_ENV;
export const knex =  knexConfig[environment].knex;
