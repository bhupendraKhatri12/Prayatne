import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';
import { UserInfo } from './interfaces/userInfo.interface';
import {
  ErrorMessageResponse,
  SuccessMessageResponse,
} from '../utils/response';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SuccessMessageResponse<UserInfo> | ErrorMessageResponse<void>> {
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


}
