
var router = require("express").Router();
var scrapeController = require("../../controllers/scrapecontroller");

router.get("/", scrapeController.scrapeArticles);

module.exports = router;

