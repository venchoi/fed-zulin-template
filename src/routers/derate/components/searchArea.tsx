import React, { useState } from 'react';
import { Button, Input } from 'antd';
import './searchArea.less';

interface searchAreaProps {}
export const SearchArea = function(props: searchAreaProps) {
    const [keyword, setkeyword] = useState<string>('');

    const handleKeywordChange = (value: string): void => {
        console.log(value);
        setkeyword(value);
    };

    return (
        <div className="derate-search-area">
            <Button type="primary">审核</Button>
            <Input.Search
                placeholder="减免流水号、租客、资源、合同、意向书、发起人"
                onSearch={handleKeywordChange}
                value={keyword}
                style={{ width: 360 }}
            />
        </div>
    );
};

export default SearchArea;
