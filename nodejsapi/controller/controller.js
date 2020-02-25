var User_master_imp = require("../models/model");
const passport = require("passport");
const fetch = require("node-fetch");
var user_detail_tbl = User_master_imp.Register_master;
var hostel_tbl = User_master_imp.Hostel_master;

const http = require("http");
const express = require("express");

require("./passport");

const bcrypt = require("bcrypt");
var jwt = require("jwt-simple");
var moment = require("moment");

//------------user registraion api--------------------

exports.create = async (req, res) => {
  let get_data = await user_detail_tbl.findOne({ email: req.body.email });

  if (get_data) {
    return res.status(400).send({
      msg: "User already exist"
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
        msg: "Registration successfully completed"
      });
    })
    .catch(err => {
      res.status(500).send({
        msg: err.message
      });
    });
};

//---------------user login api-----------------

exports.login = async (req, res, next) => {
  var email = req.body.email;
  var password = bcrypt.hashSync(req.body.password, 10);

  var user = {};
  user = req.body;

  passport.authenticate("login", async (err, user, info) => {
    try {
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
          return res.status(400).json({
            msg: "Please enter valid password"
          });
        }
      } else {
        return res.status(400).json({
          msg: "Please enter valid email id"
        });
      }
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

//---------------google login verify api------------
exports.verify_token = async (req, res, next) => {
  const { OAuth2Client } = require("google-auth-library");
  const CLIENT_ID ="481371617706-sno5u5se3pi4rug0o9lt6400qbbnuj79.apps.googleusercontent.com";
  const client = new OAuth2Client(CLIENT_ID);
  const token = req.params.id;
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    console.log("google id get", userid);
    if (userid) {
      let get_details = await fetch(
        "https://oauth2.googleapis.com/tokeninfo?id_token=" + token
      );
      let data = await get_details.json();
      return res.status(200).json({
        msg: "User verified successfully",
        data: data
      });
    } else {
      return res.status(400).json({
        msg: "Not verified user"
      });
    }
  }
  verify().catch(console.error);
};

//-------------create hotel details api------------

exports.create_hotel_details = async (req, res) => {
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
      res.status(200).send({
        msg: "Hotel details created successfully",
      });
    })
    .catch(err => {
      res.status(500).send({
        msg: err.message
      });
    });
};

//-----------------delete hotel details api---------------

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
      if (data) {
        res.status(200).send({
          data: data
        });
      } else {
        res.status(400).send({
          data: 'No data found'
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
      res.status(200).send({
        hotel_details: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving data."
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
        phone: req.body.phone
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
      res.status(500).send({
        msg: err.message
      });
    });
};
