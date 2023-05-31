import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { excludedFields } from "@wiredcraft/utils/comm.util";
@Injectable()
export class RequestStripPipe implements PipeTransform {
  private readonly excludedFields: string[] = ["id", "createAt", "updateAt"];

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata?.metatype?.name === "UserDto") {
      return excludedFields(value, this.excludedFields);
    }
    return value;
  }
}
