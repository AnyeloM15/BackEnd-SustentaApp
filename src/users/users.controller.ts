import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':matricula')
  async findOne(@Param('matricula') matricula: string) {  
    return this.usersService.findOne(matricula);
  }

  @Patch('penalty/:matricula')
  async updatePenalty(
    @Param('matricula') matricula: string,  
    @Body('isPenalized') isPenalized: boolean,
  ) {
    return this.usersService.updatePenalized(matricula, isPenalized);
  }
}
