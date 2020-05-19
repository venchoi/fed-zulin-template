import React, { ReactElement } from 'react';
import { message, Spin } from 'antd';
// @ts-ignore
import * as queryString from 'query-string';
import { Layout as AntLayout } from 'antd';
import FedIcon from '../../components/FedIcon';
import FedHeader from './components/FedHeader';
import FedMenu from './components/FedMenu';
import CollapseItem from './components/CollapseItem';
import Logo from './components/Logo';
import { getHomeBaseInfo, getWorkflowTodo } from '../../services/app';
import { find } from 'lodash';
import config from '../../config';
import { handleBaseInfo } from '../../helper/handleBaseInfo';
import { AppInfo, User } from './components/FedHeader/interface';

import './index.less';

const { Header, Sider, Content, Footer } = AntLayout;

const { DEV } = config;
interface dispatchArg {
    type: string;
    data: any;
}
interface Props {
    children: ReactElement;
    dispatch(data: dispatchArg): void;
}

interface LogoInfo {
    icon: string;
    logo: string;
    title: string;
}
interface State {
    inited: boolean;
    collapsed: boolean;
    appList: AppInfo[];
    user: User;
    personalCenterUrl: string;
    logoutUrl: string;
    logoInfo: LogoInfo;
    workflow: object;
    appCode: string;
    is_enabled_wh_workflow: boolean;
}
class Layout extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            inited: false,
            collapsed: false,
            appList: [],
            user: {
                account: '',
                displayName: '',
                display_name: '',
                key: '',
                org_id: '',
                organ_name: '',
                tenantCode: '',
                tenant_code: '',
                tenant_name: '',
                user_id: '',
            },
            personalCenterUrl: '',
            logoutUrl: '',
            logoInfo: {
                icon: '',
                logo: '',
                title: '',
            },
            workflow: {},
            appCode: '',
            is_enabled_wh_workflow: false,
        };
    }

    async componentDidMount() {
        await this.getBaseInfo();
    }

    public render() {
        const { children } = this.props;
        const {
            inited,
            collapsed,
            logoInfo,
            appList = [],
            is_enabled_wh_workflow,
            workflow,
            user,
            personalCenterUrl,
            logoutUrl,
            appCode,
        } = this.state;
        const nav = find(appList, ['key', appCode]);
        return (
            <AntLayout style={{ minHeight: '100vh' }} className="main">
                <Sider
                    style={{ minHeight: '100vh', maxHeight: '100vh' }}
                    trigger={<CollapseItem collapsed={collapsed} />}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={this.onCollapse}
                >
                    <Logo collapsed={collapsed} logoInfo={logoInfo} />
                    <div style={{ maxHeight: 'calc(100vh - 56px)', overflowY: 'scroll' }} className="hide-scrollbar">
                        <FedMenu collapsed={collapsed} menuList={(nav && nav.children) || []} workflow={workflow} />
                    </div>
                </Sider>
                <AntLayout>
                    <Header className="main-header">
                        <FedHeader
                            is_enabled_wh_workflow={is_enabled_wh_workflow}
                            appList={appList}
                            appCode={appCode}
                            user={user}
                            logoutUrl={logoutUrl}
                            personalCenterUrl={personalCenterUrl}
                        />
                    </Header>
                    <Content style={{ overflowX: 'auto' }}>
                        <div style={{ minWidth: '1208px', height: '100%' }}>{inited ? children : <Spin />}</div>
                    </Content>
                    <Footer className="main-footer">
                        Copyright © {new Date().getFullYear()} 明源云空间 版权所有 鄂ICP备15101856号-1
                    </Footer>
                </AntLayout>
            </AntLayout>
        );
    }

    getBaseInfo = async () => {
        const query = queryString.parse((location as any).search);
        const { data } = await getHomeBaseInfo(query);
        const props: any = handleBaseInfo(data);
        this.props.dispatch({
            type: 'initBaseInfo',
            data: props,
        });
        this.setState({ ...props, inited: true });
        const { data: workflowData } = await getWorkflowTodo();
        this.setState({ ...workflowData });
    };

    onCollapse = (collapsed: boolean) => {
        this.setState({ collapsed });
    };
}
export default Layout;
