import {Exclude, Expose, Transform} from "class-transformer";
import {ApiModelProperty, ApiModelPropertyOptional} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class User {
    @ApiModelProperty()
    @Transform(v => v.toString(), { toPlainOnly: true })
    _id: string;

    @ApiModelProperty()
    name: string;

    @Exclude()
    password: string;

    @ApiModelPropertyOptional()
    dob: string;

    @ApiModelPropertyOptional()
    address: string;

    @ApiModelPropertyOptional()
    description: string;

    @ApiModelProperty()
    createdAt: number;

    @Exclude()
    __v: number;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}


