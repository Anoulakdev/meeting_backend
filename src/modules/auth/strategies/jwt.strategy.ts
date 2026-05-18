import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const cookieExtractor = (req: Request) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['token'];
      }
      return token;
    };

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { sub: number }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        username: true,
        employeeId: true,
        roleId: true,
        status: true,
        employee: {
          include: {
            department: {
              select: {
                id: true,
                department_name: true,
              },
            },
            division: {
              select: {
                id: true,
                division_name: true,
                branch_id: true,
              },
            },
            office: {
              select: {
                id: true,
                office_name: true,
              },
            },
            unit: {
              select: {
                id: true,
                unit_name: true,
              },
            },
            position: {
              select: {
                id: true,
                pos_name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
