import React from 'react';
import { derateType } from '../list.d';
const baseAlias = 'static';
export const handleOaAudit = (record: derateType, e: React.MouseEvent) => {
    e && e.stopPropagation();
    setTimeout(() => {
        location.href = `${baseAlias}/workflowApproval/add/${record.proj_id}/${record.id}/derated_apply`;
    }, 20);
};

export const excute = (type: string, rowData: derateType, e?: React.MouseEvent, props?: any) => {
    e && e.stopPropagation();
    switch (type) {
        case 'workflow': {
            let wx_url =
                (rowData.wh_new_approval_info && rowData.wh_new_approval_info.detail_url) ||
                (rowData.wh_renew_approval_info && rowData.wh_renew_approval_info.detail_url);
            if (wx_url) {
                window.open(wx_url);
            } else {
                setTimeout(
                    () =>
                        props &&
                        props.history.push(`${baseAlias}/workflowApproval/detail/${rowData.workflow_instance_id}`),
                    20
                );
            }
            break;
        }
        case 'approval': {
            let scenarioCode = 'derated_apply';
            const params = {
                scenario_code: scenarioCode,
                project_id: rowData.proj_id,
                business_id: rowData.id,
            };
            props.configWorkflow({
                showModal: true,
                params,
                callBack: (json: { result: boolean; data: string }) => {
                    props.configWorkflow({
                        showModal: false,
                        params: null,
                        callBack: null,
                    });
                    if (json && json.data === 'original_approval') {
                        setTimeout(
                            () =>
                                props.history.push(
                                    `${baseAlias}/workflowApproval/add/${rowData.proj_id}/${rowData.id}/${scenarioCode}`
                                ),
                            20
                        );
                    }
                },
            });
            break;
        }
    }
};
