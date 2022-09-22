const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");


const { Subscriber } = require("../models/Subscriber");
const { User } = require('../models/User');

//=================================
//             Subscribe
//=================================

//api/subscribe/subscribeNumber
router.post('/subscribeNumber', (req, res)=>{
    Subscriber.find({'userTo': req.body.userTo})
        .exec((err, subscribe)=>{
            if(err) return res.status(400).send(err);
            return res.status(200).json({success:true, subscribeNumber: subscribe.length})
        })
})

//api/subscribe/subscribed
router.post('/subscribed', (req, res)=>{
    Subscriber.find({'userTo': req.body.userTo, 'userFrom': req.body.userFrom})
    .exec((err, subscribe)=>{
        if(err) return res.status(400).send(err);

        let result=false
        if(subscribe.length !== 0){  //sub.length가 0인 경우 내가 해당 유저를 구독하고 있지 않음을 의미, 그러므로 0이 아닌 경우 구독결과는 true로 변경
            result = true
        }

        res.status(200).json({success:true, subscribed: result})
    })
})

//구독취소
router.post('/unSubscribe', (req, res)=>{
    // console.log(req.body)

    Subscriber.findOneAndDelete({userTo: req.body.userTo, userFrom: req.body.userFrom})
        .exec((err,doc)=>{
            if(err) return res.status(400).json({success: false, err})
            res.status(200).json({success:true, doc})
        })
})

//구독
router.post('/subscribe', (req, res)=>{
    const subscribe = new Subscriber(req.body);

    subscribe.save((err,doc)=>{
        if(err) return res.json({success: false, err})
        res.status(200).json({success: true})
    })
})

//내가 구독중인 사람들의 정보 찾아서 그 사람들 정보 사용하기
//api/subscribe/getSubscriber
router.post('/getSubscriber', (req, res)=>{
    Subscriber.find({'userFrom': req.body.userFrom})
        .populate('writer')
        .exec((err, subscriberInfo)=>{
            if(err) return res.status(400).send(err);
            // return res.status(200).json({success:true, subscribe})

            let subscribedUser = [];

            subscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo);
            })

            User.find({ _id: subscribedUser })
                .populate('writer')
                .exec((err, result) => {
                    if (err) return res.json({ success: false, err })
                    res.status(200).json({ success: true, result })
                })

        })
})


module.exports = router;