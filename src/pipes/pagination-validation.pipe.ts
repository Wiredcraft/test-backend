import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PaginationQueryDto } from "@wiredcraft/app.dto";
import paginationConfig from "@wiredcraft/config/pagniation.config";

@Injectable()
export class PaginationValidationPipe implements PipeTransform {
  private readonly logger = new Logger(PaginationValidationPipe.name);
  transform(value: PaginationQueryDto): any {
    const { page, perPage } = value;

    // Check if page and perPage are provided, if not then set to default
    if (!page || !perPage) {
      value.page = page || paginationConfig.defaultPage;
      value.perPage = perPage || paginationConfig.defaultPerPage;
      this.logger.log("pagniation info missing, setting with default value");
    }

    // Validate page and perPage values
    if (
      isNaN(value.page) ||
      isNaN(value.perPage) ||
      value.page < 1 ||
      value.perPage < 1
    ) {
      throw new BadRequestException("Invalid pagination parameters");
    }
    if (value.perPage > paginationConfig.maxPerPage) {
      throw new BadRequestException(
        `perPage exceeded, maxPerPage ${paginationConfig.maxPerPage}`
      );
    }

    return value;
  }
}
