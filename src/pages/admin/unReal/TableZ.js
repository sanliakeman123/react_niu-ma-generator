import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Popconfirm, Space, Modal, message, Input, Select, Checkbox, Pagination  } from "antd"
import {selectFilter} from '../../../utils/compoent';
import Edit from "./TableEdit";
import TableSub from "./TableSub";
import { dataSourceNotPage, unRealTableSave, unRealTablePage , dataSourceSelectByUuid, templateConfigNotPage,unRealTableDeleteByUuid,makeJoinFile } from "../../../utils/api"
const { Column } = Table;
export default function Index() {
  const [tables, setTables] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [tablenameFilter, setTablenameFilter] = useState("");
  const [editVisible, setEditVisible] = useState(false); 
  const [subVisible, setSubVisible] = useState(false); 
  const [dataBaseProperties, setDataBaseProperties] = useState({})
  const [templateUuid, setTemplateUuid] = useState("");
  const [query, setQuery] = useState({entity:{},page:1,pageSize:10});
  const [total, setTotal] = useState(0);
  const [num, setNum] = useState(0);
  const [tableUuid, setTableUuid] = useState("");
  const [sourceUuid, setSourceUuid] = useState("");
  const formRef = useRef();
  useEffect(()=>{  
    dataSourceNotPage({})
    .then(
      res => {
        setDataSource(res)
        if(res.length>0){
          onSelect(0,{uuid:res[0].uuid});
        }
      }
    )
    
  }, []) 
  useEffect(()=>{  
    templateConfigNotPage({})
    .then(
      res => {
        setTemplates(res)
        if(res.length>0){
          onSelectTemplate(0,{uuid:res[0].uuid});
        }
      }
    )
  }, []) 
  useEffect(()=>{   
    unRealTablePage(query)
    .then(
      res => {
        setTables(res.list);
        setTotal(res.total);
      }
    )
  }, [query,num]) 
  const onSelect = (value, option) => {
    const sourceUuid = option.uuid;
    dataSourceSelectByUuid(sourceUuid)
      .then(
        async res => {
          setDataBaseProperties(res);
          const cQuery = {...query};
          cQuery.entity.sourceUuid = sourceUuid;
          setQuery(cQuery);
        }
      );
  }

  const onSelectTemplate = (value, option) => {
    setTemplateUuid(option.uuid)
  }
  const filterDropdown = (setSelectedKeys, selectedKeys, confirm, clearFilters) => (<Input onPressEnter={() => confirm()}  value={tablenameFilter} onChange={(e)=>handleSearch(e,setSelectedKeys,selectedKeys,confirm)} placeholder="???????????????" style={{ marginBottom: 8, display: 'block' }} /> )
  const handleSearch = (e,setSelectedKeys,selectedKeys, confirm) => {
    setTablenameFilter(e.target.value)
    setSelectedKeys(e.target.value?[e.target.value]:[])
  }
  
  const handleOk = () => {
    formRef.current.submit();
  }
  const onCancel = () => {
    setEditVisible(false);
  } 
  
  const onChangeSelected = (e,tableUuid) => {
    unRealTableSave({uuid:tableUuid,selected:e.target.checked?1:0})
  }
  const changeSelected = (e) => {
    const cQuery = {...query};
    cQuery.entity.selected = e;
    setQuery(cQuery);
  }
  const changePage = (page, pageSize) => {
    const cQuery = {...query};
    cQuery.pageNum = page;
    cQuery.pageSize = pageSize;
    setQuery(cQuery);
  }
  const edit = (unRealTableUuid) => {
      setTableUuid(unRealTableUuid);
      setEditVisible(true);
  }
  const sub = (record) => {
    setTableUuid(record.uuid);
    setSourceUuid(record.sourceUuid);
    setSubVisible(true);
  }
  const del = (uuid) => {
    unRealTableDeleteByUuid(uuid)
    .then(
        res =>{ setNum( num + 1 );}
    )
  }

  const onFinish = e => {
    e.uuid = tableUuid;
    unRealTableSave(e)
      .then(
        res => {
          setNum(num + 1);
          setEditVisible(false);
        }
      )
    
  }
  const onFinishFailed = (errorInfo)=>{
    for(let error of errorInfo.errorFields){
      message.error(error.errors);
      return;
    }
  }

  return (
    <div>
      <Card title="?????????" extra={
        <Space>
          <Button onClick={()=>{ edit("") }} type="primary" size="small">??????</Button>
          <Select placeholder="????????????" defaultValue={""}  onSelect={(e)=>changeSelected(e)} style={{ width: '240px' }}>
            <Select.Option key={-1} value={""}>??????</Select.Option>
            <Select.Option key={1} value={1}>??????</Select.Option>
            <Select.Option key={0} value={0}>????????????</Select.Option> 
          </Select>
          <Select placeholder="???????????????" defaultValue={0}  onSelect={(value,option)=>onSelect(value,option)} style={{ width: '240px' }} showSearch filterOption={(input, option) => { return selectFilter(input, option)}}>
            { dataSource.map((item,index) => { return <Select.Option key={item.uuid} uuid={item.uuid} value={index}>{item.name}</Select.Option> }) }
          </Select>
          <Select placeholder="??????????????????" onSelect={(value,option)=>onSelectTemplate(value,option)} style={{ width: '240px' }} showSearch filterOption={(input, option) => { return selectFilter(input, option)}}>
            { templates.map((item,index) => { return <Select.Option key={item.uuid} uuid={item.uuid} value={index}>{item.name}</Select.Option> }) }
          </Select>
          <Button onClick={()=>{ 
             makeJoinFile(dataBaseProperties.uuid,templateUuid);
           }} type="primary" size="small">??????</Button>
        </Space>
      }
      actions={[<Pagination showSizeChanger={true} defaultCurrent={1} onChange={(page,pageSize)=> changePage(page,pageSize) } total={total} showTotal={(total, range) => `??? ${total} ???`}  />]}
      >
          <Table scroll={{y:"720px",x:false}}  rowKey="name" pagination={false} bordered dataSource={tables}>
              <Column width={80} render={( txt, record, index)=>{ return ( <Space> <Checkbox defaultChecked={record.selected===0?false:true} onChange={(e)=>{onChangeSelected(e,record.uuid)}}></Checkbox> </Space> ) }} title="??????" align="center" />
              <Column width={200} onFilter={ (value,record)=> {return record.name.toString().toLowerCase().includes(value.toLowerCase())} } filterDropdown={({ setSelectedKeys, selectedKeys, confirm, clearFilters })=>filterDropdown(setSelectedKeys, selectedKeys, confirm, clearFilters)} title="??????" dataIndex="name" align="center" />
              <Column width={200} title="??????" dataIndex="describe" align="center"  />
              <Column width={120} render={( txt, record, index)=>{ return ( 
                  <Space> 
                    <Button onClick={()=>{ edit(record.uuid) }} type="primary" size="small">??????</Button> 
                    <Button onClick={()=>{ sub(record) }} type="primary" size="small">??????</Button> 
                    <Popconfirm title="???????????????????" onConfirm={()=>{ del(record.uuid) }} onCancel={()=>{}}>
                        <Button type="danger" size="small">??????</Button>
                    </Popconfirm>
                  </Space> 
              ) }} title="??????" align="center" />
          </Table>
      </Card>

      <Modal width="60%" title={"??????"} visible={editVisible} cancelText="??????" okText="??????" onOk={handleOk} onCancel={onCancel}>
         <Edit unRealTableUuid={tableUuid} ref={formRef} onFinish={onFinish} onFinishFailed={onFinishFailed}  />
      </Modal>
      <Modal width="60%" title={"??????"} visible={subVisible} cancelText="??????" okText="??????" onOk={()=>{setSubVisible(false)}} onCancel={()=>{setSubVisible(false)}}>
         <TableSub unRealTableUuid={tableUuid} sourceUuid={sourceUuid}  />
      </Modal>

    </div>
  )
}
