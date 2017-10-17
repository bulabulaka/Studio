process.env.NODE_ENV = 'test';
import * as chai from 'chai';
import {initConfig} from '../../src/server/app';
import chaiHttp = require('chai-http');
import {knex} from '../../src/server/db/connection';

const should = chai.should();

chai.use(chaiHttp);

describe('routes : /api/auth', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
      .then(() => {
        return knex.migrate.latest();
      })
      .then(() => {
        return knex.seed.run({directory: 'src/server/db/seed/seeds_test/seeds'});
      });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });
});
