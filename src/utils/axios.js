// src/utils/axios.js
import axios from "axios";
import { Toast } from "zarm";

const MODE = import.meta.env.MODE; // 环境变量

axios.defaults.baseURL =
  MODE == "development" ? "http://127.0.0.1:7001" : "http://127.0.0.1:7001"; // koa-egg插件处理跨域
// MODE == "development" ? "/api" : "/api"; // 配置代理处理跨域
axios.defaults.withCredentials = true; // 将withCredentials选项设置为true，这允许Axios随跨域请求一起发送cookie。
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest"; // 将X-Requested-With头设置为XMLHttpRequest，这是一个常用的头，用于标识AJAX请求。
axios.defaults.headers["Authorization"] = `${
  localStorage.getItem("token") || null
}`; // 将Authorization头设置为浏览器本地存储中token项的值。这允许客户端使用基于令牌的身份验证系统进行身份验证。
axios.defaults.headers.post["Content-Type"] = "application/json"; // 将Content-Type头设置为application/json，用于POST请求，告诉服务器请求体将以JSON格式发送。

axios.interceptors.response.use((res) => {
  if (typeof res.data !== "object") {
    Toast.show("服务端异常！");
    return Promise.reject(res);
  }
  if (res.data.code != 200) {
    if (res.data.msg) Toast.show(res.data.msg);
    if (res.data.code == 401) {
      window.location.href = "/login";
    }
    return Promise.reject(res.data);
  }

  return res.data;
});

export default axios;
