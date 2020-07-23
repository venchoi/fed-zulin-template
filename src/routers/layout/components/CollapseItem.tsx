import React from 'react';
import FedIcon from '@c/FedIcon';

interface Props {
    collapsed: boolean;
}

const CollapseItem = ({ collapsed = false }: Props) => {
    return <FedIcon type={!collapsed ? 'icon-icn_nav_fold' : 'icon-icn_nav_spread'} />;
};
export default CollapseItem;
