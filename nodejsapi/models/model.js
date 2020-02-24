const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    phone:String
}, {
    timestamps: true
})


const HostelSchema = mongoose.Schema({
    name:String,
    location:String,
    phone:String,
    file:String
}, {
    timestamps: true
})

UserSchema.methods.validPassword = function( pwd ) {
    console.log('ye he yaha par', pwd)
    console.log('this pwd', this.password)
    // EXAMPLE CODE!
    return ( this.password === pwd );
};

var user_define_module=mongoose.model('Register_master', UserSchema);
var Hostel_details_module=mongoose.model('Hostel_details', HostelSchema);


module.exports = {
    'Register_master': user_define_module,
    'Hostel_master':Hostel_details_module
} 
// module.exports = mongoose.model('User_master', UserSchema)
// module.exports = mongoose.model('User_rating', UserRating)
      