import axios from 'axios'
import config from '../../config/project'

function handler (res) {
    if (res.status === 200) {
        let data = res.data;
        typeof data === 'string' ? data = JSON.parse(data) : 1;
        if (data.ret === 0) {
            return Promise.resolve(data);
        } else {
            throw new Error(data.msg || '网络故障')
        }
    } else {
        throw new Error('网络错误')
    }
}

function get (url, params, headers) {
    return axios({
        url,
        params,
        headers,
        withCredentials: false,
        baseURL: config.baseUrl
    }).then(res => {
        return handler(res)
    })
}

function post (url, data, headers) {
    return axios({
        url,
        data,
        headers,
        withCredentials: false,
        method: 'post',
        baseURL: config.baseUrl
    }).then(res => {
        return handler(res)
    })
}

export { get, post }