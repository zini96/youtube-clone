const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");


const { Comment } = require("../models/Comment");

//=================================
//             Comment
//=================================

//api/comment/saveComment
router.post('/saveComment', (req, res)=>{
    const comment = new Comment(req.body)

    comment.save((err, comment)=>{
        if(err) return res.json({success:false, err})

        //populate('writer')를 save내에서 바로 사용할 수 없어서 writer의 다른 정보(id를 제외한)를 불러올때 다른 방법을 사용해야한다.
        Comment.find({'_id': comment._id})
            .populate('writer')
            .exec((err,result)=>{
                if(err) return res.json({success: false, err})
                res.status(200).json({success:true, result})
            })
    })
})

//api/comment/getComments
router.post('/getComments', (req, res)=>{
    Comment.find({"postId" : req.body.videoId})
        .populate('writer')
        .exec((err,comments)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({success:true, comments})
        })
})

//비디오 삭제되면 해당 postId에 작성된 댓글도 일괄삭제 시키기
//코멘트 삭제하기
//deletevideo
// router.post('/deletevideo', (req, res)=>{
//     //비디오id를 받아서 서버에서 삭제
//     Video.findOneAndDelete({"_id" : req.body.videoId})
//         .exec((err,doc)=>{
//             if(err) return res.status(400).json({success: false, err})
//             res.status(200).json({success:true})
//         })
// })

module.exports = router;