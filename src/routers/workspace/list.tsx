import React, { useState } from 'react';
import { Spin, Tabs } from 'antd';
import { connect } from 'dva';
import TreeProjectSelect from '@c/TreeProjectSelect';
import { WorkspaceIndexPageProps, category } from './list.d';
import FedIcon from '@c/FedIcon';
import moment from 'moment';
import TodoPane from './components/todoPane';
import { projsValue } from '@t/project';
import { categoryMap } from './todoCategoryMaps';
import './index.less';

const weekDayMap = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
const todoTypes = Object.keys(categoryMap);
export const WorkspaceIndexPage = (props: WorkspaceIndexPageProps) => {
    const { user } = props;
    const [selectedProjectIds, setselectedProjectIds] = useState<string[]>([]); // 当前选中的项目
    const [selectedProjectNames, setselectedProjectNames] = useState<string[]>([]); // 当前选中的项目
    const [hasData, setHasData] = useState(true); // 是否有数据

    // 项目更新
    const handleTreeSelected = (selecctedProject: projsValue) => {
        setselectedProjectIds(selecctedProject.projIds);
        setselectedProjectNames(selecctedProject.projNames);
    };

    const handleHasData = (hasData: boolean) => {
        setHasData(hasData);
    };
    const timeStr = moment().format('YYYY年MM月DD日') + ' ' + weekDayMap[moment().isoWeekday() - 1];
    return (
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
                    {hasData ? (
                        <>
                            <div className="title-area">
                                <h2 className="title">待办事项</h2>
                                <TreeProjectSelect onTreeSelected={handleTreeSelected} width={312} />
                            </div>
                            <Tabs defaultActiveKey="1" size="small" className="workspace-tabs">
                                {todoTypes.map(typeItem => {
                                    return (
                                        <Tabs.TabPane tab={categoryMap[typeItem].name} key={categoryMap[typeItem].type}>
                                            <TodoPane
                                                type={categoryMap[typeItem].type}
                                                projs={selectedProjectIds}
                                                onChange={handleHasData}
                                            />
                                        </Tabs.TabPane>
                                    );
                                })}
                            </Tabs>
                        </>
                    ) : (
                        <div className="no-data-default">
                            <img
                                className="top"
                                src={require('../../assets/img/workspace/default.png')}
                                alt="默认图片"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

function mapStateToProps(state: any) {
    return {
        user: state.main.user,
    };
}
export default connect(mapStateToProps)(WorkspaceIndexPage);
