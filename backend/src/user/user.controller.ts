import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags("Users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(ThrottlerGuard)
 async findAll() {
    return await this.userService.findAll();
  }

  @Get(':email')
  @UseGuards(ThrottlerGuard)
  async findOne(@Param('email') email: string) {
    return await this.userService.findOne(email);
  }



  @Delete(':id')
  @UseGuards(ThrottlerGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
