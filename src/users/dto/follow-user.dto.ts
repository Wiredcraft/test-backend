import { IsNotEmpty } from "class-validator";


export class FollowUserDto {
    @IsNotEmpty()
    readonly from: String;

    @IsNotEmpty()
    readonly to: String;
}