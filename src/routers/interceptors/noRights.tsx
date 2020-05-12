import React from 'react';
import { FedButton } from '@c/index';
import img from './img_403@2x.png';
import './index.less';
import { History } from 'history';
const NoRights = (props: { history: History }) => {
    const { history } = props;
    return (
        <div className="interceptor-page no-rights-page">
            <div className="interceptor-content">
                <img src={img} alt="没有权限" className="interceptor-img" />
                <div className="interceptor-text">
                    <div className="interceptor-text-header">403</div>
                    <span className="interceptor-text-tip">抱歉，您暂无该页面的访问权限</span>
                    <div className="interceptor-text-btn">
                        <FedButton type="primary" onClick={() => history.goBack()}>
                            返回
                        </FedButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoRights;
