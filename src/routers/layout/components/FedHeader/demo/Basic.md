---
title: 基本用法
order: 0
---

默认示例

```jsx
import React, { Component } from 'react';
import { Button } from 'antd';
import FedHeader from '../index';
import './Basic.less';

const data = {
    appList: [
        {
            name: '管理中心',
            key: 'ManagementCenter',
            url: 'https://app-ykj-test.myfuwu.com.cn/bms/?_smp=ManagementCenter',
        },
        {
            name: '运营中心',
            key: 'OperationCenter',
            url: 'https://app-ykj-test.myfuwu.com.cn/bms/WeChat/menu/index?_smp=OperationCenter',
        },
        {
            name: '租赁中心',
            key: 'Rental',
            url: 'https://rental-ykj-test.myfuwu.com.cn?_smp=Rental',
            current: true,
        },
        {
            name: '资管中心',
            key: 'AssetCenter',
            url: 'https://asset-ykj-test.myfuwu.com.cn?_smp=AssetCenter',
        },
        {
            name: '物管中心',
            key: 'PropertyBase',
            url: 'https://pb-ykj-test.myfuwu.com.cn?_smp=PropertyBase',
        },
        {
            name: '公寓中心',
            key: 'Apartment',
            url: 'https://apartment-ykj-test.myfuwu.com.cn?_smp=Apartment',
        },
        {
            name: '会员中心',
            key: 'MemberCenter',
            url: 'https://member-ykj-test.myfuwu.com.cn?_smp=MemberCenter',
        },
        {
            name: 'xxxxx',
            key: 'xxxxx',
            url: 'https://member-ykj-test.myfuwu.com.cn?_smp=xxxxx',
        },
    ],
    passwordUrl: 'https://app-ykj-test.myfuwu.com.cn/bms//Organization/user/password?_ac=ManagementCenter',
    user: {
        key: '13688064729691a17601404534682adc7d0d902f',
        user_id: '22b11db4-e907-4f1f-8835-b9daab6e1f23',
        account: 'jqs',
        displayName: '超级用户',
        display_name: '超级用户',
        org_id: '11b11db4-e907-4f1f-8835-b9daab6e1f23',
        tenantCode: 'jqs',
        tenant_code: 'jqs',
        tenant_name: '资管三组测试专用帐号',
        organ_name: '测试集团',
    },
    logoutFunction: () => {
        console.log('登出');
    },
};

class Basic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuMode: 'inline',
        };
    }

    render() {
        const { menuMode } = this.state;
        return (
            <div className="basic-demo-wrapper">
                <div className="demo-header-wrapper">
                    <FedHeader {...data} getPopupContainer />
                </div>
                <div>
                    <Button
                        type={menuMode === 'inline' ? 'primary' : 'default'}
                        onClick={this.toggleMenuMode.bind(this, 'inline')}
                    >
                        menuMode: inline
                    </Button>
                    <Button
                        type={menuMode === 'vertical' ? 'primary' : 'default'}
                        style={{ marginLeft: '16px' }}
                        onClick={this.toggleMenuMode.bind(this, 'vertical')}
                    >
                        menuMode: vertical
                    </Button>
                </div>
            </div>
        );
    }
    toggleMenuMode = menuMode => {
        this.setState({ menuMode });
    };
}

ReactDOM.render(<Basic />, mountNode);
```
