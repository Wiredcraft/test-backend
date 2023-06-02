import { Rule, RuleType } from '@midwayjs/decorator';
import { CreateApiPropertyDoc } from '@midwayjs/swagger';

/**
 * 创建用户参数
 */
export class CreateDTO {
  @CreateApiPropertyDoc("Account number. It's for logging in")
  @Rule(RuleType.string().trim().min(5).max(190).required())
  username: string;

  @CreateApiPropertyDoc('name')
  @Rule(RuleType.string().trim().min(3).max(255).required())
  name: string;

  @CreateApiPropertyDoc('password')
  @Rule(RuleType.string().trim().min(5).max(60).required())
  password: string;

  @CreateApiPropertyDoc('date of birth')
  @Rule(RuleType.string().required())
  dob?: string;

  @CreateApiPropertyDoc('user description')
  @Rule(RuleType.string())
  description?: string;

  @CreateApiPropertyDoc('address')
  @Rule(RuleType.any())
  address?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

/**
 * 更新管理员参数
 */
export class UpdateDTO {
  @CreateApiPropertyDoc('name')
  @Rule(RuleType.string().trim().min(5).max(255))
  name?: string;

  @CreateApiPropertyDoc('date of birth')
  @Rule(RuleType.date())
  dob?: string;

  @CreateApiPropertyDoc('user description')
  @Rule(RuleType.string())
  description?: string;

  @CreateApiPropertyDoc('address')
  @Rule(RuleType.any())
  address?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export class NearByDTO {
  @CreateApiPropertyDoc('distance')
  @Rule(RuleType.number().required())
  distance?: number;
}
