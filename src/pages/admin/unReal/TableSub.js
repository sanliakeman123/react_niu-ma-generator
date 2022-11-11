import React, { useState, useEffect, forwardRef } from 'react'
import { Card, Table, Button, Popconfirm, Space, Modal, message, Input, Select, Checkbox, Pagination  } from "antd"
import {selectFilter} from '../../../utils/compoent';
import SelectField from "./FieldSelect";
import WhereField from "./FieldWhere";
import { unRealTableSubSelectByParentUuid, unRealTableSubSave,unRealTableSubDeleteByUuid,dataTableSelectMapBySourceUuid } from "../../../utils/api"
const { Column } = Table;
function TableSub(props,ref) {
  const [dataSource, setDataSource] = useState([]);
  const [realTables, setRealTables] = useState([]);
  const [num, setNum] = useState(0);
  const [tableMap,setTableMap] = useState({})
  const [fieldMap,setFieldMap] = useState({})
  const [joinTables,setJoinTables] = useState({})

  const [selectVisible, setSelectVisible] = useState(false);
  const [whereVisible, setWhereVisible] = useState(false);
  const [unRealTableSubUuid, setUnRealTableSubUuid] = useState("");
  const [realTableUuid, setRealTableUuid] = useState("");
  const [addEnable,setAddEnable] = useState(false);
  useEffect(()=>{ 
    unRealTableSubSelectByParentUuid(props.unRealTableUuid)
      .then(
        res => {
          setDataSource(res);
        }
      )
  }, [props.unRealTableUuid, num])
  
  useEffect(()=>{ 
    setAddEnable(false);
    dataTableSelectMapBySourceUuid(props.sourceUuid)
    .then(
      res => {
        let realTablesTemp = [];
        let joinTablesTemp = {};
        let tableMapTemp = {};
        let fieldMapTemp = {};
        joinTablesTemp[""] = [];
        for( let item of res ){
          let table = item.parent;
          let fields = item.sons;
          const tableUuid = table.uuid;
          realTablesTemp.push(item.parent); 
          joinTablesTemp[tableUuid] = fields;
          tableMapTemp[tableUuid] = table.name;
          for(let field of fields){
            fieldMapTemp[field.uuid] = field.columnName;
          }
        }
        setRealTables(realTablesTemp);
        setTableMap(tableMapTemp);
        setFieldMap(fieldMapTemp);
        console.log("joinTablesTemp",joinTablesTemp);
        setJoinTables(joinTablesTemp);
        setAddEnable(true);
      }
    )
  }, [props.unRealTableUuid,props.sourceUuid, num]) 

  const add = () => {
    if(addEnable){
      const copySource = [...dataSource];
      copySource.push({uuid:"","unRealTableUuid":props.unRealTableUuid,realTableUuid:"",alias:"",weight:0,order:copySource.length,edit:true});
      setDataSource(copySource);
    }else{
      message.error("正在加载数据，请稍等");
    }
    
  }
  const changeEdit = (index,edit) => {
    if(edit === false){
      unRealTableSubSave(dataSource[index])
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
    unRealTableSubDeleteByUuid(uuid)
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
  const selectField = (record) => {
    setUnRealTableSubUuid(record.uuid);
    setRealTableUuid(record.realTableUuid);
    setSelectVisible(true);
  }
  const whereField = (record) => {
    setUnRealTableSubUuid(record.uuid);
    setRealTableUuid(record.realTableUuid);
    setWhereVisible(true);
  }
  const selectCanel = () => {
    setSelectVisible(false);
  }
  const whereCanel = () => {
    setWhereVisible(false);
  }

  return (
    <div>
      <Table rowKey={(record,index)=>index.toString()} pagination={false} bordered dataSource={dataSource}>
        <Column title="数据表" dataIndex="realTableUuid" align="center" 
          render={( txt, record, index)=>{
            if(record.edit){
              return <Select style={{ width: '200px' }} onChange={(e)=>{ changeFieldNameValue(index,e,"realTableUuid") }} defaultValue={record.realTableUuid} showSearch filterOption={(input, option) => { return selectFilter(input, option)}} >
                { realTables.map(item => { return <Select.Option key={item.uuid}  value={item.uuid}>{item.name}</Select.Option> }) }
              </Select>
            }else{
              return <span>{tableMap[record.realTableUuid]}</span>
            }
          }} />
        <Column title="表字段" dataIndex="selfFieldUuid" align="center"  
          render={( txt, record, index)=>{
            if(record.edit){
              console.log("joinTables",joinTables);
              console.log("record.realTableUuid",record.realTableUuid);
              console.log("joinTables[record.realTableUuid]",joinTables[record.realTableUuid]);
              return <Select style={{ width: '200px' }} onChange={(e)=>{ changeFieldNameValue(index,e,"selfFieldUuid") }} defaultValue={record.selfFieldUuid} showSearch filterOption={(input, option) => { return selectFilter(input, option)}} >
                { joinTables[record.realTableUuid].map(item => { return <Select.Option key={item.uuid}  value={item.uuid}>{item.columnName}</Select.Option> }) }
              </Select>
            }else{
              return <span>{ fieldMap[record.selfFieldUuid]}</span>
            }
        }} />
        <Column title="关联表字段" dataIndex="joinFieldUuid" align="center" 
          render={( txt, record, index)=>{
            const nextIndex = index + 1; 
            if(record.edit){
              return <Select style={{ width: '200px' }} onChange={(e)=>{ changeFieldNameValue(index,e,"joinFieldUuid") }} defaultValue={record.joinFieldUuid} showSearch filterOption={(input, option) => { return selectFilter(input, option)}} >
                { dataSource.length > nextIndex && dataSource[nextIndex].realTableUuid && joinTables[dataSource[nextIndex].realTableUuid].map(item => { return <Select.Option key={item.uuid}  value={item.uuid}>{item.columnName}</Select.Option> }) }
              </Select>
            }else{
              return <span>{ dataSource.length > nextIndex  &&  fieldMap[record.joinFieldUuid]}</span>
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
        <Column title="顺序" dataIndex="order" align="center" 
          render={( txt, record, index)=>{
            if(record.edit){
              return <Input value={record.order} onChange={(e)=>{changeValue(index,"order",e)}} />
            }else{
              return <span>{record.order}</span>
            }
          }}
        />
        <Column title="权重" dataIndex="weight" align="center" 
          render={( txt, record, index)=>{
            if(record.edit){
              return <Select onChange={(e)=>{ changeFieldNameValue(index,e,"weight") }} defaultValue={record.weight} >
                  <Select.Option key={0} value={0}>0</Select.Option>
                  <Select.Option key={1} value={1}>1</Select.Option> 
              </Select>
            }else{
              return <span>{record.weight}</span>
            }
          }}
        />
        <Column render={( txt, record, index)=>{
            return (
                <Space>
                    { record.edit && <Button onClick={()=>{ changeEdit(index,false) }} type="primary" size="small">保存</Button>}
                    { (record.edit===undefined || record.edit===false) && <Button onClick={()=>{ changeEdit(index,true) }} type="primary" size="small">编辑</Button>}
                    { (record.edit===undefined || record.edit===false) && <Button onClick={()=>{ selectField(record) }} type="primary" size="small">查询字段</Button>}
                    { (record.edit===undefined || record.edit===false) && <Button onClick={()=>{ whereField(record) }} type="primary" size="small">条件字段</Button>}
                    <Button onClick={()=>{ del(record.uuid) }} type="primary" size="small">删除</Button>
                </Space>
            )
        }} title="操作" align="center" />
      </Table>
      <Button type='primary'  style={{"width":"100%"}} onClick={()=>{add()}}>新增</Button>

      <Modal width="60%" title={"查询字段"} visible={selectVisible} cancelText="取消" okText="确定" onOk={selectCanel} onCancel={selectCanel}>
         <SelectField unRealTableSubUuid={unRealTableSubUuid} realTableUuid={realTableUuid} />
      </Modal>

      <Modal width="60%" title={"条件字段"} visible={whereVisible} cancelText="取消" okText="确定" onOk={whereCanel} onCancel={whereCanel}>
         <WhereField unRealTableSubUuid={unRealTableSubUuid} realTableUuid={realTableUuid} />
      </Modal>

    </div>
  )
}
export default forwardRef(TableSub)