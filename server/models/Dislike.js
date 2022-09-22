const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const dislikeSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true 
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref:'Comment'
    },
    videoId:{
        type: Schema.Types.ObjectId,
        ref:'Video'
    }
}, {timestamps:true}) //만든날짜 저장

const Dislike = mongoose.model('Dislike', dislikeSchema);

module.exports = { Dislike }