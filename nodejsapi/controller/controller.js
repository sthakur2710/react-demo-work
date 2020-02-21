var User_master_imp = require("../models/model");
const passport = require("passport");

var user_detail_tbl = User_master_imp.Register_master;

const http = require("http");
const express = require("express");

require("./passport");

const bcrypt = require("bcrypt");
var jwt = require("jwt-simple");
var moment = require("moment");

exports.create = async (req, res) => {
  console.log("req data", req.body);

  if (!req.body.name) {
    return res.status(400).send({
      msg: "name is required"
    });
  }
  if (!req.body.email) {
    return res.status(400).send({
      msg: "Email is required"
    });
  }
  if (!req.body.password) {
    return res.status(400).send({
      msg: "Password is required"
    });
  }
  if (!req.body.phone) {
    return res.status(400).send({
      msg: "Phone is required"
    });
  }

  let get_data = await user_detail_tbl.findOne({ email: req.body.email });

  if (get_data) {
    return res.status(200).send({
      msg: "User already exist",
      status: "already"
    });
  }

  var password = bcrypt.hashSync(req.body.password, 10);

  const userMaster = new user_detail_tbl({
    name: req.body.name || "",
    email: req.body.email || "",
    password: password,
    phone: req.body.phone
  });

  userMaster
    .save()
    .then(data => {
      return res.status(200).send({
        msg: "Registration successfully completed",
        status: "no"
      });
    })
    .catch(err => {
      console.log("err got it", err);
      res.status(500).send({
        msg: err.message
      });
    });
};

// exports.login = (req, res) => {
//   console.log(req.body);

//   console.log("dir path", __dirname + "../");
//   if (!req.body.email) {
//     return res.status(400).send({
//       msg: "email is required"
//     });
//   }
//   if (!req.body.password) {
//     return res.status(400).send({
//       msg: "password is required"
//     });
//   }
//   var password = bcrypt.hashSync(req.body.password, 10);

//   user_detail_tbl.findOne({ email: req.body.email }, function(err, user) {
//     if (err) return res.status(500).send("Error on the server.");
//     if (!user) return res.status(404).send("No user found.");
//     console.log("user get now", user);
//     console.log(password);
//     if (bcrypt.compareSync(req.body.password, user.password)) {
//       app.set("jwtTokenSecret", "hiibro");

//       var expires = moment()
//         .add(7, "days")
//         .valueOf();
//       console.log("expire", expires);
//       console.log("user id ", user.id);
//       console.log("expires", expires);
//       console.log(app.get("jwtTokenSecret"));

//       console.log(app.settings);
//       var token = jwt.encode(
//         {
//           iss: user.id,
//           exp: expires
//         },
//         app.get("jwtTokenSecret")
//       );
//       console.log("get token", token);

//       res
//         .status(200)
//         .send({ msg: "Login SUCCEESSFULLY", data: user, token: token });
//     } else {
//       res.status(404).send("No user found.");
//     }
//   });
// };

exports.admin_login = (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({
      msg: "email is required"
    });
  }
  if (!req.body.password) {
    return res.status(400).send({
      msg: "password is required"
    });
  }

  adminLoginDetails_data.findOne({ email: req.body.email }, function(
    err,
    user
  ) {
    if (err) return res.status(500).send("Error on the server.");
    if (!user) return res.status(404).send("No user found.");
    // if (bcrypt.compareSync(req.body.password, user.password)) {
    // app.set("jwtTokenSecret", "hiibro");

    var expires = moment()
      .add(7, "days")
      .valueOf();
    console.log("expire", expires);
    console.log("user id ", user.id);
    console.log("expires", expires);

    var token = jwt.encode(
      {
        iss: user.id,
        exp: expires
      },
      "hiibro"
    );
    console.log("get token", token);

    res
      .status(200)
      .send({ msg: "Login SUCCEESSFULLY", data: user, token: token });
    // } else {
    //   res.status(404).send("No user found.");
    // }
  });
};

exports.login = async (req, res, next) => {
  // console.log("dir path", __dirname + "../");
  if (!req.body.email) {
    return res.status(400).send({
      msg: "email is required"
    });
  }
  if (!req.body.password) {
    return res.status(400).send({
      msg: "password is required"
    });
  }
  var password = bcrypt.hashSync(req.body.password, 10);

  var email = req.body.email;
  var password = req.body.password;

  var user = {};
  user = req.body;

  passport.authenticate("login", async (err, user, info) => {
    // console.log('check hua he local strategy', user)
    try {
      if (err || !user) {
        //return next(err);
        const error = new Error("An Error occurred");
      }
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          var expires = moment()
            .add(7, "days")
            .valueOf();

          var token = jwt.encode(
            {
              iss: user.id,
              exp: expires
            },
            "hiibro"
          );

          return res.status(200).json({
            token: token,
            msg: "Login Successfully"
          });
        } else {
          return res.status(200).json({
            msg: "Invalid Password"
          });
        }
      } else {
        return res.status(200).json({
          msg: "No user found"
        });
      }
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

exports.verify_token = (req, res, next) => {
  var token = req.headers.authorization;
  console.log("get token");

  passport.authenticate("jwt", { session: false }, async (err, user, info) => {
    console.log("check hua he jwt", user);
    try {
      if (err || !user) {
        //return next(err);
        const error = new Error("An Error occurred");
      }
      if (user) {
        res.send(user);
      } else {
        return res.status(200).json({
          msg: "no data found"
        });
      }
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
  // var decoded = jwt.decode(token, "hiibro");

  // res.send(decoded);
};
