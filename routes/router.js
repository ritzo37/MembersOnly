const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const passport = require("../config/passport");
const controller = require("../controller/main");
const validateUserNameAndPassword =
  require("../errorValidation").validateUserNameAndPassword;
const validateMessage = require("../errorValidation").validateMessage;
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/logged-in",
  })
);

router.get("/", controller.getHomePage);
router.get("/logged-in", controller.getLoggedinPage);
router.post("/sign-up", validateUserNameAndPassword, controller.addUser);
router.get("/sign-up", controller.getSignUpPage);
router.get("/log-in", controller.getLoginPage);
router.post("/log-out", controller.logout);
router.get("/add-message", controller.getAddMessagePage);
router.post("/add-message/:user", validateMessage, controller.addMessage);
router.post("/make-me-member/:username", controller.makeMember);
router.get("/make-me-member", controller.getMemberPage);
router.post("/delete-msg/:id", controller.deleteMessage);
module.exports = router;
