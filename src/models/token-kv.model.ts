import { model, Model, property } from '@loopback/repository';

@model()
export class TokenKv extends Model {

  @property({
    type: 'string',
  })
  accessToken: string;

  @property({
    type: 'string',
  })
  refreshToken: string;
  
  constructor(data?: Partial<TokenKv>) {
    super(data);
  }

 
  
}

export interface TokenKvRelations {
  // describe navigational properties here
}

export type TokenKvWithRelations = TokenKv & TokenKvRelations;
