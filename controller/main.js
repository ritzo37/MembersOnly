const db = require("../db/query");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

async function getHomePage(req, res) {
  const messages = await db.getAllMessages();
  if (req.isAuthenticated()) {
    const adminCheck = await db.checkAdmin(req.session.passport.user);
    if (adminCheck) {
      res.render("homeadmin.ejs", { messages: messages });
    } else {
      const memberStatus = await db.checkMemberShip(req.session.passport.user);
      if (memberStatus) {
        res.render("homemember.ejs", { messages: messages });
      } else {
        res.render("homeuser.ejs", { messages: messages });
      }
    }
  } else {
    res.render("homeuser.ejs", { messages: messages });
  }
}

async function addUser(req, res, next) {
  const errors = validationResult(req).errors;
  if (errors.length) {
    console.log(errors);
    res.render("signup.ejs", { errors: errors });
  } else {
    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    try {
      await db.addUser(username, hash);
    } catch (err) {
      res.render("somethingwentwrong.ejs");
    }
    res.redirect("/");
  }
}

async function getSignUpPage(req, res) {
  res.render("signup.ejs", { errors: {} });
}

async function getLoginPage(req, res) {
  if (req.isAuthenticated()) {
    res.render("loggedin.ejs");
  } else {
    res.render("login.ejs");
  }
}

async function getLoggedinPage(req, res) {
  if (req.isAuthenticated()) {
    res.render("loggedin.ejs");
  } else {
    res.render("pleaselogin.ejs");
  }
}

function getAddMessagePage(req, res) {
  if (req.isAuthenticated()) {
    res.render("addmessage.ejs", {
      username: req.session.passport.user,
      errors: {},
    });
  } else {
    res.render("pleaselogin.ejs");
  }
}

function logout(req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

async function addMessage(req, res) {
  const username = req.params.user;
  const errors = validationResult(req).errors;
  if (errors.length) {
    res.render("addmessage.ejs", { username: username, errors: errors });
  } else {
    const { message } = req.body;
    db.addMessage(username, message);
    res.redirect("/");
  }
}
async function getMemberPage(req, res) {
  if (req.isAuthenticated()) {
    const username = req.session.passport.user;
    const status = await db.checkMemberShip(username);
    if (status) {
      res.render("alreadymember.ejs");
    } else {
      res.render("member.ejs", { username: username });
    }
  } else {
    res.render("pleaselogin.ejs");
  }
}

async function makeMember(req, res) {
  const { username } = req.params;
  const { secretpass } = req.body;
  if (secretpass === "Cat") {
    try {
      await db.makeMember(username);
    } catch {
      res.send("<h1>Something went wrong </h1>");
    }
    res.redirect("/");
  } else {
    res.render("tryagainmember.ejs");
  }
}

async function deleteMessage(req, res) {
  const messageid = req.params.id;
  const user = req.session.passport.user;
  const check = await db.checkAdmin(user);
  if (!check) {
    res.render("somethingwentwrong.ejs");
  } else {
    await db.deleteMessage(messageid);
    res.redirect("/");
  }
}

module.exports = {
  addUser,
  getSignUpPage,
  getLoginPage,
  getLoggedinPage,
  logout,
  getAddMessagePage,
  getHomePage,
  addMessage,
  getMemberPage,
  makeMember,
  deleteMessage,
};
