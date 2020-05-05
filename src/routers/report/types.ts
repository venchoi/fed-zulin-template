export default interface IRecordType {
    id: string;
    name: string;
    desc: string;
    standard_id: string;
    rds_type: string;
    upload_on: string;
    download_url: string;
    report_file: string | Blob;
}
