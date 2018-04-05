

var router = require("express").Router();
var scrapeRoutes = require("./scraper");
var commentRoutes = require("./commentroute");
var articleRoutes = require("./articleroute");

router.use("/scrape", scrapeRoutes);
router.use("/comments", commentRoutes);
router.use("/articles", articleRoutes);

module.exports = router;

