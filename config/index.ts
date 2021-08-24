/**
 * MYSQL数据库信息
 */
const MYSQL: any = {
    host: '127.0.0.1',
    username: 'root',
    password: 'root',
    port: 3306,
    database: 'db_test',
    define: {
        charset: 'utf8mb4',
        freezeTableName: true,
        dialectOptions: {
            collate: 'utf8mb4_general_ci'
        },
        updatedAt: false
    },
    dialect: 'mysql',
    timezone: '+08:00',
    pool: {
        min: 0,
        max: 20,
        idle: 10000,
        acquire: 60000
    }
};


/**
 * REDIS数据库以及key定义
 */
const REDIS: any = {
    host: '127.0.0.1',
    port: 6379,
    password: 'test123',
    db: 14,
    keys: {
        userFollower: 'user:follower:', // 用户粉丝列表，key是用户id，value是此用户的所有粉丝的用户id
        followUser: 'follow:user:'       // 用户关注者列表，key是用户id，value是此用户所有关注者的用户id
    }
}


export { MYSQL, REDIS }

