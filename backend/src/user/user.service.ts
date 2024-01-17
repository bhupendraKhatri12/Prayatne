import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import {  successMessage, errorMessage } from '../utils/response';
import {SuccessMessageResponse,ErrorMessageResponse} from "../utils/response"
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<SuccessMessageResponse<UserEntity>> {
    const newUser = this.userRepository.create(createUserDto);

    return successMessage('Creates a new user', await this.userRepository.save(newUser));
  }

  async findAll(): Promise<SuccessMessageResponse<UserEntity[]>| ErrorMessageResponse> {
    return successMessage('All Users', await this.userRepository.find());
  }

  async findOne(email: string): Promise<SuccessMessageResponse<UserEntity>| ErrorMessageResponse> {
    try {
      const user = await this.userRepository.findOneOrFail({ where: { email: email } });
      return successMessage('User',await this.userRepository.findOneOrFail({ where: { email: email } }));



    } catch (error) {
      throw new errorMessage(`User with Email ${email} not found`, 'user', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<SuccessMessageResponse<UserEntity>> {
    const user = await this.findOne(id);
    this.userRepository.merge(user, updateUserDto);
    return successMessage('User updated', await this.userRepository.save(user));
  }

  async remove(id: number): Promise<SuccessMessageResponse<void>> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return successMessage('User removed', undefined);
  }
}
