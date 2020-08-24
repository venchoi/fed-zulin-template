import React, { useState } from 'react';
import { Spin, Tabs } from 'antd';
import { connect } from 'dva';
import TreeProjectSelect from '@c/TreeProjectSelect';
import { WorkspaceIndexPageProps } from './list.d';
import FedIcon from '@c/FedIcon';
import moment from 'moment';
import './index.less';

const weekDayMap = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
export const WorkspaceIndexPage = (props: WorkspaceIndexPageProps) => {
    const { user } = props;
    const [isLoading, setIsloading] = useState(false);
    const handleTreeSelected = () => {};
    const timeStr = moment().format('YYYY年MM月DD日') + ' ' + weekDayMap[moment().isoWeekday() - 1];
    return (
        <Spin spinning={isLoading} wrapperClassName="content-container-spin">
            <div className="content-container workspace">
                <div className="content page-container">
                    <div className="top-area">
                        <h1>工作台</h1>
                        <div className="user-info">
                            <div className="avatar">
                                <FedIcon type="icon-icn_avatar" className="default-avatar" />
                            </div>
                            <div className="des">
                                <p className="first-line">你好，{user.display_name}，祝开心每一天！</p>
                                <p className="second-line time">{timeStr}</p>
                            </div>
                        </div>
                    </div>
                    <div className="workspace-content">
                        <div className="title-area">
                            <h2>待办事项</h2>
                            <TreeProjectSelect onTreeSelected={handleTreeSelected} width={312} />
                        </div>
                        <Tabs defaultActiveKey="1">
                            <Tabs.TabPane tab="财务待办" key="财务待办"></Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        </Spin>
    );
};

function mapStateToProps(state: any) {
    return {
        user: state.main.user,
    };
}
export default connect(mapStateToProps)(WorkspaceIndexPage);
