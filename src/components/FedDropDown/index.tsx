import React, { Children } from 'react';
import { Dropdown } from 'antd';
import { DropDownProps } from 'antd/es/dropdown';

interface FedDropdownProps extends DropDownProps {
    children?: React.ReactNode;
}

const FedDropdown = ({ children, ...props }: FedDropdownProps) => {
    return (
        <Dropdown {...props}>
            <>{children}</>
        </Dropdown>
    );
};
export default FedDropdown;
