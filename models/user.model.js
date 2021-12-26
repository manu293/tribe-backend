// imoprts
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: Number, required: true},
    password: {type: String, required: true},
});

module.exports = mongoose.model("user", userSchema);