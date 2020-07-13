import React, { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import './searchArea.less';

type SearchEvent =
    | React.ChangeEvent<HTMLInputElement>
    | React.MouseEvent<HTMLElement, MouseEvent>
    | React.KeyboardEvent<HTMLInputElement>
    | undefined;
interface searchAreaProps {
    onKeywordSearch(keyword: string, e?: SearchEvent): void;
    onAudit(e: React.MouseEvent): void;
    selectedRowKeys: string[];
    keywordValue: string;
}

export const SearchArea = function(props: searchAreaProps) {
    const { selectedRowKeys, onAudit, keywordValue } = props;
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
        <div className="derate-search-area">
            <Input.Search
                placeholder="减免流水号、租客、资源、合同、意向书、发起人"
                onChange={handleKeywordChange}
                onSearch={handleKeywordSearch}
                value={keyword}
                style={{ width: 360 }}
            />
            <div>
                <Button
                    type="primary"
                    className="f-hidden rental-derate-audit"
                    disabled={selectedRowKeys.length === 0}
                    onClick={onAudit}
                >
                    审核
                </Button>
            </div>
        </div>
    );
};

export default SearchArea;
