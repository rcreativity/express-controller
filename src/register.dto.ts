// dto/register.dto.ts
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from './entity/User.entity';

export class RegisterDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}
