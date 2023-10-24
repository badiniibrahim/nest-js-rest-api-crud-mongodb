import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from 'src/dto/user/signUp.dto';
import * as speakeasy from 'speakeasy';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from 'src/dto/user/signIn.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from '../dto/user/resetPassword.dto';
import { MailerService } from '../mailer/mailer.service';
import { ResetPasswordConfirmationDto } from 'src/dto/user/resetPasswordConfirmation.dto';
import { DeleteAccountDto } from 'src/dto/user/deleteAccount.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    const { email, username, password } = signUpDto;
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user) throw new ConflictException('User already exists');

    const hash = await bcrypt.hash(password, 10);
    await this.prismaService.user.create({
      data: { email, username, password: hash },
    });
    // ** send confirmation of inscription
    await this.mailerService.sendSingUpConfirmation(email);
    return { data: 'User successfully created' };
  }

  async signIn(signInpDto: SignInDto) {
    const { email, password } = signInpDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Password does not match');

    const payload = { sub: user.userId, email: user.email };
    const token = this.jwtService.sign(payload, {
      expiresIn: '2h',
      secret: this.configService.get('SECRET_KEY'),
    });

    return {
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    };
  }

  async resetPasswordOnDemand(resetPasswordDto: ResetPasswordDto) {
    const { email } = resetPasswordDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException('User not found');

    // ** Generate OTP code
    const code = speakeasy.totp({
      secret: this.configService.get('OTP_CODE'),
      digits: 5,
      step: 60 * 15,
      encoding: 'base32',
    });
    // ** Envoyer un url du front-end
    const url = 'http://localhost:3000/auth/reset-password-confirmation';
    await this.mailerService.resetPassword(email, url, code);
    return { data: 'Reset password email has been sent' };
  }

  async resetPasswordConfirmation(
    resetPasswordConfirmationDto: ResetPasswordConfirmationDto,
  ) {
    const { email, code, password } = resetPasswordConfirmationDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    // ** Verify is user exists
    if (!user) throw new NotFoundException('User not found');
    // ** Verify code OTP
    const match = speakeasy.totp.verify({
      secret: this.configService.get('OTP_CODE'),
      token: code,
      digits: 5,
      step: 60 * 15,
      encoding: 'base32',
    });
    if (!match) throw new UnauthorizedException('Invalid/expired token');
    // ** hash user password
    const hash = await bcrypt.hash(password, 10);
    // ** Update password
    await this.prismaService.user.update({
      where: { email },
      data: { password: hash },
    });
    return { data: 'Password updated' };
  }

  async deleteAccount(userId: string, deleteAccountDto: DeleteAccountDto) {
    const { password } = deleteAccountDto;
    const user = await this.prismaService.user.findUnique({
      where: { userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Password does not match');

    await this.prismaService.user.delete({ where: { userId } });
    return { data: 'User successfully deleted' };
  }
}
