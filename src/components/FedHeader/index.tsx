import React, { ReactElement } from 'react';
import './index.less';
import UserInfo from './UserInfo';
import FedIcon from '../FedIcon';
import RedirectPanel from './RedirectPanel';
import { Props } from './interface';

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
    render() {
        const { showModule } = this.state;
        const { appList, appCode, user, personalCenterUrl, className, logoutUrl } = this.props;

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
