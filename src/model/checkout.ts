interface state {
    list: string[];
}

interface id {
    type: string;
}

export default {
    namespace: 'checkout',
    state: {
        // 退租第一步
        step1: {
            contract: {}, // 合同信息
            rooms: [], // 退租资源
            renters: [], // 租客信息
            forms: {
                type: '', // 退租类型
                deadline_date: '', // 计租截止日期
                checkout_date: '', // 退租日期
                print_model_id: '', // 打印模板
                reason_id: '', // 退租原因
                remark: '', // 原因描述
                attachments: [], // 退租附件
                operate_time: '', // 办理日期
            },
        },
        // 退租第二步
        step2: {
            meters: [], // 退租抄表记录
            rooms: [], // 退租资源
        },
        step3: {},
        step4: {},
        step5: {},
        step6: {},
    },
    reducers: {
        updateContract(state: state) {
            return state;
        },
    },
    effects: {},
};
