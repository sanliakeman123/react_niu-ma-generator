import React, { useState, useEffect, forwardRef } from 'react'
import { Card, Table, Button, Popconfirm, Space, Modal, message, Input, Select, Checkbox, Pagination  } from "antd"
import {selectFilter} from '../../../utils/compoent';
import { unRealFieldSelectUnRealTableSubUuid, unRealFieldSelectSave,unRealFieldSelectDeleteByUuid, dataMetadataSelectByTableUuid } from "../../../utils/api"
const { Column } = Table;
function FieldSelect(props,ref) {
  const [dataSource, setDataSource] = useState([]);
  const [num, setNum] = useState(0);
  const [fieldMap,setFieldMap] = useState({})
  const [fields,setFields] = useState({})
  useEffect(()=>{ 
    unRealFieldSelectUnRealTableSubUuid(props.unRealTableSubUuid)
      .then(
        res => {
          setDataSource(res);
        }
      )
  }, [props.unRealTableSubUuid,num])
  
  useEffect(()=>{ 
    dataMetadataSelectByTableUuid(props.realTableUuid)
    .then(
      res => {
        let fieldMapTemp = {}
        fieldMapTemp[""] = "";
        for(let field of res){
          fieldMapTemp[field.uuid] = field.columnName;
        }
        setFields(res);
        setFieldMap(fieldMapTemp);
      }
    )
  }, [props.realTableUuid]) 

  const add = () => {
    const copySource = [...dataSource];
    copySource.push({uuid:"","unRealTableSubUuid":props.unRealTableSubUuid,realFieldUuid:"",alias:"",edit:true});
    setDataSource(copySource);
  }

  const changeEdit = (index,edit) => {
    if(edit === false){
      unRealFieldSelectSave(dataSource[index])
        .then(
            res => {
              setNum(num+1);
            }
        )
    }else{
      // setNum(num+1);
      const copySource = [...dataSource];
      copySource[index].edit = edit;
      setDataSource(copySource);
    }
  }
  const del = (uuid) => {
    unRealFieldSelectDeleteByUuid(uuid)
      .then(
        res =>{
          setNum(num+1);
        }
      )
  }
  const changeFieldNameValue = (index,e,field) => {
    console.log("e",e);
    const copySource = [...dataSource];
    copySource[index][field] = e;
    setDataSource(copySource);
  }

  const changeValue = (index,field,e) => {
    const copySource = [...dataSource];
    copySource[index][field] = e.target.value;
    setDataSource(copySource);
  }

  return (
    <div>
      <Table scroll={{y:"600px",x:false}} rowKey={(record,index)=>index.toString()} pagination={false} bordered dataSource={dataSource}>
        <Column title="字段" dataIndex="realFieldUuid" align="center" 
          render={( txt, record, index)=>{
            if(record.edit){
              return <Select style={{ width: '200px' }} onChange={(e)=>{ changeFieldNameValue(index,e,"realFieldUuid") }} defaultValue={record.realFieldUuid} showSearch filterOption={(input, option) => { return selectFilter(input, option)}} >
                { fields.map(item => { return <Select.Option key={item.uuid}  value={item.uuid}>{item.columnName}</Select.Option> }) }
              </Select>
            }else{
              return <span>{fieldMap[record.realFieldUuid]}</span>
            }
          }} />
        
        <Column title="别名" dataIndex="alias" align="center" 
          render={( txt, record, index)=>{
            if(record.edit){
              return <Input value={record.alias} onChange={(e)=>{changeValue(index,"alias",e)}} />
            }else{
              return <span>{record.alias}</span>
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
export default forwardRef(FieldSelect)