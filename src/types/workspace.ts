import { TodoType } from '../routers/workspace/list.d';

export interface getCategoryParamsType {
    proj_id?: string;
    type: TodoType;
}
