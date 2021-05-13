var mongoose = require("mongoose");

var HistorySchema = new mongoose.Schema({
    student:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
    slot:{ type: mongoose.Schema.Types.ObjectId, ref: "Slot" },
    mode:String,

});

module.exports = mongoose.model("History", HistorySchema);