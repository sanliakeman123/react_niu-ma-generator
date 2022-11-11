import React, { useState, useEffect, forwardRef } from 'react'
import { Card, Table, Button, Popconfirm, Space, Modal, message, Input, Select, Checkbox, Pagination  } from "antd"
import config from '../../../utils/myConfig';
import {selectFilter} from '../../../utils/compoent';
import { dataFieldCombinationSelectSelectByCombinationUuid, dataFieldCombinationSelectSave,dataFieldCombinationSelectDeleteByUuid, dataMetadataSelectByTableUuid } from "../../../utils/api"
const { Column } = Table;
function FieldCombinationSelect(props,ref) {

  const [dataSource, setDataSource] = useState([]);
  const [fields, setFields] = useState([]);
  const [num, setNum] = useState(0);
  useEffect(()=>{ 
    console.log("props",props);
    dataFieldCombinationSelectSelectByCombinationUuid(props.combinationUuid)
    .then(
      res => {
        setDataSource(res);
      }
    )
  }, [props.combinationUuid, num])
  
  useEffect(()=>{ 
    console.log("props",props);
    dataMetadataSelectByTableUuid(props.tableUuid)
    .then(
      res => {
        setFields(res);
      }
    )
  }, [props.tableUuid]) 


  const add = () => {
    const copySource = [...dataSource];
    copySource.push({uuid:"","combinationUuid":props.combinationUuid,fieldName:"",whereType:0,defaultValue:"",jdbcType:"",edit:true});
    setDataSource(copySource);
  }
  const changeEdit = (index,edit) => {
    if(edit === false){
      dataFieldCombinationSelectSave(dataSource[index])
            .then(
                res => {
                  setNum(num+1);
                }
            )
    }else{
      const copySource = [...dataSource];
      copySource[index].edit = edit;
      setDataSource(copySource);
    }
    
  }

  const del = (uuid) => {
    dataFieldCombinationSelectDeleteByUuid(uuid)
      .then(
        res =>{
          setNum(num+1);
        }
      )
  }

  const changeWhereTypeValue = (index,e) => {
    
    const copySource = [...dataSource];
    copySource[index].whereType = e;
    setDataSource(copySource);
  }

  const changeFieldNameValue = (index,e) => {
    const copySource = [...dataSource];
    copySource[index].fieldName = e;
    setDataSource(copySource);
  }

  const changeValue = (index,field,e) => {
    const copySource = [...dataSource];
    copySource[index][field] = e.target.value;
    setDataSource(copySource);
  }

  return (
    <div>
      <Table rowKey={(record,index)=>index.toString()} pagination={false} bordered dataSource={dataSource}>
        
        <Column title="字段名称" dataIndex="fieldName" align="center" 
          render={( txt, record, index)=>{
            if(record.edit){
              return <Select  onChange={(e)=>{ changeFieldNameValue(index,e) }} style={{ width: '200px' }} defaultValue={record.fieldName} showSearch filterOption={(input, option) => { return selectFilter(input, option)}} >
                { fields.map(item => { return <Select.Option key={item.columnName}  value={item.columnName}>{item.columnName}</Select.Option> }) }
              </Select>
            }else{
              return <span>{record.fieldName}</span>
            }
          }} />
        <Column title="查询方式" dataIndex="whereType" align="center" 
          render={( txt, record, index)=>{
            if(record.edit){
              return <Select  onChange={(e)=>{ changeWhereTypeValue(index,e) }} style={{ width: '200px' }} defaultValue={record.whereType}>
                { config.whereTypeList.map(item => { return <Select.Option key={item.value}  value={item.value}>{item.label}</Select.Option> }) }
              </Select>
            }else{
              return <span>{config.whereTypeList[record.whereType].label}</span>
            }
          }}
        />
        <Column title="默认值" dataIndex="defaultValue" align="center" 
          render={( txt, record, index)=>{
            if(record.edit){
              return <Input disabled={!(record.whereType===8)} value={record.defaultValue} onChange={(e)=>{changeValue(index,"defaultValue",e)}} />
            }else{
              return <span>{record.defaultValue}</span>
            }
          }}
        />
        <Column render={( txt, record, index)=>{
            return (
                <Space>
                    { record.edit && <Button onClick={()=>{ changeEdit(index,false) }} type="primary" size="small">保存</Button>}
                    { (record.edit===undefined || record.edit===false) && <Button onClick={()=>{ changeEdit(index,true) }} type="primary" size="small">编辑</Button>}
                    <Button onClick={()=>{ del(record.uuid) }} type="primary" size="small">删除</Button>
                </Space>
            )
        }} title="操作" align="center" />
      </Table>
      <Button type='primary' style={{"width":"100%"}} onClick={()=>{add()}}>新增</Button>
    </div>
  )
}
export default forwardRef(FieldCombinationSelect)