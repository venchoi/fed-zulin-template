import React from 'react';
import { CheckCircleFilled, MinusCircleFilled } from '@ant-design/icons'
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import { ENABLE } from '@t/common'
const MyComponents = {
  CheckCircleFilled: function (props: Pick<AntdIconProps, 'color'>) {
    return <><CheckCircleFilled {...props}/></>;
  },
  MinusCircleFilled: function (props: Pick<AntdIconProps, 'color'>) {
    return <><MinusCircleFilled {...props}/></>;
  }
}
const enabledMap = {
  [ENABLE.ENABLED]: {
    icon: MyComponents.CheckCircleFilled,
    color: '#00AD74',
    text: '启用中'
  },
  [ENABLE.NOTENABLED]: {
    icon: MyComponents.MinusCircleFilled,
    color: '#868B8F',
    text: '未启用'
  },
}
export default ({is_enabled}: {is_enabled: ENABLE}) => {
  const enabledItem = enabledMap[is_enabled];
  const StatusComponent = enabledItem.icon
  return <><StatusComponent color={enabledItem.color} /><span style={{ color: enabledItem.color }}>{enabledItem.text}</span></>
} 