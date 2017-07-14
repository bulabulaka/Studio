"use strict";
exports.__esModule = true;
process.env.NODE_ENV = 'test';
var chai = require("chai");
var chaiHttp = require("chai-http");
var app_1 = require("../../src/server/app");
var should = chai.should();
chai.use(chaiHttp);
describe('routes : index', function () {
    beforeEach(function (done) {
        done();
    });
    afterEach(function (done) {
        done();
    });
    describe('GET /', function () {
        it('should render the index', function (done) {
            chai.request(app_1.init_config())
                .get('/')
                .end(function (err, res) {
                res.status.should.equal(200);
                res.type.should.equal('text/html');
                done();
            });
        });
    });
    describe('GET /404', function () {
        it('should throw an error', function (done) {
            chai.request(app_1.init_config())
                .get('/404')
                .end(function (err, res) {
                res.status.should.equal(404);
                res.type.should.equal('application/json');
                res.body.message.should.eql('Not Found');
                done();
            });
        });
    });
});
