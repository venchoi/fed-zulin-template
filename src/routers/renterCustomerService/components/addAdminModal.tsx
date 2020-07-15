import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Modal } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

export const renterListSearchArea = function(props) {
    const { isEdit, isShowModal } = props;
    const title = isEdit ? '新增管理员' : '更改管理员';

    const handleOk = () => {

    };
    
    const handleCancel = () => {
        
    };

    return (
        <Modal
            title={title}
            visible={isShowModal}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Modal>  
    );
};

export default renterListSearchArea;
