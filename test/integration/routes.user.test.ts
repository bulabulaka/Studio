process.env.NODE_ENV = 'test';
import * as chai from 'chai';
import {init_config as server} from '../../src/server/app';
import chaiHttp = require('chai-http');
import {knex} from '../../src/server/db/connection';
import {registerModel} from '../../src/shared/index';

const should = chai.should();

chai.use(chaiHttp);

describe('routes : /api/user', () => {

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

  describe('POST /api/user/register', () => {
    it('should register a new user', (done) => {
      let _register = new registerModel();
      _register.username = 'michael';
      _register.password = 'herman';
      chai.request(server())
        .post('/api/user/register')
        .send({
          register: _register
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RCode.should.eql(1);
          res.body.resultValue.Data.should.eql(3);
          done();
        });
    });
    it('should throw an error if the username is < 6 characters', (done) => {
      let _register = new registerModel();
      _register.username = 'six';
      _register.password = 'herman';
      chai.request(server())
        .post('/api/user/register')
        .send({
          register: _register
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RMsg.should.eql('Username must be longer than 6 characters');
          done();
        });
    });
    it('should throw an error if the password is < 6 characters', (done) => {
      let _register = new registerModel();
      _register.username = 'herman';
      _register.password = 'six';
      chai.request(server())
        .post('/api/user/register')
        .send({
          register:_register
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RMsg.should.eql('Password must be longer than 6 characters');
          done();
        });
    });
  });
});
