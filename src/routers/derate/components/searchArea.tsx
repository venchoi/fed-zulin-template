import React, { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
// @ts-ignore
import * as queryString from 'query-string';
import './searchArea.less';

interface searchAreaProps {
    onKeywordChange(keyword: string): void;
    onAudit(e: React.MouseEvent): void;
    selectedRowKeys: string[];
}
export const SearchArea = function(props: searchAreaProps) {
    const { selectedRowKeys, onAudit } = props;
    const [keyword, setkeyword] = useState<string>('');

    useEffect(() => {
        const query = queryString.parse(location.search);
        if (query && query.keyword) {
            setkeyword(query.keyword);
        }
    }, []);

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        const { onKeywordChange } = props;
        setkeyword(value);
        onKeywordChange(value);
    };

    return (
        <div className="derate-search-area">
            <Button type="primary" disabled={selectedRowKeys.length === 0} onClick={onAudit}>
                审核
            </Button>
            <Input.Search
                placeholder="减免流水号、租客、资源、合同、意向书、发起人"
                onChange={handleKeywordChange}
                value={keyword}
                style={{ width: 360 }}
            />
        </div>
    );
};

export default SearchArea;
