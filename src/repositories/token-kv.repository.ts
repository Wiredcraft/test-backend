import {inject} from '@loopback/core';
import {DefaultKeyValueRepository} from '@loopback/repository';
import {RedisDataSource} from '../datasources';
import {TokenKv} from '../models';

export class TokenKvRepository extends DefaultKeyValueRepository<
  TokenKv
> {
  constructor(
    @inject('datasources.redis') dataSource: RedisDataSource,
  ) {
    super(TokenKv, dataSource);
  }
}
