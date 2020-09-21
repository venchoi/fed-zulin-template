import { FilterOptions } from './type';

interface State {
    filterOptions: FilterOptions;
}

interface FilterOptionsPayload {
    data: FilterOptions;
}

export default {
    namespace: 'outlay',
    state: {
        filterOptions: new FilterOptions(),
    },
    reducers: {
        setFilterOptions: (state: State, { data }: FilterOptionsPayload) => {
            return {
                ...state,
                filterOptions: data,
            };
        },
        reset: (state: State) => {
            return {
                ...state,
                filterOptions: new FilterOptions(),
            };
        },
    },
    effects: {},
};
