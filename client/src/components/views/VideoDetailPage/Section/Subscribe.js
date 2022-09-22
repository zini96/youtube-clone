import Axios from 'axios';
import React, { useEffect, useState } from 'react';

function Subscribe(props) {
    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(()=>{
        let variable = {userTo:props.userTo}

        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if(response.data.success){
                    setSubscribeNumber(response.data.subscribeNumber);
                }else{
                    alert('구독자 수를 받아오지 못했습니다.')
                }
            })

        let subvariable = {userTo:props.userTo, userFrom: localStorage.getItem('userId')}
        
        Axios.post('/api/subscribe/subscribed', subvariable)
            .then(response=>{
                if(response.data.success){
                    setSubscribed(response.data.subscribed)
                }else{
                    alert('정보를 받아오지 못했습니다.')
                }
            })
    },[])

    const onSubscribe = () =>{
        let subscribeVariable = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }
        if(Subscribed){
            //이미 구독중이라면
            Axios.post('/api/subscribe/unSubscribe', subscribeVariable)
                .then(response =>{
                    if(response.data.success){
                        setSubscribeNumber(SubscribeNumber - 1 )
                        setSubscribed(!Subscribed)
                    }else{
                        alert('구독 취소를 실패했습니다.')
                    }
                })

        }else{
            //아직 구독중이 아니라면
            Axios.post('/api/subscribe/subscribe', subscribeVariable)
            .then(response =>{
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber + 1 )
                    setSubscribed(!Subscribed)
                }else{
                    alert('구독 신청에 실패했습니다.')
                }
            })
        }
    }

    return (
        <div>
            <button
                style={{backgroundColor:`${Subscribed ? '#AAAAAA'  :'#CC0000' }`, borderRadius:'4px', color:'white', padding: '8px 16px',
                        fontWeight:'500', fontSize:'1rem', textTransform:'uppercase', border:'none'
                }}
                onClick ={onSubscribe}
            >
               {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    );
}

export default Subscribe;