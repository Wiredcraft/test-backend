import { AccessInterface } from '../models/access';

export default interface ModelBuilderInterface<SourceType, TargetType> {
  storedModels: { [key: string]: TargetType };

  acl: { [key: string]: AccessInterface };

  build: (input: SourceType) => TargetType;

  getModel: (modelName: string) => Promise<TargetType>;
}
