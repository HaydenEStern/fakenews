var db = require("../models");
var exports = module.exports = {};

exports.findAll = function(req, res) {
    db.Article
        .find(req.query)
        .sort({ date: -1 })
        .then(function(dbArticle) {
            res.json(dbArticle);
        }).catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
}

exports.update = function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true }).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
}

exports.delete = function(req, res) {
    // Grab every document in the Articles collection
    db.Article
        .remove({ _id: req.params.id }).then(function(dbArticle) {
            res.json(dbArticle);
        }).catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
};