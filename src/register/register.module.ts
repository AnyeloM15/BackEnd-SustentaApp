import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { register } from 'module';
import { Register } from './entities/register.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Register]), 
JwtModule.register({
  secret: process.env.JWT_SECRET || 'secret' ,
  signOptions: { expiresIn: '5m' },
})],

  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
