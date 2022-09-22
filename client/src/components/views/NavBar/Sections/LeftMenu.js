import React from 'react';
import { useSelector } from "react-redux";
import { Menu} from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


function LeftMenu(props) {
  const user = useSelector(state => state.user)

  if (user.userData && user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
      <Menu.Item key="subscription" style={{width:'75px'}}>
        <a href="/subscription">
          <img src={process.env.PUBLIC_URL + '/gallery.png'} style={{width:'100%'}} /> 
        </a>
      </Menu.Item>
    </Menu>
    )
  }else{
    return(<p></p>)
  }

}

export default LeftMenu



  // return (
  //   <Menu mode={props.mode}>
  //   {/* <Menu.Item key="mail">
  //     <a href="/">Home</a>
  //   </Menu.Item> */}
  //   <Menu.Item key="subscription">
  //     <a href="/subscription">Subscription</a>
  //   </Menu.Item>
  //   {/* <SubMenu title={<span>Blogs</span>}>
  //     <MenuItemGroup title="Item 1">
  //       <Menu.Item key="setting:1">Option 1</Menu.Item>
  //       <Menu.Item key="setting:2">Option 2</Menu.Item>
  //     </MenuItemGroup>
  //     <MenuItemGroup title="Item 2">
  //       <Menu.Item key="setting:3">Option 3</Menu.Item>
  //       <Menu.Item key="setting:4">Option 4</Menu.Item>
  //     </MenuItemGroup>
  //   </SubMenu> */}
  // </Menu>
  // )