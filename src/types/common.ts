export interface fileType {
    auth_file_path: string;
    done: boolean;
    file_name: string;
    file_path: string;
    id: string;
    image_path: string;
    process: number;
    status: string;
    type: string;
    edit?: string | boolean;
}

export enum ENABLE {
    NOTENABLED = '0',
    ENABLED = '1',
}
