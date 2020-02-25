const controller_data = require('../controller/controller')
var multer  = require('multer')
var upload = multer({ dest: '../project_work/src/uploads/'});

var type = upload.single('file');
const express = require('express');

module.exports = (app)=> {
    app.post('/create', controller_data.create);
    app.post('/login',controller_data.login);
    app.put('/verify_token/:id', controller_data.verify_token);
    app.post('/create_hotel_details',type, controller_data.create_hotel_details)
    app.get('/get_hostel_details', controller_data.get_hostel_details)
    app.get('/delete_hotel_details/:id',controller_data.delete_hotel_details)
    app.get('/get_hotel_details_record/:id',controller_data.get_hotel_details_record)
    app.put('/update_hotel_details/:id', controller_data.update_hotel_details)
}