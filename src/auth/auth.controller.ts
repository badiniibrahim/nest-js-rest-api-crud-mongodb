import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { SignUpDto } from 'src/dto/user/signUp.dto';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/dto/user/signIn.dto';
import { ResetPasswordDto } from 'src/dto/user/resetPassword.dto';
import { ResetPasswordConfirmationDto } from 'src/dto/user/resetPasswordConfirmation.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteAccountDto } from 'src/dto/user/deleteAccount.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags('Authentication')
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
