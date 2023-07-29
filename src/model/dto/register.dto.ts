import { IsEmail, IsNotEmpty, MinLength, IsMobilePhone } from "class-validator";

export class RegisterDto{
     @IsNotEmpty()
    name:string;
    lastName:String;
    @IsEmail()
    @IsNotEmpty()
    email:string;
    @IsNotEmpty()
    @MinLength(6)
    password:string;
    country:number;
    @IsMobilePhone()
    mobile:string;
} 