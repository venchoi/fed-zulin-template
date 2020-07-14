import React, { useState, useEffect } from 'react';
import { Button, Input, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import './renterListSearchArea.less';

type SearchEvent =
    | React.ChangeEvent<HTMLInputElement>
    | React.MouseEvent<HTMLElement, MouseEvent>
    | React.KeyboardEvent<HTMLInputElement>
    | undefined;
interface searchAreaProps {
    onKeywordSearch(keyword: string, e?: SearchEvent): void;
    keywordValue: string;
}

const { Option } = Select;
// 合同状态
const statusLists = [
    {
        name: '待审核',
        value: '待审核'
    },
    {
        name: '审核中',
        value: '审核中'
    },
    {
        name: '已审核',
        value: '已审核'
    },
    {
        name: '执行中',
        value: '执行中'
    },
    {
        name: '已关闭',
        value: '已关闭'
    },
];
const typeList = ['企业', '工商个体', '个人'];
export const renterListSearchArea = function(props: searchAreaProps) {
    const { keywordValue } = props;
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        setKeyword(keywordValue);
    }, [keywordValue]);

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        setKeyword(value);
    };

    const handleKeywordSearch = (value: string, e?: SearchEvent): void => {
        const { onKeywordSearch } = props;
        onKeywordSearch && onKeywordSearch(value, e);
    };

    return (
        <div className="renter-list-search-area">
            <div className="search-form">
                <Input.Search
                    className="search-form-item"
                    placeholder="租客名称/手机号/合同编号"
                    onChange={handleKeywordChange}
                    onSearch={handleKeywordSearch}
                    value={keyword}
                    style={{ width: 240 }}
                />
                <Select
                    className="search-form-item"
                    placeholder="租客类型"
                    style={{
                        width: 135
                    }}
                    allowClear
                >
                    {
                        typeList.map(type => <Option value={type}>{ type }</Option>)
                    }
                </Select>
                <Select
                    className="search-form-item"
                    placeholder="合同状态"
                    style={{
                        width: 135
                    }}
                    allowClear
                >
                    {
                        statusLists.map(status => <Option value={status.value}>{ status.name }</Option>)
                    }
                </Select>
            </div>
            <div>
                <Button>
                    <SettingOutlined />
                </Button>
            </div>
        </div>
    );
};

export default renterListSearchArea;
