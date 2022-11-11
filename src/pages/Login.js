import { Button } from 'antd';
import React from 'react'
import { useNavigate,useParams } from "react-router-dom"


export default function Login() {
  // console.log("props",props);
  const navigate = useNavigate();
  // const [searchParams,setSearchParams] = useSearchParams();
  let params = useParams();
  
  console.log("params",params);
  const login = () => {
    navigate("/admin")
  }
  return (
    <div>
        <Button id='loginBtn' onClick={()=>login()}>登录</Button>
        <h1>{params.id}</h1>
    </div>
  )
}
