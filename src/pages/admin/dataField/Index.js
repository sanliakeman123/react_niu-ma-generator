import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Popconfirm, Space, Modal, message, Input, Select,Checkbox } from "antd"
// import View from './View';
import { dataMetadataNotPage,dataMetadataSave } from "../../../utils/api"

const { Column } = Table;
export default function Index(props) {
  const [columnNameFilter, setColumnNameFilter] = useState("");
  const [metadataUuid,setMetadataUuid] = useState("");
  const [whereList,setWhereList] = useState([
      {label:"=",value:"0"}, {label:"like",value:"1"}, {label:"find_in_set(left)",value:"2"},
      {label:"find_in_set(right)",value:"3"}, {label:"FK:1:1",value:"4"}, {label:"FK:1:n",value:"5"},
      {label:"FK:n:n",value:"6"},{label:">",value:"7"},{label:"<",value:"8"},
  ])
  const [query, setQuery] = useState({tableUuid:props.tableUuid});
  const formRef = useRef();
  const [editTitle, setEditTitle] = useState("新增");
  const [editVisible, setEditVisible] = useState(false);
  const [datasource,setDataSource] = useState([])
  const [columnName, setColumnName] = useState("");
  const filterDropdown = (setSelectedKeys, selectedKeys, confirm, clearFilters) => (<Input onPressEnter={() => confirm()}  value={columnNameFilter} onChange={(e)=>handleSearch(e,setSelectedKeys,selectedKeys,confirm)} placeholder="请输入字段名" style={{ marginBottom: 8, display: 'block' }} /> )
  const handleSearch = (e,setSelectedKeys,selectedKeys, confirm) => {
    setColumnNameFilter(e.target.value)
    setSelectedKeys(e.target.value?[e.target.value]:[])
  }

  // useEffect(()=>{ 
    
  //   dataMetadataNotPage({tableUuid:props.tableUuid})
  //   .then(
  //     res => {
  //       setDataSource(res);
  //     }
  //   )
  // }, [props.tableUuid]) 

  const onChangeSelected = (e,fieldUuid) => {
    dataMetadataSave({uuid:fieldUuid,selected:e.target.checked?1:0})
  }
  useEffect(()=>{ 
    
    dataMetadataNotPage({...query,...props})
    .then(
      res => {
        setDataSource(res);
      }
    )
  }, [ query,props.tableUuid]) 

  const handleOk = () => { 
    formRef.current.submit();
  }
  const onFinish = e => {
    // const param = { tableName: "data_view", obj:e }
    // if(e.uuid){
    //   ipcRenderer.sendSync("save", param)
    // }else{
    //   ipcRenderer.sendSync("add", param) 
    // }
    // setEditVisible(false);
  }
  const onFinishFailed = (errorInfo)=>{
    for(let error of errorInfo.errorFields){
      message.error(error.errors);
      return;
    }
  }
  const editView = (record) => {
    // const res = ipcRenderer.sendSync("getByOther", {where:{"metadata_uuid":record.uuid},name:"data_view"});
    // //  console.log("res",res);
    // if(res.code === 0){  
    //   if(res.data.length===0){
    //     // console.log("res",res);
    //     const param = { 
    //       tableName: "data_view", 
    //       obj:{
    //         "metadata_uuid":record.uuid,
    //         "dict_uuid":"",
    //         "label_name":"",
    //         "edit_visable":"false",
    //         "table_visable":"false",
    //         "element_type":"",
    //         "default_value":"",
    //         "query_visable":"false"
    //       } 
    //     }
    //     ipcRenderer.sendSync("add", param) 
    //   }
    // }
    // if(formRef.current){
    //   formRef.current.getItem(record.uuid);
    // }
    // setMetadataUuid(record.uuid);
    // // console.log("formRef",formRef);
    // setEditVisible(true);
  } 
  const changeName = (e) => {

    // setColumnName(e);

    const cQuery = {...query};
    cQuery.columnName = e.target.value;
    setQuery(cQuery);
  }

  const changeWhereType = (uuid,e) => {
    dataMetadataSave({uuid:uuid,whereType:e});
  }

  return (
    <div>
      <Input value={query.columnName} placeholder='字段名' onChange={(e)=>{changeName(e)}} />
      <Table scroll={{y:"650px",x:false}} rowKey="uuid" pagination={false} bordered dataSource={datasource}>
        <Column width={80} render={( txt, record, index)=>{ return ( <Space> <Checkbox defaultChecked={record.selected===0?false:true} onChange={(e)=>{onChangeSelected(e,record.uuid)}}></Checkbox> </Space> ) }} title="选中" align="center" />

        {/* <Column width={80} title="序号" dataIndex="index" align="center" render={( txt, record, index)=>{ return ( <span>{index+1}</span> ) }} /> */}
        <Column onFilter={ (value,record)=> {return record.columnName.toString().toLowerCase().includes(value.toLowerCase())} } filterDropdown={({ setSelectedKeys, selectedKeys, confirm, clearFilters })=>filterDropdown(setSelectedKeys, selectedKeys, confirm, clearFilters)} title="列名" dataIndex="columnName" align="center" />
        <Column title="说明" dataIndex="columnComment" align="center"  />
        <Column title="查询方式" align="center" render={(txt,record,index)=>{
          return (
            <Select disabled={record.primaryKeyFlag!=="false"} onChange={(e)=> {changeWhereType(record.uuid,e)}} style={{ width: '200px' }} defaultValue={record.whereType}>
              { whereList.map(item => { return <Select.Option key={item.value}  value={item.value}>{item.label}</Select.Option> }) }
            </Select>
          )
        }}  />
        {/* <Column title="操作" align="center" render={(txt,record,index)=>{
          return (
            <Space> <Button onClick={()=>{editView(record)}} type="primary" size="small">前端配置</Button> </Space>
          )
        }}  /> */}
    </Table>
    {/* <Modal width="60%" title={editTitle} visible={editVisible} cancelText="取消" okText="确定" onOk={handleOk} onCancel={()=>setEditVisible(false)}>
      <View ref={formRef} metadataUuid={metadataUuid} onFinish={onFinish} onFinishFailed={onFinishFailed} />
    </Modal> */}
    </div>
  )
}
