import React, { useState } from 'react';
import { Button, DatePicker } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import './index.less';

const { RangePicker } = DatePicker;
export default function IconRangePicker(props: any) {
    const { onChange, type, value } = props;
    const [hide, setHide] = useState(false);
    const hasValue = value && value[0];
    const emptyBtn = value ? (
        <div style={{ textAlign: 'right' }}>
            <Button
                onClick={() => {
                    onChange && onChange([], []);
                    setHide(true);
                    setTimeout(() => {
                        setHide(false);
                    }, 20);
                }}
                size="small"
            >
                重置
            </Button>
        </div>
    ) : null;
    return (
        <span className={`c-icon-range-picker ${type === 'inline' ? 'inline' : ''} ${hasValue ? 'selected' : ''}`}>
            <RangePicker
                allowClear={false}
                suffixIcon={<CalendarOutlined />}
                renderExtraFooter={() => emptyBtn}
                {...props}
                {...(hide ? { open: false, value: [] } : {})}
            />
        </span>
    );
}
