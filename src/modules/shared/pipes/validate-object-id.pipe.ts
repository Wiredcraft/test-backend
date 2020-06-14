import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";


@Injectable()
export class ValidateObjectIdPipe implements PipeTransform {

	public transform( value: string, metadata: ArgumentMetadata ): string {
		if ( Types.ObjectId.isValid( value ) ) {
			return value;
		}
		throw new BadRequestException( "Invalid ID" );
	}

}
