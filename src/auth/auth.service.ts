import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly UsersService: UsersService,
    private readonly jwtService: JwtService,
  ){}
  // Comprobar si el usuario existe y si la contraseña es correcta o, las credenciales son incorrectas
  //(Se tiene que loguear con la matricula)
  async login(loginDto: LoginDto) {
    const { matricula, password } = loginDto;
    const user = await this.UsersService.findOne(matricula);
  
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
  
    const passwordMatch = await bcrypt.compare(password, user.password);
  
    if (!passwordMatch) {
      console.log('Contraseña incorrecta');
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    // Generar token de acceso
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  
}
