import React, { PureComponent } from 'react';
import { FedButton } from '@c/index';
import img from './img_404@2x.png';
import './index.less';

class NotFoundPage extends PureComponent {
    render() {
        return (
            <div className="interceptor-page not-found-page">
                <div className="interceptor-content">
                    <img src={img} alt="访问的资源不存在" className="interceptor-img" />
                    <div className="interceptor-text">
                        <div className="interceptor-text-header">404</div>
                        <span className="interceptor-text-tip">抱歉，您访问的页面不存在</span>
                        {/* <div className="interceptor-text-btn">
                            <FedButton type="primary" onClick={() => history.goBack()}>返回</FedButton>
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }
}

export default NotFoundPage;
