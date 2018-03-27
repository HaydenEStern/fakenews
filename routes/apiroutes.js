var articleController = require('../controllers/articlecontroller.js'),
commentController = require('../controllers/commentcontroller.js');
var db = require('../models');
const express = require("express");

const router = express.Router();

// Routes
// =============================================================


router.get('/', function(req,res){
  res.redirect('articles');
}); 

  // GET route for scraping articles
router.get('/scrape', articleController.scrapeArticles);
router.get('/articles', articleController.getArticles);
router.get('articles/:id', articleController.viewComments);
router.post('articles/:id', articleController.createComment);


module.exports = router;
