import React from 'react';
import FedIcon from '../../../components/FedIcon';

interface Props {
    collapsed: boolean;
}

const CollapseItem = ({ collapsed = false }: Props) => {
    return <FedIcon type={!collapsed ? 'icn_nav_fold' : 'icn_nav_spread'} />;
};
export default CollapseItem;
