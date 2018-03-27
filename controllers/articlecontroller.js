var db = require("../models"),
    scrape = require("../scripts/scrape");
const cheerio = require("cheerio");


exports.scrapeArticles = function(req, res) {
    // scrape the NYT
    return scrape()
        .then(function(articles) {
            // then insert articles into the db
            return db.Article.create(articles);
        })
        .then(function(dbHeadline) {
            if (dbHeadline.length === 0) {
                res.json({
                    message: "No new articles today. Check back tomorrow!"
                });
            } else {
                // Otherwise send back a count of how many new articles we got
                res.json({
                    message: "Added " + dbHeadline.length + " new articles!"
                });
            }
        })
        .catch(function(err) {
            // This query won't insert articles with duplicate headlines, but it will error after inserting the others
            res.json({
                message: "Scrape complete!!"
            });
        });
}

exports.getArticles = function(req, res) {
    // Grab every document in the Articles collection
    db.Article
        .find({})
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
};


exports.viewComments = function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article
        .findOne({ _id: req.params.id })
        // ..and populate all of the comments associated with it
        .populate("comment")
        .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

}

exports.createComment = function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Comment
        .create(req.body)
        .then(function(dbComment) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
        })
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
};