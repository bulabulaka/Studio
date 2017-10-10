
process.env.NODE_ENV = 'test';
import * as chai from 'chai';
import {init_config as server} from '../../src/server/app';
import chaiHttp = require('chai-http');
import {knex} from '../../src/server/db/connection';

const should = chai.should();

chai.use(chaiHttp);


export function simulateUser(userName: string, password: string, callback: (token: string) => void ) {
      chai.request(server())
        .post('/api/auth/login')
        .send({
          username: userName,
          password: password // TBC: can directly retrive from db without passing in
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          if (callback) {
            callback(res.body.resultValue.Token)
          }
        });
  }
