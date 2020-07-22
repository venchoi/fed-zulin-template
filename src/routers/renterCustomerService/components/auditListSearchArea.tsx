import React, { useState, useEffect } from 'react';
import { Button, Input, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import './auditListSearchArea.less';
import { auditSearchAreaProps } from '../list.d';

type SearchEvent =
    | React.ChangeEvent<HTMLInputElement>
    | React.MouseEvent<HTMLElement, MouseEvent>
    | React.KeyboardEvent<HTMLInputElement>
    | undefined;
const { Option } = Select;
// 审核状态
const statusLists = [
    {
        name: '已审核',
        value: '已审核'
    },
    {
        name: '审核不通过',
        value: '审核不通过'
    },
    {
        name: '待审核',
        value: '待审核'
    },
];
const typeList = ['企业', '工商个体', '个人'];
export const renterListSearchArea = function(props: auditSearchAreaProps) {
    const { keywordValue, onSearch } = props;
    const [keyword, setKeyword] = useState('');
    const [status, setStatus] = useState<string | undefined>();

    useEffect(() => {
        setKeyword(keywordValue);
    }, [keywordValue]);

    useEffect(() => {
        onSearch && onSearch({
            keyword,
            status: status || ''
        });
    }, [status])

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        setKeyword(value);
    };

    const handleKeywordSearch = (value: string, e?: SearchEvent): void => {
        onSearch && onSearch({
            keyword: value,
            status: status || ''
        });
    };

    const handleFormItemChange = (type: string) => (value: string): void => {
        switch(type) {
            case 'status':
                setStatus(value);
                break; 
            default:
                break;
        }
    };

    return (
        <div className="audit-list-search-area">
            <div className="search-form">
                <Input.Search
                    className="search-form-item"
                    placeholder="申请人手机/原管理员手机/合同编号"
                    onChange={handleKeywordChange}
                    onSearch={handleKeywordSearch}
                    value={keyword}
                    style={{ width: 240 }}
                />
                <Select
                    className="search-form-item"
                    placeholder="状态"
                    style={{
                        width: 135
                    }}
                    allowClear
                    value={status}
                    onChange={handleFormItemChange('status')}
                >
                    {
                        statusLists.map(status => <Option value={status.value}>{ status.name }</Option>)
                    }
                </Select>
            </div>
            {/* <div>
                <Button>
                    <SettingOutlined />
                </Button>
            </div> */}
        </div>
    );
};

export default renterListSearchArea;
