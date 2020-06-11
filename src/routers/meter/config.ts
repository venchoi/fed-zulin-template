import { Status } from '@t/meter';
export const enum Statistics {
    ALL = 'total',
    PENDING = 'pending_num',
    AUDITED = 'audited_num',
    EFFECTED = 'effect_num',
    VOID = 'void_num',
}
export const statusItem = [
    {
        title: Status.ALL,
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
