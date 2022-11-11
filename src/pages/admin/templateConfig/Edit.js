import React, { useState, useEffect, createRef, forwardRef  } from 'react'
import { Card,  Table, Button, Popconfirm, Space, Modal, Form, Input, Select, message } from "antd"
const { TextArea } = Input;
function Edit(props, ref) {
  useEffect(()=>{  setRow(props.row) }, []) 
  const [databases,setDataBases] = useState([]);
  const setRow = (row) => ref.current.setFieldsValue(row);
  const onDragOver = (evt) =>{
    evt.preventDefault();
    // 被拖动的对象在另一对象范围内移动
  }
  const onDrop = (evt,field) => {
      evt.preventDefault();
      // 释放鼠标键时触发
      ref.current.setFieldsValue({[field]:evt.dataTransfer.files[0].path})
  }
  
  return (
    <Form ref={ref} onFinish={e=>props.onFinish(e)} onFinishFailed={(errorInfo)=>props.onFinishFailed(errorInfo)} labelCol={{  span: 4 }} wrapperCol={{ span: 20 }}>
      <Form.Item label="名称" name="name" rules={[ {required: true, message:"请输入名称"} ]}>
        <Input placeholder='请输入名称' />
      </Form.Item>
      <Form.Item label="命名空间" name="namespace" rules={[ {required: false, message:"请输入命名空间"} ]}>
        <Input placeholder='请输入命名空间' />
      </Form.Item>
      <Form.Item label="数据源命名空间" name="sourceNamespace" rules={[ {required: false, message:"请输入数据源命名空间"} ]}>
        <Input placeholder='请输入数据源命名空间' />
      </Form.Item>
      <Form.Item label="文件后缀" name="fileSuffix" rules={[ {required: true, message:"请输入文件后缀"} ]}>
        <Input placeholder='请输入文件后缀' />
      </Form.Item>
      <Form.Item label="模板内容" name="content" rules={[ {required: true, message:"请输入模板内容"} ]}>
        <TextArea
          placeholder="模板内容"
          autoSize={{
            minRows: 2,
            maxRows: 20,
          }}
        />
      </Form.Item>
      
    </Form>
  )
}
export default forwardRef(Edit)
