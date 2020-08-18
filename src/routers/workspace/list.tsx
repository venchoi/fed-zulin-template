import React, { useState } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { WorkspaceIndexPageProps } from './list.d';
import moment from 'moment';

export const WorkspaceIndexPage = (props: WorkspaceIndexPageProps) => {
    const {
        user
    } = props;
    const [isLoading, setIsloading] = useState(false);

    const timeStr = moment().format('YYYY年MM月DD日 星期')
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
                                <p className="second-line time">{}</p>
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