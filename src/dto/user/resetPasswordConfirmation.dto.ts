import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordConfirmationDto {
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
