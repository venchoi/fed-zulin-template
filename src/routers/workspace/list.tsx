import React, { useState } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { WorkspaceIndexPageProps } from './list.d';
import moment from 'moment';


const weekDayMap = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
export const WorkspaceIndexPage = (props: WorkspaceIndexPageProps) => {
    const {
        user
    } = props;
    const [isLoading, setIsloading] = useState(false);

    const timeStr = moment().format('YYYY年MM月DD日') + ' ' + weekDayMap[moment().isoWeekday()-1];
    return (
        <Spin spinning={isLoading} wrapperClassName="content-container-spin">
            <div className="content-container workspace">
                <div className="content page-container">
                    <div className="top-area">
                        <h1>工作台</h1>
                        <div className="user-info">
                            <div className="avatar">
                                <img src="" alt=""/>
                            </div>
                            <div className="des">
                                <p className="first-line">你好，{user.displayName}，祝开心每一天！</p>
                                <p className="second-line time">{timeStr}</p>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
        </Spin>
    )
}

function mapStateToProps(state: any) {
    return {
        user: state.main.user,
    };
}
export default connect(mapStateToProps)(WorkspaceIndexPage);