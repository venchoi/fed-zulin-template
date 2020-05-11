import React from 'react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/es/button';

interface FedButtonProps extends ButtonProps {}

const FedButton = ({ children, ...props }: FedButtonProps) => {
    return <Button {...props}>{children}</Button>;
};
export default FedButton;
