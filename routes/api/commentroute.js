var router = require("express").Router();
var commentController = require("../../controllers/commentcontroller");

router.get("/:id", commentController.findOne);
router.post("/", commentController.create);
router.delete("/:id", commentController.delete);

module.exports = router;

