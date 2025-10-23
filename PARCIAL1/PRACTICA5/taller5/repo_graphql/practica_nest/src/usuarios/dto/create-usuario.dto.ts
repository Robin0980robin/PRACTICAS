import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateUsuarioDto {
 @IsNotEmpty()
 @IsString()
 nombre: string;
 @IsEmail()
 email: string;
}