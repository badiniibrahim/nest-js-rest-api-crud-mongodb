import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { SignUpDto } from 'src/dto/user/signUpDto';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/dto/user/signInDto';
import { ResetPasswordDto } from 'src/dto/user/resetPasswordDto';
import { ResetPasswordConfirmationDto } from 'src/dto/user/resetPasswordConfirmationDto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteAccountDto } from 'src/dto/user/deleteAccountDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  signIn(@Body() signInpDto: SignInDto) {
    return this.authService.signIn(signInpDto);
  }

  @Post('reset-password')
  resetPasswordOnDemand(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPasswordOnDemand(resetPasswordDto);
  }

  @Post('reset-password-confirmation')
  resetPasswordOnConfirmation(
    @Body() resetPasswordConfirmationDto: ResetPasswordConfirmationDto,
  ) {
    return this.authService.resetPasswordConfirmation(
      resetPasswordConfirmationDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  deleteAccount(
    @Req() request: Request,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    const userId = request.user['userId'];
    return this.authService.deleteAccount(userId, deleteAccountDto);
  }
}
