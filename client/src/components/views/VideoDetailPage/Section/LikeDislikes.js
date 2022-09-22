import React, { useEffect, useState } from 'react';
import {Tooltip, Icon} from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {
    const [Likes, setLikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [Dislikes, setDislikes] = useState(0)
    const [DislikeAction, setDislikeAction] = useState(null)

    let variable ={ }

    // console.log(localStorage.getItem('userId'))

    if(props.video){
        variable = {videoId: props.videoId, userId:localStorage.getItem('userId')}
    }else{
        variable = {commentId:props.commentId, userId:localStorage.getItem('userId')}
    }

    useEffect(()=>{

        Axios.post('/api/like/getLikes', variable)
            .then(response=>{
                if(response.data.success){
                    //console.log(response.data.likes)

                    //얼마나 많은 좋아요를 받았는가
                    setLikes(response.data.likes.length)

                    //내가 이미 좋아요를 눌렀는가
                    response.data.likes.map(like => {
                        if(like.userId === props.userId){
                            setLikeAction('liked')
                        }
                    })
                }else{
                    alert('Likes 정보를 가져오지 못했습니다.')
                }
            })

            Axios.post('/api/like/getDislikes', variable)
            .then(response=>{
                if(response.data.success){
                    //console.log(response.data.likes)

                    //얼마나 많은 싫어요를 받았는가
                    setDislikes(response.data.dislikes.length)

                    //내가 이미 싫어요를 눌렀는가
                    response.data.dislikes.map(dislike => {
                        if(dislike.userId === props.userId){
                            setDislikeAction('disliked')
                        }
                    })
                }else{
                    alert('Dislikes 정보를 가져오지 못했습니다.')
                }
            })
    },[])

    const onLike = ()=>{
        if(LikeAction === null){
            //클릭이 되어있지 않을때
            Axios.post('/api/like/upLike', variable)
                .then(response=>{
                    if(response.data.success){
                        setLikes(Likes + 1)
                        setLikeAction('liked')

                        //Dislike가 먼저 클릭이 되어있었던 경우
                        if(DislikeAction !== null){
                            setDislikeAction(null)
                            setDislikes(Dislikes - 1)
                        }
                    }else{
                        // alert('Like를 올리지 못했습니다.')
                        console.log(response.data.err)
                    }
                })
        }else{
            //클릭이 되어있을때(좋아요 취소)
            Axios.post('/api/like/unLike', variable)
            .then(response=>{
                if(response.data.success){
                    setLikes(Likes -1)
                    setLikeAction(null)
                }else{
                    alert('Like를 취소하지 못했습니다.')
                }
            })
        }
    }

    const onDisLike = () => {
        if (DislikeAction === null) {
            //클릭이 되어있지 않을때
            Axios.post('/api/like/upDislike', variable)
                .then(response => {
                    if (response.data.success) {
                        setDislikes(Dislikes + 1)
                        setDislikeAction('disliked')

                        //like가 먼저 클릭이 되어있었던 경우
                        if (LikeAction !== null) {
                            setLikeAction(null)
                            setLikes(Likes - 1)
                        }
                    } else {
                        alert('DisLike를 올리지 못했습니다.')
                    }
                })
        } else {
            //클릭이 되어있을때(좋아요 취소)
            Axios.post('/api/like/unDislike', variable)
                .then(response => {
                    if (response.data.success) {
                        setDislikes(Dislikes - 1)
                        setDislikeAction(null)
                    } else {
                        alert('Dislike를 취소하지 못했습니다.')
                    }
                })
        }
    }


    return (
        <div>
            {/* 좋아요 */}
            <span key="comment-basic-like" style={{marginRight:'5px'}}>
                <Tooltip title="Like">
                    <Icon 
                        type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
                <span style={{paddingLeft:'8px', cursor:'auto'}}> {Likes} </span>
            </span>

            {/* 싫어요 */}
            <span  key="comment-basic-dislike" style={{marginRight:'10px'}}>
                <Tooltip title="Disike">
                    <Icon 
                        type="dislike"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDisLike}
                    />
                </Tooltip>
                <span style={{paddingLeft:'8px', cursor:'auto'}}> {Dislikes} </span>
            </span>
        </div>
    );
}

export default LikeDislikes;