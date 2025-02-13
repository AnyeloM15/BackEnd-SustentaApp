import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { register } from 'module';
import { Register } from './entities/register.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Register, User]), 
    UsersModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecreto', 
      signOptions: { expiresIn: '5m' },
    }),
  ],

  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
