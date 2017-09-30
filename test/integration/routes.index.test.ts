process.env.NODE_ENV = 'test';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {init_config} from '../../src/server/app';
import {knex} from '../../src/server/db/connection';

const should = chai.should();
chai.use(chaiHttp);

describe('routes : index', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
      .then(() => {
        return knex.migrate.latest();
      })
      .then(() => {
        return knex.seed.run({directory: 'src/server/db/seeds'});
      });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('GET /api/404', () => {
    it('should throw an error', (done) => {
      chai.request(init_config())
        .get('/api/404')
        .end((err, res) => {
          res.status.should.equal(404);
          res.type.should.equal('application/json');
          res.body.message.should.eql('Not Found');
          done();
        });
    });
  });

});
