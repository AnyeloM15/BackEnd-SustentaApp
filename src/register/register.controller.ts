import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { RegisterService } from './register.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Register } from './entities/register.entity';



interface UserHoursSummary {
  totalHours: number;
  records: Register[];
}
@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @UseGuards(JwtAuthGuard)
  @Post('generate-qrcode')
  async generateQr(@Request()req){
    return this.registerService.generateQrToken(req.user.userId);
  }

  @Post('start-hours')
  async startHours(@Body('token') token: string){
    return this.registerService.startHoursToken(token);
  }
  @UseGuards(JwtAuthGuard)
  @Post('end')
  async endRegistro(@Request() req) {
    return this.registerService.endHours(req.user.userId);
  }

  // Obtener el resumen de horas trabajadas por usuario
  @UseGuards(JwtAuthGuard)
  @Get('hours')
  async getHoursByUser(@Request() req): Promise<UserHoursSummary> {
    return this.registerService.getHoursByUser(req.user.userId);
  }
}

