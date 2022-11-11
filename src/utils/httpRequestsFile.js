import axios from "axios";
import { message } from "antd"
const http2 = axios.create({
    baseURL:"/generator",
    timeout: 1000 * 30,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

/**
 * 请求拦截
 */
http2.interceptors.request.use(
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
http2.interceptors.response.use(
    
    (data) => {
        //获取文件名
        const fileName = data.headers["content-disposition"].split(";")[1].split("=")[1]
        const blob = new Blob([data.data]);
        //创建一个a标签并设置href属性，之后模拟人为点击下载文件
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;//设置下载文件名
        link.click();//模拟点击
        //释放资源并删除创建的a标签
        URL.revokeObjectURL(link.href);
        // document.body.removeChild(link);
        return data;
    },
    error => {
        message.error(error+"")
        return Promise.reject(error);
    }
);

export default http2;