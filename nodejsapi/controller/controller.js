var User_master_imp = require("../models/model");
const passport = require("passport");

var user_detail_tbl = User_master_imp.Register_master;
var hostel_tbl = User_master_imp.Hostel_master;

const http = require("http");
const express = require("express");

require("./passport");

const bcrypt = require("bcrypt");
var jwt = require("jwt-simple");
var moment = require("moment");

exports.delete_hotel_details = async (req, res) => {
  var user_id = req.params.id;
  const del_status = await hostel_tbl.findOneAndRemove({
    _id: user_id
  });
  if (del_status) {
    res.status(200).send({
      msg: "Hotel details deleted successfully",
      data: del_status
    });
  } else {
    res.status(400).send({
      msg: "Not deleted"
    });
  }
};

exports.get_hotel_details_record = (req, res) => {
  var user_id = req.params.id;
  hostel_tbl
    .findOne({ _id: user_id })
    .then(data => {
      if (data == "") {
        res.send({ data: "no data found" });
      } else {
        res.status(200).send({
          msg: "Hotel details found successfully",
          data: data
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};

exports.get_hostel_details = (req, res) => {
  hostel_tbl
    .find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
      });
    });
};

exports.create_hotel_details = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      msg: "name is required"
    });
  }
  if (!req.body.location) {
    return res.status(400).send({
      msg: "Location is required"
    });
  }

  if (!req.body.phone) {
    return res.status(400).send({
      msg: "Phone is required"
    });
  }

  if (req.file) {
    console.log("Uploaded: ", req.file);
  } else throw "error";

  var appRoot = require("app-root-path");

  const path = req.file.path;
  const uniqueFilename = new Date().toISOString();

  const hostelMaster = new hostel_tbl({
    name: req.body.name || "",
    location: req.body.location,
    phone: req.body.phone,
    file: "uploads/" + req.file.filename
  });

  hostelMaster
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        msg: err.message
      });
    });
};

exports.update_hotel_details = (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      msg: "name is required"
    });
  }

  if (!req.body.phone) {
    return res.status(400).send({
      msg: "Phone is required"
    });
  }

  hostel_tbl
    .findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        phone:req.body.phone
      },
      { new: true }
    )
    .then(data => {
      res.status(200).send({
        msg: "Hotel details updated successfully",
        data: data
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        msg: err.message
      });
    });
};

exports.create = async (req, res) => {
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
      res.status(500).send({
        msg: err.message
      });
    });
};

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

    var token = jwt.encode(
      {
        iss: user.id,
        exp: expires
      },
      "hiibro"
    );

    res
      .status(200)
      .send({ msg: "Login SUCCEESSFULLY", data: user, token: token });
  });
};

exports.login = async (req, res, next) => {
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
    try {
      if (err || !user) {
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

  passport.authenticate("jwt", { session: false }, async (err, user, info) => {
    try {
      if (err || !user) {
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
};
