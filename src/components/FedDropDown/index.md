## 下拉

Primary DropDwon 跟 其他的 Ghost DropDown 本质上是 Button 的样式，只需要修改配置 Button 就好

```js
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import FedButton from '../FedButton';
const menu = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                1st menu item
            </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                2nd menu item
            </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                3rd menu item
            </a>
        </Menu.Item>
    </Menu>
);
<>
    <Dropdown overlay={menu} key="1">
        <FedButton type="primary">
            Primary Dropdwon
            <DownOutlined />
        </FedButton>
    </Dropdown>
    <Dropdown overlay={menu} key="2">
        <FedButton>
            Default Dropdown <DownOutlined />
        </FedButton>
    </Dropdown>
    <Dropdown overlay={menu} key="2">
        <FedButton ghost>
            Ghost Down <DownOutlined />
        </FedButton>
    </Dropdown>
</>;
```
