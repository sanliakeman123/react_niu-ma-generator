import React, { useState, useEffect, createRef, forwardRef,useImperativeHandle  } from 'react'
import { Card, Table, Button, Popconfirm, Space, Modal, Form, Input, Select, message } from "antd"
import {selectFilter} from '../../../utils/compoent';
import { dataSourceNotPage,   unRealTableSelectByUuid } from "../../../utils/api";

function Edit(props, ref) {
  const [dataSource, setDataSource] = useState([]);

  useImperativeHandle(ref, ()=>({
    setFieldsValue:ref.current.setFieldsValue,
    submit:ref.current.submit
  }))  
  useEffect(()=>{ 
    const uuid = props.unRealTableUuid;
    if(uuid){
        unRealTableSelectByUuid(uuid)
        .then(
          res => {
            setRow(res);
          }
        )
    }else{
      setRow({uuid:"",sourceUuid:"",name:"",describe:""});
    }
  }, [props.unRealTableUuid]) 
  useEffect(()=>{  
    dataSourceNotPage({})
      .then(
        res => {
          setDataSource(res); 
        }
      )
  }, []) 

  const setRow = (row) => ref.current.setFieldsValue(row);
  return (
    <Form ref={ref} onFinish={e=>props.onFinish(e)} onFinishFailed={(errorInfo)=>props.onFinishFailed(errorInfo)} labelCol={{  span: 8 }} wrapperCol={{ span: 8 }}>
      <Form.Item label="数据源" name="sourceUuid" rules={[ {required: true, message:"请选择数据源"} ]} >
        <Select placeholder="选择数据源"  showSearch filterOption={(input, option) => { return selectFilter(input, option)}} >
          { dataSource.map((item,index) => { return <Select.Option key={item.uuid} uuid={item.uuid} value={item.uuid}>{item.name}</Select.Option> }) }
        </Select>
      </Form.Item>
      <Form.Item label="名称" name="name" rules={[ {required: true, message:"请输入名称"} ]}>
        <Input placeholder='请输入名称' />
      </Form.Item>
      <Form.Item label="描述" name="describe" rules={[ {required: true, message:"请输入描述"} ]}>
        <Input placeholder='请输入描述' />
      </Form.Item>
    </Form>
  )
}
export default forwardRef(Edit)
