//简易编写 get    formData 表单数据
export default function xmlRequest(url: string, options: any, data = null, async = true, timeout = 60000) {
    //创建xhr对象
    const xhr = new XMLHttpRequest();
    //设置xhr请求的超时时间
    if (async) {
        xhr.timeout = timeout;
        //设置响应返回的数据格式
        xhr.responseType = 'text';
    }
    //创建一个 post 请求，采用异步
    xhr.open(options.type, url, async);
    //注册相关事件回调处理函数
    xhr.onload = function() {
        if (+this.status === 200 || +this.status === 304) {
            options.success(this.responseText);
        } else {
            options.error(this.responseText);
        }
    };
    xhr.ontimeout = function() {
        options.error && options.error(this.responseText);
    };
    xhr.onerror = function() {
        options.error && options.error(this.responseText);
    };
    //redo 上传进度
    xhr.upload.onprogress = function(event) {
        options.progress && options.progress(event.loaded / event.total);
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    //发送数据
    xhr.send(data);
}
