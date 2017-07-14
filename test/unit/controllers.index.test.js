"use strict";
exports.__esModule = true;
process.env.NODE_ENV = 'test';
var chai = require("chai");
var should = chai.should();
var index_1 = require("../../src/server/controllers/index");
describe('controllers : index', function () {
    describe('sum()', function () {
        it('should return a total', function (done) {
            index_1.sum(1, 2, function (err, total) {
                should.not.exist(err);
                total.should.eql(3);
                done();
            });
        });
        it('should return an error', function (done) {
            index_1.sum(1, 'test', function (err, total) {
                should.not.exist(total);
                err.should.eql('Something went wrong!');
                done();
            });
        });
    });
});
