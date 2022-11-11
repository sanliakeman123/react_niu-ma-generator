import React from 'react'
import {adminRoutes} from "../../routes";
import { Layout, Menu } from 'antd';
import { useNavigate } from "react-router-dom"
const { Header, Content, Sider } = Layout;

const routes = adminRoutes.filter(route => route.isShow);
export default function Index(props) {

  const navigate = useNavigate();
  return (
    <Layout>
    <Header className="header">
      <div className="logo" />
      
    </Header>
    <Layout>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['/admin/dashboard']}
          style={{ height: '100%', borderRight: 0 }}
        >
          {
            routes.map(route=>{
              return (<Menu.Item key={route.path} onClick={p=>{
                navigate(p.key);
              }}>
                {route.icon}
                <span>{route.title}</span>
              </Menu.Item>)
            })
          }
        </Menu>
      </Sider>
      <Layout style={{ padding: '16px' }}>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            // maxHeight: 786,
            backgroundColor:"white",
            overflowX:"auto"
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  </Layout>
  )
}
