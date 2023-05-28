import { Rule, RuleType } from '@midwayjs/decorator';
import { CreateApiPropertyDoc } from '@midwayjs/swagger';

export class LoginDTO {
  @CreateApiPropertyDoc('username')
  @Rule(RuleType.string().required().min(5).max(190))
  username: string;

  @CreateApiPropertyDoc('password')
  @Rule(RuleType.string().required().min(5).max(60))
  password: string;
}
