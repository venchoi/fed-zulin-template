import request from './xmlRequest';
import getApiPath from './getApiPath';

const config = {
    expire: 0,
    expireTime: 0,
    directions: { mineType: '' },
    fileDomain: '',
    imageDomain: '',
    policy: null,
    accessid: null,
    signature: null,
    callback: '',
    key: '',
    callbackbody: '',
};

/**
 * 获取oss直传配置
 */
export function getOssDirectConfig(call?: any, option?: any) {
    const now = +new Date() / 1000;
    if (now > config.expireTime) {
        request(
            getApiPath('/ancillary/oss-direct/config'),
            {
                type: 'GET',
                success(text: any) {
                    let body;
                    try {
                        body = JSON.parse(text).data || {};
                    } catch (e) {
                        body = {};
                    }
                    //设置过期时间
                    config.expire = +body.expire;
                    config.expireTime = now + body.expire;
                    config.fileDomain =
                        location.protocol && location.protocol.indexOf('https') !== -1
                            ? `https://${body.fileDomain}`
                            : `http://${body.fileDomain}`;
                    config.imageDomain =
                        location.protocol && location.protocol.indexOf('https') !== -1
                            ? `https://${body.imageDomain}`
                            : `http://${body.imageDomain}`;
                    config.policy = body.policy;
                    config.accessid = body.accessid;
                    config.signature = body.signature;
                    config.callbackbody = body.callback;
                    config.directions = body.directions;
                    config.key = body.root ? `${body.root}/` : '';
                    Object.assign(config, option);
                    call && call(config);
                },
            },
            null,
            false
        );
    } else {
        call && call(config);
    }
    return config;
}

/**
 * 获取默认32为的随机字符串
 * @param len
 * @returns {string}
 */
export function random32String(len = 32) {
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
/**
 * 获取文件的类型
 * @param fileName 文件名
 * @returns {string} 返回文件类型
 */
export function getFileType(fileName: any) {
    const pos = fileName.lastIndexOf('.');
    let suffix = '';
    if (pos !== -1) {
        suffix = fileName.substring(pos);
    }
    return suffix.toLowerCase();
}

/**
 * 获取文件类型对应的文件目录
 * @param mineType minetype 类型
 * @returns {string} 返回文件目录
 */
export function getFileDocName(mineType: any) {
    let docName;
    //匹配规则 先匹配强匹配/
    //@ts-ignore
    docName = config.directions[mineType];
    //然后匹配类型
    if (!docName) {
        mineType = mineType.replace(/\/.*/, '/*');
        //@ts-ignore
        docName = config.directions[mineType];
    }
    //还没有则为docs
    return docName ? `${docName}/` : 'docs/';
}

/**
 * 设置上传文件的保存路径
 *      非图片 不改变文件名【根目录/类型/时间戳/文件名】
 *      图片   改变文件名【根目录/类型/时间戳/随机数名】
 * @param file
 * @returns {string}
 */
export function getRandomFileName(file: any) {
    const docName = getFileDocName(file.type);
    if (file.type.indexOf('image') > -1) {
        const name = file.name || '';
        const suffix = name.substring(name.lastIndexOf('.'));
        const newName = random32String(8);
        return `${config.key.replace('/', '')}${docName}${+new Date()}/${newName}${suffix}`;
    }
    return `${config.key.replace('/', '')}${docName}${+new Date()}/${(file.name || '').replace(' ', '_')}`;
}

/**
 * 获取参数
 * @param fileName 文件名
 * @returns {{key: string, policy: null, OSSAccessKeyId: null, success_action_status: string, signature: null}}
 */
export function getOssDirectParams(file: any) {
    getOssDirectConfig();
    const multipartParams = {
        key: getRandomFileName(file),
        policy: config.policy,
        OSSAccessKeyId: config.accessid,
        success_action_status: '200', //让服务端返回200,不然，默认会返回204
        signature: config.signature,
        callback: '',
    };
    if (config.callback) {
        multipartParams.callback = config.callback;
    }
    return multipartParams;
}
/**
 * 获取直传的阿里云地址 上传的地址
 * @returns {null}
 */
export function getOssDirectDomain(arg?: any) {
    getOssDirectConfig();
    return config.fileDomain;
}

/**
 * 获取图片服务的地址 类型为图片的时候使用
 * @returns {null}
 */
export function getOssDirectImageDomain() {
    getOssDirectConfig();
    return config.imageDomain;
}
export function getOssProtectedUrl(filePath: any, call: any) {
    if (!filePath) {
        return false;
    }
    request(
        getApiPath('/ancillary/oss-direct/get-auth-sign-url', { file_path: filePath }),
        {
            type: 'GET',
            success(text: any) {
                let body;
                try {
                    body = JSON.parse(text).data || {};
                } catch (e) {
                    body = {};
                }
                call && call(body);
            },
        },
        null,
        false
    );
}
