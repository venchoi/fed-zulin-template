import React from 'react';
import { OutLayListItem } from '../type';

interface IProps {
    record: OutLayListItem;
}

const RenderRentalResourcePopover = (props: IProps) => {
    const { record } = props;
    const roomNames = record.fee_items[0]?.full_room_name?.split(',') || [];
    return (
        <div className="content">
            {roomNames.map((roomName, index) => (
                <p title={roomName} key={`${index}`}>
                    {roomName}
                </p>
            ))}
        </div>
    );
};

export default RenderRentalResourcePopover;
