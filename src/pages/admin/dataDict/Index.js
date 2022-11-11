import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Popconfirm, Space, Modal, message, Input, Select, Checkbox, Pagination  } from "antd"
import Edit from "./Edit"
import EditStatic from "./sub/Static"
// import config from '../../../utils/myConfig';
import {selectFilter} from '../../../utils/compoent';
import { dataSourceNotPage , dataDictSave , dataSourceSelectByUuid, templateConfigNotPage, dataDictPage, dataDictDeleteByUuid, makeDictFile } from "../../../utils/api"
const { Column } = Table;
export default function Index() {
  const [tables, setTables] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [dataBaseProperties, setDataBaseProperties] = useState({})
  const [templateUuid, setTemplateUuid] = useState("");
  const [query, setQuery] = useState({entity:{},page:1,pageSize:10});
  const [total, setTotal] = useState(0);
  const [num,setNum] = useState(0);
  const [uuid, setUuid] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  const [editListVisible, setEditListVisible] = useState(false);
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
    dataDictPage(query)
    .then(
      res => {
        setTables(res.list);
        setTotal(res.total);
      }
    )
  }, [query, num]) 
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

  const edit = (uuid) => {
    setUuid(uuid);
    setEditVisible(true);
  }

  const onSelectTemplate = (value, option) => {
    setTemplateUuid(option.uuid)
  }
  
  const changePage = (page, pageSize) => {
    const cQuery = {...query};
    cQuery.pageNum = page;
    cQuery.pageSize = pageSize;
    setQuery(cQuery);
  }

  const handleListOk = () => { 
    setEditListVisible(false);
   }

  const handleOk = () => { formRef.current.submit(); }

  const onFinish = e => {
    e.uuid = uuid;
    dataDictSave(e)
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
  const editStatic = (uuid) => {
    setUuid(uuid);
    setEditListVisible(true);
  }
  
  return (
    <div>
      <Card title="数据表" extra={
        <Space>
          <Select placeholder="选择数据源" defaultValue={0}  onSelect={(value,option)=>onSelect(value,option)} style={{ width: '240px' }} showSearch filterOption={(input, option) => { return selectFilter(input, option)}}>
            { dataSource.map((item,index) => { return <Select.Option key={item.uuid} uuid={item.uuid} value={index}>{item.name}</Select.Option> }) }
          </Select>
          <Select placeholder="选择模板配置" onSelect={(value,option)=>onSelectTemplate(value,option)} style={{ width: '240px' }} showSearch filterOption={(input, option) => { return selectFilter(input, option)}}>
            { templates.map((item,index) => { return <Select.Option key={item.uuid} uuid={item.uuid} value={index}>{item.name}</Select.Option> }) }
          </Select>
          <Button onClick={()=>{ makeDictFile(dataBaseProperties.uuid,templateUuid); }} type="primary" size="small">生成</Button>
          <Button onClick={()=>{ edit("") }} type="primary" size="small">新增</Button>
        </Space>
      }
      actions={[<Pagination showSizeChanger={true} defaultCurrent={1} onChange={(page,pageSize)=> changePage(page,pageSize) } total={total} showTotal={(total, range) => `共 ${total} 条`}  />]}
      >
          <Table scroll={{y:"720px",x:false}}  rowKey="name" pagination={false} bordered dataSource={tables}>
              <Column width={200} title="名称" dataIndex="name" align="center" />
              <Column width={200} title="描述" dataIndex="describe" align="center"  />
              <Column width={120} render={( txt, record, index)=>{ return ( 
                  <Space> 
                    <Button onClick={()=>{ edit(record.uuid) }} type="primary" size="small">修改</Button> 
                    { record.type===0 && <Button onClick={()=>{ editStatic(record.uuid) }} type="primary" size="small">编辑</Button> }
                    <Popconfirm title="确定删除此项?" onConfirm={()=>{ 
                            dataDictDeleteByUuid(record.uuid)
                              .then(
                                res => {
                                  setNum(num + 1)
                                }
                              );
                           }} onCancel={()=>{}}>
                      <Button type="danger" size="small">删除</Button>
                    </Popconfirm>
                  </Space> 
              ) }} title="操作" align="center" />
          </Table>
      </Card>
      <Modal width="60%" title={"新增"} visible={editVisible} cancelText="取消" okText="确定" onOk={handleOk} onCancel={()=>setEditVisible(false)}>
            <Edit uuid={uuid} ref={formRef} onFinish={onFinish} onFinishFailed={onFinishFailed} />
      </Modal>
      <Modal width="60%" title={"静态字典"} visible={editListVisible} cancelText="取消" okText="确定" onOk={handleListOk} onCancel={()=>setEditListVisible(false)}>
          <EditStatic  setListVisible={setEditListVisible} dictUuid={uuid} />
      </Modal>
    </div>
  )
}
