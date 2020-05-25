import React, { useState } from 'react';
import { History } from 'history';
import { Card, Button, Tabs, Col, Row } from 'antd';
import FieldPorts from './components/FieldPorts'
import PageSetting from './components/pageSetting'
import FieldSetting from './components/FieldProperty'
import './index.less'
import '../index.less'

const { TabPane } = Tabs;
interface IProps {
    history: History;
}
const customerManagement = (props: IProps) => {

    const callback = () => {
        console.log();
    }

    return (
        <div className="basicdata-componnet customer-setting">
            <Tabs defaultActiveKey="1" onChange={callback} className="tabs-wrap">
                <TabPane tab="字段管理" key="1">
                    字段管理列表Table
                </TabPane>
                <TabPane tab="页面配置" key="2">
                    <Row gutter={16}>
                        <Col span={5}>
                            <Card title="可选字段" extra={<span className="sub-color">请拖拽至右侧页面配置</span>} style={{ marginBottom: 20 }}>
                                <FieldPorts />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="页面配置" extra={<a href="#">全部收起</a>}>
                                <PageSetting />
                            </Card>
                        </Col>
                        <Col span={7} className="property-col">
                            <Card title="属性设置" className="property-card">
                                <FieldSetting />
                            </Card>
                        </Col>
                    </Row>

                </TabPane>
            </Tabs>
        </div>
    );
};

export default customerManagement
