const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    senha:{
        type: String,
        require: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);