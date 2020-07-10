/*
 * @作者: 谭金杰
 * @创建时间: 2020-05-21 14:33:47
 * @最后修改人:   谭金杰
 * @最后修改日期: 2020-05-21 14:33:47
 */ /**
 * 修改缴费通知单页面
 */
import React, { Fragment } from 'react';
import { Upload, message, Button, Dropdown, Menu, Progress } from 'antd';
import { randomStr } from '@/helper/commonUtils';
import { getFileType, getOssDirectDomain } from '@/helper/OssHelper';
import config from '@/config';
import { UploadOutlined, MoreOutlined, DownloadOutlined } from '@ant-design/icons';
import FedIcon from '@c/FedIcon';
import './index.less';
//@ts-ignore
import { ObjectUpload } from 'fedtoolgroup';
const { DEV } = config;
message.config({
    top: 100,
    duration: 2,
    maxCount: 3,
    rtl: true,
});

interface Props {
    files: any;
    fileLength?: number;
    readonly?: any;
    description?: any;
    ossProtected?: any;
    multiple?: boolean;
    accept?: any;
    maxSize?: number;
    onChange?: any;
    onReUploaded?: Function;
}
class Uploader extends React.Component<Props> {
    constructor(props: any) {
        super(props);
        this.reUpload = false;
        this.reUploadIndex = 0;
        this.clickUploadRef = React.createRef();
    }
    reUpload = false;
    reUploadIndex = 0;
    clickUploadRef: any = {};

    componentDidMount() {
        ObjectUpload.init();
    }

