import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Token } from './types';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express'; // Import the Request type from express

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

    @UseGuards(AuthGuard('jwt'))
    @Post('/signout')
    @HttpCode(HttpStatus.OK)
    signout(@Req() req: Request) {
        const user = req.user 
        this.authService.signout(user['id']);
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('/refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(): void {
        this.authService.refreshTokens();
    }
}
