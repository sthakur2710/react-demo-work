var User_master_imp = require("../models/model");
var user_detail_tbl = User_master_imp.Register_master;

const passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
var jwt = require('jsonwebtoken');   
var JWTStrategy = require('passport-jwt').Strategy,
ExtractJWT = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme('JWT'),
opts.secretOrKey = 'hiibro';

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
User.findById(id, function(err, user) {
    done(err, user);
});
});

passport.use("jwt",new JWTStrategy(opts, function(jwt_payload, done) {
  console.log('now failed result now') 

}));

passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email"
      },
      function(email, password, done) {
          console.log(email, 'here is login strategy')
        user_detail_tbl.findOne(
          {
            email: email
          },
          function(err, user) {
            if (err) {
              return done(err);
            }
            if (!user) {
              return done(null, false, {
                message: "User not found"
              });
            }
            return done(null, user);
          }
        );
      }
    )
  );
