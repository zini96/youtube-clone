/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  // console.log(window.location.pathname === "/video/upload")

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode} style={{position:'absolute', right:'1rem'}}>
        <Menu.Item key="mail">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode} className="menubox" >
        <Menu.Item key="upload" style={{width:'82px'}} className='addVideoBtn'>
          <a href="/video/upload" className='videoAddBtn'>            
            {window.location.pathname === "/video/upload" ?
              <img src={process.env.PUBLIC_URL + '/addBlack.png'} style={{ width: '100%'}} /> :
              <img src={process.env.PUBLIC_URL + '/addTransparent.png'} style={{ width: '100%' }}
              />}
          </a>
        </Menu.Item>
        <Menu.Item key="logout"  style={{width:'82px'}}>
          <a onClick={logoutHandler}>
            <img src='https://st.depositphotos.com/66680222/57546/v/380/depositphotos_575468830-stock-illustration-eps10-red-vector-login-icon.jpg?forcejpeg=true' style={{ width: '100%' }}/>
          </a>
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(RightMenu);

