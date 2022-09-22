const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId, //User models에서 user정보를 한번에 불러오기 위함 
        ref:"User",
        required: true 
    },
    title:{
        type: String,
        maxlength: 50
    },
    description:{
        type: String
    },
    Privacy:{
        type: Number
    },
    filePath:{
        type: String
    },
    category:{
        type: String
    },
    views:{
        type: Number,
        default:0
    },
    duration:{
        type:String
    },
    thumbnail:{
        type:String
    }


}, {timestamps:true}) //만든날짜 저장

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }