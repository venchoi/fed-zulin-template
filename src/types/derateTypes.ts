export interface getTreeDataParams {}

export interface getTemplateIsEnabled {
    proj_id: string;
    scenario_code: string;
}

export interface getDerateListParams {
    proj_id?: string;
    page: number;
    page_size: number;
    keyword?: string;
}

export interface getDerateDetailParams {
    id: string;
}
