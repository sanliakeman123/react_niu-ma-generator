import React, { useState, useEffect, createRef, forwardRef,useImperativeHandle  } from 'react'
import { Card, Table, Button, Popconfirm, Space, Modal, Form, Input, Select, message } from "antd"
import config from '../../../utils/myConfig';
import {selectFilter} from '../../../utils/compoent';
import { dataMetadataSelectByTableUuid,dataSourceNotPage, templateConfigNotPage, dataTableSelectBySourceUuid, dataDictSelectByUuid, dataFieldCombinationNotPage } from "../../../utils/api";

function Edit(props, ref) {

  const [dataSource, setDataSource] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [dataBaseProperties, setDataBaseProperties] = useState({})
  const [tables, setTables] = useState([]);
  const [templateUuid, setTemplateUuid] = useState("");
  const [sourceUuid, setSourceUuid] = useState("");
  const [fields, setFields] = useState([])
  const [type,setType] = useState(0);
  const [combinationList, setCombinationList] = useState([])

  useImperativeHandle(ref, ()=>({
    setType2,
    getFields,
    setFieldsValue:ref.current.setFieldsValue,
    submit:ref.current.submit
  }))  
  const setType2 = (type)=>{
    setType(type)
  }

  const getFields = (tableName,option) => {
    const tableUuid = option.uuid;

    dataFieldCombinationNotPage({tableUuid:tableUuid,resType:1})
      .then(
        res => {
          setCombinationList(res);
        }
      )
    dataMetadataSelectByTableUuid(tableUuid)
      .then(
        res => {
          setFields(res);
        }
      )
  }
  useEffect(()=>{ 
    if(props.uuid){
      dataDictSelectByUuid(props.uuid)
        .then(
          res => {
            setRow(res);
            setType(res.type);
            onSelect(null,{uuid:res.sourceUuid});
            getFields(null,{uuid:res.tableName});
          }
        )
    }else{
      setRow({type:0})
      setType(0);
    }
  }, [props.uuid]) 
  useEffect(()=>{  
    dataSourceNotPage({})
      .then(
        res => {
          setDataSource(res); 
        }
      )
  }, []) 
  useEffect(()=>{  
    templateConfigNotPage({})
      .then(
        res => {
          setTemplates(res);
          if(res.length>0){ 
            onSelectTemplate(0,{uuid:res[0].uuid});
          }
        }
      )
  }, []) 
  const onSelect = (value, option) => {
    const sourceUuid = option.uuid;
    setSourceUuid(sourceUuid);
    dataTableSelectBySourceUuid(sourceUuid)
      .then(
        res =>{
          setTables(res);
        }
      )
  }
  const onSelectTemplate = (value, option) => {
    setTemplateUuid(option.uuid)
  }

  const setRow = (row) => ref.current.setFieldsValue(row);
  return (
    <Form ref={ref} onFinish={e=>props.onFinish(e)} onFinishFailed={(errorInfo)=>props.onFinishFailed(errorInfo)} labelCol={{  span: 8 }} wrapperCol={{ span: 8 }}>
      <Form.Item label="数据源" name="sourceUuid" rules={[ {required: true, message:"请选择数据源"} ]} >
        <Select placeholder="选择数据源"   onSelect={(value,option)=>onSelect(value,option)} showSearch filterOption={(input, option) => { return selectFilter(input, option)}} >
          { dataSource.map((item,index) => { return <Select.Option key={item.uuid} uuid={item.uuid} value={item.uuid}>{item.name}</Select.Option> }) }
        </Select>
      </Form.Item>
      <Form.Item label="名称" name="name" rules={[ {required: true, message:"请输入名称"} ]}>
        <Input placeholder='请输入名称' />
      </Form.Item>
      <Form.Item label="描述" name="describe" rules={[ {required: true, message:"请输入描述"} ]}>
        <Input placeholder='请输入描述' />
      </Form.Item>
      <Form.Item label="来源" name="type" rules={[ {required: true, message:"请选择来源"} ]}>
        <Select onSelect={(e)=>setType(e)}>
          { config.dictList.map(item => { return <Select.Option key={item.value}  value={item.value}>{item.label}</Select.Option> }) }
        </Select>
      </Form.Item>
      { 
        type === 1 && <>
          <Form.Item label="数据表" name="tableName" rules={[ {required: true, message:"请选择数据表"} ]} >
            <Select placeholder="选择数据表"  onSelect={(e,option)=>getFields(e,option)}  showSearch filterOption={(input, option) => { return selectFilter(input, option)}} >
              { tables.map((item,index) => { return <Select.Option key={item.name} uuid={item.uuid}  value={item.uuid}>{item.name}</Select.Option> }) }
            </Select>
          </Form.Item>
          <Form.Item label="联合查询" name="combinationUuid" rules={[ {required: true, message:"请选择联合查询"} ]} >
            <Select placeholder="请选择联合查询" showSearch filterOption={(input, option) => { return selectFilter(input, option)}} >
              { combinationList.map((item,index) => { return <Select.Option key={item.name}  value={item.uuid}>{item.name}</Select.Option> }) }
            </Select>
          </Form.Item>
          <Form.Item label="标签" name="label" rules={[ {required: true, message:"请选择标签字段"} ]} >
            <Select placeholder="选择标签"   showSearch filterOption={(input, option) => { return selectFilter(input, option)}} >
              { fields.map((item,index) => { return <Select.Option key={item.uuid}  value={item.uuid}>{item.columnName}</Select.Option> }) }
            </Select>
          </Form.Item>
          <Form.Item label="内容" name="value" rules={[ {required: true, message:"请选择内容字段"} ]} >
            <Select placeholder="选择内容"  showSearch filterOption={(input, option) => { return selectFilter(input, option)}} >
              { fields.map((item,index) => { return <Select.Option key={item.uuid}  value={item.uuid}>{item.columnName}</Select.Option> }) }
            </Select>
          </Form.Item>
        </>
        
      }
    </Form>
  )
}
export default forwardRef(Edit)
