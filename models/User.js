var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
	username: String,
	name:String,
	password: String,
	role: String,
	age:String,
	instrument:String,
	email:String,
	phno:String,
	//more input tags - optional
	website:String,
	facebook:String,
	youtube:String,
	instagram:String,
	twitter:String,
	pinterest:String,
	location:String,
	pursuing:String,

});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);