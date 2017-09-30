process.env.NODE_ENV = 'test';
import * as chai from 'chai';
import {init_config as server} from '../../src/server/app';
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
        return knex.seed.run({directory: 'src/server/db/seeds'});
      });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', (done) => {
      chai.request(server())
        .post('/api/auth/register')
        .send({
          username: 'michael',
          password: 'herman'
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
      chai.request(server())
        .post('/api/auth/register')
        .send({
          username: 'six',
          password: 'herman'
        })
        .end((err, res) => {
          should.exist(err);
          res.status.should.eql(400);
          res.type.should.eql('application/json');
          res.body.message.should.eql('Username must be longer than 6 characters');
          done();
        });
    });
    it('should throw an error if the password is < 6 characters', (done) => {
      chai.request(server())
        .post('/api/auth/register')
        .send({
          username: 'michael',
          password: 'six'
        })
        .end((err, res) => {
          should.exist(err);
          res.status.should.eql(400);
          res.type.should.eql('application/json');
          res.body.message.should.eql('Password must be longer than 6 characters');
          done();
        });
    });
  });
  describe('POST /api/auth/login', () => {
    it('should login a user', (done) => {
      chai.request(server())
        .post('/api/auth/login')
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
        .post('/api/auth/login')
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

  describe('GET /api/auth/logout', () => {
    it('should throw an error if a user is not logged in', (done) => {
      chai.request(server())
        .get('/api/auth/logout')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RCode.should.eql(0);
          done();
        });
    });
  });

  describe('GET /api/user/get_userinfo', () => {
    it('should throw an error if a user is not logged in', (done) => {
      chai.request(server())
        .get('/api/user/get_userinfo')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.resultValue.RCode.should.eql(0);
          done();
        });
    });
  });
});
