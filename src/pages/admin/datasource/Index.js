import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Popconfirm,Pagination,  Space, Modal, message } from "antd"
import Edit from './Edit';
import { dataSourceSave , dataSourcePage , dataSourceDeleteByUuid,testUrl } from "../../../utils/api"
import config from '../../../utils/myConfig';

const { Column } = Table;
export default function Index(){
    const [data, setData] = useState([]);
    const [num, setNum] = useState(0);
    const [query, setQuery] = useState({});
    const [editVisible, setEditVisible] = useState(false);
    const [uuid, setUuid] = useState("");
    const [row, setRow] = useState({});
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const formRef = useRef();
    useEffect( () =>{ 
        dataSourcePage(query)
        .then(
            res => {
                setData(res.list);
                setTotal(res.total);
            }
        )
    }, [query,num] )
    const handleOk = () => { formRef.current.submit(); }
    const edit = (obj) => {
        setRow(obj);
        setUuid(obj.uuid);
        if(formRef.current){
            formRef.current.setFieldsValue(obj);
        }
        setEditVisible(true);
    }
    const del = (uuid) => {
        dataSourceDeleteByUuid(uuid)
        .then(
            res =>{ setNum( num + 1 );}
        )
        
    }
    const onFinish = e => {
        console.log("123");
        testUrl(e)
        .then(
            res =>{
                e.uuid = uuid;
                dataSourceSave(e)
                .then(
                    res => {
                        setNum(num + 1);
                        setEditVisible(false);
                    }
                );
            }
        );
    }
    const onFinishFailed = (errorInfo)=>{
        for(let error of errorInfo.errorFields){
            message.error(error.errors);
            return;
        }
    }
    const changePage = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
    }
    return (
        <div>
          <Card title="数据源管理" extra={
            <Space>
              <Button onClick={()=> edit({uuid:"",name:"",dataBaseAutor:"",host:"",port:"",user:"",password:"",database:""})} type="primary" size="small">新增</Button>
            </Space>
          }
            actions={[<Pagination showSizeChanger={true} defaultCurrent={1} onChange={(page,pageSize)=> changePage(page,pageSize) } total={total} showTotal={(total, range) => `共 ${total} 条`}  />]}
          >
              <Table rowKey="uuid" pagination={false} bordered dataSource={data}>
                <Column title="名称" dataIndex="name" align="center"  />
                <Column title="数据库开发商" align="center" render={ (txt,record,index)=>{ return config.dataBaseAutorList[record.dataBaseAutor].label } } />
                <Column title="地址" dataIndex="host" align="center"  />
                <Column title="端口" dataIndex="port" align="center"  />
                <Column title="用户名" dataIndex="user" align="center"  />
                <Column title="数据库" dataIndex="database" align="center"  />
                <Column render={( txt, record, index)=>{
                    return (
                        <Space>
                            <Button onClick={()=>{edit(record)}} type="primary" size="small">修改</Button>
                            <Popconfirm title="确定删除此项?" onConfirm={()=>{ del(record.uuid) }} onCancel={()=>{}}>
                                <Button type="danger" size="small">删除</Button>
                            </Popconfirm>
                        </Space>
                    )
                }} title="操作" align="center" />
              </Table>
          </Card>
          <Modal width="60%" title="新增/修改" visible={editVisible} cancelText="取消" okText="确定" onOk={handleOk} onCancel={()=>setEditVisible(false)}>
                <Edit row={row} ref={formRef} onFinish={onFinish} onFinishFailed={onFinishFailed} />
          </Modal>
        </div>
      )
}