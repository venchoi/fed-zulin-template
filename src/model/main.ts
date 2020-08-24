interface state {
    list: string[];
}

interface user {
    account: string;
    displayName: string;
    display_name: string;
    key: string;
    org_id: string;
    organ_name: string;
    tenantCode: string;
    tenant_code: string;
    tenant_name: string;
    user_id: string;
}

interface app {
    app_code: string;
    app_name: string;
    className: string;
    site_url: string;
    url: string;
}

interface logoInfoType {
    icon: string;
    logo: string;
    title: string;
}

interface initState {
    user: user;
    appCode: string;
    appList: app[];
    logoInfo: logoInfoType;
    logoutUrl: string;
    passwordUrl: string;
    is_enabled_wh_workflow: boolean;
}

interface initDataPayloadType {
    type: string;
    data?: initState; // 在dva中，这不是必要参数
}
// 这是一个list示例模块，仅作为参考
export default {
    namespace: 'main',
    state: {
        user: {},
        appCode: '',
        appList: [],
        logoInfo: {},
        logoutUrl: '',
        passwordUrl: '',
        is_enabled_wh_workflow: false,
    },
    reducers: {
        initBaseInfo(state: initState, payload: initDataPayloadType) {
            console.log(payload);
            return {
                ...state,
                ...payload.data,
            };
        },
    },
};
