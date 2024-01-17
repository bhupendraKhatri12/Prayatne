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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(ThrottlerGuard)
 async findAll():any {
    return await this.userService.findAll();
  }

  @Get(':email')
  @UseGuards(ThrottlerGuard)
  asyncfindOne(@Param('email') email: string) {
    return await this.userService.findOne(email);
  }

  @Patch(':id')
  @UseGuards(ThrottlerGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(ThrottlerGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
