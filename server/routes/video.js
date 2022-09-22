const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const {Subscriber} = require("../models/Subscriber")
const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

//STORAGE MULTER CONFIG
    //destimation 파일 저장 경로 설정
    //filename file이름 설정
    //fileFilter 업로드 가능한 확장자 제한
let storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "uploads/");
    },
    filename:(req,file,cb)=>{
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req,file,cb)=>{
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const upload = multer({storage: storage}).single("file");

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res)=>{
    //req로 client에서 보내온 파일을 받아서 서버에 저장
    upload(req, res, err =>{
        if(err){
            return res.json({success:false, err})
        }
        return res.json({success:true, url: res.req.file.path, filename: res.req.file.filename})
    })
})

router.post('/uploadVideo', (req, res)=>{
    //비디오 정보 저장
    const video = new Video(req.body)
    
    video.save((err,doc)=>{
        if(err) return res.json({success:false, err})
        res.status(200).json({success:true})
    })
})

router.get('/getVideos', (req, res)=>{
    //DB에서 비디오 가져와서 클라이언트로 보내기
    //비디오 collection 내의 모든 비디오 가져오기
    Video.find() 
      .populate('writer')
      .exec((err,videos)=>{
        if(err) return res.status(400).send(err);
        res.status(200).json({success:true,videos})
      })
})

router.post('/getVideoDetail', (req, res)=>{
    //비디오 디테일 정보 가져오기
    Video.findOne({ "_id" : req.body.videoId})
      .populate('writer')
      .exec((err, VideoDetail)=>{
        if(err) return res.status(400).send(err)
        return res.status(200).json({success:true, VideoDetail})
      })
})

// '/api/video/getSubscriptionVideos'
router.post('/getSubscriptionVideos', (req, res) => {
    //현재 자신의 userId를 가지고 구독하는 사람들을 찾기
    Subscriber.find({ userFrom: req.body.userFrom })
        .exec((err, subscriberInfo) => {
            if (err) return res.status(400).send(err);

            //subscriberInfo => 내가 구독하는 사람들의 정보(userTo 정보들을 배열 형태로 담기)
            let subscribedUser = [];

            subscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo);
            })
            //내가 구독하는 사람들의 비디오를 가지고 온다
            //writer:req.body/id 형태는 한명(하나)만 특정해서 정보를 가져올때 사용 가능하니까 다르게
            Video.find({ writer: { $in: subscribedUser } }) //$in => mongoDB가 제공하는 해당하는 모든 정보를 가져오게 해주는 기능
                .populate('writer')
                .exec((err, videos) => {
                    if (err) return res.status(400).send(err);
                    return res.status(200).json({ success: true, videos })
                })
        })
})

router.post('/thumbnail', (req, res)=>{
    //썸네일 생성하고 비디오 러닝타임 가져오기

    let filePath = ""
    let fileDuration = ""

    //비디오 정보 가져오기
    ffmpeg.setFfmpegPath("C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe");
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });


    //썸네일 생성
    ffmpeg(req.body.url)//비디오 저장 경로
    .on('filenames', function (filenames){//썸네일 파일 이름 생성
        console.log('Will generate' + filenames.join(','))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end', function(){
        console.log('Screenshots taken');
        return res.json({success:true, url:filePath,fileDuration: fileDuration})
    })
    .on('error', function(err){
        console.error(err);
        return res.json({success:false, err});
    })
    .screenshots({//옵션
        count:3,//썸네일 개수
        folder:'uploads/thumbnails', 
        size:'320x240',
        filename:'thumbnail-%b.png'
        //%b: input basename(filename w/o extension)
    })

})

//비디오 삭제하기
//deletevideo
router.post('/deletevideo', (req, res)=>{
    //비디오id를 받아서 서버에서 삭제
    Video.findOneAndDelete({"_id" : req.body.videoId})
        .exec((err,doc)=>{
            if(err) return res.status(400).json({success: false, err})
            res.status(200).json({success:true})
        })
})

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


//비디오 검색하기
//실패! 좀 더 이해도가 쌓이면 다시 도전해야지


module.exports = router;