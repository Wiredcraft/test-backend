// Redis Keys
// tb@ + key
// tb@xxxx:xxxx:xxxx

export default class RedisKeys {
  // static prefix = 'tb@';

  static UserGeoRange() {
    return `User:UserGeoRange`;
  }

  static UserCache(userId: string) {
    return `User:UserCache:${userId}`;
  }

  static UserFollow(userId: string) {
    return `User:UserFollow:{${userId}`;
  }

  static UserFans(userId: string) {
    return `User:UserFans:${userId}`;
  }
}
