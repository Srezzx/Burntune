var mongoose = require("mongoose");

var SlotSchema = new mongoose.Schema({
    date:String,
    time:String,
    limit:Number,
    instrument:String,
    students:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

});

module.exports = mongoose.model("Slot", SlotSchema);