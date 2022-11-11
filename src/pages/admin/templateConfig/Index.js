import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Popconfirm, Space, Modal, message, Pagination } from "antd"
import Edit from './Edit';
import { templateConfigPage, templateConfigSave, templateConfigDeleteByUuid } from "../../../utils/api"
const { Column } = Table;

export default function Index() {
  const [dataSource, setDataSource] = useState([]);
  const [num, setNum] = useState(0);
  const [query, setQuery] = useState({entity:{},page:1,pageSize:10});
  const [total, setTotal] = useState(0);
  const [editTitle, setEditTitle] = useState("新增");
  const [editVisible, setEditVisible] = useState(false);
  const [uuid, setUuid] = useState("");
  const [row, setRow] = useState({});
  const formRef = useRef();
  useEffect( () =>{ 
    templateConfigPage(query)
      .then(
        res => {
          setDataSource(res.list);
          setTotal(res.total);
        }
      );
  }, [query,num] ) //  传空数组，不依赖任何东西，只会请求一次
  const handleOk = () => { formRef.current.submit(); }
  const edit = (obj) => {
    setRow(obj);
    setUuid(obj.uuid);
    if(formRef.current){
      formRef.current.setFieldsValue(obj);
    }
    setEditVisible(true);
  }
  const onFinish = e => {
    e.uuid = uuid;

    templateConfigSave(e)
      .then(
        res => {
          setNum(num + 1);
          setEditVisible(false);
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
    const cQuery = {...query};
    cQuery.pageNum = page;
    cQuery.pageSize = pageSize;
    setQuery(cQuery);
}
  return (
    <div>
      <Card title="数据源" extra={
        <Space>
          <Button onClick={()=> edit({uuid:"",name:"",namespace:"",sourceNamespace:"",content:"",fileSuffix:""}) } type="primary" size="small">新增</Button>
        </Space>
      }
      actions={[<Pagination showSizeChanger={true} defaultCurrent={1} onChange={(page,pageSize)=> changePage(page,pageSize) } total={total} showTotal={(total, range) => `共 ${total} 条`}  />]}

      >
          <Table rowKey="uuid" pagination={false} bordered dataSource={dataSource}>
              <Column title="名称" dataIndex="name" align="center"  />
              <Column title="文件后缀" dataIndex="fileSuffix" align="center"  />
              <Column render={( txt, record, index)=>{
                  return (
                      <Space>
                          <Button onClick={()=>{edit(record)}} type="primary" size="small">修改</Button>
                          <Popconfirm title="确定删除此项?" onConfirm={()=>{ 
                            templateConfigDeleteByUuid(record.uuid)
                              .then(
                                res => {
                                  setNum(num + 1)
                                }
                              );
                           }} onCancel={()=>{}}>
                              <Button type="danger" size="small">删除</Button>
                          </Popconfirm>
                      </Space>
                  )
              }} title="操作" align="center" />
          </Table>
      </Card>
      <Modal width="60%" title={editTitle} visible={editVisible} cancelText="取消" okText="确定" onOk={handleOk} onCancel={()=>setEditVisible(false)}>
            <Edit row={row} ref={formRef} onFinish={onFinish} onFinishFailed={onFinishFailed} />
      </Modal>
    </div>
  )
}
