/**
 * 标准单价状态
 */
import React from 'react';
import { CheckCircleFilled, MinusCircleFilled } from '@ant-design/icons';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import { ENABLE } from '@t/common';
import { Space } from 'antd';
const MyComponents = {
    CheckCircleFilled(props: Pick<AntdIconProps, 'color'>) {
        return (
            <>
                <CheckCircleFilled style={{ color: '#00AD74' }} />
            </>
        );
    },
    MinusCircleFilled(props: Pick<AntdIconProps, 'color'>) {
        return (
            <>
                <MinusCircleFilled color="#868B8F" />
            </>
        );
    },
};
const enabledMap = {
    [ENABLE.ENABLED]: {
        icon: MyComponents.CheckCircleFilled,
        color: '#00AD74',
        text: '启用中',
    },
    [ENABLE.NOTENABLED]: {
        icon: MyComponents.MinusCircleFilled,
        color: '#868B8F',
        text: '未启用',
    },
};
export default ({ is_enabled }: { is_enabled: ENABLE }) => {
    const enabledItem = enabledMap[is_enabled];
    const StatusComponent = enabledItem?.icon;
    return (
        <Space size={4}>
            <StatusComponent color={enabledItem?.color} />
            <span style={{ color: enabledItem?.color }}>{enabledItem?.text}</span>
        </Space>
    );
};
