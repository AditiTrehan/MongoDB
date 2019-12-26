var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/database_name');

var mongoSchema = mongoose.Schema;

var userSchema = {
    "userEmail": String,
    "userPassword":String
}

module.exports = mongoose.model('userLogin',userSchema)