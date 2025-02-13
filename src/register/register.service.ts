import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Register } from './entities/register.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

interface UserHoursSummary {
  totalHours: number;
  owedHours: number;
  records: Register[];
}

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(Register)
    private readonly registerRepository: Repository<Register>,
    private readonly jwtService: JwtService,
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,

  ) {}

  // Generar un QR Token para el usuario
  async generateQrToken(userId: string): Promise<string> {
    const payload = { userId, generateAt: new Date() };
    return this.jwtService.sign(payload, { expiresIn: '5m' });
  }

  // Validar el token y comenzar horas
  async startHoursToken(token: string): Promise<Register> {
    try {
      console.log('Token recibido:', token);  // Log del token recibido
      const payload = this.jwtService.verify(token);
      console.log('Payload decodificado:', payload);

      if (!payload.userId) {
        throw new BadRequestException('El token no contiene un userId válido.');
      }
      return this.startHours(payload.userId);
    } catch (error) {
      console.error('Error al procesar el token:', error.message);
      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }

  // Iniciar una jornada de trabajo
  async startHours(userId: string): Promise<Register> {
    const activeRegister = await this.registerRepository.findOne({
      where: { user: { id: userId }, completed: false },
    });

    if (activeRegister) {
      throw new BadRequestException('Ya tienes una jornada activa.');
    }
    
    

    const newRegister = this.registerRepository.create({
      user: { id: userId },
      startDateTime: new Date(),
    });

    return this.registerRepository.save(newRegister);
  }

  // // Validar token y finalizar horas
  // async endHoursToken(token: string): Promise<Register> {
  //   try {
  //     const payload = this.jwtService.verify(token);

  //     if (!payload.userId) {
  //       throw new BadRequestException('El token no contiene un userId válido.');
  //     }

  //     return this.endHours(payload.userId);
  //   } catch (error) {
  //     console.error('Error al procesar el token:', error.message);
  //     throw new UnauthorizedException('Token inválido o expirado.');
  //   }
  // }

  // Finalizar la jornada de trabajo
  async endHours(userId: string): Promise<Register> {
    const activeRegister = await this.registerRepository.findOne({
      where: { user: { id: userId }, completed: false },
      relations: ['user'],
    });

    if (!activeRegister) {
      throw new NotFoundException('No tienes una jornada activa.');
    }

    activeRegister.endDateTime = new Date();
    activeRegister.completed = true;
    activeRegister.hours = this.calculateHours(activeRegister.startDateTime, activeRegister.endDateTime);

    const user = activeRegister.user;
    user.owed_hours = Math.max(user.owed_hours - activeRegister.hours, 0);

    await this.userRepository.save(user);
    return this.registerRepository.save(activeRegister);
  }

  // Calcular las horas de trabajo
  private calculateHours(startDateTime: Date, endDateTime: Date): number {
    const milliseconds = endDateTime.getTime() - startDateTime.getTime();
    return parseFloat((milliseconds / 1000 / 60 / 60).toFixed(2));  // Conversión a horas con dos decimales
  }

  // Consultar el resumen de horas de trabajo por usuario
  async getHoursByUser(userId: string): Promise<UserHoursSummary> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("Usuario no encontrado");

    const registers = await this.registerRepository.find({
      where: { user: { id: userId }, completed: true },
      order: { startDateTime: 'DESC' },
    });

    if (!registers.length) {
      throw new NotFoundException('No se encontraron jornadas de trabajo.');
    }

    const totalHours = registers.reduce((sum, register) => sum + (+register.hours), 0);
    console.log('Total de horas trabajadas:', totalHours) // Log del total de horas trabajadas
    return {
    
      totalHours: parseFloat(totalHours.toFixed(2)),
      owedHours: user.owed_hours,
      records: registers,
    };
  }


}
