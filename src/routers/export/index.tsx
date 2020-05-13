import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'dva/router';
import { getExportList } from '@s/export';
import { match } from 'react-router';

interface HistoryParams {
    type: string;
    stageId: string;
}
interface Match extends match {
    params: HistoryParams;
}

interface Props extends RouteComponentProps {
    match: Match;
}

const exportList = ({ match: { params } }: Props) => {
    const [pageObj, setPageObj] = useState({
        page: 1,
        page_size: 20,
    });
    const { type = '', stageId = '' } = params;

    const fetchExportList = async () => {
        const { data, result } = await getExportList({ stage_id: stageId, type: '营业额管理', ...pageObj });
        console.log(data);
    };

    useEffect(() => {
        fetchExportList();
    }, [pageObj, type, stageId]);

    return <div>234</div>;
};
export default exportList;
