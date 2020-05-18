import React from 'react';
import { Card, Button, Table } from 'antd';
import { History } from 'history';
import ContentLayout from './components/contentLayout';
import TreeProjectSelect from '@c/TreeProjectSelect';
import './list.less';

interface Props {
    history: History;
}
export const DerateList = (props: Props) => {
    return (
        <ContentLayout
            className="derate-list-page"
            title="减免管理"
            topRightSlot={
                <div className="project-select-area">
                    <TreeProjectSelect />
                </div>
            }
        >
            <Table />
        </ContentLayout>
    );
};

export default DerateList;
