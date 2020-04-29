import React, { useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import './Filter.less';
import MyIcon from '../../../components/FedIcon';

const { Search } = Input;

interface IParams {
    keyword?: string;
}

interface IProps {
    onFilterChange?: <IParams>() => {};
    keyword?: string;
}

const Filter = ({ onFilterChange }: IProps) => {
    const [keyword, setKeyword] = useState<string>('');
    const handleDownload = () => {
        const version = navigator.userAgent;
        if (version.indexOf('Mac OS') !== -1) {
            window.location.href = 'http://down.finereport.com/FineReport8.0-CN.dmg';
        } else {
            window.location.href = 'http://down.finereport.com/FineReport8.0-CN.exe';
        }
    };
    return (
        <div className="filter">
            <div className="filter-left">
                <Search
                    placeholder="报表名称"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    // onSearch={e => search}
                    // onPressEnter={search}
                />
            </div>
            <div className="filter-right">
                <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                    下载报表工具
                </Button>
                <Button>从报表库中添加</Button>
                <Button type="primary">添加报表</Button>
            </div>
        </div>
    );
};
export default Filter;
