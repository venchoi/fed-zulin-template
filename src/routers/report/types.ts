export default interface IRecordType {
    id: string; // 报表id
    name: string; // 报表名称
    desc: string; // 报表说明
    upload_by: string; // 上传人
    standard_id: string; // 自定义报表id
    rds_type: string; // 报表类型 rds_dm: DM数据源 | rds_tenant: 租户数据源
    upload_on: string; // 上传时间
    download_url: string; // 下载列表
    report_file: string | Blob; // 报表文件
}