    render() {
        const {
            files,
            fileLength = 30,
            readonly,
            description,
            ossProtected,
            multiple = false,
            maxSize = 10,
        } = this.props;
        const accept = ['docx', 'xlsx', 'pptx', 'pdf', 'rar', 'zip'];

        const _this = this;
        const config = {
            multiple: true,
            name: 'file',
            disabled: (files && files.length) >= fileLength,
            // action: getOssDirectDomain(),
            action:
                false && DEV ? 'https://www.mocky.io/v2/5cc8019d300000980a055e76' : getOssDirectDomain(ossProtected),
            className: 'upload-list-inline',
            data(file: any) {
                return file.data;
            },
            beforeUpload(fileEl: any, ...arg: any) {
                //记在之前添加对应的数据 新建一个数组 在其中写入状态
                fileEl.id = randomStr();
                const {
                    // accept = 'picture',
                    accept = 'image/png,image/jpeg,image/jpg,image/gif,application/pdf,application/zip,.rar,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel',
                    fileLength = 30,
                    maxSize = 10,
                    files,
                    onChange,
                } = _this.props;
                if (files.length + arg[0].length > fileLength) {
                    message.error(`最多上传${fileLength}个文件`);
                    return false;
                }
                const fileType = getFileType(fileEl.name).slice(1);
                const isImage = fileEl.type.indexOf('image') !== -1;
                const isZip = 'zip,rar'.indexOf(fileType) !== -1;
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
                    message.error(`文件最大为${maxSize}M`);
                    return false;
                }
                if (files.length >= fileLength) {
                    message.error(`最多上传${fileLength}个文件`);
                    return false;
                }
                //初始化上传sdk
                ObjectUpload.init();
                let isPrivate = ossProtected == true;

                //todo
                //制造一个假的进度条

                if (!_this.reUpload) {
                    ObjectUpload.upload(fileEl, isPrivate)
                        .then((res: any) => {
                            console.log('res');
                            console.log(res);
                            const file = {
                                type: isImage ? 'image' : isZip ? 'zip' : fileType,
                                id: fileEl.id,
                                file_name: fileEl.name,
                                file_path: res,
                                image_path: res,
                                done: true,
                                process: 100,
                                status: 'done',
                            };
                            files.push(file);
                            config.onSuccessNew(fileEl, files);

                            onChange && onChange(file, files);
                        })
                        .catch((err: any) => {
                            // message.error(`${fileEl.name}文件上传出错`);
                            config.onErrorNew(fileEl);
                            console.log('文件上传出错');
                            console.log(err);
                        });
                } else {
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
                                status: 'done',
                            };
                            files.splice(_this.reUploadIndex, 1, file);
                            config.onSuccessNew(fileEl, files);

                            onChange && onChange(file, files);
                        })
                        .catch((err: any) => {
                            config.onErrorNew(fileEl);
                            // this.onErrorNew(fileEl);
                            console.log('文件上传出错');
                            console.log(err);
                        });
                }

                return false;
            },
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info: any) {
                const { files, onChange } = _this.props;
                if (info.file.status === 'uploading') {
                    const file = files.find((f: any) => f.id === info.file.id);
                    if (file) {
                        file.process = Math.round(info.file.percent);
                    }
                    onChange && onChange(file, files);
                }
                if (info.file.status === 'done') {
                    const file = files.find((f: any) => f.id === info.file.id);
                    if (file) {
                        file.done = true;
                        file.process = 100;
                    }

                    _this.reUpload = false;
                    setTimeout(() => {
                        onChange && onChange(file, files);
                    }, 500);

                    message.success(`${info.file.name} 文件上传成功`);
                } else if (info.file.status === 'error') {
                    _this.reUpload = false;
                    message.error(`${info.file.name} 文件上传失败`);
                }
            },
            onSuccessNew(fileEl: any, files: any) {
                _this.reUpload = false;

                const { onChange, onReUploaded } = _this.props;
                const file = files.find((f: any) => f.id === fileEl.id);
                //给file设置下载地址
                //根据ossProtected 区分, 如果是私有地址将file_path设置为通过getDownloadUrl返回的路径

                if (ossProtected) {
                    ObjectUpload.getDownloadUrl(file.file_path).then((res: any) => {
                        //去掉认证参数
                        let url = res.split('?')[0];
                        file.auth_file_path = res;
                        file.file_path = url;
                        file.image_path = url;
                        onChange && onChange(file, files);
                        onReUploaded && onReUploaded(files);
                        message.success(`${fileEl.name} 文件上传成功`);
                        return this;
                    });
                } else {
                    file.auth_file_path = file.file_path;
                    onChange && onChange(file, files);
                    onReUploaded && onReUploaded(files);
                    message.success(`${fileEl.name} 文件上传成功`);
                }
            },
            onErrorNew(fileEl: any) {
                _this.reUpload = false;
                message.error(`${fileEl.name} 文件上传出错`);
            },
        };

        return (
            <div className="component-uploader">
                {!readonly ? (
                    <Fragment>
                        <Upload {...config} listType={'picture'}>
                            <Button>
                                <UploadOutlined ref={this.clickUploadRef} /> 上传
                            </Button>
                            {/* <Button>
                                <Icon type="upload" />
                                <span ref={this.clickUploadRef}>上传</span>
                            </Button> */}
                            <span className="uploader-description">
                                <span>{description ? description : `注：单个附件最大支持${maxSize}M，已上传`}</span>
                                {files.length}
                                <span>/</span>
                                {fileLength}
                            </span>
                        </Upload>
                        {files.length > 0 ? (
                            <div className="attachment-list">
                                {files.map((item: any) => {
                                    const fileIconName =
                                        accept.indexOf(item.type) > -1
                                            ? `icon-file-${item.type}.png`
                                            : 'icon-file-unknown.png';
                                    // const path = require(`../../assets/img/icon-file/${fileIconName}`);
                                    return item.type.indexOf('image') > -1 ? (
                                        <div className="attachment-item-for-image" key={item.id}>
                                            {item.done ? (
                                                <img
                                                    className="icon-file"
                                                    src={
                                                        (item.image_path &&
                                                            `${item.auth_file_path || item.image_path}`) ||
                                                        require(`../../assets/img/icon-file/${fileIconName}`)
                                                    }
                                                    alt=""
                                                />
                                            ) : (
                                                <Progress
                                                    percent={item.process}
                                                    width={120}
                                                    strokeWidth={3}
                                                    size="small"
                                                    showInfo={false}
                                                />
                                            )}
                                            <div className="delete-img-mask" />
                                            <FedIcon
                                                title="删除"
                                                type="icon-shanchu2"
                                                className="delete-icon"
                                                onClick={this.delete.bind(this, item)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="attachment-item" key={item.id}>
                                            <img
                                                className="icon-file"
                                                src={require(`../../assets/img/icon-file/${fileIconName}`)}
                                                alt=""
                                            />
                                            <div>
                                                <div className="file-name">{item.file_name}</div>
                                                {item.process === 100 ? (
                                                    <div className="file-description">
                                                        {item.upload_time || '2019-06-13'}
                                                    </div>
                                                ) : (
                                                    <Progress
                                                        percent={item.process}
                                                        width={120}
                                                        strokeWidth={3}
                                                        size="small"
                                                        showInfo={false}
                                                    />
                                                )}
                                            </div>
                                            {item.process === 100 ? (
                                                <Dropdown overlay={this.menu.bind(this, item)}>
                                                    <MoreOutlined />
                                                </Dropdown>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : null}
                    </Fragment>
                ) : (
                    <Fragment>
                        {files
                            ? files.map((item: any) => {
                                  const accept = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'rar', 'zip'];
                                  const fileIconName =
                                      accept.indexOf(item.type) > -1
                                          ? `icon-file-${item.type}.png`
                                          : 'icon-file-unknown.png';
                                  const path = require(`../../assets/img/icon-file/${fileIconName}`);
                                  return item.type === 'image' ? (
                                      <a
                                          className="attachment-image"
                                          href={item.auth_file_path || item.file_path}
                                          key={item.id}
                                          rel="noopener noreferrer"
                                          target="_blank"
                                      >
                                          <img src={`${item.auth_file_path || item.file_path}`} alt="" />
                                      </a>
                                  ) : (
                                      <div className="inline-block">
                                          <div className="attachment-list" key={item.id}>
                                              <img
                                                  className="icon-file"
                                                  src={require(`../../assets/img/icon-file/${fileIconName}`)}
                                                  alt=""
                                              />
                                              <div>
                                                  <div className="file-name">{item.file_name}</div>
                                                  <div className="file-description">{item.upload_time}</div>
                                              </div>
                                              <a
                                                  href={item.auth_file_path || item.file_path}
                                                  rel="noopener noreferrer"
                                                  target="_blank"
                                                  className="icon-download"
                                              >
                                                  <DownloadOutlined />
                                              </a>
                                          </div>
                                      </div>
                                  );
                              })
                            : null}
                    </Fragment>
                )}
            </div>
        );
    }

    menu(item: any) {
        return (
            <Menu>
                <Menu.Item onClick={this.delete.bind(this, item)} key="1">
                    <span>删除</span>
                </Menu.Item>
                <Menu.Item onClick={this.reUploadAction.bind(this, item)} key="2">
                    <span>重新上传</span>
                </Menu.Item>
            </Menu>
        );
    }

    delete(item: any) {
        const { files, onChange } = this.props;
        onChange &&
            onChange(
                '',
                files.filter((i: any) => i.id !== item.id)
            );
    }

    reUploadAction(item: any) {
        const { files } = this.props;
        let reUploadIndex = 0;
        for (let i = 0; i < files.length; i++) {
            if (files[i].id === item.id) {
                reUploadIndex = i;
                break;
            }
        }

        this.reUpload = true;
        this.reUploadIndex = reUploadIndex;
        if (this.clickUploadRef && this.clickUploadRef.current) {
            this.clickUploadRef.current.click();
        }
    }
}

export default Uploader;
