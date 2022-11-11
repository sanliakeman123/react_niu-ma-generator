import axios from "axios";
import { message } from "antd"
const http = axios.create({
    baseURL:"/generator",
    timeout: 1000 * 120,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

/**
 * 请求拦截
 */
http.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

/**
 * 响应拦截
 */
http.interceptors.response.use(
    
    ({data}) => {

        // console.log("data1",data);

        if(data.code === 0){
            return data.data;
        }else{ 
            message.error(data.msg);
            return Promise.reject(data.msg);
        }
    },
    error => {
        message.error(error+"")
        return Promise.reject(error);
    }
);

export default http;