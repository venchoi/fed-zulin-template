import React, { ReactElement } from 'react';
import { message } from 'antd';
//@ts-ignore
import * as queryString from 'query-string';
import Footer from '../../components/FedFooter';
import Header from '../../components/FedHeader';
import Menu from '../../components/FedMenu';
import { getHomeBaseInfo, mockLogin } from '../../api';
import { getItem } from '../../helper/getItem';
import config from '../../config';
import { handleBaseInfo } from '../../helper/handleBaseInfo';
import { AppInfo, User } from '../../components/FedHeader/interface';

import './index.less';

type MenuMode = 'inline' | 'vertical';
const { DEV } = config;
interface Props {
    readonly changeShowContent: () => void;
    readonly history?: any;
    children: ReactElement;
}
interface State {
    menuMode: MenuMode;
    appList: AppInfo[];
    user: User;
    personalCenterUrl: string;
    logoutUrl: string;
    logoIcon: string;
    workflow: object;
    appCode: string;
}
class Layout extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            menuMode: 'inline',
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
            logoIcon: '',
            workflow: {},
            appCode: '',
        };
    }

    componentDidMount() {
        this.getBaseInfo()
    }

    public render() {
        const { children } = this.props;
        const {
            menuMode = 'inline',
            logoIcon,
            appList = [],
            workflow,
            user,
            personalCenterUrl,
            logoutUrl,
            appCode,
        } = this.state;
        const nav = getItem(appList, appCode, 'key');
        return (
            <div className="viewport-container">
                <div className={menuMode === 'inline' ? 'viewport-menu-inline-space' : 'viewport-menu-vertical-space'}>
                    <Menu
                        logoUrl={logoIcon}
                        menuList={(nav && nav.children) || []}
                        workflow={workflow}
                        menuMode={menuMode}
                        onMenuModeChange={this.setMenuMode}
                    />
                </div>
                <div className="viewport-right-space">
                    <Header appList={appList} user={user} logoutUrl={logoutUrl} personalCenterUrl={personalCenterUrl} />
                    <div className="content-space">{children}</div>
                    <Footer />
                </div>
            </div>
        );
    }

    getBaseInfo = async () => {
        if (DEV && (localStorage as any).getItem('is_login') == 0) {
            const query = queryString.parse((location as any).search);
            await mockLogin(query, 'GET');
            localStorage.setItem('is_login', '1');
            (location as any).href = query.returnUrl || '/static/billing/list?_smp=Rental.Bill';
            return;
        }
        const res = await getHomeBaseInfo({}, 'GET');
        if (res.result) {
            const props: any = handleBaseInfo(res.data);
            this.setState({ ...props })
        } else {
            message.error(res.msg);
        }
    };

    setMenuMode = (val: MenuMode) => {
        this.setState({ menuMode: val })
    };
}
export default Layout;
