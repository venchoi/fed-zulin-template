import React from 'react';
import TreeProjectSelect from '@/components/TreeProjectSelect';
import { Divider, Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { ClickParam } from 'antd/lib/menu';
import { projsValue } from '@/types/project';
import './TopRightFunc.less';
import { TopRightFuncProps } from '../index.d';

const TopRightFunc = (props: TopRightFuncProps) => {
    const handleMenuClick = (param: ClickParam) => {
        console.log(param);
    };

    const handleTreeSelected = (selectedProject: projsValue) => {
        props.onChange('project', selectedProject);
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1">批量打印</Menu.Item>
            <Menu.Item key="2">逐一打印</Menu.Item>
        </Menu>
    );

    const menu2 = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1">合并开收据</Menu.Item>
            <Menu.Item key="2">合并开发票</Menu.Item>
            <Menu.Item key="3">合并申请开票</Menu.Item>
        </Menu>
    );

    return (
        <div data-component="outlay-topRightFunc">
            <TreeProjectSelect onTreeSelected={handleTreeSelected} width={244}></TreeProjectSelect>
            <Divider type="vertical" style={{ height: '28px', margin: '0 16px' }}></Divider>
            <Dropdown overlay={menu2}>
                <Button type="primary">
                    批量操作 <DownOutlined />
                </Button>
            </Dropdown>
            <Dropdown overlay={menu}>
                <Button>
                    打印数据 <DownOutlined />
                </Button>
            </Dropdown>
        </div>
    );
};

export default TopRightFunc;
