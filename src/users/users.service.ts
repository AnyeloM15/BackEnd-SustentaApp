import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

    // Crear el nuevo usuario
    const newUser = this.userRepository.create({
      matricula,
      password: hashedPassword,
      email,
      fullName,
      role: 'user',
      isPenalized: false,
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
  async updatePenalized(
    matricula: string,
    isPenalized: boolean,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { matricula } });

    if (!user) {
      throw new NotFoundException(
        'La matrícula no coincide con ningún registro.',
      );
    }

    user.isPenalized = isPenalized;
    return this.userRepository.save(user);
  }
}
