"use strict";

/**
 * Set of promise functions for handling general CRUD operations
 */

/**
 * Get all documents from the collection
 *
 * @param model: the model/collection
 * REQUIRED: {
 *
 * }
 */
exports.getAll = (request, response, next, model) => {
  model
    .find()
    .then((query) => response.json(query))
    .catch(next);
};

/**
 * Get by ID...
 *
 *  @param model: the model/collection
 * REQUIRED: {
 *   request.params.id
 * }
 */
exports.get = (request, response, next, model) => {
  const query = model.findById(request.params.id).exec();
  query
    .then((resource) => {
      if (!resource) {
<<<<<<< HEAD
        return next("errors.RESOURCE_NOT_FOUND()");
=======
        return next(new Error("resource not found"));
>>>>>>> 6290b6e0de70af3b82c7c16f9cedb4c0a72dca97
      }

      return response.json(resource);
    })
    .catch((err) => {
      // send the error to the error handler
      return next(err);
    });
};

/**
 * Create new document
 *
 *  @param model: the model/collection
 * REQUIRED: {
 *  request.body MUST CONTAINS REQUIRED FIELDS
 * }
 */
exports.create = (request, response, next, model) => {
  const obj = model.create(request.body);
  obj
    .then((resource) => {
      return response.json(resource);
    })
    .catch((err) => {
      // send the error to the error handler
      return next(err);
    });
};

exports.update = (request, response, next, model) => {
  const obj = model.findById(request.params.id);
  obj
    .then((resource) => {
      if (!resource) {
<<<<<<< HEAD
        return next("errors.RESOURCE_NOT_FOUND()");
=======
        return next(new Error("resource not found"));
>>>>>>> 6290b6e0de70af3b82c7c16f9cedb4c0a72dca97
      }

      // loop over the object and update the properties
      Object.keys(request.body).forEach((prop) => {
        resource[prop] = request.body[prop];
      });

      // save
      return resource.save();
    })
    .then((resource) => response.json(resource))
    .catch((err) => {
      // send the error to the error handler
      return next(err);
    });
};

exports.delete = (request, response, next, model) => {
  const obj = model.findById(request.params.id);
  obj
    .then((resource) => {
      // resource not found, let's throw an error
      if (!resource) {
<<<<<<< HEAD
        return next("errors.RESOURCE_NOT_FOUND()");
=======
        return next(new Error("resource not found"));
>>>>>>> 6290b6e0de70af3b82c7c16f9cedb4c0a72dca97
      }

      return resource.remove();
    })
    .then(() =>
      response.json({ message: `Resource ${request.params.id} deleted` })
    )
    .catch((err) => {
      // send the error to the error handler
      return next(err);
    });
};
