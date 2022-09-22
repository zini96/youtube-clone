import React from 'react';
import Axios from 'axios';
import { Popconfirm, message } from 'antd';
import { useHistory } from 'react-router-dom'

function VideoDelete(props) {
    const history = useHistory();
    const videoId = props.videoId
    const variable = {videoId: videoId}

    const onSubmit = () =>{
        Axios.post(`/api/video/deletevideo`, variable)
            .then(response => {
                if (response.data.success) {
                    message.success('비디오가 삭제되었습니다.')
    
                    setTimeout(()=>{
                        history.push('/')
                    },2000)
                    console.log(response.data)
                } else {
                    alert('비디오를 삭제하지 못했습니다.')
                }
            })
    }

    const confirm = (e) => {
        console.log(e);
        // message.error('Click on Yes');
        onSubmit(props.videoId);
    }
    
    const cancel = (e) => {
      console.log(e);
      message.error('Click on No');
    }

    return (
        <div>
            <button
                style={{
                    backgroundColor: 'black', borderRadius: '4px', color: 'white', padding: '8px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase', border: 'none'
                }}>
                <Popconfirm title="Are you sure delete this video?" onConfirm={confirm} onCancel={cancel} okText="Yes" cancelText="No">
                    Delete
                </Popconfirm>
            </button>


        </div>
    );
}

export default VideoDelete;