import React from 'react';
import { derateType } from '../list.d';
import { Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

export const rsRender = (text: string, record: derateType, index: number) => {
    const items = record.items;
    const roomNames = [...new Set(items.map(item => item.full_room_name))];
    const pacakgeNames = record.package_rooms && record.package_rooms.length > 0 ? record.package_rooms : false;
    if (pacakgeNames) {
        return pacakgeNames.map(packageRoom => {
            const rooms = packageRoom.room_names ? packageRoom.room_names.split(',') : [];
            const popoverContent = (
                <div>
                    {rooms.map(room => {
                        return <p>{room}</p>;
                    })}
                </div>
            );
            return (
                <div className="rs-td-container">
                    <span className="derate-table-td-rs" title={packageRoom.package_name || '-'}>
                        {packageRoom.package_name}
                    </span>
                    <Popover title="打包资源列表" placement="bottom" content={popoverContent}>
                        <InfoCircleOutlined
                            style={{
                                color: '#BEC3C7',
                                marginLeft: '5px',
                                marginTop: '4px',
                            }}
                        />
                    </Popover>
                </div>
            );
        });
    }
    return roomNames.map(room => {
        return (
            <span className="derate-table-td" title={room || '-'}>
                {room || '-'}
            </span>
        );
    });
};

export const baseColumns = [
    {
        dataIndex: 'code',
        title: '减免流水号',
        width: 200,
        render: (text: string, record: derateType, index: number) => {
            return (
                <span className="derate-table-td" title={text || '-'}>
                    {text}
                </span>
            );
        },
    },
    {
        dataIndex: 'gap',
        title: '',
        render: (text: string, record: derateType, index: number) => {
            return '';
        },
    },
    {
        dataIndex: 'proj_name',
        title: '项目名称',
        width: 120,
        render: (text: string, record: derateType, index: number) => {
            return (
                <span className="derate-table-td" title={text || '-'}>
                    {text || '-'}
                </span>
            );
        },
    },
    {
        dataIndex: 'renter_organization_names',
        title: '租客',
        width: 136,
        render: (text: string, record: derateType, index: number) => {
            let renterOrganizationNames = record.items.map(bill => bill.renter_organization_name);
            renterOrganizationNames = [...new Set(renterOrganizationNames)];
            const names = renterOrganizationNames.join(',');
            return (
                <span className="derate-table-td" title={names || '-'}>
                    {names}
                </span>
            );
        },
    },
];

export default rsRender;
