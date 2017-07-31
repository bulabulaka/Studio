import * as knexConfig from "../../../knexfile";
import * as Knex from "knex";
import {Entities} from './entity/entityContainer';

interface ExtendedKnex{
    entities:Entities;
    knex:Knex;
}
const environment = process.env.NODE_ENV;
const knex =  Knex(knexConfig[environment]);


const extendKnex:ExtendedKnex = {
    entities: new Entities(knex),
    knex:knex
}

export = knex;
//export = extendKnex;
