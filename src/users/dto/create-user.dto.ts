import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    readonly id: String;

    @IsNotEmpty()
    readonly name: String;

    @IsNotEmpty()
    readonly dob: Date;

    @IsNotEmpty()
    readonly address: String;

    readonly description: String;
}