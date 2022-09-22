import React, { useEffect, useState } from 'react';
import {Row, Col, List, Avatar, Icon} from 'antd';
// import {LoadingOutlined } from "@ant-design/icons";
import Axios from 'axios';
import SideVideo from './Section/SideVideo';
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import Subscribe from './Section/Subscribe';
import Comment from './Section/Comment';
import LikeDislikes from './Section/LikeDislikes';
import VideoDelete from './Section/VideoDelete';

function VideoDetailPage(props) {
    const [VideoDetail, setVideoDetail] = useState([]);
    const [Visible, setVisible] = useState(false);
    const [Comments, setComments] = useState([])

    const videoId = props.match.params.videoId
    const variable = {videoId: videoId}

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    setVideoDetail(response.data.VideoDetail);
                    // console.log(response.data)
                    
                } else {
                    alert('비디오 정보를 가져오지 못했습니다.')
                }
            })

        Axios.post('/api/comment/getComments', variable)
            .then(response=>{
                if(response.data.success){
                    setComments(response.data.comments)
                }else{
                    alert('코멘트 정보를 가져오지 못했습니다.')
                }
            })
    },[])

    const refreshFunction=(newComment)=>{
        setComments(Comments.concat(newComment))
    }

    const str = String(VideoDetail.createdAt);
    const uploaddate = str.substring(0,10);



    if (VideoDetail.writer) {
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')}/>
        const videoDeleteButton = VideoDetail.writer._id === localStorage.getItem('userId') && <VideoDelete videoId={VideoDetail._id}/>

        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    {/* 메인 동영상 */}
                    <div style={{ width: '100%', padding: '3rem 3.5rem 4rem 3.5rem' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
                        <List.Item actions={[<LikeDislikes video userId={localStorage.getItem('userId')} videoId={videoId}/> , subscribeButton, videoDeleteButton]}>
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image}/>}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.title}
                            />
                            <button className='viewBtn' style={{border:'none', background:"transparent"}} onClick={()=> {setVisible(!Visible)}}>
                                {Visible ? <AiOutlineCaretUp/>: <AiOutlineCaretDown/>}
                            </button>
                        </List.Item>
                        {Visible &&
                            <div className='descBox' style={{width:'100%'}}>
                                <List.Item.Meta description={VideoDetail.description}/>
                                <p style={{marginTop:'1rem', marginBottom:'0'}}>{uploaddate}</p>
                            </div>
                        }

                        {/* 댓글 */}
                        <Comment refreshFunction={refreshFunction} commentLists={Comments} postId={videoId}/>

                    </div>
                </Col>
                <Col lg={6} xs={24} style={{boxShadow: 'rgb(204, 219, 232) 4px 4px 6px -5px inset'}}>
                    {/* 다른 동영상 */}
                    <SideVideo/>
                </Col>
            </Row>
        );
    } else {
        return (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                <Icon type="LoadingOutlined "/>
                Loading...
            </div>
        )
    }


}

export default VideoDetailPage;