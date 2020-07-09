import React, { useState, useEffect } from 'react';
import { Form, Input, Radio, Select, DatePicker, Modal, message, Table, Button } from 'antd';
import './addBaseForm.less';
import { getIdCardList, postAddAssetHolder } from '@/services/assetHolder';
import { IAddAssetHolder } from '@t/assetHolder';

interface IProps {
    onFinishUpdate?: () => void; // 数据更新完回调
}
const BankTable = (props: IProps) => {
    useEffect(() => {}, []);

    return (
        <>
            <div className="add-base-form-wrap">表格信息</div>
        </>
    );
};

export default BankTable;
