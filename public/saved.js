

/* global bootbox */
$(document).ready(function() {
  var articleContainer = $(".article-container");
  // Add event listeners for dynamically generated buttons for deleting articles,
  // pulling up/saving/deleting article comments
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.comment", handleArticleComments);
  $(document).on("click", ".btn.save", handleCommentSave);
  $(document).on("click", ".btn.comment-delete", handleCommentDelete);

  // initPage kicks everything off when the page is loaded
  initPage();

  function initPage() {
    // Empty the article container, run an AJAX request for any saved headlines
    articleContainer.empty();
    $.get("/api/articles?saved=true").then(function(data) {
      // If we have headlines, render them to the page
      if (data && data.length) {
        renderArticles(data);
      }
      else {
        // Otherwise render a message explaing we have no articles
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {

    var articlePanels = [];

    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }

    articleContainer.append(articlePanels);
  }

  function createPanel(article) {

    var panel = $(
      [
        "<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        "<a class='article-link' target='_blank' href='" + article.link + "'>",
        article.title,
        "</a>",
        "<a class='btn btn-danger delete'>",
        "Delete From Saved",
        "</a>",
        "<a class='btn btn-info comment'>Article Comments</a>",
        "</h3>",
        "</div>",
        "</div>"
      ].join("")
    );
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to remove or open notes for
    panel.data("_id", article._id);
    // We return the constructed panel jQuery element
    return panel;
  }

  function renderEmpty() {

    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>No one has saved any articles yet.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>Want to browse unsaved articles?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a href='/'>Browse Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }

  function renderCommentsList(data) {

    var commentsToRender = [];
    var currentComment;
    if (!data.comments.length) {
      currentComment = ["<li class='list-group-item'>", "No comments for this article yet.", "</li>"].join("");
      commentToRender.push(currentComment);
    }
    else {
      for (var i = 0; i < data.comments.length; i++) {
        currentComment = $(
          [
            "<li class='list-group-item comment'>",
            data.comments[i].commentText,
            "<button class='btn btn-danger comment-delete'>x</button>",
            "</li>"
          ].join("")
        );
        currentComment.children("button").data("_id", data.comments[i]._id);
        commentsToRender.push(currentComment);
      }
    }

    $(".comment-container").append(commentsToRender);
  }

  function handleArticleDelete() {

    var articleToDelete = $(this).parents(".panel").data();
    $.ajax({
      method: "DELETE",
      url: "/api/articles/" + articleToDelete._id
    }).then(function(data) {
      // If this works out, run initPage again which will rerender our list of saved articles
      if (data.ok) {
        initPage();
      }
    });
  }

  function handleArticleComments() {

    var currentArticle = $(this).parents(".panel").data();
    // Grab any comments with this headline/article id
    $.get("/api/comments/" + currentArticle._id).then(function(data) {
      var modalText = [
        "<div class='container-fluid text-center'>",
        "<h4>Comments For Article: ",
        currentArticle._id,
        "</h4>",
        "<hr />",
        "<ul class='list-group comment-container'>",
        "</ul>",
        "<textarea placeholder='New Comment' rows='4' cols='60'></textarea>",
        "<button class='btn btn-success save'>Save Comment</button>",
        "</div>"
      ].join("");
      // Adding the formatted HTML to the note modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var commentData = {
        _id: currentArticle._id,
        comments: data || []
      };
      // Adding some information about the article and article notes to the save button for easy access
      // When trying to add a new note
      $(".btn.save").data("article", commentData);
      // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
      renderCommentsList(commentData);
    });
  }

  function handleCommentSave() {

    var commentData;
    var newComment = $(".bootbox-body textarea").val().trim();
    if (newComment) {
      commentData = {
        _id: $(this).data("article")._id,
        commentText: newComment
      };
      $.post("/api/comments", commentData).then(function() {
        // When complete, close the modal
        bootbox.hideAll();
      });
    }
  }

  function handleCommentDelete() {
    // This function handles comment deletion
    var commentToDelete = $(this).data("_id");
    // Perform an DELETE request
    $.ajax({
      url: "/api/comments/" + commentToDelete,
      method: "DELETE"
    }).then(function() {
      // When done, hide the modal
      bootbox.hideAll();
    });
  }
});

