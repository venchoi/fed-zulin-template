import React, { useState } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { SectionProps } from './FedSection.d';
import './index.less';

const FedSection = (props: SectionProps) => {
    const { title, children } = props;
    const [isExpanded, setIsExpanded] = useState(true);

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="fed-section">
            <div className="title-container" onClick={handleToggleExpand}>
                {isExpanded ? (
                    <DownOutlined className="expandable-icon down" />
                ) : (
                    <RightOutlined className="expandable-icon right" />
                )}
                <span className="title">{title}</span>
            </div>
            <div className="content-container">{isExpanded ? children : null}</div>
        </div>
    );
};
export default FedSection;
