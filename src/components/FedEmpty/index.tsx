import React from 'react';
import { Empty } from 'antd';
import { EmptyProps } from 'antd/es/empty';
// import EMPTY_DEFAULT from './empty_default.svg'

const { PRESENTED_IMAGE_SIMPLE } = Empty;

interface FedEmptyProps extends EmptyProps {}

const FedEmpty = ({ image = PRESENTED_IMAGE_SIMPLE, ...props }: FedEmptyProps) => {
    return <Empty image={image} {...props} />;
};
export default FedEmpty;
