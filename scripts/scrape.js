const cheerio = require("cheerio");
const axios = require("axios");

var scrape = function() {

     // then use request to take in the body of the page's html
    return axios.get("http://www.reductress.com").then(function(res) {

      // load the body into cheerio's shorthand
      var $ = cheerio.load(res.data);

      // and make an empty object to save our article info
      var articles = [];

      // now, find each element that has the "theme-summary" class 
      // (i.e, the section holding the articles)
      $('article').each(function(i, element){

        // the text of any enclosed child elements with the story-heading class
        // will be saved to the head variable

        var scrapedTitle = $(this).children("a").children("h1").text();
        // the text of any enclosed child elements with the summary class
        // will be saved to the sum variable

        var scrapedLink = $(this).children("a").attr("href");

        // So long as our headline and sum aren't empty strings, do the following
        if (scrapedTitle !== "" && scrapedLink !== ""){

          var toAdd = {
            title: scrapedTitle,
            link: scrapedLink
          }
          articles.push(toAdd);
        }
      });
return articles;
    });
  };

module.exports = scrape;

