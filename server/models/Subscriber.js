const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const subscribeSchema = mongoose.Schema({
    userTo: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    userFrom: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true 
    }

}, {timestamps:true}) //만든날짜 저장

const Subscriber = mongoose.model('Subscriber', subscribeSchema);

module.exports = {Subscriber }