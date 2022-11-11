import React, { useState, useEffect, createRef, forwardRef  } from 'react'
import { Card, Table, Button, Popconfirm, Space, Modal, Form, Input, Select, message } from "antd"
import config from '../../../utils/myConfig';
import { databasesHttp,testUrl } from "../../../utils/api"
import {selectFilter} from '../../../utils/compoent';
function Edit(props, ref) {
  useEffect(()=>{  setRow(props.row) }, []) 
  const [databases,setDataBases] = useState([]);
  const setRow = (row) => ref.current.setFieldsValue(row);

  const test = () => {
    ref.current.validateFields()
      .then(values => {
        databasesHttp(values)
        .then(
            res => {
              setDataBases(res);
            }
        );
        
      })
  }

  const test2 = () => {
    ref.current.validateFields()
      .then(values => {
        testUrl(values);
      })
  }
  return (
    <Form ref={ref} onFinish={e=>props.onFinish(e)} onFinishFailed={(errorInfo)=>props.onFinishFailed(errorInfo)} labelCol={{  span: 8 }} wrapperCol={{ span: 8 }}>
      <Form.Item label="名称" name="name" rules={[ {required: true, message:"请输入名称"} ]}>
        <Input placeholder='请输入名称' />
      </Form.Item>
      <Form.Item label="开发商" name="dataBaseAutor" rules={[ {required: true, message:"请输选择发商"} ]}>
        <Select>
          { config.dataBaseAutorList.map(item => { return <Select.Option key={item.value} value={item.uuid}>{item.label}</Select.Option> }) }
        </Select>
      </Form.Item>
      <Form.Item label="ip地址" name="host" rules={[ {required: true, message:"请输入ip地址"} ]}>
        <Input placeholder='请输入ip地址' />
      </Form.Item>
      <Form.Item label="端口" name="port" rules={[ {required: true, message:"请输入端口"} ]}>
        <Input placeholder='请输入端口' />
      </Form.Item>
      <Form.Item label="用户名" name="user" rules={[ {required: true, message:"请输入用户名"} ]}>
        <Input placeholder='请输入用户名' />
      </Form.Item>
      <Form.Item label="密码" name="password" rules={[ {required: true, message:"请输入密码"} ]}>
        <Input type="password" placeholder='请输入密码' />
      </Form.Item>
      <Form.Item label="模式" name="schema" rules={[ {required: false, message:"请输入模式"} ]}>
        <Input type="schema" placeholder='请输入模式' />
      </Form.Item>
      <Form.Item label="数据库" name="database" rules={[ {required: true, message:"请输入数据库"} ]}>
        <Input type="database" placeholder='请输入数据库' />
      </Form.Item>
      {/* <Form.Item label="数据库" name="database" rules={[ {required: false, message:"请选择数据库"} ]}>
        <Select showSearch filterOption={(input, option) => { return selectFilter(input, option)}}>
          { databases.map(item => { return <Select.Option key={item} value={item}>{item}</Select.Option> }) }
        </Select>
      </Form.Item> */}
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button onClick={()=>test2()} type="primary" size="small">测试连接</Button>
      </Form.Item>
    </Form>
  )
}
export default forwardRef(Edit)
