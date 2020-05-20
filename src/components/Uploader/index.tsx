/*
 * @作者: 谭金杰
 * @创建时间: 2020-05-20 16:52:10
 * @最后修改人:   谭金杰
 * @最后修改日期: 2020-05-20 16:52:10
 */ /**
 * 文件上传
 * @param
 * accept = 'image/*',
 * maxNum = 15, 单次上传
 *  maxSize = 10, 文件大小
 *  defaultFileList,  默认文件列表
 * maxFile = 50 全部文件个数
 * multiple 多个文件上传
 * listType  文件上传后展示模式
 * disabled 禁止
 * create by miracle 2019年4月18日16:13:38
 */
import React from 'react';
// import Upload from 'rc-upload'
import { Upload, message } from 'antd';
import moment from 'moment';
import { getFileType, getOssDirectDomain, getOssDirectParams } from '@/helper/OssHelper';
import './index.less';
import { enCodeFileName } from '@/helper/commonUtils';

const { Dragger } = Upload;
//@ts-ignore
import { ObjectUpload } from 'fedtoolgroup';

interface Props {
    defaultFileList?: Array<any>;
    disabled?: boolean;
    multiple?: boolean;
    maxFile?: number;
    listType?: 'picture' | 'text' | 'picture-card' | undefined;
    drag?: boolean;
    accept: string;
    ossProtected: any;
    maxNum?: number;
    maxSize?: number;
    reuploadMode: any;
    onRemove?: (file: any) => {};
    onChange?: (file: any, fileList: any) => {};
    noMessage: any;
    onReUploaded: (fileList: any) => {};
    onError: any;
}

interface State {
    defaultAccept: string;
    fileList: Array<any>;
}

