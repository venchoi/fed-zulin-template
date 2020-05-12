import React, { useEffect, useState } from 'react';
import { List, Card } from 'antd';
import { find } from 'lodash';
// @ts-ignore
import * as queryString from 'query-string';
import FedIcon from '../../components/FedIcon';
import { getHomeBaseInfo } from '../../services/app';
import config from '../../config';
import { handleBaseInfo } from '../../helper/handleBaseInfo';

import './index.less';

const { DEV } = config;

const { Item: ListItem } = List;

const UI = () => {
    const [appList, setAppList] = useState<any[]>([]);
    const getBaseInfo = async () => {
        const query = queryString.parse((location as any).search);
        const { data } = await getHomeBaseInfo(query);
        const { appList }: { appList: any[] } = handleBaseInfo(data);
        const nav = find(appList, ['key', 'Rental']).children;
        setAppList(nav);
    };
    useEffect(() => {
        getBaseInfo();
    }, []);
    return (
        <List
            className="layout-list"
            grid={{ gutter: 16, column: 4 }}
            dataSource={appList}
            renderItem={item => {
                return (
                    <ListItem>
                        <Card title={item.func_name}>
                            <div className="ui-card-content">
                                <div>{item.icon}</div>
                                <div>
                                    <FedIcon type={item.icon} style={{ fontSize: '24px' }} />
                                </div>
                            </div>
                        </Card>
                    </ListItem>
                );
            }}
        />
    );
};
export default UI;
