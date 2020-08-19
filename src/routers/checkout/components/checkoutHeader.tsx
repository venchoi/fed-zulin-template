import React from 'react';
import { PageHeader } from 'antd';
import { Route } from 'antd/es/breadcrumb/Breadcrumb';
import { Link } from 'dva/router';

const CheckoutHeader = () => {
    const routes = [
        {
            path: '/checkout/list',
            breadcrumbName: '退租办理',
        },
        {
            path: '',
            breadcrumbName: '办理退租',
        },
    ];
    const itemRender = (route: Route) => {
        if (route.path) {
            return (
                <Link to={route.path} key={route.path}>
                    {route.breadcrumbName}
                </Link>
            );
        }
        return <span key={route.path}>{route.breadcrumbName}</span>;
    };

    return (
        <>
            <PageHeader title="退租办理" breadcrumb={{ routes, itemRender, separator: '>' }} ghost={false} />
        </>
    );
};

export default CheckoutHeader;
