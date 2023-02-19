const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sauceController = require("../controllers/sauce");
const router = express.Router();

//all routes / all CRUD process to sauce  are  authentificated
router.get("/", auth, sauceController.readSauce);
router.get("/:id", auth, sauceController.readSingleSauce);
router.post("/", auth, multer, sauceController.createSauce);
router.put("/:id", auth, multer, sauceController.updateSauce);
router.delete("/:id", auth, sauceController.deleteSauce);
router.post("/:id/like", auth, sauceController.likeStatus);
module.exports = router;
