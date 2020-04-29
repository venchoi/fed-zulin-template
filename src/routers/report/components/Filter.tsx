import React, { useState } from 'react';
import { Input } from 'antd';
import './Filter.less';

const { Search } = Input;

interface IParams {
    keyword?: string;
}

interface IProps {
    onFilterChange?: <IParams>() => {};
    keyword?: string;
    rightSlot?: JSX.Element;
}

const Filter = ({ onFilterChange, rightSlot }: IProps) => {
    const [keyword, setKeyword] = useState<string>('');
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
            {rightSlot ? <div className="filter-right">{rightSlot}</div> : null}
        </div>
    );
};
export default Filter;