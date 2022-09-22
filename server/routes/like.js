const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");


const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

//=================================
//             Like
//=================================

//'/api/like/getLikes'
router.post('/getLikes', (req, res)=>{
    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId,userId:req.body.userId}
    }else{
        variable = {commentId: req.body.commentId,userId:req.body.userId}
    }

    Like.find(variable)
        .exec((err, likes)=>{
            if(err) return res.status(400).send(err)
            res.status(200).json({success:true, likes})
        })
})

//api/like/getDislikes
router.post('/getDislikes', (req, res)=>{
    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId,userId:req.body.userId}
    }else{
        variable = {commentId: req.body.commentId,userId:req.body.userId}
    }

    Dislike.find(variable)
        .exec((err, dislikes)=>{
            if(err) return res.status(400).send(err)
            res.status(200).json({success:true, dislikes})
        })
})

//'/api/like/upLike'
router.post('/uplike', (req, res)=>{
    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId:req.body.userId}
    }else{
        variable = {commentId: req.body.commentId, userId:req.body.userId}
    }

    //Like collection에 클릭 정보 넣어주기
    const like = new Like(variable)

    like.save((err, likeResult)=>{
        if(err) return res.json({success:false, err})


        //만약 Dislike가 먼저 클릭되어 있었다면, Dislike를 줄이기
        Dislike.findOneAndDelete(variable)
            .exec((err, dislikeResult)=>{
                if(err) return res.status(400).json({success:false, err})
                res.status(200).json({success:true})
            })
    })
})


//'/api/like/unLike'
router.post('/unlike', (req, res)=>{
    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId:req.body.userId}
    }else{
        variable = {commentId: req.body.commentId, userId:req.body.userId}
    }

    //save된 like를 없애주기
    Like.findOneAndDelete(variable)
        .exec((err, result)=>{
            if(err) return res.status(400).json({success:false, err})
            res.status(200).json({success:true})
        })
})

//'/api/like/upDislike'
router.post('/upDislike', (req, res)=>{
    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId:req.body.userId}
    }else{
        variable = {commentId: req.body.commentId, userId:req.body.userId}
    }

    //Dislike collection에 클릭 정보 넣어주기
    const dislike = new Dislike(variable)

    dislike.save((err, dislikeResult)=>{
        if(err) return res.json({success:false, err})

        //만약 like가 먼저 클릭되어 있었다면, like를 줄이기
        Like.findOneAndDelete(variable)
            .exec((err, likeResult)=>{
                if(err) return res.status(400).json({success:false, err})
                res.status(200).json({success:true})
            })
    })
})

//'/api/like/unDislike'
router.post('/unDislike', (req, res)=>{
    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId:req.body.userId}
    }else{
        variable = {commentId: req.body.commentId, userId:req.body.userId}
    }

    //save된 dislike를 없애주기
    Dislike.findOneAndDelete(variable)
        .exec((err, result)=>{
            if(err) return res.status(400).json({success:false, err})
            res.status(200).json({success:true})
        })
})

module.exports = router;