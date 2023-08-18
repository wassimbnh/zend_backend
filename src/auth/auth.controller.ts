import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Token } from './types';

@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService) {}

    @Post('/signup') 
    signup(@Body() dto: AuthDto) : Promise<Token>{
        return this.authService.signup(dto);
    }

    @Post('/signin')
    signin(@Body() dto: AuthDto) : Promise<Token>{
       return this.authService.signin(dto);
    }

    @Post('/signout')
    signout() {
        this.authService.signout();
    }

    @Post('/refresh')
    refreshTokens() {
        this.authService.refreshTokens();
    }
}


