'use strict';
var FunctionalLoader = require('./index');
var should = require('should');
var sinon = require('sinon');
var q = require('q');

describe('Functional Loader', function () {

  it('should throw an error if a create function is not supplied in the options', function () {
    (function () {
      FunctionalLoader({
        create: undefined
      });
    }).should.throw('create function required in options');
  });

  it('should call create on all the documents in only a create function is supplied', function (done) {
    var createFunc = sinon.stub().returns(q.when('created!'));
    var loader = FunctionalLoader({
      create: createFunc
    });
    var data = {
      create: [1, 2, 3, 4, 5]
    };
    loader.load(data)
      .then(function (results) {
        results.createResults.length.should.equal(5);
        createFunc.callCount.should.equal(5);
        results.createResults[0].should.equal('created!');
        results.createResults[1].should.equal('created!');
        results.createResults[2].should.equal('created!');
        results.createResults[3].should.equal('created!');
        results.createResults[4].should.equal('created!');
        done();
      })
      .then(null, done);
  });

  it('should call update on all the documents in the feed', function(done) {
    var createFunc = sinon.stub().returns(q.when('created!'));
    var updateFunc = sinon.stub().returns(q.when('updated!'));
    var loader = FunctionalLoader({
      create: createFunc,
      update: updateFunc
    });
    var data = {
      create: [1, 2],
      update: [3, 4]
    };
    loader.load(data)
      .then(function(results) {
        results.createResults.length.should.equal(2);
        results.updateResults.length.should.equal(2);

        createFunc.callCount.should.equal(2);
        updateFunc.callCount.should.equal(2);

        results.createResults[0].should.equal('created!');
        results.createResults[1].should.equal('created!');

        results.updateResults[0].should.equal('updated!');
        results.updateResults[1].should.equal('updated!');
        done();
      })
      .then(null, done);
  });

  it('should call delete on all the documents in the feed', function(done) {
    var createFunc = sinon.stub().returns(q.when('created!'));
    var updateFunc = sinon.stub().returns(q.when('updated!'));
    var deleteFunc = sinon.stub().returns(q.when('deleted!'));
    var loader = FunctionalLoader({
      create: createFunc,
      update: updateFunc,
      delete: deleteFunc
    });
    var data = {
      create: [1, 2],
      update: [3, 4],
      delete: [5, 6]
    };
    loader.load(data)
      .then(function(results) {
        results.createResults.length.should.equal(2);
        results.updateResults.length.should.equal(2);
        results.deleteResults.length.should.equal(2);

        createFunc.callCount.should.equal(2);
        updateFunc.callCount.should.equal(2);
        deleteFunc.callCount.should.equal(2);

        results.createResults[0].should.equal('created!');
        results.createResults[1].should.equal('created!');

        results.updateResults[0].should.equal('updated!');
        results.updateResults[1].should.equal('updated!');

        results.deleteResults[0].should.equal('deleted!');
        results.deleteResults[1].should.equal('deleted!');
        done();
      })
      .then(null, done);
  });

  it('should have the same results when async is set to false', function(done) {
    var createFunc = sinon.stub().returns('created!');
    var updateFunc = sinon.stub().returns('updated!');
    var deleteFunc = sinon.stub().returns('deleted!');
    var loader = FunctionalLoader({
      create: createFunc,
      update: updateFunc,
      delete: deleteFunc,
      async: false
    });
    var data = {
      create: [1, 2],
      update: [3, 4],
      delete: [5, 6]
    };
    loader.load(data)
      .then(function(results) {
        results.createResults.length.should.equal(2);
        results.updateResults.length.should.equal(2);
        results.deleteResults.length.should.equal(2);

        createFunc.callCount.should.equal(2);
        updateFunc.callCount.should.equal(2);
        deleteFunc.callCount.should.equal(2);

        results.createResults[0].should.equal('created!');
        results.createResults[1].should.equal('created!');

        results.updateResults[0].should.equal('updated!');
        results.updateResults[1].should.equal('updated!');

        results.deleteResults[0].should.equal('deleted!');
        results.deleteResults[1].should.equal('deleted!');
        done();
      })
      .then(null, done);
  });
});
