import React, { useState } from 'react';
import { Input } from 'antd';
import './inputWithCount.less';
interface InputWithCountType {
    maxLength: number;
    onChange?(e: React.ChangeEvent): void;
    [index: string]: any;
}

export const InputWithCount = (props: InputWithCountType) => {
    const { maxLength, onChange } = props;
    const [inputLen, setInputLen] = useState(0);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        setInputLen(value.length);
        onChange && onChange(e);
    };
    return (
        <div className="input-with-count">
            <Input placeholder="请输入" maxLength={maxLength} {...props} onChange={handleChange} />
            <span className="count">
                {inputLen}/{maxLength}
            </span>
        </div>
    );
};

export default InputWithCount;
