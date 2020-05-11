## 按钮

### Primary Button

```js
<FedButton type="primary">Primary Button</FedButton>
<FedButton type="primary" disabled>Primary Button Disabled</FedButton>
```

---

### Secondary Button

```js
<FedButton type="primary" ghost>Secondary Button</FedButton>
<FedButton type="primary" ghost disabled>Secondary Button Disabled</FedButton>
```

---

### Dashed Button

```js
<FedButton type="dashed">Dashed Button</FedButton>
<FedButton type="dashed" disabled>Dashed Button Disabled</FedButton>
```

---

### Icon Button

```js
import { SearchOutlined } from '@ant-design/icons';
<FedButton type="link" icon={<SearchOutlined />}></FedButton>;
```

放在上面报错了。单独写一个

```js
import { SearchOutlined } from '@ant-design/icons';
<FedButton type="link" icon={<SearchOutlined />} disabled></FedButton>;
```

---

### Danger Button

```js
<FedButton type="primary" danger>Danger Button</FedButton>
<FedButton type="primary" danger disabled>Danger Button Disabled</FedButton>
```
