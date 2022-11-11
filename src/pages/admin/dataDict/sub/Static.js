import React, { useState, useEffect, useRef,forwardRef, useImperativeHandle } from 'react'
import { Card, Table, Button, Popconfirm, Space, Modal, message,Input } from "antd"
import { SpaceContext } from 'antd/lib/space';
import { dataDictStaticSelectByDictUuid, dataDictStaticSave, dataDictStaticDeleteByUuid } from "../../../../utils/api";

const { Column } = Table;

function Static(props,ref) {
  const [dataSource, setDataSource] = useState([]);
  const [num, setNum] = useState(0)

  useEffect(()=>{ 
    getList(props.dictUuid);
  }, [props.dictUuid, num])
  const getList = (dictUuid)=>{
    dataDictStaticSelectByDictUuid(props.dictUuid)
    .then(
        res => {
            setDataSource(res);
        }
    )
  }
  const changeEdit = (entity,editFlag,index) => {
    if(editFlag===false){
        dataDictStaticSave(entity)
            .then(
                res => {
                    const copySource = [...dataSource];
                    copySource[index].edit = editFlag;
                    setDataSource(copySource);
                    setNum(num + 1);

                }
            )
    }else{
        const copySource = [...dataSource];
        copySource[index].edit = editFlag;
       setDataSource(copySource);
    }
    
  }
  const changeValue = (index,field,e) => {
    const copySource = [...dataSource];
    copySource[index][field] = e.target.value;
    setDataSource(copySource);
  }
  const add = () => {
    const copySource = [...dataSource];
    copySource.push({uuid:"","dictUuid":props.dictUuid,value:"",label:"",describe:"",edit:true});
    setDataSource(copySource);
  }
  const del = (uuid) => {
    dataDictStaticDeleteByUuid(uuid)
        .then(
            res => {
                setNum(num+1);
            }
        )
  }
//   useEffect( () =>{ getList(props.dictUuid) }, [] ) //  传空数组，不依赖任何东西，只会请求一次
  return (
    <div>
      <Table rowKey={(record,index)=>index.toString()} pagination={false} bordered dataSource={dataSource}>
        <Column title="value" dataIndex="value" align="center" render={( txt, record, index)=>{
          if(record.edit){
            return <Input value={record.value} onChange={(e)=>{changeValue(index,"value",e)}} />
          }else{
            return <span>{record.value}</span>
          }
        }} />
        <Column title="label" dataIndex="label" align="center" 
          render={( txt, record, index)=>{
            if(record.edit){
              return <Input value={record.label} onChange={(e)=>{changeValue(index,"label",e)}} />
            }else{
              return <span>{record.label}</span>
            }
          }} />
        <Column title="描述" dataIndex="describe" align="center" 
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
                    {record.edit && <Button onClick={()=>{ changeEdit(record,false,index) }} type="primary" size="small">保存</Button>}
                    {( record.edit===undefined || record.edit===false) && <Button onClick={()=>{ changeEdit(record,true,index) }} type="primary" size="small">编辑</Button>}
                    <Button onClick={()=>{ del(record.uuid) }} type="primary" size="small">删除</Button>
                </Space>
            )
        }} title="操作" align="center" />
      </Table>
      <Button type='primary' style={{"width":"100%"}} onClick={()=>{add()}}>新增</Button>
    </div>
  )
}
export default forwardRef(Static)