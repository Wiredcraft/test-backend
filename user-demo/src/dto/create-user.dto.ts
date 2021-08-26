
import { ApiProperty } from '@nestjs/swagger';

// TODO: use 'class-validator' Lib to validate type
export class CreateUserDto{
    @ApiProperty({
        description: 'user ID'
    })
    id : number;
    
    @ApiProperty({
        description: 'user name'
    })
    name: string;

    @ApiProperty({
        description: 'date of birth'
    })
    @ApiProperty()
    dob: string;

    @ApiProperty({
        description: 'user address'
    })
    address: string;

    @ApiProperty({
        description: 'user description'
    })
    description:string;

    @ApiProperty({
         description: 'user description'
    })
    createdAt: string;
}