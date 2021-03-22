import { KeyType } from 'ioredis';

// fix redis typing
// add WITHCOORD, WITHDIST
export type RedisFixGeoRadiusByMember = (
  key: KeyType,
  member: string,
  radius: number,
  unit: 'm' | 'km' | 'ft' | 'mi',
  count: 'COUNT',
  countValue: number,
  withcoord?: 'WITHCOORD',
  withdist?: 'WITHDIST',
) => Promise<string[]>;
