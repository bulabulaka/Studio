process.env.NODE_ENV = 'test';
import * as chai from 'chai';
import {init_config as server} from '../../src/server/app';
import chaiHttp = require('chai-http');
import {knex} from '../../src/server/db/connection';
import {registerModel} from '../../src/shared/index';

const should = chai.should();

chai.use(chaiHttp);

describe('routes : /api', () => {
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


  describe('POST /api/login', () => {
    it('should login a user', (done) => {
      chai.request(server())
        .post('/api/login')
        .send({
          username: 'jeremy',
          password: 'johnson123'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RCode.should.eql(1);
          done();
        });
    });
    it('should not login an unregistered user', (done) => {
      chai.request(server())
        .post('/api/login')
        .send({
          username: 'michael',
          password: 'johnson123'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RMsg.should.eql('User not found');
          done();
        });
    });
  });

  describe('GET /api/logout', () => {
    it('should throw an error if a user is not logged in', (done) => {
      chai.request(server())
        .get('/api/logout')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RCode.should.eql(0);
          done();
        });
    });
  });

  describe('POST /api/register', () => {
    it('should register a new user', (done) => {
      let _register = new registerModel();
      _register.username = 'michael';
      _register.password = 'herman';
      chai.request(server())
        .post('/api/register')
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
        .post('/api/register')
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
        .post('/api/register')
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

  describe('GET /api/404', () => {
    it('need token', (done) => {
      chai.request(server())
        .get('/api/404')
        .end((err, res) => {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.resultValue.RMsg.should.eql('No token exists.');
          done();
        });
    });
  });
});
