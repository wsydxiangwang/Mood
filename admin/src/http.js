import axios from 'axios'
import router from './router'
import { Loading } from 'element-ui'

const http = axios.create({
    baseURL: process.env.VUE_APP_URL || '/admin/api',
    timeout: 5000
})

let loading;

// request 拦截器
http.interceptors.request.use(
    config => {

        // 设置token
        const token = localStorage.getItem("Authorization");
        config.headers.Authorization = `Bearer ${token}`;

        // loading
        loading = Loading.service({
            target: '.container',
            background: '#fff'
        });

        return config;
    }, 
    err => {
        return Promise.reject(err);
    }
)

// response 拦截器
http.interceptors.response.use(
    response => {
        setTimeout(() => {
            loading.close();
            loading = null;
        }, 500)
        return response;
    },
    error => {
        if (error.response) {
            if (error.response.status == 401) {
                // 清除token信息并跳转到登录页面
                localStorage.removeItem('Authorization');
                router.replace({path: 'login'})
            }
        }
        // return Promise.reject(error.response.data)   // 返回接口返回的错误信息
    }
)

export default http