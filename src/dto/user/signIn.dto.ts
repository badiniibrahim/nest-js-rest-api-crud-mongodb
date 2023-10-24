import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
