import React from 'react';
import { Steps } from 'antd';

const CheckoutStepBar = () => {
    const { Step } = Steps;
    const obj = {
        paddingLeft: '10%',
        paddingRight: '10%',
    };
    return (
        <>
            <Steps size="small" current={0} style={obj}>
                <Step title="基本信息" />
                <Step title="退租验收" />
                <Step title="账单确认" />
                <Step title="汇总结算" />
                <Step title="退租协议文本" />
                <Step title="信息填写完成" />
            </Steps>
        </>
    );
};

export default CheckoutStepBar;
