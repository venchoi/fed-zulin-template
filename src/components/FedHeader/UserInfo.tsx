/**
 * Created by cuss on 2016/12/19.
 */

import React from 'react';
import './UserInfo.less';
import { Dropdown, Menu } from 'antd';
import Icon from '@ant-design/icons';
import FedIcon from '../FedIcon';
import { Props, AppInfo } from './interface';
import { loginOut } from '../../services/app';
import Cookie from 'js-cookie';
import removeCache from '../../helper/removeCache';

export default class UserInfo extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const { user, personalCenterUrl, appList } = this.props;
        const renderNavs: AppInfo[] = (appList || []).filter(item =>
            ['ManagementCenter', 'OperationCenter'].includes(item.key)
        );
        const iconStyle = { fontSize: '20px', marginRight: '18px' };
        const overlayClassName = 'header-right-dropdown';
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <div className="user-info">
                        <FedIcon type="icon-icn_avatar" className="icon-avatar" />
                        <div className="info">
                            <div>
                                <a href={personalCenterUrl}>{user && user.display_name}</a>
                            </div>
                            <span>{user.tenant_name || user.organ_name}</span>
                        </div>
                    </div>
                </Menu.Item>
                <Menu.Divider />
                {renderNavs.length
                    ? renderNavs.map((item: AppInfo) => (
                          <Menu.Item key="1">
                              <a className="item" href={item.url} rel="noopener noreferrer" key={item.key}>
                                  <Icon type={item.key === 'ManagementCenter' ? 'tool' : 'team'} style={iconStyle} />
                                  {item.name}
                              </a>
                          </Menu.Item>
                      ))
                    : null}
                <Menu.Divider />
                <Menu.Item key="2">
                    <div className="item logout" onClick={this.loginOut}>
                        <Icon type="logout" style={iconStyle} />
                        退出登录
                    </div>
                </Menu.Item>
            </Menu>
        );

        return (
            <Dropdown
                className="user-role"
                overlay={menu}
                trigger={['click']}
                placement="bottomLeft"
                overlayClassName={overlayClassName}
            >
                <div>
                    <FedIcon type="icon-icn_avatar" className="icon-avatar" />
                    <Icon type="caret-down" style={{ fontSize: '12px', marginLeft: '4px' }} />
                </div>
            </Dropdown>
        );
    }

    loginOut = () => {
        const { logoutUrl } = this.props;
        loginOut();
        Cookie.remove('gr_user_id');
        Cookie.remove('RENTALCENTER');
        removeCache();
        window.location.href = logoutUrl;
    };
}
