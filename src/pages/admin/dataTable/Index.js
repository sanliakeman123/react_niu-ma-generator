import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Popconfirm, Space, Modal, message, Input, Select, Checkbox, Pagination  } from "antd"
import FieldIndex from "../dataField/Index"
import FieldCombination from "../dataField/FieldCombination"
// import config from '../../../utils/myConfig';
import {selectFilter} from '../../../utils/compoent';
import { dataSourceNotPage, dataTableSave , dataTableList , dataTablePage, makeFile , dataTableSelectBySourceUuid, dataSourceSelectByUuid, templateConfigNotPage, syncTables, dataMetadataSelectByTableUuid, dataMetadataSaveList } from "../../../utils/api"
const { Column } = Table;
export default function Index() {
  const [tables, setTables] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [tablenameFilter, setTablenameFilter] = useState("");
  const [fieldVisible, setFieldVisible] = useState(false);
  const [dataBaseProperties, setDataBaseProperties] = useState({})
  const [fields, setFields] = useState({})
  const [curTable, setCurTable] = useState("");
  const [templateUuid, setTemplateUuid] = useState("");
  const [query, setQuery] = useState({entity:{},page:1,pageSize:10});
  const [num, setNum] = useState(0);
  const [total, setTotal] = useState(0);
  const [fieldCombinationVisible, setFieldCombinationVisible] = useState(false);
  const [tableUuid, setTableUuid] = useState("");
  const [tableName, setTableName] = useState("");
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
     
    dataTablePage(query)
    .then(
      res => {
        setTables(res.list);
        setTotal(res.total);
      }
    )
  }, [query]) 
  const onSelect = (value, option) => {
    const sourceUuid = option.uuid;
    dataSourceSelectByUuid(sourceUuid)
      .then(
        async res => {
          setDataBaseProperties(res);
          // await syncTables(res);
          const cQuery = {...query};
          cQuery.entity.sourceUuid = sourceUuid;
          setQuery(cQuery);
          // dataTableSelectBySourceUuid(sourceUuid)
          //   .then(
          //     res3 => {
          //       setTables(res3);
          //     }
          //   );
        }
      );
  }

  const onSelectTemplate = (value, option) => {
    setTemplateUuid(option.uuid)
  }
  const filterDropdown = (setSelectedKeys, selectedKeys, confirm, clearFilters) => (<Input onPressEnter={() => confirm()}  value={tablenameFilter} onChange={(e)=>handleSearch(e,setSelectedKeys,selectedKeys,confirm)} placeholder="请输入表名" style={{ marginBottom: 8, display: 'block' }} /> )
  const handleSearch = (e,setSelectedKeys,selectedKeys, confirm) => {
    setTablenameFilter(e.target.value)
    setSelectedKeys(e.target.value?[e.target.value]:[])
  }
  const getFields = (record) => {

    setTableUuid(record.uuid);
    setCurTable(record.name);
    setFieldVisible(true);
    // dataMetadataSelectByTableUuid(record.uuid)
    //   .then(
    //     res => {
    //       setFields(res);
    //       setCurTable(record.name);
    //       setFieldVisible(true);
    //     }
    //   )
  }

  const getCombinationFields = (record) => {
    setCurTable(record.name);
    setTableUuid(record.uuid);
    setFieldCombinationVisible(true);
  }

  const handleOk = () => {

    dataMetadataSaveList(fields)
      .then(
        res => {
          setFieldVisible(false);
        }
      );    
  }
  // defaultValue={0}
  const onCancel = () => {
    setFieldVisible(false);
  } 
  const onCombinationCancel = () => {
    setFieldCombinationVisible(false);
  }
  const onChangeSelected = (e,tableUuid) => {
    dataTableSave({uuid:tableUuid,selected:e.target.checked?1:0})
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

  const changeName = (e) => {
    const cQuery = {...query};
    cQuery.entity.name = e.target.value;
    setQuery(cQuery);
  }
  
  return (
    <div>
      <Card title="数据表" extra={
        <Space>
          <Button onClick={()=>{ 
            syncTables(dataBaseProperties)
              .then(
                res => {
                  setNum(num+1);
                }
              )
          }} type="primary" size="small">同步</Button>
          <Select placeholder="选中状态" defaultValue={""}  onSelect={(e)=>changeSelected(e)} style={{ width: '240px' }}>
            <Select.Option key={-1} value={""}>全部</Select.Option>
            <Select.Option key={1} value={1}>选中</Select.Option>
            <Select.Option key={0} value={0}>没有勾选</Select.Option> 
          </Select>

          <Input value={query.name} placeholder='表名' onChange={(e)=>{changeName(e)}} />
          <Select placeholder="选择数据源" defaultValue={0}  onSelect={(value,option)=>onSelect(value,option)} style={{ width: '240px' }} showSearch filterOption={(input, option) => { return selectFilter(input, option)}}>
            { dataSource.map((item,index) => { return <Select.Option key={item.uuid} uuid={item.uuid} value={index}>{item.name}</Select.Option> }) }
          </Select>
          <Select placeholder="选择模板配置" onSelect={(value,option)=>onSelectTemplate(value,option)} style={{ width: '240px' }} showSearch filterOption={(input, option) => { return selectFilter(input, option)}}>
            { templates.map((item,index) => { return <Select.Option key={item.uuid} uuid={item.uuid} value={index}>{item.name}</Select.Option> }) }
          </Select>
          <Button onClick={()=>{ 
            makeFile(dataBaseProperties.uuid,templateUuid);
           }} type="primary" size="small">生成</Button>
        </Space>
      }
      actions={[<Pagination showSizeChanger={true} defaultCurrent={1} onChange={(page,pageSize)=> changePage(page,pageSize) } total={total} showTotal={(total, range) => `共 ${total} 条`}  />]}
      >
          <Table scroll={{y:"720px",x:false}}  rowKey="name" pagination={false} bordered dataSource={tables}>
              <Column width={80} render={( txt, record, index)=>{ return ( <Space> <Checkbox defaultChecked={record.selected===0?false:true} onChange={(e)=>{onChangeSelected(e,record.uuid)}}></Checkbox> </Space> ) }} title="选中" align="center" />
              {/* <Column width={80} title="序号" dataIndex="index" align="center" render={( txt, record, index)=>{ return ( <span>{index+1}</span> ) }} /> */}
              <Column width={200} onFilter={ (value,record)=> {return record.name.toString().toLowerCase().includes(value.toLowerCase())} } filterDropdown={({ setSelectedKeys, selectedKeys, confirm, clearFilters })=>filterDropdown(setSelectedKeys, selectedKeys, confirm, clearFilters)} title="表名" dataIndex="name" align="center" />
              <Column width={200} title="说明" dataIndex="describe" align="center"  />
              <Column width={120} render={( txt, record, index)=>{ return ( 
                  <Space> 
                    <Button onClick={()=>{getFields(record)}} type="primary" size="small">基本配置</Button> 
                    <Button onClick={()=>{getCombinationFields(record)}} type="primary" size="small">组合条件</Button>
                  </Space> 
              ) }} title="操作" align="center" />
          </Table>
      </Card>
      <Modal width="60%" title={curTable} visible={fieldVisible} cancelText="取消" okText="确定" onOk={onCancel} onCancel={onCancel}>
         <FieldIndex fields={fields} tableUuid={tableUuid} />
      </Modal>
      <Modal width="60%" title={curTable} visible={fieldCombinationVisible} cancelText="取消" okText="确定" onOk={handleOk} onCancel={onCombinationCancel}>
         <FieldCombination tableUuid={tableUuid} />
      </Modal>
    </div>
  )
}
