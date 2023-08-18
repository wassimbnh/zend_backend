import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class AuthDto {

    @ApiProperty({
        description:"Email",
        example:"wassim.benhedia@esprit.tn"
    })
    @IsNotEmpty()
    @IsString()
    email: string;
    
    @ApiProperty({
        description:"Password",
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}