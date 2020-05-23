import { derateType } from '../list.d';

const baseAlias = 'static';
export const handleOaAudit = (record: derateType, e: React.MouseEvent) => {
    e && e.stopPropagation();
    setTimeout(() => {
        location.href = `${baseAlias}/workflowApproval/add/${record.proj_id}/${record.id}/derated_apply`;
    }, 20);
};
