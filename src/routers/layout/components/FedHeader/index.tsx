import React, { ReactElement } from 'react';
import qs from 'querystring';
import './index.less';
import UserInfo from './UserInfo';
import FedIcon from '@c/FedIcon';
import RedirectPanel from './RedirectPanel';
import { Props } from './interface';
import procedureImg from './images/icon_procedure.svg';
import { Badge } from 'antd';

interface State {
    showModule: boolean;
}

export default class FedHeader extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showModule: false,
        };
    }

    onOpenPage = () => {
        window.open('/static/processCenter/manage/list');
    };

    onOpenModal = (appLength: number) => {
        if (appLength === 1) {
            return false;
        }
        this.setState({ showModule: true });
    };

    onCloseModal = () => {
        this.setState({ showModule: false });
    };

    // 流程中心跳转
    onOpenApprovalManage = () => {
        const {
            user: { tenant_code, user_id, account: user_name },
            appCode,
        } = this.props;
        const params = {
            tenant_code,
            app_code: appCode,
            user_id,
            user_name,
            client_type: 'pc',
        };
        let apiHostName = '';
        const hostNameArr = window.location.hostname.split('.'); // 获取域名数组
        if (hostNameArr && hostNameArr.length > 0) {
            apiHostName =
                hostNameArr[0].search(/test/) !== -1 ? 'http://flow-test.myfuwu.com.cn' : 'https://flow.myfuwu.com.cn';
        }
        const apiPath = `${apiHostName}/workflow/handle-list?${qs.stringify(params)}`;
        window.open(apiPath);
    };

    render() {
        const { showModule } = this.state;
        const { appList, appCode, user, personalCenterUrl, className, logoutUrl, is_enabled_wh_workflow } = this.props;

        const outAppList = (appList || []).filter(
            item => item.key !== 'ManagementCenter' && item.key !== 'OperationCenter'
        );
        const panelList = (appList || []).filter(
            item => item.key === 'ManagementCenter' || item.key === 'OperationCenter'
        );
        const title = (appList.filter(item => item.key === appCode)[0] || {}).name;

        return (
            <>
                <div className="fed-header-content">
                    <div className="fed-header-content-left" onClick={() => this.onOpenModal(outAppList.length)}>
                        <span className="title">{title}</span>
                        {outAppList.length > 1 ? <FedIcon type="icon-icn_switch" className="icon-switch" /> : null}
                    </div>
                    <div className="fed-header-content-right">
                        {is_enabled_wh_workflow ? (
                            <Badge dot={true}>
                                <img
                                    src={procedureImg}
                                    alt="进入流程中心"
                                    title="进入流程中心"
                                    style={{ width: '24px' }}
                                    onClick={() => this.onOpenApprovalManage()}
                                />
                            </Badge>
                        ) : null}
                        {user ? (
                            <UserInfo
                                user={user}
                                personalCenterUrl={personalCenterUrl}
                                appList={panelList}
                                logoutUrl={logoutUrl}
                            />
                        ) : null}
                    </div>
                </div>
                {showModule ? (
                    <RedirectPanel onCancel={() => this.onCloseModal()} appList={outAppList} title={title} />
                ) : null}
            </>
        );
    }
}
