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

export interface responseType {
    status?: boolean;
    msg?: string;
    data?: any[];
}
