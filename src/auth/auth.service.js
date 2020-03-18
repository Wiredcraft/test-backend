import { Injectable, Dependencies } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import crypto from 'crypto';
import moment from 'moment';

@Injectable()
@Dependencies(ConfigService)
export class AuthService {
  constructor(configService) {
    this.configService = configService;
  }

  async authIdentity(appId, timestamp, signature) {
    if (appId !== this.configService.auth.appId) {
      return null;
    }

    if (
      signature !==
      crypto
        .createHmac(
          this.configService.auth.hmacAlgorithm,
          this.configService.auth.appSecret,
        )
        .update(timestamp)
        .digest('hex')
    ) {
      return null;
    }

    if (
      moment(timestamp).isBefore(
        moment().subtract(
          this.configService.auth.timestampToleranceInMs,
          'milliseconds',
        ),
      )
    ) {
      return null;
    }

    if (
      moment(timestamp).isAfter(
        moment().add(
          this.configService.auth.timestampToleranceInMs,
          'milliseconds',
        ),
      )
    ) {
      return null;
    }

    return { id: appId };
  }
}
