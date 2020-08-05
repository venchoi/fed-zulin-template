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
    onAudit(isAll: boolean | undefined): (e: React.MouseEvent) => void;
    selectedRowKeys: string[];
    keywordValue: string;
    total: number;
}

export const SearchArea = function(props: searchAreaProps) {
    const { selectedRowKeys, onAudit, keywordValue, total } = props;
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
                    disabled={total === 0}
                    onClick={onAudit(true)}
                    style={{
                        marginRight: '16px',
                    }}
                >
                    全部审核
                </Button>

                <Button
                    type="primary"
                    className="f-hidden rental-derate-audit"
                    disabled={selectedRowKeys.length === 0}
                    onClick={onAudit(false)}
                >
                    审核
                </Button>
            </div>
        </div>
    );
};

export default SearchArea;
