import React from 'react';
import './Header.less';

interface IProps {
    title: string;
}
const Header = ({ title }: IProps) => {
    return (
        <div className="header">
            <div className="header-title">{title}</div>
            {/* TODO project or slot */}
        </div>
    );
};
export default Header;
