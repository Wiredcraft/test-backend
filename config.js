let CONSTANT = {
  SECRET_KEY: '3aeb287f-62a9-4b7a-a653-e28289e14438',
  PORT:'3001',
  // fixme 运行前请在下方填写真实的数据库配置
  MYSQL_CONFIG:{
    host : '127.0.0.1',
    port : 3306,
    user : 'root',
    password : '',
    database : 'wired_test_backend',
    dbPrefix: 'wired_test_backend_',
    tableToUpdateStucture: [], //此处填入需要更新表结构的表名
    multi_tenant_mode: false, // 是否启用多租户模式
    // config_center_host: 'http://localhost:3001', // 若启用多租户模式&&改节点是租户节点,此项必填
    // tenant_server_host: 'http://localhost:3001', // 若多租户模式&&该节点是配置中心,此项必填
    //multipleStatements : true   // unsafe
  },
  LOG_PATH: '../log',
  // 业务配置
  BUSINESS_CONFIG: {
    timeZone: -4, // 时区,如西 4 区: -4
  }
};

module.exports = CONSTANT;

