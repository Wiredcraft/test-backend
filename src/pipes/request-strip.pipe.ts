import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import UserDto from "@wiredcraft/users/dto/user.dto";

@Injectable()
export class RequestStripPipe implements PipeTransform {
  private readonly excludedFields: string[] = ["id", "createAt", "updateAt"];

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata?.metatype?.name === "UserDto") {
      return this.excludeFields(value);
    }
    return value;
  }
  private excludeFields(value: UserDto) {
    if (null === value || typeof value !== "object") return value;
    for (const key of this.excludedFields) {
      delete value[key];
    }
    return value;
  }
}
