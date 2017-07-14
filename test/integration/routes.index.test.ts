process.env.NODE_ENV = 'test';
import  * as chai from "chai";
import chaiHttp = require('chai-http');
import {init_config} from "../../src/server/app";
const should = chai.should();
chai.use(chaiHttp);

describe('routes : index', () => {

  beforeEach((done) => {
    done();
  });

  afterEach((done) => {
    done();
  });

  describe('GET /', () => {
    it('should render the index', (done) => {
      chai.request(init_config())
      .get('/')
      .end((err, res) => {
        res.status.should.equal(200);
        res.type.should.equal('text/html');
        done();
      });
    });
  });

  describe('GET /404', () => {
    it('should throw an error', (done) => {
      chai.request(init_config())
      .get('/404')
      .end((err, res) => {
        res.status.should.equal(404);
        res.type.should.equal('application/json');
        res.body.message.should.eql('Not Found');
        done();
      });
    });
  });

});
