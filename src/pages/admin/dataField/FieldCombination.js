import React, { useState, useEffect, forwardRef } from 'react'
import { Card, Table, Button, Popconfirm, Space, Modal, message, Input, Select, Checkbox, Pagination  } from "antd"
import config from '../../../utils/myConfig';
import FieldCombinationSelect from "./FieldCombinationSelect"; 
import { dataFieldCombinationSelectByTableUuid, dataFieldCombinationSave,dataFieldCombinationDeleteByUuid } from "../../../utils/api"
const { Column } = Table;
function FieldCombination(props,ref) {

  const [dataSource, setDataSource] = useState([]);
  const [num, setNum] = useState(0);
  const [curDescribe, setCurDescribe] = useState("");
  const [fieldCombinationSelectVisible,setFieldCombinationSelectVisible] = useState(false)
  const [combinationUuid, setCombinationUuid] = useState("");
  useEffect(()=>{ 
    console.log("props",props);
    dataFieldCombinationSelectByTableUuid(props.tableUuid)
    .then(
      res => {
        setDataSource(res);
      }
    )
  }, [props.tableUuid, num]) 


  const add = () => {
    const copySource = [...dataSource];
    copySource.push({uuid:"","tableUuid":props.tableUuid,name:"",resType:0,describe:"",edit:true});
    setDataSource(copySource);
  }
  const changeEdit = (index,edit) => {
    if(edit === false){
        dataFieldCombinationSave(dataSource[index])
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
    dataFieldCombinationDeleteByUuid(uuid)
      .then(
        res =>{
          setNum(num+1);
        }
      )
  }

  const changeValue = (index,field,e) => {
    
    const copySource = [...dataSource];
    copySource[index][field] = e.target.value;
    setDataSource(copySource);
  }

  const changeResTypeValue = (index,e) => {
    const copySource = [...dataSource];
    copySource[index].resType = e;
    setDataSource(copySource);
  }
  const onCancel = () => {
    setFieldCombinationSelectVisible(false);
  }

  const configSelect = (record) => {
    setCombinationUuid(record.uuid);
    setCurDescribe(record.describe);
    setFieldCombinationSelectVisible(true);
  }
  return (
    <div>
      <Table rowKey={(record,index)=>index.toString()} pagination={false} bordered dataSource={dataSource}>
        <Column title="name" dataIndex="name" align="center" render={( txt, record, index)=>{
          if(record.edit){
            return <Input value={record.name} onChange={(e)=>{changeValue(index,"name",e)}} />
          }else{
            return <span>{record.name}</span>
          }
        }} />
        <Column title="????????????" dataIndex="resType" align="center" 
          render={( txt, record, index)=>{
            if(record.edit){
              return <Select  onChange={(e)=>{ changeResTypeValue(index,e) }} style={{ width: '200px' }} defaultValue={record.resType}>
                { config.resTypeList.map(item => { return <Select.Option key={item.value}  value={item.value}>{item.label}</Select.Option> }) }
              </Select>
            }else{
              return <span>{config.resTypeList[record.resType].label}</span>
            }
          }} />
        <Column title="??????" dataIndex="describe" align="center" 
          render={( txt, record, index)=>{
            if(record.edit){
              return <Input value={record.describe} onChange={(e)=>{changeValue(index,"describe",e)}} />
            }else{
              return <span>{record.describe}</span>
            }
          }}
        />
        <Column render={( txt, record, index)=>{
            return (
                <Space>
                    { (record.edit===undefined || record.edit===false) && <Button onClick={()=>{ configSelect(record) }} type="primary" size="small">????????????</Button>}
                    { record.edit && <Button onClick={()=>{ changeEdit(index,false) }} type="primary" size="small">??????</Button>}
                    { (record.edit===undefined || record.edit===false) && <Button onClick={()=>{ changeEdit(index,true) }} type="primary" size="small">??????</Button>}
                    <Button onClick={()=>{ del(record.uuid) }} type="primary" size="small">??????</Button>
                </Space>
            )
        }} title="??????" align="center" />
      </Table>
      <Button type='primary' style={{"width":"100%"}} onClick={()=>{add()}}>??????</Button>
      <Modal width="60%" title={curDescribe} visible={fieldCombinationSelectVisible} cancelText="??????" okText="??????" onOk={onCancel} onCancel={onCancel}>
         <FieldCombinationSelect tableUuid={props.tableUuid} combinationUuid={combinationUuid} />
      </Modal>
    </div>
  )
}
export default forwardRef(FieldCombination)