export default class FileUpload extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const { defaultFileList = [], disabled } = this.props;
        // 初始化配置
        this.state = {
            fileList: [...defaultFileList], // 上传的文件列表
            defaultAccept:
                'image/png,image/jpeg,image/jpg,image/gif,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel',
        };
        this.initUploadConfig();
    }

    uploaderProps: any = {};

    componentDidMount() {
        ObjectUpload.init();
    }

    render() {
        const {
            children,
            multiple = true,
            accept,
            listType = 'picture',
            drag = false,
            disabled = false,
            maxFile = 50,
        } = this.props;
        const { defaultAccept, fileList } = this.state;

        const props = {
            ...this.uploaderProps,
            accept: accept || defaultAccept,
            multiple: true,
            fileList,
            listType,
            className: 'upload-list-inline',
            disabled,
        };

        return (
            <div className="file-upload-wrapper">
                {drag ? (
                    //@ts-ignore
                    <Dragger {...props}>{fileList.length >= maxFile ? null : children}</Dragger>
                ) : (
                    <Upload
                        {...this.uploaderProps}
                        accept={accept || defaultAccept}
                        multiple={multiple}
                        fileList={fileList}
                        listType={listType}
                        disabled={disabled}
                        showUploadList={false}
                        className="upload-list-inline"
                    >
                        {fileList.length >= maxFile ? null : children}
                    </Upload>
                )}
            </div>
        );
    }

    //
    checkIsCanChange = () => {};

    // 初始化上传配置
    // todo
    // beforeUpload return false 或是 reject 并不能阻止继续上传。还是会调用onchange方法
    // 目前解决思路。1.限制单个上传。当上传个数达到上传最大数。隐藏上传按钮
    // 2.不符合上传规则时，直接通过父组件将之关闭。强行中断upload
    // 3.通过上传状态判断 当上传成功时， 才去增加。
    initUploadConfig = () => {
        const that = this;
        const { defaultAccept, fileList } = this.state;
        const { ossProtected } = this.props;
        this.uploaderProps = {
            action: getOssDirectDomain(),
            data(file: any) {
                return file.data;
            },
            beforeUpload(fileEl: any, fileListUpload: any) {
                //maxNum 单次最大上传个数 maxSize 单个文件最大M  maxFile 全部上传个数
                const { accept = defaultAccept, maxNum = 15, maxSize = 10, maxFile = 50, reuploadMode } = that.props;
                const { fileList } = that.state;
                if (fileListUpload.length > maxNum) {
                    message.error(`单次上传文件不能超过${maxNum}个`);
                    return false;
                }
                const fileType = getFileType(fileEl.name).slice(1);
                let fileMineType = fileEl.type;
                const MAX_ROOM_FILE_FILE = 1024 * 1024 * maxSize;
                if (fileMineType === '') {
                    fileMineType = fileType;
                }
                if (
                    accept.indexOf(fileType) === -1 &&
                    accept.indexOf(fileMineType.replace(/\/.*$/, '/*')) === -1 &&
                    accept.indexOf(fileMineType) === -1
                ) {
                    message.error(`${fileEl.name}的文件类型不支持`);
                    return false;
                }
                if (MAX_ROOM_FILE_FILE < fileEl.size) {
                    message.error(`${fileEl.name}超过了单个文件最大(${maxSize}M)限制`);
                    return false;
                }
                if (fileList.length > maxFile && !reuploadMode) {
                    message.error(`最多上传${maxFile}个文件`);
                    return false;
                }
                const isImage = fileEl.type.indexOf('image') !== -1;
                const isZip = 'zip,rar'.indexOf(fileType) !== -1;

                ObjectUpload.init();
                let isPrivate = ossProtected == true;
                if (!reuploadMode) {
                    fileEl.percent = 0;
                    fileEl.status = 'uploading';
                    ObjectUpload.upload(fileEl, isPrivate)
                        .then((res: any) => {
                            const file = {
                                type: isImage ? 'image' : isZip ? 'zip' : fileType,
                                id: fileEl.id,
                                file_name: fileEl.name,
                                file_path: res,
                                image_path: res,
                                done: true,
                                process: 100,
                            };
                            fileList.push(file);
                            that.uploaderProps.onSuccessNew(res, fileEl);
                        })
                        .catch((err: any) => {
                            that.uploaderProps.onErrorNew(fileEl);
                        });
                }

                return false;

                const config = getOssDirectParams(fileEl);
                fileEl.data = config;
                fileEl.url = enCodeFileName(`${getOssDirectDomain()}/${config.key}`);
                fileEl.create_on = moment()
                    .format('YYYY-MM-DD')
                    .toString();
                fileEl.file_type = isImage ? 'image' : isZip ? 'zip' : fileType;
                return true;
            },
            onChange({ file, fileList }: any) {
                const { onChange, noMessage } = that.props;
                // 上传成功后 将数据返回
                if (file.status === 'uploading') {
                    file.percent = file.percent || 0;
                    onChange && onChange(file, fileList);
                } else if (file.status === 'done') {
                    !noMessage && message.success(`${file.name} 上传成功`);
                    // 由于后台不支持base64 故需要将thumbUrl的存储的值替换掉
                    file.thumbUrl = file.url;
                    onChange && onChange(file, fileList);
                } else if (file.status === 'error') {
                    !noMessage && message.error(`${file.name} 上传失败`);
                }
                file.status && that.setState({ fileList: [...fileList] });
            },
            onRemove(file: any) {
                const { onRemove } = that.props;
                onRemove && onRemove(file);
            },
            onSuccessNew(result: any, fileEl: any) {
                const { fileList } = that.state;
                const { onChange, onReUploaded, noMessage } = that.props;
                const file = fileList.find(f => f.id === fileEl.id);
                //给file设置下载地址
                //根据ossProtected 区分, 如果是私有地址将file_path设置为通过getDownloadUrl返回的路径

                if (ossProtected) {
                    ObjectUpload.getDownloadUrl(file.file_path).then((res: any) => {
                        //去掉认证参数
                        let url = res.split('?')[0];
                        file.auth_file_path = res;
                        file.file_path = url;
                        file.image_path = url;
                        file.url = url;
                        file.percent = 100;
                        file.status = 'done';
                        onChange && onChange(file, fileList);
                        onReUploaded && onReUploaded(fileList);
                        return this;
                    });
                } else {
                    file.auth_file_path = file.file_path;
                    !noMessage && message.success(`${file.file_name} 上传成功`);
                    file.percent = 100;
                    file.status = 'done';
                    file.url = file.file_path || result;
                    onChange && onChange(file, fileList);
                    onReUploaded && onReUploaded(fileList);
                }
            },
            onError(err: any, response: any, fileEl: any) {
                const { fileList } = that.state;
                const { onError, onReUploaded } = that.props;
                fileList.forEach((f, i) => {
                    if (f.id === fileEl.id) {
                        fileList.splice(i, 1);
                    }
                });
                onError && onError(null, `${fileEl.name}文件上传出错`);
                onReUploaded && onReUploaded(fileEl); //之前是files 找不到
            },
            onErrorNew(fileEl: any) {
                const { fileList } = that.state;
                const { onError, onReUploaded } = that.props;
                onError && onError(null, `${fileEl.name}文件上传出错`);
                onReUploaded && onReUploaded(fileList);
            },
        };
    };
}
