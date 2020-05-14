---
title: Header 顶部导航栏
---

-   将包括管理中心和运营中心在内的模块列表传入组件，组件内进行左右分离处理
-   模块列表通过 current 字段标识当前所在的模块
-   退出登录逻辑需要聚合，将所有退出逻辑整合在一起，通过 logoutFunction 传入组件，在点击退出时调用

## 代码演示

## API

### Header 输入

|            参数名 |        作用         | 必传 |      类型 | 默认值 |
| ----------------: | :-----------------: | ---: | --------: | :----: |
|           appList |      应用列表       |   是 |     App[] |   --   |
|              user |      用户信息       |   是 |    object |   --   |
|    logoutFunction |  登出后的回调函数   |   是 |  function |   --   |
| personalCenterUrl |    个人中心地址     |   是 | urlString |   --   |
|             width |        宽度         |   否 |    string |   --   |
|              slot |  头部组件左侧插槽   |   否 |       jsx |   --   |
|         className | 头部自定义 class 名 |   否 |    string |   --   |

** appList 数据结构 **

| 参数名  |     作用     | 必传 |  类型   | 默认值 |
| :------ | :----------: | :--: | :-----: | :----- |
| key     |   应用编号   |  是  | string  | --     |
| url     |   应用地址   |  是  | string  | --     |
| name    |   应用名称   |  是  | string  | --     |
| current | 当前所在模块 |  否  | boolean | --     |
