'use strict';
var q = require('q');
var _ = require('lodash');

module.exports = function (options) {
  var _create, _update, _delete, _async;
  if (!_.isFunction(options.create)) {
    throw new Error('create function required in options');
  }
  if (options.async === false) {
    _async = false;
  } else {
    _async = true;
  }

  _create = options.create;
  _update = options.update;
  _delete = options.delete;

  var crudData = function (data, crudFunc) {
    var promise = q.when();
    var results = [];

    _.forEach(data, function (d) {
      promise = promise.then(function () {
        if (_async) {
          return crudFunc(d)
            .then(function (resultData) {
              results.push(resultData);
            });
        } else {
          return q.when(crudFunc(d))
            .then(function (resultData) {
              results.push(resultData);
            });
        }
      });
    });

    return promise.then(function () {
      return results;
    });
  };


  var load = function (data) {
    if (_.isUndefined(data) || _.isUndefined(data.create)) {
      throw new Error('no created data supplied');
    }
    var results = {};
    return crudData(data.create, _create)
      .then(function (createdData) {
        results.createResults = createdData;
        if (!_.isUndefined(data.update) && !_.isUndefined(_update)) {
          return crudData(data.update, _update);
        } else {
          return [];
        }
      })
      .then(function (updatedData) {
        results.updateResults = updatedData;
        if (!_.isUndefined(data.delete) && !_.isUndefined(_delete)) {
          return crudData(data.delete, _delete);
        } else {
          return [];
        }
      })
      .then(function (deletedData) {
        results.deleteResults = deletedData;
        return results;
      });
  };

  return {
    load: load
  };
};

