import React, { Component, MouseEventHandler } from 'react';
import { Modal, Divider } from 'antd';
import FedIcon from '../FedIcon';
import './RedirectPanel.less';
import { AppInfo, MapOptions } from './interface';

interface Props {
    title: string;
    appList: AppInfo[];
    onCancel: MouseEventHandler;
}

export default class RedirectPanel extends Component<Props> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    getIconType = (appName: keyof MapOptions) => {
        const mapObj: MapOptions = {
            Apartment: 'icn_apartment',
            AssetCenter: 'icn_asset',
            ManagementCenter: 'icn_manage',
            ManagementCenterDisabled: 'icn_manage_disabled',
            MemberCenter: 'icn_member',
            OperationCenter: 'icn_operate',
            OperationCenterDisabled: 'icn_operate_disabled',
            PropertyBase: 'icn_property',
            Rental: 'icn_rent',
            FangYi: 'icn_FangYi',
        };
        return mapObj[appName];
    };

    render() {
        const { onCancel, appList = [], title } = this.props;
        const qualifiedAppNames = ['Rental', 'AssetCenter', 'Apartment', 'PropertyBase', 'MemberCenter', 'FangYi'];
        const allDisabled = appList.length === 0;
        return (
            <Modal
                className="module-modal"
                footer={null}
                centered
                bodyStyle={{ height: 330 }}
                width="auto"
                visible
                onCancel={onCancel}
            >
                <div className="module-content">
                    <p className="text">
                        {allDisabled ? '暂无权限，如需使用请联系管理员' : `即将离开${title}，请选择跳转模块`}
                    </p>
                    <div className="wrap">
                        {appList.map(item => {
                            // 校验传入的模块名称是否合法
                            if (!qualifiedAppNames.includes(item.key)) {
                                return null;
                            }
                            if (!item.current) {
                                return (
                                    <a className="item hvr-float" href={item.url}>
                                        <FedIcon className="icon-app" type={this.getIconType(item.key)} />
                                        <span className="text">{item.name}</span>
                                    </a>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </Modal>
        );
    }
}
