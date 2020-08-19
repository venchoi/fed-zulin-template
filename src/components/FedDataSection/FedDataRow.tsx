import React, { ReactNode } from 'react';
import './FedDataRow.less';

/**
 * 数据行, 常用于详情页
 * @author venchoi
 * @param { rowData } 数据行 eg: { label: '标签一', value: '标签一的值' }
 * @param { layout } 布局  horizontal(default) | vertical
 */
interface IProps {
    rowData: {
        label: string;
        value: any; // TODO T
        labelAlign?: boolean;
        render?: () => ReactNode;
    };
    layout?: string;
    labelWidth?: string;
    valueWidth?: string;
}
function FedDataRow(props: IProps) {
    const { rowData, layout = 'horizontal', labelWidth, valueWidth } = props;
    return (
        <div className={`fed-data-row ${layout}`}>
            <div
                className={`fed-data-row-label  ${
                    rowData.labelAlign ? `fed-data-row-label-align-${rowData.labelAlign}` : ''
                }`}
                style={{ width: labelWidth }}
            >
                {rowData.label}:
            </div>
            <div className="fed-data-row-value" style={{ width: valueWidth || '264px' }}>
                {rowData.render ? rowData.render() : rowData.value || '--'}
            </div>
        </div>
    );
}

export default React.memo(FedDataRow);
