import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class RequestStripPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata?.metatype?.name === "UserDto") {
      delete value.id;
      delete value.createAt;
      delete value.updateAt;
    }
    return value;
  }
}
