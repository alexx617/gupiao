import axios from 'axios';
import qs from 'qs';

axios.defaults.withCredentials = true;
const CancelToken = axios.CancelToken;

export default function (opt) {
    let dataList = {
        method: opt.method || 'get',
        url: opt.url,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;'
        },
        cancelAble: opt.cancelAble ?? true
    };
    
    if (dataList.method === 'post') {
        dataList.data = qs.stringify({ param: JSON.stringify(opt.data) });
    } else if (dataList.method === 'get') {
        if (opt.data) {
            dataList.params = opt.data;
        }
    }

    return new Promise((resolve, reject) => {
        axios(dataList)
            .then(res => {
                resolve(res.data);
            })
            .catch(error => {
                console.log('server Err:', error);
                reject(error);
            });
    });
}

function generateReqKey(config) {
    const { method, url, params, data } = config;
    return [method, url, qs.stringify(params), qs.stringify(data)].join('&');
}

const pendingRequest = new Map();

function addPendingRequest(config) {
    const requestKey = generateReqKey(config);
    config.cancelToken =
        config.cancelToken ||
        new axios.CancelToken(cancel => {
            if (!pendingRequest.has(requestKey)) {
                pendingRequest.set(requestKey, cancel);
            }
        });
}

function removePendingRequest(config) {
    let isCancel = false;
    const requestKey = generateReqKey(config);
    if (pendingRequest.has(requestKey)) {
        const cancelToken = pendingRequest.get(requestKey);
        cancelToken(requestKey);
        pendingRequest.delete(requestKey);
        isCancel = true;
    }
    return isCancel;
}

axios.interceptors.request.use(
    config => {
        if (config.cancelAble) removePendingRequest(config);
        addPendingRequest(config);
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    res => {
        removePendingRequest(res.config);
        return res;
    },
    error => {
        let isCancel = removePendingRequest(error.config || {});
        let errorCode = error?.response?.status || '';
        if (!isCancel) {
            errorCode = '网络或服务不可用,请稍后重试';
        }
        console.log(errorCode);
        return error ? Promise.reject(error) : Promise.reject(error.response);
    }
);
