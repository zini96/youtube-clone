import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function SideVideo() {
    const [sideVideos, setSideVideos] = useState([])
    const [winSize, setWinSize] = useState(window.innerWidth);
    const aa = winSize > 992
    // console.log(aa)

    useEffect(()=>{
        Axios.get('/api/video/getVideos')
          .then(response=>{
            if(response.data.success){
                // console.log(response.data)
                setSideVideos(response.data.videos)
            }else{
              alert('비디오 가져오기를 실패했습니다.')
            }
          })
    },[])

    useEffect(()=>{
        const handleresize = ()=>{
            setWinSize(window.innerWidth)
        }

        window.addEventListener('resize', handleresize);
        return ()=>{
            window.removeEventListener('resize', handleresize)
        }
    },[])

    const renderSideVideo = sideVideos.map((video, index) => {
        var minutes = Math.floor(video.duration/60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <div key={index} style={{display: 'flex',marginTop:'1rem', marginBottom: '1rem', padding : aa ? '0 2rem' : '1rem 4rem'}}>
            {/* 영상 */}
            <div style={{ width: '50%', marginRight: '1rem'}}>
                <a href=''>
                    <img style={{ width: '100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                </a>
            </div>
            {/* 정보 */}
            <div style={{ width: '40%', lineHeight:aa ? '1rem' : '2rem' }}>
                <a href='' style={{color:'gray', fontSize: aa ? '0.6rem' : '1rem'}}>
                    <span style={{ fontWeight:'500', color:"black", fontSize: aa ? '0.8rem' : '1.2rem' }}>{video.title}</span><br />
                    <span>{video.writer.name}</span><br />
                    <span>{video.views} views</span><br />
                    <span>{minutes} : {seconds}</span>
                </a>
            </div>
        </div>
    })

    return (
        <React.Fragment>
            <div style={{marginTop:aa ? '3rem' : '1.5rem' }}/>
            {renderSideVideo}
        </React.Fragment>
    );
}

export default SideVideo;