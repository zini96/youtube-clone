import React, { useEffect , useState} from 'react'
import {Card,  Avatar, Col, Typography, Row} from 'antd';
import Axios from 'axios';
import moment from'moment';
const {Title} = Typography;
const {Meta} = Card;

function SubscriptionPage() {
    const [Video, setVideo] = useState([])
    const [SubInfo, setSubInfo] = useState([])

    // console.log(Video);

    let updateArr = [];

    Video.map((videodate, i) => {
        updateArr.push(videodate.updatedAt);
    })

    // console.log(updateArr)
    
    const subscriptionVariables = {
        userFrom : localStorage.getItem('userId')
    }

    useEffect(()=>{
        Axios.post('/api/video/getSubscriptionVideos',subscriptionVariables)
          .then(response=>{
            if(response.data.success){
                // console.log(response.data.videos.length)
                setVideo(response.data.videos)
            }else{
              alert('내가 구독중인 사용자의 비디오 가져오기를 실패했습니다.')
            }
          })
    },[])

    useEffect(()=>{
        Axios.post('api/subscribe/getSubscriber', subscriptionVariables)
            .then(response => {
                if (response.data.success) {
                    // console.log(response.data.result)
                    setSubInfo(response.data.result);
                } else {
                    alert('구독자 수를 받아오지 못했습니다.')
                }
            })
    },[Video.length])
 

    const subscriberCards = SubInfo.map((info,i)=>{
        // console.log(info.image, info.name)
        return(
            <Col lg={3} md={4} xs={24} key={info._id}>
                <div style={{ display: 'flex', flexDirection:'column', alignItems:'center', marginBottom:'1rem' }}>
                    <Avatar src={info.image} />
                    <span>{info.name}</span>
                </div>
            </Col>
        )
    })
    
    const renderCards = Video.map((video,index)=>{
        var minutes = Math.floor(video.duration/60);
        var seconds = Math.floor((video.duration - minutes * 60));

        // Col 사이즈별로 들어가는 동영상이 다르게 설정 (총 윈도우 너비=24)
        return <Col lg={6} md={8} xs={24} key={index}>
            <a href={`/video/${video._id}`}>
                <div style={{ position: 'relative' }}>
                    <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="썸네일" />
                    <div className='duration'>
                        <span>{minutes} : {seconds}</span>
                    </div>
                </div>
            </a>
            <br />
            <Meta avatar={<Avatar src={video.writer.image} />} title={video.title} description="" />
            <span>{video.writer.name}</span><br/>
            <span style={{ marginLeft: '3rem' }}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
        </Col>
    })

    if(Video.length !== 0){
        return (
            <div style={{ width: '85%', margin: '3rem auto' }}>
                <Title level={2}>구독</Title>
                <hr style={{ marginBottom: '2rem' }} />
                <Row gutter={[32, 16]}>
                    {subscriberCards}
                </Row>
                <Row gutter={[32, 16]}>
                    {renderCards}
                </Row>
    
            </div>
        )
    }else{
        return(
            <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}>구독</Title>
            <hr style={{ marginBottom: '2rem' }} />
            <Row>
                <p style={{color:'gray', fontSize:'1rem'}}>현재 구독중인 페이지가 없습니다.</p>
            </Row>

        </div>
        )
    }


}

export default SubscriptionPage;

