import { Status } from '@t/meter';
export const enum Statistics {
    ALL = 'total_num',
    PENDING = 'pending_num',
    AUDITED = 'audited_num',
    EFFECTED = 'effect_num',
    VOID = 'void_num',
}
export const statusItem = [
    {
        title: '全部', // 只有全部是需要单独写文案，全部的参数是'' ，展示是全部
        key: Statistics.ALL,
        color: '',
    },
    {
        title: Status.PENDING,
        key: Statistics.PENDING,
        color: '#F27900',
    },
    {
        title: Status.AUDITED,
        key: Statistics.AUDITED,
        color: '#0D86FF',
    },
    {
        title: Status.EFFECTED,
        key: Statistics.EFFECTED,
        color: '#00AD74',
    },
    {
        title: Status.VOID,
        key: Statistics.VOID,
        color: '#BEC3C7',
    },
];
