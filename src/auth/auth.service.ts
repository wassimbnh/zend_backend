import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt  from 'bcryptjs';
import { Token } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
       private jwtService: JwtService ) {}

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    async getTokens(userId: number, email: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email: email,
            },{
                secret: 'at-secret',
                expiresIn: 60*20,
            }),
            this.jwtService.signAsync({
                sub: userId,
                email: email,
            },{
                secret: 'rt-secret',
                expiresIn: 60 * 60 *24 * 7,
            })
        ]);
        return {
            accessToken:at, 
                refreshToken: rt
            }; 
        
    }
    
    async signup(dto: AuthDto): Promise<Token> {
        const hash = await this.hashData(dto.password);

        const newUser =await  this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
                        }
        });

        const tokens = await this.getTokens(newUser.id, newUser.email);

        await this.updateRtHash(newUser.id, tokens.refreshToken);
        return tokens;
    }

    async updateRtHash(userId: number, rt: string) {
        const hash = await this.hashData(rt);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                hashedRt: hash,
            },
        });
    }

    async signin(dto: AuthDto): Promise<Token> {

        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        })

        if(!user) {
            throw new ForbiddenException('Invalid credentials');
        }

        const passwordMatches = await bcrypt.compare(dto.password, user.hash);
        if(!passwordMatches) {
            throw new ForbiddenException('Invalid credentials');
        }

        const tokens = await this.getTokens(user.id, user.email);

        await this.updateRtHash(user.id, tokens.refreshToken);
        return tokens;
    }
    signout() {

    }
    refreshTokens() {

    }
}
