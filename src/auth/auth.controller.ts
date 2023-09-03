import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Token } from './types';
import { Request } from 'express'; // Import the Request type from express
import { AtGuard, RtGuard } from 'src/common/guards';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup') 
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() dto: AuthDto): Promise<Token> {
        return this.authService.signup(dto);
    }

    @Post('/signin')
    @HttpCode(HttpStatus.OK)
    signin(@Body() dto: AuthDto): Promise<Token> {
       return this.authService.signin(dto);
    }

    @UseGuards(AtGuard)
    @Post('/signout')
    @HttpCode(HttpStatus.OK)
    signout(@Req() req: Request) {
        const user = req.user 
       return this.authService.signout(user['sub']);
    }

    @UseGuards(RtGuard)
    @Post('/refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@Req() req: Request) {
        const user = req.user 
       return this.authService.refreshTokens(user['sub'], user['refreshToken']);
    }
}
