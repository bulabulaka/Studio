import {knexConfig} from "../../../knexfile";
const environment = process.env.NODE_ENV;
export const knex = new knexConfig(environment).knex;
