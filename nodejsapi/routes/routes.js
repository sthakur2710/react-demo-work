const controller_data = require('../controller/controller')

const express = require('express');   
// app.use(passport.initialize());
// app.use(passport.session());      
// require('../redux-crud/uploads/')


module.exports = (app)=> {
    app.post('/create', controller_data.create);
    app.post('/login',controller_data.login);
    app.post('/verify_token', controller_data.verify_token);
}