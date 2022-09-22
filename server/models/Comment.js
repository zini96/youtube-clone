const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    writer:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true //로그인되었을때만 댓글 달 수 있게 하기
    },
    postId:{
        type: Schema.Types.ObjectId,
        ref:'Video'
    },
    responseTo:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    content:{
        type:String
    }

}, {timestamps:true}) //만든날짜 저장

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment }