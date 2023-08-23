import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('generate')
  async generateToken(@Req() req, @Res({ passthrough: true }) res: Response) {
    // mocked user from database
    const user = {
      login: 'MockedUuser',
      email: 'mocked.user@gmail.com',
      permission: 'create app'
    };

    const access_token = await this.authService.generateJwtToken(user);
    res.cookie('jwt', access_token, { httpOnly: true });

    return { message: 'success' };
  }

  @Get('validate')
  async validateJwt(@Req() req: Request) {
    try {
      const cookie = req.cookies['jwt'];

      const data = await this.authService.verifyJwtToken(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      return data;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
