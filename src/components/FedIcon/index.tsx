import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';

import config from '../../config';

const IconFont = createFromIconfontCN({
    scriptUrl: config.iconSymbolUrl,
});

export default function FedIcon(props: any) {
    return <IconFont {...props} />;
}
