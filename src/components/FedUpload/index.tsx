import React, { useMemo } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Upload, Button } from 'antd';
import { UploadProps } from 'antd/es/upload';
import './index.less';
const modelsFile = require.context('../assets/img/icon-file', true);
console.log(modelsFile, 'modelsFile');
interface IUploadProps extends UploadProps {}

interface TypeMap {
    // 正则字符串
    [index: string]: string;
}

const FedUpload = ({ ...props }: IUploadProps) => {
    // const formAccept: string =  useMemo(() => {
    //     let result = ''
    //     const propsAcceptArr =  props?.accept?.split(',') || []
    //     const typeArr = ['.doc,.docx', '.xls']
    //     // const typeMap: TypeMap = {
    //     //     '.doc|.docx': '.doc,.docx,'
    //     // }
    //     typeArr.map(type => {

    //     })
    //     return result
    // }, [props.accept])
    return (
        <div className="fed-upload">
            <div className="fed-upload-control">
                <div className="fed-upload-control-container">
                    <Button>
                        <UploadOutlined /> 上传
                    </Button>
                    <input className="fed-upload-control" type="file" name={props.name} accept={props.accept}></input>
                </div>
                <span className="fed-upload-tip">注：请选择{props.accept}格式的文件</span>
            </div>
            <div className="fed-upload-file-list"></div>
        </div>
    );
};
export default FedUpload;
