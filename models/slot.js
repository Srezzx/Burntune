var mongoose = require("mongoose");

var SlotSchema = new mongoose.Schema({
    date:String,
    time_from:String,
    time_to:String,
    limit:Number,
    instrument:String,
    students:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

});

module.exports = mongoose.model("Slot", SlotSchema);