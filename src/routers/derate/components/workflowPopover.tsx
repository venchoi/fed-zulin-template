import React, { Component } from 'react';
import { Button, message, Spin } from 'antd';
import { fetchWorkflowTempIsEnabled, createInstanceForWH, getCommitInfoStatusForWH } from '@s/derate';
import './workflowPopover.less';

interface cbDataType {
    result?: boolean;
    data?: string;
}
interface paramsType {
    scenario_code: string;
    project_id: string;
    business_id: string;
}

interface propsType {
    callBack?(data: cbDataType): void;
    params: paramsType | null;
}
interface stateType {
    text: string;
    fail: boolean;
    success: boolean;
    recordId: string;
    isFetchIsEnabledStatus?: boolean;
}
class WorkflowApprovalPopover extends Component<propsType, stateType> {
    constructor(props: propsType) {
        super(props);
        this.state = {
            text: '',
            fail: true,
            success: false,
            recordId: '',
        };
        this.handleClose = this.handleClose.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
    }

    componentDidMount() {
        this.createApprovalInstance();
    }

    render() {
        const { text, fail, success } = this.state;
        return (
            <div className="workflow-approval-popover-components-for-wrap">
                <div className="mask" />
                <div className={fail ? 'content content-error' : 'content'}>
                    {/*<div className={(fail || success) ? "loading-area" : "loading-area"} id="workflow-approval-popover-components-for-wrap-id" />*/}
                    <Spin>
                        <div
                            className={fail ? 'f-hidden' : 'loading-area'}
                            id="workflow-approval-popover-components-for-wrap-id"
                        />
                    </Spin>
                    {/*<div className={fail ? "info error": (success ? "info" : "info info-process")}>{text}</div>*/}
                    <div className={fail ? 'info error' : ' f-hidden info info-process'}>{text}</div>
                    {fail ? (
                        <Button className="btn btn-default" onClick={this.handleClose}>
                            关闭
                        </Button>
                    ) : null}
                    {
                        // success ? <Button className="btn btn-primary" onClick={this.handleSuccess}>操作已完成</Button> : null
                    }
                </div>
            </div>
        );
    }

    handleClose() {
        const { callBack } = this.props;
        callBack && callBack({ result: false });
    }

    handleSuccess() {
        const { callBack } = this.props;
        callBack && callBack({ result: true, data: 'wh_approval' });
    }

    async createApprovalInstance() {
        const { params, callBack } = this.props;
        if (!params) {
            message.error('params参数获取失败');
            this.setState({ fail: true });
            return;
        }

        if (!params.scenario_code) {
            message.error('场景code不能为空');
            this.setState({ fail: true });
            return;
        }
        if (!params.project_id) {
            message.error('项目Id不能为空');
            this.setState({ fail: true });
            return;
        }

        this.setState({ text: '获取中...', fail: false });
        const json = await fetchWorkflowTempIsEnabled({
            scenario_code: params.scenario_code,
            project_id: params.project_id,
        });
        if (!json.result) {
            const msg = json.msg || json.message || '检测获取是否开启工作流信息失败!';
            this.setState({ text: msg, fail: true });
            return;
        }
        const isEnabledForWH = json.data.is_enabled_wh === '1';
        const sceneNameForWH = json.data.wh_scene_name || '';
        const businessId = params.business_id;
        if (isEnabledForWH) {
            if (!sceneNameForWH) {
                message.error('创建武汉工作流场景名称不能为空');
                this.setState({ fail: true });
                return;
            }
            if (!businessId) {
                message.error('创建武汉工作流业务Id不能为空');
                this.setState({ fail: true });
                return;
            }
            this.setState({ text: '创建中...', fail: false });
            const instanceData = await createInstanceForWH({ scene: sceneNameForWH, business_id: businessId });
            this.setState({ isFetchIsEnabledStatus: false });
            if (!instanceData.result) {
                const msg = instanceData.msg || instanceData.message || '提交审批操作失败!';
                this.setState({ text: msg, fail: true });
                return;
            }

            const { record_id } = instanceData.data;
            if (record_id) {
                this.setState({ recordId: record_id }, () => {
                    this.getCommitInfoStatus();
                });
            }
        } else {
            callBack && callBack({ result: true, data: 'original_approval' });
        }
    }

    async getCommitInfoStatus() {
        const { recordId } = this.state;
        if (!recordId) {
            message.error('recordId参数获取失败');
            this.setState({ fail: true });
            return;
        }
        const json = await getCommitInfoStatusForWH({ record_id: recordId });
        if (json.result) {
            const { status, url, business_id, msg } = json.data;
            if (status === '未发起') {
                setTimeout(() => {
                    this.getCommitInfoStatus();
                }, 1000);
            } else if (status === '发起中') {
                setTimeout(() => {
                    this.getCommitInfoStatus();
                }, 1000);
            } else if (status === '发起成功') {
                //调用了这个方法则发起页遮罩层会消失
                this.handleSuccess();
                if (url) {
                    if (
                        json.data.open_ie &&
                        +json.data.open_ie === 1 &&
                        window.navigator.userAgent.indexOf('Chrome') !== -1
                    ) {
                        window.open(`openIE:${url}`, '_self');
                    } else {
                        window.open(json.data.url, '_blank');
                    }
                }
                this.setState({ text: status, fail: false, success: true });
            } else if (status === '发起失败') {
                message.error(msg);
                this.setState({ text: msg, fail: true, success: false });
            }
        } else {
            const msg = json.msg || '获取发起审批流状态失败';
            this.setState({ text: msg, fail: true, success: false });
        }
    }
}

export default WorkflowApprovalPopover;
