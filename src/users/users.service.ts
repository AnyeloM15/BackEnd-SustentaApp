import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UpdatePenaltyDto} from './dto/index';
import { WorkShift } from './entities/work-shift.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(WorkShift)
    private readonly workShiftRepository: Repository<WorkShift>,
  ) {}

  // Usuario nuevo
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, email, fullName } = createUserDto;

    // Validar formato del correo
    const matriculaMatch = email.match(/^0(\d{8})@.+$/);
    if (!matriculaMatch) {
      throw new BadRequestException(
        'El correo debe iniciar con "0" seguido de 8 números.',
      );
    }
    const matricula = `0${matriculaMatch[1]}`;
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password,10);
    const shift = await this.workShiftRepository.findOne({ where: { id: 1 } });
    if (!shift) {
      throw new NotFoundException('La jornada de 16 horas no está configurada.');
    }

    // Crear el nuevo usuario
    const newUser = this.userRepository.create({
      matricula,
      password: hashedPassword,
      email,
      fullName,
      role: 'user',
      isPenalized: false,
      shift: shift,
      owed_hours: shift.requiredHours,
    });
    // 
    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
        throw new BadRequestException('La matrícula ya está registrada.');
    }
  }

  // Buscar usuario por su matrícula
  async findOne(matricula: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { matricula } });
  }
  
  // Actualizar penalización (admin)

  //TODO solo el admin puede modificar el estado de penalización de un usuario 
  //!IMPORTANTE
  async updatePenalized(matricula: string, updatePenaltyDto: UpdatePenaltyDto): Promise<User> {
    const { isPenalized } = updatePenaltyDto;
    
    // Buscar el usuario en la base de datos
    const user = await this.userRepository.findOne({ where: { matricula } });
    if (!user) {
      throw new NotFoundException('La matrícula no coincide con ningún registro.');
    }
  
    user.isPenalized = isPenalized;
  
    if (isPenalized) {
      // Buscar el turno de penalización (id = 3)
      const penalizedShift = await this.workShiftRepository.findOne({ where: { id: 3 } });
      if (!penalizedShift) {
        throw new NotFoundException('La jornada de penalización no está configurada.');
      }
  
      // Asignar la jornada de penalización y horas adeudadas
      user.shift = penalizedShift;
      user.owed_hours = penalizedShift.requiredHours;
    } else {
      // Si se elimina la penalización, se borra el turno y horas adeudadas;
      const defaultshift = await this.workShiftRepository.findOne({ where: { id: 1 } });
      if (!defaultshift) {
        throw new NotFoundException('La jornada de 16 horas no está configurada.');
      }
      user.shift = defaultshift;
      user.owed_hours = defaultshift.requiredHours;
    }
  
    return this.userRepository.save(user);
  }
  }

