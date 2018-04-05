var exports = module.exports = {};
var db = require("../models");

exports.findOne = function(req, res) {
    db.Comment
            .findOne(req.query)
            .then(function(dbComment) {
                res.json(dbComment);
            })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

}

exports.create = function(req, res) {
    db.Comment
        .create(req.body)
        .then(function(dbComment) {
            res.json(dbComment);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
};

exports.delete = function(req, res) {
    db.Comment
        .remove({ _id: req.params.id })
        .then(function(dbComment) {
            res.json(dbComment);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
};